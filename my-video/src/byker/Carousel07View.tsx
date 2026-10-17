import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { MONO, RED, SANS, box } from "./Carousel09";
import { SLIDES07 as SLIDES } from "./Carousel07";

// Carrusel de fotos para TikTok: "Qué significa estética 10/10" (estilo etiquetas), 1080x1920.

export const CAROUSEL07_COUNT = SLIDES.length;

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
      <div style={{ ...box("#0d0d0d", "#fff"), fontSize: 120 }}>
        así calificamos
      </div>
      <div style={{ ...box("#fff", "#111"), fontSize: 150 }}>el estado</div>
      <div style={{ ...box("#0d0d0d", RED), fontSize: 112 }}>
        de cada iPhone
      </div>
      <div style={mono(34)}>(estética 10/10: qué significa de verdad.)</div>
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
      <div style={{ ...box("#fff", "#111"), fontSize: 120 }}>elige con</div>
      <div style={{ ...box("#0d0d0d", RED), fontSize: 104 }}>confianza</div>
      <div style={mono(36)}>pregunta por el estado de tu iPhone</div>
      <div style={{ ...box("#fff", "#111"), fontSize: 76, marginTop: 24 }}>
        WhatsApp 944 180 362
      </div>
      <div style={mono(30)}>
        Byker Store · importaciones · envíos a todo el Perú
      </div>
    </Stack>
  </>
);

export const Carousel07View: React.FC<{ i: number }> = ({ i }) => {
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
