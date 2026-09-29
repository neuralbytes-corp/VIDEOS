import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, staticFile, useCurrentFrame } from "remotion";
import track from "./track.json";

type Entry = { s: number; crop: [number, number, number, number]; bb: number[] };
const T = track as Record<string, Entry>;

// The original video plays underneath. On the frames where it shows the "50", a
// pre-computed patch (tools/make_patches.py) replaces it with a "44" that has the
// same material, lighting, motion and fade as the original numerals.
export const MyComposition: React.FC = () => {
  const frame = useCurrentFrame();
  const e = T[String(frame)];
  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <OffthreadVideo src={staticFile("original.mp4")} />
      {e ? (
        <Img
          src={staticFile(`patch/${e.s}_${String(frame).padStart(4, "0")}.png`)}
          style={{ position: "absolute", left: e.crop[0], top: e.crop[1] }}
        />
      ) : null}
    </AbsoluteFill>
  );
};
