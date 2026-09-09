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
  type VideoProps,
} from "../../timing";
import { VIDEO } from "./meta";
import { Scene1Headline } from "./scenes/Scene1Headline";
import { Scene2Delay } from "./scenes/Scene2Delay";
import { Scene3Program } from "./scenes/Scene3Program";
import { Scene4Questwatch } from "./scenes/Scene4Questwatch";
import { Scene5Opinion } from "./scenes/Scene5Opinion";

/** 0.4초 slide-left — 새 장면이 오른쪽에서 들어오며 화면이 왼쪽으로 밀린다. */
const slideLeft = (
  <TransitionSeries.Transition
    presentation={slide({ direction: "from-right" })}
    timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
  />
);

/** 블리즈컨 전 오버워치 소식 */
export const BlizzconNews: React.FC<VideoProps> = ({ scenes }) => {
  const timings =
    scenes.length === VIDEO.script.length ? scenes : fallbackTimings(VIDEO);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
      <TransitionSeries>
        <TransitionSeries.Sequence
          durationInFrames={timings[0].durationInFrames}
          name="1 · 훅"
        >
          <Scene1Headline
            audioFrames={timings[0].audioFrames}
            durationInFrames={timings[0].durationInFrames}
          />
        </TransitionSeries.Sequence>
        {slideLeft}

        <TransitionSeries.Sequence
          durationInFrames={timings[1].durationInFrames}
          name="2 · 출시 연기"
        >
          <Scene2Delay
            audioFrames={timings[1].audioFrames}
            durationInFrames={timings[1].durationInFrames}
          />
        </TransitionSeries.Sequence>
        {slideLeft}

        <TransitionSeries.Sequence
          durationInFrames={timings[2].durationInFrames}
          name="3 · 블리즈컨 예고"
        >
          <Scene3Program
            audioFrames={timings[2].audioFrames}
            durationInFrames={timings[2].durationInFrames}
          />
        </TransitionSeries.Sequence>
        {slideLeft}

        <TransitionSeries.Sequence
          durationInFrames={timings[3].durationInFrames}
          name="4 · 퀘스트워치"
        >
          <Scene4Questwatch
            audioFrames={timings[3].audioFrames}
            durationInFrames={timings[3].durationInFrames}
          />
        </TransitionSeries.Sequence>
        {slideLeft}

        <TransitionSeries.Sequence
          durationInFrames={timings[4].durationInFrames}
          name="5 · 내 생각"
        >
          <Scene5Opinion
            audioFrames={timings[4].audioFrames}
            durationInFrames={timings[4].durationInFrames}
          />
        </TransitionSeries.Sequence>
        {slideLeft}

        <TransitionSeries.Sequence
          durationInFrames={timings[timings.length - 1].durationInFrames}
          name="채널 홍보 (아웃트로)"
        >
          <ChannelOutro
            videoId={VIDEO.id}
            audioFrames={timings[timings.length - 1].audioFrames}
            durationInFrames={timings[timings.length - 1].durationInFrames}
          />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      <Bgm scenes={timings} totalFrames={totalDurationInFrames(timings)} />
    </AbsoluteFill>
  );
};
