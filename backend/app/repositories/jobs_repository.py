"""Jobs repository & serialization utilities for v2 layer.

Currently thin wrappers over Beanie models to allow easier future swap/testing.
"""
from typing import Any, Dict, List


def _to_list(v):
    if v is None:
        return []
    if isinstance(v, list):
        return [str(i).strip() for i in v if str(i).strip()]
    return [line.strip() for line in str(v).splitlines() if line.strip()]


def serialize_job(job: Any) -> Dict[str, Any]:
    """Normalize a Job document/object into an API friendly dict.

    Accepts either a Beanie Document (with model_dump) or a simple object/dict.
    """
    if hasattr(job, "model_dump"):
        data = job.model_dump()
    elif isinstance(job, dict):
        data = dict(job)
    else:
        data = job.__dict__.copy()

    # id coercion
    jid = getattr(job, "id", data.get("id"))
    data["id"] = str(jid) if jid is not None else ""

    # drop internal fields if present
    data.pop("revision_id", None)

    # normalize multi-line fields
    for f in ("responsibilities", "requirements", "benefits"):
        data[f] = _to_list(data.get(f))

    return data
