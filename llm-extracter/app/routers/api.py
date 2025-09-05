from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, HTTPException, Query

from app.entities.analysis import Analysis
from app.schemas.schemas import AnalyzeRequest, AnalysisResponse
from app.utils.utils import extract_keywords
from app.services.services import call_llm_for_summary_and_metadata


api_router = APIRouter()


@api_router.post("/analyze", response_model=AnalysisResponse)
async def analyze(req: AnalyzeRequest):
    text = (req.text or "").strip()
    if not text:
        raise HTTPException(status_code=400, detail="Input text cannot be empty")

    keywords = extract_keywords(text)

    try:
        llm = await call_llm_for_summary_and_metadata(text)
        summary = llm.get("summary", "")
        title = llm.get("title")
        topics = llm.get("topics", [])
        sentiment = llm.get("sentiment", "neutral")
        confidence = 0.9
    except Exception as e:
        # Return error response with 500 status code instead of fallback analysis
        raise HTTPException(
            status_code=500,
            detail={
                "error": "LLM Analysis Failed",
                "detail": str(e),
                "timestamp": datetime.now().isoformat()
            }
        )

    record = await Analysis.create(
        input_text=text,
        summary=summary,
        title=title,
        topics=topics,
        sentiment=sentiment,
        keywords=keywords,
        confidence=confidence,
    )
    return AnalysisResponse(
        id=record.id,
        summary=record.summary,
        title=record.title,
        topics=record.topics,
        sentiment=record.sentiment,
        keywords=record.keywords,
        confidence=record.confidence,
        created_at=record.created_at,
    )


@api_router.get("/search", response_model=List[AnalysisResponse])
async def search(topic: Optional[str] = Query(None, description="Topic or keyword to match")):
    if not topic:
        rows = await Analysis.all().order_by("-created_at")
    else:
        topic = topic.strip().lower()
        all_rows = await Analysis.all().order_by("-created_at")
        filtered: List[Analysis] = []
        for r in all_rows:
            topics_lc = [str(t).lower() for t in (r.topics or [])]
            keywords_lc = [str(k).lower() for k in (r.keywords or [])]
            if topic in topics_lc or topic in keywords_lc:
                filtered.append(r)
        rows = filtered

    return [
        AnalysisResponse(
            id=r.id,
            summary=r.summary,
            title=r.title,
            topics=r.topics,
            sentiment=r.sentiment,
            keywords=r.keywords,
            confidence=r.confidence,
            created_at=r.created_at,
        )
        for r in rows
    ]


