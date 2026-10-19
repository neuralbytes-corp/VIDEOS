import React from "react";
import {
  AbsoluteFill,
  Easing,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, FPS } from "./config";
import {
  V01_CTA,
  V01_HOOK,
  V01_SCENES,
  V01_STEPS,
  V01_STEPS_TITLE,
} from "./video01";
import { Background, CtaScene, LogoScene, Scene } from "./BykerStore";
import { IPhone } from "./IPhone";
import { LineIcon } from "./Icons";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.16, 1, 0.3, 1);

const HookScene: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t1 = ease(interpolate(f, [8, 38], [0, 1], clamp));
  const t2 = ease(interpolate(f, [20, 50], [0, 1], clamp));
  const phone = spring({
    frame: f - 25,
    fps,
    config: { damping: 22, stiffness: 70 },
  });
  const rotY = interpolate(phone, [0, 1], [-36, -12]) + Math.sin(f / 40) * 4;
  const y = interpolate(phone, [0, 1], [300, 0]);
  return (
    <AbsoluteFill style={{ alignItems: "center", fontFamily: "Inter" }}>
      <div
        style={{
          marginTop: 240,
          textAlign: "center",
          fontWeight: 800,
          fontSize: 112,
          lineHeight: 1.05,
          letterSpacing: -3.5,
          color: COLORS.ink,
        }}
      >
        <div
          style={{ opacity: t1, transform: `translateY(${(1 - t1) * 40}px)` }}
        >
          {V01_HOOK.line1}
        </div>
        <div
          style={{
            opacity: t2,
            transform: `translateY(${(1 - t2) * 40}px)`,
            color: COLORS.soft,
          }}
        >
          {V01_HOOK.line2}
        </div>
      </div>
      <div style={{ marginTop: 80, perspective: 2200, opacity: phone }}>
        <div
          style={{
            transform: `translateY(${y}px) rotateX(6deg) rotateY(${rotY}deg)`,
          }}
        >
          <IPhone width={520} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

const ROW = 330;
const TOP = 440;

const StepsScene: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tt = ease(interpolate(f, [6, 36], [0, 1], clamp));
  const per = 105;
  return (
    <AbsoluteFill style={{ fontFamily: "Inter" }}>
      <div
        style={{
          marginTop: 170,
          textAlign: "center",
          fontWeight: 800,
          fontSize: 96,
          letterSpacing: -3,
          color: COLORS.ink,
          opacity: tt,
          transform: `translateY(${(1 - tt) * 30}px)`,
        }}
      >
        {V01_STEPS_TITLE}
      </div>
      {V01_STEPS.map((st, i) => {
        const start = 30 + i * per;
        const s = spring({
          frame: f - start,
          fps,
          config: { damping: 18, stiffness: 110 },
        });
        const draw = interpolate(f, [start + 10, start + 50], [0, 1], {
          ...clamp,
          easing: Easing.out(Easing.cubic),
        });
        const lineP = interpolate(f, [start + 40, start + per], [0, 1], clamp);
        const top = TOP + i * ROW;
        return (
          <React.Fragment key={st.title}>
            {i < V01_STEPS.length - 1 ? (
              <div
                style={{
                  position: "absolute",
                  left: 135,
                  top: top + 130,
                  width: 6,
                  height: (ROW - 130 + 6) * lineP,
                  borderRadius: 3,
                  background: COLORS.ink,
                  opacity: 0.85,
                }}
              />
            ) : null}
            <div
              style={{
                position: "absolute",
                left: 70,
                top,
                width: 136,
                height: 136,
                borderRadius: 68,
                background: COLORS.ink,
                color: "#fff",
                fontWeight: 800,
                fontSize: 64,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: s,
                transform: `scale(${interpolate(s, [0, 1], [0.6, 1])})`,
                boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
              }}
            >
              {i + 1}
            </div>
            <div
              style={{
                position: "absolute",
                left: 250,
                top: top - 22,
                width: 760,
                height: 180,
                boxSizing: "border-box",
                padding: "0 36px",
                display: "flex",
                alignItems: "center",
                gap: 30,
                borderRadius: 40,
                background: "rgba(255,255,255,0.94)",
                border: `2px solid ${COLORS.line}`,
                boxShadow:
                  "0 24px 60px rgba(0,0,0,0.10), 0 4px 14px rgba(0,0,0,0.05)",
                opacity: s,
                transform: `translateX(${(1 - s) * 80}px)`,
              }}
            >
              <div style={{ flex: "none" }}>
                <LineIcon kind={st.icon} progress={draw} size={78} />
              </div>
              <div>
                <div
                  style={{
                    fontWeight: 800,
                    fontSize: 44,
                    letterSpacing: -1,
                    color: COLORS.ink,
                  }}
                >
                  {st.title}
                </div>
                <div
                  style={{
                    marginTop: 6,
                    fontWeight: 400,
                    fontSize: 29,
                    lineHeight: 1.25,
                    color: COLORS.soft,
                  }}
                >
                  {st.text}
                </div>
              </div>
            </div>
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};

export const Video01: React.FC = () => (
  <AbsoluteFill>
    <Background />
    <Sequence
      from={V01_SCENES.logo.from}
      durationInFrames={V01_SCENES.logo.duration}
      premountFor={FPS}
    >
      <Scene duration={V01_SCENES.logo.duration} fadeIn={1}>
        <LogoScene />
      </Scene>
    </Sequence>
    <Sequence
      from={V01_SCENES.hook.from}
      durationInFrames={V01_SCENES.hook.duration}
      premountFor={FPS}
    >
      <Scene duration={V01_SCENES.hook.duration}>
        <HookScene />
      </Scene>
    </Sequence>
    <Sequence
      from={V01_SCENES.steps.from}
      durationInFrames={V01_SCENES.steps.duration}
      premountFor={FPS}
    >
      <Scene duration={V01_SCENES.steps.duration}>
        <StepsScene />
      </Scene>
    </Sequence>
    <Sequence
      from={V01_SCENES.cta.from}
      durationInFrames={V01_SCENES.cta.duration}
      premountFor={FPS}
    >
      <Scene duration={V01_SCENES.cta.duration} fadeOut={20}>
        <CtaScene title={V01_CTA.title} subtitle={V01_CTA.subtitle} />
      </Scene>
    </Sequence>
  </AbsoluteFill>
);
