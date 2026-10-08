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
import { FPS } from "./config";
import {
  V04_BYKER,
  V04_CTA_TITLE,
  V04_HOOK,
  V04_MUSIC_FILE,
  V04_MUSIC_VOLUME,
  V04_SCENES,
  V04_STEP1,
  V04_STEP2,
  V04_STEP3,
  V04_TOTAL,
  V04_VOICE_DIR,
  V04_VOICE_READY,
} from "./video04";
import voice from "./voice04.json";
import { Scene } from "./BykerStore";
import {
  BODY,
  CARD,
  CtaScene,
  DarkBackground,
  GREEN,
  HEAD,
  LINE,
  SOFT,
  useReveal,
} from "./Video02";
import { LineIcon } from "./Icons";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const YELLOW = "#ffd60a";
const RED = "#ff453a";

// Batería grande que se llena; p va de 0 a 1.
const Battery: React.FC<{ p: number; width: number }> = ({ p, width }) => {
  const h = width * 0.46;
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <div
        style={{
          width,
          height: h,
          borderRadius: h * 0.28,
          border: `${width * 0.026}px solid #fff`,
          padding: width * 0.03,
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${p * 100}%`,
            borderRadius: h * 0.16,
            background: `linear-gradient(180deg,#6df09a,${GREEN})`,
            boxShadow: `0 0 ${width * 0.08}px ${GREEN}88`,
          }}
        />
      </div>
      <div
        style={{
          width: width * 0.035,
          height: h * 0.34,
          borderRadius: "0 8px 8px 0",
          background: "#fff",
          marginLeft: 4,
        }}
      />
    </div>
  );
};

const Gear: React.FC<{ size: number }> = ({ size }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="#fff"
    strokeWidth={1.8}
    strokeLinecap="round"
  >
    <circle cx="12" cy="12" r="3.2" />
    <path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M18.7 5.3l-2.1 2.1M7.4 16.6l-2.1 2.1" />
  </svg>
);

const StepHead: React.FC<{ n: string; title: string; top?: number }> = ({
  n,
  title,
  top = 150,
}) => {
  const a = useReveal(4);
  const b = useReveal(14);
  return (
    <div style={{ marginTop: top, textAlign: "center" }}>
      <div
        style={{
          fontFamily: HEAD,
          fontWeight: 700,
          fontSize: 120,
          letterSpacing: 6,
          textTransform: "uppercase",
          color: YELLOW,
          opacity: a,
          transform: `translateY(${(1 - a) * 30}px)`,
        }}
      >
        {n}
      </div>
      <div
        style={{
          width: 900,
          fontFamily: HEAD,
          fontWeight: 600,
          fontSize: 88,
          lineHeight: 1.1,
          textTransform: "uppercase",
          color: "#fff",
          opacity: b,
          transform: `translateY(${(1 - b) * 30}px)`,
        }}
      >
        {title}
      </div>
    </div>
  );
};

// ---------- 1. Gancho ----------
const HookScene: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const slam = (d: number) =>
    spring({
      frame: f - d,
      fps,
      config: { damping: 9, stiffness: 190, mass: 0.7 },
    });
  const s1 = slam(2);
  const s2 = slam(10);
  const s3 = slam(18);
  const sub = useReveal(34);
  const fill = interpolate(f, [30, 100], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const bat = spring({
    frame: f - 22,
    fps,
    config: { damping: 18, stiffness: 100 },
  });
  const cta = useReveal(105);
  const line = (txt: string, sp: number, color: string) => (
    <div
      style={{
        transform: `scale(${interpolate(sp, [0, 1], [2.3, 1])})`,
        opacity: Math.min(1, sp * 2),
        color,
      }}
    >
      {txt}
    </div>
  );
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <div
        style={{
          marginTop: 150,
          textAlign: "center",
          fontFamily: HEAD,
          fontWeight: 700,
          fontSize: 140,
          lineHeight: 1.04,
          textTransform: "uppercase",
          whiteSpace: "nowrap",
        }}
      >
        {line(V04_HOOK.line1, s1, "#fff")}
        {line(V04_HOOK.line2, s2, YELLOW)}
        {line(V04_HOOK.line3, s3, YELLOW)}
      </div>
      <div
        style={{
          marginTop: 20,
          fontFamily: BODY,
          fontWeight: 600,
          fontSize: 44,
          letterSpacing: 3,
          color: "#fff",
          opacity: sub,
        }}
      >
        {V04_HOOK.sub}
      </div>
      <div
        style={{
          marginTop: 90,
          opacity: bat,
          transform: `scale(${interpolate(bat, [0, 1], [0.85, 1])})`,
        }}
      >
        <Battery p={fill} width={740} />
      </div>
      <div
        style={{
          marginTop: 30,
          fontFamily: HEAD,
          fontWeight: 700,
          fontSize: 280,
          lineHeight: 1,
          color: GREEN,
          opacity: bat,
        }}
      >
        {Math.round(fill * 100)}%
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 130,
          fontFamily: BODY,
          fontWeight: 700,
          fontSize: 44,
          letterSpacing: 6,
          textTransform: "uppercase",
          color: "#fff",
          opacity: cta,
        }}
      >
        {V04_HOOK.cta} ↓
      </div>
    </AbsoluteFill>
  );
};

// ---------- 2. Paso 1: la ruta en Ajustes ----------
const Step1Scene: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const hint = useReveal(130);
  const card = (i: number) => {
    const c = V04_STEP1.chain[i];
    const start = 34 + i * 34;
    const s = spring({
      frame: f - start,
      fps,
      config: { damping: 18, stiffness: 120 },
    });
    const last = i === V04_STEP1.chain.length - 1;
    const pulse = last ? 0.5 + 0.5 * Math.sin(f / 5) : 0;
    return (
      <React.Fragment key={c.label}>
        {i > 0 ? (
          <div
            style={{
              height: 96,
              display: "flex",
              justifyContent: "center",
              opacity: s,
            }}
          >
            <svg
              width={50}
              height={70}
              viewBox="0 0 24 34"
              fill="none"
              stroke="#fff"
              strokeWidth={2.4}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2v26M5 21l7 8 7-8" />
            </svg>
          </div>
        ) : null}
        <div
          style={{
            width: 920,
            height: 240,
            boxSizing: "border-box",
            padding: "0 48px",
            borderRadius: 40,
            background: last ? "rgba(255,214,10,0.12)" : "#1c1c1e",
            border: `3px solid ${last ? YELLOW : LINE}`,
            boxShadow: last ? `0 0 ${30 + pulse * 30}px ${YELLOW}55` : "none",
            display: "flex",
            alignItems: "center",
            gap: 36,
            opacity: s,
            transform: `translateY(${(1 - s) * 70}px)`,
          }}
        >
          <div
            style={{
              flex: "none",
              width: 132,
              height: 132,
              borderRadius: 32,
              background:
                c.icon === "battery"
                  ? GREEN
                  : c.icon === "check"
                    ? "#34c759"
                    : "#8e8e93",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {c.icon === "gear" ? (
              <Gear size={72} />
            ) : (
              <LineIcon kind={c.icon} progress={s} size={72} color="#fff" />
            )}
          </div>
          <div
            style={{
              flex: 1,
              fontFamily: BODY,
              fontWeight: 600,
              fontSize: 64,
              color: "#fff",
            }}
          >
            {c.label}
          </div>
          <div style={{ fontFamily: BODY, fontSize: 60, color: SOFT }}>›</div>
        </div>
      </React.Fragment>
    );
  };
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <StepHead n={V04_STEP1.n} title={V04_STEP1.title} top={130} />
      <div
        style={{
          marginTop: 60,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {V04_STEP1.chain.map((_, i) => card(i))}
      </div>
      <div
        style={{
          marginTop: 56,
          padding: "22px 50px",
          borderRadius: 999,
          background: YELLOW,
          fontFamily: HEAD,
          fontWeight: 700,
          fontSize: 56,
          letterSpacing: 1,
          textTransform: "uppercase",
          color: "#000",
          opacity: hint,
          transform: `scale(${interpolate(hint, [0, 1], [0.85, 1])})`,
        }}
      >
        {V04_STEP1.hint}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 3. Paso 2: capacidad máxima ----------
const Step2Scene: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = interpolate(f, [30, 100], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const ring = spring({
    frame: f - 20,
    fps,
    config: { damping: 20, stiffness: 90 },
  });
  const note = useReveal(120);
  const R = 290;
  const C = 2 * Math.PI * R;
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <StepHead n={V04_STEP2.n} title={V04_STEP2.title} top={130} />
      <div
        style={{
          marginTop: 90,
          position: "relative",
          width: 720,
          height: 720,
          opacity: ring,
          transform: `scale(${interpolate(ring, [0, 1], [0.85, 1])})`,
        }}
      >
        <svg
          width={720}
          height={720}
          viewBox="0 0 720 720"
          style={{ transform: "rotate(-90deg)" }}
        >
          <circle
            cx={360}
            cy={360}
            r={R}
            fill="none"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth={44}
          />
          <circle
            cx={360}
            cy={360}
            r={R}
            fill="none"
            stroke={GREEN}
            strokeWidth={44}
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={C * (1 - (V04_STEP2.value / 100) * p)}
            style={{ filter: `drop-shadow(0 0 22px ${GREEN}99)` }}
          />
        </svg>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontFamily: HEAD,
              fontWeight: 700,
              fontSize: 190,
              lineHeight: 1,
              color: "#fff",
            }}
          >
            {Math.round(V04_STEP2.value * p)}%
          </div>
        </div>
      </div>
      <div
        style={{
          marginTop: 36,
          fontFamily: BODY,
          fontWeight: 600,
          fontSize: 42,
          letterSpacing: 5,
          textTransform: "uppercase",
          color: SOFT,
          opacity: ring,
        }}
      >
        {V04_STEP2.label}
      </div>
      <div
        style={{
          marginTop: 56,
          padding: "26px 54px",
          borderRadius: 24,
          border: `2px solid ${GREEN}`,
          background: "rgba(61,220,132,0.12)",
          fontFamily: BODY,
          fontWeight: 700,
          fontSize: 44,
          color: "#fff",
          opacity: note,
          transform: `translateY(${(1 - note) * 30}px)`,
        }}
      >
        {V04_STEP2.note}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 4. Paso 3: batería original ----------
const Step3Scene: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const path = useReveal(40);
  const warn = useReveal(150);
  const row = (start: number, value: string, color: string, ok: boolean) => {
    const s = spring({
      frame: f - start,
      fps,
      config: { damping: 18, stiffness: 120 },
    });
    return (
      <div
        style={{
          width: 920,
          height: 270,
          boxSizing: "border-box",
          padding: "0 52px",
          borderRadius: 40,
          background: "#1c1c1e",
          border: `3px solid ${color}`,
          boxShadow: `0 0 40px ${color}33`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          opacity: s,
          transform: `translateY(${(1 - s) * 70}px)`,
        }}
      >
        <div
          style={{
            fontFamily: BODY,
            fontWeight: 600,
            fontSize: 62,
            color: "#fff",
          }}
        >
          {V04_STEP3.row}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontFamily: BODY,
            fontWeight: 700,
            fontSize: 50,
            color,
          }}
        >
          {value}
          {ok ? (
            <LineIcon kind="check" progress={s} size={58} color={color} />
          ) : (
            <svg
              width={52}
              height={52}
              viewBox="0 0 24 24"
              fill="none"
              stroke={color}
              strokeWidth={2.6}
              strokeLinecap="round"
            >
              <path d="M5 5 19 19M19 5 5 19" />
            </svg>
          )}
        </div>
      </div>
    );
  };
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <StepHead n={V04_STEP3.n} title={V04_STEP3.title} top={130} />
      <div
        style={{
          marginTop: 40,
          fontFamily: BODY,
          fontWeight: 600,
          fontSize: 40,
          color: SOFT,
          opacity: path,
        }}
      >
        {V04_STEP3.path}
      </div>
      <div
        style={{
          marginTop: 50,
          display: "flex",
          flexDirection: "column",
          gap: 40,
        }}
      >
        {row(60, V04_STEP3.good, GREEN, true)}
        {row(110, V04_STEP3.bad, RED, false)}
      </div>
      <div
        style={{
          marginTop: 56,
          width: 860,
          textAlign: "center",
          fontFamily: BODY,
          fontWeight: 600,
          fontSize: 50,
          lineHeight: 1.35,
          color: "#fff",
          opacity: warn,
          transform: `translateY(${(1 - warn) * 30}px)`,
        }}
      >
        {V04_STEP3.warn}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 5. Byker Store ----------
const BykerScene: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = useReveal(4);
  const fill = interpolate(f, [18, 70], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const bat = spring({
    frame: f - 14,
    fps,
    config: { damping: 16, stiffness: 100 },
  });
  const lab = useReveal(60);
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <div
        style={{
          marginTop: 200,
          fontFamily: HEAD,
          fontWeight: 700,
          fontSize: 130,
          letterSpacing: 2,
          textTransform: "uppercase",
          color: "#fff",
          opacity: t,
          transform: `translateY(${(1 - t) * 30}px)`,
        }}
      >
        {V04_BYKER.title}
      </div>
      <div
        style={{
          marginTop: 80,
          opacity: bat,
          transform: `scale(${interpolate(bat, [0, 1], [0.85, 1])})`,
        }}
      >
        <Battery p={fill} width={800} />
      </div>
      <div
        style={{
          marginTop: 30,
          fontFamily: HEAD,
          fontWeight: 700,
          fontSize: 320,
          lineHeight: 1,
          color: GREEN,
          opacity: bat,
        }}
      >
        {V04_BYKER.big}
      </div>
      <div
        style={{
          marginTop: 10,
          fontFamily: BODY,
          fontWeight: 600,
          fontSize: 44,
          letterSpacing: 5,
          textTransform: "uppercase",
          color: SOFT,
          opacity: lab,
        }}
      >
        {V04_BYKER.label}
      </div>
      <div
        style={{
          marginTop: 50,
          display: "flex",
          gap: 18,
          flexWrap: "wrap",
          justifyContent: "center",
          width: 940,
        }}
      >
        {V04_BYKER.chips.map((c, i) => {
          const o = interpolate(f, [80 + i * 12, 110 + i * 12], [0, 1], clamp);
          return (
            <div
              key={c}
              style={{
                padding: "16px 34px",
                borderRadius: 16,
                border: `2px solid ${LINE}`,
                background: CARD,
                fontFamily: BODY,
                fontWeight: 600,
                fontSize: 34,
                color: "#fff",
                opacity: o,
              }}
            >
              {c}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const ProgressBar: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        height: 10,
        width: `${(f / V04_TOTAL) * 100}%`,
        background: `linear-gradient(90deg,#fff,${YELLOW})`,
      }}
    />
  );
};

const seq = (
  key: keyof typeof V04_SCENES,
  node: React.ReactNode,
  opts: { fadeIn?: number; fadeOut?: number } = {},
) => (
  <Sequence
    key={key}
    from={V04_SCENES[key].from}
    durationInFrames={V04_SCENES[key].duration}
    premountFor={FPS}
  >
    <Scene duration={V04_SCENES[key].duration} {...opts}>
      {node}
    </Scene>
  </Sequence>
);

export const Video04: React.FC = () => (
  <AbsoluteFill>
    <DarkBackground />
    <Audio
      src={staticFile(V04_MUSIC_FILE)}
      volume={(f) =>
        V04_MUSIC_VOLUME *
        interpolate(f, [0, 8, V04_TOTAL - 45, V04_TOTAL], [0.3, 1, 1, 0], clamp)
      }
    />
    {V04_VOICE_READY
      ? voice.map((v) => (
          <Sequence key={v.id} from={v.frame} layout="none">
            <Audio
              src={staticFile(`${V04_VOICE_DIR}/${v.id}.wav`)}
              volume={1}
            />
          </Sequence>
        ))
      : null}
    {seq("hook", <HookScene />, { fadeIn: 1, fadeOut: 10 })}
    {seq("step1", <Step1Scene />, { fadeIn: 10, fadeOut: 10 })}
    {seq("step2", <Step2Scene />, { fadeIn: 10, fadeOut: 10 })}
    {seq("step3", <Step3Scene />, { fadeIn: 10, fadeOut: 10 })}
    {seq("byker", <BykerScene />, { fadeIn: 10, fadeOut: 10 })}
    {seq("cta", <CtaScene title={V04_CTA_TITLE} />, { fadeOut: 20 })}
    <ProgressBar />
  </AbsoluteFill>
);
