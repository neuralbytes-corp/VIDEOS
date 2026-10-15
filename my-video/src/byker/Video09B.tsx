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
import { FPS } from "./config";
import { MONO, RED, SANS, SLIDES, box } from "./Carousel09";
import { V09_MUSIC_FILE, V09_MUSIC_VOLUME } from "./video09";
import { Scene } from "./BykerStore";

// Video 9 (versión cartel): mismo diseño que el carrusel, con el iPhone siempre de fondo.
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const SCENES = {
  cover: { from: 0, duration: 100 },
  c1: { from: 90, duration: 150 },
  c2: { from: 230, duration: 150 },
  c3: { from: 370, duration: 150 },
  c4: { from: 510, duration: 150 },
  c5: { from: 650, duration: 120 },
  c6: { from: 760, duration: 100 },
  cta: { from: 850, duration: 140 },
};
export const V09B_TOTAL = 990;

// ---------- iPhone de fondo, siempre visible ----------
const PhoneBg: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const bob = Math.sin(f / 26) * 18;
  const rot = Math.sin(f / 41) * 1.6 - 4;
  const zoom = 1 + (f / V09B_TOTAL) * 0.1;
  const rise = spring({
    frame: f,
    fps,
    config: { damping: 16, stiffness: 70, mass: 1 },
  });
  const sweepX = interpolate((f % 120) / 120, [0, 1], [-700, 1400]);
  const swap = interpolate(f, [520, 540], [0, 1], clamp);
  const img = (src: string, o: number) => (
    <Img
      src={staticFile(src)}
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: 980,
        opacity: o,
      }}
    />
  );
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          right: -170,
          bottom: -220 + (1 - rise) * 600 - bob,
          width: 980,
          height: 1800,
          transform: `rotate(${rot}deg) scale(${zoom})`,
          transformOrigin: "50% 100%",
          opacity: 0.62,
          filter: "drop-shadow(0 40px 80px rgba(0,0,0,0.6))",
        }}
      >
        {img("byker/phone14.png", 1 - swap)}
        {img("byker/phone15.png", swap)}
        <div
          style={{
            position: "absolute",
            inset: 0,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -200,
              left: sweepX,
              width: 160,
              height: 2400,
              background:
                "linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,0.28),rgba(255,255,255,0))",
              transform: "rotate(18deg)",
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- Etiqueta animada (revela de izquierda a derecha) ----------
const Tag: React.FC<{
  at: number;
  children: React.ReactNode;
  style: React.CSSProperties;
}> = ({ at, children, style }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({
    frame: f - at,
    fps,
    config: { damping: 15, stiffness: 150, mass: 0.7 },
  });
  const wipe = interpolate(f - at, [0, 10], [100, 0], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  return (
    <div
      style={{
        ...style,
        clipPath: `inset(0 ${wipe}% 0 0)`,
        transform: `translateX(${(1 - s) * -60}px) scale(${interpolate(s, [0, 1], [1.12, 1])})`,
        transformOrigin: "0 50%",
      }}
    >
      {children}
    </div>
  );
};

const Cover: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pulse = 1 + 0.03 * Math.sin(f / 5);
  const sub = spring({ frame: f - 40, fps, config: { damping: 14 } });
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 70,
          top: 330,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 10,
        }}
      >
        <Tag at={2} style={{ ...box("#0d0d0d", "#fff"), fontSize: 120 }}>
          lo que no te
        </Tag>
        <Tag at={9} style={{ ...box("#fff", "#111"), fontSize: 150 }}>
          dicen
        </Tag>
        <div style={{ display: "flex", gap: 14, alignItems: "baseline" }}>
          <Tag at={16} style={{ ...box("#0d0d0d", "#fff"), fontSize: 64 }}>
            sobre
          </Tag>
          <Tag at={20} style={{ ...box("#0d0d0d", RED), fontSize: 120 }}>
            estos
          </Tag>
        </div>
        <div style={{ transform: `scale(${pulse})`, transformOrigin: "0 50%" }}>
          <Tag at={26} style={{ ...box("#0d0d0d", RED), fontSize: 150 }}>
            iPhones
          </Tag>
        </div>
        <div
          style={{
            marginTop: 20,
            background: "#0d0d0d",
            color: "#fff",
            fontFamily: MONO,
            fontSize: 34,
            padding: "6px 16px",
            opacity: sub,
            transform: `translateY(${(1 - sub) * 20}px)`,
          }}
        >
          (13, 14 y 15. qué cambia de verdad.)
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Content: React.FC<{ idx: number }> = ({ idx }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = SLIDES[idx];
  const push = interpolate(f, [0, 150], [1, 1.035], clamp);
  const cardS = spring({
    frame: f - 24,
    fps,
    config: { damping: 14, stiffness: 110, mass: 0.9 },
  });
  const desc = interpolate(f, [16, 28], [0, 1], clamp);
  const chars = Math.floor(
    interpolate(f, [26, 50], [0, s.label.length], clamp),
  );
  const glow = 0.5 + 0.5 * Math.sin(f / 6);
  return (
    <AbsoluteFill style={{ transform: `scale(${push})` }}>
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
          opacity: interpolate(f, [0, 8], [0, 1], clamp),
        }}
      >
        {s.tag}
      </div>
      <div
        style={{
          position: "absolute",
          left: 70,
          top: 230,
          width: 940,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 12,
        }}
      >
        <Tag at={2} style={{ ...box("#fff", "#111"), fontSize: 190 }}>
          {s.num}
        </Tag>
        <Tag at={9} style={{ ...box("#fff", "#111"), fontSize: 108 }}>
          {s.title}
        </Tag>
        <div
          style={{
            marginTop: 14,
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 50,
            letterSpacing: "-0.03em",
            lineHeight: 1.45,
            opacity: desc,
            transform: `translateY(${(1 - desc) * 26}px)`,
          }}
        >
          {s.desc.map((p, k) => (
            <span
              key={k}
              style={{
                background: "#fff",
                color: p.red ? RED : "#111",
                padding: "6px 14px",
                boxDecorationBreak: "clone",
                WebkitBoxDecorationBreak: "clone",
              }}
            >
              {p.t}
            </span>
          ))}
        </div>
        <div
          style={{
            marginTop: 14,
            background: "#0d0d0d",
            color: "#fff",
            fontFamily: MONO,
            fontSize: 28,
            padding: "4px 12px",
          }}
        >
          {s.label.slice(0, chars)}
          <span style={{ opacity: chars < s.label.length ? 1 : 0 }}>▌</span>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 70,
          top: 880,
          width: 940,
          height: 560,
          border: "8px solid #fff",
          boxShadow: `0 20px 50px rgba(0,0,0,0.45),0 0 ${30 * glow}px rgba(61,220,132,${0.35 * glow})`,
          overflow: "hidden",
          opacity: Math.min(1, cardS * 1.5),
          transform: `translateY(${(1 - cardS) * 140}px) scale(${interpolate(cardS, [0, 1], [0.92, 1])})`,
        }}
      >
        {s.card}
      </div>
    </AbsoluteFill>
  );
};

// Fondo de color que cambia por escena (fundido), debajo del iPhone.
const ORDER = ["cover", "c1", "c2", "c3", "c4", "c5", "c6", "cta"] as const;
const Backdrop: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      {ORDER.map((k, i) => (
        <AbsoluteFill
          key={k}
          style={{
            background: SLIDES[i].bg,
            opacity:
              i === 0
                ? 1
                : interpolate(
                    f,
                    [SCENES[k].from, SCENES[k].from + 10],
                    [0, 1],
                    clamp,
                  ),
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

const Cta: React.FC = () => {
  const f = useCurrentFrame();
  const pulse = 1 + 0.04 * Math.exp(-(((f - 40) % 30) / 6));
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 70,
          top: 330,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 10,
        }}
      >
        <Tag at={2} style={{ ...box("#fff", "#111"), fontSize: 130 }}>
          dime tu
        </Tag>
        <Tag at={9} style={{ ...box("#0d0d0d", RED), fontSize: 150 }}>
          presupuesto
        </Tag>
        <Tag
          at={18}
          style={{
            marginTop: 24,
            background: "#0d0d0d",
            color: "#fff",
            fontFamily: MONO,
            fontSize: 36,
            padding: "8px 18px",
          }}
        >
          y te digo cuál iPhone te conviene
        </Tag>
        <div style={{ transform: `scale(${pulse})`, transformOrigin: "0 50%" }}>
          <Tag
            at={26}
            style={{ ...box("#fff", "#111"), fontSize: 76, marginTop: 24 }}
          >
            WhatsApp 944 180 362
          </Tag>
        </div>
        <Tag
          at={34}
          style={{
            marginTop: 14,
            background: "#0d0d0d",
            color: "#fff",
            fontFamily: MONO,
            fontSize: 30,
            padding: "6px 16px",
          }}
        >
          Byker Store · importaciones · envíos a todo el Perú
        </Tag>
      </div>
    </AbsoluteFill>
  );
};

const seq = (
  key: keyof typeof SCENES,
  node: React.ReactNode,
  opts: { fadeIn?: number; fadeOut?: number } = {},
) => (
  <Sequence
    key={key}
    from={SCENES[key].from}
    durationInFrames={SCENES[key].duration}
    premountFor={FPS}
  >
    <Scene duration={SCENES[key].duration} fadeIn={10} fadeOut={10} {...opts}>
      {node}
    </Scene>
  </Sequence>
);

export const Video09B: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Audio
      src={staticFile(V09_MUSIC_FILE)}
      volume={(f) =>
        V09_MUSIC_VOLUME *
        interpolate(
          f,
          [0, 8, V09B_TOTAL - 45, V09B_TOTAL],
          [0.3, 1, 1, 0],
          clamp,
        )
      }
    />
    <Backdrop />
    <PhoneBg />
    {seq("cover", <Cover />, { fadeIn: 1 })}
    {seq("c1", <Content idx={1} />)}
    {seq("c2", <Content idx={2} />)}
    {seq("c3", <Content idx={3} />)}
    {seq("c4", <Content idx={4} />)}
    {seq("c5", <Content idx={5} />)}
    {seq("c6", <Content idx={6} />)}
    {seq("cta", <Cta />, { fadeOut: 20 })}
  </AbsoluteFill>
);
