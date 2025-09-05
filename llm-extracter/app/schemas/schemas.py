from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, Field


class AnalyzeRequest(BaseModel):
    text: str = Field(..., min_length=1)


class AnalysisResponse(BaseModel):
    id: int
    summary: str
    title: Optional[str]
    topics: List[str]
    sentiment: str
    keywords: List[str]
    confidence: float
    created_at: datetime


