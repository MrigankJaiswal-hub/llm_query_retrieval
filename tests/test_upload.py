from fastapi.testclient import TestClient
from app.main import app
import io

client = TestClient(app)

def test_upload_with_question():
    # Create a dummy PDF file in memory
    file_content = b"%PDF-1.4\n%Mock PDF content"
    file = io.BytesIO(file_content)
    file.name = "test.pdf"

    response = client.post(
        "/api/v1/upload",
        files={"file": ("test.pdf", file, "application/pdf")},
        data={"question": "Does this policy cover surgery?"}
    )

    assert response.status_code == 200
    assert "answer" in response.json()