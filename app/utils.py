import os
import requests

def download_document(url: str, save_path: str = "tempfile") -> str:
    ext = url.split(".")[-1].split("?")[0].lower()
    filename = f"{save_path}.{ext}"
    with requests.get(url, stream=True) as r:
        r.raise_for_status()
        with open(filename, "wb") as f:
            for chunk in r.iter_content(chunk_size=8192):
                f.write(chunk)
    return filename