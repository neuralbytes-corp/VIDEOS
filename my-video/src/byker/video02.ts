// Video 2 — iPhone 14 Pro vs iPhone 15 Pro (diseño oscuro de los afiches).
export const V02_SCENES = {
  hook: { from: 0, duration: 150 },
  design: { from: 135, duration: 195 },
  port: { from: 315, duration: 180 },
  table: { from: 480, duration: 300 },
  includes: { from: 765, duration: 270 },
  price: { from: 1020, duration: 240 },
  cta: { from: 1245, duration: 255 },
};
export const V02_TOTAL = 1500;

export const V02_HOOK = {
  title: "¿Cuál es la diferencia entre",
  subtitle: "iPHONE 14 PRO y iPHONE 15 PRO?",
  a: "Negro espacial",
  b: "Negro titanio",
};

export const V02_DESIGN = {
  title: "Diseño y materiales",
  a: { name: "iPHONE 14 PRO", material: "Acero inoxidable", weight: "206 g" },
  b: { name: "iPHONE 15 PRO", material: "Titanio", weight: "187 g" },
  note: "El 15 Pro pesa 19 g menos y tiene bordes de pantalla más finos",
};

export const V02_PORT = {
  title: "El puerto de carga",
  a: {
    name: "iPhone 14 Pro",
    port: "Lightning",
    speed: "USB 2 · hasta 480 Mb/s",
  },
  b: { name: "iPhone 15 Pro", port: "USB-C", speed: "USB 3 · hasta 10 Gb/s" },
  note: "Con USB-C usas el mismo cable que tu laptop y otros equipos",
};

export const V02_TABLE = {
  title: "Cara a cara",
  rows: [
    { label: "Chip", a: "A16 Bionic", b: "A17 Pro" },
    { label: "Memoria RAM", a: "6 GB", b: "8 GB" },
    {
      label: "Botón lateral",
      a: "Interruptor de silencio",
      b: "Botón de acción",
    },
    { label: "Wi-Fi", a: "Wi-Fi 6", b: "Wi-Fi 6E" },
  ],
  sharedTitle: "Lo que comparten",
  shared: [
    "Pantalla 6.1″ 120 Hz",
    "Cámara principal 48 MP",
    "Zoom óptico 3x",
    "Dynamic Island",
  ],
};

// Lo que incluye cada equipo (tomado de tus afiches).
export const V02_INCLUDES_TITLE = "Incluye";
export const V02_INCLUDES: {
  icon: "receipt" | "plug" | "shield" | "calendar" | "battery";
  title: string;
  text: string;
}[] = [
  { icon: "receipt", title: "Boleta", text: "Para registrar en lista blanca" },
  { icon: "plug", title: "Accesorios", text: "Cubo y cable" },
  { icon: "shield", title: "Garantía", text: "Por defectos de fábrica" },
  { icon: "calendar", title: "6 meses", text: "De garantía" },
  { icon: "battery", title: "Batería 100%", text: "Salud óptima" },
];

// price: texto del precio. Deja "" para mostrar "Consulta tu precio".
export const V02_PRICE = {
  title: "¿Cuál elegir?",
  label: "Precio promoción",
  consult: "Consulta tu precio",
  a: {
    name: "iPHONE 14 PRO",
    storage: "256GB",
    color: "Negro espacial",
    price: "1,950",
    tag: "Ideal si quieres ahorrar",
  },
  b: {
    name: "iPHONE 15 PRO",
    storage: "256GB",
    color: "Negro titanio",
    price: "",
    tag: "Lo más nuevo: USB-C y titanio",
  },
  note: "Los dos son excelentes. Te asesoramos según tu presupuesto.",
};

export const V02_CTA = {
  title: "¿Quieres importar tu iPhone?",
  lead: "Realiza tu pedido",
  phone: "944 180 362",
  follow: "Síguenos en",
  handle: "Byker Store",
  trust: [
    "Productos 100% originales",
    "Envíos a todo el Perú",
    "Compra segura",
  ],
};

export const V02_MUSIC_VOLUME = 0.5;
