from sklearn.feature_extraction.text import TfidfVectorizer
import numpy as np


def extract_keywords(reviews, top_n=5):

    # remove empty reviews
    reviews = [r for r in reviews if isinstance(r, str)]

    if len(reviews) == 0:
        return []

    # TF-IDF
    vectorizer = TfidfVectorizer(
        stop_words="english",
        max_features=50,
        ngram_range=(1, 2),
        min_df=1
    )

    X = vectorizer.fit_transform(reviews)

    # average TF-IDF scores
    scores = np.asarray(X.mean(axis=0)).flatten()

    # get words/phrases
    words = vectorizer.get_feature_names_out()

    # rank highest scoring phrases
    ranked = sorted(
        zip(words, scores),
        key=lambda x: x[1],
        reverse=True
    )

    # return top phrases only
    keywords = [word for word, score in ranked[:top_n]]

    return keywords