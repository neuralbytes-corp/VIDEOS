import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import "@fontsource/bodoni-moda/latin-400.css";
import "@fontsource/bodoni-moda/latin-400-italic.css";
import "@fontsource/bodoni-moda/latin-500.css";
import { FPS } from "./config";
import {
  V06_FADE,
  V06_MUSIC_FILE,
  V06_MUSIC_VOLUME,
  V06_SCENES,
  V06_TEXT,
  V06_TOTAL,
} from "./video06";
import { Scene } from "./BykerStore";
import { WhiteLogo } from "./Video02";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const SERIF = "'Bodoni Moda', serif";
const SANS = "Montserrat, sans-serif";
const GOLD = "#ecdcbc";
const ease = Easing.bezier(0.25, 0.1, 0.25, 1);

// Grano de película: ruido SVG que se desplaza cada fotograma.
const NOISE =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0'/></filter><rect width='300' height='300' filter='url(%23n)'/></svg>\")";
const Grain: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        backgroundImage: NOISE,
        backgroundPosition: `${(f * 37) % 300}px ${(f * 91) % 300}px`,
        opacity: 0.07,
        mixBlendMode: "screen",
        pointerEvents: "none",
      }}
    />
  );
};

const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      background:
        "radial-gradient(ellipse 95% 75% at 50% 45%,rgba(0,0,0,0) 45%,rgba(0,0,0,0.6) 100%)",
    }}
  />
);

// Foto del producto con cámara virtual: foco (fx,fy en 0..1 de la imagen), zoom y deriva.
const CinePhoto: React.FC<{
  fx: number;
  fy: number;
  z0: number;
  z1: number;
  dur: number;
  drift?: [number, number];
  target?: [number, number];
}> = ({ fx, fy, z0, z1, dur, drift = [0, 0], target = [540, 800] }) => {
  const f = useCurrentFrame();
  const t = ease(interpolate(f, [0, dur], [0, 1], clamp));
  const zoom = z0 + (z1 - z0) * t;
  const W = 900 * zoom;
  const H = W * (925 / 505);
  const dx = drift[0] * t;
  const dy = drift[1] * t;
  return (
    <Img
      src={staticFile("byker/phone14.png")}
      style={{
        position: "absolute",
        width: W,
        left: target[0] - fx * W + dx,
        top: target[1] - fy * H + dy,
        mixBlendMode: "screen",
        WebkitMaskImage:
          "linear-gradient(to right,transparent 0,#000 7%,#000 93%,transparent 100%),linear-gradient(to bottom,transparent 0,#000 5%,#000 80%,transparent 100%)",
        WebkitMaskComposite: "source-in",
        maskComposite: "intersect",
      }}
    />
  );
};

// Barrido de luz diagonal muy sutil sobre el producto.
const LightSweep: React.FC<{ from: number; to: number; strength?: number }> = ({
  from,
  to,
  strength = 0.22,
}) => {
  const f = useCurrentFrame();
  const x = interpolate(f, [from, to], [-40, 140], { ...clamp, easing: ease });
  return (
    <AbsoluteFill
      style={{
        mixBlendMode: "screen",
        background: `linear-gradient(105deg,transparent ${x - 14}%,rgba(255,244,225,${strength}) ${x}%,transparent ${x + 14}%)`,
      }}
    />
  );
};

// Partículas de polvo flotando (sin blur: degradados radiales).
const DUST = Array.from({ length: 18 }, (_, i) => ({
  x: (i * 53) % 100,
  y: (i * 37 + 11) % 100,
  s: 8 + ((i * 7) % 18),
  sp: 0.12 + ((i * 3) % 7) / 40,
}));
const Dust: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      {DUST.map((d, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${d.x + Math.sin((f + i * 13) / 60) * 2}%`,
            top: `${(d.y - f * d.sp * 0.1 + 100) % 100}%`,
            width: d.s,
            height: d.s,
            borderRadius: "50%",
            background:
              "radial-gradient(circle,rgba(255,240,215,0.5) 0%,rgba(255,240,215,0) 70%)",
            opacity: 0.35 + 0.3 * Math.sin((f + i * 20) / 40),
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

// Título elegante abajo: serif itálica + línea fina + subtítulo espaciado.
const Title: React.FC<{ title: string; sub: string; delay?: number }> = ({
  title,
  sub,
  delay = 40,
}) => {
  const f = useCurrentFrame();
  const a = ease(interpolate(f, [delay, delay + 40], [0, 1], clamp));
  const b = ease(interpolate(f, [delay + 14, delay + 54], [0, 1], clamp));
  return (
    <div
      style={{
        position: "absolute",
        bottom: 230,
        width: "100%",
        textAlign: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: -230,
          height: 820,
          background:
            "linear-gradient(to top,rgba(0,0,0,0.94) 0%,rgba(0,0,0,0.7) 50%,rgba(0,0,0,0) 100%)",
        }}
      />
      <div
        style={{
          fontFamily: SERIF,
          fontStyle: "italic",
          fontWeight: 400,
          fontSize: 104,
          color: "#fff",
          opacity: a,
          transform: `translateY(${(1 - a) * 22}px)`,
          letterSpacing: 1,
        }}
      >
        {title}
      </div>
      <div
        style={{
          margin: "26px auto 22px",
          width: 220 * b,
          height: 2,
          background: GOLD,
          opacity: 0.9,
        }}
      />
      <div
        style={{
          fontFamily: SANS,
          fontWeight: 500,
          fontSize: 34,
          letterSpacing: 12,
          textTransform: "uppercase",
          color: GOLD,
          opacity: b,
        }}
      >
        {sub}
      </div>
    </div>
  );
};

// ---------- Planos ----------
const TitleShot: React.FC = () => {
  const f = useCurrentFrame();
  const a = ease(interpolate(f, [10, 60], [0, 1], clamp));
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ opacity: a, transform: `scale(${0.96 + 0.04 * a})` }}>
        <WhiteLogo width={640} />
      </div>
      <LightSweep from={30} to={110} strength={0.18} />
    </AbsoluteFill>
  );
};

const HeroShot: React.FC = () => (
  <AbsoluteFill>
    <CinePhoto
      fx={0.5}
      fy={0.5}
      z0={0.84}
      z1={0.96}
      dur={170}
      drift={[-14, -20]}
      target={[540, 780]}
    />
    <LightSweep from={50} to={150} />
    <Title title={V06_TEXT.hero.title} sub={V06_TEXT.hero.sub} />
  </AbsoluteFill>
);

const MacroShot: React.FC = () => {
  const f = useCurrentFrame();
  const streak = ease(interpolate(f, [40, 130], [0, 1], clamp));
  return (
    <AbsoluteFill>
      <CinePhoto
        fx={0.22}
        fy={0.17}
        z0={1.7}
        z1={2.0}
        dur={170}
        drift={[24, 14]}
        target={[500, 640]}
      />
      <AbsoluteFill style={{ opacity: 0.55 * Math.sin(streak * Math.PI) }}>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 600,
            height: 6,
            background:
              "linear-gradient(90deg,transparent,rgba(160,200,255,0.8) 50%,transparent)",
            transform: `translateX(${(streak - 0.5) * 260}px)`,
          }}
        />
      </AbsoluteFill>
      <Dust />
      <Title title={V06_TEXT.macro.title} sub={V06_TEXT.macro.sub} />
    </AbsoluteFill>
  );
};

const ScreenShot: React.FC = () => (
  <AbsoluteFill>
    <CinePhoto
      fx={0.7}
      fy={0.36}
      z0={1.15}
      z1={1.3}
      dur={170}
      drift={[-16, 24]}
      target={[760, 640]}
    />
    <LightSweep from={70} to={170} strength={0.14} />
    <Title title={V06_TEXT.screen.title} sub={V06_TEXT.screen.sub} />
  </AbsoluteFill>
);

const EdgeShot: React.FC = () => (
  <AbsoluteFill>
    <CinePhoto
      fx={0.45}
      fy={0.8}
      z0={1.45}
      z1={1.3}
      dur={160}
      drift={[0, -50]}
      target={[540, 980]}
    />
    <LightSweep from={20} to={130} strength={0.28} />
    <Dust />
    <Title title={V06_TEXT.edge.title} sub={V06_TEXT.edge.sub} />
  </AbsoluteFill>
);

const RevealShot: React.FC = () => (
  <AbsoluteFill>
    <CinePhoto
      fx={0.5}
      fy={0.7}
      z0={1.5}
      z1={0.9}
      dur={170}
      drift={[0, 30]}
      target={[540, 800]}
    />
    <LightSweep from={90} to={190} strength={0.12} />
    <Title title={V06_TEXT.reveal.title} sub={V06_TEXT.reveal.sub} delay={60} />
  </AbsoluteFill>
);

const OutroShot: React.FC = () => {
  const f = useCurrentFrame();
  const a = ease(interpolate(f, [10, 55], [0, 1], clamp));
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <div style={{ marginTop: 300, opacity: a }}>
        <WhiteLogo width={560} />
      </div>
      <div style={{ marginTop: 70, textAlign: "center" }}>
        {V06_TEXT.outro.lines.map((l, i) => {
          const o = ease(
            interpolate(f, [50 + i * 16, 80 + i * 16], [0, 1], clamp),
          );
          return (
            <div
              key={l}
              style={{
                fontFamily: SANS,
                fontWeight: 500,
                fontSize: 36,
                letterSpacing: 7,
                textTransform: "uppercase",
                color: GOLD,
                opacity: o,
                transform: `translateY(${(1 - o) * 14}px)`,
                marginBottom: 22,
              }}
            >
              {l}
            </div>
          );
        })}
      </div>
      <div
        style={{
          marginTop: 56,
          fontFamily: SERIF,
          fontStyle: "italic",
          fontSize: 92,
          color: "#fff",
          opacity: ease(interpolate(f, [110, 150], [0, 1], clamp)),
        }}
      >
        {V06_TEXT.outro.phone}
      </div>
    </AbsoluteFill>
  );
};

const seq = (
  key: keyof typeof V06_SCENES,
  node: React.ReactNode,
  out = V06_FADE,
) => (
  <Sequence
    key={key}
    from={V06_SCENES[key].from}
    durationInFrames={V06_SCENES[key].duration}
    premountFor={FPS}
  >
    <Scene
      duration={V06_SCENES[key].duration}
      fadeIn={key === "title" ? 1 : V06_FADE}
      fadeOut={out}
    >
      {node}
    </Scene>
  </Sequence>
);

export const Video06: React.FC = () => (
  <AbsoluteFill style={{ background: "#050505" }}>
    <Audio
      src={staticFile(V06_MUSIC_FILE)}
      volume={(f) =>
        V06_MUSIC_VOLUME *
        interpolate(f, [0, 45, V06_TOTAL - 75, V06_TOTAL], [0, 1, 1, 0], clamp)
      }
    />
    {seq("title", <TitleShot />)}
    {seq("hero", <HeroShot />)}
    {seq("macro", <MacroShot />)}
    {seq("screen", <ScreenShot />)}
    {seq("edge", <EdgeShot />)}
    {seq("reveal", <RevealShot />)}
    {seq("outro", <OutroShot />, 30)}
    <Vignette />
    <Grain />
  </AbsoluteFill>
);
