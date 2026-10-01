import React from "react";

export type Model = "14" | "15";

// Dimensiones base (s = 1) -> 400 x 816, proporción real de un iPhone Pro de 6.1".
const BASE_W = 400;
const BASE_H = 816;

const LOOK = {
  // 14 Pro: acero inoxidable pulido, vidrio trasero esmerilado "Morado oscuro".
  "14": {
    rail: "linear-gradient(135deg,#f0eef5 0%,#8b8996 16%,#4a4857 40%,#2e2c38 55%,#7d7b88 82%,#e3e1ea 100%)",
    glass: "linear-gradient(160deg,#6b5f82 0%,#4a3f5f 45%,#352c47 100%)",
    plateau: "linear-gradient(160deg,#5b5072,#3a3050)",
    wall: "linear-gradient(160deg,#241a4a 0%,#6a3fb5 50%,#e07ab8 100%)",
    bezel: 8,
    lens: 78,
    action: false,
  },
  // 15 Pro: titanio natural cepillado, bordes más delgados, botón de acción.
  "15": {
    rail: "linear-gradient(135deg,#d9d3c6 0%,#9a9487 18%,#6e695f 45%,#8a847a 60%,#aaa396 82%,#ddd7ca 100%)",
    glass: "linear-gradient(160deg,#b4ae9f 0%,#9a9487 45%,#837d71 100%)",
    plateau: "linear-gradient(160deg,#a39d8f,#898374)",
    wall: "linear-gradient(160deg,#08263f 0%,#1f6fa8 50%,#8fd6f2 100%)",
    bezel: 6,
    lens: 75,
    action: true,
  },
} as const;

const SideButtons: React.FC<{ model: Model; s: number }> = ({ model, s }) => {
  const look = LOOK[model];
  const btn = (
    top: number,
    h: number,
    side: "left" | "right",
    key: string,
    r = 3,
  ) => (
    <div
      key={key}
      style={{
        position: "absolute",
        top: top * s,
        height: h * s,
        width: 6 * s,
        [side]: -4.5 * s,
        borderRadius: r * s,
        background: look.rail,
        boxShadow: "inset 0 0 2px rgba(0,0,0,0.5)",
      }}
    />
  );
  return (
    <>
      {look.action
        ? btn(148, 44, "left", "action", 3)
        : btn(160, 24, "left", "mute", 2)}
      {btn(216, 64, "left", "volup")}
      {btn(292, 64, "left", "voldown")}
      {btn(250, 104, "right", "power")}
    </>
  );
};

// Vista frontal con pantalla encendida.
export const PhoneFront: React.FC<{ model: Model; width?: number }> = ({
  model,
  width = BASE_W,
}) => {
  const s = width / BASE_W;
  const look = LOOK[model];
  const R = 66 * s;
  const b = look.bezel * s;
  const screenInset = 5 * s + b + 3 * s;
  return (
    <div style={{ position: "relative", width, height: BASE_H * s }}>
      <SideButtons model={model} s={s} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: R,
          background: look.rail,
          boxShadow: `0 ${50 * s}px ${90 * s}px rgba(0,0,0,0.38), 0 ${14 * s}px ${26 * s}px rgba(0,0,0,0.25), inset 0 0 0 ${1.5 * s}px rgba(255,255,255,0.35)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 5 * s,
          borderRadius: R - 5 * s,
          background: "#040405",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: screenInset,
          borderRadius: R - screenInset,
          overflow: "hidden",
          background: look.wall,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(70% 40% at 25% 18%,rgba(255,255,255,0.28),transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 92 * s,
            width: "100%",
            textAlign: "center",
            color: "rgba(255,255,255,0.85)",
            fontFamily: "Inter",
            fontWeight: 600,
            fontSize: 22 * s,
          }}
        >
          iPhone {model} Pro
        </div>
        <div
          style={{
            position: "absolute",
            top: 120 * s,
            width: "100%",
            textAlign: "center",
            color: "#fff",
            fontFamily: "Inter",
            fontWeight: 700,
            fontSize: 124 * s,
            letterSpacing: -4 * s,
          }}
        >
          9:41
        </div>
        {[44, 276].map((x) => (
          <div
            key={x}
            style={{
              position: "absolute",
              bottom: 64 * s,
              left: x * s,
              width: 56 * s,
              height: 56 * s,
              borderRadius: 28 * s,
              background: "rgba(0,0,0,0.30)",
              backdropFilter: "blur(8px)",
            }}
          />
        ))}
        <div
          style={{
            position: "absolute",
            bottom: 14 * s,
            left: "50%",
            marginLeft: -62 * s,
            width: 124 * s,
            height: 5 * s,
            borderRadius: 3 * s,
            background: "rgba(255,255,255,0.9)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(115deg,rgba(255,255,255,0.16) 0%,rgba(255,255,255,0) 30%)",
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          top: 26 * s,
          left: "50%",
          marginLeft: -58 * s,
          width: 116 * s,
          height: 34 * s,
          borderRadius: 17 * s,
          background: "#000",
        }}
      />
    </div>
  );
};

const Lens: React.FC<{ size: number }> = ({ size }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      background:
        "radial-gradient(circle at 35% 30%,#ececf2 0%,#9d9ca8 40%,#3a3944 75%,#1d1c24 100%)",
      boxShadow:
        "0 3px 8px rgba(0,0,0,0.55), inset 0 0 0 1.5px rgba(255,255,255,0.35)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <div
      style={{
        width: "76%",
        height: "76%",
        borderRadius: "50%",
        background:
          "radial-gradient(circle at 50% 50%,#05050a 0%,#0c0c16 60%,#17172a 100%)",
        boxShadow: "inset 0 0 8px rgba(0,0,0,0.9)",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: "18%",
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 38% 32%,rgba(120,140,255,0.55) 0%,rgba(50,40,120,0.35) 40%,transparent 70%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "22%",
          left: "28%",
          width: "14%",
          height: "14%",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.8)",
        }}
      />
    </div>
  </div>
);

// Vista trasera: vidrio, plataforma de cámaras triple, flash y LiDAR.
export const PhoneBack: React.FC<{ model: Model; width?: number }> = ({
  model,
  width = BASE_W,
}) => {
  const s = width / BASE_W;
  const look = LOOK[model];
  const R = 66 * s;
  const lens = look.lens * s;
  return (
    <div style={{ position: "relative", width, height: BASE_H * s }}>
      <SideButtons model={model} s={s} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: R,
          background: look.rail,
          boxShadow: `0 ${50 * s}px ${90 * s}px rgba(0,0,0,0.38), 0 ${14 * s}px ${26 * s}px rgba(0,0,0,0.25), inset 0 0 0 ${1.5 * s}px rgba(255,255,255,0.35)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 4 * s,
          borderRadius: R - 4 * s,
          background: look.glass,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(120deg,rgba(255,255,255,0.22) 0%,rgba(255,255,255,0) 35%,rgba(255,255,255,0.06) 100%)",
          }}
        />
        {/* plataforma de cámaras */}
        <div
          style={{
            position: "absolute",
            top: 14 * s,
            left: 14 * s,
            width: 188 * s,
            height: 188 * s,
            borderRadius: 46 * s,
            background: look.plateau,
            boxShadow: `0 ${6 * s}px ${14 * s}px rgba(0,0,0,0.45), inset 0 0 0 ${1.5 * s}px rgba(255,255,255,0.28)`,
          }}
        >
          <div style={{ position: "absolute", top: 12 * s, left: 12 * s }}>
            <Lens size={lens} />
          </div>
          <div style={{ position: "absolute", bottom: 12 * s, left: 12 * s }}>
            <Lens size={lens} />
          </div>
          <div style={{ position: "absolute", top: 57 * s, right: 12 * s }}>
            <Lens size={lens} />
          </div>
          {/* flash */}
          <div
            style={{
              position: "absolute",
              top: 18 * s,
              right: 20 * s,
              width: 26 * s,
              height: 26 * s,
              borderRadius: "50%",
              background:
                "radial-gradient(circle at 40% 35%,#fff8dc,#d9c98a 60%,#8c7f4a)",
              boxShadow: "inset 0 0 0 2px rgba(0,0,0,0.35)",
            }}
          />
          {/* LiDAR */}
          <div
            style={{
              position: "absolute",
              bottom: 18 * s,
              right: 20 * s,
              width: 26 * s,
              height: 26 * s,
              borderRadius: "50%",
              background: "radial-gradient(circle at 40% 35%,#222230,#050508)",
              boxShadow: "inset 0 0 0 2px rgba(255,255,255,0.18)",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 84 * s,
              right: 12 * s,
              width: 0,
            }}
          />
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 52 * s,
            width: "100%",
            textAlign: "center",
            fontFamily: "Inter",
            fontWeight: 600,
            fontSize: 17 * s,
            letterSpacing: 1 * s,
            color: "rgba(255,255,255,0.55)",
          }}
        >
          iPhone
        </div>
      </div>
    </div>
  );
};

// Primer plano del borde inferior: parrillas de altavoz + puerto.
export const PhoneBottom: React.FC<{ model: Model; width?: number }> = ({
  model,
  width = 900,
}) => {
  const s = width / 900;
  const look = LOOK[model];
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
            background: "#08080a",
            boxShadow:
              "inset 0 1px 2px rgba(0,0,0,0.9), 0 1px 0 rgba(255,255,255,0.25)",
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
        background: "radial-gradient(circle at 40% 35%,#6a6a72,#1a1a1e)",
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
        background: look.rail,
        boxShadow: `0 ${30 * s}px ${60 * s}px rgba(0,0,0,0.30), inset 0 0 0 ${2 * s}px rgba(255,255,255,0.35)`,
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
          background: "#050506",
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
