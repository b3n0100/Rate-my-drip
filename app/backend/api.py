from flask import Flask, jsonify, request
import joblib
import numpy as np
import pandas as pd
from scipy.sparse import hstack
import re
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer

nltk.download('punkt', quiet=True)
nltk.download('stopwords', quiet=True)
nltk.download('wordnet', quiet=True)
nltk.download('punkt_tab', quiet=True)

app = Flask(__name__)

# Load model files
model = joblib.load('worthiness_regression_model.pkl')
vectorizer = joblib.load('tfidf_vectorizer.pkl')
df = pd.read_csv('Womens Clothing E-Commerce Reviews.csv', encoding='latin1')

stop_words = set(stopwords.words('english'))
lemmatizer = WordNetLemmatizer()

def preprocess_text(text):
    if pd.isna(text): return ""
    text = re.sub(r'<.*?>', '', text).lower()
    text = re.sub(r'[^a-z\s]', '', text)
    tokens = word_tokenize(text)
    tokens = [lemmatizer.lemmatize(t) for t in tokens if t not in stop_words and len(t) > 2]
    return " ".join(tokens)

@app.route('/scan', methods=['GET'])
def scan():
    user_age = int(request.args.get('age'))
    clothing_id = int(request.args.get('clothing_id'))

    item_reviews = df[df['Clothing ID'] == clothing_id]
    if item_reviews.empty:
        return jsonify({'error': 'Product not found'}), 404

    age_margin = user_age * 0.20
    neighbors = item_reviews[
        (item_reviews['Age'] >= user_age - age_margin) &
        (item_reviews['Age'] <= user_age + age_margin)
    ]
    if len(neighbors) < 2:
        neighbors = item_reviews  # fallback to all ages

    combined_text = " ".join(neighbors['Review Text'].dropna().apply(preprocess_text))
    avg_rec = neighbors['Recommended IND'].mean()

    text_vec = vectorizer.transform([combined_text])
    num_vec = np.array([[user_age, avg_rec]])
    pred_rating = float(np.clip(model.predict(hstack([text_vec, num_vec]))[0], 1.0, 5.0))

    score = ((pred_rating - 1) / 4) * 100
    verdict = "buy" if pred_rating >= 4.0 and avg_rec >= 0.80 else "dont_buy"

    return jsonify({
        'clothing_id': clothing_id,
        'predicted_rating': round(pred_rating, 2),
        'worthiness_score': round(score, 1),
        'verdict': verdict,
        'reviews_analyzed': len(neighbors)
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

    return jsonify(top_items.to_dict(orient='records'))

if __name__ == '__main__':
    app.run(debug=True)