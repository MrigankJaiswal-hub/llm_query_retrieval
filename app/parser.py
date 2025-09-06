import os
from pdfminer.high_level import extract_text as extract_pdf_text
from docx import Document as DocxDoc
from email import policy
from email.parser import BytesParser
from app.utils import download_document

def parse_document(file_path: str) -> str:
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"File not found: {file_path}")

    if file_path.endswith(".pdf"):
        return extract_pdf_text(file_path)
    elif file_path.endswith(".docx"):
        doc = DocxDoc(file_path)
        return "\n".join([p.text for p in doc.paragraphs if p.text.strip()])
    elif file_path.endswith(".eml"):
        with open(file_path, 'rb') as f:
            msg = BytesParser(policy=policy.default).parse(f)
            body = msg.get_body(preferencelist=('plain'))
            if body:
                return body.get_content()
            else:
                raise ValueError("No plain text content found in EML file")
    else:
        raise ValueError(f"Unsupported file type: {file_path}")

def download_and_parse(url: str) -> str:
    file_path = download_document(url)
    try:
        return parse_document(file_path)
    finally:
        # Optional: Clean up the temporary file after parsing
        if os.path.exists(file_path):
            os.remove(file_path)

parse_file = parse_document