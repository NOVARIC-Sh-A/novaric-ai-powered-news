from pydantic import BaseModel, HttpUrl
from typing import Optional, List, Dict, Any
from datetime import datetime

class VipProfileResponse(BaseModel):
    id: str
    name: str
    image_url: str
    category: str
    short_bio: str
    detailed_bio: str
    gender: Optional[str] = None
    zodiac_sign: Optional[str] = None
    birth_date: Optional[str] = None
    age: Optional[int] = None
    paragon_score: Optional[int] = 0

class PoliticianCardResponse(BaseModel):
    id: str  # This is the profile_id (e.g., "vip1")
    politician_id: int
    name: str
    party: Optional[str] = None
    short_bio: Optional[str] = None
    image_url: Optional[str] = None
    paragon_score: int = 0
    last_updated: datetime

class AnalysisBatchRequest(BaseModel):
    ids: List[str]
    category: str

class AnalysisResponse(BaseModel):
    id: str
    overallScore: int
    dimensions: Dict[str, int]

class BatchAnalysisResponse(BaseModel):
    analyses: List[AnalysisResponse]
