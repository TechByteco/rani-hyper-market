import shutil
import os

files_to_sync = [
    ('services/rfmSegmentationService.js', 'api/services/rfmSegmentationService.js'),
    ('services/rfmSegmentationService.d.ts', 'api/services/rfmSegmentationService.d.ts')
]

for src, dst in files_to_sync:
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    with open(src, 'rb') as f_src:
        content = f_src.read()
    with open(dst, 'wb') as f_dst:
        f_dst.write(content)
    print(f"Synced {src} -> {dst} ({len(content)} bytes)")
