import cv2, json, sys, numpy as np
FR, OUT = sys.argv[1], sys.argv[2]
ids = [int(x) for x in sys.argv[3].split(',')]
t = json.load(open('src/track.json'))
def comp(i):
    a = cv2.imread(f'{FR}/h{i+1:04d}.jpg').astype(float)
    d = t.get(str(i))
    if d:
        x0, y0, x1, y1 = d['crop']
        p = cv2.imread(f"public/patch/{d['s']}_{i:04d}.png", cv2.IMREAD_UNCHANGED).astype(float)
        al = p[..., 3:]/255
        a[y0:y1, x0:x1] = a[y0:y1, x0:x1]*(1-al) + p[..., :3]*al
    return a.astype(np.uint8)
ims = [cv2.resize(comp(i)[400:1280], (300, int(880*300/720))) for i in ids]
cv2.imwrite(OUT, np.hstack(ims))
