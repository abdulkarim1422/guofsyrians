from app.repositories.resume_repository import normalize_description, serialize_component


def test_normalize_description_variants():
    src = "Item one\nItem two; Item three\n\nItem four"
    result = normalize_description(src)
    assert result == ["Item one", "Item two", "Item three", "Item four"]


class Dummy:
    def __init__(self, description: str):
        self.description = description
        self.id = "abc123"


def test_serialize_component_adds_description_list():
    d = Dummy("First line\nSecond line")
    out = serialize_component(d)
    assert out["description_list"] == ["First line", "Second line"]
    assert out["id"] == "abc123"
