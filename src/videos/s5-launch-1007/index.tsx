import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import React from "react";
import { AbsoluteFill } from "remotion";
import { Bgm } from "../../components/Bgm";
import { ChannelOutro } from "../../shared/ChannelOutro";
import { COLORS, TRANSITION_FRAMES } from "../../theme";
import {
  fallbackTimings,
  totalDurationInFrames,
  type SceneProps,
  type VideoProps,
} from "../../timing";
import { VIDEO } from "./meta";
import { Scene1Unvaulted } from "./scenes/Scene1Unvaulted";
import { Scene2Progress } from "./scenes/Scene2Progress";
import { Scene3Excluded } from "./scenes/Scene3Excluded";
import { Scene4BattlePass } from "./scenes/Scene4BattlePass";
import { Scene5Doctrine } from "./scenes/Scene5Doctrine";
import { Scene6Halloween } from "./scenes/Scene6Halloween";
import { Scene7Schedule } from "./scenes/Scene7Schedule";
import { Scene8Competitive } from "./scenes/Scene8Competitive";
import { Scene9Queue } from "./scenes/Scene9Queue";
import { Scene10Opinion } from "./scenes/Scene10Opinion";
import { RichContext } from "../../shared/blocks";

/** 장면 순서 — Root.tsx 의 장면별 컴포지션도 이 배열을 쓴다 */
export const SCENES: readonly {
  readonly id: string;
  readonly name: string;
  readonly Component: React.FC<SceneProps>;
}[] = [
  { id: "S5-1-Unvaulted", name: "1 · 재출시 패스", Component: Scene1Unvaulted },
  { id: "S5-2-Progress", name: "2 · 진행 방식", Component: Scene2Progress },
  { id: "S5-3-Excluded", name: "3 · 빠지는 보상", Component: Scene3Excluded },
  { id: "S5-4-BattlePass", name: "4 · 배틀 패스", Component: Scene4BattlePass },
  { id: "S5-5-Doctrine", name: "5 · 독트린 · 그림스뵈튼", Component: Scene5Doctrine },
  { id: "S5-6-Halloween", name: "6 · 할로윈 모드", Component: Scene6Halloween },
  { id: "S5-7-Schedule", name: "7 · 기간 한정", Component: Scene7Schedule },
  { id: "S5-8-Competitive", name: "8 · 경쟁전", Component: Scene8Competitive },
  { id: "S5-9-Queue", name: "9 · 편의 · 대기열", Component: Scene9Queue },
  { id: "S5-10-Opinion", name: "10 · 개인 의견", Component: Scene10Opinion },
];

/** 0.4초 slide-left — 새 장면이 오른쪽에서 들어오며 화면이 왼쪽으로 밀린다. */
const slideLeft = (
  <TransitionSeries.Transition
    presentation={slide({ direction: "from-right" })}
    timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
  />
);

/** 5시즌 어둠의 신조 변경 정리 */
export const S5Launch1007: React.FC<VideoProps> = ({ scenes }) => {
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
export const S5Launch1007Rich = withRich(S5Launch1007, "S5Launch1007Rich");

/** 화려한 판 장면별 컴포지션 (Studio 미리보기용) */
export const RICH_SCENES = SCENES.map((scene) => ({
  id: scene.id.replace("S5-", "S5R-"),
  name: scene.name,
  Component: withRich(scene.Component, `${scene.id}-Rich`),
}));
