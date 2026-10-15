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
  V09_COMPARE,
  V09_CTA_TITLE,
  V09_HOOK,
  V09_MUSIC_FILE,
  V09_MUSIC_VOLUME,
  V09_RECS,
  V09_SCENES,
  V09_TIP,
  V09_TOTAL,
} from "./video09";
import { Scene } from "./BykerStore";
import {
  BODY,
  CARD,
  CtaScene,
  DarkBackground,
  GREEN,
  HEAD,
  LINE,
  useReveal,
} from "./Video02";
import { LineIcon } from "./Icons";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const YELLOW = "#ffd60a";

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
  const a = slam(2);
  const b = slam(12);
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <div
        style={{
          marginTop: 520,
          textAlign: "center",
          fontFamily: HEAD,
          fontWeight: 700,
          textTransform: "uppercase",
          lineHeight: 1.05,
          whiteSpace: "nowrap",
        }}
      >
        <div
          style={{
            fontSize: 100,
            color: "#fff",
            transform: `scale(${interpolate(a, [0, 1], [2.4, 1])})`,
            opacity: Math.min(1, a * 2),
          }}
        >
          {V09_HOOK.l1}
        </div>
        <div
          style={{
            fontSize: 84,
            color: YELLOW,
            transform: `scale(${interpolate(b, [0, 1], [2.4, 1])})`,
            opacity: Math.min(1, b * 2),
          }}
        >
          {V09_HOOK.l2}
        </div>
      </div>
      <div style={{ marginTop: 90, display: "flex", gap: 30 }}>
        {V09_HOOK.models.map((m, i) => {
          const s = spring({
            frame: f - (30 + i * 8),
            fps,
            config: { damping: 12, stiffness: 160 },
          });
          return (
            <div
              key={m}
              style={{
                width: 280,
                height: 280,
                borderRadius: 40,
                background: CARD,
                border: `3px solid ${i === 1 ? YELLOW : LINE}`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                transform: `scale(${s})`,
                opacity: s,
              }}
            >
              <div
                style={{
                  fontFamily: BODY,
                  fontWeight: 600,
                  fontSize: 34,
                  color: "#d8d8dc",
                }}
              >
                iPhone
              </div>
              <div
                style={{
                  fontFamily: HEAD,
                  fontWeight: 700,
                  fontSize: 170,
                  lineHeight: 1,
                  color: "#fff",
                }}
              >
                {m}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------- Comparativa ----------
const Compare: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = useReveal(2);
  const colW = 290;
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <div
        style={{
          marginTop: 400,
          fontFamily: HEAD,
          fontWeight: 700,
          fontSize: 120,
          textTransform: "uppercase",
          color: "#fff",
          opacity: t,
        }}
      >
        {V09_COMPARE.title}
      </div>
      <div style={{ marginTop: 40, display: "flex", gap: 20 }}>
        {V09_COMPARE.cols.map((c) => (
          <div
            key={c}
            style={{
              width: colW,
              textAlign: "center",
              fontFamily: HEAD,
              fontWeight: 700,
              fontSize: 90,
              color: YELLOW,
              opacity: t,
            }}
          >
            {c}
          </div>
        ))}
      </div>
      {V09_COMPARE.rows.map((r, i) => {
        const s = spring({
          frame: f - (24 + i * 28),
          fps,
          config: { damping: 14, stiffness: 150 },
        });
        return (
          <div
            key={r.label}
            style={{
              marginTop: 26,
              width: 940,
              opacity: s,
              transform: `translateY(${(1 - s) * 50}px)`,
            }}
          >
            <div
              style={{
                fontFamily: BODY,
                fontWeight: 700,
                fontSize: 30,
                letterSpacing: 4,
                textTransform: "uppercase",
                color: "#a9a9b0",
                textAlign: "center",
                marginBottom: 10,
              }}
            >
              {r.label}
            </div>
            <div style={{ display: "flex", gap: 20 }}>
              {r.v.map((v, k) => (
                <div
                  key={k}
                  style={{
                    width: colW,
                    height: 120,
                    boxSizing: "border-box",
                    borderRadius: 26,
                    background: "#1c1c1e",
                    border: `2px solid ${k === 2 ? GREEN : LINE}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    padding: "0 10px",
                    fontFamily: BODY,
                    fontWeight: 700,
                    fontSize: v.length > 9 ? 33 : 44,
                    color: "#fff",
                  }}
                >
                  {v}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ---------- Recomendación por presupuesto ----------
const Rec: React.FC<{ idx: number }> = ({ idx }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const r = V09_RECS[idx];
  const s = spring({
    frame: f - 2,
    fps,
    config: { damping: 11, stiffness: 170, mass: 0.7 },
  });
  const t = useReveal(10);
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <div style={{ display: "flex", gap: 14, marginTop: 400 }}>
        {V09_RECS.map((_, i) => (
          <div
            key={i}
            style={{
              width: 200,
              height: 12,
              borderRadius: 6,
              background: i <= idx ? YELLOW : "rgba(255,255,255,0.18)",
            }}
          />
        ))}
      </div>
      <div
        style={{
          marginTop: 80,
          padding: "16px 44px",
          borderRadius: 999,
          background: YELLOW,
          color: "#000",
          fontFamily: HEAD,
          fontWeight: 700,
          fontSize: 56,
          textTransform: "uppercase",
          opacity: t,
        }}
      >
        {r.tag}
      </div>
      <div
        style={{
          marginTop: 40,
          fontFamily: HEAD,
          fontWeight: 700,
          fontSize: 190,
          lineHeight: 1,
          textTransform: "uppercase",
          color: "#fff",
          transform: `scale(${interpolate(s, [0, 1], [2, 1])})`,
          opacity: Math.min(1, s * 2),
        }}
      >
        {r.model}
      </div>
      <div
        style={{
          marginTop: 60,
          display: "flex",
          flexDirection: "column",
          gap: 26,
        }}
      >
        {r.points.map((p, i) => {
          const q = spring({
            frame: f - (40 + i * 26),
            fps,
            config: { damping: 14, stiffness: 150 },
          });
          return (
            <div
              key={p}
              style={{
                width: 920,
                height: 130,
                boxSizing: "border-box",
                padding: "0 40px",
                borderRadius: 30,
                background: "#1c1c1e",
                border: `2px solid ${GREEN}`,
                display: "flex",
                alignItems: "center",
                gap: 26,
                opacity: q,
                transform: `translateY(${(1 - q) * 50}px)`,
              }}
            >
              <LineIcon kind="check" progress={q} size={56} color={GREEN} />
              <div
                style={{
                  fontFamily: BODY,
                  fontWeight: 600,
                  fontSize: 40,
                  color: "#fff",
                  lineHeight: 1.2,
                }}
              >
                {p}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------- Cierre de confianza ----------
const Tip: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = useReveal(2);
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <div
        style={{
          marginTop: 520,
          fontFamily: HEAD,
          fontWeight: 700,
          fontSize: 100,
          textTransform: "uppercase",
          color: "#fff",
          textAlign: "center",
          opacity: t,
        }}
      >
        {V09_TIP.title}
      </div>
      <div
        style={{
          marginTop: 60,
          display: "flex",
          flexDirection: "column",
          gap: 26,
        }}
      >
        {V09_TIP.items.map((p, i) => {
          const q = spring({
            frame: f - (16 + i * 18),
            fps,
            config: { damping: 14, stiffness: 150 },
          });
          return (
            <div
              key={p}
              style={{
                width: 860,
                height: 130,
                boxSizing: "border-box",
                padding: "0 40px",
                borderRadius: 30,
                background: CARD,
                border: `2px solid ${LINE}`,
                display: "flex",
                alignItems: "center",
                gap: 26,
                opacity: q,
                transform: `translateY(${(1 - q) * 50}px)`,
              }}
            >
              <LineIcon kind="check" progress={q} size={56} color={GREEN} />
              <div
                style={{
                  fontFamily: HEAD,
                  fontWeight: 700,
                  fontSize: 58,
                  textTransform: "uppercase",
                  color: "#fff",
                }}
              >
                {p}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const seq = (
  key: keyof typeof V09_SCENES,
  node: React.ReactNode,
  opts: { fadeIn?: number; fadeOut?: number } = {},
) => (
  <Sequence
    key={key}
    from={V09_SCENES[key].from}
    durationInFrames={V09_SCENES[key].duration}
    premountFor={FPS}
  >
    <Scene
      duration={V09_SCENES[key].duration}
      fadeIn={10}
      fadeOut={10}
      {...opts}
    >
      {node}
    </Scene>
  </Sequence>
);

export const Video09: React.FC = () => (
  <AbsoluteFill>
    <DarkBackground />
    <Audio
      src={staticFile(V09_MUSIC_FILE)}
      volume={(f) =>
        V09_MUSIC_VOLUME *
        interpolate(f, [0, 8, V09_TOTAL - 45, V09_TOTAL], [0.3, 1, 1, 0], clamp)
      }
    />
    {seq("hook", <HookScene />, { fadeIn: 1 })}
    {seq("compare", <Compare />)}
    {seq("r1", <Rec idx={0} />)}
    {seq("r2", <Rec idx={1} />)}
    {seq("r3", <Rec idx={2} />)}
    {seq("tip", <Tip />)}
    {seq("cta", <CtaScene title={V09_CTA_TITLE} />, { fadeOut: 20 })}
  </AbsoluteFill>
);
