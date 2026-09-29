import os
import re
import shutil
import subprocess
from pathlib import Path

BASE_DIR = Path("/Users/eliainnamorati/Desktop/synergy-maritime")
ASSETS_DIR = BASE_DIR / "assets"
IMAGES_DIR = ASSETS_DIR / "images"
VIDEOS_DIR = ASSETS_DIR / "videos"
FONTS_DIR = ASSETS_DIR / "fonts"
ICONS_DIR = ASSETS_DIR / "icons"
UNUSED_DIR = BASE_DIR / "unused_files"

for d in [IMAGES_DIR, VIDEOS_DIR, FONTS_DIR, ICONS_DIR, UNUSED_DIR]:
    d.mkdir(parents=True, exist_ok=True)

# 1. Collect all used references
all_text = ""
html_css_js = []
for ext in ["*.html", "*.css", "*.js"]:
    for f in BASE_DIR.rglob(ext):
        if ".git" in str(f) or "unused_files" in str(f):
            continue
        html_css_js.append(f)
        try:
            all_text += f.read_text(encoding="utf-8") + "\n"
        except Exception:
            pass

def is_used(filename):
    return filename in all_text

# 2. File movements & replacements map
move_map = {}

def queue_move(src_path, dest_dir):
    if not src_path.exists(): return
    dest_path = dest_dir / src_path.name
    move_map[src_path] = dest_path

# Gather loose files
for item in BASE_DIR.iterdir():
    if item.is_dir():
        if item.name in ["cyprus office", "philanthropy", "team pictures"]:
            queue_move(item, IMAGES_DIR)
        elif item.name == "Figtree":
            queue_move(item, FONTS_DIR)
    elif item.is_file():
        if item.name.startswith("favicon"):
            continue
        ext = item.suffix.lower()
        if ext in [".png", ".jpg", ".jpeg"]:
            queue_move(item, IMAGES_DIR)
        elif ext in [".svg"]:
            queue_move(item, ICONS_DIR)
        elif ext in [".mov", ".mp4"]:
            queue_move(item, VIDEOS_DIR)
        elif ext in [".otf", ".ttf", ".woff", ".woff2"]:
            queue_move(item, FONTS_DIR)

# Special handle for loose images currently in assets but let's see... maybe keep assets/ as is, or move assets/*.jpg to assets/images?
# Let's just move top-level for now.

# Apply moves and prepare regex replacements
replacements = []
for src, dest in move_map.items():
    if not is_used(src.name):
        print(f"UNUSED: {src.name}")
        if dest.parent != UNUSED_DIR:
            dest = UNUSED_DIR / src.name
    
    shutil.move(str(src), str(dest))
    
    if dest.parent != UNUSED_DIR:
        old_path = src.name
        new_path = str(dest.relative_to(BASE_DIR)).replace("\\", "/")
        replacements.append((old_path, new_path))
        
        # also handle if they were referenced as `./name` or `name`
        # wait, if it's a directory like 'team pictures', we replace 'team pictures/' with 'assets/images/team pictures/'
        if src.is_dir():
            replacements.append((src.name + "/", new_path + "/"))

# Add specific replacements
# 3. Update HTML/CSS/JS
for f in html_css_js:
    try:
        content = f.read_text(encoding="utf-8")
        new_content = content
        for old, new in replacements:
            new_content = new_content.replace(old, new)
        
        if new_content != content:
            f.write_text(new_content, encoding="utf-8")
            print(f"Updated {f.name}")
    except Exception as e:
        print(f"Failed to update {f.name}: {e}")

# 4. Optimize Images (skip if size is already small)
for ext in ["**/*.jpg", "**/*.jpeg", "**/*.png"]:
    for img_path in ASSETS_DIR.rglob(ext):
        size_kb = img_path.stat().st_size / 1024
        if size_kb > 500: # Optimize images > 500KB
            print(f"Optimizing {img_path.name} ({size_kb:.0f} KB)")
            # use sips to scale max dimension to 1920
            subprocess.run(["sips", "-Z", "1920", str(img_path)], capture_output=True)

print("Done organizing and optimizing.")
