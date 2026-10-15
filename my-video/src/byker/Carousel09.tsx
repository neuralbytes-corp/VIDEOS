import React from "react";
import {
  AbsoluteFill,
  Img,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import "@fontsource/inter/latin-800.css";
import "@fontsource/inter/latin-900.css";
import "@fontsource/jetbrains-mono/latin-500.css";
import { V09_COMPARE, V09_RECS, V09_TIP } from "./video09";

// Carrusel de fotos para TikTok (estilo etiquetas sobre fondo): 1080x1920, una foto por frame.
const SANS = "Inter, sans-serif";
const MONO = "'JetBrains Mono', monospace";
const RED = "#ff2d1f";
const GREEN = "#3ddc84";

type Part = { t: string; red?: boolean };
type Slide = {
  bg: string;
  tag?: string;
  num?: string;
  title: string;
  desc: Part[];
  label: string;
  card: React.ReactNode;
};

const box = (bg: string, color: string): React.CSSProperties => ({
  display: "inline-block",
  background: bg,
  color,
  padding: "4px 22px 8px",
  fontFamily: SANS,
  fontWeight: 900,
  letterSpacing: "-0.045em",
  lineHeight: 1.1,
});

const Cols: React.FC<{
  cols: { k: string; v: string }[];
  hi?: number;
  small?: boolean;
}> = ({ cols, hi = 2, small }) => (
  <div
    style={{
      display: "flex",
      width: "100%",
      height: "100%",
      background: "#0b0b0d",
    }}
  >
    {cols.map((c, i) => (
      <div
        key={c.k}
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 14,
          borderLeft: i ? "2px solid rgba(255,255,255,0.18)" : "none",
          background: i === hi ? "rgba(61,220,132,0.14)" : "transparent",
        }}
      >
        <div
          style={{
            fontFamily: MONO,
            fontSize: 30,
            color: "#bbb",
          }}
        >
          iPhone
        </div>
        <div
          style={{
            fontFamily: SANS,
            fontWeight: 900,
            fontSize: 120,
            letterSpacing: "-0.05em",
            color: "#fff",
            lineHeight: 1,
          }}
        >
          {c.k}
        </div>
        <div
          style={{
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: small ? 40 : 52,
            letterSpacing: "-0.03em",
            textAlign: "center",
            color: i === hi ? GREEN : "#fff",
            padding: "0 10px",
          }}
        >
          {c.v}
        </div>
      </div>
    ))}
  </div>
);

const Rows: React.FC<{ rows: { a: string; b: string }[] }> = ({ rows }) => (
  <div
    style={{
      width: "100%",
      height: "100%",
      background: "#0b0b0d",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      gap: 26,
      padding: "0 46px",
      boxSizing: "border-box",
    }}
  >
    {rows.map((r) => (
      <div
        key={r.a}
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          gap: 20,
          borderBottom: "2px solid rgba(255,255,255,0.16)",
          paddingBottom: 14,
        }}
      >
        <div
          style={{
            fontFamily: MONO,
            fontSize: 30,
            color: "#bbb",
            textTransform: "uppercase",
          }}
        >
          {r.a}
        </div>
        <div
          style={{
            fontFamily: SANS,
            fontWeight: 900,
            fontSize: 62,
            letterSpacing: "-0.04em",
            color: "#fff",
          }}
        >
          {r.b}
        </div>
      </div>
    ))}
  </div>
);

const row = (i: number) => V09_COMPARE.rows[i];
const colsOf = (i: number) =>
  row(i).v.map((v, k) => ({ k: V09_COMPARE.cols[k], v }));

const GRADS = {
  warm: "radial-gradient(circle at 78% 40%,#7a6a52 0%,#2a2118 38%,#0c0a08 80%)",
  sky: "linear-gradient(180deg,#2f6fb3 0%,#7fb2e0 45%,#c7dff2 100%)",
  night: "radial-gradient(circle at 30% 30%,#242428,#050506 75%)",
  teal: "linear-gradient(180deg,#0c3b3f 0%,#0a1c1f 100%)",
  dusk: "linear-gradient(180deg,#2b2a55 0%,#b8574a 70%,#f0a15a 100%)",
  graph: "linear-gradient(180deg,#1b1b1f 0%,#0a0a0c 100%)",
};

const SLIDES: Slide[] = [
  {
    bg: GRADS.warm,
    title: "",
    desc: [],
    label: "",
    card: null,
  },
  {
    bg: GRADS.night,
    tag: "01/06",
    num: "01",
    title: "chip",
    desc: [
      { t: "el 13 y el 14 tienen A15, el 15 trae A16. " },
      { t: "el 13 sigue siendo muy fluido", red: true },
      { t: "." },
    ],
    label: "comparativa · iPhone 13 · 14 · 15",
    card: <Cols cols={colsOf(0)} />,
  },
  {
    bg: GRADS.sky,
    tag: "02/06",
    num: "02",
    title: "puerto",
    desc: [
      { t: "Lightning en el 13 y el 14. USB-C en el 15: " },
      { t: "un solo cable para todo", red: true },
      { t: "." },
    ],
    label: "comparativa · iPhone 13 · 14 · 15",
    card: <Cols cols={colsOf(1)} small />,
  },
  {
    bg: GRADS.graph,
    tag: "03/06",
    num: "03",
    title: "pantalla",
    desc: [
      { t: "notch en el 13 y el 14. " },
      { t: "Dynamic Island", red: true },
      { t: " en el 15." },
    ],
    label: "comparativa · iPhone 13 · 14 · 15",
    card: <Cols cols={colsOf(2)} small />,
  },
  {
    bg: GRADS.teal,
    tag: "04/06",
    num: "04",
    title: "cámara",
    desc: [
      { t: "12 MP en el 13 y el 14, con " },
      { t: "mejor luz baja en el 14", red: true },
      { t: ". el 15 sube a 48 MP." },
    ],
    label: "comparativa · cámara principal",
    card: <Cols cols={colsOf(3)} />,
  },
  {
    bg: GRADS.dusk,
    tag: "05/06",
    num: "05",
    title: "tu presupuesto",
    desc: [
      { t: "elige según lo que tienes: " },
      { t: "no pagues por lo que no vas a usar", red: true },
      { t: "." },
    ],
    label: "guía · cuál conviene",
    card: (
      <Rows
        rows={V09_RECS.map((r) => ({
          a: r.tag,
          b: r.model.replace("iPhone ", "iPhone "),
        }))}
      />
    ),
  },
  {
    bg: GRADS.night,
    tag: "06/06",
    num: "06",
    title: "antes de pagar",
    desc: [
      { t: "elijas el que elijas, " },
      { t: "revisa estas 3 cosas", red: true },
      { t: "." },
    ],
    label: "checklist · byker store",
    card: <Rows rows={V09_TIP.items.map((t) => ({ a: "ok", b: t }))} />,
  },
  {
    bg: GRADS.warm,
    title: "",
    desc: [],
    label: "",
    card: null,
  },
];

export const CAROUSEL09_COUNT = SLIDES.length;

const AnimCtx = React.createContext(false);

// Entrada con resorte; en fotos fijas (animate=false) se muestra tal cual.
const Pop: React.FC<{
  d: number;
  abs?: boolean;
  children: React.ReactNode;
}> = ({ d, abs, children }) => {
  const animate = React.useContext(AnimCtx);
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = animate
    ? spring({
        frame: f - d,
        fps,
        config: { damping: 13, stiffness: 170, mass: 0.7 },
      })
    : 1;
  const base: React.CSSProperties = abs
    ? { position: "absolute", left: 0, top: 0, right: 0, bottom: 0 }
    : {};
  return (
    <div
      style={{
        ...base,
        opacity: Math.min(1, s * 2),
        transform: `translateY(${(1 - s) * 60}px) scale(${0.96 + 0.04 * s})`,
        transformOrigin: "left top",
      }}
    >
      {children}
    </div>
  );
};

const Stagger: React.FC<{
  style: React.CSSProperties;
  start: number;
  step: number;
  children: React.ReactNode;
}> = ({ style, start, step, children }) => (
  <div style={style}>
    {React.Children.toArray(children).map((c, k) => (
      <Pop key={k} d={start + k * step}>
        {c}
      </Pop>
    ))}
  </div>
);

const Cover: React.FC = () => (
  <>
    <Img
      src={staticFile("byker/phone15.png")}
      style={{
        position: "absolute",
        right: -120,
        bottom: -60,
        width: 900,
        opacity: 0.55,
      }}
    />
    <Stagger
      start={2}
      step={8}
      style={{
        position: "absolute",
        left: 70,
        top: 330,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 10,
      }}
    >
      <div style={{ ...box("#0d0d0d", "#fff"), fontSize: 120 }}>
        lo que no te
      </div>
      <div style={{ ...box("#fff", "#111"), fontSize: 150 }}>dicen</div>
      <div style={{ display: "flex", gap: 14, alignItems: "baseline" }}>
        <span style={{ ...box("#0d0d0d", "#fff"), fontSize: 64 }}>sobre</span>
        <span style={{ ...box("#0d0d0d", RED), fontSize: 120 }}>estos</span>
      </div>
      <div style={{ ...box("#0d0d0d", RED), fontSize: 150 }}>iPhones</div>
      <div
        style={{
          marginTop: 20,
          background: "#0d0d0d",
          color: "#fff",
          fontFamily: MONO,
          fontSize: 34,
          padding: "6px 16px",
        }}
      >
        (13, 14 y 15. qué cambia de verdad.)
      </div>
    </Stagger>
  </>
);

const Cta: React.FC = () => (
  <>
    <Img
      src={staticFile("byker/phone14.png")}
      style={{
        position: "absolute",
        right: -100,
        bottom: -60,
        width: 900,
        opacity: 0.5,
      }}
    />
    <Stagger
      start={2}
      step={8}
      style={{
        position: "absolute",
        left: 70,
        top: 330,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 10,
      }}
    >
      <div style={{ ...box("#fff", "#111"), fontSize: 130 }}>dime tu</div>
      <div style={{ ...box("#0d0d0d", RED), fontSize: 150 }}>presupuesto</div>
      <div
        style={{
          marginTop: 24,
          background: "#0d0d0d",
          color: "#fff",
          fontFamily: MONO,
          fontSize: 36,
          padding: "8px 18px",
        }}
      >
        y te digo cuál iPhone te conviene
      </div>
      <div style={{ ...box("#fff", "#111"), fontSize: 76, marginTop: 24 }}>
        WhatsApp 944 180 362
      </div>
      <div
        style={{
          marginTop: 14,
          background: "#0d0d0d",
          color: "#fff",
          fontFamily: MONO,
          fontSize: 30,
          padding: "6px 16px",
        }}
      >
        Byker Store · importaciones · envíos a todo el Perú
      </div>
    </Stagger>
  </>
);

export const Carousel09: React.FC<{ i: number; animate?: boolean }> = ({
  i,
  animate = false,
}) => {
  const s = SLIDES[i] ?? SLIDES[0];
  const last = i === SLIDES.length - 1;
  return (
    <AnimCtx.Provider value={animate}>
      <AbsoluteFill style={{ background: s.bg }}>
        <AbsoluteFill
          style={{
            background:
              "linear-gradient(180deg,rgba(0,0,0,0.25) 0%,rgba(0,0,0,0) 30%,rgba(0,0,0,0.45) 100%)",
          }}
        />
        {i === 0 ? <Cover /> : last ? <Cta /> : null}
        {s.num ? (
          <>
            <div
              style={{
                position: "absolute",
                top: 130,
                right: 50,
                background: "#0d0d0d",
                color: "#fff",
                fontFamily: MONO,
                fontSize: 30,
                padding: "4px 14px",
              }}
            >
              {s.tag}
            </div>
            <Stagger
              start={4}
              step={9}
              style={{
                position: "absolute",
                left: 70,
                top: 230,
                width: 940,
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: 12,
              }}
            >
              <div style={{ ...box("#fff", "#111"), fontSize: 190 }}>
                {s.num}
              </div>
              <div style={{ ...box("#fff", "#111"), fontSize: 108 }}>
                {s.title}
              </div>
              <div
                style={{
                  marginTop: 14,
                  fontFamily: SANS,
                  fontWeight: 800,
                  fontSize: 50,
                  letterSpacing: "-0.03em",
                  lineHeight: 1.45,
                  color: "#111",
                }}
              >
                {s.desc.map((p, k) => (
                  <span
                    key={k}
                    style={{
                      background: "#fff",
                      color: p.red ? RED : "#111",
                      padding: "6px 14px",
                      boxDecorationBreak: "clone",
                      WebkitBoxDecorationBreak: "clone",
                    }}
                  >
                    {p.t}
                  </span>
                ))}
              </div>
              <div
                style={{
                  marginTop: 14,
                  background: "#0d0d0d",
                  color: "#fff",
                  fontFamily: MONO,
                  fontSize: 28,
                  padding: "4px 12px",
                }}
              >
                {s.label}
              </div>
            </Stagger>
            <Pop d={44} abs>
              <div
                style={{
                  position: "absolute",
                  left: 70,
                  top: 880,
                  width: 940,
                  height: 560,
                  border: "8px solid #fff",
                  boxShadow: "0 20px 50px rgba(0,0,0,0.45)",
                  overflow: "hidden",
                }}
              >
                {s.card}
              </div>
            </Pop>
          </>
        ) : null}
      </AbsoluteFill>
    </AnimCtx.Provider>
  );
};
