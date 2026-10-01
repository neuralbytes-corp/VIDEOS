"""Genera una pista original (libre de derechos) para el video 2.

Uso: python3 tools/make_music.py  ->  public/byker/music-v02.wav
Ritmo moderno suave: bombo, clap, hi-hat, bajo, pad y arpegio (Am-F-C-G, 104 BPM).
"""
import sys
import wave
import numpy as np

# Uso: python3 tools/make_music.py [nombre] [bpm] [compases]   (por defecto: v02 104 22)
NAME = sys.argv[1] if len(sys.argv) > 1 else "v02"
SR = 44100
BPM = int(sys.argv[2]) if len(sys.argv) > 2 else 104
BARS = int(sys.argv[3]) if len(sys.argv) > 3 else 22
BEAT = 60 / BPM
BAR = BEAT * 4
N = int(SR * BAR * BARS)
rng = np.random.default_rng(7)

out = np.zeros(N)


def add(buf, start_s, sig):
    i = int(start_s * SR)
    j = min(N, i + len(sig))
    if i < N:
        buf[i:j] += sig[: j - i]


def midi(n):
    return 440.0 * 2 ** ((n - 69) / 12)


def t_(dur):
    return np.arange(int(SR * dur)) / SR


def kick():
    t = t_(0.35)
    f = 45 + 110 * np.exp(-t * 28)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * np.exp(-t * 9) * 0.95


def clap():
    t = t_(0.22)
    n = rng.standard_normal(len(t))
    n = np.diff(n, prepend=0)  # pasa-altos simple
    env = np.exp(-t * 28) + 0.6 * np.exp(-((t - 0.012) * 600) ** 2)
    return n * env * 0.22


def hat(open_=False):
    t = t_(0.18 if open_ else 0.06)
    n = np.diff(rng.standard_normal(len(t)), n=2, prepend=[0, 0])
    return n * np.exp(-t * (14 if open_ else 70)) * 0.10


def bass(freq, dur):
    t = t_(dur)
    s = np.sin(2 * np.pi * freq * t) + 0.35 * np.sin(4 * np.pi * freq * t)
    env = np.minimum(1, t * 120) * np.exp(-t * 3.2)
    return s * env * 0.34


def pluck(freq, dur=0.5):
    t = t_(dur)
    s = sum(np.sin(2 * np.pi * freq * k * t) / k**1.4 for k in range(1, 6))
    return s * np.exp(-t * 7) * np.minimum(1, t * 300) * 0.11


def pad(freqs, dur):
    t = t_(dur)
    s = np.zeros_like(t)
    for f in freqs:
        for det in (-0.004, 0.0, 0.004):
            ff = f * (1 + det)
            s += np.sin(2 * np.pi * ff * t) + 0.3 * np.sin(4 * np.pi * ff * t)
    env = np.minimum(1, t / 0.5) * np.minimum(1, (dur - t) / 0.6)
    return s * env * 0.030


# Am - F - C - G
chords = [
    (45, [57, 60, 64]),  # Am: raíz bajo, notas
    (41, [53, 57, 60]),  # F
    (36, [55, 60, 64]),  # C
    (43, [55, 59, 62]),  # G
]

for bar in range(BARS):
    t0 = bar * BAR
    root, notes = chords[bar % 4]
    # pad toda la pista
    add(out, t0, pad([midi(n) for n in notes], BAR + 0.3))
    if bar >= 1:  # bajo en corcheas sincopadas
        for k, off in enumerate([0, 1.5, 2, 3.25]):
            add(out, t0 + off * BEAT, bass(midi(root), BEAT * 0.9))
    # batería
    if bar >= 1:
        for b in (0, 1, 2, 3) if BPM >= 118 else (0, 2):
            add(out, t0 + b * BEAT, kick())
        if bar >= 3:
            add(out, t0 + 3.5 * BEAT, kick() * 0.6)
        for k in range(8):
            add(out, t0 + k * BEAT / 2, hat(open_=(k % 4 == 3)))
    if bar >= 2:
        for b in (1, 3):
            add(out, t0 + b * BEAT, clap())
    # arpegio
    if bar >= 2:
        seq = [notes[0] + 12, notes[1] + 12, notes[2] + 12, notes[1] + 12]
        for k in range(16):
            if k % 2 == 0 or bar % 2 == 1:
                add(out, t0 + k * BEAT / 4, pluck(midi(seq[k % 4] + (12 if k % 8 == 7 else 0))))

# impacto inicial para el gancho (solo pistas rápidas)
if BPM >= 118:
    tb = t_(1.2)
    boom = np.sin(2 * np.pi * (38 + 90 * np.exp(-tb * 9)) * tb) * np.exp(-tb * 3.2)
    add(out, 0, boom * 1.1)

# eco simple para dar espacio
echo = np.zeros(N)
d = int(SR * BEAT * 0.75)
echo[d:] = out[:-d] * 0.28
out = out + echo

out = np.tanh(out * 1.3)
out = out / np.max(np.abs(out)) * 0.8
pcm = (out * 32767).astype(np.int16)
with wave.open(f"public/byker/music-{NAME}.wav", "wb") as w:
    w.setnchannels(1)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print("ok", N / SR, "s")
