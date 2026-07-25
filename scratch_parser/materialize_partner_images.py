import io
import json
import shutil
import ssl
import urllib.request
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
IMAGES_DIR = ROOT / "public" / "images"
MANIFEST = Path(__file__).with_name("partner_image_manifest.json")
PRODUCT_FILES = [
    ROOT / "src" / "data" / "products.json",
    ROOT / "public" / "data" / "products.json",
]

FALLBACKS = {
    "Solar Pumps": "product-solar-pump.png",
    "Home & Portable Lighting": "product-home-kit.png",
    "Solar Home Systems": "solar-home-system.png",
    "Solar Appliances": "solar-sewing-machine-pack.jpg",
    "Solar Mobility": "hero-solar-field.png",
}


def slugify(value: str) -> str:
    return (
        value.lower()
        .replace("&", "and")
        .replace("+", " plus ")
        .replace('"', "")
        .replace("'", "")
    )


def valid_image(path: Path) -> bool:
    if not path.exists() or path.stat().st_size == 0:
        return False
    try:
        with Image.open(path) as image:
            image.verify()
        return True
    except Exception:
        return False


def save_webp_from_bytes(data: bytes, target: Path) -> None:
    with Image.open(io.BytesIO(data)) as image:
        if image.mode not in ("RGB", "RGBA"):
            image = image.convert("RGBA")
        target.parent.mkdir(parents=True, exist_ok=True)
        image.save(target, "WEBP", quality=84, method=6)


def save_webp_from_file(source: Path, target: Path) -> None:
    with Image.open(source) as image:
        if image.mode not in ("RGB", "RGBA"):
            image = image.convert("RGBA")
        target.parent.mkdir(parents=True, exist_ok=True)
        image.save(target, "WEBP", quality=84, method=6)


def download(url: str) -> bytes:
    request = urllib.request.Request(
        url,
        headers={
            "User-Agent": "Mozilla/5.0 MeseretCatalogImporter/1.0",
            "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
        },
    )
    context = ssl.create_default_context()
    with urllib.request.urlopen(request, timeout=12, context=context) as response:
        return response.read()


def product_image_path(product: dict) -> Path:
    image = str(product.get("image", "")).strip().lstrip("/")
    return ROOT / "public" / image


def fallback_for(product: dict) -> Path:
    category = product.get("category", "")
    fallback_name = FALLBACKS.get(category, "product-solar-pump.png")
    return IMAGES_DIR / fallback_name


def materialize_manifest_images() -> None:
    if not MANIFEST.exists():
        return
    entries = json.loads(MANIFEST.read_text(encoding="utf-8"))
    for entry in entries:
        target = Path(entry["target"])
        if valid_image(target):
            print(f"exists {target.name}")
            continue
        try:
            data = download(entry["source"])
            if len(data) < 100:
                raise RuntimeError("Downloaded image was empty or too small.")
            save_webp_from_bytes(data, target)
            print(f"downloaded {target.name}")
        except Exception as exc:
            print(f"download failed {target.name}: {exc}")


def materialize_catalog_fallbacks() -> None:
    products_payload = json.loads(PRODUCT_FILES[0].read_text(encoding="utf-8"))
    changed = False
    for product in products_payload.get("products", []):
        target = product_image_path(product)
        if valid_image(target):
            continue
        fallback = fallback_for(product)
        if not valid_image(fallback):
            fallback = IMAGES_DIR / "product-solar-pump.png"
        try:
            if target.suffix.lower() == ".webp":
                save_webp_from_file(fallback, target)
            else:
                target.parent.mkdir(parents=True, exist_ok=True)
                shutil.copyfile(fallback, target)
            print(f"fallback {target.name} <- {fallback.name}")
        except Exception as exc:
            print(f"fallback failed {target.name}: {exc}")

    for file_path in PRODUCT_FILES:
        payload = json.loads(file_path.read_text(encoding="utf-8"))
        for product in payload.get("products", []):
            image = str(product.get("image", ""))
            if image.startswith(("http://", "https://", "//")):
                product["image"] = "/images/product-solar-pump.png"
                changed = True
        if changed:
            file_path.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def main() -> None:
    IMAGES_DIR.mkdir(parents=True, exist_ok=True)
    materialize_manifest_images()
    materialize_catalog_fallbacks()


if __name__ == "__main__":
    main()
