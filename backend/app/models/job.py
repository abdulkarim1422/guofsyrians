from beanie import Document
from pydantic import Field, field_validator
from typing import Optional
from datetime import datetime

# ملاحظة: نخزن القوائم كنص متعدد الأسطر في DB
# ونحوّلها لقوائم في الاستجابة داخل الراوتر (dump_job)

class Job(Document):
    # أساسية
    title: str
    company: Optional[str] = None
    location: Optional[str] = None
    city: Optional[str] = None           # City of Employment with "Other" option
    nature_of_work: str = "administrative"  # administrative | fieldwork | remote | technical | creative | analytical | sales | support

    # نوع الدوام ومكانه
    employment_type: str = "full_time"   # full_time | part_time | internship | contract | temporary | freelance | other
    workplace_type: str = "onsite"       # onsite | remote | hybrid

    # وصف
    description: str

    # تُخزّن كنص متعدد الأسطر (سطر لكل عنصر)، ويجري تطبيعها عبر الـ validator
    responsibilities: str = ""
    requirements: str = ""
    benefits: str = ""

    # أخرى
    application_url: Optional[str] = None
    max_applicants: int = 0

    is_active: bool = True
    owner_id: str  # admin id صاحب الإعلان
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # --- Validators ---
    @field_validator("responsibilities", "requirements", "benefits", mode="before")
    @classmethod
    def _coerce_list_to_string(cls, v):
        """
        يقبل List[str] أو str أو None ويحوّلها دائمًا إلى نص متعدد الأسطر للتخزين.
        هذا يحميك من أخطاء string_type حتى لو وصل Array من الواجهة أو كانت بيانات قديمة Array.
        """
        if v is None:
            return ""
        if isinstance(v, list):
            return "\n".join(s for s in (str(i).strip() for i in v) if s)
        return str(v)

    class Settings:
        name = "jobs"
        use_state_management = True
        indexes = [
            [("title", 1)],
            [("is_active", 1), ("created_at", -1)],
        ]

    # اسمح بتجاهل الحقول الزائدة (لو فيه legacy fields مثل "type")
    model_config = dict(extra="ignore", str_strip_whitespace=True)
