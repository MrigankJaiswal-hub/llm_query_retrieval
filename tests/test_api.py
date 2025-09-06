import json
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

# def test_run_endpoint():
#     headers = {"Authorization": "Bearer 2c83d62bd7f13e929bcffb25b8861087ab3fd8ddd5f536df4721c4d455923695"}
#     payload = {
#         "documents": "https://example.com/sample-policy.pdf",
#         "questions": ["Does this policy cover knee surgery?"]
#     }
#     response = client.post("/api/v1/hackrx/run", json=payload, headers=headers)
#     assert response.status_code == 200
#     assert "answers" in response.json()
def test_upload_endpoint():
    with open("tests/sample.pdf", "rb") as f:
        response = client.post(
            "/api/v1/upload",
            files={"file": ("Samplepdf.pdf", f, "application/pdf")},
            data={"question": "Does this policy cover knee surgery?"}
        )
    assert response.status_code == 200
    assert "answer" in response.json()

def test_healthcheck():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}
