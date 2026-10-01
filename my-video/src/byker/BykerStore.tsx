import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-600.css";
import "@fontsource/inter/latin-700.css";
import "@fontsource/inter/latin-800.css";
import {
  COLORS,
  CTA,
  FPS,
  HERO,
  SCENES,
  TRUST_POINTS,
  TRUST_TITLE,
} from "./config";
import { HighlightsScene } from "./Highlights";
import { IPhone } from "./IPhone";
import { LineIcon } from "./Icons";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.16, 1, 0.3, 1);

// Aparece y desaparece con fundido suave dentro de su Sequence.
export const Scene: React.FC<{
  children: React.ReactNode;
  fadeIn?: number;
  fadeOut?: number;
  duration: number;
}> = ({ children, fadeIn = 15, fadeOut = 15, duration }) => {
  const f = useCurrentFrame();
  const o = interpolate(
    f,
    [0, fadeIn, duration - fadeOut, duration],
    [0, 1, 1, 0],
    clamp,
  );
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

export const Logo: React.FC<{ width: number; style?: React.CSSProperties }> = ({
  width,
  style,
}) => (
  <Img
    src={staticFile("byker/logo.webp")}
    style={{
      width,
      mixBlendMode: "multiply",
      WebkitMaskImage:
        "radial-gradient(circle at 50% 50%,#000 58%,transparent 74%)",
      ...style,
    }}
  />
);

export const Background: React.FC = () => {
  const f = useCurrentFrame();
  const drift = interpolate(f, [0, 900], [0, 120]);
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(90% 60% at ${40 + drift / 6}% 20%,#ffffff 0%,${COLORS.bg} 55%,${COLORS.bgDeep} 100%)`,
      }}
    />
  );
};

// ---------- Escena 1: logo ----------
export const LogoScene: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({
    frame: f,
    fps,
    config: { damping: 200 },
    durationInFrames: 60,
  });
  const scale = interpolate(p, [0, 1], [0.86, 1]);
  const blur = interpolate(p, [0, 1], [24, 0]);
  const sweep = interpolate(f, [25, 90], [-30, 130], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          position: "relative",
          transform: `scale(${scale})`,
          opacity: p,
          filter: `blur(${blur}px)`,
        }}
      >
        <Logo width={1040} />
        {/* destello de luz que cruza el logo */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            mixBlendMode: "soft-light",
            background: `linear-gradient(105deg,transparent ${sweep - 14}%,rgba(255,255,255,0.95) ${sweep}%,transparent ${sweep + 14}%)`,
            WebkitMaskImage:
              "radial-gradient(circle at 50% 50%,#000 58%,transparent 74%)",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

// ---------- Escena 2: iPhone + titular ----------
const HeroScene: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const phone = spring({
    frame: f - 5,
    fps,
    config: { damping: 22, stiffness: 70 },
  });
  const rotY = interpolate(phone, [0, 1], [-38, -14]) + Math.sin(f / 40) * 4;
  const rotX = 6 + Math.cos(f / 55) * 2;
  const y = interpolate(phone, [0, 1], [260, 0]) + Math.sin(f / 30) * 8;
  const t1 = ease(interpolate(f, [30, 60], [0, 1], clamp));
  const t2 = ease(interpolate(f, [42, 72], [0, 1], clamp));
  const t0 = ease(interpolate(f, [20, 50], [0, 1], clamp));
  return (
    <AbsoluteFill style={{ alignItems: "center", fontFamily: "Inter" }}>
      <div
        style={{
          marginTop: 170,
          fontWeight: 700,
          fontSize: 34,
          letterSpacing: 8,
          color: COLORS.soft,
          opacity: t0,
          transform: `translateY(${(1 - t0) * 20}px)`,
        }}
      >
        {HERO.eyebrow}
      </div>
      <div
        style={{
          marginTop: 34,
          textAlign: "center",
          fontWeight: 800,
          fontSize: 102,
          lineHeight: 1.05,
          letterSpacing: -3,
          color: COLORS.ink,
        }}
      >
        <div
          style={{ opacity: t1, transform: `translateY(${(1 - t1) * 40}px)` }}
        >
          {HERO.line1}
        </div>
        <div
          style={{ opacity: t2, transform: `translateY(${(1 - t2) * 40}px)` }}
        >
          {HERO.line2}
        </div>
      </div>
      <div style={{ marginTop: 90, perspective: 2200, opacity: phone }}>
        <div
          style={{
            transform: `translateY(${y}px) rotateX(${rotX}deg) rotateY(${rotY}deg)`,
          }}
        >
          <IPhone width={560} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- Escena 3: por qué confiar ----------
const TrustScene: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tt = ease(interpolate(f, [8, 38], [0, 1], clamp));
  return (
    <AbsoluteFill style={{ fontFamily: "Inter", alignItems: "center" }}>
      <div
        style={{
          marginTop: 190,
          fontWeight: 800,
          fontSize: 88,
          lineHeight: 1.05,
          letterSpacing: -2.5,
          textAlign: "center",
          color: COLORS.ink,
          width: 860,
          opacity: tt,
          transform: `translateY(${(1 - tt) * 30}px)`,
        }}
      >
        {TRUST_TITLE}
      </div>
      <div
        style={{
          marginTop: 80,
          display: "flex",
          flexDirection: "column",
          gap: 34,
        }}
      >
        {TRUST_POINTS.map((p, i) => {
          const start = 40 + i * 55;
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
              key={p.title}
              style={{
                width: 900,
                display: "flex",
                alignItems: "center",
                gap: 40,
                padding: "44px 48px",
                borderRadius: 44,
                background: "rgba(255,255,255,0.92)",
                border: `2px solid ${COLORS.line}`,
                boxShadow:
                  "0 30px 70px rgba(0,0,0,0.10), 0 4px 14px rgba(0,0,0,0.05)",
                opacity: s,
                transform: `translateY(${(1 - s) * 90}px) scale(${interpolate(s, [0, 1], [0.94, 1])})`,
              }}
            >
              <div
                style={{
                  flex: "none",
                  width: 132,
                  height: 132,
                  borderRadius: 34,
                  background: "#f0f0f3",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <LineIcon kind={p.icon} progress={draw} size={84} />
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
                  {p.title}
                </div>
                <div
                  style={{
                    marginTop: 10,
                    fontWeight: 400,
                    fontSize: 34,
                    lineHeight: 1.3,
                    color: COLORS.soft,
                  }}
                >
                  {p.text}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------- Escena 4: cierre ----------
export const CtaScene: React.FC<{ title?: string; subtitle?: string }> = ({
  title = CTA.title,
  subtitle = CTA.subtitle,
}) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logo = spring({
    frame: f,
    fps,
    config: { damping: 200 },
    durationInFrames: 40,
  });
  const a = ease(interpolate(f, [25, 55], [0, 1], clamp));
  const b = ease(interpolate(f, [38, 68], [0, 1], clamp));
  const btn = spring({
    frame: f - 60,
    fps,
    config: { damping: 14, stiffness: 120 },
  });
  const pulse = 1 + Math.sin(Math.max(0, f - 100) / 9) * 0.015;
  const c = ease(interpolate(f, [90, 120], [0, 1], clamp));
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
          transform: `scale(${interpolate(logo, [0, 1], [0.92, 1])})`,
          marginTop: -120,
        }}
      >
        <Logo width={900} />
      </div>
      <div
        style={{
          marginTop: -30,
          textAlign: "center",
          color: COLORS.ink,
          fontWeight: 800,
          fontSize: 110,
          letterSpacing: -3,
          opacity: a,
          transform: `translateY(${(1 - a) * 30}px)`,
        }}
      >
        {title}
      </div>
      <div
        style={{
          marginTop: 14,
          fontSize: 44,
          fontWeight: 400,
          color: COLORS.soft,
          opacity: b,
          transform: `translateY(${(1 - b) * 30}px)`,
        }}
      >
        {subtitle}
      </div>
      <div
        style={{
          marginTop: 70,
          padding: "42px 84px",
          borderRadius: 999,
          background: COLORS.ink,
          color: "#fff",
          fontWeight: 700,
          fontSize: 52,
          boxShadow: "0 30px 60px rgba(0,0,0,0.28)",
          opacity: btn,
          transform: `scale(${interpolate(btn, [0, 1], [0.8, 1]) * pulse})`,
        }}
      >
        {CTA.button}
      </div>
      {CTA.handle ? (
        <div
          style={{
            marginTop: 34,
            fontSize: 46,
            fontWeight: 600,
            color: COLORS.ink,
            opacity: c,
          }}
        >
          {CTA.handle}
        </div>
      ) : null}
      <div
        style={{
          position: "absolute",
          bottom: 130,
          fontSize: 32,
          letterSpacing: 6,
          fontWeight: 600,
          color: COLORS.soft,
          textTransform: "uppercase",
          opacity: c,
        }}
      >
        {CTA.footer}
      </div>
    </AbsoluteFill>
  );
};

export const BykerStore: React.FC = () => (
  <AbsoluteFill style={{ background: COLORS.bg }}>
    <Background />
    <Sequence
      from={SCENES.logo.from}
      durationInFrames={SCENES.logo.duration}
      premountFor={FPS}
    >
      <Scene duration={SCENES.logo.duration} fadeIn={1}>
        <LogoScene />
      </Scene>
    </Sequence>
    <Sequence
      from={SCENES.hero.from}
      durationInFrames={SCENES.hero.duration}
      premountFor={FPS}
    >
      <Scene duration={SCENES.hero.duration}>
        <HeroScene />
      </Scene>
    </Sequence>
    <Sequence
      from={SCENES.highlights.from}
      durationInFrames={SCENES.highlights.duration}
      premountFor={FPS}
    >
      <Scene duration={SCENES.highlights.duration}>
        <HighlightsScene />
      </Scene>
    </Sequence>
    <Sequence
      from={SCENES.trust.from}
      durationInFrames={SCENES.trust.duration}
      premountFor={FPS}
    >
      <Scene duration={SCENES.trust.duration}>
        <TrustScene />
      </Scene>
    </Sequence>
    <Sequence
      from={SCENES.cta.from}
      durationInFrames={SCENES.cta.duration}
      premountFor={FPS}
    >
      <Scene duration={SCENES.cta.duration} fadeOut={20}>
        <CtaScene />
      </Scene>
    </Sequence>
  </AbsoluteFill>
);
