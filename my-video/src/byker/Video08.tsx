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
  V08_BAT,
  V08_CAM,
  V08_CTA_TITLE,
  V08_FACE,
  V08_HOOK,
  V08_ICLOUD,
  V08_IMEI,
  V08_ITEMS,
  V08_MUSIC_FILE,
  V08_MUSIC_VOLUME,
  V08_RECAP_TITLE,
  V08_SCENES,
  V08_TOTAL,
} from "./video08";
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
  Title,
  useReveal,
} from "./Video02";
import { LineIcon } from "./Icons";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const YELLOW = "#ffd60a";
const RED = "#ff453a";

const X: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={2.6}
    strokeLinecap="round"
  >
    <path d="M5 5 19 19M19 5 5 19" />
  </svg>
);

// ---------- Gancho ----------
const HookScene: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const slam = (d: number) =>
    spring({
      frame: f - d,
      fps,
      config: { damping: 9, stiffness: 190, mass: 0.7 },
    });
  const s0 = slam(2);
  const l1 = slam(14);
  const l2 = slam(22);
  const l3 = slam(30);
  const line = (txt: string, sp: number, color: string) => (
    <div
      style={{
        transform: `scale(${interpolate(sp, [0, 1], [2.2, 1])})`,
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
          marginTop: 220,
          fontFamily: HEAD,
          fontWeight: 700,
          fontSize: 560,
          lineHeight: 0.9,
          color: YELLOW,
          transform: `scale(${interpolate(s0, [0, 1], [2.6, 1])})`,
          opacity: Math.min(1, s0 * 2),
        }}
      >
        {V08_HOOK.big}
      </div>
      <div
        style={{
          marginTop: 10,
          textAlign: "center",
          fontFamily: HEAD,
          fontWeight: 700,
          fontSize: 104,
          lineHeight: 1.1,
          textTransform: "uppercase",
          whiteSpace: "nowrap",
        }}
      >
        {line(V08_HOOK.line1, l1, "#fff")}
        {line(V08_HOOK.line2, l2, "#fff")}
        {line(V08_HOOK.line3, l3, YELLOW)}
      </div>
      <div style={{ marginTop: 60, display: "flex", gap: 26 }}>
        {V08_ITEMS.map((it, i) => {
          const s = spring({
            frame: f - (52 + i * 8),
            fps,
            config: { damping: 12, stiffness: 160 },
          });
          return (
            <div
              key={it.n}
              style={{
                width: 130,
                height: 130,
                borderRadius: 65,
                border: `4px solid ${GREEN}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transform: `scale(${s})`,
                opacity: s,
              }}
            >
              <LineIcon kind="check" progress={s} size={70} color={GREEN} />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------- Cabecera común de cada punto ----------
const Head: React.FC<{ idx: number }> = ({ idx }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const it = V08_ITEMS[idx];
  const s = spring({
    frame: f - 2,
    fps,
    config: { damping: 11, stiffness: 170, mass: 0.7 },
  });
  const t = useReveal(10);
  const h = useReveal(22);
  return (
    <>
      <div
        style={{
          display: "flex",
          gap: 14,
          justifyContent: "center",
          marginTop: 250,
        }}
      >
        {V08_ITEMS.map((_, i) => (
          <div
            key={i}
            style={{
              width: 150,
              height: 12,
              borderRadius: 6,
              background: i <= idx ? YELLOW : "rgba(255,255,255,0.18)",
            }}
          />
        ))}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 36,
          marginTop: 70,
          padding: "0 70px",
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
            transform: `scale(${interpolate(s, [0, 1], [2.2, 1])})`,
            opacity: Math.min(1, s * 2),
          }}
        >
          {it.n}
        </div>
        <div style={{ opacity: t, transform: `translateY(${(1 - t) * 24}px)` }}>
          <div
            style={{
              fontFamily: HEAD,
              fontWeight: 700,
              fontSize: 112,
              lineHeight: 1.02,
              textTransform: "uppercase",
              color: "#fff",
            }}
          >
            {it.title}
          </div>
        </div>
      </div>
      <div
        style={{
          margin: "34px auto 0",
          width: 900,
          textAlign: "center",
          fontFamily: BODY,
          fontWeight: 600,
          fontSize: 42,
          lineHeight: 1.3,
          color: "#d8d8dc",
          opacity: h,
        }}
      >
        {it.how}
      </div>
    </>
  );
};

const Row: React.FC<{ text: string; ok: boolean; start: number }> = ({
  text,
  ok,
  start,
}) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({
    frame: f - start,
    fps,
    config: { damping: 18, stiffness: 120 },
  });
  const color = ok ? GREEN : RED;
  return (
    <div
      style={{
        width: 920,
        height: 190,
        boxSizing: "border-box",
        padding: "0 48px",
        borderRadius: 36,
        background: "#1c1c1e",
        border: `3px solid ${color}`,
        boxShadow: `0 0 40px ${color}33`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 20,
        opacity: s,
        transform: `translateY(${(1 - s) * 70}px)`,
      }}
    >
      <div
        style={{
          fontFamily: BODY,
          fontWeight: 600,
          fontSize: 44,
          color: "#fff",
          lineHeight: 1.2,
        }}
      >
        {text}
      </div>
      <div style={{ flex: "none" }}>
        {ok ? (
          <LineIcon kind="check" progress={s} size={64} color={color} />
        ) : (
          <X size={58} color={color} />
        )}
      </div>
    </div>
  );
};

// ---------- 1 · iCloud ----------
const ICloud: React.FC = () => {
  const note = useReveal(120);
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <Head idx={0} />
      <div
        style={{
          marginTop: 70,
          display: "flex",
          flexDirection: "column",
          gap: 40,
        }}
      >
        <Row text={V08_ICLOUD.good} ok start={50} />
        <Row text={V08_ICLOUD.bad} ok={false} start={85} />
      </div>
      <div
        style={{
          marginTop: 56,
          padding: "22px 50px",
          borderRadius: 999,
          background: YELLOW,
          fontFamily: HEAD,
          fontWeight: 700,
          fontSize: 54,
          textTransform: "uppercase",
          color: "#000",
          opacity: note,
          transform: `scale(${interpolate(note, [0, 1], [0.85, 1])})`,
        }}
      >
        {V08_ICLOUD.note}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 2 · IMEI ----------
const Imei: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const code = V08_IMEI.code;
  const typed = Math.floor(
    interpolate(f, [40, 40 + code.length * 6], [0, code.length], clamp),
  );
  const cursor = Math.floor(f / 10) % 2 === 0;
  const extra = useReveal(150);
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <Head idx={1} />
      <div
        style={{
          marginTop: 56,
          padding: "10px 60px",
          borderRadius: 28,
          background: "#000",
          border: `2px solid ${LINE}`,
          fontFamily: HEAD,
          fontWeight: 600,
          fontSize: 150,
          letterSpacing: 8,
          color: "#fff",
        }}
      >
        {code.slice(0, typed)}
        <span style={{ opacity: cursor ? 1 : 0, color: GREEN }}>|</span>
      </div>
      <div
        style={{
          marginTop: 56,
          display: "flex",
          flexDirection: "column",
          gap: 28,
        }}
      >
        {V08_IMEI.chips.map((c, i) => {
          const s = spring({
            frame: f - (80 + i * 22),
            fps,
            config: { damping: 18, stiffness: 120 },
          });
          return (
            <div
              key={c}
              style={{
                width: 860,
                padding: "26px 40px",
                boxSizing: "border-box",
                borderRadius: 28,
                background: CARD,
                border: `2px solid ${LINE}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontFamily: BODY,
                fontWeight: 600,
                fontSize: 42,
                color: "#fff",
                opacity: s,
                transform: `translateX(${(1 - s) * 90}px)`,
              }}
            >
              {c}
              <LineIcon kind="check" progress={s} size={56} color={GREEN} />
            </div>
          );
        })}
      </div>
      <div
        style={{
          marginTop: 44,
          fontFamily: BODY,
          fontWeight: 700,
          fontSize: 44,
          color: YELLOW,
          opacity: extra,
        }}
      >
        {V08_IMEI.extra}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 3 · Face ID ----------
const Face: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const frame = spring({
    frame: f - 20,
    fps,
    config: { damping: 14, stiffness: 100 },
  });
  const scan = interpolate(f, [50, 110], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const done = interpolate(f, [112, 128], [0, 1], clamp);
  const path = useReveal(30);
  const sz = 460;
  const c = YELLOW;
  const corner = (rot: number, pos: React.CSSProperties) => (
    <div
      style={{
        position: "absolute",
        width: 110,
        height: 110,
        borderTop: `14px solid ${done > 0.5 ? GREEN : c}`,
        borderLeft: `14px solid ${done > 0.5 ? GREEN : c}`,
        borderTopLeftRadius: 60,
        transform: `rotate(${rot}deg)`,
        ...pos,
      }}
    />
  );
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <Head idx={2} />
      <div
        style={{
          marginTop: 30,
          fontFamily: BODY,
          fontWeight: 600,
          fontSize: 38,
          color: SOFT,
          opacity: path,
        }}
      >
        {V08_FACE.path}
      </div>
      <div
        style={{
          marginTop: 50,
          position: "relative",
          width: sz,
          height: sz,
          transform: `scale(${interpolate(frame, [0, 1], [0.8, 1])})`,
          opacity: frame,
        }}
      >
        {corner(0, { left: 0, top: 0 })}
        {corner(90, { right: 0, top: 0 })}
        {corner(180, { right: 0, bottom: 0 })}
        {corner(270, { left: 0, bottom: 0 })}
        <svg
          width={sz}
          height={sz}
          viewBox="0 0 100 100"
          fill="none"
          stroke={done > 0.5 ? GREEN : "#fff"}
          strokeWidth={3.2}
          strokeLinecap="round"
        >
          <path d="M36 36v8M64 36v8" />
          <path d="M50 38v14c0 3-2 4-5 4" />
          <path d="M36 66c8 8 20 8 28 0" />
        </svg>
        <div
          style={{
            position: "absolute",
            left: 30,
            right: 30,
            top: 30 + scan * (sz - 60),
            height: 6,
            borderRadius: 3,
            background: c,
            boxShadow: `0 0 24px ${c}`,
            opacity: done > 0.5 ? 0 : 1,
          }}
        />
      </div>
      <div
        style={{
          marginTop: 40,
          display: "flex",
          alignItems: "center",
          gap: 16,
          fontFamily: HEAD,
          fontWeight: 700,
          fontSize: 80,
          textTransform: "uppercase",
          color: GREEN,
          opacity: done,
        }}
      >
        <LineIcon kind="check" progress={done} size={80} color={GREEN} />
        {V08_FACE.ok}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 4 · Cámaras ----------
const Cams: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const active = Math.min(2, Math.floor(Math.max(0, f - 40) / 36));
  const view = spring({
    frame: f - 14,
    fps,
    config: { damping: 16, stiffness: 100 },
  });
  const zoom = 1 + active * 0.25;
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <Head idx={3} />
      <div
        style={{
          marginTop: 60,
          width: 880,
          height: 540,
          borderRadius: 40,
          overflow: "hidden",
          position: "relative",
          border: `3px solid ${LINE}`,
          opacity: view,
          transform: `scale(${interpolate(view, [0, 1], [0.9, 1])})`,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            transform: `scale(${zoom})`,
            background:
              "linear-gradient(180deg,#59a8e8 0%,#f7c27a 60%,#e07a4a 100%)",
          }}
        >
          {[
            [0, 300, 120],
            [140, 240, 100],
            [260, 320, 130],
            [410, 220, 90],
            [520, 290, 120],
            [660, 250, 110],
          ].map(([x, y, w], i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: x,
                top: y,
                width: w,
                height: 600,
                background: "rgba(40,50,80,0.75)",
              }}
            />
          ))}
        </div>
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "42%",
            width: 140,
            height: 140,
            marginLeft: -70,
            marginTop: -70,
            border: `4px solid ${YELLOW}`,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 26,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            gap: 18,
          }}
        >
          {V08_CAM.lenses.map((l, i) => (
            <div
              key={l}
              style={{
                padding: "10px 26px",
                borderRadius: 999,
                background: i === active ? YELLOW : "rgba(0,0,0,0.55)",
                color: i === active ? "#000" : "#fff",
                fontFamily: BODY,
                fontWeight: 700,
                fontSize: 34,
              }}
            >
              {l}
            </div>
          ))}
        </div>
      </div>
      <div
        style={{
          marginTop: 50,
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        {V08_CAM.notes.map((n, i) => {
          const s = spring({
            frame: f - (90 + i * 24),
            fps,
            config: { damping: 18, stiffness: 120 },
          });
          return (
            <div
              key={n}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 22,
                fontFamily: BODY,
                fontWeight: 600,
                fontSize: 44,
                color: "#fff",
                opacity: s,
                transform: `translateX(${(1 - s) * 70}px)`,
              }}
            >
              <LineIcon kind="check" progress={s} size={58} color={GREEN} />
              {n}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 5 · Batería y pantalla ----------
const BatScreen: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = interpolate(f, [34, 100], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const a = spring({
    frame: f - 14,
    fps,
    config: { damping: 16, stiffness: 100 },
  });
  const path = useReveal(30);
  const sw = ["#ffffff", "#000000", "#ff3b30", "#34c759"][
    Math.floor(f / 28) % 4
  ];
  const R = 150;
  const C = 2 * Math.PI * R;
  const card: React.CSSProperties = {
    width: 440,
    height: 640,
    boxSizing: "border-box",
    borderRadius: 40,
    background: CARD,
    border: `2px solid ${LINE}`,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
    opacity: a,
    transform: `translateY(${(1 - a) * 70}px)`,
  };
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <Head idx={4} />
      <div
        style={{
          marginTop: 26,
          fontFamily: BODY,
          fontWeight: 600,
          fontSize: 34,
          color: SOFT,
          opacity: path,
        }}
      >
        {V08_BAT.path}
      </div>
      <div style={{ marginTop: 40, display: "flex", gap: 40 }}>
        <div style={card}>
          <div style={{ position: "relative", width: 340, height: 340 }}>
            <svg
              width={340}
              height={340}
              viewBox="0 0 340 340"
              style={{ transform: "rotate(-90deg)" }}
            >
              <circle
                cx={170}
                cy={170}
                r={R}
                fill="none"
                stroke="rgba(255,255,255,0.12)"
                strokeWidth={26}
              />
              <circle
                cx={170}
                cy={170}
                r={R}
                fill="none"
                stroke={GREEN}
                strokeWidth={26}
                strokeLinecap="round"
                strokeDasharray={C}
                strokeDashoffset={C * (1 - p)}
              />
            </svg>
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: HEAD,
                fontWeight: 700,
                fontSize: 100,
                color: "#fff",
              }}
            >
              {Math.round(p * 100)}%
            </div>
          </div>
          <div
            style={{
              fontFamily: BODY,
              fontWeight: 600,
              fontSize: 30,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: SOFT,
              textAlign: "center",
            }}
          >
            {V08_BAT.cap}
          </div>
        </div>
        <div style={card}>
          <div
            style={{
              width: 300,
              height: 400,
              borderRadius: 44,
              border: "10px solid #2a2a2e",
              background: sw,
              boxShadow: "0 0 40px rgba(255,255,255,0.12)",
            }}
          />
          <div
            style={{
              fontFamily: BODY,
              fontWeight: 600,
              fontSize: 30,
              color: "#fff",
              textAlign: "center",
              lineHeight: 1.25,
            }}
          >
            {V08_BAT.screen}
            <br />
            {V08_BAT.screen2}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- Resumen ----------
const Recap: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <Title top={170} size={130}>
        {V08_RECAP_TITLE}
      </Title>
      <div
        style={{
          marginTop: 70,
          display: "flex",
          flexDirection: "column",
          gap: 28,
        }}
      >
        {V08_ITEMS.map((it, i) => {
          const s = spring({
            frame: f - (10 + i * 12),
            fps,
            config: { damping: 14, stiffness: 150 },
          });
          return (
            <div
              key={it.n}
              style={{
                width: 900,
                padding: "24px 44px",
                boxSizing: "border-box",
                borderRadius: 30,
                background: CARD,
                border: `2px solid ${LINE}`,
                display: "flex",
                alignItems: "center",
                gap: 28,
                opacity: s,
                transform: `translateX(${(1 - s) * 120}px)`,
              }}
            >
              <LineIcon kind="check" progress={s} size={64} color={GREEN} />
              <div
                style={{
                  fontFamily: HEAD,
                  fontWeight: 600,
                  fontSize: 70,
                  textTransform: "uppercase",
                  color: "#fff",
                }}
              >
                {it.title}
              </div>
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
        width: `${(f / V08_TOTAL) * 100}%`,
        background: `linear-gradient(90deg,#fff,${YELLOW})`,
      }}
    />
  );
};

const seq = (
  key: keyof typeof V08_SCENES,
  node: React.ReactNode,
  opts: { fadeIn?: number; fadeOut?: number } = {},
) => (
  <Sequence
    key={key}
    from={V08_SCENES[key].from}
    durationInFrames={V08_SCENES[key].duration}
    premountFor={FPS}
  >
    <Scene
      duration={V08_SCENES[key].duration}
      fadeIn={10}
      fadeOut={10}
      {...opts}
    >
      {node}
    </Scene>
  </Sequence>
);

export const Video08: React.FC = () => (
  <AbsoluteFill>
    <DarkBackground />
    <Audio
      src={staticFile(V08_MUSIC_FILE)}
      volume={(f) =>
        V08_MUSIC_VOLUME *
        interpolate(f, [0, 8, V08_TOTAL - 45, V08_TOTAL], [0.3, 1, 1, 0], clamp)
      }
    />
    {seq("hook", <HookScene />, { fadeIn: 1 })}
    {seq("i1", <ICloud />)}
    {seq("i2", <Imei />)}
    {seq("i3", <Face />)}
    {seq("i4", <Cams />)}
    {seq("i5", <BatScreen />)}
    {seq("recap", <Recap />)}
    {seq("cta", <CtaScene title={V08_CTA_TITLE} />, { fadeOut: 20 })}
    <ProgressBar />
  </AbsoluteFill>
);
