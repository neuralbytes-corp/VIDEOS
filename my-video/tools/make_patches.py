"""Detect the '50' glyph in each frame of the source video, inpaint it away
(RGBA patches) and write per-frame geometry to src/track.json.

usage: python3 tools/make_patches.py <frames_dir>   (frames_dir/h%04d.jpg, 30fps, 1-based)
"""
import sys, json, glob, os
import numpy as np, cv2

FR = sys.argv[1]
OUT = os.path.join(os.path.dirname(__file__), '..', 'public', 'patch')
S1 = list(range(0, 1)) + list(range(58, 190))      # 0-based frames, glitter numeral
S2 = list(range(268, 405))                          # foil balloon numeral
REF1 = 23500.0

def load(i):
    return cv2.imread(f'{FR}/h{i+1:04d}.jpg')  # BGR

def mask1(a):
    b, g, r = [a[..., k].astype(int) for k in range(3)]
    m = (abs(r-152) < 48) & (abs(g-116) < 42) & (abs(b-52) < 42) & (g < 0.86*r) & (r-b > 70)
    box = np.zeros_like(m); box[596:862, 190:524] = True
    return m & box

def mask2(a, i):
    b, g, r = [a[..., k].astype(int) for k in range(3)]
    m = (r > 212) & (g > 150) & (b < 110) & (r-b > 120)
    box = np.zeros_like(m); box[640:1010 if i < 290 else 900, 236:532] = True
    m &= box
    n, lab, st, _ = cv2.connectedComponentsWithStats(m.astype(np.uint8), connectivity=8)
    keep = np.zeros_like(m)
    for k in range(1, n):
        if st[k, cv2.CC_STAT_AREA] >= 120:
            keep |= lab == k
    return keep

track = {}
for scene, frames in ((1, S1), (2, S2)):
    for i in frames:
        a = load(i)
        m = mask1(a) if scene == 1 else mask2(a, i)
        cnt = int(m.sum())
        if cnt < 300:
            continue
        ys, xs = np.where(m)
        bb = [int(np.percentile(xs, 0.5)), int(np.percentile(ys, 0.5)),
              int(np.percentile(xs, 99.5)), int(np.percentile(ys, 99.5))]
        k = np.ones((3, 3), np.uint8)
        md = cv2.morphologyEx(m.astype(np.uint8)*255, cv2.MORPH_CLOSE, np.ones((9, 9) if scene == 1 else (17, 17), np.uint8))
        md = cv2.dilate(md, np.ones((11, 11), np.uint8) if scene == 1 else np.ones((33, 33), np.uint8))
        inp = cv2.inpaint(a, md, 7, cv2.INPAINT_TELEA)
        alpha = cv2.GaussianBlur(md, (3, 3), 0)
        x0, y0, x1, y1 = (190, 590, 530, 870) if scene == 1 else (226, 630, 540, 1010)
        rgba = np.dstack([inp, alpha])[y0:y1, x0:x1]
        cv2.imwrite(f'{OUT}/{scene}_{i:04d}.png', rgba)
        track[i] = dict(s=scene, n=cnt, bb=bb, crop=[x0, y0, x1, y1],
                        a=round(min(1.0, cnt/REF1), 3) if scene == 1 else 1.0)
json.dump(track, open(os.path.join(os.path.dirname(__file__), '..', 'src', 'track.json'), 'w'))
print(len(track), 'frames patched')
