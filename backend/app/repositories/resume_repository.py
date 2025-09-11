"""Resume repository utilities for v2 serialization."""
from typing import Any, Dict, List


def normalize_description(desc: str | None):
    if not desc:
        return []
    # unify separators ; or newlines
    temp = desc.replace("\r", "").replace("\n", "; ")
    parts = [p.strip() for p in temp.split("; ") if p.strip()]
    return parts


def serialize_component(obj: Any) -> Dict[str, Any]:
    if hasattr(obj, "model_dump"):
        data = obj.model_dump()
    elif isinstance(obj, dict):
        data = dict(obj)
    else:
        data = obj.__dict__.copy()
    oid = getattr(obj, "id", data.get("id"))
    data["id"] = str(oid) if oid is not None else ""
    if "description" in data:
        data["description_list"] = normalize_description(data.get("description"))
    return data


def serialize_resume(member, work_exps, education_list, projects):
    return {
        "member": serialize_component(member),
        "work_experiences": [serialize_component(w) for w in work_exps],
        "education": [serialize_component(e) for e in education_list],
        "projects": [serialize_component(p) for p in projects],
    }
