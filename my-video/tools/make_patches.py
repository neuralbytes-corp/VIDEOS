"""Replace the '50' of the source video by '44', frame by frame.

For every frame that shows the 50 it (1) finds the glyph, (2) inpaints it away,
(3) draws a 44 using colours/texture sampled from that same frame's 50 (so the
material, lighting and fades match), and (4) writes an RGBA patch PNG.
usage: python3 tools/make_patches.py <frames_dir>   (frames_dir/h%04d.jpg, 30fps, 1-based)
"""
import sys, json, os
import numpy as np, cv2
from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
FR = sys.argv[1]
OUT = os.path.join(HERE, '..', 'public', 'patch')
os.makedirs(OUT, exist_ok=True)
for f in os.listdir(OUT):
    os.remove(os.path.join(OUT, f))
FONT = os.path.join(HERE, 'fonts', 'lora-latin-700-normal.ttf')
H_, W_ = 1280, 720
SS = 4

def load(i):
    return cv2.imread(f'{FR}/h{i+1:04d}.jpg')

def comps(m, min_area):
    n, lab, st, _ = cv2.connectedComponentsWithStats(m.astype(np.uint8), connectivity=8)
    keep = np.zeros(m.shape, bool)
    for k in range(1, n):
        if st[k, cv2.CC_STAT_AREA] >= min_area:
            keep |= lab == k
    return keep

def soft(mask_ss):
    return cv2.resize(mask_ss, (W_, H_), interpolation=cv2.INTER_AREA).astype(np.float32) / 255.0


def rgb(a):
    return [a[..., k].astype(int) for k in (2, 1, 0)]

def occluders(a):
    """cream / white things drawn in FRONT of the numerals (gift boxes, hearts)"""
    r, g, b = rgb(a)
    mn = np.minimum(np.minimum(r, g), b); mx = np.maximum(np.maximum(r, g), b)
    occ = (mn > 150) & (mx-mn < 75)
    return cv2.dilate(occ.astype(np.uint8), np.ones((3, 3), np.uint8)).astype(bool)

# ---- scene 1 colours: glitter gold serif numeral on dark blue
def gold1(a):
    r, g, b = rgb(a)
    return (r > 62) & (r < 205) & (r-b > 18) & (g > 0.6*r) & (g < 0.9*r) & (b < 0.62*r)

# ---- scene 2 colours: bright foil balloon
def gold2(a, lo=0):
    r, g, b = rgb(a)
    return (r > 205-lo) & (g > 150-lo) & (b < 125) & (r-b > 105-lo)

def goldish(a, faded=False):
    r, g, b = rgb(a)
    if faded:
        return (r-b > 2) & (r > 40) & (g < 1.02*r)
    return (r-b > 18) & (r > 60) & (g < 0.97*r)

def text_mask(text, cx, top, height):
    f0 = ImageFont.truetype(FONT, 400)
    d0 = ImageDraw.Draw(Image.new('L', (10, 10)))
    bb = d0.textbbox((0, 0), text, font=f0)
    size = int(400 * height / (bb[3]-bb[1])) * SS
    f = ImageFont.truetype(FONT, size)
    bb = d0.textbbox((0, 0), text, font=f)
    im = Image.new('L', (W_*SS, H_*SS), 0)
    ImageDraw.Draw(im).text((cx*SS-(bb[0]+bb[2])/2, top*SS-bb[1]), text, font=f, fill=255)
    return soft(np.array(im))

def new_foil_shape(bx, sw):
    x0, y0, x1, y1 = bx
    hw = sw/2
    im = np.zeros((H_*SS, W_*SS), np.uint8)
    W = x1-x0; Hh = y1-y0
    gap = 0.03*W
    wd = (W-gap)/2
    def P(x, y): return (int(round(x*SS)), int(round(y*SS)))
    def seg(p, q):
        cv2.line(im, P(*p), P(*q), 255, int(round(sw*SS)), cv2.LINE_8)
        cv2.circle(im, P(*p), int(round(hw*SS)), 255, -1)
        cv2.circle(im, P(*q), int(round(hw*SS)), 255, -1)
    for d in range(2):
        xa = x0 + d*(wd+gap)
        xs = xa + 0.72*wd
        top = (xs, y0+hw); bot = (xs, y1-hw)
        left = (xa+hw, y0+0.66*Hh); right = (xa+wd-hw, y0+0.66*Hh)
        seg(top, bot); seg(top, left); seg(left, right)
    return soft(im)

def foil_style(a, m):
    dt = cv2.distanceTransform(m.astype(np.uint8), cv2.DIST_L2, 5)
    dmax = max(6.0, float(np.percentile(dt[m], 99)))
    nb = 10
    lut = np.zeros((nb, 3), np.float32)
    idx = np.clip((dt[m]/dmax*nb).astype(int), 0, nb-1)
    pix = a[m].astype(np.float32)
    for k in range(nb):
        sel = idx == k
        lut[k] = np.median(pix[sel], axis=0) if sel.sum() > 5 else (lut[k-1] if k else pix.mean(0))
    band = cv2.dilate(m.astype(np.uint8), np.ones((15, 15), np.uint8)).astype(bool) & ~m
    rimcol = np.median(a[band], axis=0).astype(np.float32) if band.sum() > 20 else lut[0]*0.7
    rimcol = np.minimum(rimcol, lut[0]) * 0.9
    return lut, rimcol, dmax

def paint_foil(new, lut, rimcol, sw, rim=7.0):
    nb = len(lut)
    hard = (new > 0.5).astype(np.uint8)
    dn = cv2.distanceTransform(hard, cv2.DIST_L2, 5)
    t = np.clip((dn-rim)/max(1.0, sw/2-rim), 0, 1)*(nb-1)
    k0 = np.floor(t).astype(int); k1 = np.minimum(k0+1, nb-1); fr = (t-k0)[..., None]
    col = lut[k0]*(1-fr) + lut[k1]*fr
    rimw = (np.clip(1-(dn-1)/rim, 0, 1)*(dn < rim))[..., None]
    return col*(1-rimw) + rimcol*rimw

def comps_top(m, n):
    k, lab, st, _ = cv2.connectedComponentsWithStats(m.astype(np.uint8), connectivity=8)
    order = sorted(range(1, k), key=lambda j: -st[j, cv2.CC_STAT_AREA])[:n]
    out = np.zeros(m.shape, bool)
    for j in order:
        out |= lab == j
    return out

def track_numeral(colour_fn, ref, bx, lo, hi, dx=30, dy=70):
    """translation tracking of a constant-size numeral from settled frame `ref`"""
    a = load(ref); m = colour_fn(a)
    box = np.zeros(m.shape, bool); box[bx[1]-6:bx[3]+7, bx[0]-6:bx[2]+7] = True
    tmpl_full = comps_top(m & box, 3).astype(np.uint8)
    Wg, Hg = bx[2]-bx[0], bx[3]-bx[1]
    tmpl = tmpl_full[bx[1]:bx[3]+1, bx[0]:bx[2]+1].astype(np.float32)
    pos = {ref: (bx[0], bx[1])}
    PAD = 500
    for direction in (1, -1):
        px, py = bx[0], bx[1]
        i = ref + direction
        while lo <= i < hi:
            a = load(i)
            cur = colour_fn(a)
            padded = np.zeros((H_+PAD, W_+2*PAD//5), np.float32)
            padded[:H_, :W_] = cur
            x_lo, x_hi = max(0, px-dx), min(padded.shape[1]-Wg-2, px+dx)
            y_lo, y_hi = max(-Hg+60, py-dy), min(H_+PAD-Hg-2, py+dy)
            win = padded[max(0, y_lo):y_hi+Hg+1, x_lo:x_hi+Wg+1]
            if y_lo < 0 or win.shape[0] <= Hg or win.shape[1] <= Wg or cur.sum() < 80:
                pos[i] = (px, py); i += direction; continue
            res = cv2.matchTemplate(win, tmpl, cv2.TM_CCORR)
            _, mx, _, loc = cv2.minMaxLoc(res)
            if mx >= 250:
                px, py = x_lo+loc[0], max(0, y_lo)+loc[1]
            pos[i] = (px, py)
            i += direction
    return pos, tmpl_full, Wg, Hg

def make_frame(a, i, scene, bx, style_mask, Wg, Hg, tmpl_foot, fixed):
    """returns (colour[H,W,3], alpha[H,W]) for the full frame"""
    px, py = bx[0], bx[1]
    foot = np.zeros(a.shape[:2], bool)
    foot[max(0, py-8):py+Hg+9, max(0, px-8):px+Wg+9] = True
    occ = occluders(a) if scene == 2 else np.zeros(a.shape[:2], bool)
    gish = goldish(a, faded=(scene == 1 and i >= 172)) & ~occ
    mk = style_mask & foot
    # old glyph: seed colours + footprint-limited gold-ish pixels (dark rim, faded parts)
    seed = cv2.dilate(mk.astype(np.uint8), np.ones((25, 25), np.uint8)).astype(bool)
    old = mk | (foot & gish & seed)
    if old.sum() < 600:
        old = old | (foot & gish)
    if old.sum() < (600 if scene == 2 or i < 172 else 120):
        return None
    if scene == 2:  # highlights inside the old numeral are not gift boxes
        filled = cv2.morphologyEx(old.astype(np.uint8), cv2.MORPH_CLOSE, np.ones((31, 31), np.uint8))
        occ = occ & ~cv2.dilate(filled, np.ones((9, 9), np.uint8)).astype(bool)
    if scene == 1:
        core = cv2.erode(mk.astype(np.uint8), np.ones((3, 3), np.uint8)).astype(bool)
        pix = a[core] if core.sum() > 200 else a[old]
        new = text_mask('44', px+Wg/2, py, Hg)
        new = new*(~(a.max(axis=2) < 26))
        rng = np.random.default_rng(i)
        tex = pix[rng.integers(0, len(pix), size=a.shape[:2])].astype(np.float32)
        col_new = cv2.GaussianBlur(tex, (0, 0), 0.6)
        md = cv2.dilate(old.astype(np.uint8)*255, np.ones((11, 11), np.uint8))
    else:
        lut, rimcol, dmax = foil_style(a, mk if mk.sum() > 500 else old)
        sw = fixed.setdefault('sw', 2*(dmax+7.0))
        new = new_foil_shape((px, py, px+Wg, py+Hg), sw)
        new = new*(~occ)
        col_new = paint_foil(new, lut, rimcol, sw)
        md = cv2.dilate(cv2.morphologyEx(old.astype(np.uint8)*255, cv2.MORPH_CLOSE, np.ones((17, 17), np.uint8)),
                        np.ones((33, 33), np.uint8))
    inp = cv2.inpaint(a, md, 7, cv2.INPAINT_TELEA).astype(np.float32)
    al = np.maximum(cv2.GaussianBlur(md, (3, 3), 0).astype(np.float32)/255, new)
    col = inp*(1-new[..., None]) + col_new*new[..., None]
    return col, al

def run():
    track = {}
    jobs = [
        (1, gold1, 100, (204, 614, 513, 845), 40, 182, [0], (150, 300, 580, 1280)),
        (2, gold2, 340, (253, 683, 501, 861), 236, 412, [], (200, 600, 570, 1280)),
    ]
    for scene, cf, ref, bx, lo, hi, extra, crop in jobs:
        pos, tmpl, Wg, Hg = track_numeral(cf, ref, bx, lo, hi)
        print('scene', scene, 'tracked', min(pos), max(pos), len(pos))
        fixed = {}
        frames = sorted(pos)
        if scene == 1:  # frame 0 is a still poster of the settled 50
            pos[0] = (bx[0]+ (pos[100][0]-bx[0]) , bx[1]); frames = [0] + frames
            pos[0] = pos[100] if False else pos[0]
        for i in frames:
            a = load(i)
            b = (pos[i][0], pos[i][1])
            style = cf(a)
            if scene == 2:
                style = style | (cf(a, 45) & (cv2.dilate(style.astype(np.uint8), np.ones((3, 3), np.uint8)).astype(bool) if False else True) & False)
            r = make_frame(a, i, scene, b, style, Wg, Hg, tmpl, fixed)
            if r is None:
                continue
            col, al = r
            x0, y0, x1, y1 = crop
            rgba = np.dstack([col, al*255])[y0:y1, x0:x1]
            cv2.imwrite(f'{OUT}/{scene}_{i:04d}.png', rgba.astype(np.uint8))
            track[i] = dict(crop=list(crop), s=scene, bb=[b[0], b[1], b[0]+Wg, b[1]+Hg])
    json.dump(track, open(os.path.join(HERE, '..', 'src', 'track.json'), 'w'))
    print(len(track), 'frames patched')

run()
