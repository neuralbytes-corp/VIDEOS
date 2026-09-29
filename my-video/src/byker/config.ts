// Textos editables del video. Ajusta aquí lo que quieras antes de renderizar.
export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

export const SCENES = {
  logo: { from: 0, duration: 120 },
  hero: { from: 105, duration: 240 },
  trust: { from: 330, duration: 345 },
  cta: { from: 660, duration: 240 },
};
export const TOTAL_FRAMES = 900;

export const HERO = {
  eyebrow: "BYKER STORE · IMPORTACIONES",
  line1: "Tu próximo iPhone,",
  line2: "con total confianza.",
};

export const TRUST_TITLE = "Por qué comprar con nosotros";
export const TRUST_POINTS: {
  icon: "shield" | "box" | "check" | "chat";
  title: string;
  text: string;
}[] = [
  {
    icon: "check",
    title: "Equipos originales",
    text: "Revisados uno por uno antes de la entrega",
  },
  {
    icon: "shield",
    title: "Garantía respaldada",
    text: "Compra segura y con soporte después de la venta",
  },
  {
    icon: "box",
    title: "Importación directa",
    text: "Te lo enviamos bien empacado y con seguimiento",
  },
  {
    icon: "chat",
    title: "Atención personalizada",
    text: "Te asesoramos hasta que elijas el iPhone ideal",
  },
];

export const CTA = {
  title: "Escríbenos hoy",
  subtitle: "y te ayudamos a elegir tu iPhone",
  button: "Síguenos en TikTok",
  footer: "Importaciones · Compra con confianza",
  // Opcional: pon aquí tu usuario (por ejemplo "@bykerstore"). Vacío = no se muestra.
  handle: "",
};

export const COLORS = {
  bg: "#f4f4f6",
  bgDeep: "#e7e7ea",
  ink: "#0b0b0d",
  soft: "#5b5b63",
  line: "rgba(0,0,0,0.08)",
};
