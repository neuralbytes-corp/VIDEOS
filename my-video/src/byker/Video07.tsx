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
  V07_BPM,
  V07_CTA_FROM,
  V07_CTA,
  V07_CTA_TITLE,
  V07_HOOK,
  V07_HOOK_TEXT,
  V07_MARQUEE,
  V07_MUSIC_FILE,
  V07_MUSIC_VOLUME,
  V07_OFFER,
  V07_OFFER_FROM,
  V07_OFFER_ITEMS,
  V07_SHOT,
  V07_SHOTS_FROM,
  V07_STICKER,
  V07_TOTAL,
} from "./video07";
import {
  CameraShot,
  ChargeShot,
  FeedShot,
  GameShot,
  HookShot,
  SelfieShot,
} from "./Video05";
import { CtaScene, DarkBackground, GREEN, Photo } from "./Video02";
import { LineIcon } from "./Icons";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const YELLOW = "#ffd60a";
const HEAD = "Oswald, sans-serif";
const BODY = "Montserrat, sans-serif";
const BEAT = (FPS * 60) / V07_BPM;

// Frames donde hay un corte: ahí van flash, sacudida y líneas de velocidad.
const CUTS = [
  V07_HOOK,
  ...Array.from({ length: 5 }, (_, i) => V07_SHOTS_FROM + V07_SHOT * (i + 1)),
  V07_OFFER_FROM,
  V07_CTA_FROM,
];
const OFFER_CUTS = V07_OFFER_ITEMS.map((_, i) => V07_OFFER_FROM + 8 + i * 28);
const ALL_CUTS = [...CUTS, ...OFFER_CUTS];

const sinceCut = (f: number) => {
  let best = 999;
  for (const c of ALL_CUTS) if (f >= c) best = Math.min(best, f - c);
  return best;
};

// ---------- Capa de efectos global ----------
const Fx: React.FC = () => {
  const f = useCurrentFrame();
  const d = sinceCut(f);
  const flash = interpolate(d, [0, 1, 6], [0.9, 0.55, 0], clamp);
  const lines = interpolate(d, [0, 9], [0.9, 0], clamp);
  return (
    <>
      <AbsoluteFill
        style={{
          opacity: lines * 0.55,
          background:
            "repeating-conic-gradient(from 0deg,rgba(255,255,255,0.55) 0deg 1.6deg,rgba(255,255,255,0) 1.6deg 8deg)",
          WebkitMaskImage:
            "radial-gradient(circle at 50% 50%,transparent 32%,#000 75%)",
          maskImage:
            "radial-gradient(circle at 50% 50%,transparent 32%,#000 75%)",
        }}
      />
      <AbsoluteFill style={{ background: "#fff", opacity: flash }} />
    </>
  );
};

// ---------- Contenido global encima de las tomas ----------
const Overlay: React.FC = () => {
  const f = useCurrentFrame();
  const phase = (f % BEAT) / BEAT;
  const pulse = 1 + 0.07 * Math.exp(-phase * 6);
  const show = f >= V07_HOOK + 6 && f < V07_OFFER_FROM;
  const off = (f * 9) % 1400;
  return (
    <>
      {show ? (
        <div
          style={{
            position: "absolute",
            top: 62,
            right: 36,
            transform: `rotate(7deg) scale(${pulse})`,
            padding: "14px 28px 10px",
            borderRadius: 18,
            background: YELLOW,
            color: "#000",
            textAlign: "center",
            boxShadow: "0 14px 34px rgba(0,0,0,0.5)",
          }}
        >
          <div
            style={{
              fontFamily: BODY,
              fontWeight: 700,
              fontSize: 20,
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            {V07_STICKER.top}
          </div>
          <div
            style={{
              fontFamily: HEAD,
              fontWeight: 700,
              fontSize: 76,
              lineHeight: 1,
            }}
          >
            {V07_STICKER.price}
          </div>
        </div>
      ) : null}
      {f >= V07_HOOK && f < V07_CTA_FROM ? (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 74,
            background: YELLOW,
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
          }}
        >
          <div
            style={{
              whiteSpace: "nowrap",
              transform: `translateX(${-off}px)`,
              fontFamily: HEAD,
              fontWeight: 700,
              fontSize: 40,
              letterSpacing: 2,
              color: "#000",
            }}
          >
            {V07_MARQUEE.repeat(8)}
          </div>
        </div>
      ) : null}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: 10,
          width: `${(f / V07_TOTAL) * 100}%`,
          background: `linear-gradient(90deg,#fff,${YELLOW})`,
        }}
      />
    </>
  );
};

// ---------- Gancho con el precio ----------
const HookPrice: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const slam = (d: number) =>
    spring({
      frame: f - d,
      fps,
      config: { damping: 9, stiffness: 200, mass: 0.7 },
    });
  const a = slam(1);
  const b = slam(9);
  const sub = interpolate(f, [34, 46], [0, 1], clamp);
  const phase = (f % BEAT) / BEAT;
  return (
    <AbsoluteFill style={{ alignItems: "center", background: "#0a0603" }}>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 50% 62%,rgba(255,214,10,0.28),rgba(255,214,10,0) 60%)",
        }}
      />
      <div
        style={{
          marginTop: 150,
          textAlign: "center",
          fontFamily: HEAD,
          fontWeight: 700,
          textTransform: "uppercase",
          lineHeight: 1,
          whiteSpace: "nowrap",
        }}
      >
        <div
          style={{
            fontSize: 150,
            color: "#fff",
            transform: `scale(${interpolate(a, [0, 1], [2.4, 1])})`,
            opacity: Math.min(1, a * 2),
          }}
        >
          {V07_HOOK_TEXT.line1}
        </div>
        <div
          style={{
            fontSize: 190,
            color: YELLOW,
            transform: `scale(${interpolate(b, [0, 1], [2.4, 1])})`,
            opacity: Math.min(1, b * 2),
          }}
        >
          {V07_HOOK_TEXT.line2}
        </div>
      </div>
      <div
        style={{
          marginTop: 40,
          transform: `scale(${1 + 0.03 * Math.exp(-phase * 6)})`,
          opacity: interpolate(f, [12, 26], [0, 1], clamp),
        }}
      >
        <Photo model="14" width={620} />
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 130,
          fontFamily: BODY,
          fontWeight: 800,
          fontSize: 50,
          letterSpacing: 4,
          textTransform: "uppercase",
          color: "#fff",
          opacity: sub,
        }}
      >
        {V07_HOOK_TEXT.sub} ↓
      </div>
    </AbsoluteFill>
  );
};

// ---------- Tomas del video 5, recortadas a 2 s y con "golpe" de zoom al cortar ----------
const Punch: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  const s = interpolate(f, [0, 9], [1.22, 1], clamp);
  const phase = (f % BEAT) / BEAT;
  return (
    <AbsoluteFill
      style={{ transform: `scale(${s * (1 + 0.025 * Math.exp(-phase * 6))})` }}
    >
      {children}
    </AbsoluteFill>
  );
};

const SHOTS: { node: React.ReactNode; a: number }[] = [
  { node: <HookShot />, a: 0 },
  { node: <CameraShot />, a: 14 },
  { node: <FeedShot />, a: 0 },
  { node: <SelfieShot />, a: 0 },
  { node: <GameShot />, a: 0 },
  { node: <ChargeShot />, a: 6 },
];

// ---------- Oferta apilada ----------
const Offer: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: "#0a0a0a" }}>
      <div
        style={{
          marginTop: 130,
          textAlign: "center",
          fontFamily: HEAD,
          fontWeight: 700,
          fontSize: 120,
          textTransform: "uppercase",
          color: "#fff",
        }}
      >
        Incluye
      </div>
      {V07_OFFER_ITEMS.map((it, i) => {
        const s = spring({
          frame: f - (8 + i * 28),
          fps,
          config: { damping: 11, stiffness: 190, mass: 0.7 },
        });
        const yellow = i % 2 === 0;
        return (
          <div
            key={it.big}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 330 + i * 250,
              height: 220,
              background: yellow ? YELLOW : "#fff",
              color: "#000",
              display: "flex",
              alignItems: "center",
              gap: 40,
              padding: "0 70px",
              transform: `translateX(${(1 - s) * 1100}px) rotate(${(1 - s) * 4}deg)`,
              boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
            }}
          >
            <LineIcon kind={it.icon} progress={1} size={120} color="#000" />
            <div>
              <div
                style={{
                  fontFamily: HEAD,
                  fontWeight: 700,
                  fontSize: 110,
                  lineHeight: 1,
                  textTransform: "uppercase",
                }}
              >
                {it.big}
              </div>
              <div
                style={{
                  fontFamily: BODY,
                  fontWeight: 700,
                  fontSize: 36,
                  letterSpacing: 3,
                  textTransform: "uppercase",
                }}
              >
                {it.small}
              </div>
            </div>
          </div>
        );
      })}
      <div
        style={{
          position: "absolute",
          bottom: 130,
          width: "100%",
          textAlign: "center",
          fontFamily: HEAD,
          fontWeight: 700,
          fontSize: 70,
          color: GREEN,
          opacity: interpolate(f, [100, 112], [0, 1], clamp),
        }}
      >
        TODO POR S/ 1,950
      </div>
    </AbsoluteFill>
  );
};

export const Video07: React.FC = () => {
  const f = useCurrentFrame();
  const d = sinceCut(f);
  const shake = Math.sin(f * 3.1) * 14 * Math.max(0, 1 - d / 7);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Audio
        src={staticFile(V07_MUSIC_FILE)}
        volume={(fr) =>
          V07_MUSIC_VOLUME *
          interpolate(
            fr,
            [0, 4, V07_TOTAL - 40, V07_TOTAL],
            [0.5, 1, 1, 0],
            clamp,
          )
        }
      />
      <AbsoluteFill
        style={{ transform: `translate(${shake}px,${-shake * 0.6}px)` }}
      >
        <DarkBackground />
        <Sequence durationInFrames={V07_HOOK}>
          <HookPrice />
        </Sequence>
        {SHOTS.map((s, i) => (
          <Sequence
            key={i}
            from={V07_SHOTS_FROM + i * V07_SHOT}
            durationInFrames={V07_SHOT}
            premountFor={FPS}
          >
            <Sequence
              from={-s.a}
              durationInFrames={s.a + V07_SHOT}
              layout="none"
            >
              <Punch>{s.node}</Punch>
            </Sequence>
          </Sequence>
        ))}
        <Sequence from={V07_OFFER_FROM} durationInFrames={V07_OFFER}>
          <Offer />
        </Sequence>
        <Sequence from={V07_CTA_FROM} durationInFrames={V07_CTA}>
          <CtaScene title={V07_CTA_TITLE} />
        </Sequence>
        <Overlay />
      </AbsoluteFill>
      <Fx />
    </AbsoluteFill>
  );
};
