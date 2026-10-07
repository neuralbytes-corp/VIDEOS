// Video 4 — Cómo comprobar la batería de un iPhone (el 100%). Textos editables.
export const V04_SCENES = {
  hook: { from: 0, duration: 150 },
  step1: { from: 135, duration: 210 },
  step2: { from: 330, duration: 210 },
  step3: { from: 525, duration: 270 },
  byker: { from: 780, duration: 180 },
  cta: { from: 945, duration: 225 },
};
export const V04_TOTAL = 1170;

// Voz de ElevenLabs: pon true cuando hayas generado los mp3 con tools/make_voice.py
export const V04_VOICE_READY = false;
export const V04_VOICE_DIR = "byker/voz-v04";
export const V04_MUSIC_FILE = "byker/music-v04.wav";
// Con voz la música baja para que se entienda.
export const V04_MUSIC_VOLUME = V04_VOICE_READY ? 0.22 : 0.5;

export const V04_HOOK = {
  line1: "¿Te dicen",
  line2: "«batería",
  line3: "al 100%»?",
  sub: "Compruébalo tú mismo",
  cta: "Te enseño cómo",
};

export const V04_STEP1 = {
  n: "Paso 1",
  title: "Entra a Ajustes",
  chain: [
    { label: "Ajustes", icon: "gear" as const },
    { label: "Batería", icon: "battery" as const },
    { label: "Salud de la batería", icon: "check" as const },
  ],
  hint: "Toca «Salud de la batería»",
};

export const V04_STEP2 = {
  n: "Paso 2",
  title: "Mira la capacidad máxima",
  label: "Capacidad máxima",
  value: 100,
  note: "100% = batería como nueva",
};

export const V04_STEP3 = {
  n: "Paso 3",
  title: "Revisa que sea original",
  path: "Ajustes › General › Información",
  row: "Batería",
  good: "Original de Apple",
  bad: "Desconocida",
  warn: "Si dice «Desconocida», las cifras pueden no ser fiables",
};

export const V04_BYKER = {
  title: "En Byker Store",
  big: "100%",
  label: "Batería · Salud óptima",
  chips: ["Boleta para lista blanca", "6 meses de garantía"],
};

export const V04_CTA_TITLE = "Pide tu iPhone con batería 100%";
