import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import React from "react";
import { AbsoluteFill } from "remotion";
import { Bgm } from "../../components/Bgm";
import { RichContext } from "../../shared/blocks";
import { ChannelOutro } from "../../shared/ChannelOutro";
import { COLORS, TRANSITION_FRAMES } from "../../theme";
import {
  fallbackTimings,
  totalDurationInFrames,
  type SceneProps,
  type VideoProps,
} from "../../timing";
import { VIDEO } from "./meta";
import { Scene1Hook } from "./scenes/Scene1Hook";
import { Scene2Hitbox } from "./scenes/Scene2Hitbox";
import { Scene3Hitscan } from "./scenes/Scene3Hitscan";
import { Scene4Doctrine } from "./scenes/Scene4Doctrine";
import { Scene5DoctrineDetail } from "./scenes/Scene5DoctrineDetail";
import { Scene6Cassidy } from "./scenes/Scene6Cassidy";
import { Scene7Genji } from "./scenes/Scene7Genji";
import { Scene8Bundle } from "./scenes/Scene8Bundle";
import { Scene9Perks } from "./scenes/Scene9Perks";
import { Scene10Roadhog } from "./scenes/Scene10Roadhog";
import { Scene11Compactor } from "./scenes/Scene11Compactor";
import { Scene12Sombra } from "./scenes/Scene12Sombra";
import { Scene13SombraCost } from "./scenes/Scene13SombraCost";
import { Scene14Opinion } from "./scenes/Scene14Opinion";

/** 장면 순서 — Root.tsx 의 장면별 컴포지션도 이 배열을 쓴다 */
export const SCENES: readonly {
  readonly id: string;
  readonly name: string;
  readonly Component: React.FC<SceneProps>;
}[] = [
  { id: "S5H-1-Hook", name: "1 · 루시우 타점", Component: Scene1Hook },
  { id: "S5H-2-Hitbox", name: "2 · 타점 34명", Component: Scene2Hitbox },
  { id: "S5H-3-Hitscan", name: "3 · 히트스캔", Component: Scene3Hitscan },
  { id: "S5H-4-Doctrine", name: "4 · 독트린", Component: Scene4Doctrine },
  { id: "S5H-5-DoctrineDetail", name: "5 · 독트린 세부", Component: Scene5DoctrineDetail },
  { id: "S5H-6-Cassidy", name: "6 · 캐서디 조합", Component: Scene6Cassidy },
  { id: "S5H-7-Genji", name: "7 · 겐지", Component: Scene7Genji },
  { id: "S5H-8-Bundle", name: "8 · 수치 묶음", Component: Scene8Bundle },
  { id: "S5H-9-Perks", name: "9 · 특전 교체", Component: Scene9Perks },
  { id: "S5H-10-Roadhog", name: "10 · 로드호그", Component: Scene10Roadhog },
  { id: "S5H-11-Compactor", name: "11 · 쓰레기 압축기", Component: Scene11Compactor },
  { id: "S5H-12-Sombra", name: "12 · 솜브라", Component: Scene12Sombra },
  { id: "S5H-13-SombraCost", name: "13 · 솜브라 대가", Component: Scene13SombraCost },
  { id: "S5H-14-Opinion", name: "14 · 개인 의견", Component: Scene14Opinion },
];

/** 0.4초 slide-left — 새 장면이 오른쪽에서 들어오며 화면이 왼쪽으로 밀린다. */
const slideLeft = (
  <TransitionSeries.Transition
    presentation={slide({ direction: "from-right" })}
    timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
  />
);

/** 5시즌 영웅 변경 정리 */
export const S5Heroes1007: React.FC<VideoProps> = ({ scenes }) => {
  const timings =
    scenes.length === VIDEO.script.length ? scenes : fallbackTimings(VIDEO);
  const last = timings[timings.length - 1];

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
      <TransitionSeries>
        {SCENES.map((scene, i) => (
          <React.Fragment key={scene.id}>
            <TransitionSeries.Sequence
              durationInFrames={timings[i].durationInFrames}
              name={scene.name}
            >
              <scene.Component
                audioFrames={timings[i].audioFrames}
                durationInFrames={timings[i].durationInFrames}
              />
            </TransitionSeries.Sequence>
            {slideLeft}
          </React.Fragment>
        ))}

        <TransitionSeries.Sequence
          durationInFrames={last.durationInFrames}
          name="채널 홍보 (아웃트로)"
        >
          <ChannelOutro
            videoId={VIDEO.id}
            audioFrames={last.audioFrames}
            durationInFrames={last.durationInFrames}
          />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      <Bgm scenes={timings} totalFrames={totalDurationInFrames(timings)} />
    </AbsoluteFill>
  );
};

/** 같은 장면을 키아트 배경(화려한 판)으로 감싼다 */
const withRich = <P extends object>(Component: React.FC<P>, name: string) => {
  const Rich: React.FC<P> = (props) => (
    <RichContext.Provider value={true}>
      <Component {...props} />
    </RichContext.Provider>
  );
  Rich.displayName = name;
  return Rich;
};

/** 화려한 판 — 장면마다 공식 키아트를 화면 전체에 깐다. 대본·음성·자막은 같다 */
export const S5Heroes1007Rich = withRich(S5Heroes1007, "S5Heroes1007Rich");

/** 화려한 판 장면별 컴포지션 (Studio 미리보기용) */
export const RICH_SCENES = SCENES.map((scene) => ({
  id: scene.id.replace("S5H-", "S5HR-"),
  name: scene.name,
  Component: withRich(scene.Component, `${scene.id}-Rich`),
}));
