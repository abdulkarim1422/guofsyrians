import pytest
from app.models.job import Job
from beanie.exceptions import CollectionWasNotInitialized

def test_job_list_field_coercion():
    # responsibilities passed as list should store as newline joined string
    try:
        job = Job(
            title="Test",
            company="Co",
            description="Desc",
            responsibilities=["Do A", "Do B"],
            requirements=["Req1"],
            benefits=["Ben1", "Ben2"],
            owner_id="owner123"
        )
    except CollectionWasNotInitialized:
        pytest.skip("Beanie not initialized; skipping validator test")
    # validator runs on construction
    assert isinstance(job.responsibilities, str)
    assert "Do A" in job.responsibilities
    assert "Do B" in job.responsibilities

def test_job_string_field_preserved():
    try:
        job = Job(
            title="Test2",
            company="Co",
            description="Desc",
            responsibilities="Line1\nLine2",
            owner_id="owner123"
        )
    except CollectionWasNotInitialized:
        pytest.skip("Beanie not initialized; skipping validator test")
    assert job.responsibilities.count("Line") == 2
