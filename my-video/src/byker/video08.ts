// Video 8 — 5 cosas que debes revisar antes de comprar un iPhone. Textos editables.
export const V08_SCENES = {
  hook: { from: 0, duration: 135 },
  i1: { from: 125, duration: 195 },
  i2: { from: 310, duration: 195 },
  i3: { from: 495, duration: 195 },
  i4: { from: 680, duration: 195 },
  i5: { from: 865, duration: 195 },
  recap: { from: 1050, duration: 120 },
  cta: { from: 1160, duration: 225 },
};
export const V08_TOTAL = 1385;

export const V08_HOOK = {
  big: "5",
  line1: "cosas que debes",
  line2: "revisar antes de",
  line3: "comprar un iPhone",
};

export const V08_ITEMS = [
  {
    n: 1,
    title: "iCloud libre",
    how: "Que no pida el Apple ID de otra persona",
  },
  { n: 2, title: "IMEI", how: "Marca *#06#: debe coincidir con la caja" },
  { n: 3, title: "Face ID", how: "Configúralo: debe reconocerte al instante" },
  { n: 4, title: "Cámaras", how: "Prueba cada lente, en foto y en video" },
  {
    n: 5,
    title: "Batería y pantalla",
    how: "Salud de la batería y sin manchas ni fallas",
  },
] as const;

export const V08_ICLOUD = {
  good: "Inicia sesión en tu iPhone",
  bad: "Pide el ID de Apple de otro usuario",
  note: "Si pide una contraseña, no lo compres",
};
export const V08_IMEI = {
  code: "*#06#",
  chips: ["IMEI del iPhone", "= IMEI de la caja", "= IMEI de la bandeja SIM"],
  extra: "Y que esté en lista blanca",
};
export const V08_FACE = {
  path: "Ajustes › Face ID y código",
  ok: "Reconocido",
};
export const V08_CAM = {
  lenses: ["0.5x", "1x", "3x"],
  notes: ["Sin manchas en el lente", "Enfoca bien en foto y video"],
};
export const V08_BAT = {
  path: "Ajustes › Batería › Salud de la batería",
  cap: "Capacidad máxima",
  screen: "Pantalla sin manchas",
  screen2: "Táctil sin fallas",
};

export const V08_RECAP_TITLE = "Tu checklist";
export const V08_CTA_TITLE = "Compra con confianza";
export const V08_MUSIC_FILE = "byker/music-v08.wav";
export const V08_MUSIC_VOLUME = 0.5;
