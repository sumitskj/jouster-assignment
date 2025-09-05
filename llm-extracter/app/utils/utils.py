import re
from collections import Counter
from typing import List


STOPWORDS = set(
    [
        "the",
        "a",
        "an",
        "and",
        "or",
        "but",
        "if",
        "in",
        "on",
        "at",
        "to",
        "for",
        "of",
        "is",
        "are",
        "was",
        "were",
        "it",
        "this",
        "that",
        "with",
        "as",
        "by",
        "from",
        "be",
        "has",
        "have",
        "had",
        "not",
        "we",
        "you",
        "they",
        "he",
        "she",
        "them",
        "his",
        "her",
        "their",
        "our",
        "us",
        "i",
        "me",
        "my",
        "your",
        "yours",
    ]
)


def extract_keywords(text: str, top_k: int = 3) -> List[str]:
    words = re.findall(r"[A-Za-z]+", text.lower())
    filtered = [w for w in words if w not in STOPWORDS and len(w) > 2]
    counts = Counter(filtered)
    most_common = [w for w, _ in counts.most_common(top_k)]
    return most_common


