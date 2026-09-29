import React from "react";
import { interpolate } from "remotion";

type Kind = "shield" | "box" | "check" | "chat";

const PATHS: Record<Kind, string[]> = {
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
