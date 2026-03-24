#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.12"
# dependencies = [
#     "b2sdk>=2.0.0",
#     "python-dotenv>=1.0.0",
# ]
# ///
"""B2 Media Optimizer — scans a Backblaze B2 bucket for un-optimized images/videos and converts them."""

import argparse
import getpass
import os
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

from b2sdk.v2 import B2Api, InMemoryAccountInfo
from dotenv import load_dotenv

# Load .env from project root
load_dotenv(Path(__file__).resolve().parent.parent / ".env")

DEFAULT_BUCKET = "ethan-site-media"
IMAGE_PREFIX = "images/photographs/"
VIDEO_PREFIX = "videos/films/"
DEFAULT_CWEBP_QUALITY = 82
DEFAULT_CRF = 28


def get_b2_bucket(bucket_name: str):
    key_id = os.environ.get("B2_APPLICATION_KEY_ID")
    key = os.environ.get("B2_APPLICATION_KEY")

    if not key_id:
        key_id = input("B2 Application Key ID: ").strip()
    if not key:
        key = getpass.getpass("B2 Application Key: ").strip()

    if not key_id or not key:
        print("Error: B2 credentials are required.", file=sys.stderr)
        sys.exit(1)

    info = InMemoryAccountInfo()
    b2_api = B2Api(info)
    try:
        b2_api.authorize_account("production", key_id, key)
    except Exception as e:
        print(f"Error: B2 authorization failed: {e}", file=sys.stderr)
        sys.exit(1)

    try:
        return b2_api.get_bucket_by_name(bucket_name)
    except Exception as e:
        print(f"Error: Could not find bucket '{bucket_name}': {e}", file=sys.stderr)
        sys.exit(1)


def list_b2_files(bucket, prefix: str) -> dict[str, object]:
    """List all files under a prefix. Returns {file_name: file_version}."""
    files = {}
    for file_version, _folder in bucket.ls(folder_to_list=prefix, recursive=True):
        files[file_version.file_name] = file_version
    return files


def format_size(size_bytes: int) -> str:
    if size_bytes >= 1_000_000:
        return f"{size_bytes / 1_000_000:.1f} MB"
    if size_bytes >= 1_000:
        return f"{size_bytes / 1_000:.0f} KB"
    return f"{size_bytes} B"


def cmd_optimize_images(bucket, args):
    if not shutil.which("cwebp"):
        print("Error: cwebp not found. Install via: brew install webp", file=sys.stderr)
        sys.exit(1)

    print(f"\nScanning {IMAGE_PREFIX} ...")
    all_files = list_b2_files(bucket, IMAGE_PREFIX)

    jpgs = {name: fv for name, fv in all_files.items() if name.lower().endswith(".jpg")}
    webps = {name for name in all_files if name.lower().endswith(".webp")}

    if args.album:
        album_prefix = f"{IMAGE_PREFIX}{args.album}/"
        jpgs = {name: fv for name, fv in jpgs.items() if name.startswith(album_prefix)}

    to_convert = {}
    for name, fv in jpgs.items():
        webp_name = name.rsplit(".", 1)[0] + ".webp"
        if webp_name not in webps:
            to_convert[name] = fv

    already_done = len(jpgs) - len(to_convert)
    print(f"Found {len(jpgs)} JPG files, {already_done} already have WebP versions.")
    print(f"{len(to_convert)} files to convert.\n")

    if not to_convert:
        print("Nothing to do.")
        return

    if args.dry_run:
        for name in sorted(to_convert):
            size = to_convert[name].size
            print(f"  Would convert: {name} ({format_size(size)})")
        return

    failures = []
    total_saved = 0
    quality = args.quality

    for i, (name, fv) in enumerate(sorted(to_convert.items()), 1):
        webp_name = name.rsplit(".", 1)[0] + ".webp"
        try:
            with tempfile.TemporaryDirectory() as tmpdir:
                jpg_path = os.path.join(tmpdir, "input.jpg")
                webp_path = os.path.join(tmpdir, "output.webp")

                downloaded = bucket.download_file_by_name(name)
                downloaded.save_to(jpg_path)
                original_size = os.path.getsize(jpg_path)

                result = subprocess.run(
                    ["cwebp", "-q", str(quality), jpg_path, "-o", webp_path],
                    capture_output=True,
                    text=True,
                )
                if result.returncode != 0:
                    raise RuntimeError(f"cwebp failed: {result.stderr.strip()}")

                new_size = os.path.getsize(webp_path)
                saved = original_size - new_size
                pct = (saved / original_size * 100) if original_size > 0 else 0
                total_saved += saved

                bucket.upload_local_file(local_file=webp_path, file_name=webp_name)

                print(
                    f"[{i}/{len(to_convert)}]  {name} -> .webp  "
                    f"({format_size(original_size)} -> {format_size(new_size)}, -{pct:.0f}%)"
                )
        except KeyboardInterrupt:
            print("\nInterrupted.")
            break
        except Exception as e:
            failures.append((name, str(e)))
            print(f"[{i}/{len(to_convert)}]  ERROR: {name} - {e}")

    print(f"\nSummary")
    print(f"-------")
    print(f"Converted: {len(to_convert) - len(failures)}/{len(to_convert)}")
    if failures:
        print(f"Failed: {len(failures)}")
        for name, err in failures:
            print(f"  - {name}: {err}")
    print(f"Total saved: {format_size(total_saved)}")


def cmd_optimize_videos(bucket, args):
    if not shutil.which("ffmpeg"):
        print(
            "Error: ffmpeg is required for video optimization but was not found.\n"
            "Install it with: brew install ffmpeg",
            file=sys.stderr,
        )
        sys.exit(1)

    print(f"\nScanning {VIDEO_PREFIX} ...")
    all_files = list_b2_files(bucket, VIDEO_PREFIX)

    mp4s = {
        name: fv
        for name, fv in all_files.items()
        if name.lower().endswith(".mp4") and "_optimized" not in name
    }

    if args.film:
        film_prefix = f"{VIDEO_PREFIX}{args.film}/"
        mp4s = {name: fv for name, fv in mp4s.items() if name.startswith(film_prefix)}

    if not args.replace:
        optimized = {name for name in all_files if "_optimized.mp4" in name}
        to_encode = {}
        for name, fv in mp4s.items():
            opt_name = name.rsplit(".", 1)[0] + "_optimized.mp4"
            if opt_name not in optimized:
                to_encode[name] = fv
    else:
        to_encode = mp4s

    print(f"Found {len(mp4s)} MP4 files, {len(to_encode)} to re-encode.\n")

    if not to_encode:
        print("Nothing to do.")
        return

    if args.dry_run:
        for name in sorted(to_encode):
            size = to_encode[name].size
            print(f"  Would re-encode: {name} ({format_size(size)})")
        return

    failures = []
    total_saved = 0
    crf = args.crf

    for i, (name, fv) in enumerate(sorted(to_encode.items()), 1):
        if args.replace:
            out_name = name
        else:
            out_name = name.rsplit(".", 1)[0] + "_optimized.mp4"

        try:
            with tempfile.TemporaryDirectory() as tmpdir:
                input_path = os.path.join(tmpdir, "input.mp4")
                output_path = os.path.join(tmpdir, "output.mp4")

                print(f"[{i}/{len(to_encode)}]  Downloading {name} ({format_size(fv.size)})...")
                downloaded = bucket.download_file_by_name(name)
                downloaded.save_to(input_path)
                original_size = os.path.getsize(input_path)

                print(f"[{i}/{len(to_encode)}]  Re-encoding at CRF {crf}...")
                result = subprocess.run(
                    [
                        "ffmpeg",
                        "-i", input_path,
                        "-c:v", "libx264",
                        "-crf", str(crf),
                        "-preset", "slow",
                        "-c:a", "aac",
                        "-b:a", "128k",
                        "-movflags", "+faststart",
                        "-y",
                        output_path,
                    ],
                    capture_output=True,
                    text=True,
                )
                if result.returncode != 0:
                    raise RuntimeError(f"ffmpeg failed: {result.stderr.strip()[-200:]}")

                new_size = os.path.getsize(output_path)
                saved = original_size - new_size
                pct = (saved / original_size * 100) if original_size > 0 else 0
                total_saved += saved

                bucket.upload_local_file(local_file=output_path, file_name=out_name)

                print(
                    f"[{i}/{len(to_encode)}]  {name} -> {out_name}  "
                    f"({format_size(original_size)} -> {format_size(new_size)}, -{pct:.0f}%)"
                )
        except KeyboardInterrupt:
            print("\nInterrupted.")
            break
        except Exception as e:
            failures.append((name, str(e)))
            print(f"[{i}/{len(to_encode)}]  ERROR: {name} - {e}")

    print(f"\nSummary")
    print(f"-------")
    print(f"Re-encoded: {len(to_encode) - len(failures)}/{len(to_encode)}")
    if failures:
        print(f"Failed: {len(failures)}")
        for name, err in failures:
            print(f"  - {name}: {err}")
    print(f"Total saved: {format_size(total_saved)}")


def cmd_extract_posters(bucket, args):
    if not shutil.which("ffmpeg"):
        print(
            "Error: ffmpeg is required for poster extraction but was not found.\n"
            "Install it with: brew install ffmpeg",
            file=sys.stderr,
        )
        sys.exit(1)
    if not shutil.which("cwebp"):
        print("Error: cwebp not found. Install via: brew install webp", file=sys.stderr)
        sys.exit(1)

    print(f"\nScanning {VIDEO_PREFIX} ...")
    all_files = list_b2_files(bucket, VIDEO_PREFIX)

    mp4s = {
        name: fv
        for name, fv in all_files.items()
        if name.lower().endswith(".mp4") and "_optimized" not in name
    }

    if args.film:
        film_prefix = f"{VIDEO_PREFIX}{args.film}/"
        mp4s = {name: fv for name, fv in mp4s.items() if name.startswith(film_prefix)}

    existing_posters = {name for name in all_files if name.endswith("_poster.webp")}

    to_extract = {}
    for name, fv in mp4s.items():
        poster_name = name.rsplit(".", 1)[0] + "_poster.webp"
        if poster_name not in existing_posters:
            to_extract[name] = fv

    already_done = len(mp4s) - len(to_extract)
    print(f"Found {len(mp4s)} MP4 files, {already_done} already have posters.")
    print(f"{len(to_extract)} posters to extract.\n")

    if not to_extract:
        print("Nothing to do.")
        return

    if args.dry_run:
        for name in sorted(to_extract):
            print(f"  Would extract poster: {name}")
        return

    failures = []

    for i, (name, fv) in enumerate(sorted(to_extract.items()), 1):
        poster_name = name.rsplit(".", 1)[0] + "_poster.webp"
        try:
            with tempfile.TemporaryDirectory() as tmpdir:
                input_path = os.path.join(tmpdir, "input.mp4")
                png_path = os.path.join(tmpdir, "poster.png")
                poster_path = os.path.join(tmpdir, "poster.webp")

                print(f"[{i}/{len(to_extract)}]  Downloading {name} ({format_size(fv.size)})...")
                downloaded = bucket.download_file_by_name(name)
                downloaded.save_to(input_path)

                result = subprocess.run(
                    ["ffmpeg", "-i", input_path, "-vframes", "1", "-y", png_path],
                    capture_output=True,
                    text=True,
                )
                if result.returncode != 0:
                    raise RuntimeError(f"ffmpeg failed: {result.stderr.strip()[-200:]}")

                result = subprocess.run(
                    ["cwebp", "-q", "80", png_path, "-o", poster_path],
                    capture_output=True,
                    text=True,
                )
                if result.returncode != 0:
                    raise RuntimeError(f"cwebp failed: {result.stderr.strip()}")

                poster_size = os.path.getsize(poster_path)
                bucket.upload_local_file(local_file=poster_path, file_name=poster_name)

                print(
                    f"[{i}/{len(to_extract)}]  {name} -> {poster_name} ({format_size(poster_size)})"
                )
        except KeyboardInterrupt:
            print("\nInterrupted.")
            break
        except Exception as e:
            failures.append((name, str(e)))
            print(f"[{i}/{len(to_extract)}]  ERROR: {name} - {e}")

    print(f"\nSummary")
    print(f"-------")
    print(f"Extracted: {len(to_extract) - len(failures)}/{len(to_extract)}")
    if failures:
        print(f"Failed: {len(failures)}")
        for name, err in failures:
            print(f"  - {name}: {err}")


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="B2 Media Optimizer — convert images to WebP and re-encode videos"
    )
    parser.add_argument("--dry-run", action="store_true", help="Show what would be done without doing it")
    parser.add_argument("--bucket", default=DEFAULT_BUCKET, help=f"B2 bucket name (default: {DEFAULT_BUCKET})")

    subparsers = parser.add_subparsers(dest="command", required=True)

    img_parser = subparsers.add_parser("optimize-images", help="Convert JPGs to WebP")
    img_parser.add_argument("--quality", type=int, default=DEFAULT_CWEBP_QUALITY, help=f"cwebp quality 1-100 (default: {DEFAULT_CWEBP_QUALITY})")
    img_parser.add_argument("--album", type=str, help="Only process a specific album slug")

    vid_parser = subparsers.add_parser("optimize-videos", help="Re-encode MP4s with ffmpeg")
    vid_parser.add_argument("--crf", type=int, default=DEFAULT_CRF, help=f"FFmpeg CRF 0-51 (default: {DEFAULT_CRF})")
    vid_parser.add_argument("--film", type=str, help="Only process a specific film slug")
    vid_parser.add_argument("--replace", action="store_true", help="Replace original files (default: upload as *_optimized.mp4)")

    poster_parser = subparsers.add_parser("extract-posters", help="Extract first frame of MP4s as WebP posters")
    poster_parser.add_argument("--film", type=str, help="Only process a specific film slug")

    return parser


def main():
    parser = build_parser()
    args = parser.parse_args()

    print("B2 Media Optimizer")
    print("==================")
    print(f"Bucket: {args.bucket}")
    print(f"Command: {args.command}")
    print(f"Dry run: {'yes' if args.dry_run else 'no'}")

    bucket = get_b2_bucket(args.bucket)

    if args.command == "optimize-images":
        print(f"Quality: {args.quality}")
        if args.album:
            print(f"Album: {args.album}")
        cmd_optimize_images(bucket, args)
    elif args.command == "optimize-videos":
        print(f"CRF: {args.crf}")
        if args.film:
            print(f"Film: {args.film}")
        cmd_optimize_videos(bucket, args)
    elif args.command == "extract-posters":
        if args.film:
            print(f"Film: {args.film}")
        cmd_extract_posters(bucket, args)


if __name__ == "__main__":
    main()
