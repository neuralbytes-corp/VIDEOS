import { GRADS, Rows } from "./Carousel09";
import type { Slide } from "./Carousel09";

// Video 7 — Qué significa "estética 10/10" y cómo calificamos. Textos editables.
const ok = (items: string[]) => (
  <Rows rows={items.map((b) => ({ a: "ok", b }))} />
);

export const SLIDES07: Slide[] = [
  { bg: GRADS.warm, title: "", desc: [], label: "", card: null },
  {
    bg: GRADS.night,
    tag: "01/04",
    num: "01",
    title: "pantalla",
    desc: [
      { t: "se revisa con luz y de cerca: " },
      { t: "sin rayones ni manchas", red: true },
      { t: "." },
    ],
    label: "cómo calificamos · pantalla",
    card: ok(["Sin rayones", "Sin manchas", "Táctil sin fallas"]),
  },
  {
    bg: GRADS.teal,
    tag: "02/04",
    num: "02",
    title: "marco y bordes",
    desc: [
      { t: "el marco dice mucho del uso: " },
      { t: "sin golpes ni abolladuras", red: true },
      { t: "." },
    ],
    label: "cómo calificamos · estructura",
    card: ok(["Sin golpes", "Sin abolladuras", "Bordes limpios"]),
  },
  {
    bg: GRADS.graph,
    tag: "03/04",
    num: "03",
    title: "parte trasera",
    desc: [
      { t: "vidrio trasero y lentes: " },
      { t: "sin marcas ni rajaduras", red: true },
      { t: "." },
    ],
    label: "cómo calificamos · cámaras",
    card: ok(["Vidrio sin marcas", "Lentes sin rayones", "Sin rajaduras"]),
  },
  {
    bg: GRADS.dusk,
    tag: "04/04",
    num: "04",
    title: "la escala",
    desc: [
      { t: "10/10 es el " },
      { t: "estado más alto", red: true },
      { t: ". cada punto menos, más marcas." },
    ],
    label: "escala de estética · byker store",
    card: (
      <Rows
        rows={[
          { a: "10/10", b: "Como nuevo" },
          { a: "9/10", b: "Detalles mínimos" },
          { a: "8/10", b: "Marcas leves de uso" },
        ]}
      />
    ),
  },
  { bg: GRADS.warm, title: "", desc: [], label: "", card: null },
];
