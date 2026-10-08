import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, HIGHLIGHTS, HIGHLIGHTS_TITLE } from "./config";
import { LineIcon } from "./Icons";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.16, 1, 0.3, 1);
const GREEN = "#2fb457";

// Boleta de compra con sello verde de "verificado".
const Receipt: React.FC<{ p: number }> = ({ p }) => {
  const zig = Array.from(
    { length: 11 },
    (_, i) => `${(1 - i / 10) * 100}% ${i % 2 ? 100 : 94}%`,
  ).join(",");
  const bar = (w: number, strong = false) => (
    <div
      style={{
        height: strong ? 10 : 7,
        width: `${w}%`,
        borderRadius: 4,
        background: strong ? "#222" : "#cfcfd4",
        marginTop: 11,
      }}
    />
  );
  return (
    <div
      style={{
        position: "relative",
        width: 230,
        height: 250,
        borderRadius: 36,
        background: "#ececf0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ position: "relative", width: 170, height: 210 }}>
        <div
          style={{
            width: 170,
            height: 210,
            background: "#fff",
            padding: "22px 20px",
            boxSizing: "border-box",
            clipPath: `polygon(0 0,100% 0,${zig})`,
            filter: "drop-shadow(0 10px 18px rgba(0,0,0,0.18))",
            fontFamily: "Inter",
          }}
        >
          <div
            style={{
              fontWeight: 800,
              fontSize: 15,
              letterSpacing: 2,
              color: "#111",
              textAlign: "center",
            }}
          >
            BOLETA
          </div>
          {bar(60, true)}
          {bar(90)}
          {bar(75)}
          {bar(85)}
          <div
            style={{ height: 2, background: "#e3e3e7", margin: "16px 0 4px" }}
          />
          {bar(55, true)}
        </div>
        <div
          style={{
            position: "absolute",
            right: -22,
            bottom: 22,
            width: 74,
            height: 74,
            borderRadius: 37,
            background: GREEN,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `scale(${p})`,
            boxShadow: "0 8px 20px rgba(47,180,87,0.45)",
          }}
        >
          <LineIcon kind="check" progress={p} size={46} color="#fff" />
        </div>
      </div>
    </div>
  );
};

const Battery: React.FC<{ p: number }> = ({ p }) => (
  <div style={{ display: "flex", alignItems: "center" }}>
    <div
      style={{
        width: 190,
        height: 98,
        borderRadius: 26,
        border: "7px solid #1b1b1e",
        padding: 7,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${p * 100}%`,
          borderRadius: 14,
          background: `linear-gradient(180deg,#5be585,${GREEN})`,
        }}
      />
    </div>
    <div
      style={{
        width: 9,
        height: 32,
        borderRadius: "0 6px 6px 0",
        background: "#1b1b1e",
        marginLeft: 3,
      }}
    />
  </div>
);

const Looks: React.FC<{ p: number }> = ({ p }) => (
  <div style={{ textAlign: "center", fontFamily: "Inter" }}>
    <div
      style={{
        fontWeight: 800,
        fontSize: 76,
        letterSpacing: -2,
        color: COLORS.ink,
        lineHeight: 1,
      }}
    >
      {Math.round(p * 10)}
      <span style={{ color: "#9a9aa2" }}>/10</span>
    </div>
    <div
      style={{
        marginTop: 10,
        display: "flex",
        gap: 6,
        justifyContent: "center",
      }}
    >
      {[0, 1, 2, 3, 4].map((i) => {
        const on = interpolate(p, [i / 5, (i + 1) / 5], [0, 1], clamp);
        return (
          <svg
            key={i}
            width={34}
            height={34}
            viewBox="0 0 24 24"
            style={{ opacity: 0.25 + on * 0.75 }}
          >
            <path
              d="M12 2l3 6.5 7 .9-5.2 4.9 1.4 7L12 17.8 5.8 21.3l1.4-7L2 9.4l7-.9z"
              fill="#f5a623"
            />
          </svg>
        );
      })}
    </div>
  </div>
);

export const HighlightsScene: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tt = ease(interpolate(f, [8, 38], [0, 1], clamp));
  const items: {
    title: string;
    text: string;
    visual: (p: number) => React.ReactNode;
    label?: (p: number) => string;
  }[] = [
    { ...HIGHLIGHTS.receipt, visual: (p) => <Receipt p={p} /> },
    {
      ...HIGHLIGHTS.battery,
      visual: (p) => <Battery p={p} />,
      label: (p) => `${Math.round(p * 100)}%`,
    },
    { ...HIGHLIGHTS.looks, visual: (p) => <Looks p={p} /> },
  ];
  return (
    <AbsoluteFill style={{ fontFamily: "Inter", alignItems: "center" }}>
      <div
        style={{
          marginTop: 190,
          fontWeight: 800,
          fontSize: 92,
          letterSpacing: -2.5,
          textAlign: "center",
          color: COLORS.ink,
          opacity: tt,
          transform: `translateY(${(1 - tt) * 30}px)`,
        }}
      >
        {HIGHLIGHTS_TITLE}
      </div>
      <div
        style={{
          marginTop: 80,
          display: "flex",
          flexDirection: "column",
          gap: 36,
        }}
      >
        {items.map((it, i) => {
          const start = 35 + i * 70;
          const s = spring({
            frame: f - start,
            fps,
            config: { damping: 18, stiffness: 110 },
          });
          const prog = interpolate(f, [start + 15, start + 75], [0, 1], {
            ...clamp,
            easing: Easing.out(Easing.cubic),
          });
          return (
            <div
              key={it.title}
              style={{
                width: 920,
                height: 380,
                display: "flex",
                alignItems: "center",
                gap: 50,
                padding: "0 56px",
                boxSizing: "border-box",
                borderRadius: 48,
                background: "rgba(255,255,255,0.94)",
                border: `2px solid ${COLORS.line}`,
                boxShadow:
                  "0 30px 70px rgba(0,0,0,0.10), 0 4px 14px rgba(0,0,0,0.05)",
                opacity: s,
                transform: `translateY(${(1 - s) * 90}px) scale(${interpolate(s, [0, 1], [0.94, 1])})`,
              }}
            >
              <div
                style={{
                  flex: "none",
                  width: 250,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                  gap: 14,
                }}
              >
                {it.visual(prog)}
                {it.label ? (
                  <div style={{ fontWeight: 800, fontSize: 44, color: GREEN }}>
                    {it.label(prog)}
                  </div>
                ) : null}
              </div>
              <div>
                <div
                  style={{
                    fontWeight: 800,
                    fontSize: 56,
                    letterSpacing: -1.2,
                    color: COLORS.ink,
                  }}
                >
                  {it.title}
                </div>
                <div
                  style={{
                    marginTop: 14,
                    fontWeight: 400,
                    fontSize: 36,
                    lineHeight: 1.3,
                    color: COLORS.soft,
                  }}
                >
                  {it.text}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
