// Video 3 — Qué es la lista blanca y por qué importa. Textos editables.
export const V03_SCENES = {
  hook: { from: 0, duration: 150 },
  what: { from: 135, duration: 195 },
  steps: { from: 315, duration: 345 },
  alert: { from: 645, duration: 165 },
  receipt: { from: 795, duration: 195 },
  cta: { from: 975, duration: 225 },
};
export const V03_TOTAL = 1200;

export const V03_HOOK = {
  badge: "Alerta",
  line1: "No compres un",
  line2: "iPhone sin esto",
  stamp: "Bloqueado",
  caption: "Fuera de la lista blanca, tu equipo puede quedar sin señal",
};

export const V03_WHAT = {
  title: "¿Qué es la lista blanca?",
  text: "Es el registro oficial de los celulares autorizados para funcionar en las redes móviles del Perú.",
  rows: [
    { imei: "35 ••• ••• ••• 4821", ok: true, label: "Registrado" },
    { imei: "35 ••• ••• ••• 0937", ok: true, label: "Registrado" },
    { imei: "86 ••• ••• ••• 5512", ok: false, label: "No registrado" },
  ],
  warn: "Si no está registrado, puede ser bloqueado",
  source: "Fuente: Osiptel · Renteseg",
};

export const V03_STEPS = {
  title: "Revísalo en 3 pasos",
  tip: "Hazlo antes de pagar",
  one: { title: "Marca", code: "*#06#" },
  two: { title: "Copia tu IMEI", example: "IMEI 35 ••• ••• ••• 4821" },
  three: {
    title: "Consúltalo en Osiptel",
    url: "checatuimei.renteseg.osiptel.gob.pe",
  },
};

export const V03_ALERT = {
  title: "Cuidado con las páginas falsas",
  bad: { url: "ejemplo-consulta-imei.com", label: "No oficial" },
  good: { url: "checatuimei.renteseg.osiptel.gob.pe", label: "Sitio oficial" },
  text: "Cualquier otra web de «consulta IMEI» puede quedarse con tus datos.",
};

export const V03_RECEIPT = {
  title: "Pide siempre tu boleta",
  text: "En Byker Store tu iPhone sale con boleta para registrarlo en lista blanca.",
  chips: ["Boleta de compra", "Batería 100%", "6 meses de garantía"],
};

export const V03_CTA_TITLE = "Compra tu iPhone con confianza";
export const V03_MUSIC_VOLUME = 0.5;
