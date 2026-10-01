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
import { COLORS, FPS } from "./config";
import {
  V02_CTA,
  V02_DESIGN,
  V02_HOOK,
  V02_MUSIC_VOLUME,
  V02_PORT,
  V02_SCENES,
  V02_TABLE,
  V02_TOTAL,
  V02_VERDICT,
} from "./video02";
import { Background, Logo, Scene } from "./BykerStore";
import { PhoneBack, PhoneBottom, PhoneFront } from "./Phones";
import { LineIcon } from "./Icons";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.16, 1, 0.3, 1);
const GREEN = "#2fb457";

const useReveal = (from: number, len = 30) => {
  const f = useCurrentFrame();
  return ease(interpolate(f, [from, from + len], [0, 1], clamp));
};

const Title: React.FC<{
  children: React.ReactNode;
  top?: number;
  size?: number;
}> = ({ children, top = 170, size = 92 }) => {
  const t = useReveal(6);
  return (
    <div
      style={{
        marginTop: top,
        textAlign: "center",
        fontFamily: "Inter",
        fontWeight: 800,
        fontSize: size,
        letterSpacing: -3,
        lineHeight: 1.05,
        color: COLORS.ink,
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
  const t1 = useReveal(6);
  const t2 = useReveal(20);
  const a = spring({
    frame: f - 14,
    fps,
    config: { damping: 20, stiffness: 80 },
  });
  const b = spring({
    frame: f - 22,
    fps,
    config: { damping: 20, stiffness: 80 },
  });
  const float = Math.sin(f / 28) * 8;
  return (
    <AbsoluteFill style={{ alignItems: "center", fontFamily: "Inter" }}>
      <div
        style={{
          marginTop: 180,
          width: 900,
          textAlign: "center",
          fontWeight: 800,
          fontSize: 104,
          lineHeight: 1.04,
          letterSpacing: -3.5,
          color: COLORS.ink,
          opacity: t1,
          transform: `translateY(${(1 - t1) * 40}px)`,
        }}
      >
        {V02_HOOK.title}
      </div>
      <div
        style={{
          marginTop: 24,
          fontWeight: 600,
          fontSize: 56,
          color: COLORS.soft,
          opacity: t2,
          transform: `translateY(${(1 - t2) * 30}px)`,
        }}
      >
        {V02_HOOK.subtitle}
      </div>
      <div
        style={{
          marginTop: 90,
          display: "flex",
          gap: 50,
          perspective: 2400,
          position: "relative",
        }}
      >
        <div
          style={{
            opacity: a,
            transform: `translate(${(1 - a) * -300}px,${float}px) rotateY(${14 - (1 - a) * 30}deg)`,
          }}
        >
          <PhoneFront model="14" width={410} />
        </div>
        <div
          style={{
            opacity: b,
            transform: `translate(${(1 - b) * 300}px,${-float}px) rotateY(${-14 + (1 - b) * 30}deg)`,
          }}
        >
          <PhoneFront model="15" width={410} />
        </div>
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "46%",
            marginLeft: -62,
            width: 124,
            height: 124,
            borderRadius: 62,
            background: COLORS.ink,
            color: "#fff",
            fontWeight: 800,
            fontSize: 52,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 20px 40px rgba(0,0,0,0.35)",
            transform: `scale(${Math.min(a, b)})`,
          }}
        >
          VS
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
        width: 440,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        style={{
          perspective: 2000,
          opacity: sp,
          transform: `translateY(${(1 - sp) * 120}px) rotateY(${model === "14" ? 10 : -10}deg)`,
        }}
      >
        <PhoneBack model={model} width={400} />
      </div>
      <div style={{ marginTop: 50, textAlign: "center", opacity: lab }}>
        <div
          style={{
            fontWeight: 800,
            fontSize: 54,
            color: COLORS.ink,
            letterSpacing: -1,
          }}
        >
          {d.name}
        </div>
        <div
          style={{
            marginTop: 6,
            fontWeight: 600,
            fontSize: 40,
            color: COLORS.soft,
          }}
        >
          {d.material}
        </div>
        <div
          style={{
            marginTop: 6,
            fontWeight: 800,
            fontSize: 64,
            color: COLORS.ink,
          }}
        >
          {d.weight}
        </div>
      </div>
    </div>
  );
  return (
    <AbsoluteFill style={{ alignItems: "center", fontFamily: "Inter" }}>
      <Title>{V02_DESIGN.title}</Title>
      <div style={{ marginTop: 70, display: "flex", gap: 40 }}>
        {col("14", a, V02_DESIGN.a)}
        {col("15", b, V02_DESIGN.b)}
      </div>
      <div
        style={{
          marginTop: 44,
          width: 900,
          padding: "26px 36px",
          borderRadius: 999,
          background: COLORS.ink,
          color: "#fff",
          textAlign: "center",
          fontWeight: 600,
          fontSize: 34,
          lineHeight: 1.25,
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
            fontWeight: 700,
            fontSize: 38,
            color: COLORS.soft,
            letterSpacing: 1,
          }}
        >
          {d.name.toUpperCase()}
        </div>
        <div
          style={{
            fontWeight: 800,
            fontSize: 84,
            letterSpacing: -2,
            color: COLORS.ink,
          }}
        >
          {d.port}
        </div>
        <div
          style={{
            margin: "26px 0 20px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <PhoneBottom model={model} width={900} />
        </div>
        <div
          style={{
            fontWeight: 600,
            fontSize: 42,
            color: model === "15" ? GREEN : COLORS.soft,
          }}
        >
          {d.speed}
        </div>
      </div>
    );
  };
  const note = useReveal(120);
  return (
    <AbsoluteFill style={{ alignItems: "center", fontFamily: "Inter" }}>
      <Title top={150}>{V02_PORT.title}</Title>
      <div
        style={{
          marginTop: 70,
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
          marginTop: 60,
          width: 880,
          textAlign: "center",
          fontWeight: 600,
          fontSize: 38,
          lineHeight: 1.3,
          color: COLORS.ink,
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
    <AbsoluteFill style={{ alignItems: "center", fontFamily: "Inter" }}>
      <Title top={150}>{V02_TABLE.title}</Title>
      <div style={{ marginTop: 56, width: 1000 }}>
        <div style={{ display: "flex", paddingLeft: 268, opacity: head }}>
          {["14 Pro", "15 Pro"].map((h) => (
            <div
              key={h}
              style={{
                width: COLW,
                textAlign: "center",
                fontWeight: 800,
                fontSize: 50,
                color: COLORS.ink,
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
                borderRadius: 40,
                background: "rgba(255,255,255,0.94)",
                border: `2px solid ${COLORS.line}`,
                boxShadow: "0 20px 50px rgba(0,0,0,0.09)",
                opacity: s,
                transform: `translateY(${(1 - s) * 60}px)`,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: 268,
                  paddingLeft: 36,
                  boxSizing: "border-box",
                  fontWeight: 700,
                  fontSize: 34,
                  color: COLORS.soft,
                }}
              >
                {r.label}
              </div>
              <div
                style={{
                  width: COLW,
                  textAlign: "center",
                  fontWeight: 600,
                  fontSize: 38,
                  lineHeight: 1.15,
                  color: COLORS.ink,
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
                  fontWeight: 800,
                  fontSize: 40,
                  lineHeight: 1.15,
                  color: COLORS.ink,
                  padding: "0 14px",
                  boxSizing: "border-box",
                  background: `rgba(47,180,87,${0.1 * win})`,
                }}
              >
                {r.b}
                <div style={{ flex: "none", opacity: win }}>
                  <LineIcon
                    kind="check"
                    progress={win}
                    size={42}
                    color={GREEN}
                  />
                </div>
              </div>
            </div>
          );
        })}
        <div
          style={{
            marginTop: 40,
            textAlign: "center",
            fontWeight: 700,
            fontSize: 38,
            color: COLORS.soft,
            opacity: sharedT,
          }}
        >
          {V02_TABLE.sharedTitle}
        </div>
        <div
          style={{
            marginTop: 20,
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
                  padding: "16px 30px",
                  borderRadius: 999,
                  background: COLORS.ink,
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: 32,
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

// ---------- 5. Veredicto ----------
const VerdictScene: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const note = useReveal(120);
  const card = (
    i: number,
    model: "14" | "15",
    d: { name: string; text: string },
  ) => {
    const s = spring({
      frame: f - (30 + i * 40),
      fps,
      config: { damping: 18, stiffness: 110 },
    });
    return (
      <div
        style={{
          width: 920,
          display: "flex",
          alignItems: "center",
          gap: 36,
          padding: "44px 48px",
          boxSizing: "border-box",
          borderRadius: 48,
          background: "rgba(255,255,255,0.94)",
          border: `2px solid ${COLORS.line}`,
          boxShadow: "0 30px 70px rgba(0,0,0,0.10)",
          opacity: s,
          transform: `translateY(${(1 - s) * 90}px)`,
        }}
      >
        <div style={{ flex: "none", transform: "rotate(-6deg)" }}>
          <PhoneFront model={model} width={200} />
        </div>
        <div>
          <div
            style={{
              fontWeight: 800,
              fontSize: 52,
              letterSpacing: -1,
              color: COLORS.ink,
            }}
          >
            {d.name}
          </div>
          <div
            style={{
              marginTop: 12,
              fontWeight: 400,
              fontSize: 38,
              lineHeight: 1.25,
              color: COLORS.soft,
            }}
          >
            {d.text}
          </div>
        </div>
      </div>
    );
  };
  return (
    <AbsoluteFill style={{ alignItems: "center", fontFamily: "Inter" }}>
      <Title top={190}>{V02_VERDICT.title}</Title>
      <div
        style={{
          marginTop: 80,
          display: "flex",
          flexDirection: "column",
          gap: 40,
        }}
      >
        {card(0, "14", V02_VERDICT.a)}
        {card(1, "15", V02_VERDICT.b)}
      </div>
      <div
        style={{
          marginTop: 60,
          width: 860,
          textAlign: "center",
          fontWeight: 600,
          fontSize: 40,
          lineHeight: 1.3,
          color: COLORS.ink,
          opacity: note,
        }}
      >
        {V02_VERDICT.note}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 6. Cierre con número ----------
const CtaScene: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logo = spring({
    frame: f,
    fps,
    config: { damping: 200 },
    durationInFrames: 40,
  });
  const t = useReveal(24);
  const lead = useReveal(44);
  const num = spring({
    frame: f - 56,
    fps,
    config: { damping: 14, stiffness: 120 },
  });
  const pulse = 1 + Math.sin(Math.max(0, f - 100) / 9) * 0.018;
  const foot = useReveal(100);
  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Inter",
      }}
    >
      <div
        style={{
          opacity: logo,
          marginTop: -150,
          transform: `scale(${0.92 + 0.08 * logo})`,
        }}
      >
        <Logo width={800} />
      </div>
      <div
        style={{
          marginTop: -40,
          width: 900,
          textAlign: "center",
          fontWeight: 800,
          fontSize: 94,
          lineHeight: 1.05,
          letterSpacing: -3,
          color: COLORS.ink,
          opacity: t,
          transform: `translateY(${(1 - t) * 30}px)`,
        }}
      >
        {V02_CTA.title}
      </div>
      <div
        style={{
          marginTop: 28,
          fontWeight: 600,
          fontSize: 48,
          color: COLORS.soft,
          opacity: lead,
        }}
      >
        {V02_CTA.lead}
      </div>
      <div
        style={{
          marginTop: 26,
          padding: "34px 70px",
          borderRadius: 999,
          background: COLORS.ink,
          color: "#fff",
          display: "flex",
          alignItems: "center",
          gap: 28,
          boxShadow: "0 30px 60px rgba(0,0,0,0.30)",
          opacity: num,
          transform: `scale(${(0.8 + 0.2 * num) * pulse})`,
        }}
      >
        <svg
          width={70}
          height={70}
          viewBox="0 0 24 24"
          fill="none"
          stroke="#fff"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
        </svg>
        <div style={{ fontWeight: 800, fontSize: 96, letterSpacing: 2 }}>
          {V02_CTA.phone}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 130,
          fontSize: 32,
          letterSpacing: 6,
          fontWeight: 600,
          color: COLORS.soft,
          textTransform: "uppercase",
          opacity: foot,
        }}
      >
        {V02_CTA.footer}
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
    <Background />
    <Audio
      src={staticFile("byker/music-v02.wav")}
      volume={(f) =>
        V02_MUSIC_VOLUME *
        interpolate(f, [0, 30, V02_TOTAL - 45, V02_TOTAL], [0, 1, 1, 0], clamp)
      }
    />
    {seq("hook", <HookScene />, { fadeIn: 1 })}
    {seq("design", <DesignScene />)}
    {seq("port", <PortScene />)}
    {seq("table", <TableScene />)}
    {seq("verdict", <VerdictScene />)}
    {seq("cta", <CtaScene />, { fadeOut: 20 })}
  </AbsoluteFill>
);
