import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { FPS } from "./config";
import {
  V05_CAPTIONS,
  V05_CTA_TITLE,
  V05_MUSIC_FILE,
  V05_MUSIC_VOLUME,
  V05_SCENES,
  V05_TAG,
  V05_TOTAL,
} from "./video05";
import { Scene } from "./BykerStore";
import { CtaScene, DarkBackground, GREEN, Photo } from "./Video02";
import { LineIcon } from "./Icons";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const YELLOW = "#ffd60a";
const HEAD = "Oswald, sans-serif";
const BODY = "Montserrat, sans-serif";

// ---------- Fondo "lifestyle": degradado cálido/frío con bokeh ----------
const BOKEH = [
  [14, 22, 260],
  [78, 12, 200],
  [88, 46, 320],
  [8, 62, 240],
  [62, 82, 280],
  [30, 90, 200],
  [50, 36, 150],
];
const ShotBG: React.FC<{ a: string; b: string }> = ({ a, b }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: `linear-gradient(160deg,${a},${b})` }}>
      {BOKEH.map(([x, y, s], i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${x}%`,
            top: `${y + Math.sin((f + i * 20) / 50) * 1.5}%`,
            width: s,
            height: s,
            borderRadius: "50%",
            background:
              "radial-gradient(circle,rgba(255,255,255,0.14) 0%,rgba(255,255,255,0.08) 55%,rgba(255,255,255,0) 72%)",
          }}
        />
      ))}
      <AbsoluteFill style={{ background: "rgba(0,0,0,0.22)" }} />
    </AbsoluteFill>
  );
};

// ---------- Marco de iPhone con pantalla personalizada ----------
const PhoneFrame: React.FC<{ width?: number; children: React.ReactNode }> = ({
  width = 560,
  children,
}) => {
  const s = width / 520;
  const H = 1060 * s;
  const R = 86 * s;
  return (
    <div style={{ position: "relative", width, height: H }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: R,
          background:
            "linear-gradient(135deg,#7a7883 0%,#2d2c33 18%,#0e0e11 50%,#2d2c33 82%,#7a7883 100%)",
          boxShadow: `0 ${60 * s}px ${110 * s}px rgba(0,0,0,0.55), inset 0 0 0 ${2 * s}px rgba(255,255,255,0.3)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 9 * s,
          borderRadius: R - 9 * s,
          background: "#000",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 22 * s,
          borderRadius: R - 22 * s,
          overflow: "hidden",
          background: "#000",
        }}
      >
        {children}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(115deg,rgba(255,255,255,0.14) 0%,rgba(255,255,255,0) 30%)",
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          top: 38 * s,
          left: "50%",
          marginLeft: -76 * s,
          width: 152 * s,
          height: 44 * s,
          borderRadius: 22 * s,
          background: "#000",
        }}
      />
    </div>
  );
};

// ---------- Subtítulo estilo TikTok ----------
const Caption: React.FC<{ lines: string[] }> = ({ lines }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div
      style={{
        position: "absolute",
        bottom: 140,
        width: "100%",
        textAlign: "center",
        fontFamily: HEAD,
        fontWeight: 700,
        fontSize: 92,
        lineHeight: 1.02,
        textTransform: "uppercase",
        letterSpacing: 1,
      }}
    >
      {lines.map((l, i) => {
        const s = spring({
          frame: f - (8 + i * 9),
          fps,
          config: { damping: 10, stiffness: 190, mass: 0.7 },
        });
        return (
          <div
            key={l}
            style={{
              color: i === lines.length - 1 ? YELLOW : "#fff",
              WebkitTextStroke: "9px #000",
              paintOrder: "stroke fill",
              textShadow: "0 8px 24px rgba(0,0,0,0.55)",
              transform: `scale(${interpolate(s, [0, 1], [1.8, 1])})`,
              opacity: Math.min(1, s * 2),
            }}
          >
            {l}
          </div>
        );
      })}
    </div>
  );
};

// ---------- Marca superior de cada toma ----------
const Tag: React.FC = () => (
  <div
    style={{
      position: "absolute",
      top: 70,
      left: 50,
      padding: "14px 30px",
      borderRadius: 999,
      background: "rgba(0,0,0,0.55)",
      border: "2px solid rgba(255,255,255,0.35)",
      fontFamily: BODY,
      fontWeight: 600,
      fontSize: 30,
      color: "#fff",
    }}
  >
    {V05_TAG}
  </div>
);

// Toma genérica: fondo + "golpe" de zoom al inicio + etiqueta + subtítulo
const Shot: React.FC<{
  a: string;
  b: string;
  caption: string[];
  children: React.ReactNode;
}> = ({ a, b, caption, children }) => {
  const f = useCurrentFrame();
  const punch = interpolate(f, [0, 12], [1.08, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  return (
    <AbsoluteFill>
      <ShotBG a={a} b={b} />
      <AbsoluteFill style={{ transform: `scale(${punch})` }}>
        {children}
      </AbsoluteFill>
      <Tag />
      <Caption lines={caption} />
    </AbsoluteFill>
  );
};

const Centered: React.FC<{ children: React.ReactNode; top?: number }> = ({
  children,
  top = 190,
}) => (
  <AbsoluteFill style={{ alignItems: "center" }}>
    <div style={{ marginTop: top }}>{children}</div>
  </AbsoluteFill>
);

// ---------- 1. Gancho ----------
const HookShot: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({
    frame: f - 4,
    fps,
    config: { damping: 14, stiffness: 90 },
  });
  return (
    <Shot a="#241608" b="#0a0603" caption={V05_CAPTIONS.hook}>
      <Centered top={130}>
        <div
          style={{
            transform: `translateY(${(1 - s) * 300 + Math.sin(f / 22) * 10}px) rotate(${interpolate(s, [0, 1], [-8, 0])}deg)`,
            opacity: s,
          }}
        >
          <Photo model="14" width={620} />
        </div>
      </Centered>
    </Shot>
  );
};

// ---------- 2. Cámara ----------
const CameraShot: React.FC = () => {
  const f = useCurrentFrame();
  const focus = interpolate(f, [20, 40], [1.6, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const flash = interpolate(f, [88, 91, 102], [0, 0.9, 0], clamp);
  const zoom = interpolate(f, [30, 85], [1, 1.35], clamp);
  const pill = (t: string, on: boolean) => (
    <div
      key={t}
      style={{
        padding: "8px 18px",
        borderRadius: 999,
        background: on ? YELLOW : "rgba(0,0,0,0.5)",
        color: on ? "#000" : "#fff",
        fontFamily: BODY,
        fontWeight: 700,
        fontSize: 26,
      }}
    >
      {t}
    </div>
  );
  return (
    <Shot a="#0f2a44" b="#05101c" caption={V05_CAPTIONS.camera}>
      <Centered>
        <PhoneFrame width={560}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              overflow: "hidden",
              transform: `scale(${zoom})`,
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(180deg,#59a8e8 0%,#f7c27a 55%,#e07a4a 100%)",
              }}
            />
            {[
              [0, 520, 90, 300],
              [90, 460, 80, 360],
              [170, 540, 110, 280],
              [280, 440, 70, 380],
              [350, 500, 100, 320],
              [450, 470, 90, 350],
            ].map(([x, y, w, h], i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: x,
                  top: y,
                  width: w,
                  height: h + 600,
                  background: "rgba(40,50,80,0.75)",
                }}
              />
            ))}
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "42%",
                width: 150,
                height: 150,
                marginLeft: -75,
                marginTop: -75,
                border: `4px solid ${YELLOW}`,
                transform: `scale(${focus})`,
                opacity: f > 18 ? 1 : 0,
              }}
            />
          </div>
          <div
            style={{
              position: "absolute",
              bottom: 150,
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "center",
              gap: 14,
            }}
          >
            {pill("0.5", false)}
            {pill("1x", false)}
            {pill("3x", zoom > 1.15)}
          </div>
          <div
            style={{
              position: "absolute",
              bottom: 40,
              left: "50%",
              marginLeft: -48,
              width: 96,
              height: 96,
              borderRadius: 48,
              border: "6px solid #fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 70,
                height: 70,
                borderRadius: 35,
                background: "#fff",
              }}
            />
          </div>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "#fff",
              opacity: flash,
            }}
          />
        </PhoneFrame>
      </Centered>
    </Shot>
  );
};

// ---------- 3. Redes / scroll ----------
const FeedShot: React.FC = () => {
  const f = useCurrentFrame();
  const CARD = 900;
  const off = (f * 11) % (CARD + 20);
  const cols = [
    ["#ff7a59", "#7a2dff"],
    ["#19c6a7", "#1c4fff"],
    ["#ffcf3f", "#ff3d81"],
    ["#8bd3ff", "#5b2ad6"],
  ];
  return (
    <Shot a="#2a0f3a" b="#0b0414" caption={V05_CAPTIONS.feed}>
      <Centered>
        <PhoneFrame width={560}>
          <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
            {cols.map(([c1, c2], i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: i * (CARD + 20) - off,
                  height: CARD,
                  background: `linear-gradient(160deg,${c1},${c2})`,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    right: 24,
                    bottom: 200,
                    display: "flex",
                    flexDirection: "column",
                    gap: 26,
                  }}
                >
                  {[0, 1, 2].map((k) => (
                    <div
                      key={k}
                      style={{
                        width: 64,
                        height: 64,
                        borderRadius: 32,
                        background: "rgba(255,255,255,0.85)",
                      }}
                    />
                  ))}
                </div>
                <div
                  style={{
                    position: "absolute",
                    left: 28,
                    bottom: 90,
                    width: 220,
                    height: 18,
                    borderRadius: 9,
                    background: "rgba(255,255,255,0.9)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    left: 28,
                    bottom: 56,
                    width: 340,
                    height: 14,
                    borderRadius: 7,
                    background: "rgba(255,255,255,0.55)",
                  }}
                />
              </div>
            ))}
          </div>
        </PhoneFrame>
      </Centered>
    </Shot>
  );
};

// ---------- 4. Video selfie ----------
const SelfieShot: React.FC = () => {
  const f = useCurrentFrame();
  const sec = Math.floor(f / FPS);
  const blink = Math.floor(f / 15) % 2 === 0;
  const sway = Math.sin(f / 18) * 14;
  return (
    <Shot a="#3a2a1a" b="#120c06" caption={V05_CAPTIONS.selfie}>
      <Centered>
        <PhoneFrame width={560}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(180deg,#d9b48a 0%,#8a6a4a 100%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: 330,
              marginLeft: -150 + sway,
              width: 300,
              height: 300,
              borderRadius: "50%",
              background: "#c98f6a",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: 590,
              marginLeft: -270 + sway,
              width: 540,
              height: 500,
              borderRadius: "50% 50% 0 0",
              background: "#6c7480",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 120,
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 14,
            }}
          >
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: 11,
                background: "#ff3b30",
                opacity: blink ? 1 : 0.25,
              }}
            />
            <div
              style={{
                fontFamily: BODY,
                fontWeight: 700,
                fontSize: 34,
                color: "#fff",
              }}
            >
              00:{String(sec).padStart(2, "0")}
            </div>
          </div>
          <div
            style={{
              position: "absolute",
              bottom: 40,
              left: "50%",
              marginLeft: -48,
              width: 96,
              height: 96,
              borderRadius: 48,
              border: "6px solid #fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                background: "#ff3b30",
              }}
            />
          </div>
        </PhoneFrame>
      </Centered>
    </Shot>
  );
};

// ---------- 5. Juegos (horizontal) ----------
// El contenido se dibuja en vertical y el marco se gira -90°: la derecha del dibujo queda arriba.
const GameShot: React.FC = () => {
  const f = useCurrentFrame();
  const lane = Math.sin(f / 14) * 70;
  const stripe = (f * 24) % 170;
  return (
    <Shot a="#0f3a2a" b="#04120c" caption={V05_CAPTIONS.game}>
      <AbsoluteFill style={{ alignItems: "center" }}>
        <div
          style={{
            marginTop: 330,
            transform: "rotate(-90deg) scale(0.9)",
            width: 560,
            height: 1142,
          }}
        >
          <PhoneFrame width={560}>
            <div
              style={{
                position: "absolute",
                inset: 0,
                overflow: "hidden",
                background:
                  "linear-gradient(270deg,#7fb6ff 0%,#2a5ca8 38%,#2c2c2e 38%,#3a3a3d 100%)",
              }}
            >
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: "31%",
                    marginLeft: -7,
                    width: 14,
                    height: 90,
                    background: "#ffd60a",
                    top: i * 170 - stripe,
                  }}
                />
              ))}
              <div
                style={{
                  position: "absolute",
                  left: `${31 + lane / 12}%`,
                  top: 640,
                  marginLeft: -50,
                  width: 100,
                  height: 190,
                  borderRadius: 26,
                  background: "linear-gradient(180deg,#ff6a5f,#b3211a)",
                  boxShadow: "0 18px 30px rgba(0,0,0,0.45)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: 120,
                  right: 40,
                  fontFamily: HEAD,
                  fontWeight: 700,
                  fontSize: 70,
                  color: "#fff",
                }}
              >
                {String(Math.floor(f * 13)).padStart(5, "0")}
              </div>
            </div>
          </PhoneFrame>
        </div>
      </AbsoluteFill>
    </Shot>
  );
};

// ---------- 6. Carga / batería 100% ----------
const ChargeShot: React.FC = () => {
  const f = useCurrentFrame();
  const p = interpolate(f, [10, 100], [0.8, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const R = 170;
  const C = 2 * Math.PI * R;
  return (
    <Shot a="#0e2e22" b="#04100b" caption={V05_CAPTIONS.charge}>
      <Centered top={150}>
        <PhoneFrame width={560}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              background: "#050505",
            }}
          >
            <div style={{ position: "relative", width: 420, height: 420 }}>
              <svg
                width={420}
                height={420}
                viewBox="0 0 420 420"
                style={{ transform: "rotate(-90deg)" }}
              >
                <circle
                  cx={210}
                  cy={210}
                  r={R}
                  fill="none"
                  stroke="rgba(255,255,255,0.12)"
                  strokeWidth={30}
                />
                <circle
                  cx={210}
                  cy={210}
                  r={R}
                  fill="none"
                  stroke={GREEN}
                  strokeWidth={30}
                  strokeLinecap="round"
                  strokeDasharray={C}
                  strokeDashoffset={C * (1 - p)}
                  style={{ filter: `drop-shadow(0 0 16px ${GREEN}aa)` }}
                />
              </svg>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: HEAD,
                  fontWeight: 700,
                  fontSize: 104,
                  color: "#fff",
                }}
              >
                {Math.round(p * 100)}%
              </div>
            </div>
            <div
              style={{
                marginTop: 30,
                display: "flex",
                alignItems: "center",
                gap: 10,
                fontFamily: BODY,
                fontWeight: 700,
                fontSize: 30,
                color: GREEN,
              }}
            >
              <LineIcon kind="plug" progress={1} size={44} color={GREEN} />
              Cargando
            </div>
          </div>
        </PhoneFrame>
      </Centered>
    </Shot>
  );
};

const shot = (
  key: keyof typeof V05_SCENES,
  node: React.ReactNode,
  fadeOut = 4,
) => (
  <Sequence
    key={key}
    from={V05_SCENES[key].from}
    durationInFrames={V05_SCENES[key].duration}
    premountFor={FPS}
  >
    <Scene
      duration={V05_SCENES[key].duration}
      fadeIn={key === "hook" ? 1 : 4}
      fadeOut={fadeOut}
    >
      {node}
    </Scene>
  </Sequence>
);

export const Video05: React.FC = () => (
  <AbsoluteFill>
    <DarkBackground />
    <Audio
      src={staticFile(V05_MUSIC_FILE)}
      volume={(f) =>
        V05_MUSIC_VOLUME *
        interpolate(f, [0, 8, V05_TOTAL - 45, V05_TOTAL], [0.3, 1, 1, 0], clamp)
      }
    />
    {shot("hook", <HookShot />)}
    {shot("camera", <CameraShot />)}
    {shot("feed", <FeedShot />)}
    {shot("selfie", <SelfieShot />)}
    {shot("game", <GameShot />)}
    {shot("charge", <ChargeShot />)}
    {shot("cta", <CtaScene title={V05_CTA_TITLE} />, 20)}
  </AbsoluteFill>
);
