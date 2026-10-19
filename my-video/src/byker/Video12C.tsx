import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
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
export const V12C_TOTAL = 1215;
const MUSIC = "byker/music-v09.wav";
const MUSIC_VOL = 0.2;

// Inicio de cada línea de voz (frames) y límites visuales de cada escena.
const L = { l1: 9, l2: 150, l3: 370, l4: 595, l5: 755, l6: 985 };
const B = [0, 140, 360, 585, 745, 975, 1215];
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

// ---------- iPhone dibujado (vector) con la pantalla de iPhone 15 ----------
const PhoneBg: React.FC = () => {
  const f = useCurrentFrame();
  const bob = Math.sin(f / 26) * 16;
  const rot = Math.sin(f / 41) * 1.2 - 3;
  let kick = 0;
  for (const b of B)
    if (f >= b) kick = Math.max(kick, 0.06 * Math.exp(-(f - b) / 8));
  const zoom = 1 + (f / V12C_TOTAL) * 0.08 + kick;
  const rise = interpolate(f, [0, 30], [0, 1], { ...clamp, easing: easeOut });
  const sweepX = interpolate((f % 140) / 140, [0, 1], [-500, 1100]);
  const glow = 0.5 + 0.5 * Math.sin(f / 18);
  const gridShift = (f * 0.6) % 90;
  const R = 150;
  const C = 2 * Math.PI * R;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {/* rejilla técnica que se desplaza lentamente */}
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.06) 1px,transparent 1px)",
          backgroundSize: "90px 90px",
          backgroundPosition: `${gridShift}px ${gridShift}px`,
          WebkitMaskImage:
            "radial-gradient(circle at 50% 85%,#000 0%,transparent 70%)",
          maskImage:
            "radial-gradient(circle at 50% 85%,#000 0%,transparent 70%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 40,
          bottom: -200,
          width: 1000,
          height: 1000,
          borderRadius: 500,
          background: `radial-gradient(circle,rgba(61,220,132,${0.22 + 0.1 * glow}),rgba(61,220,132,0) 65%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 160,
          bottom: -1010 + (1 - rise) * 600 - bob,
          width: 760,
          height: 1560,
          transform: `rotate(${rot}deg) scale(${zoom})`,
          transformOrigin: "50% 100%",
          opacity: 1,
        }}
      >
        {/* botones laterales */}
        <div
          style={{
            position: "absolute",
            left: -8,
            top: 250,
            width: 8,
            height: 90,
            borderRadius: 4,
            background: "#3a3d44",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: -8,
            top: 370,
            width: 8,
            height: 150,
            borderRadius: 4,
            background: "#3a3d44",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: -8,
            top: 330,
            width: 8,
            height: 210,
            borderRadius: 4,
            background: "#3a3d44",
          }}
        />
        {/* cuerpo */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 120,
            background:
              "linear-gradient(145deg,#4a4d55 0%,#1b1c20 45%,#0a0a0c 100%)",
            boxShadow:
              "inset 0 0 0 3px rgba(255,255,255,0.18),0 40px 90px rgba(0,0,0,0.6)",
          }}
        />
        {/* pantalla */}
        <div
          style={{
            position: "absolute",
            inset: 16,
            borderRadius: 106,
            overflow: "hidden",
            background:
              "radial-gradient(circle at 50% 28%,#16402d 0%,#08120d 55%,#040605 100%)",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 26,
              left: "50%",
              marginLeft: -115,
              width: 230,
              height: 64,
              borderRadius: 32,
              background: "#000",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 40,
              left: 70,
              fontFamily: MONO,
              fontSize: 28,
              color: "#cfd3d8",
            }}
          >
            9:41
          </div>
          <div
            style={{
              position: "absolute",
              top: 120,
              width: "100%",
              textAlign: "center",
              fontFamily: SANS,
              fontWeight: 800,
              fontSize: 40,
              color: "#e8ebee",
              letterSpacing: "-0.02em",
            }}
          >
            iPhone 15
          </div>
          <div
            style={{
              position: "absolute",
              top: 240,
              left: "50%",
              marginLeft: -170,
              width: 340,
              height: 340,
            }}
          >
            <svg width="340" height="340" viewBox="0 0 340 340">
              <circle
                cx="170"
                cy="170"
                r={R}
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="26"
                fill="none"
              />
              <circle
                cx="170"
                cy="170"
                r={R}
                stroke={GREEN}
                strokeWidth="26"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={C}
                strokeDashoffset={C * 0.0}
                transform="rotate(-90 170 170)"
                style={{
                  filter: `drop-shadow(0 0 ${14 + 10 * glow}px rgba(61,220,132,0.8))`,
                }}
              />
            </svg>
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: SANS,
                fontWeight: 900,
                fontSize: 104,
                letterSpacing: "-0.05em",
                color: "#fff",
              }}
            >
              A16
            </div>
          </div>
          <div
            style={{
              position: "absolute",
              top: 620,
              width: "100%",
              textAlign: "center",
              fontFamily: MONO,
              fontSize: 26,
              color: "#9aa3ab",
            }}
          >
            DYNAMIC ISLAND · USB-C
          </div>
          <div
            style={{
              position: "absolute",
              top: 720,
              left: 60,
              right: 60,
              height: 90,
              borderRadius: 28,
              background: "rgba(255,255,255,0.06)",
              border: "2px solid rgba(255,255,255,0.12)",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 745,
              left: 90,
              fontFamily: SANS,
              fontWeight: 700,
              fontSize: 30,
              color: "#dfe3e6",
            }}
          >
            Cámara
          </div>
          <div
            style={{
              position: "absolute",
              top: 745,
              right: 90,
              fontFamily: SANS,
              fontWeight: 800,
              fontSize: 30,
              color: GREEN,
            }}
          >
            48 MP
          </div>
          {/* brillo que cruza la pantalla */}
          <div
            style={{
              position: "absolute",
              top: -200,
              left: sweepX,
              width: 140,
              height: 1900,
              background:
                "linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,0.16),rgba(255,255,255,0))",
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
const R_TEN: Rect = { x: 70, y: 672, w: 760, h: 180 };
const R_CTA: Rect = { x: 70, y: 330, w: 930, h: 160 };
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
    label = "¿cuál te conviene?";
  } else if (f >= B[5] + 16) {
    rect = R_CTA;
    label = "¿cuál te conviene?";
  }
  if (!rect) return null;
  const big = rect.h > 500;
  const fs = label === "¿cuál te conviene?" ? 92 : rect.h * 0.9;
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
            paddingBottom: label === "¿cuál te conviene?" ? 6 : 12,
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
  const line = (bg: string, c: string, size: number): React.CSSProperties => ({
    ...box(bg, c),
    fontSize: size,
  });
  const abs = (top: number): React.CSSProperties => ({
    position: "absolute",
    left: 70,
    top,
  });
  const nums = [
    { n: "13", t: at(L.l1, 1.76) },
    { n: "14", t: at(L.l1, 2.28) },
    { n: "15", t: at(L.l1, 2.79) },
  ];
  return (
    <>
      <Mask
        t={at(L.l1, 0.04)}
        from="left"
        style={{ ...abs(330), ...line("#0d0d0d", "#fff", 120) }}
      >
        lo que no te
      </Mask>
      <Mask
        t={at(L.l1, 0.6)}
        from="left"
        style={{ ...abs(485), ...line("#fff", "#111", 150) }}
      >
        dicen
      </Mask>
      <div
        style={{
          ...abs(R_TEN.y),
          width: R_TEN.w,
          height: R_TEN.h,
          display: "flex",
          gap: 16,
          visibility: f < nums[0].t ? "hidden" : "visible",
        }}
      >
        {nums.map((x) => (
          <Mask
            key={x.n}
            t={x.t}
            from="bottom"
            style={{
              ...line("#0d0d0d", x.n === "15" ? RED : "#fff", 150),
              flex: 1,
              height: R_TEN.h,
              boxSizing: "border-box",
              textAlign: "center",
            }}
          >
            <span
              style={{
                display: "inline-block",
                transform: `scale(${pop(f, x.t, 0.14)})`,
              }}
            >
              {x.n}
            </span>
          </Mask>
        ))}
      </div>
      <Mask
        t={at(L.l1, 3.0)}
        from="left"
        style={{
          ...abs(R_TEN.y + R_TEN.h + 24),
          background: "#0d0d0d",
          color: "#fff",
          fontFamily: MONO,
          fontSize: 32,
          padding: "6px 16px",
        }}
      >
        (4 diferencias que importan.)
      </Mask>
    </>
  );
};

// ---------- Escenas de contenido ----------
type Desc = { t: string; red?: boolean };
type Col = { k: string; v: string; t: number };
type Scene = {
  idx: number;
  line: number;
  title: string;
  titleAt: number;
  desc: Desc[];
  emphAt: number;
  label: string;
  cols: Col[];
  endEmph: number;
};

const CONTENT: Scene[] = [
  {
    idx: 1,
    line: L.l2,
    title: "chip",
    titleAt: at(L.l2, 0.78),
    desc: [
      { t: "el 13 y el 14 traen A15. " },
      { t: "el 15 sube a A16", red: true },
      { t: "." },
    ],
    emphAt: at(L.l2, 5.63),
    label: "comparativa · procesador",
    cols: [
      { k: "13", v: "A15", t: at(L.l2, 2.1) },
      { k: "14", v: "A15", t: at(L.l2, 2.9) },
      { k: "15", v: "A16", t: at(L.l2, 5.0) },
    ],
    endEmph: at(L.l2, 5.63),
  },
  {
    idx: 2,
    line: L.l3,
    title: "puerto",
    titleAt: at(L.l3, 0.84),
    desc: [
      { t: "Lightning en el 13 y el 14. " },
      { t: "el 15 trae USB-C", red: true },
      { t: "." },
    ],
    emphAt: at(L.l3, 5.6),
    label: "comparativa · carga",
    cols: [
      { k: "13", v: "Lightning", t: at(L.l3, 2.75) },
      { k: "14", v: "Lightning", t: at(L.l3, 3.3) },
      { k: "15", v: "USB-C", t: at(L.l3, 4.61) },
    ],
    endEmph: at(L.l3, 5.6),
  },
  {
    idx: 3,
    line: L.l4,
    title: "pantalla",
    titleAt: at(L.l4, 0.85),
    desc: [
      { t: "notch en el 13 y el 14. " },
      { t: "Dynamic Island", red: true },
      { t: " solo en el 15." },
    ],
    emphAt: at(L.l4, 3.4),
    label: "comparativa · diseño frontal",
    cols: [
      { k: "13", v: "Notch", t: at(L.l4, 1.6) },
      { k: "14", v: "Notch", t: at(L.l4, 1.8) },
      { k: "15", v: "Dynamic Island", t: at(L.l4, 2.6) },
    ],
    endEmph: at(L.l4, 3.4),
  },
  {
    idx: 4,
    line: L.l5,
    title: "cámara",
    titleAt: at(L.l5, 0.81),
    desc: [
      { t: "12 MP en el 13 y el 14. " },
      { t: "48 MP en el 15", red: true },
      { t: "." },
    ],
    emphAt: at(L.l5, 5.04),
    label: "comparativa · cámara principal",
    cols: [
      { k: "13", v: "12 MP", t: at(L.l5, 3.5) },
      { k: "14", v: "12 MP", t: at(L.l5, 4.0) },
      { k: "15", v: "48 MP", t: at(L.l5, 5.04) },
    ],
    endEmph: at(L.l5, 6.1),
  },
];

const CardBody: React.FC<{ s: Scene }> = ({ s }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ display: "flex", height: 480, margin: "0 -40px" }}>
      {s.cols.map((c, i) => {
        const p = Math.min(
          1,
          spring({
            frame: f - (c.t - 6),
            fps,
            config: { damping: 12, stiffness: 170, mass: 0.7 },
          }),
        );
        const hit = f >= c.t ? Math.exp(-(f - c.t) / 8) : 0;
        const best = i === 2;
        return (
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
              background:
                best && f >= c.t
                  ? `rgba(61,220,132,${0.12 + 0.25 * hit})`
                  : "transparent",
            }}
          >
            <div style={{ fontFamily: MONO, fontSize: 30, color: "#bbb" }}>
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
                transform: `scale(${1 + 0.12 * hit})`,
              }}
            >
              {c.k}
            </div>
            <div
              style={{
                height: 120,
                overflow: "hidden",
                display: "flex",
                alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  fontFamily: SANS,
                  fontWeight: 800,
                  fontSize: c.v.length > 9 ? 38 : 52,
                  letterSpacing: "-0.03em",
                  textAlign: "center",
                  color: best ? GREEN : "#fff",
                  padding: "0 10px",
                  transform: `translateY(${(1 - p) * 120}%)`,
                  opacity: p,
                }}
              >
                {c.v}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const ContentScene: React.FC<{ s: Scene; start: number; end: number }> = ({
  s,
  start,
  end,
}) => {
  const f = useCurrentFrame();
  if (f < start || f >= end) return null;
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
          clipPath: `inset(${(1 - tp) * 100}% 0 0 0)`,
        }}
      >
        <div style={{ ...box("#fff", "#111"), fontSize: 100, marginTop: 12 }}>
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
        <CardBody s={s} />
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
  const fin = f >= t(6.0) ? 1 + 0.03 * Math.sin((f - t(3.3)) / 3) : 1;
  const mono = (top: number, size: number, ts: number, text: string) => (
    <Mask
      t={ts}
      from="left"
      style={{
        position: "absolute",
        top,
        background: "#0d0d0d",
        color: "#fff",
        fontFamily: MONO,
        fontSize: size,
        whiteSpace: "nowrap",
        padding: "6px 16px",
      }}
    >
      {text}
    </Mask>
  );
  return (
    <div style={{ position: "absolute", left: 70, top: 0, width: 940 }}>
      <Mask
        t={at(L.l6, 1.13)}
        from="left"
        style={{
          ...box("#0d0d0d", RED),
          fontSize: 92,
          whiteSpace: "nowrap",
          position: "absolute",
          top: 510,
        }}
      >
        dime tu presupuesto
      </Mask>
      {mono(700, 34, t(1.5), "y te digo cuál comprar")}
      <Mask
        t={t(2.53)}
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
        {chunk("944", t(3.2))}
        {chunk("180", t(4.01))}
        {chunk("362", t(5.3))}
      </div>
      {mono(
        1090,
        26,
        t(2.8),
        "Byker Store · importaciones · envíos a todo el Perú",
      )}
    </div>
  );
};

export const Video12C: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Audio
      src={staticFile(MUSIC)}
      volume={(f) =>
        MUSIC_VOL *
        interpolate(
          f,
          [0, 8, V12C_TOTAL - 45, V12C_TOTAL],
          [0.3, 1, 1, 0],
          clamp,
        )
      }
    />
    {VOICE.map((v) => (
      <Sequence key={v.id} from={v.frame} layout="none">
        <Audio src={staticFile(`byker/voz-v12/${v.id}.mp3`)} volume={1} />
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
