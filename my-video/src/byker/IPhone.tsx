import React from "react";
import { Img, staticFile } from "remotion";

// iPhone dibujado en CSS: marco de titanio, Dynamic Island, pantalla con logo.
export const IPhone: React.FC<{ width?: number }> = ({ width = 520 }) => {
  const s = width / 520;
  const H = 1060 * s;
  const R = 86 * s;
  return (
    <div style={{ position: "relative", width, height: H }}>
      {/* botones laterales */}
      {[
        { top: 200, h: 60, side: "left" },
        { top: 300, h: 110, side: "left" },
        { top: 430, h: 110, side: "left" },
        { top: 340, h: 170, side: "right" },
      ].map((b, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: b.top * s,
            height: b.h * s,
            width: 7 * s,
            [b.side]: -5 * s,
            borderRadius: 4 * s,
            background: "linear-gradient(90deg,#55555a,#2a2a2d)",
          }}
        />
      ))}
      {/* marco titanio */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: R,
          background:
            "linear-gradient(135deg,#8a8a90 0%,#3b3b3f 18%,#1b1b1d 50%,#3e3e42 82%,#8d8d93 100%)",
          boxShadow: `0 ${60 * s}px ${100 * s}px rgba(0,0,0,0.35), 0 ${18 * s}px ${30 * s}px rgba(0,0,0,0.25), inset 0 0 0 ${2 * s}px rgba(255,255,255,0.18)`,
        }}
      />
      {/* bisel negro */}
      <div
        style={{
          position: "absolute",
          inset: 9 * s,
          borderRadius: R - 9 * s,
          background: "#050506",
        }}
      />
      {/* pantalla */}
      <div
        style={{
          position: "absolute",
          inset: 20 * s,
          borderRadius: R - 20 * s,
          overflow: "hidden",
          background:
            "radial-gradient(120% 70% at 30% 0%,#2b2b31 0%,#0e0e11 55%,#000 100%)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 120 * s,
            width: "100%",
            textAlign: "center",
            color: "rgba(255,255,255,0.75)",
            fontFamily: "Inter",
            fontWeight: 600,
            fontSize: 30 * s,
          }}
        >
          Bienvenido
        </div>
        <div
          style={{
            position: "absolute",
            top: 160 * s,
            width: "100%",
            textAlign: "center",
            color: "#fff",
            fontFamily: "Inter",
            fontWeight: 700,
            fontSize: 150 * s,
            letterSpacing: -4 * s,
          }}
        >
          9:41
        </div>
        <Img
          src={staticFile("byker/logo.webp")}
          style={{
            position: "absolute",
            top: 380 * s,
            left: -20 * s,
            width: 500 * s,
            filter: "invert(1)",
            mixBlendMode: "screen",
            WebkitMaskImage:
              "radial-gradient(circle at 50% 50%,#000 45%,transparent 72%)",
          }}
        />
        {/* atajos inferiores */}
        {[60, 380].map((x) => (
          <div
            key={x}
            style={{
              position: "absolute",
              bottom: 90 * s,
              left: x * s,
              width: 80 * s,
              height: 80 * s,
              borderRadius: 40 * s,
              background: "rgba(255,255,255,0.14)",
            }}
          />
        ))}
        <div
          style={{
            position: "absolute",
            bottom: 18 * s,
            left: "50%",
            marginLeft: -85 * s,
            width: 170 * s,
            height: 6 * s,
            borderRadius: 3 * s,
            background: "rgba(255,255,255,0.85)",
          }}
        />
        {/* reflejo del cristal */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(115deg,rgba(255,255,255,0.14) 0%,rgba(255,255,255,0) 32%)",
          }}
        />
      </div>
      {/* Dynamic Island */}
      <div
        style={{
          position: "absolute",
          top: 36 * s,
          left: "50%",
          marginLeft: -78 * s,
          width: 156 * s,
          height: 46 * s,
          borderRadius: 23 * s,
          background: "#000",
        }}
      />
    </div>
  );
};
