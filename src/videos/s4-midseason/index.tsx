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
import { Scene1Intro } from "./scenes/Scene1Intro";
import { Scene2Event } from "./scenes/Scene2Event";
import { Scene3Tank } from "./scenes/Scene3Tank";
import { Scene4Damage } from "./scenes/Scene4Damage";
import { Scene5Support } from "./scenes/Scene5Support";
import { Scene6Fixes } from "./scenes/Scene6Fixes";

/** 0.4초 slide-left — 새 장면이 오른쪽에서 들어오며 화면이 왼쪽으로 밀린다. */
const slideLeft = (
  <TransitionSeries.Transition
    presentation={slide({ direction: "from-right" })}
    timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
  />
);

/** 시즌 4 중간 패치 */
export const S4Midseason: React.FC<VideoProps> = ({ scenes }) => {
  const timings =
    scenes.length === VIDEO.script.length ? scenes : fallbackTimings(VIDEO);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
      <TransitionSeries>
        <TransitionSeries.Sequence
          durationInFrames={timings[0].durationInFrames}
          name="1 · 훅"
        >
          <Scene1Intro
            audioFrames={timings[0].audioFrames}
            durationInFrames={timings[0].durationInFrames}
          />
        </TransitionSeries.Sequence>
        {slideLeft}

        <TransitionSeries.Sequence
          durationInFrames={timings[1].durationInFrames}
          name="2 · 이벤트"
        >
          <Scene2Event
            audioFrames={timings[1].audioFrames}
            durationInFrames={timings[1].durationInFrames}
          />
        </TransitionSeries.Sequence>
        {slideLeft}

        <TransitionSeries.Sequence
          durationInFrames={timings[2].durationInFrames}
          name="3 · 돌격"
        >
          <Scene3Tank
            audioFrames={timings[2].audioFrames}
            durationInFrames={timings[2].durationInFrames}
          />
        </TransitionSeries.Sequence>
        {slideLeft}

        <TransitionSeries.Sequence
          durationInFrames={timings[3].durationInFrames}
          name="4 · 공격"
        >
          <Scene4Damage
            audioFrames={timings[3].audioFrames}
            durationInFrames={timings[3].durationInFrames}
          />
        </TransitionSeries.Sequence>
        {slideLeft}

        <TransitionSeries.Sequence
          durationInFrames={timings[4].durationInFrames}
          name="5 · 지원"
        >
          <Scene5Support
            audioFrames={timings[4].audioFrames}
            durationInFrames={timings[4].durationInFrames}
          />
        </TransitionSeries.Sequence>
        {slideLeft}

        <TransitionSeries.Sequence
          durationInFrames={timings[5].durationInFrames}
          name="6 · 오류 수정"
        >
          <Scene6Fixes
            audioFrames={timings[5].audioFrames}
            durationInFrames={timings[5].durationInFrames}
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
