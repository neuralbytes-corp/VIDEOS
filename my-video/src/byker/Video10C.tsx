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
export const V10C_TOTAL = 1215;
const MUSIC = "byker/music-v11.wav";
const MUSIC_VOL = 0.2;

// Inicio de cada línea de voz (frames) y límites visuales de cada escena.
const L = { l1: 9, l2: 130, l3: 312, l4: 575, l5: 815, l6: 1000 };
const B = [0, 122, 305, 568, 808, 995, 1215];
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

// ---------- iPhone dibujado (vector) con la pantalla de Bloqueo de activación ----------
const PhoneBg: React.FC = () => {
  const f = useCurrentFrame();
  const bob = Math.sin(f / 26) * 16;
  const rot = Math.sin(f / 41) * 1.2 - 3;
  let kick = 0;
  for (const b of B)
    if (f >= b) kick = Math.max(kick, 0.06 * Math.exp(-(f - b) / 8));
  const zoom = 1 + (f / V10C_TOTAL) * 0.08 + kick;
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
          background: `radial-gradient(circle,rgba(255,69,58,${0.22 + 0.1 * glow}),rgba(255,69,58,0) 65%)`,
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
              "radial-gradient(circle at 50% 28%,#4a1612 0%,#150605 55%,#060202 100%)",
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
            Bloqueo de activación
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
                stroke={RED}
                strokeWidth="26"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={C}
                strokeDashoffset={C * 0.0}
                transform="rotate(-90 170 170)"
                style={{
                  filter: `drop-shadow(0 0 ${14 + 10 * glow}px rgba(255,69,58,0.8))`,
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
              <svg
                width="120"
                height="140"
                viewBox="0 0 24 28"
                fill="none"
                stroke="#fff"
                strokeWidth="2.4"
                strokeLinecap="round"
              >
                <rect
                  x="3"
                  y="12"
                  width="18"
                  height="14"
                  rx="3"
                  fill="rgba(255,255,255,0.12)"
                />
                <path d="M7 12V8a5 5 0 0 1 10 0v4" />
              </svg>
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
            INTRODUCE EL ID DE APPLE
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
            Batería
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
            otra persona
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
const R_TEN: Rect = { x: 70, y: 672, w: 700, h: 180 };
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
    label = "compra con confianza";
  } else if (f >= B[5] + 16) {
    rect = R_CTA;
    label = "compra con confianza";
  }
  if (!rect) return null;
  const big = rect.h > 500;
  const fs = label === "compra con confianza" ? 84 : rect.h * 0.9;
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
            paddingBottom: label === "compra con confianza" ? 6 : 12,
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
  const t1 = at(L.l1, 0.03);
  const t2 = at(L.l1, 1.2);
  const t3 = at(L.l1, 1.9);
  const t4 = at(L.l1, 2.66);
  return (
    <>
      <Mask
        t={t1}
        from="left"
        style={{ ...abs(330), ...line("#0d0d0d", "#fff", 120) }}
      >
        así te estafan
      </Mask>
      <Mask
        t={t2}
        from="left"
        style={{ ...abs(485), ...line("#fff", "#111", 150) }}
      >
        <span
          style={{
            display: "inline-block",
            transform: `scale(${pop(f, t2, 0.06)})`,
          }}
        >
          al comprar
        </span>
      </Mask>
      <Mask
        t={t3}
        from="bottom"
        style={{
          ...abs(R_TEN.y),
          ...line("#0d0d0d", RED, 150),
          width: R_TEN.w,
          height: R_TEN.h,
          boxSizing: "border-box",
          padding: "0 22px",
        }}
      >
        <span
          style={{
            display: "inline-block",
            transform: `scale(${pop(f, at(L.l1, 2.1), 0.1)})`,
          }}
        >
          un iPhone
        </span>
      </Mask>
      <Mask
        t={t4}
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
        (y cómo evitarlo.)
      </Mask>
    </>
  );
};

// ---------- Escenas de contenido ----------
type Desc = { t: string; red?: boolean };
type Scene = {
  idx: number;
  line: number;
  title: string;
  titleAt: number;
  desc: Desc[];
  emphAt: number;
  label: string;
  card: "icloud" | "imei" | "parts" | "price";
  endEmph: number;
};

const CONTENT: Scene[] = [
  {
    idx: 1,
    line: L.l2,
    title: "icloud bloqueado",
    titleAt: at(L.l2, 0.82),
    desc: [
      { t: "te lo venden con " },
      { t: "el ID de otra persona", red: true },
      { t: "." },
    ],
    emphAt: at(L.l2, 3.0),
    label: "estafa 1 · bloqueo de activación",
    card: "icloud",
    endEmph: at(L.l2, 4.43),
  },
  {
    idx: 2,
    line: L.l3,
    title: "imei reportado",
    titleAt: at(L.l3, 0.95),
    desc: [
      { t: "un equipo reportado " },
      { t: "se queda sin red", red: true },
      { t: "." },
    ],
    emphAt: at(L.l3, 1.3),
    label: "estafa 2 · lista negra",
    card: "imei",
    endEmph: at(L.l3, 7.11),
  },
  {
    idx: 3,
    line: L.l4,
    title: "piezas cambiadas",
    titleAt: at(L.l4, 0.85),
    desc: [
      { t: "partes que no son originales: " },
      { t: "pieza desconocida", red: true },
      { t: "." },
    ],
    emphAt: at(L.l4, 6.34),
    label: "estafa 3 · reparaciones ocultas",
    card: "parts",
    endEmph: at(L.l4, 6.92),
  },
  {
    idx: 4,
    line: L.l5,
    title: "precio muy bajo",
    titleAt: at(L.l5, 0.93),
    desc: [
      { t: "si suena " },
      { t: "demasiado bueno", red: true },
      { t: ", desconfía." },
    ],
    emphAt: at(L.l5, 1.9),
    label: "estafa 4 · oferta sin respaldo",
    card: "price",
    endEmph: at(L.l5, 4.8),
  },
];

const Check: React.FC<{ p: number; bad?: boolean }> = ({ p, bad }) => (
  <svg
    width="54"
    height="54"
    viewBox="0 0 24 24"
    fill="none"
    stroke={bad ? RED : GREEN}
    strokeWidth="3"
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

const Pill: React.FC<{
  children: React.ReactNode;
  color?: string;
  style?: React.CSSProperties;
}> = ({ children, color = GREEN, style }) => (
  <div
    style={{
      border: `3px solid ${color}`,
      background: "rgba(255,255,255,0.05)",
      color: "#fff",
      fontFamily: MONO,
      fontSize: 30,
      padding: "10px 22px",
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {children}
  </div>
);

const CardBody: React.FC<{ s: Scene }> = ({ s }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sp = (d: number) =>
    spring({
      frame: f - d,
      fps,
      config: { damping: 13, stiffness: 160, mass: 0.7 },
    });
  const hitOf = (t: number) => (f >= t ? Math.exp(-(f - t) / 8) : 0);
  const shakeOf = (t: number) =>
    f >= t ? Math.sin((f - t) * 2.2) * 10 * Math.exp(-(f - t) / 8) : 0;

  // fila que entra y empuja a las anteriores
  const row = (key: string, text: React.ReactNode, t: number, bad = true) => {
    const p = sp(t - 8);
    const hit = hitOf(t);
    const c = bad ? "255,69,58" : "61,220,132";
    return (
      <div
        key={key}
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
            border: `3px solid rgba(${c},${0.4 + 0.6 * hit})`,
            background: `rgba(${c},${0.06 + 0.2 * hit})`,
            padding: "0 28px",
            transform: `translateX(${(1 - Math.min(1, p)) * 160 + shakeOf(t)}px) scale(${1 + 0.04 * hit})`,
          }}
        >
          <Check p={interpolate(f, [t, t + 8], [0, 1], clamp)} bad={bad} />
          <span
            style={{
              fontFamily: SANS,
              fontWeight: 900,
              letterSpacing: "-0.04em",
              fontSize: 52,
              color: "#fff",
              whiteSpace: "nowrap",
            }}
          >
            {text}
          </span>
        </div>
      </div>
    );
  };
  const note = (key: string, text: string, t: number, color: string) => {
    const p = sp(t - 6);
    return (
      <div
        key={key}
        style={{
          height: 84 * Math.min(1, p),
          overflow: "hidden",
          opacity: Math.min(1, p * 1.5),
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Pill
          color={color}
          style={{
            marginTop: 14,
            fontSize: 30,
            transform: `scale(${1 + 0.08 * hitOf(t)})`,
          }}
        >
          {text}
        </Pill>
      </div>
    );
  };

  if (s.card === "icloud")
    return (
      <>
        {row("a", "Pide el ID de otra persona", at(L.l2, 3.0))}
        {row("b", "Bloqueo de activación", at(L.l2, 3.9))}
        {note("n", "no lo compres", at(L.l2, 4.43), RED)}
      </>
    );

  if (s.card === "imei") {
    const code = ["*", "#", "0", "6", "#"];
    const times = [
      at(L.l3, 2.44),
      at(L.l3, 3.58),
      at(L.l3, 4.14),
      at(L.l3, 4.53),
      at(L.l3, 5.38),
    ];
    const shown = times.filter((t) => f >= t).length;
    const box1 = sp(times[0] - 8);
    return (
      <>
        {row("a", "Reportado = sin red", at(L.l3, 1.3))}
        <div
          style={{
            height: 170 * Math.min(1, box1),
            overflow: "hidden",
            opacity: Math.min(1, box1 * 1.5),
          }}
        >
          <div
            style={{
              height: 150,
              marginTop: 12,
              background: "#000",
              border: "3px solid rgba(255,255,255,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: MONO,
              fontWeight: 500,
              fontSize: 110,
              color: "#fff",
              letterSpacing: 10,
            }}
          >
            {code.slice(0, shown).join("")}
            <span
              style={{ color: GREEN, opacity: Math.floor(f / 8) % 2 ? 0 : 1 }}
            >
              |
            </span>
          </div>
        </div>
        {note("n", "verifica en Osiptel", at(L.l3, 5.73), GREEN)}
      </>
    );
  }

  if (s.card === "parts") {
    const pathParts = ["Ajustes", "General", "Información"];
    const times = [at(L.l4, 2.42), at(L.l4, 3.57), at(L.l4, 4.57)];
    const n = times.filter((t) => f >= t).length;
    const p = sp(times[0] - 6);
    return (
      <>
        <div
          style={{
            height: 96 * Math.min(1, p),
            overflow: "hidden",
            opacity: Math.min(1, p * 1.5),
          }}
        >
          <Pill
            style={{
              marginTop: 14,
              fontSize: 34,
              textAlign: "center",
              color: "#fff",
              borderColor: "rgba(255,255,255,0.35)",
            }}
          >
            {pathParts.slice(0, n).join("  ›  ")}
          </Pill>
        </div>
        {row(
          "a",
          <>
            Batería: <span style={{ color: RED }}>Pieza desconocida</span>
          </>,
          at(L.l4, 6.34),
        )}
        {note("n", "señal de reparación no original", at(L.l4, 6.92), RED)}
      </>
    );
  }

  return (
    <>
      {row("a", "Precio demasiado bajo", at(L.l5, 1.0))}
      {row("b", "Sin boleta", at(L.l5, 3.4))}
      {row("c", "Sin garantía", at(L.l5, 4.1))}
    </>
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
  const fin = f >= t(5.7) ? 1 + 0.03 * Math.sin((f - t(3.3)) / 3) : 1;
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
        t={B[5] + 12}
        from="left"
        style={{
          ...box("#0d0d0d", RED),
          fontSize: 92,
          whiteSpace: "nowrap",
          position: "absolute",
          top: 510,
        }}
      >
        sin estafas
      </Mask>
      {mono(700, 34, t(0.9), "pregúntanos antes de pagar")}
      <Mask
        t={t(1.73)}
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
        {chunk("944", t(2.4))}
        {chunk("180", t(3.83))}
        {chunk("362", t(5.06))}
      </div>
      {mono(
        1090,
        26,
        t(2.0),
        "Byker Store · importaciones · envíos a todo el Perú",
      )}
    </div>
  );
};

export const Video10C: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Audio
      src={staticFile(MUSIC)}
      volume={(f) =>
        MUSIC_VOL *
        interpolate(
          f,
          [0, 8, V10C_TOTAL - 45, V10C_TOTAL],
          [0.3, 1, 1, 0],
          clamp,
        )
      }
    />
    {VOICE.map((v) => (
      <Sequence key={v.id} from={v.frame} layout="none">
        <Audio src={staticFile(`byker/voz-v10/${v.id}.mp3`)} volume={1} />
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
