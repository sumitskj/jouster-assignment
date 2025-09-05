import os
import re
import json
from typing import Dict, Any

try:
    from openai import OpenAI
except Exception:
    OpenAI = None  # type: ignore

from app.config.properties import OPENAI_KEY


async def call_llm_for_summary_and_metadata(text: str) -> Dict[str, Any]:
    if not OPENAI_KEY or OpenAI is None:
        raise RuntimeError("LLM client not configured")
    client = OpenAI(api_key=OPENAI_KEY)
    prompt = (
        "You are a helpful assistant. Summarize the text in 1-2 sentences, "
        "then extract: title (if present), 3 key topics, and sentiment (positive/neutral/negative). "
        "Respond strictly as JSON with keys: summary, title, topics, sentiment."
    )
    message = f"Text:\n{text}\n"
    try:
        chat = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": prompt},
                {"role": "user", "content": message},
            ],
        )
        content = chat.choices[0].message.content if chat.choices else "{}"
    except Exception as exc:
        raise RuntimeError(exc.message)

    try:
        data = json.loads(content)
    except Exception:
        match = re.search(r"\{[\s\S]*\}", content)
        if not match:
            raise RuntimeError("LLM returned unparsable response: " + content)
        data = json.loads(match.group(0))

    data.setdefault("summary", "")
    data.setdefault("title", None)
    topics = data.get("topics") or []
    if isinstance(topics, str):
        topics = [t.strip() for t in topics.split(",") if t.strip()]
    data["topics"] = topics[:3]
    sentiment = (data.get("sentiment") or "neutral").lower()
    if sentiment not in {"positive", "neutral", "negative"}:
        sentiment = "neutral"
    data["sentiment"] = sentiment
    return data


