import "./index.css";
import { Composition } from "remotion";
import { MyComposition } from "./Composition";
import { Video01 } from "./byker/Video01";
import { V01_TOTAL } from "./byker/video01";
import { Video02 } from "./byker/Video02";
import { V02_TOTAL } from "./byker/video02";
import { Video03 } from "./byker/Video03";
import { V03_TOTAL } from "./byker/video03";
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
    </>
  );
};
