import io
import json
import ssl
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

from PIL import Image

MANIFEST = Path(__file__).with_name("partner_image_manifest.json")


def save_webp(data: bytes, target: Path) -> None:
    with Image.open(io.BytesIO(data)) as image:
        if image.mode not in ("RGB", "RGBA"):
            image = image.convert("RGBA")
        target.parent.mkdir(parents=True, exist_ok=True)
        image.save(target, "WEBP", quality=86, method=6)


def download(url: str) -> bytes:
    request = urllib.request.Request(
        url,
        headers={
            "User-Agent": "Mozilla/5.0 MeseretCatalogImporter/2.0",
            "Accept": "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
        },
    )
    context = ssl.create_default_context()
    with urllib.request.urlopen(request, timeout=25, context=context) as response:
        return response.read()


def valid_image(path: Path) -> bool:
    try:
        with Image.open(path) as image:
            image.verify()
        return path.exists() and path.stat().st_size > 1000
    except Exception:
        return False


def materialize(entry: dict) -> str:
    target = Path(entry["target"])
    data = download(entry["source"])
    if len(data) < 1000:
        raise RuntimeError("downloaded image was too small")
    save_webp(data, target)
    if not valid_image(target):
        raise RuntimeError("saved image failed validation")
    return f"exact {target.name}"


def main() -> None:
    failures = []
    entries = json.loads(MANIFEST.read_text(encoding="utf-8"))
    with ThreadPoolExecutor(max_workers=8) as pool:
      futures = {pool.submit(materialize, entry): entry for entry in entries}
      for future in as_completed(futures):
          entry = futures[future]
          try:
              print(future.result(), flush=True)
          except Exception as exc:
              failures.append(f"{entry['name']}: {exc}")

    if failures:
        raise SystemExit("Image materialization failed:\n" + "\n".join(failures))


if __name__ == "__main__":
    main()
