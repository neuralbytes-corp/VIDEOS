import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { MONO, RED, SANS, box } from "./Carousel09";
import { GRADS } from "./Carousel09";

// Video 7 (edición profesional): revelados con máscara, movimientos encadenados,
// un objeto que se transforma para entrar a la siguiente escena, y todo sincronizado con la voz.
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const GREEN = "#3ddc84";
const FPS30 = 30;
export const V07C_TOTAL = 915;
const MUSIC = "byker/music-v10.wav";
const MUSIC_VOL = 0.2;

// Inicio de cada línea de voz (frames) y límites visuales de cada escena.
const L = { l1: 9, l2: 112, l3: 300, l4: 435, l5: 585, l6: 745 };
const B = [0, 100, 292, 428, 578, 740, 915];
const VOICE = [
  { id: "01", frame: L.l1 },
  { id: "02", frame: L.l2 },
  { id: "03", frame: L.l3 },
  { id: "04", frame: L.l4 },
  { id: "05", frame: L.l5 },
  { id: "06", frame: L.l6 },
];
// segundos dentro de cada línea (medidos sobre el audio) -> frame absoluto
const at = (line: number, s: number) => Math.round(line + s * FPS30);

const easeIO = Easing.inOut(Easing.cubic);
const easeOut = Easing.out(Easing.cubic);

const pop = (f: number, t: number, amp = 0.16) =>
  f < t ? 1 : 1 + amp * Math.exp(-(f - t) / 5);

// ---------- Fondo de color por escena ----------
const BGS = [
  GRADS.warm,
  GRADS.night,
  GRADS.teal,
  GRADS.graph,
  GRADS.dusk,
  GRADS.warm,
];
const Backdrop: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      {BGS.map((bg, i) => (
        <AbsoluteFill
          key={i}
          style={{
            background: bg,
            opacity:
              i === 0 ? 1 : interpolate(f, [B[i] - 1, B[i]], [0, 1], clamp),
          }}
        />
      ))}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg,rgba(0,0,0,0.25) 0%,rgba(0,0,0,0) 30%,rgba(0,0,0,0.45) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

// ---------- iPhone siempre de fondo (con golpes de cámara en cada corte) ----------
const PhoneBg: React.FC = () => {
  const f = useCurrentFrame();
  const bob = Math.sin(f / 26) * 18;
  const rot = Math.sin(f / 41) * 1.6 - 4;
  let kick = 0;
  for (const b of B)
    if (f >= b) kick = Math.max(kick, 0.07 * Math.exp(-(f - b) / 8));
  const zoom = 1 + (f / V07C_TOTAL) * 0.1 + kick;
  const rise = interpolate(f, [0, 30], [0, 1], { ...clamp, easing: easeOut });
  const swap = interpolate(f, [420, 440], [0, 1], clamp);
  const sweepX = interpolate((f % 120) / 120, [0, 1], [-700, 1400]);
  const img = (src: string, o: number) => (
    <Img
      src={staticFile(src)}
      style={{ position: "absolute", left: 0, top: 0, width: 980, opacity: o }}
    />
  );
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          right: -170,
          bottom: -220 + (1 - rise) * 600 - bob,
          width: 980,
          height: 1800,
          transform: `rotate(${rot}deg) scale(${zoom})`,
          transformOrigin: "50% 100%",
          opacity: 0.6,
        }}
      >
        {img("byker/phone14.png", 1 - swap)}
        {img("byker/phone15.png", swap)}
        <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
          <div
            style={{
              position: "absolute",
              top: -200,
              left: sweepX,
              width: 160,
              height: 2400,
              background:
                "linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,0.28),rgba(255,255,255,0))",
              transform: "rotate(18deg)",
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- Texto que se revela desde una máscara ----------
const Mask: React.FC<{
  t: number;
  from?: "bottom" | "top" | "left";
  style: React.CSSProperties;
  children: React.ReactNode;
  dur?: number;
}> = ({ t, from = "bottom", style, children, dur = 12 }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [t, t + dur], [0, 1], { ...clamp, easing: easeOut });
  const hidden = f < t;
  const off =
    from === "bottom"
      ? `translateY(${(1 - p) * 115}%)`
      : from === "top"
        ? `translateY(${(p - 1) * 115}%)`
        : `translateX(${(p - 1) * 105}%)`;
  return (
    <div
      style={{
        ...style,
        overflow: "hidden",
        visibility: hidden ? "hidden" : "visible",
      }}
    >
      <div style={{ transform: off }}>{children}</div>
    </div>
  );
};

// ---------- Objeto que se transforma entre escenas ----------
type Rect = { x: number; y: number; w: number; h: number };
const FULL: Rect = { x: 0, y: 0, w: 1080, h: 1920 };
const R_NUM: Rect = { x: 70, y: 230, w: 280, h: 225 };
const R_TEN: Rect = { x: 70, y: 880, w: 450, h: 180 };
const R_CTA: Rect = { x: 70, y: 330, w: 600, h: 170 };
const lerpRect = (a: Rect, b: Rect, p: number): Rect => ({
  x: a.x + (b.x - a.x) * p,
  y: a.y + (b.y - a.y) * p,
  w: a.w + (b.w - a.w) * p,
  h: a.h + (b.h - a.h) * p,
});
const NUMS = ["01", "02", "03", "04"];

const Morph: React.FC = () => {
  const f = useCurrentFrame();
  const g = (a: number, b: number) =>
    interpolate(f, [a, b], [0, 1], { ...clamp, easing: easeIO });
  let rect: Rect | null = null;
  let label = "";
  let dark = 0;
  // cover -> c1 (el 10/10 crece hasta cubrir todo)
  if (f >= B[1] - 14 && f < B[1]) {
    rect = lerpRect(R_TEN, FULL, g(B[1] - 14, B[1]));
    dark = 1 - g(B[1] - 14, B[1]);
  }
  for (let k = 1; k <= 4; k++) {
    const s = B[k];
    const e = B[k + 1];
    if (f >= s && f < s + 16) {
      rect = lerpRect(FULL, R_NUM, g(s, s + 16));
      label = NUMS[k - 1];
    } else if (f >= s + 16 && f < e - 14) {
      rect = R_NUM;
      label = NUMS[k - 1];
    } else if (f >= e - 14 && f < e) {
      rect = lerpRect(R_NUM, FULL, g(e - 14, e));
      label = NUMS[k - 1];
    }
  }
  if (f >= B[5] && f < B[5] + 16) {
    rect = lerpRect(FULL, R_CTA, g(B[5], B[5] + 16));
    label = "elige con";
  } else if (f >= B[5] + 16) {
    rect = R_CTA;
    label = "elige con";
  }
  if (!rect) return null;
  const big = rect.h > 500;
  const fs = label === "elige con" ? 120 : rect.h * 0.9;
  const col = Math.round(255 * (1 - dark * 0.95));
  return (
    <div
      style={{
        position: "absolute",
        left: rect.x,
        top: rect.y,
        width: rect.w,
        height: rect.h,
        background: `rgb(${col},${col},${col})`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {!big ? (
        <span
          style={{
            fontFamily: SANS,
            fontWeight: 900,
            letterSpacing: "-0.045em",
            fontSize: Math.min(fs, 190),
            color: "#111",
            lineHeight: 1,
            whiteSpace: "nowrap",
            paddingBottom: label === "elige con" ? 6 : 12,
          }}
        >
          {label}
        </span>
      ) : null}
    </div>
  );
};

// ---------- Portada ----------
const Cover: React.FC = () => {
  const f = useCurrentFrame();
  if (f >= B[1] - 14) return null;
  const t1 = at(L.l1, 0.03);
  const t2 = at(L.l1, 1.4);
  const t3 = at(L.l1, 1.9);
  const t4 = at(L.l1, 2.1);
  const t5 = at(L.l1, 2.4);
  const line = (bg: string, c: string, size: number): React.CSSProperties => ({
    ...box(bg, c),
    fontSize: size,
  });
  return (
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
      <Mask t={t1} from="left" style={line("#0d0d0d", "#fff", 120)}>
        así calificamos
      </Mask>
      <Mask t={t2} from="left" style={line("#fff", "#111", 150)}>
        <span
          style={{
            display: "inline-block",
            transform: `scale(${pop(f, t2, 0.06)})`,
          }}
        >
          el estado
        </span>
      </Mask>
      <div style={{ display: "flex", gap: 14, alignItems: "baseline" }}>
        <Mask t={t3} from="bottom" style={line("#0d0d0d", "#fff", 64)}>
          de cada
        </Mask>
        <Mask t={t4} from="bottom" style={line("#0d0d0d", RED, 120)}>
          <span
            style={{
              display: "inline-block",
              transform: `scale(${pop(f, t4, 0.1)})`,
            }}
          >
            iPhone
          </span>
        </Mask>
      </div>
      <Mask
        t={t5}
        from="bottom"
        style={{
          ...line("#0d0d0d", RED, 150),
          width: 450,
          height: 180,
          boxSizing: "border-box",
          padding: "0 22px",
        }}
      >
        10/10
      </Mask>
      <Mask
        t={t5 + 4}
        from="left"
        style={{
          marginTop: 20,
          background: "#0d0d0d",
          color: "#fff",
          fontFamily: MONO,
          fontSize: 32,
          padding: "6px 16px",
        }}
      >
        (estética 10/10: qué significa de verdad.)
      </Mask>
    </div>
  );
};

// ---------- Escenas de contenido ----------
type Row = { text: string; t: number };
type Desc = { t: string; red?: boolean };
type Scene = {
  idx: number; // 1..4
  line: number;
  title: string;
  titleAt: number;
  desc: Desc[];
  emphAt: number; // frame del énfasis de la frase roja
  label: string;
  rows: Row[];
  endEmph: number;
};

const CONTENT: Scene[] = [
  {
    idx: 1,
    line: L.l2,
    title: "pantalla",
    titleAt: at(L.l2, 0.75),
    desc: [
      { t: "se revisa con luz y de cerca: " },
      { t: "sin rayones ni manchas", red: true },
      { t: "." },
    ],
    emphAt: at(L.l2, 2.1),
    label: "cómo calificamos · pantalla",
    rows: [
      { text: "Sin rayones", t: at(L.l2, 2.1) },
      { text: "Sin manchas", t: at(L.l2, 3.15) },
      { text: "Táctil sin fallas", t: at(L.l2, 3.9) },
    ],
    endEmph: at(L.l2, 4.95),
  },
  {
    idx: 2,
    line: L.l3,
    title: "marco y bordes",
    titleAt: at(L.l3, 1.0),
    desc: [
      { t: "el marco dice mucho del uso: " },
      { t: "sin golpes ni abolladuras", red: true },
      { t: "." },
    ],
    emphAt: at(L.l3, 2.25),
    label: "cómo calificamos · estructura",
    rows: [
      { text: "Sin golpes", t: at(L.l3, 2.25) },
      { text: "Sin abolladuras", t: at(L.l3, 2.9) },
      { text: "Bordes limpios", t: at(L.l3, 3.5) },
    ],
    endEmph: at(L.l3, 3.5),
  },
  {
    idx: 3,
    line: L.l4,
    title: "parte trasera",
    titleAt: at(L.l4, 1.3),
    desc: [
      { t: "vidrio trasero y lentes: " },
      { t: "sin marcas ni rajaduras", red: true },
      { t: "." },
    ],
    emphAt: at(L.l4, 3.5),
    label: "cómo calificamos · cámaras",
    rows: [
      { text: "Vidrio sin marcas", t: at(L.l4, 2.35) },
      { text: "Lentes sin rayones", t: at(L.l4, 3.0) },
      { text: "Sin rajaduras", t: at(L.l4, 3.55) },
    ],
    endEmph: at(L.l4, 3.9),
  },
  {
    idx: 4,
    line: L.l5,
    title: "la escala",
    titleAt: at(L.l5, 0.3),
    desc: [
      { t: "10/10 es el " },
      { t: "estado más alto", red: true },
      { t: ". cada punto menos, más marcas." },
    ],
    emphAt: at(L.l5, 2.7),
    label: "escala de estética · byker store",
    rows: [
      { text: "10/10  Como nuevo", t: at(L.l5, 1.07) },
      { text: "9/10  Detalles mínimos", t: at(L.l5, 3.5) },
      { text: "8/10  Marcas leves de uso", t: at(L.l5, 4.0) },
    ],
    endEmph: at(L.l5, 2.7),
  },
];

const Check: React.FC<{ p: number }> = ({ p }) => (
  <svg
    width="54"
    height="54"
    viewBox="0 0 24 24"
    fill="none"
    stroke={GREEN}
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path
      d="M4 12.5 10 18.5 20 6"
      strokeDasharray="24"
      strokeDashoffset={24 * (1 - p)}
    />
  </svg>
);

const ContentScene: React.FC<{ s: Scene; start: number; end: number }> = ({
  s,
  start,
  end,
}) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (f < start || f >= end) return null;
  const sp = (d: number, damping = 14, stiff = 150) =>
    spring({
      frame: f - d,
      fps,
      config: { damping, stiffness: stiff, mass: 0.7 },
    });
  // título: sale de debajo de la caja del número (la "empuja" hacia abajo)
  const tp = interpolate(f, [s.titleAt - 6, s.titleAt + 8], [0, 1], {
    ...clamp,
    easing: easeOut,
  });
  const descP = interpolate(f, [s.titleAt + 4, s.titleAt + 16], [0, 1], {
    ...clamp,
    easing: easeOut,
  });
  const labP = Math.floor(
    interpolate(f, [s.titleAt + 8, s.titleAt + 30], [0, s.label.length], clamp),
  );
  const cardP = interpolate(f, [start + 18, start + 34], [0, 1], {
    ...clamp,
    easing: easeOut,
  });
  const flash = f >= s.endEmph ? Math.exp(-(f - s.endEmph) / 7) : 0;
  const emph = f >= s.emphAt;
  return (
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
          opacity: interpolate(f, [start + 10, start + 18], [0, 1], clamp),
        }}
      >
        {`0${s.idx}/04`}
      </div>
      <div
        style={{
          position: "absolute",
          left: 70,
          top: 230 + 225 - 215 * (1 - tp),
          width: 940,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 12,
          // el título queda por detrás del número y se desliza hacia abajo
          clipPath: `inset(${(1 - tp) * 100}% 0 0 0)`,
        }}
      >
        <div style={{ ...box("#fff", "#111"), fontSize: 108, marginTop: 12 }}>
          {s.title}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 70,
          top: 230 + 225 + 12 + 150,
          width: 940,
          opacity: descP,
          transform: `translateY(${(1 - descP) * 26}px)`,
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
              background: p.red && emph ? RED : "#fff",
              color: p.red ? (emph ? "#fff" : RED) : "#111",
              padding: "6px 14px",
              display: "inline",
              boxDecorationBreak: "clone",
              WebkitBoxDecorationBreak: "clone",
            }}
          >
            {p.t}
          </span>
        ))}
        <div
          style={{
            marginTop: 14,
            background: "#0d0d0d",
            color: "#fff",
            fontFamily: MONO,
            fontSize: 28,
            padding: "4px 12px",
            display: "table",
            letterSpacing: 0,
            fontWeight: 500,
          }}
        >
          {s.label.slice(0, labP)}
          <span style={{ opacity: labP < s.label.length ? 1 : 0 }}>▌</span>
        </div>
      </div>
      {/* tarjeta: se revela con máscara; las filas se empujan unas a otras */}
      <div
        style={{
          position: "absolute",
          left: 70,
          top: 900,
          width: 940,
          height: 560,
          border: "8px solid #fff",
          background: "#0b0b0d",
          boxShadow: `0 20px 50px rgba(0,0,0,0.45),0 0 ${60 * flash}px rgba(61,220,132,${0.8 * flash})`,
          clipPath: `inset(0 ${(1 - cardP) * 100}% 0 0)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          justifyContent: "center",
          padding: "0 40px",
          boxSizing: "border-box",
          overflow: "hidden",
        }}
      >
        {s.rows.map((r, i) => {
          const p = sp(r.t - 8, 13, 160);
          const hit = f >= r.t ? Math.exp(-(f - r.t) / 8) : 0;
          return (
            <div
              key={r.text}
              style={{
                height: 140 * Math.min(1, p),
                overflow: "hidden",
                opacity: Math.min(1, p * 1.5),
              }}
            >
              <div
                style={{
                  height: 116,
                  marginTop: 12,
                  display: "flex",
                  alignItems: "center",
                  gap: 26,
                  border: `3px solid rgba(61,220,132,${0.35 + 0.65 * hit})`,
                  background: `rgba(61,220,132,${0.05 + 0.2 * hit})`,
                  padding: "0 28px",
                  transform: `translateX(${(1 - Math.min(1, p)) * 160}px) scale(${1 + 0.04 * hit})`,
                }}
              >
                <Check p={interpolate(f, [r.t, r.t + 8], [0, 1], clamp)} />
                <span
                  style={{
                    fontFamily: SANS,
                    fontWeight: 900,
                    letterSpacing: "-0.04em",
                    fontSize: 56,
                    color: "#fff",
                    whiteSpace: "nowrap",
                  }}
                >
                  {r.text}
                </span>
              </div>
              <span style={{ display: "none" }}>{i}</span>
            </div>
          );
        })}
      </div>
    </>
  );
};

// ---------- Cierre ----------
const Cta: React.FC = () => {
  const f = useCurrentFrame();
  if (f < B[5]) return null;
  const t = (s: number) => at(L.l6, s);
  const chunk = (txt: string, ts: number) => (
    <Mask
      key={txt}
      t={ts}
      from="bottom"
      style={{ ...box("#fff", "#111"), fontSize: 112 }}
    >
      <span
        style={{
          display: "inline-block",
          transform: `scale(${pop(f, ts, 0.14)})`,
        }}
      >
        {txt}
      </span>
    </Mask>
  );
  const fin = f >= t(3.6) ? 1 + 0.03 * Math.sin((f - t(3.6)) / 3) : 1;
  return (
    <div style={{ position: "absolute", left: 70, top: 0, width: 940 }}>
      <Mask
        t={B[5] + 12}
        from="left"
        style={{
          ...box("#0d0d0d", RED),
          fontSize: 150,
          position: "absolute",
          top: 510,
        }}
      >
        confianza
      </Mask>
      <Mask
        t={t(0.6)}
        from="left"
        style={{
          position: "absolute",
          top: 710,
          background: "#0d0d0d",
          color: "#fff",
          fontFamily: MONO,
          fontSize: 34,
          padding: "6px 16px",
        }}
      >
        pregunta por el estado de tu iPhone
      </Mask>
      <Mask
        t={t(0.05)}
        from="left"
        style={{
          position: "absolute",
          top: 810,
          background: "#25d366",
          color: "#062b13",
          fontFamily: SANS,
          fontWeight: 900,
          letterSpacing: "-0.03em",
          fontSize: 56,
          padding: "2px 22px 6px",
        }}
      >
        WhatsApp
      </Mask>
      <div
        style={{
          position: "absolute",
          top: 910,
          display: "flex",
          gap: 18,
          transform: `scale(${fin})`,
          transformOrigin: "0 50%",
        }}
      >
        {chunk("944", t(0.55))}
        {chunk("180", t(1.4))}
        {chunk("362", t(2.45))}
      </div>
      <Mask
        t={t(1.2)}
        from="left"
        style={{
          position: "absolute",
          top: 1090,
          background: "#0d0d0d",
          color: "#fff",
          fontFamily: MONO,
          fontSize: 26,
          whiteSpace: "nowrap",
          padding: "6px 16px",
        }}
      >
        Byker Store · importaciones · envíos a todo el Perú
      </Mask>
    </div>
  );
};

export const Video07C: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Audio
      src={staticFile(MUSIC)}
      volume={(f) =>
        MUSIC_VOL *
        interpolate(
          f,
          [0, 8, V07C_TOTAL - 45, V07C_TOTAL],
          [0.3, 1, 1, 0],
          clamp,
        )
      }
    />
    {VOICE.map((v) => (
      <Sequence key={v.id} from={v.frame} layout="none">
        <Audio src={staticFile(`byker/voz-v07/${v.id}.mp3`)} volume={1.3} />
      </Sequence>
    ))}
    <Backdrop />
    <PhoneBg />
    <Cover />
    {CONTENT.map((s, i) => (
      <ContentScene key={s.idx} s={s} start={B[i + 1]} end={B[i + 2]} />
    ))}
    <Cta />
    <Morph />
  </AbsoluteFill>
);
