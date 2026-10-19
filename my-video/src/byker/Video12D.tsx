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
import { BODY, DarkBackground, HEAD } from "./Video02";

// iPhone 13 vs 14 vs 15 con el diseño oscuro (Oswald + amarillo), edición con máscaras,
// movimientos encadenados, transformación entre escenas y sincronía con la voz.
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const YELLOW = "#ffd60a";
const FPS30 = 30;
export const V12D_TOTAL = 1215;
const MUSIC = "byker/music-v09.wav";
const MUSIC_VOL = 0.2;

// voz (mismos audios de la versión pro con etiquetas) y límites de escena
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
const at = (line: number, s: number) => Math.round(line + s * FPS30);
const easeIO = Easing.inOut(Easing.cubic);
const easeOut = Easing.out(Easing.cubic);
const pop = (f: number, t: number, amp = 0.16) =>
  f < t ? 1 : 1 + amp * Math.exp(-(f - t) / 5);

// ---------- máscara ----------
const Mask: React.FC<{
  t: number;
  from?: "bottom" | "left";
  style?: React.CSSProperties;
  children: React.ReactNode;
  dur?: number;
}> = ({ t, from = "bottom", style, children, dur = 12 }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [t, t + dur], [0, 1], { ...clamp, easing: easeOut });
  const off =
    from === "bottom"
      ? `translateY(${(1 - p) * 115}%)`
      : `translateX(${(p - 1) * 105}%)`;
  return (
    <div
      style={{
        ...style,
        overflow: "hidden",
        visibility: f < t ? "hidden" : "visible",
      }}
    >
      <div style={{ transform: off }}>{children}</div>
    </div>
  );
};

// ---------- barra de progreso: cada segmento es el objeto que se transforma ----------
type Rect = { x: number; y: number; w: number; h: number };
const SEG_W = 200;
const SEG_GAP = 14;
const SEG_X0 = (1080 - (4 * SEG_W + 3 * SEG_GAP)) / 2;
const SEG_Y = 250;
const seg = (i: number): Rect => ({
  x: SEG_X0 + i * (SEG_W + SEG_GAP),
  y: SEG_Y,
  w: SEG_W,
  h: 12,
});
const FULL: Rect = { x: 0, y: 0, w: 1080, h: 1920 };
const R_FIFTEEN: Rect = { x: 705, y: 600, w: 290, h: 300 };
const R_WA: Rect = { x: 140, y: 1100, w: 800, h: 200 };
const lerp = (a: Rect, b: Rect, p: number): Rect => ({
  x: a.x + (b.x - a.x) * p,
  y: a.y + (b.y - a.y) * p,
  w: a.w + (b.w - a.w) * p,
  h: a.h + (b.h - a.h) * p,
});

const Progress: React.FC = () => {
  const f = useCurrentFrame();
  if (f < B[1] || f >= B[5]) return null;
  let k = 0;
  for (let i = 1; i <= 4; i++) if (f >= B[i]) k = i - 1;
  return (
    <>
      {[0, 1, 2, 3].map((i) => {
        const r = seg(i);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: r.x,
              top: r.y,
              width: r.w,
              height: r.h,
              borderRadius: 6,
              background: i < k ? YELLOW : "rgba(255,255,255,0.18)",
            }}
          />
        );
      })}
    </>
  );
};

const Morph: React.FC = () => {
  const f = useCurrentFrame();
  const g = (a: number, b: number) =>
    interpolate(f, [a, b], [0, 1], { ...clamp, easing: easeIO });
  let rect: Rect | null = null;
  let radius = 6;
  let op = 1;
  // portada: la caja amarilla del "15" crece hasta cubrir la pantalla
  if (f >= B[1] - 14 && f < B[1]) {
    rect = lerp(R_FIFTEEN, FULL, g(B[1] - 14, B[1]));
    radius = 30 * (1 - g(B[1] - 14, B[1]));
  }
  for (let k = 1; k <= 4; k++) {
    const s = B[k];
    const e = B[k + 1];
    if (f >= s && f < s + 16) rect = lerp(FULL, seg(k - 1), g(s, s + 16));
    else if (f >= s + 16 && f < e - 14) rect = seg(k - 1);
    else if (f >= e - 14 && f < e) rect = lerp(seg(k - 1), FULL, g(e - 14, e));
  }
  // cierre: el panel se encoge hasta la caja de WhatsApp y se desvanece
  if (f >= B[5] && f < B[5] + 18) {
    rect = lerp(FULL, R_WA, g(B[5], B[5] + 16));
    radius = 30 * g(B[5], B[5] + 16);
    op = interpolate(f, [B[5] + 12, B[5] + 18], [1, 0], clamp);
  }
  if (!rect) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: rect.x,
        top: rect.y,
        width: rect.w,
        height: rect.h,
        borderRadius: radius,
        background: YELLOW,
        opacity: op,
      }}
    />
  );
};

// ---------- portada ----------
const Cover: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (f >= B[1] - 14) return null;
  const line = (size: number, color: string): React.CSSProperties => ({
    fontFamily: HEAD,
    fontWeight: 700,
    fontSize: size,
    lineHeight: 1.08,
    textTransform: "uppercase",
    color,
    whiteSpace: "nowrap",
    textAlign: "center",
  });
  // 13 · 14 · 15 caen justo cuando la voz los nombra
  const nums = [
    { n: "13", t: at(L.l1, 1.76) },
    { n: "14", t: at(L.l1, 2.28) },
    { n: "15", t: at(L.l1, 2.79) },
  ];
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <Mask t={at(L.l1, 0.04)} style={{ marginTop: 260 }}>
        <div style={line(120, "#fff")}>lo que no te</div>
      </Mask>
      <Mask t={at(L.l1, 0.6)}>
        <div
          style={{
            ...line(150, YELLOW),
            transform: `scale(${pop(f, at(L.l1, 0.6), 0.08)})`,
          }}
        >
          dicen
        </div>
      </Mask>
      {nums.map((x, i) => {
        const s = spring({
          frame: f - x.t,
          fps,
          config: { damping: 9, stiffness: 190, mass: 0.7 },
        });
        const last = i === 2;
        return (
          <div
            key={x.n}
            style={{
              position: "absolute",
              left: R_FIFTEEN.x - (2 - i) * (R_FIFTEEN.w + 20),
              top: R_FIFTEEN.y,
              width: R_FIFTEEN.w,
              height: R_FIFTEEN.h,
              boxSizing: "border-box",
              borderRadius: 30,
              background: last ? YELLOW : "#1c1c1e",
              border: last ? "none" : "3px solid rgba(255,255,255,0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: HEAD,
              fontWeight: 700,
              fontSize: 210,
              color: last ? "#000" : "#fff",
              opacity: Math.min(1, s * 2),
              transform: `translateY(${(1 - Math.min(1, s)) * 120}px) scale(${interpolate(s, [0, 1], [0.6, 1]) * pop(f, x.t, 0.08)})`,
            }}
          >
            {x.n}
          </div>
        );
      })}
      <Mask
        t={at(L.l1, 3.0)}
        style={{ position: "absolute", top: R_FIFTEEN.y + R_FIFTEEN.h + 50 }}
      >
        <div
          style={{
            fontFamily: BODY,
            fontWeight: 600,
            fontSize: 48,
            color: "#d8d8dc",
          }}
        >
          4 diferencias que importan
        </div>
      </Mask>
    </AbsoluteFill>
  );
};

// ---------- escenas ----------
type Col = { k: string; v: string; t: number };
type Scene = {
  n: number;
  title: string;
  titleAt: number;
  how: string;
  hi: string; // frase resaltada dentro de "how"
  hiAt: number;
  cols: Col[];
};

const SCENES: Scene[] = [
  {
    n: 1,
    title: "Chip",
    titleAt: at(L.l2, 0.78),
    how: "El 13 y el 14 traen A15. El 15 sube a A16.",
    hi: "El 15 sube a A16",
    hiAt: at(L.l2, 5.63),
    cols: [
      { k: "13", v: "A15", t: at(L.l2, 2.1) },
      { k: "14", v: "A15", t: at(L.l2, 2.9) },
      { k: "15", v: "A16", t: at(L.l2, 5.0) },
    ],
  },
  {
    n: 2,
    title: "Puerto",
    titleAt: at(L.l3, 0.84),
    how: "Lightning en el 13 y el 14. El 15 trae USB-C.",
    hi: "El 15 trae USB-C",
    hiAt: at(L.l3, 5.6),
    cols: [
      { k: "13", v: "Lightning", t: at(L.l3, 2.75) },
      { k: "14", v: "Lightning", t: at(L.l3, 3.3) },
      { k: "15", v: "USB-C", t: at(L.l3, 4.61) },
    ],
  },
  {
    n: 3,
    title: "Pantalla",
    titleAt: at(L.l4, 0.85),
    how: "Notch en el 13 y el 14. Dynamic Island solo en el 15.",
    hi: "Dynamic Island",
    hiAt: at(L.l4, 3.4),
    cols: [
      { k: "13", v: "Notch", t: at(L.l4, 1.6) },
      { k: "14", v: "Notch", t: at(L.l4, 1.8) },
      { k: "15", v: "Dynamic Island", t: at(L.l4, 2.6) },
    ],
  },
  {
    n: 4,
    title: "Cámara",
    titleAt: at(L.l5, 0.81),
    how: "12 MP en el 13 y el 14. 48 MP en el 15.",
    hi: "48 MP en el 15",
    hiAt: at(L.l5, 5.04),
    cols: [
      { k: "13", v: "12 MP", t: at(L.l5, 3.5) },
      { k: "14", v: "12 MP", t: at(L.l5, 4.0) },
      { k: "15", v: "48 MP", t: at(L.l5, 5.04) },
    ],
  },
];

const Body: React.FC<{ s: Scene }> = ({ s }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const hit = (t: number) => (f >= t ? Math.exp(-(f - t) / 8) : 0);
  // cada modelo entra como fila al nombrarlo y empuja a las anteriores hacia arriba
  return (
    <>
      {s.cols.map((c, i) => {
        const p = Math.min(
          1,
          spring({
            frame: f - (c.t - 8),
            fps,
            config: { damping: 13, stiffness: 160, mass: 0.7 },
          }),
        );
        const h = hit(c.t);
        const best = i === 2;
        const col = best ? YELLOW : "rgba(255,255,255,0.35)";
        return (
          <div
            key={c.k}
            style={{
              height: 190 * p,
              overflow: "hidden",
              opacity: Math.min(1, p * 1.5),
            }}
          >
            <div
              style={{
                width: 920,
                height: 160,
                marginTop: 30,
                boxSizing: "border-box",
                padding: "0 44px",
                borderRadius: 36,
                background: best ? "#2a2410" : "#1c1c1e",
                border: `3px solid ${col}`,
                boxShadow: best
                  ? `0 0 ${20 + 60 * h}px ${YELLOW}${h > 0.05 ? "99" : "44"}`
                  : "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                transform: `translateX(${(1 - p) * 200}px) scale(${1 + 0.04 * h})`,
              }}
            >
              <span
                style={{
                  fontFamily: HEAD,
                  fontWeight: 700,
                  fontSize: 64,
                  textTransform: "uppercase",
                  color: "#fff",
                }}
              >
                iPhone{" "}
                <span style={{ color: best ? YELLOW : "#fff" }}>{c.k}</span>
              </span>
              <span
                style={{
                  fontFamily: HEAD,
                  fontWeight: 700,
                  fontSize: c.v.length > 9 ? 56 : 70,
                  textTransform: "uppercase",
                  color: best ? YELLOW : "#d8d8dc",
                  display: "inline-block",
                  transform: `scale(${pop(f, c.t, 0.14)})`,
                }}
              >
                {c.v}
              </span>
            </div>
          </div>
        );
      })}
    </>
  );
};

const ContentScene: React.FC<{ s: Scene; start: number; end: number }> = ({
  s,
  start,
  end,
}) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (f < start || f >= end) return null;
  // número: cae justo cuando el panel amarillo aterriza en la barra
  const ns = spring({
    frame: f - (start + 10),
    fps,
    config: { damping: 11, stiffness: 170, mass: 0.7 },
  });
  // el título sale desde detrás del número (el número lo "empuja")
  const tp = interpolate(f, [s.titleAt - 4, s.titleAt + 10], [0, 1], {
    ...clamp,
    easing: easeOut,
  });
  const hp = interpolate(f, [s.titleAt + 6, s.titleAt + 18], [0, 1], {
    ...clamp,
    easing: easeOut,
  });
  const hiOn = f >= s.hiAt;
  const i = s.how.indexOf(s.hi);
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          top: 330,
          left: 90,
          right: 70,
          display: "flex",
          alignItems: "center",
          gap: 36,
        }}
      >
        <div
          style={{
            flex: "none",
            fontFamily: HEAD,
            fontWeight: 700,
            fontSize: 330,
            lineHeight: 0.85,
            color: YELLOW,
            transform: `scale(${interpolate(ns, [0, 1], [2.2, 1])})`,
            opacity: Math.min(1, ns * 2),
          }}
        >
          {s.n}
        </div>
        <div style={{ overflow: "hidden", flex: 1 }}>
          <div
            style={{
              fontFamily: HEAD,
              fontWeight: 700,
              fontSize: 140,
              lineHeight: 1.02,
              textTransform: "uppercase",
              color: "#fff",
              transform: `translateX(${(1 - tp) * -110}%)`,
            }}
          >
            {s.title}
          </div>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          top: 660,
          left: 80,
          right: 80,
          textAlign: "center",
          fontFamily: BODY,
          fontWeight: 600,
          fontSize: 44,
          lineHeight: 1.35,
          color: "#d8d8dc",
          opacity: hp,
          transform: `translateY(${(1 - hp) * 24}px)`,
        }}
      >
        {s.how.slice(0, i)}
        <span
          style={{
            display: "inline-block",
            padding: "0 12px",
            borderRadius: 12,
            background: hiOn ? YELLOW : "transparent",
            color: hiOn ? "#000" : YELLOW,
            transform: `scale(${pop(f, s.hiAt, 0.12)})`,
          }}
        >
          {s.hi}
        </span>
        {s.how.slice(i + s.hi.length)}
      </div>
      <div
        style={{
          position: "absolute",
          top: 820,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Body s={s} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- cierre ----------
const Cta: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (f < B[5]) return null;
  const t = (s: number) => at(L.l6, s);
  const logo = spring({
    frame: f - (B[5] + 8),
    fps,
    config: { damping: 14, stiffness: 120 },
  });
  const box = interpolate(f, [B[5] + 10, B[5] + 22], [0, 1], clamp);
  const chunk = (txt: string, ts: number) => (
    <Mask key={txt} t={ts} style={{ display: "inline-block" }}>
      <span
        style={{
          display: "inline-block",
          transform: `scale(${pop(f, ts, 0.18)})`,
        }}
      >
        {txt}
      </span>
    </Mask>
  );
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <Img
        src={staticFile("byker/logo-white.png")}
        style={{
          marginTop: 300,
          width: 420,
          mixBlendMode: "screen",
          opacity: logo,
          transform: `translateY(${(1 - logo) * 40}px)`,
        }}
      />
      <Mask t={t(0.05)} style={{ marginTop: 30 }}>
        <div
          style={{
            fontFamily: HEAD,
            fontWeight: 700,
            fontSize: 100,
            lineHeight: 1.05,
            textTransform: "uppercase",
            color: "#fff",
            textAlign: "center",
          }}
        >
          ¿cuál te conviene?
        </div>
      </Mask>
      <Mask t={t(1.1)}>
        <div
          style={{
            fontFamily: HEAD,
            fontWeight: 700,
            fontSize: 96,
            lineHeight: 1.05,
            textTransform: "uppercase",
            color: YELLOW,
            textAlign: "center",
            transform: `scale(${pop(f, t(1.13), 0.08)})`,
          }}
        >
          dime tu presupuesto
        </div>
      </Mask>
      <div
        style={{
          position: "absolute",
          left: R_WA.x,
          top: R_WA.y,
          width: R_WA.w,
          height: R_WA.h,
          boxSizing: "border-box",
          borderRadius: 30,
          border: "3px solid rgba(255,255,255,0.9)",
          opacity: box,
          display: "flex",
          alignItems: "center",
          gap: 34,
          padding: "0 44px",
        }}
      >
        <svg
          width="90"
          height="90"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#fff"
          strokeWidth="1.6"
        >
          <path
            d="M3.5 20.5 5 16.3A8.5 8.5 0 1 1 8 19.2Z"
            strokeLinejoin="round"
          />
          <path
            d="M9 8.5c0 3 2.5 6 6 6.5l1.2-1.5-1.8-1-1 .8c-1-.5-2-1.5-2.4-2.4l.8-1-1-1.8Z"
            strokeLinejoin="round"
          />
        </svg>
        <div>
          <div
            style={{
              fontFamily: BODY,
              fontWeight: 600,
              fontSize: 30,
              letterSpacing: 6,
              color: "#d8d8dc",
            }}
          >
            WHATSAPP
          </div>
          <div
            style={{
              display: "flex",
              gap: 20,
              fontFamily: HEAD,
              fontWeight: 700,
              fontSize: 96,
              color: "#fff",
              lineHeight: 1.05,
            }}
          >
            {chunk("944", t(3.2))}
            {chunk("180", t(4.01))}
            {chunk("362", t(5.3))}
          </div>
        </div>
      </div>
      <Mask t={t(1.5)} style={{ position: "absolute", top: 1360 }}>
        <div
          style={{
            fontFamily: BODY,
            fontWeight: 600,
            fontSize: 32,
            letterSpacing: 6,
            color: "#a9a9b0",
          }}
        >
          Y TE DIGO CUÁL COMPRAR
        </div>
      </Mask>
      <Mask
        t={t(2.8)}
        style={{
          position: "absolute",
          bottom: 80,
          left: 0,
          right: 0,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: BODY,
            fontWeight: 600,
            fontSize: 22,
            whiteSpace: "nowrap",
            letterSpacing: 2,
            color: "#8a8a90",
          }}
        >
          PRODUCTOS 100% ORIGINALES · ENVÍOS A TODO EL PERÚ · COMPRA SEGURA
        </div>
      </Mask>
    </AbsoluteFill>
  );
};

export const Video12D: React.FC<{ music?: boolean }> = ({ music = true }) => (
  <AbsoluteFill style={{ background: "#000" }}>
    {music ? (
      <Audio
        src={staticFile(MUSIC)}
        volume={(fr) =>
          MUSIC_VOL *
          interpolate(
            fr,
            [0, 8, V12D_TOTAL - 45, V12D_TOTAL],
            [0.3, 1, 1, 0],
            clamp,
          )
        }
      />
    ) : null}
    {VOICE.map((v) => (
      <Sequence key={v.id} from={v.frame} layout="none">
        <Audio src={staticFile(`byker/voz-v12/${v.id}.mp3`)} volume={1} />
      </Sequence>
    ))}
    <DarkBackground />
    <Cover />
    <Progress />
    {SCENES.map((s, i) => (
      <ContentScene key={s.n} s={s} start={B[i + 1]} end={B[i + 2]} />
    ))}
    <Cta />
    <Morph />
  </AbsoluteFill>
);
