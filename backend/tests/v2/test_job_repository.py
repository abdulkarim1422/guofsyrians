import pytest
from app.repositories.jobs_repository import serialize_job


class DummyJob:
    def __init__(self, **kwargs):
        for k, v in kwargs.items():
            setattr(self, k, v)

    @property
    def id(self):  # mimic Beanie id attr
        return getattr(self, "_id", "fakeid123")


@pytest.mark.parametrize(
    "field,value,expected",
    [
        ("responsibilities", "Line1\nLine2\n", ["Line1", "Line2"]),
        ("requirements", ["A", "", "B"], ["A", "B"]),
        ("benefits", None, []),
    ],
)
def test_serialize_job_normalizes_lists(field, value, expected):
    job = DummyJob(title="X", company="C", **{field: value})
    out = serialize_job(job)
    assert out[field] == expected
