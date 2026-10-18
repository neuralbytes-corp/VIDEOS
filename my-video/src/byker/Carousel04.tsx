import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { GRADS, MONO, RED, GREEN, SANS, Rows, box } from "./Carousel09";

// Carrusel de fotos para TikTok: "Cómo revisamos la batería" (estilo etiquetas), 1080x1920.
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

const Ring: React.FC = () => (
  <div
    style={{
      width: "100%",
      height: "100%",
      background: "#0b0b0d",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 22,
    }}
  >
    <div
      style={{
        width: 340,
        height: 340,
        borderRadius: 170,
        border: `26px solid ${GREEN}`,
        boxShadow: `0 0 50px ${GREEN}66`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: SANS,
        fontWeight: 900,
        fontSize: 88,
        letterSpacing: "-0.05em",
        color: "#fff",
      }}
    >
      100%
    </div>
    <div style={{ fontFamily: MONO, fontSize: 30, color: "#bbb" }}>
      CAPACIDAD MÁXIMA
    </div>
  </div>
);

const Original: React.FC = () => (
  <div
    style={{
      width: "100%",
      height: "100%",
      background: "#0b0b0d",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      gap: 34,
      padding: "0 46px",
      boxSizing: "border-box",
    }}
  >
    {[
      { v: "Original de Apple", c: GREEN, m: "✓" },
      { v: "Desconocida", c: RED, m: "✗" },
    ].map((r) => (
      <div
        key={r.v}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          border: `4px solid ${r.c}`,
          padding: "30px 34px",
          fontFamily: SANS,
          fontWeight: 900,
          letterSpacing: "-0.04em",
          color: "#fff",
          fontSize: 54,
        }}
      >
        <span>
          Batería <span style={{ color: r.c }}>{r.v}</span>
        </span>
        <span style={{ color: r.c, fontSize: 70 }}>{r.m}</span>
      </div>
    ))}
  </div>
);

const Full: React.FC = () => (
  <div
    style={{
      width: "100%",
      height: "100%",
      background: "#0b0b0d",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 30,
    }}
  >
    <div
      style={{
        width: 520,
        height: 240,
        border: "14px solid #fff",
        borderRadius: 50,
        padding: 14,
        boxSizing: "border-box",
        position: "relative",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 26,
          background: `linear-gradient(180deg,#7ef0ae,${GREEN})`,
        }}
      />
    </div>
    <div
      style={{
        fontFamily: SANS,
        fontWeight: 900,
        fontSize: 150,
        letterSpacing: "-0.05em",
        color: GREEN,
        lineHeight: 1,
      }}
    >
      100%
    </div>
    <div style={{ fontFamily: MONO, fontSize: 28, color: "#ddd" }}>
      boleta para lista blanca · 6 meses de garantía
    </div>
  </div>
);

const SLIDES: Slide[] = [
  { bg: GRADS.warm, title: "", desc: [], label: "", card: null },
  {
    bg: GRADS.night,
    tag: "01/04",
    num: "01",
    title: "ajustes",
    desc: [
      { t: "entra a " },
      { t: "Ajustes, Batería y Salud de la batería", red: true },
      { t: "." },
    ],
    label: "paso a paso · iPhone",
    card: (
      <Rows
        rows={[
          { a: "paso 1", b: "Ajustes" },
          { a: "paso 2", b: "Batería" },
          { a: "paso 3", b: "Salud de la batería" },
        ]}
      />
    ),
  },
  {
    bg: GRADS.teal,
    tag: "02/04",
    num: "02",
    title: "capacidad máxima",
    desc: [
      { t: "mira el porcentaje. " },
      { t: "100% significa batería como nueva", red: true },
      { t: "." },
    ],
    label: "Ajustes › Batería › Salud",
    card: <Ring />,
  },
  {
    bg: GRADS.graph,
    tag: "03/04",
    num: "03",
    title: "que sea original",
    desc: [
      { t: "si dice " },
      { t: "«Desconocida»", red: true },
      { t: ", las cifras pueden fallar." },
    ],
    label: "Ajustes › General › Información",
    card: <Original />,
  },
  {
    bg: GRADS.dusk,
    tag: "04/04",
    num: "04",
    title: "en byker store",
    desc: [
      { t: "cada iPhone sale con la " },
      { t: "batería al 100%", red: true },
      { t: "." },
    ],
    label: "byker store · importaciones",
    card: <Full />,
  },
  { bg: GRADS.warm, title: "", desc: [], label: "", card: null },
];

export const CAROUSEL04_COUNT = SLIDES.length;

const Stack: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
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
    {children}
  </div>
);

const mono = (size: number): React.CSSProperties => ({
  marginTop: 20,
  background: "#0d0d0d",
  color: "#fff",
  fontFamily: MONO,
  fontSize: size,
  padding: "6px 16px",
});

const Cover: React.FC = () => (
  <>
    <Img
      src={staticFile("byker/phone14.png")}
      style={{
        position: "absolute",
        right: -120,
        bottom: -60,
        width: 900,
        opacity: 0.55,
      }}
    />
    <Stack>
      <div style={{ ...box("#0d0d0d", "#fff"), fontSize: 120 }}>¿te dicen</div>
      <div style={{ ...box("#fff", "#111"), fontSize: 150 }}>batería</div>
      <div style={{ ...box("#0d0d0d", RED), fontSize: 150 }}>al 100%?</div>
      <div style={mono(34)}>(compruébalo tú mismo en 3 pasos.)</div>
    </Stack>
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
    <Stack>
      <div style={{ ...box("#fff", "#111"), fontSize: 120 }}>
        pide tu iPhone
      </div>
      <div style={{ ...box("#0d0d0d", RED), fontSize: 104 }}>
        con batería 100%
      </div>
      <div style={mono(36)}>escríbenos y te ayudamos a elegir</div>
      <div style={{ ...box("#fff", "#111"), fontSize: 76, marginTop: 24 }}>
        WhatsApp 944 180 362
      </div>
      <div style={mono(30)}>
        Byker Store · importaciones · envíos a todo el Perú
      </div>
    </Stack>
  </>
);

export const Carousel04: React.FC<{ i: number }> = ({ i }) => {
  const s = SLIDES[i] ?? SLIDES[0];
  const last = i === SLIDES.length - 1;
  return (
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
          <div
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
            <div style={{ ...box("#fff", "#111"), fontSize: 190 }}>{s.num}</div>
            <div style={{ ...box("#fff", "#111"), fontSize: 100 }}>
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
          </div>
          <div
            style={{
              position: "absolute",
              left: 70,
              top: 900,
              width: 940,
              height: 560,
              border: "8px solid #fff",
              boxShadow: "0 20px 50px rgba(0,0,0,0.45)",
              overflow: "hidden",
            }}
          >
            {s.card}
          </div>
        </>
      ) : null}
    </AbsoluteFill>
  );
};
