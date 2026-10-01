import React from "react";
import { interpolate } from "remotion";

type Kind =
  | "shield"
  | "box"
  | "check"
  | "chat"
  | "globe"
  | "receipt"
  | "plug"
  | "battery"
  | "calendar";

const PATHS: Record<Kind, string[]> = {
  plug: [
    "M24 8 V20",
    "M40 8 V20",
    "M16 20 H48 V34 C48 42 41 48 32 48 C23 48 16 42 16 34 Z",
    "M32 48 V58",
  ],
  battery: [
    "M6 22 H50 V42 H6 Z",
    "M54 29 V35",
    "M13 28 V36",
    "M21 28 V36",
    "M29 28 V36",
    "M37 28 V36",
    "M43 28 V36",
  ],
  calendar: [
    "M12 14 H52 V54 H12 Z",
    "M12 26 H52",
    "M22 8 V18",
    "M42 8 V18",
    "M22 36 H32",
    "M22 44 H42",
  ],
  globe: [
    "M32 8 A24 24 0 1 0 32 56 A24 24 0 1 0 32 8 Z",
    "M8 32 H56",
    "M32 8 C20 20 20 44 32 56",
    "M32 8 C44 20 44 44 32 56",
  ],
  receipt: [
    "M16 8 H48 V56 L42 51 L37 56 L32 51 L27 56 L22 51 L16 56 Z",
    "M23 20 H41",
    "M23 29 H41",
    "M23 38 H34",
  ],
  check: ["M14 33 L27 46 L50 20"],
  shield: [
    "M32 8 L52 16 V32 C52 44 43 53 32 58 C21 53 12 44 12 32 V16 Z",
    "M22 32 L29 39 L43 24",
  ],
  box: [
    "M32 8 L54 19 V45 L32 56 L10 45 V19 Z",
    "M10 19 L32 30 L54 19",
    "M32 30 V56",
  ],
  chat: ["M12 14 H52 V42 H30 L18 54 V42 H12 Z", "M22 26 H42", "M22 33 H36"],
};

// Ícono de línea que se "dibuja" con progress 0→1.
export const LineIcon: React.FC<{
  kind: Kind;
  progress: number;
  size?: number;
  color?: string;
}> = ({ kind, progress, size = 84, color = "#0b0b0d" }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    {PATHS[kind].map((d, i) => (
      <path
        key={i}
        d={d}
        stroke={color}
        strokeWidth={3.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={interpolate(progress, [0, 1], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })}
      />
    ))}
  </svg>
);
