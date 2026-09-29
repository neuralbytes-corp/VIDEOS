import cv2, json, sys, numpy as np
FR, OUT, ids, box = sys.argv[1], sys.argv[2], [int(x) for x in sys.argv[3].split(',')], [int(x) for x in sys.argv[4].split(',')]
t = json.load(open('src/track.json')); tn = json.load(open('src/track_name.json'))
def comp(i):
    a = cv2.imread(f'{FR}/h{i+1:04d}.jpg').astype(float)
    for d in (t.get(str(i)), tn.get(str(i))):
        if not d: continue
        x0, y0, x1, y1 = d['crop']
        p = cv2.imread(f"public/patch/{d['s']}_{i:04d}.png", cv2.IMREAD_UNCHANGED).astype(float); al = p[..., 3:]/255
        a[y0:y1, x0:x1] = a[y0:y1, x0:x1]*(1-al) + p[..., :3]*al
    return a.astype(np.uint8)
y0, y1, x0, x1 = box
rows = [np.vstack([cv2.imread(f'{FR}/h{i+1:04d}.jpg')[y0:y1, x0:x1], comp(i)[y0:y1, x0:x1]]) for i in ids]
cv2.imwrite(OUT, np.hstack(rows))
