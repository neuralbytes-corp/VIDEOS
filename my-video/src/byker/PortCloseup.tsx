import React from "react";

export type Model = "14" | "15";

// Acabados oscuros: acero negro espacial (14 Pro) y titanio negro (15 Pro).
const RAIL: Record<Model, string> = {
  "14": "linear-gradient(135deg,#7a7883 0%,#2d2c33 20%,#0e0e11 50%,#2d2c33 80%,#7a7883 100%)",
  "15": "linear-gradient(135deg,#66666b 0%,#252528 22%,#101012 50%,#2b2b2e 78%,#68686d 100%)",
};

// Primer plano del borde inferior: parrillas de altavoz + puerto (Lightning / USB-C).
export const PortCloseup: React.FC<{ model: Model; width?: number }> = ({
  model,
  width = 900,
}) => {
  const s = width / 900;
  const grill = (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(6, 1fr)",
        gap: 14 * s,
      }}
    >
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          style={{
            width: 18 * s,
            height: 18 * s,
            borderRadius: "50%",
            background: "#000",
            boxShadow:
              "inset 0 1px 2px rgba(0,0,0,0.9), 0 1px 0 rgba(255,255,255,0.28)",
          }}
        />
      ))}
    </div>
  );
  const screw = (
    <div
      style={{
        width: 20 * s,
        height: 20 * s,
        borderRadius: "50%",
        background: "radial-gradient(circle at 40% 35%,#77777f,#1a1a1e)",
        boxShadow: "0 1px 0 rgba(255,255,255,0.3)",
      }}
    />
  );
  const usbc = model === "15";
  const pw = (usbc ? 250 : 190) * s;
  const ph = (usbc ? 66 : 44) * s;
  return (
    <div
      style={{
        width,
        height: 200 * s,
        borderRadius: 100 * s,
        background: RAIL[model],
        boxShadow: `0 ${30 * s}px ${60 * s}px rgba(0,0,0,0.6), inset 0 0 0 ${2 * s}px rgba(255,255,255,0.3)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 34 * s,
      }}
    >
      {grill}
      {screw}
      <div
        style={{
          width: pw,
          height: ph,
          borderRadius: ph / 2,
          background: "#000",
          boxShadow: `inset 0 ${3 * s}px ${8 * s}px rgba(0,0,0,0.95), 0 1px 0 rgba(255,255,255,0.35)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {usbc ? (
          <div
            style={{
              width: "82%",
              height: 12 * s,
              borderRadius: 6 * s,
              background: "linear-gradient(180deg,#9a9aa4,#55555e)",
            }}
          />
        ) : (
          <div
            style={{
              width: "86%",
              height: 7 * s,
              borderRadius: 3 * s,
              background:
                "repeating-linear-gradient(90deg,#b9a35a 0 7px,#05050a 7px 15px)",
            }}
          />
        )}
      </div>
      {screw}
      {grill}
    </div>
  );
};
