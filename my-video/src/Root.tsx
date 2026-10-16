import "./index.css";
import { Composition } from "remotion";
import { MyComposition } from "./Composition";
import { Video01 } from "./byker/Video01";
import { V01_TOTAL } from "./byker/video01";
import { Video02 } from "./byker/Video02";
import { V02_TOTAL } from "./byker/video02";
import { Video03 } from "./byker/Video03";
import { V03_TOTAL } from "./byker/video03";
import { Video04 } from "./byker/Video04";
import { V04_TOTAL } from "./byker/video04";
import { Video05 } from "./byker/Video05";
import { V05_TOTAL } from "./byker/video05";
import { Video06 } from "./byker/Video06";
import { V06_TOTAL } from "./byker/video06";
import { Video07 } from "./byker/Video07";
import { V07_TOTAL } from "./byker/video07";
import { Video08 } from "./byker/Video08";
import { V08_TOTAL } from "./byker/video08";
import { Video09 } from "./byker/Video09";
import { V09_TOTAL } from "./byker/video09";
import { Carousel09 } from "./byker/Carousel09";
import { VE09_TOTAL, VideoEtiquetas09 } from "./byker/VideoEtiquetas09";
import { Video09B, V09B_TOTAL } from "./byker/Video09B";
import { Carousel04 } from "./byker/Carousel04";
import { Video07B, V07B_TOTAL } from "./byker/Video07B";
import { Video07C, V07C_TOTAL } from "./byker/Video07C";
import { BykerStore } from "./byker/BykerStore";
import { FPS, HEIGHT, TOTAL_FRAMES, WIDTH } from "./byker/config";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MyComp"
        component={MyComposition}
        durationInFrames={1001}
        fps={30}
        width={720}
        height={1280}
      />
      <Composition
        id="BykerStore"
        component={BykerStore}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="Video01Proceso"
        component={Video01}
        durationInFrames={V01_TOTAL}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="Video02Comparativa"
        component={Video02}
        durationInFrames={V02_TOTAL}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="Video03ListaBlanca"
        component={Video03}
        durationInFrames={V03_TOTAL}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="Video04Bateria"
        component={Video04}
        durationInFrames={V04_TOTAL}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="Video05UsosUGC"
        component={Video05}
        durationInFrames={V05_TOTAL}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="Video06Cinematico"
        component={Video06}
        durationInFrames={V06_TOTAL}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="Video07Hype"
        component={Video07}
        durationInFrames={V07_TOTAL}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="Video08Checklist"
        component={Video08}
        durationInFrames={V08_TOTAL}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="Video09Presupuesto"
        component={Video09}
        durationInFrames={V09_TOTAL}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="Carrusel09"
        component={Carousel09}
        durationInFrames={1}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{ i: 0 }}
      />
      <Composition
        id="Video09Etiquetas"
        component={VideoEtiquetas09}
        durationInFrames={VE09_TOTAL}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="Video09Cartel"
        component={Video09B}
        durationInFrames={V09B_TOTAL}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="Carrusel04"
        component={Carousel04}
        durationInFrames={1}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{ i: 0 }}
      />
      <Composition
        id="Video07Estetica"
        component={Video07B}
        durationInFrames={V07B_TOTAL}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="Video07Pro"
        component={Video07C}
        durationInFrames={V07C_TOTAL}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
    </>
  );
};
