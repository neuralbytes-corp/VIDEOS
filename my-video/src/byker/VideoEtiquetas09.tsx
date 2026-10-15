import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  staticFile,
} from "remotion";
import { FPS } from "./config";
import { Scene } from "./BykerStore";
import { Carousel09 } from "./Carousel09";
import { V09_MUSIC_FILE, V09_MUSIC_VOLUME } from "./video09";

// Video 9 con el diseño de etiquetas del carrusel: cada lámina entra animada.
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const VE09_TOTAL = 990;
const PLAN = [
  { from: 0, duration: 90 },
  { from: 80, duration: 125 },
  { from: 195, duration: 125 },
  { from: 310, duration: 125 },
  { from: 425, duration: 125 },
  { from: 540, duration: 125 },
  { from: 655, duration: 125 },
  { from: 770, duration: 220 },
];

export const VideoEtiquetas09: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Audio
      src={staticFile(V09_MUSIC_FILE)}
      volume={(f) =>
        V09_MUSIC_VOLUME *
        interpolate(
          f,
          [0, 8, VE09_TOTAL - 45, VE09_TOTAL],
          [0.3, 1, 1, 0],
          clamp,
        )
      }
    />
    {PLAN.map((p, i) => (
      <Sequence
        key={i}
        from={p.from}
        durationInFrames={p.duration}
        premountFor={FPS}
      >
        <Scene
          duration={p.duration}
          fadeIn={i === 0 ? 1 : 8}
          fadeOut={i === PLAN.length - 1 ? 20 : 8}
        >
          <Carousel09 i={i} animate />
        </Scene>
      </Sequence>
    ))}
  </AbsoluteFill>
);
