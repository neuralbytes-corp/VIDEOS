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
import { BODY, DarkBackground, GREEN, HEAD } from "./Video02";

// Preguntas frecuentes con el diseño oscuro (Oswald + amarillo), edición con máscaras,
// movimientos encadenados, transformación entre escenas y sincronía con la voz.
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const YELLOW = "#ffd60a";
const RED = "#ff453a";
const FPS30 = 30;
export const V11D_TOTAL = 935;
const MUSIC = "byker/music-v10.wav";
const MUSIC_VOL = 0.2;

// voz (mismos audios del video de estafas) y límites de escena
const L = { l1: 9, l2: 115, l3: 235, l4: 400, l5: 565, l6: 745 };
const B = [0, 105, 225, 390, 555, 735, 935];
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
const R_FOUR: Rect = { x: 370, y: 190, w: 340, h: 470 };
const R_WA: Rect = { x: 140, y: 1040, w: 800, h: 200 };
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
  // portada: el "4" gigante se convierte en un panel amarillo
  if (f >= B[1] - 14 && f < B[1]) {
    rect = lerp(R_FOUR, FULL, g(B[1] - 14, B[1]));
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
  const t0 = at(L.l1, 0.03);
  const s = spring({
    frame: f - t0,
    fps,
    config: { damping: 9, stiffness: 190, mass: 0.7 },
  });
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
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <div
        style={{
          marginTop: 170,
          fontFamily: HEAD,
          fontWeight: 700,
          fontSize: 560,
          lineHeight: 0.9,
          color: YELLOW,
          transform: `scale(${interpolate(s, [0, 1], [2.6, 1])})`,
          opacity: Math.min(1, s * 2),
        }}
      >
        ?
      </div>
      <Mask t={at(L.l1, 0.3)} style={{ marginTop: 20 }}>
        <div style={line(110, "#fff")}>respondo tus dudas</div>
      </Mask>
      <Mask t={at(L.l1, 1.3)}>
        <div
          style={{
            ...line(120, YELLOW),
            transform: `scale(${pop(f, at(L.l1, 2.1), 0.08)})`,
          }}
        >
          antes de comprar
        </div>
      </Mask>
      <Mask t={at(L.l1, 2.1)} style={{ marginTop: 30 }}>
        <div
          style={{
            fontFamily: BODY,
            fontWeight: 600,
            fontSize: 48,
            color: "#d8d8dc",
          }}
        >
          garantía · entrega · pagos · boleta
        </div>
      </Mask>
    </AbsoluteFill>
  );
};

// ---------- escenas ----------
type Scene = {
  n: number;
  line: number;
  title: string;
  titleAt: number;
  how: string;
  hi: string; // frase resaltada dentro de "how"
  hiAt: number;
  path?: string;
  pathAt?: number;
  kind: "garantia" | "entrega" | "pago" | "boleta";
};

const SCENES: Scene[] = [
  {
    n: 1,
    line: L.l2,
    title: "¿Tiene garantía?",
    titleAt: at(L.l2, 0.09),
    how: "Sí: 6 meses de garantía",
    hi: "6 meses",
    hiAt: at(L.l2, 1.88),
    kind: "garantia",
  },
  {
    n: 2,
    line: L.l3,
    title: "¿Cuándo lo recibo?",
    titleAt: at(L.l3, 0.05),
    how: "El mismo día, contra entrega",
    hi: "El mismo día",
    hiAt: at(L.l3, 1.5),
    kind: "entrega",
  },
  {
    n: 3,
    line: L.l4,
    title: "¿Pago por adelantado?",
    titleAt: at(L.l4, 0.09),
    how: "Reservas y pagas contra entrega",
    hi: "contra entrega",
    hiAt: at(L.l4, 3.9),
    kind: "pago",
  },
  {
    n: 4,
    line: L.l5,
    title: "¿Me dan boleta?",
    titleAt: at(L.l5, 0.01),
    how: "En todos los casos",
    hi: "todos los casos",
    hiAt: at(L.l5, 2.17),
    kind: "boleta",
  },
];

const Icon: React.FC<{ p: number; bad?: boolean }> = ({ p, bad }) => (
  <svg
    width="60"
    height="60"
    viewBox="0 0 24 24"
    fill="none"
    stroke={bad ? RED : GREEN}
    strokeWidth="2.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path
      d={bad ? "M5 5 19 19M19 5 5 19" : "M4 12.5 10 18.5 20 6"}
      strokeDasharray="30"
      strokeDashoffset={30 * (1 - p)}
    />
  </svg>
);

const Body: React.FC<{ s: Scene }> = ({ s }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sp = (d: number) =>
    spring({
      frame: f - d,
      fps,
      config: { damping: 13, stiffness: 160, mass: 0.7 },
    });
  const hit = (t: number) => (f >= t ? Math.exp(-(f - t) / 8) : 0);
  const shake = (t: number) =>
    f >= t ? Math.sin((f - t) * 2.2) * 12 * Math.exp(-(f - t) / 8) : 0;

  // fila estilo tarjeta oscura: entra y empuja a las anteriores hacia arriba
  const row = (key: string, text: React.ReactNode, t: number, bad = true) => {
    const p = Math.min(1, sp(t - 8));
    const h = hit(t);
    const c = bad ? RED : GREEN;
    return (
      <div
        key={key}
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
            background: "#1c1c1e",
            border: `3px solid ${c}`,
            boxShadow: `0 0 ${20 + 50 * h}px ${c}${h > 0.05 ? "88" : "33"}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            transform: `translateX(${(1 - p) * 200 + shake(bad ? t : -1)}px) scale(${1 + 0.04 * h})`,
          }}
        >
          <span
            style={{
              fontFamily: BODY,
              fontWeight: 600,
              fontSize: 44,
              color: "#fff",
            }}
          >
            {text}
          </span>
          <Icon p={interpolate(f, [t, t + 8], [0, 1], clamp)} bad={bad} />
        </div>
      </div>
    );
  };
  const note = (key: string, text: string, t: number, color = YELLOW) => {
    const p = Math.min(1, sp(t - 6));
    return (
      <div
        key={key}
        style={{
          height: 160 * p,
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            marginTop: 40,
            padding: "20px 48px",
            borderRadius: 999,
            background: color,
            color: color === YELLOW ? "#000" : "#fff",
            fontFamily: HEAD,
            fontWeight: 700,
            fontSize: 54,
            textTransform: "uppercase",
            whiteSpace: "nowrap",
            transform: `scale(${(0.85 + 0.15 * p) * (1 + 0.1 * hit(t))})`,
          }}
        >
          {text}
        </div>
      </div>
    );
  };

  if (s.kind === "garantia")
    return (
      <>
        {note("n", "Sí", at(L.l2, 1.26))}
        {row("a", "6 meses de garantía", at(L.l2, 1.88), false)}
      </>
    );

  if (s.kind === "entrega")
    return (
      <>
        {row("a", "El mismo día", at(L.l3, 1.5), false)}
        {row("b", "En un centro comercial", at(L.l3, 2.6), false)}
        {row("c", "O en tu domicilio", at(L.l3, 4.0), false)}
      </>
    );

  if (s.kind === "pago")
    return (
      <>
        {row("a", "Pago adelantado", at(L.l4, 0.6))}
        {note("n", "Jamás", at(L.l4, 1.6), RED)}
        {row("b", "Reservas", at(L.l4, 2.64), false)}
        {row("c", "Pagas contra entrega", at(L.l4, 3.9), false)}
      </>
    );

  return (
    <>
      {note("n", "Sí", at(L.l5, 1.34))}
      {row("a", "Boleta en todos los casos", at(L.l5, 2.17), false)}
      {row("b", "Sirve para la lista blanca", at(L.l5, 4.2), false)}
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
  const pathChars =
    s.path && s.pathAt
      ? Math.floor(
          interpolate(f, [s.pathAt, s.pathAt + 66], [0, s.path.length], clamp),
        )
      : 0;
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
              fontSize: 104,
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
        {i >= 0 ? (
          <>
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
          </>
        ) : (
          s.how
        )}
      </div>
      {s.path ? (
        <div
          style={{
            position: "absolute",
            top: 780,
            width: "100%",
            textAlign: "center",
            fontFamily: BODY,
            fontWeight: 600,
            fontSize: 38,
            color: "#a9a9b0",
          }}
        >
          {s.path.slice(0, pathChars)}
        </div>
      ) : null}
      <div
        style={{
          position: "absolute",
          top: s.path ? 850 : 780,
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
            fontSize: 110,
            lineHeight: 1.05,
            textTransform: "uppercase",
            color: "#fff",
            textAlign: "center",
          }}
        >
          ¿más dudas?
        </div>
      </Mask>
      <Mask t={t(1.15)}>
        <div
          style={{
            fontFamily: HEAD,
            fontWeight: 700,
            fontSize: 130,
            lineHeight: 1.05,
            textTransform: "uppercase",
            color: YELLOW,
            textAlign: "center",
            transform: `scale(${pop(f, t(1.2), 0.08)})`,
          }}
        >
          escríbenos
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
            {chunk("944", t(2.2))}
            {chunk("180", t(3.13))}
            {chunk("362", t(4.32))}
          </div>
        </div>
      </div>
      <Mask t={t(1.0)} style={{ position: "absolute", top: 1300 }}>
        <div
          style={{
            fontFamily: BODY,
            fontWeight: 600,
            fontSize: 32,
            letterSpacing: 6,
            color: "#a9a9b0",
          }}
        >
          SÍGUENOS · BYKER STORE
        </div>
      </Mask>
      <Mask
        t={t(1.6)}
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

export const Video11D: React.FC<{ music?: boolean }> = ({ music = true }) => (
  <AbsoluteFill style={{ background: "#000" }}>
    {music ? (
      <Audio
        src={staticFile(MUSIC)}
        volume={(fr) =>
          MUSIC_VOL *
          interpolate(
            fr,
            [0, 8, V11D_TOTAL - 45, V11D_TOTAL],
            [0.3, 1, 1, 0],
            clamp,
          )
        }
      />
    ) : null}
    {VOICE.map((v) => (
      <Sequence key={v.id} from={v.frame} layout="none">
        <Audio src={staticFile(`byker/voz-v11/${v.id}.mp3`)} volume={1.3} />
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
