# app/schemas/job.py
from __future__ import annotations
from pydantic import BaseModel, Field, field_validator
from typing import Optional, List, Literal, Any
from datetime import datetime

Employment = Literal[
    "full_time",
    "part_time",
    "contract",
    "internship",
    "temporary",
    "freelance",
    "other",
]
Workplace = Literal["onsite", "remote", "hybrid"]

class _NormalizeLists(BaseModel):
    @staticmethod
    def _to_list(v: Any) -> List[str]:
        if v is None:
            return []
        if isinstance(v, list):
            return [str(i).strip() for i in v if str(i).strip()]
        return [line.strip() for line in str(v).splitlines() if line.strip()]

    @field_validator("application_url", mode="before", check_fields=False)
    @classmethod
    def empty_str_to_none(cls, v: Any) -> Optional[str]:
        if v is None:
            return None
        s = str(v).strip()
        return s if s else None

    @field_validator(
        "responsibilities",
        "requirements",
        "benefits",
        mode="before",
        check_fields=False,
    )
    @classmethod
    def normalize_lists(cls, v: Any) -> List[str]:
        return cls._to_list(v)


class JobBase(_NormalizeLists):
    title: str
    company: Optional[str] = None
    location: Optional[str] = None
    city: Optional[str] = None
    nature_of_work: str = "administrative"

    employment_type: Employment = "full_time"
    workplace_type: Workplace = "onsite"

    description: str

    responsibilities: List[str] = Field(default_factory=list)
    requirements: List[str] = Field(default_factory=list)
    benefits: List[str] = Field(default_factory=list)

    application_url: Optional[str] = None
    max_applicants: int = 0

    is_active: bool = True


class JobCreate(JobBase):
    pass


class JobUpdate(_NormalizeLists):
    title: Optional[str] = None
    company: Optional[str] = None
    location: Optional[str] = None

    employment_type: Optional[Employment] = None
    workplace_type: Optional[Workplace] = None

    description: Optional[str] = None
    responsibilities: Optional[List[str]] = None
    requirements: Optional[List[str]] = None
    benefits: Optional[List[str]] = None

    application_url: Optional[str] = None
    max_applicants: Optional[int] = None

    is_active: Optional[bool] = None


class JobOut(JobBase):
    id: str
    owner_id: str
    created_at: datetime

    model_config = dict(from_attributes=True)
