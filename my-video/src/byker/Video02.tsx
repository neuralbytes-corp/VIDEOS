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
import "@fontsource/oswald/latin-500.css";
import "@fontsource/oswald/latin-600.css";
import "@fontsource/oswald/latin-700.css";
import "@fontsource/montserrat/latin-400.css";
import "@fontsource/montserrat/latin-500.css";
import "@fontsource/montserrat/latin-600.css";
import "@fontsource/montserrat/latin-700.css";
import { FPS } from "./config";
import {
  V02_CTA,
  V02_DESIGN,
  V02_HOOK,
  V02_INCLUDES,
  V02_INCLUDES_TITLE,
  V02_MUSIC_FILE,
  V02_MUSIC_VOLUME,
  V02_PORT,
  V02_PRICE,
  V02_SCENES,
  V02_TABLE,
  V02_TOTAL,
} from "./video02";
import { Scene } from "./BykerStore";
import { PortCloseup } from "./PortCloseup";
import { LineIcon } from "./Icons";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.16, 1, 0.3, 1);
export const HEAD = "Oswald, sans-serif";
export const BODY = "Montserrat, sans-serif";
export const SOFT = "#a9a9b0";
export const LINE = "rgba(255,255,255,0.20)";
export const CARD = "rgba(255,255,255,0.055)";
export const GREEN = "#3ddc84";

export const useReveal = (from: number, len = 30) => {
  const f = useCurrentFrame();
  return ease(interpolate(f, [from, from + len], [0, 1], clamp));
};

export const DarkBackground: React.FC = () => {
  const f = useCurrentFrame();
  const x = 40 + Math.sin(f / 160) * 12;
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(90% 45% at ${x}% 0%,#222226 0%,#0a0a0b 55%,#000 100%)`,
      }}
    />
  );
};

export const WhiteLogo: React.FC<{ width: number }> = ({ width }) => (
  <Img
    src={staticFile("byker/logo-white.png")}
    style={{ width, mixBlendMode: "screen" }}
  />
);

export const Photo: React.FC<{ model: "14" | "15"; width: number }> = ({
  model,
  width,
}) => (
  <Img
    src={staticFile(`byker/phone${model}.png`)}
    style={{
      width,
      mixBlendMode: "screen",
      WebkitMaskImage:
        "linear-gradient(to right,transparent 0,#000 6%,#000 94%,transparent 100%),linear-gradient(to bottom,transparent 0,#000 4%,#000 88%,transparent 100%)",
      WebkitMaskComposite: "source-in",
      maskComposite: "intersect",
    }}
  />
);

export const Title: React.FC<{
  children: React.ReactNode;
  top?: number;
  size?: number;
  lh?: number;
}> = ({ children, top = 150, size = 120, lh = 1.12 }) => {
  const t = useReveal(6);
  return (
    <div
      style={{
        marginTop: top,
        textAlign: "center",
        fontFamily: HEAD,
        fontWeight: 700,
        fontSize: size,
        letterSpacing: 2,
        lineHeight: lh,
        textTransform: "uppercase",
        color: "#fff",
        opacity: t,
        transform: `translateY(${(1 - t) * 30}px)`,
      }}
    >
      {children}
    </div>
  );
};

// ---------- 1. Gancho ----------
const HookScene: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logo = useReveal(0, 24);
  const t1 = useReveal(10);
  const t2 = useReveal(26);
  const a = spring({
    frame: f - 18,
    fps,
    config: { damping: 20, stiffness: 80 },
  });
  const b = spring({
    frame: f - 30,
    fps,
    config: { damping: 20, stiffness: 80 },
  });
  const lab = useReveal(70);
  const float = Math.sin(f / 30) * 8;
  const label = (text: string) => (
    <div
      style={{
        marginTop: 6,
        textAlign: "center",
        fontFamily: BODY,
        fontWeight: 600,
        fontSize: 34,
        letterSpacing: 5,
        textTransform: "uppercase",
        color: SOFT,
        opacity: lab,
      }}
    >
      {text}
    </div>
  );
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <div style={{ marginTop: 50, opacity: logo }}>
        <WhiteLogo width={290} />
      </div>
      <div
        style={{
          marginTop: 10,
          width: 940,
          textAlign: "center",
          fontFamily: HEAD,
          fontWeight: 700,
          fontSize: 108,
          lineHeight: 1.1,
          letterSpacing: 1.5,
          textTransform: "uppercase",
          color: "#fff",
          opacity: t1,
          transform: `translateY(${(1 - t1) * 40}px)`,
        }}
      >
        {V02_HOOK.title}
      </div>
      <div
        style={{
          marginTop: 12,
          fontFamily: HEAD,
          fontWeight: 700,
          fontSize: 64,
          letterSpacing: 2,
          color: "#ffd60a",
          opacity: t2,
        }}
      >
        {V02_HOOK.subtitle}
      </div>
      <div style={{ marginTop: 40, display: "flex", gap: 0, marginLeft: -10 }}>
        <div
          style={{
            opacity: a,
            transform: `translate(${(1 - a) * -260}px,${float}px)`,
          }}
        >
          <Photo model="14" width={540} />
          {label(V02_HOOK.a)}
        </div>
        <div
          style={{
            opacity: b,
            transform: `translate(${(1 - b) * 260}px,${-float}px)`,
          }}
        >
          <Photo model="15" width={540} />
          {label(V02_HOOK.b)}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- 2. Diseño ----------
const DesignScene: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = spring({
    frame: f - 16,
    fps,
    config: { damping: 20, stiffness: 80 },
  });
  const b = spring({
    frame: f - 28,
    fps,
    config: { damping: 20, stiffness: 80 },
  });
  const lab = useReveal(60);
  const pill = useReveal(110);
  const col = (
    model: "14" | "15",
    sp: number,
    d: { name: string; material: string; weight: string },
  ) => (
    <div
      style={{
        width: 500,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        style={{ opacity: sp, transform: `translateY(${(1 - sp) * 120}px)` }}
      >
        <Photo model={model} width={480} />
      </div>
      <div style={{ marginTop: 20, textAlign: "center", opacity: lab }}>
        <div
          style={{
            fontFamily: HEAD,
            fontWeight: 600,
            fontSize: 52,
            letterSpacing: 1,
            color: "#fff",
          }}
        >
          {d.name}
        </div>
        <div
          style={{
            marginTop: 4,
            fontFamily: BODY,
            fontWeight: 600,
            fontSize: 34,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: SOFT,
          }}
        >
          {d.material}
        </div>
        <div
          style={{
            marginTop: 6,
            fontFamily: HEAD,
            fontWeight: 700,
            fontSize: 96,
            color: "#fff",
          }}
        >
          {d.weight}
        </div>
      </div>
    </div>
  );
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <Title top={110}>{V02_DESIGN.title}</Title>
      <div style={{ marginTop: 36, display: "flex", gap: 20 }}>
        {col("14", a, V02_DESIGN.a)}
        {col("15", b, V02_DESIGN.b)}
      </div>
      <div
        style={{
          marginTop: 30,
          width: 900,
          padding: "26px 36px",
          borderRadius: 24,
          border: `2px solid ${LINE}`,
          background: CARD,
          color: "#fff",
          textAlign: "center",
          fontFamily: BODY,
          fontWeight: 600,
          fontSize: 32,
          lineHeight: 1.3,
          opacity: pill,
          transform: `translateY(${(1 - pill) * 30}px)`,
        }}
      >
        {V02_DESIGN.note}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 3. Puerto ----------
const PortScene: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const block = (
    model: "14" | "15",
    start: number,
    d: { name: string; port: string; speed: string },
  ) => {
    const s = spring({
      frame: f - start,
      fps,
      config: { damping: 20, stiffness: 90 },
    });
    return (
      <div
        style={{
          opacity: s,
          transform: `translateY(${(1 - s) * 70}px)`,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: BODY,
            fontWeight: 600,
            fontSize: 34,
            letterSpacing: 5,
            textTransform: "uppercase",
            color: SOFT,
          }}
        >
          {d.name}
        </div>
        <div
          style={{
            fontFamily: HEAD,
            fontWeight: 700,
            fontSize: 110,
            letterSpacing: 1,
            color: "#fff",
            textTransform: "uppercase",
          }}
        >
          {d.port}
        </div>
        <div
          style={{
            margin: "20px 0 22px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <PortCloseup model={model} width={900} />
        </div>
        <div
          style={{
            fontFamily: BODY,
            fontWeight: 600,
            fontSize: 40,
            color: model === "15" ? GREEN : SOFT,
          }}
        >
          {d.speed}
        </div>
      </div>
    );
  };
  const note = useReveal(120);
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <Title top={130}>{V02_PORT.title}</Title>
      <div
        style={{
          marginTop: 60,
          display: "flex",
          flexDirection: "column",
          gap: 70,
        }}
      >
        {block("14", 20, V02_PORT.a)}
        {block("15", 60, V02_PORT.b)}
      </div>
      <div
        style={{
          marginTop: 70,
          width: 880,
          textAlign: "center",
          fontFamily: BODY,
          fontWeight: 600,
          fontSize: 36,
          lineHeight: 1.35,
          color: "#fff",
          opacity: note,
        }}
      >
        {V02_PORT.note}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 4. Tabla ----------
const TableScene: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const head = useReveal(14);
  const sharedT = useReveal(4 * 50 + 40);
  const COLW = 366;
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <Title top={140}>{V02_TABLE.title}</Title>
      <div style={{ marginTop: 56, width: 1000 }}>
        <div style={{ display: "flex", paddingLeft: 268, opacity: head }}>
          {["iPhone 14 Pro", "iPhone 15 Pro"].map((h) => (
            <div
              key={h}
              style={{
                width: COLW,
                textAlign: "center",
                fontFamily: HEAD,
                fontWeight: 600,
                fontSize: 44,
                color: "#fff",
              }}
            >
              {h}
            </div>
          ))}
        </div>
        {V02_TABLE.rows.map((r, i) => {
          const start = 36 + i * 50;
          const s = spring({
            frame: f - start,
            fps,
            config: { damping: 18, stiffness: 110 },
          });
          const win = interpolate(f, [start + 20, start + 44], [0, 1], clamp);
          return (
            <div
              key={r.label}
              style={{
                marginTop: 22,
                height: 170,
                display: "flex",
                alignItems: "center",
                borderRadius: 32,
                background: CARD,
                border: `2px solid ${LINE}`,
                opacity: s,
                transform: `translateY(${(1 - s) * 60}px)`,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: 268,
                  paddingLeft: 34,
                  boxSizing: "border-box",
                  fontFamily: BODY,
                  fontWeight: 600,
                  fontSize: 28,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  color: SOFT,
                }}
              >
                {r.label}
              </div>
              <div
                style={{
                  width: COLW,
                  textAlign: "center",
                  fontFamily: BODY,
                  fontWeight: 600,
                  fontSize: 34,
                  lineHeight: 1.15,
                  color: "#d8d8dc",
                  padding: "0 14px",
                  boxSizing: "border-box",
                }}
              >
                {r.a}
              </div>
              <div
                style={{
                  width: COLW,
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 12,
                  fontFamily: BODY,
                  fontWeight: 700,
                  fontSize: 35,
                  lineHeight: 1.15,
                  color: "#fff",
                  padding: "0 14px",
                  boxSizing: "border-box",
                  background: `rgba(61,220,132,${0.13 * win})`,
                }}
              >
                {r.b}
                <div style={{ flex: "none", opacity: win }}>
                  <LineIcon
                    kind="check"
                    progress={win}
                    size={40}
                    color={GREEN}
                  />
                </div>
              </div>
            </div>
          );
        })}
        <div
          style={{
            marginTop: 44,
            textAlign: "center",
            fontFamily: BODY,
            fontWeight: 600,
            fontSize: 30,
            letterSpacing: 5,
            textTransform: "uppercase",
            color: SOFT,
            opacity: sharedT,
          }}
        >
          {V02_TABLE.sharedTitle}
        </div>
        <div
          style={{
            marginTop: 22,
            display: "flex",
            flexWrap: "wrap",
            gap: 16,
            justifyContent: "center",
          }}
        >
          {V02_TABLE.shared.map((c, i) => {
            const o = ease(
              interpolate(
                f,
                [4 * 50 + 50 + i * 8, 4 * 50 + 80 + i * 8],
                [0, 1],
                clamp,
              ),
            );
            return (
              <div
                key={c}
                style={{
                  padding: "14px 28px",
                  borderRadius: 14,
                  border: `2px solid ${LINE}`,
                  color: "#fff",
                  fontFamily: BODY,
                  fontWeight: 600,
                  fontSize: 30,
                  opacity: o,
                  transform: `translateY(${(1 - o) * 20}px)`,
                }}
              >
                {c}
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- 5. Incluye ----------
const IncludesScene: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <Title top={170}>{V02_INCLUDES_TITLE}</Title>
      <div style={{ marginTop: 60, width: 900 }}>
        {V02_INCLUDES.map((it, i) => {
          const start = 28 + i * 40;
          const s = spring({
            frame: f - start,
            fps,
            config: { damping: 18, stiffness: 110 },
          });
          const draw = interpolate(f, [start + 8, start + 36], [0, 1], {
            ...clamp,
            easing: Easing.out(Easing.cubic),
          });
          return (
            <div
              key={it.title}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 44,
                height: 250,
                borderBottom:
                  i < V02_INCLUDES.length - 1 ? `2px solid ${LINE}` : "none",
                opacity: s,
                transform: `translateX(${(1 - s) * 80}px)`,
              }}
            >
              <div
                style={{
                  flex: "none",
                  width: 120,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <LineIcon
                  kind={it.icon}
                  progress={draw}
                  size={120}
                  color="#fff"
                />
              </div>
              <div>
                <div
                  style={{
                    fontFamily: HEAD,
                    fontWeight: 600,
                    fontSize: 88,
                    letterSpacing: 1,
                    textTransform: "uppercase",
                    color: "#fff",
                    lineHeight: 1,
                  }}
                >
                  {it.title}
                </div>
                <div
                  style={{
                    marginTop: 10,
                    fontFamily: BODY,
                    fontWeight: 500,
                    fontSize: 30,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    color: SOFT,
                  }}
                >
                  {it.text}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 6. Precios ----------
const PriceScene: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const note = useReveal(130);
  const card = (
    i: number,
    model: "14" | "15",
    d: {
      name: string;
      storage: string;
      color: string;
      price: string;
      tag: string;
    },
  ) => {
    const s = spring({
      frame: f - (28 + i * 40),
      fps,
      config: { damping: 18, stiffness: 110 },
    });
    return (
      <div
        style={{
          width: 940,
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "26px 36px 26px 20px",
          boxSizing: "border-box",
          borderRadius: 36,
          background: CARD,
          border: `2px solid ${LINE}`,
          opacity: s,
          transform: `translateY(${(1 - s) * 90}px)`,
        }}
      >
        <div
          style={{
            flex: "none",
            width: 300,
          }}
        >
          <Photo model={model} width={300} />
        </div>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontFamily: HEAD,
              fontWeight: 700,
              fontSize: 64,
              letterSpacing: 1,
              color: "#fff",
              lineHeight: 1,
            }}
          >
            {d.name}
          </div>
          <div
            style={{
              marginTop: 14,
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div
              style={{
                padding: "6px 18px",
                borderRadius: 10,
                border: `2px solid ${LINE}`,
                fontFamily: HEAD,
                fontWeight: 500,
                fontSize: 34,
                color: "#fff",
              }}
            >
              {d.storage}
            </div>
            <div
              style={{
                fontFamily: BODY,
                fontWeight: 600,
                fontSize: 24,
                letterSpacing: 2,
                textTransform: "uppercase",
                color: SOFT,
              }}
            >
              {d.color}
            </div>
          </div>
          {d.price ? (
            <>
              <div
                style={{
                  marginTop: 20,
                  fontFamily: BODY,
                  fontWeight: 500,
                  fontSize: 24,
                  letterSpacing: 4,
                  textTransform: "uppercase",
                  color: SOFT,
                }}
              >
                {V02_PRICE.label}
              </div>
              <div
                style={{
                  fontFamily: HEAD,
                  fontWeight: 700,
                  fontSize: 120,
                  color: "#fff",
                  lineHeight: 1.05,
                }}
              >
                <span style={{ fontSize: 64, fontWeight: 500 }}>S/ </span>
                {d.price}
              </div>
            </>
          ) : (
            <div
              style={{
                marginTop: 28,
                fontFamily: HEAD,
                fontWeight: 600,
                fontSize: 60,
                textTransform: "uppercase",
                color: "#fff",
                lineHeight: 1.1,
              }}
            >
              {V02_PRICE.consult}
            </div>
          )}
          <div
            style={{
              marginTop: 14,
              fontFamily: BODY,
              fontWeight: 500,
              fontSize: 25,
              color: GREEN,
            }}
          >
            {d.tag}
          </div>
        </div>
      </div>
    );
  };
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <Title top={150}>{V02_PRICE.title}</Title>
      <div
        style={{
          marginTop: 60,
          display: "flex",
          flexDirection: "column",
          gap: 40,
        }}
      >
        {card(0, "14", V02_PRICE.a)}
        {card(1, "15", V02_PRICE.b)}
      </div>
      <div
        style={{
          marginTop: 56,
          width: 860,
          textAlign: "center",
          fontFamily: BODY,
          fontWeight: 600,
          fontSize: 36,
          lineHeight: 1.35,
          color: "#fff",
          opacity: note,
        }}
      >
        {V02_PRICE.note}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 7. Cierre ----------
const WhatsApp: React.FC<{ size: number }> = ({ size }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    stroke="#fff"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 3.5a12.5 12.5 0 0 0-10.7 19L3.5 28.5l6.2-1.7A12.5 12.5 0 1 0 16 3.5z" />
    <path d="M11.5 10.5c-.6.6-1 1.5-.6 2.8 1 2.9 3.8 5.7 6.8 6.8 1.2.4 2.1 0 2.7-.7l.6-1.2-2.8-1.6-1.2 1c-1.6-.7-3-2.1-3.7-3.7l1-1.2-1.6-2.8z" />
  </svg>
);
const TikTok: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#fff">
    <path d="M16.6 3h-3.2v12.4a2.6 2.6 0 1 1-2.6-2.6c.3 0 .6 0 .9.1V9.6a5.8 5.8 0 1 0 4.9 5.7V8.8c1 .8 2.3 1.3 3.7 1.3V6.9c-2.1 0-3.7-1.600-3.700-3.900z" />
  </svg>
);
const Instagram: React.FC<{ size: number }> = ({ size }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="#fff"
    strokeWidth={1.8}
  >
    <rect x="3" y="3" width="18" height="18" rx="5.5" />
    <circle cx="12" cy="12" r="4.2" />
    <circle cx="17.3" cy="6.7" r="1" fill="#fff" stroke="none" />
  </svg>
);

export const CtaScene: React.FC<{ title?: string }> = ({
  title = V02_CTA.title,
}) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logo = useReveal(0, 30);
  const t = useReveal(20);
  const num = spring({
    frame: f - 44,
    fps,
    config: { damping: 14, stiffness: 120 },
  });
  const pulse = 1 + Math.sin(Math.max(0, f - 100) / 9) * 0.015;
  const fol = useReveal(90);
  const foot = useReveal(120);
  const trustIcons = ["shield", "box", "check"] as const;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ opacity: logo, marginTop: -120 }}>
        <WhiteLogo width={520} />
      </div>
      <div
        style={{
          marginTop: 6,
          width: 900,
          textAlign: "center",
          fontFamily: HEAD,
          fontWeight: 700,
          fontSize: 108,
          lineHeight: 1.02,
          letterSpacing: 1.5,
          textTransform: "uppercase",
          color: "#fff",
          opacity: t,
          transform: `translateY(${(1 - t) * 30}px)`,
        }}
      >
        {title}
      </div>
      <div
        style={{
          marginTop: 44,
          padding: "30px 56px 34px",
          borderRadius: 36,
          border: "2.5px solid rgba(255,255,255,0.75)",
          display: "flex",
          alignItems: "center",
          gap: 34,
          opacity: num,
          transform: `scale(${(0.82 + 0.18 * num) * pulse})`,
        }}
      >
        <WhatsApp size={120} />
        <div>
          <div
            style={{
              fontFamily: BODY,
              fontWeight: 500,
              fontSize: 32,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: "#fff",
            }}
          >
            {V02_CTA.lead}
          </div>
          <div
            style={{
              fontFamily: HEAD,
              fontWeight: 700,
              fontSize: 112,
              letterSpacing: 2,
              color: "#fff",
              lineHeight: 1.05,
            }}
          >
            {V02_CTA.phone}
          </div>
        </div>
      </div>
      <div style={{ marginTop: 56, width: 900, opacity: fol }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{ flex: 1, height: 2, background: LINE }} />
          <div
            style={{
              fontFamily: BODY,
              fontWeight: 500,
              fontSize: 30,
              letterSpacing: 8,
              textTransform: "uppercase",
              color: "#fff",
            }}
          >
            {V02_CTA.follow}
          </div>
          <div style={{ flex: 1, height: 2, background: LINE }} />
        </div>
        <div
          style={{
            marginTop: 30,
            display: "flex",
            justifyContent: "center",
            gap: 70,
          }}
        >
          {[TikTok, Instagram].map((Icon, i) => (
            <div
              key={i}
              style={{ display: "flex", alignItems: "center", gap: 18 }}
            >
              <Icon size={64} />
              <div
                style={{
                  fontFamily: BODY,
                  fontWeight: 500,
                  fontSize: 40,
                  color: "#fff",
                }}
              >
                {V02_CTA.handle}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 96,
          width: 960,
          display: "flex",
          justifyContent: "space-between",
          opacity: foot,
        }}
      >
        {V02_CTA.trust.map((txt, i) => (
          <div
            key={txt}
            style={{ display: "flex", alignItems: "center", gap: 10 }}
          >
            <LineIcon
              kind={trustIcons[i]}
              progress={1}
              size={34}
              color="#fff"
            />
            <div
              style={{
                fontFamily: BODY,
                fontWeight: 500,
                fontSize: 19,
                letterSpacing: 1,
                whiteSpace: "nowrap",
                textTransform: "uppercase",
                color: "#d8d8dc",
              }}
            >
              {txt}
            </div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

const seq = (
  key: keyof typeof V02_SCENES,
  node: React.ReactNode,
  opts: { fadeIn?: number; fadeOut?: number } = {},
) => (
  <Sequence
    key={key}
    from={V02_SCENES[key].from}
    durationInFrames={V02_SCENES[key].duration}
    premountFor={FPS}
  >
    <Scene duration={V02_SCENES[key].duration} {...opts}>
      {node}
    </Scene>
  </Sequence>
);

export const Video02: React.FC = () => (
  <AbsoluteFill>
    <DarkBackground />
    <Audio
      src={staticFile(V02_MUSIC_FILE)}
      volume={(f) =>
        V02_MUSIC_VOLUME *
        interpolate(f, [0, 8, V02_TOTAL - 45, V02_TOTAL], [0.3, 1, 1, 0], clamp)
      }
    />
    {seq("hook", <HookScene />, { fadeIn: 1 })}
    {seq("design", <DesignScene />)}
    {seq("port", <PortScene />)}
    {seq("table", <TableScene />)}
    {seq("includes", <IncludesScene />)}
    {seq("price", <PriceScene />)}
    {seq("cta", <CtaScene />, { fadeOut: 20 })}
  </AbsoluteFill>
);
