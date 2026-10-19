// Video 7 — Versión "hype" de marketing de los usos del iPhone 14 Pro. Textos editables.
export const V07_BPM = 128;
export const V07_SHOT = 60; // cada toma dura 2 s
export const V07_HOOK = 75;
export const V07_SHOTS_FROM = V07_HOOK;
export const V07_OFFER_FROM = V07_SHOTS_FROM + V07_SHOT * 6;
export const V07_OFFER = 120;
export const V07_CTA_FROM = V07_OFFER_FROM + V07_OFFER;
export const V07_CTA = 165;
export const V07_TOTAL = V07_CTA_FROM + V07_CTA;

export const V07_HOOK_TEXT = {
  line1: "¿iPhone 14 Pro",
  line2: "a S/ 1,950?",
  sub: "Mira lo que incluye",
};

export const V07_STICKER = { top: "Precio promoción", price: "S/ 1,950" };

export const V07_MARQUEE =
  "ENVÍOS A TODO EL PERÚ  •  BOLETA PARA LISTA BLANCA  •  6 MESES DE GARANTÍA  •  BATERÍA 100%  •  ";

export const V07_OFFER_ITEMS = [
  { icon: "receipt", big: "Boleta", small: "para lista blanca" },
  { icon: "plug", big: "Accesorios", small: "cubo y cable" },
  { icon: "calendar", big: "6 meses", small: "de garantía" },
  { icon: "battery", big: "Batería 100%", small: "salud óptima" },
] as const;

export const V07_CTA_TITLE = "¿Lo quieres? Escríbenos ahora";
export const V07_MUSIC_FILE = "byker/music-v07.wav";
export const V07_MUSIC_VOLUME = 0.6;
