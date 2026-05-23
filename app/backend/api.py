from flask import Flask, jsonify, request
from flask_cors import CORS
import joblib
import numpy as np
import pandas as pd
from scipy.sparse import hstack
import re
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer
from keyword_extractor import extract_keywords

nltk.download('punkt', quiet=True)
nltk.download('stopwords', quiet=True)
nltk.download('wordnet', quiet=True)
nltk.download('punkt_tab', quiet=True)

app = Flask(__name__)
CORS(app)

# Load model files
model = joblib.load('worthiness_regression_model.pkl')
vectorizer = joblib.load('tfidf_vectorizer.pkl')
cat_age_model = joblib.load('cat_age_model.pkl')
age_encoder = joblib.load('age_encoder.pkl')
peer_lookup = pd.read_csv('peer_sentiment_lookup.csv')

df = pd.read_csv(
    'Womens Clothing E-Commerce Reviews.csv',
    encoding='latin1'
)

stop_words = set(stopwords.words('english'))
lemmatizer = WordNetLemmatizer()


def preprocess_text(text):

    if pd.isna(text):
        return ""

    text = re.sub(r'<.*?>', '', text).lower()
    text = re.sub(r'[^a-z\s]', '', text)

    tokens = word_tokenize(text)

    tokens = [
        lemmatizer.lemmatize(t)
        for t in tokens
        if t not in stop_words and len(t) > 2
    ]

    return " ".join(tokens)


def get_age_group(age):
    if age <= 29:
        return 'Young Adult'
    elif age <= 49:
        return 'Middle Age'
    return 'Senior'


def predict_demographic_rating(clothing_id, user_age):
    age_group = get_age_group(user_age)
    row = peer_lookup[
        (peer_lookup['Clothing ID'] == clothing_id) &
        (peer_lookup['Age Group'] == age_group)
    ]

    if row.empty:
        # fallback: global average for this product
        global_rows = peer_lookup[peer_lookup['Clothing ID'] == clothing_id]
        if global_rows.empty:
            return None
        rec = global_rows['Recommended IND'].mean()
        review_text = " ".join(global_rows['clean_review'].dropna())
        age_group_fallback = global_rows['Age Group'].mode()[0]
        age_enc = age_encoder.transform(pd.DataFrame({'Age Group': [age_group_fallback]}))
    else:
        rec = float(row['Recommended IND'].iloc[0])
        review_text = str(row['clean_review'].iloc[0])
        age_enc = age_encoder.transform(pd.DataFrame({'Age Group': [age_group]}))

    text_vec = vectorizer.transform([review_text])
    num_vec = np.array([[rec]])
    features = hstack([text_vec, num_vec, age_enc])
    return int(cat_age_model.predict(features)[0])


@app.route('/scan', methods=['GET'])
def scan():

    user_age = int(request.args.get('age'))
    clothing_id = int(request.args.get('clothing_id'))

    # get product reviews
    item_reviews = df[df['Clothing ID'] == clothing_id]

    if item_reviews.empty:
        return jsonify({
            'error': 'Product not found'
        }), 404

    # age filtering
    age_margin = user_age * 0.20

    neighbors = item_reviews[
        (item_reviews['Age'] >= user_age - age_margin) &
        (item_reviews['Age'] <= user_age + age_margin)
    ]

    # fallback if too few reviews
    if len(neighbors) < 2:
        neighbors = item_reviews

    # preprocess all review text
    combined_text = " ".join(
        neighbors['Review Text']
        .dropna()
        .apply(preprocess_text)
    )

    # recommendation average
    avg_rec = neighbors['Recommended IND'].mean()

    # TF-IDF + model prediction
    text_vec = vectorizer.transform([combined_text])

    num_vec = np.array([
        [user_age, avg_rec]
    ])

    pred_rating = float(
        np.clip(
            model.predict(
                hstack([text_vec, num_vec])
            )[0],
            1.0,
            5.0
        )
    )

    # worthiness score
    score = ((pred_rating - 1) / 4) * 100

    verdict = (
        "buy"
        if pred_rating >= 4.0 and avg_rec >= 0.80
        else "dont_buy"
    )

    # positive reviews
    positive_reviews = neighbors[
        neighbors['Rating'] >= 4
    ]['Review Text'].dropna().apply(preprocess_text)

    # negative reviews
    negative_reviews = neighbors[
        neighbors['Rating'] <= 2
    ]['Review Text'].dropna().apply(preprocess_text)

    # TF-IDF keyword extraction
    positive_keywords = extract_keywords(
        positive_reviews
    )

    negative_keywords = extract_keywords(
        negative_reviews
    )

    # optional summary
    summary = ""

    if len(positive_keywords) >= 3:
        summary = (
            f"People your age love the "
            f"{positive_keywords[0]}, "
            f"{positive_keywords[1]}, and "
            f"{positive_keywords[2]}."
        )

    demographic_rating = predict_demographic_rating(clothing_id, user_age)

    return jsonify({

        'clothing_id': clothing_id,

        'predicted_rating': round(
            pred_rating,
            2
        ),

        'demographic_rating': demographic_rating,

        'worthiness_score': round(
            score,
            1
        ),

        'verdict': verdict,

        'reviews_analyzed': len(neighbors),

        'positive_keywords': positive_keywords,

        'negative_keywords': negative_keywords,

        'summary': summary
    })


@app.route('/recommendations', methods=['GET'])
def recommendations():

    user_age = int(request.args.get('age'))

    age_margin = user_age * 0.20

    neighbors = df[
        (df['Age'] >= user_age - age_margin) &
        (df['Age'] <= user_age + age_margin)
    ]

    top_items = (
        neighbors.groupby('Clothing ID')['Recommended IND']
        .mean()
        .sort_values(ascending=False)
        .head(10)
        .reset_index()
    )

    return jsonify(
        top_items.to_dict(orient='records')
    )


if __name__ == '__main__':
    app.run(debug=True)