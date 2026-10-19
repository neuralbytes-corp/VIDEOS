// Video 1 — "Así llega tu iPhone desde que lo importamos". Textos editables.
export const V01_SCENES = {
  logo: { from: 0, duration: 90 },
  hook: { from: 75, duration: 150 },
  steps: { from: 210, duration: 480 },
  cta: { from: 675, duration: 225 },
};
export const V01_TOTAL = 900;

export const V01_HOOK = {
  line1: "Así llega tu iPhone",
  line2: "desde que lo importamos",
};

export const V01_STEPS_TITLE = "Nuestro proceso";
export const V01_STEPS: {
  icon: "globe" | "check" | "receipt" | "box";
  title: string;
  text: string;
}[] = [
  {
    icon: "globe",
    title: "Importamos directo",
    text: "Equipos traídos directamente del exterior",
  },
  {
    icon: "check",
    title: "Revisamos cada equipo",
    text: "Batería, pantalla, cámaras y estética, uno por uno",
  },
  {
    icon: "receipt",
    title: "Boleta de compra",
    text: "Para que registres tu equipo en lista blanca",
  },
  {
    icon: "box",
    title: "Entrega segura",
    text: "Bien empacado y listo para usar",
  },
];

export const V01_CTA = {
  title: "Síguenos",
  subtitle: "y aprende a comprar tu iPhone con confianza",
};
