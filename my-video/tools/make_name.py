"""Replace the title name 'Ximena' by 'Edith' (Kaushan Script, same gold 3D look).

For every frame with the name: inpaint the old letters away, redraw the new name with
the gold gradient / extrusion / shadow and the left-to-right glowing reveal of the original.
usage: python3 tools/make_name.py <frames_dir> [NEW_NAME]
"""
import sys, os, json
import numpy as np, cv2
from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
FR = sys.argv[1]
NAME = sys.argv[2] if len(sys.argv) > 2 else 'Edith'
OUT = os.path.join(HERE, '..', 'public', 'patch')
os.makedirs(OUT, exist_ok=True)
for f in os.listdir(OUT):
    if f.startswith('3_'):
        os.remove(os.path.join(OUT, f))
FONT = os.path.join(HERE, 'fonts', 'kaushan-script-latin-400-normal.ttf')
H_, W_ = 1280, 720
CROP = (40, 110, 700, 360)      # x0, y0, x1, y1
SS = 3
FIRST, LAST = 189, 411
REVEAL_OLD = {'X': 190, 'i': 194, 'm': 200, 'e': 206, 'n': 214, 'a': 221}
SETTLE = 232                     # glow of the original is gone from here

def load(i):
    return cv2.imread(f'{FR}/h{i+1:04d}.jpg')

def txt(a):
    b, g, r = [a[..., k].astype(int) for k in range(3)]
    return (r > 185) & (g > 150) & (b < 205) & (r-b > 35) & (g > 0.8*r)

# ---- footprint of the old name + static colour ramp (median of settled frames)
acc = None; n = 0; frames_static = list(range(240, 390, 5))
for i in frames_static:
    m = cv2.morphologyEx(txt(load(i)).astype(np.uint8), cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
    acc = m.astype(float) if acc is None else acc + m; n += 1
F = np.zeros((H_, W_), bool)
F[130:330, 40:700] = (acc/n > 0.7)[130:330, 40:700]
F[:, :60] = False
k_, lab_, st_, _ = cv2.connectedComponentsWithStats(F.astype(np.uint8), connectivity=8)
for j in range(1, k_):                                      # keep letters only, drop specks
    if st_[j, cv2.CC_STAT_AREA] < 150:
        F[lab_ == j] = False
ys, xs = np.where(F)
print('old name bbox', xs.min(), xs.max(), ys.min(), ys.max())
Y0, Y1 = 160, 312
nb = Y1-Y0
ramp = np.zeros((nb, 3), np.float32)
stack = []
for i in frames_static:
    a = load(i).astype(np.float32)
    col = np.full((nb, 3), np.nan, np.float32)
    for k in range(nb):
        row = F[Y0+k] & txt(load(i))[Y0+k] if False else F[Y0+k]
        if row.sum() > 3:
            col[k] = np.median(a[Y0+k][row], axis=0)
    stack.append(col)
ramp = np.nanmedian(np.array(stack), axis=0)
valid = np.where(~np.isnan(ramp).any(axis=1))[0]
for k in range(nb):     # rows without letters take the nearest row that has them
    if np.isnan(ramp[k]).any():
        ramp[k] = ramp[valid[np.argmin(abs(valid-k))]]
ramp = cv2.GaussianBlur(ramp.reshape(nb, 1, 3), (1, 0), 3).reshape(nb, 3)

# ---- letter layout of the new name
CAP_H = 146.0; BASE = 308.0; CX = 360.0
f400 = ImageFont.truetype(FONT, 400)
bbE = f400.getbbox('E', anchor='ls')
size = int(400*CAP_H/(bbE[3]-bbE[1]))*SS
font = ImageFont.truetype(FONT, size)
total = font.getlength(NAME)
x_start = CX*SS - total/2
letters = []
for k, ch in enumerate(NAME):
    im = Image.new('L', (W_*SS, H_*SS), 0)
    ImageDraw.Draw(im).text((x_start + font.getlength(NAME[:k]), BASE*SS), ch, font=font, fill=255, anchor='ls')
    m = cv2.resize(np.array(im), (W_, H_), interpolation=cv2.INTER_AREA).astype(np.float32)/255
    letters.append(m)
t0, t1 = REVEAL_OLD['X'], REVEAL_OLD['a']
reveal_new = [t0 + k*(t1-t0)/max(1, len(NAME)-1) for k in range(len(NAME))]
full = np.clip(sum(letters), 0, 1)
print('new name width', total/SS, 'reveal', [round(t, 1) for t in reveal_new])

def shift(m, dx, dy):
    M = np.float32([[1, 0, dx], [0, 1, dy]])
    return cv2.warpAffine(m, M, (W_, H_))

def render(i, a):
    """-> colour image (float32 BGR) and alpha for the whole frame"""
    # ---- which letters exist now, how visible
    vis = [float(np.clip((i-t+1)/4.0, 0, 1)) for t in reveal_new]
    text_a = np.clip(sum(l*v for l, v in zip(letters, vis)), 0, 1)
    if text_a.max() < 0.02:
        return None
    glow_w = [float(np.clip(1-(i-t)/(SETTLE-t), 0, 1)) if v > 0 else 0 for t, v in zip(reveal_new, vis)]
    wmap = sum(l*v*g for l, v, g in zip(letters, vis, glow_w))
    wmap = np.clip(wmap/np.maximum(text_a, 1e-3), 0, 1)*(text_a > 0.02)
    # ---- background: remove the old letters (incl. their extrusion and, while revealing, their glow)
    rev_old = [t for t in REVEAL_OLD.values()]
    Fd = np.zeros((H_, W_), np.uint8)
    for (key, t), (x0, x1) in zip(REVEAL_OLD.items(), [(0, 150), (150, 255), (255, 380), (380, 460), (460, 560), (560, 720)]):
        if i >= t-1:
            Fd[:, x0:x1] = F[:, x0:x1]
    ext = np.zeros_like(Fd)
    for d in range(0, 13, 2):
        ext |= (shift(Fd.astype(np.float32), d*0.8, d) > 0.3).astype(np.uint8)
    early = float(np.clip(1-(i-221)/(SETTLE+4-221), 0, 1)) if i < SETTLE+4 else 0.0
    rad = int(15 + 14*early)
    md = cv2.dilate(ext*255, np.ones((rad, rad), np.uint8))
    inp = cv2.inpaint(a, md, 6, cv2.INPAINT_TELEA).astype(np.float32)
    # Telea leaves faceted streaks on this busy background: melt them into a soft bokeh-like fill
    soft_ = cv2.GaussianBlur(inp, (0, 0), 6)
    wm = cv2.GaussianBlur(md, (0, 0), 3).astype(np.float32)[..., None]/255.0
    inp = inp*(1-wm) + soft_*wm
    # ---- colours of the new letters
    if i >= SETTLE+2:      # settled: follow the frame itself (covers the fade-out)
        ramp_i = np.zeros((nb, 3), np.float32)
        Fm = F & txt(a)
        for k in range(nb):
            row = Fm[Y0+k] | F[Y0+k]
            sel = a[Y0+k][F[Y0+k]]
            ramp_i[k] = np.median(sel, axis=0) if len(sel) > 3 else ramp[k]
        # keep the static gradient shape, scale it to the current brightness
        scale = (ramp_i.mean()/max(1.0, ramp.mean()))
        cur = ramp*scale if 0.15 < scale < 1.15 else ramp_i
        if scale < 0.98:
            cur = ramp*scale
        else:
            cur = ramp
    else:
        cur = ramp
    col = np.zeros((H_, W_, 3), np.float32)
    col[Y0:Y1] = cur[:, None, :]
    col[:Y0] = cur[0]; col[Y1:] = cur[-1]
    hot = np.array([215, 252, 255], np.float32)      # BGR of the hot yellow-white glow
    col = col*(1-0.75*wmap[..., None]) + hot*0.75*wmap[..., None]
    # ---- extrusion + drop shadow
    out = inp.copy()
    sh = cv2.GaussianBlur(shift(text_a, 5, 7), (0, 0), 4)
    fade = float(np.clip((cur.mean()/max(1.0, ramp.mean())), 0, 1))
    out = out*(1-0.55*sh[..., None]) 
    dark = np.array([10, 20, 35], np.float32)
    for d in range(6, 0, -1):
        e = shift(text_a, d*0.8, d)
        out = out*(1-e[..., None]) + (dark*fade + out*(1-fade))*e[..., None]
    out = out*(1-text_a[..., None]) + col*text_a[..., None]
    # ---- bloom while revealing
    bloom = cv2.GaussianBlur(text_a*wmap, (0, 0), 9)*0.9 + cv2.GaussianBlur(text_a*wmap, (0, 0), 3)*0.5
    out = 255 - (255-out)*(1-np.clip(bloom, 0, 1)[..., None]*np.array([0.85, 0.97, 1.0], np.float32))
    alpha = np.clip(np.maximum.reduce([cv2.GaussianBlur(md, (3, 3), 0)/255.0, sh*2, text_a, np.clip(bloom*3, 0, 1),
                                        np.clip(shift(text_a, 5, 6), 0, 1)]), 0, 1)
    return out, alpha.astype(np.float32)

track = {}
for i in range(FIRST, LAST):
    a = load(i)
    r = render(i, a)
    if r is None:
        continue
    out, alpha = r
    x0, y0, x1, y1 = CROP
    rgba = np.dstack([out, alpha*255])[y0:y1, x0:x1]
    cv2.imwrite(f'{OUT}/3_{i:04d}.png', np.clip(rgba, 0, 255).astype(np.uint8))
    track[str(i)] = dict(crop=list(CROP), s=3)
json.dump(track, open(os.path.join(HERE, '..', 'src', 'track_name.json'), 'w'))
print(len(track), 'frames')
