// Video 9 — iPhone 13 vs 14 vs 15: ¿cuál conviene según tu presupuesto? Textos editables.
export const V09_SCENES = {
  hook: { from: 0, duration: 90 },
  compare: { from: 80, duration: 210 },
  r1: { from: 280, duration: 150 },
  r2: { from: 420, duration: 150 },
  r3: { from: 560, duration: 150 },
  tip: { from: 700, duration: 100 },
  cta: { from: 790, duration: 200 },
};
export const V09_TOTAL = 990;

export const V09_HOOK = {
  l1: "Lo que naue te dice",
  l2: "sobre estos iPhones",
  models: ["13", "14", "15"],
};

export const V09_COMPARE = {
  title: "Qué cambia",
  cols: ["13", "14", "15"],
  rows: [
    { label: "Chip", v: ["A15", "A15", "A16"] },
    { label: "Puerto", v: ["Lightning", "Lightning", "USB-C"] },
    { label: "Pantalla", v: ["Notch", "Notch", "Dynamic Island"] },
    { label: "Cámara principal", v: ["12 MP", "12 MP", "48 MP"] },
  ],
};

export const V09_RECS = [
  {
    n: 1,
    tag: "Presupuesto ajustado",
    model: "iPhone 13",
    points: [
      "Chip A15: sigue muy fluido",
      "Buena cámara para el día a día",
      "Ideal si es tu primer iPhone",
    ],
  },
  {
    n: 2,
    tag: "El punto medio",
    model: "iPhone 14",
    points: [
      "Mejor cámara con poca luz",
      "Detección de choques",
      "Cámara frontal con autoenfoque",
    ],
  },
  {
    n: 3,
    tag: "Lo más nuevo",
    model: "iPhone 15",
    points: [
      "Cámara principal de 48 MP",
      "USB-C: un solo cable para todo",
      "Dynamic Island",
    ],
  },
] as const;

export const V09_TIP = {
  title: "Elijas el que elijas",
  items: ["Batería al 100%", "Boleta para lista blanca", "iCloud libre"],
};

export const V09_CTA_TITLE = "Dime tu presupuesto";
export const V09_MUSIC_FILE = "byker/music-v09.wav";
export const V09_MUSIC_VOLUME = 0.5;
