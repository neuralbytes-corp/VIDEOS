import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { FPS } from "./config";
import {
  V03_ALERT,
  V03_CTA_TITLE,
  V03_HOOK,
  V03_MUSIC_VOLUME,
  V03_RECEIPT,
  V03_SCENES,
  V03_STEPS,
  V03_TOTAL,
  V03_WHAT,
} from "./video03";
import { Scene } from "./BykerStore";
import {
  BODY,
  CARD,
  CtaScene,
  DarkBackground,
  GREEN,
  HEAD,
  LINE,
  Photo,
  SOFT,
  Title,
  useReveal,
} from "./Video02";
import { LineIcon } from "./Icons";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const RED = "#ff453a";

const Warning: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M12 2.8 22 20.5H2z"
      stroke="#fff"
      strokeWidth={1.8}
      strokeLinejoin="round"
    />
    <path d="M12 9.5v5" stroke="#fff" strokeWidth={2} strokeLinecap="round" />
    <circle cx="12" cy="17.4" r="1.1" fill="#fff" />
  </svg>
);

// ---------- 1. Gancho: alerta con impacto ----------
const HookScene: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const slam = (delay: number) =>
    spring({
      frame: f - delay,
      fps,
      config: { damping: 9, stiffness: 190, mass: 0.7 },
    });
  const s0 = slam(2);
  const s1 = slam(10);
  const s2 = slam(18);
  const shake = Math.sin(f * 2.6) * 16 * Math.max(0, 1 - f / 26);
  const flash = interpolate(f, [0, 3, 14], [0.9, 0.5, 0], clamp);
  const pulse = 0.1 + 0.08 * Math.sin(f / 5);
  const ph = spring({
    frame: f - 26,
    fps,
    config: { damping: 20, stiffness: 90 },
  });
  const stamp = spring({
    frame: f - 66,
    fps,
    config: { damping: 10, stiffness: 220, mass: 0.6 },
  });
  const stampFlash = interpolate(f, [66, 70, 84], [0, 0.55, 0], clamp);
  const cap = useReveal(92);
  const line = (txt: string, sp: number, color: string) => (
    <div
      style={{
        transform: `scale(${interpolate(sp, [0, 1], [2.4, 1])})`,
        opacity: Math.min(1, sp * 2),
        color,
      }}
    >
      {txt}
    </div>
  );
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <AbsoluteFill style={{ background: RED, opacity: pulse }} />
      <div
        style={{
          position: "absolute",
          top: 690,
          left: "50%",
          marginLeft: -310,
          opacity: ph,
          transform: `translateY(${(1 - ph) * 140}px)`,
        }}
      >
        <Photo model="15" width={620} />
      </div>
      <div
        style={{
          position: "absolute",
          top: 1010,
          left: "50%",
          transform: `translate(-50%,-50%) rotate(-11deg) scale(${interpolate(stamp, [0, 1], [3.2, 1])})`,
          opacity: Math.min(1, stamp * 2),
          padding: "10px 40px",
          border: `10px solid ${RED}`,
          borderRadius: 18,
          background: "rgba(0,0,0,0.6)",
          fontFamily: HEAD,
          fontWeight: 700,
          fontSize: 130,
          letterSpacing: 4,
          textTransform: "uppercase",
          color: RED,
          whiteSpace: "nowrap",
        }}
      >
        {V03_HOOK.stamp}
      </div>
      <div
        style={{
          transform: `translateX(${shake}px)`,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            marginTop: 130,
            display: "flex",
            alignItems: "center",
            gap: 20,
            padding: "14px 40px",
            borderRadius: 18,
            background: RED,
            transform: `scale(${interpolate(s0, [0, 1], [2, 1])})`,
            opacity: Math.min(1, s0 * 2),
          }}
        >
          <Warning size={74} />
          <div
            style={{
              fontFamily: HEAD,
              fontWeight: 700,
              fontSize: 84,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: "#fff",
            }}
          >
            {V03_HOOK.badge}
          </div>
        </div>
        <div
          style={{
            marginTop: 34,
            textAlign: "center",
            fontFamily: HEAD,
            fontWeight: 700,
            fontSize: 150,
            lineHeight: 1,
            letterSpacing: 1,
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}
        >
          {line(V03_HOOK.line1, s1, "#fff")}
          {line(V03_HOOK.line2, s2, "#ffd60a")}
        </div>
      </div>
      <AbsoluteFill style={{ background: "#fff", opacity: flash }} />
      <AbsoluteFill style={{ background: "#fff", opacity: stampFlash }} />
      <div
        style={{
          position: "absolute",
          bottom: 80,
          width: 880,
          textAlign: "center",
          fontFamily: BODY,
          fontWeight: 600,
          fontSize: 38,
          lineHeight: 1.3,
          color: "#fff",
          opacity: cap,
        }}
      >
        {V03_HOOK.caption}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 2. Qué es ----------
const WhatScene: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const txt = useReveal(26);
  const src = useReveal(150);
  const warn = useReveal(128);
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <Title top={150} size={116}>
        {V03_WHAT.title}
      </Title>
      <div
        style={{
          marginTop: 40,
          width: 880,
          textAlign: "center",
          fontFamily: BODY,
          fontWeight: 500,
          fontSize: 38,
          lineHeight: 1.4,
          color: "#d8d8dc",
          opacity: txt,
          transform: `translateY(${(1 - txt) * 24}px)`,
        }}
      >
        {V03_WHAT.text}
      </div>
      <div style={{ marginTop: 70, width: 940 }}>
        {V03_WHAT.rows.map((r, i) => {
          const start = 50 + i * 36;
          const s = spring({
            frame: f - start,
            fps,
            config: { damping: 18, stiffness: 120 },
          });
          const verdict = interpolate(
            f,
            [start + 22, start + 34],
            [0, 1],
            clamp,
          );
          const color = r.ok ? GREEN : RED;
          return (
            <div
              key={r.imei}
              style={{
                marginBottom: 30,
                height: 190,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 40px",
                borderRadius: 30,
                background: CARD,
                border: `2px solid ${verdict > 0.5 ? color : LINE}`,
                boxShadow: verdict > 0.5 ? `0 0 40px ${color}33` : "none",
                opacity: s,
                transform: `translateY(${(1 - s) * 60}px)`,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  width: 120,
                  left: interpolate(
                    f,
                    [start, start + 24],
                    [-160, 1000],
                    clamp,
                  ),
                  background:
                    "linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent)",
                }}
              />
              <div
                style={{
                  fontFamily: HEAD,
                  fontWeight: 500,
                  fontSize: 62,
                  letterSpacing: 2,
                  color: "#fff",
                }}
              >
                {r.imei}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  opacity: verdict,
                  fontFamily: BODY,
                  fontWeight: 700,
                  fontSize: 26,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  color,
                }}
              >
                {r.ok ? (
                  <LineIcon
                    kind="check"
                    progress={verdict}
                    size={44}
                    color={color}
                  />
                ) : (
                  <svg
                    width={44}
                    height={44}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={color}
                    strokeWidth={2.4}
                    strokeLinecap="round"
                  >
                    <path d="M5 5 19 19M19 5 5 19" />
                  </svg>
                )}
                {r.label}
              </div>
            </div>
          );
        })}
      </div>
      <div
        style={{
          marginTop: 24,
          width: 900,
          padding: "26px 36px",
          boxSizing: "border-box",
          borderRadius: 24,
          background: "rgba(255,69,58,0.14)",
          border: `2px solid ${RED}`,
          textAlign: "center",
          fontFamily: BODY,
          fontWeight: 700,
          fontSize: 36,
          lineHeight: 1.3,
          color: "#fff",
          opacity: warn,
          transform: `translateY(${(1 - warn) * 30}px)`,
        }}
      >
        {V03_WHAT.warn}
      </div>
      <div
        style={{
          marginTop: 30,
          fontFamily: BODY,
          fontWeight: 500,
          fontSize: 26,
          letterSpacing: 3,
          textTransform: "uppercase",
          color: SOFT,
          opacity: src,
        }}
      >
        {V03_WHAT.source}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 3. Pasos ----------
const StepsScene: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const per = 105;
  const card = (i: number, children: React.ReactNode, title: string) => {
    const start = 30 + i * per;
    const s = spring({
      frame: f - start,
      fps,
      config: { damping: 18, stiffness: 110 },
    });
    return (
      <div
        style={{
          width: 940,
          padding: "48px 52px",
          boxSizing: "border-box",
          borderRadius: 36,
          background: CARD,
          border: `2px solid ${LINE}`,
          display: "flex",
          alignItems: "center",
          gap: 36,
          opacity: s,
          transform: `translateY(${(1 - s) * 80}px)`,
        }}
      >
        <div
          style={{
            flex: "none",
            width: 140,
            height: 140,
            borderRadius: 70,
            background: "#fff",
            color: "#000",
            fontFamily: HEAD,
            fontWeight: 700,
            fontSize: 88,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {i + 1}
        </div>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontFamily: HEAD,
              fontWeight: 600,
              fontSize: 62,
              letterSpacing: 1,
              textTransform: "uppercase",
              color: "#fff",
              lineHeight: 1,
            }}
          >
            {title}
          </div>
          <div style={{ marginTop: 14 }}>{children}</div>
        </div>
      </div>
    );
  };
  // paso 1: se "escribe" *#06#
  const code = V03_STEPS.one.code;
  const typed = Math.floor(
    interpolate(f, [48, 48 + code.length * 6], [0, code.length], clamp),
  );
  const cursor = Math.floor(f / 10) % 2 === 0;
  // paso 2: aparece el IMEI
  const imeiO = useReveal(30 + per + 24);
  // paso 3: barra de URL
  const urlO = useReveal(30 + 2 * per + 20);
  const tip = useReveal(30 + 2 * per + 70);
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <Title top={140} size={110}>
        {V03_STEPS.title}
      </Title>
      <div
        style={{
          marginTop: 56,
          display: "flex",
          flexDirection: "column",
          gap: 34,
        }}
      >
        {card(
          0,
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "6px 30px",
              borderRadius: 20,
              background: "#000",
              border: `2px solid ${LINE}`,
              fontFamily: HEAD,
              fontWeight: 600,
              fontSize: 120,
              letterSpacing: 6,
              color: "#fff",
              minWidth: 380,
              height: 150,
            }}
          >
            {code.slice(0, typed)}
            <span style={{ opacity: cursor ? 1 : 0, color: GREEN }}>|</span>
          </div>,
          V03_STEPS.one.title,
        )}
        {card(
          1,
          <div
            style={{
              fontFamily: HEAD,
              fontWeight: 500,
              fontSize: 56,
              letterSpacing: 1,
              color: GREEN,
              opacity: imeiO,
            }}
          >
            {V03_STEPS.two.example}
          </div>,
          V03_STEPS.two.title,
        )}
        {card(
          2,
          <div
            style={{
              padding: "14px 22px",
              borderRadius: 16,
              background: "#000",
              border: `2px solid ${GREEN}`,
              fontFamily: BODY,
              fontWeight: 600,
              fontSize: 32,
              color: "#fff",
              opacity: urlO,
              wordBreak: "break-all",
            }}
          >
            {V03_STEPS.three.url}
          </div>,
          V03_STEPS.three.title,
        )}
      </div>
      <div
        style={{
          marginTop: 56,
          padding: "22px 56px",
          borderRadius: 999,
          background: "#ffd60a",
          fontFamily: HEAD,
          fontWeight: 700,
          fontSize: 60,
          letterSpacing: 2,
          textTransform: "uppercase",
          color: "#000",
          opacity: tip,
          transform: `scale(${interpolate(tip, [0, 1], [0.8, 1])})`,
        }}
      >
        {V03_STEPS.tip}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 4. Alerta páginas falsas ----------
const AlertScene: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const bad = spring({
    frame: f - 26,
    fps,
    config: { damping: 16, stiffness: 120 },
  });
  const good = spring({
    frame: f - 62,
    fps,
    config: { damping: 16, stiffness: 120 },
  });
  const txt = useReveal(100);
  const url = (
    u: string,
    label: string,
    color: string,
    sp: number,
    ok: boolean,
  ) => (
    <div
      style={{
        width: 940,
        padding: "44px 48px",
        boxSizing: "border-box",
        borderRadius: 32,
        background: CARD,
        border: `3px solid ${color}`,
        boxShadow: `0 0 50px ${color}33`,
        opacity: sp,
        transform: `translateY(${(1 - sp) * 80}px) scale(${interpolate(sp, [0, 1], [0.94, 1])})`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          fontFamily: BODY,
          fontWeight: 700,
          fontSize: 34,
          letterSpacing: 3,
          textTransform: "uppercase",
          color,
        }}
      >
        {ok ? (
          <LineIcon kind="check" progress={1} size={40} color={color} />
        ) : (
          <svg
            width={40}
            height={40}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth={2.6}
            strokeLinecap="round"
          >
            <path d="M5 5 19 19M19 5 5 19" />
          </svg>
        )}
        {label}
      </div>
      <div
        style={{
          marginTop: 18,
          padding: "20px 26px",
          borderRadius: 18,
          background: "#000",
          fontFamily: BODY,
          fontWeight: 600,
          fontSize: 38,
          color: "#fff",
          wordBreak: "break-all",
          textDecoration: ok ? "none" : "line-through",
          textDecorationColor: RED,
        }}
      >
        {u}
      </div>
    </div>
  );
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <div style={{ marginTop: 150 }}>
        <Warning size={170} />
      </div>
      <Title top={20} size={124} lh={1.28}>
        {V03_ALERT.title}
      </Title>
      <div
        style={{
          marginTop: 70,
          display: "flex",
          flexDirection: "column",
          gap: 36,
        }}
      >
        {url(V03_ALERT.bad.url, V03_ALERT.bad.label, RED, bad, false)}
        {url(V03_ALERT.good.url, V03_ALERT.good.label, GREEN, good, true)}
      </div>
      <div
        style={{
          marginTop: 70,
          width: 860,
          textAlign: "center",
          fontFamily: BODY,
          fontWeight: 600,
          fontSize: 46,
          lineHeight: 1.35,
          color: "#fff",
          opacity: txt,
        }}
      >
        {V03_ALERT.text}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 5. Pide tu boleta ----------
const ReceiptScene: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const r = spring({
    frame: f - 14,
    fps,
    config: { damping: 15, stiffness: 100 },
  });
  const stamp = spring({
    frame: f - 60,
    fps,
    config: { damping: 11, stiffness: 200, mass: 0.6 },
  });
  const txt = useReveal(70);
  const zig = Array.from(
    { length: 15 },
    (_, i) => `${(1 - i / 14) * 100}% ${i % 2 ? 100 : 96}%`,
  ).join(",");
  const bar = (w: number, strong = false) => (
    <div
      style={{
        height: strong ? 16 : 11,
        width: `${w}%`,
        borderRadius: 6,
        background: strong ? "#222" : "#cfcfd4",
        marginTop: 20,
      }}
    />
  );
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <Title top={150} size={120}>
        {V03_RECEIPT.title}
      </Title>
      <div
        style={{
          marginTop: 60,
          position: "relative",
          opacity: r,
          transform: `translateY(${(1 - r) * 120}px) rotate(${interpolate(r, [0, 1], [8, -3])}deg)`,
        }}
      >
        <div
          style={{
            width: 520,
            height: 660,
            background: "#fff",
            padding: "48px 44px",
            boxSizing: "border-box",
            clipPath: `polygon(0 0,100% 0,${zig})`,
            fontFamily: BODY,
          }}
        >
          <div
            style={{
              fontFamily: HEAD,
              fontWeight: 700,
              fontSize: 46,
              letterSpacing: 6,
              textAlign: "center",
              color: "#111",
            }}
          >
            BOLETA
          </div>
          {bar(55, true)}
          {bar(90)}
          {bar(70)}
          {bar(82)}
          <div
            style={{ height: 3, background: "#e3e3e7", margin: "34px 0 8px" }}
          />
          {bar(46, true)}
        </div>
        <div
          style={{
            position: "absolute",
            right: -50,
            bottom: 50,
            width: 170,
            height: 170,
            borderRadius: 85,
            background: GREEN,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: Math.min(1, stamp * 2),
            transform: `scale(${interpolate(stamp, [0, 1], [2.6, 1])})`,
            boxShadow: `0 20px 50px ${GREEN}66`,
          }}
        >
          <LineIcon kind="check" progress={stamp} size={110} color="#fff" />
        </div>
      </div>
      <div
        style={{
          marginTop: 56,
          width: 860,
          textAlign: "center",
          fontFamily: BODY,
          fontWeight: 600,
          fontSize: 44,
          lineHeight: 1.35,
          color: "#fff",
          opacity: txt,
          transform: `translateY(${(1 - txt) * 24}px)`,
        }}
      >
        {V03_RECEIPT.text}
      </div>
      <div
        style={{
          marginTop: 34,
          display: "flex",
          flexWrap: "wrap",
          gap: 14,
          justifyContent: "center",
          width: 940,
        }}
      >
        {V03_RECEIPT.chips.map((c, i) => {
          const o = interpolate(f, [100 + i * 10, 130 + i * 10], [0, 1], clamp);
          return (
            <div
              key={c}
              style={{
                padding: "14px 28px",
                borderRadius: 14,
                border: `2px solid ${LINE}`,
                fontFamily: BODY,
                fontWeight: 600,
                fontSize: 30,
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
        width: `${(f / V03_TOTAL) * 100}%`,
        background: "linear-gradient(90deg,#fff,#ffd60a)",
      }}
    />
  );
};

const seq = (
  key: keyof typeof V03_SCENES,
  node: React.ReactNode,
  opts: { fadeIn?: number; fadeOut?: number } = {},
) => (
  <Sequence
    key={key}
    from={V03_SCENES[key].from}
    durationInFrames={V03_SCENES[key].duration}
    premountFor={FPS}
  >
    <Scene duration={V03_SCENES[key].duration} {...opts}>
      {node}
    </Scene>
  </Sequence>
);

export const Video03: React.FC = () => (
  <AbsoluteFill>
    <DarkBackground />
    <Audio
      src={staticFile("byker/music-v03.wav")}
      volume={(f) =>
        V03_MUSIC_VOLUME *
        interpolate(f, [0, 6, V03_TOTAL - 45, V03_TOTAL], [0.2, 1, 1, 0], clamp)
      }
    />
    {seq("hook", <HookScene />, { fadeIn: 1, fadeOut: 10 })}
    {seq("what", <WhatScene />, { fadeIn: 10, fadeOut: 10 })}
    {seq("steps", <StepsScene />, { fadeIn: 10, fadeOut: 10 })}
    {seq("alert", <AlertScene />, { fadeIn: 10, fadeOut: 10 })}
    {seq("receipt", <ReceiptScene />, { fadeIn: 10, fadeOut: 10 })}
    {seq("cta", <CtaScene title={V03_CTA_TITLE} />, { fadeOut: 20 })}
    <ProgressBar />
  </AbsoluteFill>
);
