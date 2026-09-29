import React from "react";
import {
  AbsoluteFill,
  Img,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { continueRender, delayRender } from "remotion";
import track from "./track.json";

const bodoni = "Bodoni Moda Local";
const fontHandle = delayRender("font");
new FontFace(bodoni, `url(${staticFile("bodoni-moda-latin-800-normal.woff2")})`, {
  weight: "800",
})
  .load()
  .then((f) => {
    document.fonts.add(f);
    continueRender(fontHandle);
  });

type Entry = {
  s: number;
  n: number;
  bb: [number, number, number, number];
  crop: [number, number, number, number];
  a: number;
};
const T = track as Record<string, Entry>;

// Median of neighbouring boxes so the fitted number doesn't jitter.
const smoothBox = (frame: number, scene: number): [number, number, number, number] => {
  const cols: number[][] = [[], [], [], []];
  for (let f = frame - 3; f <= frame + 3; f++) {
    const e = T[String(f)];
    if (e && e.s === scene) e.bb.forEach((v, k) => cols[k].push(v));
  }
  return cols.map((c) => {
    const s = [...c].sort((x, y) => x - y);
    return s[Math.floor(s.length / 2)];
  }) as [number, number, number, number];
};

// Scene 1: gold glitter serif numeral.
const Glitter44: React.FC<{ box: [number, number, number, number]; alpha: number }> = ({
  box,
  alpha,
}) => {
  const [x0, y0, x1, y1] = box;
  const w = x1 - x0;
  const h = y1 - y0;
  return (
    <svg
      style={{ position: "absolute", left: x0, top: y0, width: w, height: h, opacity: alpha, overflow: "visible" }}
      viewBox={`0 0 ${w} ${h}`}
    >
      <defs>
        <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#a8823f" />
          <stop offset="0.5" stopColor="#957033" />
          <stop offset="1" stopColor="#a67f3b" />
        </linearGradient>
        <filter id="glit" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 1  0 0 0 0 0.9  0 0 0 0 0.6  0 0 0 9 -4.6" result="sp" />
          <feComposite in="sp" in2="SourceGraphic" operator="in" result="spin" />
          <feMerge>
            <feMergeNode in="SourceGraphic" />
            <feMergeNode in="spin" />
          </feMerge>
        </filter>
      </defs>
      <text
        x={w / 2}
        y={h}
        textAnchor="middle"
        fontFamily={bodoni}
        fontWeight={800}
        fontSize={h / 0.71}
        textLength={w}
        lengthAdjust="spacingAndGlyphs"
        fill="url(#g1)"
        filter="url(#glit)"
      >
        44
      </text>
    </svg>
  );
};

// Scene 2: gold foil balloon numerals, drawn as inflated tubes.
const four = "M 92 36 L 92 154 M 92 36 L 38 114 L 104 114";
const Foil44: React.FC<{ box: [number, number, number, number] }> = ({ box }) => {
  const [x0, y0, x1, y1] = box;
  const w = x1 - x0 + 16;
  const h = y1 - y0 + 16;
  const layers: [string, number][] = [
    ["#8a4f06", 64],
    ["#d18a12", 58],
    ["#f2b91f", 48],
    ["#ffd94d", 32],
    ["#fff0a6", 10],
  ];
  return (
    <svg
      style={{ position: "absolute", left: x0 - 8, top: y0 - 8, width: w, height: h }}
      viewBox="0 0 262 190"
      preserveAspectRatio="none"
    >
      {layers.map(([c, sw], k) => (
        <g
          key={c}
          fill="none"
          stroke={c}
          strokeWidth={sw}
          strokeLinecap="round"
          strokeLinejoin="round"
          transform={k >= 3 ? "translate(-4 -5)" : undefined}
        >
          <path d={four} transform="translate(0 0)" />
          <path d={four} transform="translate(124 0)" />
        </g>
      ))}
    </svg>
  );
};

export const MyComposition: React.FC = () => {
  const frame = useCurrentFrame();
  const e = T[String(frame)];
  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <OffthreadVideo src={staticFile("original.mp4")} />
      {e ? (
        <>
          <Img
            src={staticFile(`patch/${e.s}_${String(frame).padStart(4, "0")}.png`)}
            style={{ position: "absolute", left: e.crop[0], top: e.crop[1] }}
          />
          {e.s === 1 ? (
            <Glitter44 box={smoothBox(frame, 1)} alpha={e.a} />
          ) : (
            <Foil44 box={smoothBox(frame, 2)} />
          )}
        </>
      ) : null}
    </AbsoluteFill>
  );
};
