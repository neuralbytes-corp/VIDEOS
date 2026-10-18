// Video 6 — Cinematográfico, elegante y sutil (iPhone 14 Pro, sin creador). Textos editables.
const OVERLAP = 24;
const D = {
  title: 100,
  hero: 170,
  macro: 170,
  screen: 170,
  edge: 160,
  reveal: 170,
  outro: 180,
};
const start = (prev: number, dur: number) => prev + dur - OVERLAP;
const hero0 = start(0, D.title);
const macro0 = start(hero0, D.hero);
const screen0 = start(macro0, D.macro);
const edge0 = start(screen0, D.screen);
const reveal0 = start(edge0, D.edge);
const outro0 = start(reveal0, D.reveal);

export const V06_SCENES = {
  title: { from: 0, duration: D.title },
  hero: { from: hero0, duration: D.hero },
  macro: { from: macro0, duration: D.macro },
  screen: { from: screen0, duration: D.screen },
  edge: { from: edge0, duration: D.edge },
  reveal: { from: reveal0, duration: D.reveal },
  outro: { from: outro0, duration: D.outro },
};
export const V06_TOTAL = outro0 + D.outro;
export const V06_FADE = OVERLAP;

export const V06_TEXT = {
  hero: { title: "iPhone 14 Pro", sub: "Negro espacial" },
  macro: { title: "Triple cámara", sub: "48 MP · zoom óptico 3x" },
  screen: { title: "Pantalla ProMotion", sub: "120 Hz · Dynamic Island" },
  edge: { title: "Acero inoxidable", sub: "Un acabado premium" },
  reveal: { title: "Batería al 100%", sub: "Salud óptima" },
  outro: {
    title: "Byker Store",
    lines: [
      "Boleta para lista blanca",
      "6 meses de garantía",
      "Envíos a todo el Perú",
    ],
    phone: "944 180 362",
  },
};

export const V06_MUSIC_FILE = "byker/music-v06.wav";
export const V06_MUSIC_VOLUME = 0.6;
