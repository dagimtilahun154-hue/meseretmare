import hashlib
import json
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
products = json.loads((ROOT / "src" / "data" / "products.json").read_text(encoding="utf-8"))["products"]
hashes = {}
errors = []

for product in products:
    image_path = ROOT / "public" / product["image"].lstrip("/")
    with Image.open(image_path) as image:
        width, height = image.size
    if width < 40 or height < 40:
        errors.append(f"{product['name']}: tiny image dimensions {width}x{height}")
    digest = hashlib.sha256(image_path.read_bytes()).hexdigest()
    hashes.setdefault(digest, []).append(product["image"])

duplicates = [paths for paths in hashes.values() if len(paths) > 1]
print({
    "products": len(products),
    "unique_hashes": len(hashes),
    "duplicate_hash_groups": len(duplicates),
    "dimension_errors": errors,
})

if duplicates or errors:
    raise SystemExit(1)
