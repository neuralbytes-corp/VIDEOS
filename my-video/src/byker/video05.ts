// Video 5 — Usos del iPhone 14 Pro (estilo UGC / POV, sin creador). Textos editables.
export const V05_SHOT = 150; // cada toma dura 5 s
export const V05_SCENES = {
  hook: { from: 0, duration: V05_SHOT },
  camera: { from: V05_SHOT, duration: V05_SHOT },
  feed: { from: V05_SHOT * 2, duration: V05_SHOT },
  selfie: { from: V05_SHOT * 3, duration: V05_SHOT },
  game: { from: V05_SHOT * 4, duration: V05_SHOT },
  charge: { from: V05_SHOT * 5, duration: V05_SHOT },
  cta: { from: V05_SHOT * 6, duration: 210 },
};
export const V05_TOTAL = V05_SHOT * 6 + 210;

export const V05_TAG = "iPhone 14 Pro · Negro espacial";

export const V05_CAPTIONS = {
  hook: ["POV: te llega tu", "iPhone 14 Pro"],
  camera: ["Cámara de 48 MP", "con zoom óptico 3x"],
  feed: ["Pantalla de 120 Hz", "scrolleas sin trabas"],
  selfie: ["Graba tus videos", "con muy buena calidad"],
  game: ["Chip A16 Bionic", "para tus juegos y apps"],
  charge: ["Batería 100%", "cubo y cable incluidos"],
};

export const V05_CTA_TITLE = "¿Lo quieres? Escríbenos";
export const V05_MUSIC_FILE = "byker/music-v05.wav";
export const V05_MUSIC_VOLUME = 0.55;
