import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, staticFile, useCurrentFrame } from "remotion";
import track from "./track.json";
import trackName from "./track_name.json";

type Entry = { s: number; crop: [number, number, number, number] };
const NUMERAL = track as unknown as Record<string, Entry>;
const NAME = trackName as unknown as Record<string, Entry>;

// The original video plays underneath. On the frames where it shows the "50" or the
// name, pre-computed patches (tools/make_patches.py, tools/make_name.py) replace them
// with "44" and "Edith" - same material, lighting, motion and fades as the originals.
const Patch: React.FC<{ e?: Entry; frame: number }> = ({ e, frame }) =>
  e ? (
    <Img
      src={staticFile(`patch/${e.s}_${String(frame).padStart(4, "0")}.png`)}
      style={{ position: "absolute", left: e.crop[0], top: e.crop[1] }}
    />
  ) : null;

export const MyComposition: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <OffthreadVideo src={staticFile("original.mp4")} />
      <Patch e={NUMERAL[String(frame)]} frame={frame} />
      <Patch e={NAME[String(frame)]} frame={frame} />
    </AbsoluteFill>
  );
};
