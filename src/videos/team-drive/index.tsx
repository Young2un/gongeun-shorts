import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import React from "react";
import { AbsoluteFill } from "remotion";
import { Bgm } from "../../components/Bgm";
import { Scene1Hook } from "./scenes/Scene1Hook";
import { Scene2AutoParty } from "./scenes/Scene2AutoParty";
import { Scene3Reputation } from "./scenes/Scene3Reputation";
import { Scene4FinalTrial } from "./scenes/Scene4FinalTrial";
import { Scene5Rewards } from "./scenes/Scene5Rewards";
import { Scene6Schedule } from "./scenes/Scene6Schedule";
import { Scene7Opinion } from "./scenes/Scene7Opinion";
import { ChannelOutro } from "../../shared/ChannelOutro";
import { COLORS, TRANSITION_FRAMES } from "../../theme";
import {
  fallbackTimings,
  totalDurationInFrames,
  type VideoProps,
} from "../../timing";
import { VIDEO } from "./meta";

/** 0.4초 slide-left — 새 장면이 오른쪽에서 들어오며 화면이 왼쪽으로 밀린다. */
const slideLeft = (
  <TransitionSeries.Transition
    presentation={slide({ direction: "from-right" })}
    timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
  />
);

export const TeamDriveShorts: React.FC<VideoProps> = ({ scenes }) => {
  const timings =
    scenes.length === VIDEO.script.length ? scenes : fallbackTimings(VIDEO);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
      <TransitionSeries>
        <TransitionSeries.Sequence
          durationInFrames={timings[0].durationInFrames}
          name="1 · 훅"
        >
          <Scene1Hook
            audioFrames={timings[0].audioFrames}
            durationInFrames={timings[0].durationInFrames}
          />
        </TransitionSeries.Sequence>
        {slideLeft}

        <TransitionSeries.Sequence
          durationInFrames={timings[1].durationInFrames}
          name="2 · 자동 파티"
        >
          <Scene2AutoParty
            audioFrames={timings[1].audioFrames}
            durationInFrames={timings[1].durationInFrames}
          />
        </TransitionSeries.Sequence>
        {slideLeft}

        <TransitionSeries.Sequence
          durationInFrames={timings[2].durationInFrames}
          name="3 · 명성 보너스"
        >
          <Scene3Reputation
            audioFrames={timings[2].audioFrames}
            durationInFrames={timings[2].durationInFrames}
          />
        </TransitionSeries.Sequence>
        {slideLeft}

        <TransitionSeries.Sequence
          durationInFrames={timings[3].durationInFrames}
          name="4 · 최후의 시련"
        >
          <Scene4FinalTrial
            audioFrames={timings[3].audioFrames}
            durationInFrames={timings[3].durationInFrames}
          />
        </TransitionSeries.Sequence>
        {slideLeft}

        <TransitionSeries.Sequence
          durationInFrames={timings[4].durationInFrames}
          name="5 · 보상"
        >
          <Scene5Rewards
            audioFrames={timings[4].audioFrames}
            durationInFrames={timings[4].durationInFrames}
          />
        </TransitionSeries.Sequence>
        {slideLeft}

        <TransitionSeries.Sequence
          durationInFrames={timings[5].durationInFrames}
          name="6 · 일정 · 설정"
        >
          <Scene6Schedule
            audioFrames={timings[5].audioFrames}
            durationInFrames={timings[5].durationInFrames}
          />
        </TransitionSeries.Sequence>
        {slideLeft}

        <TransitionSeries.Sequence
          durationInFrames={timings[6].durationInFrames}
          name="7 · 내 생각"
        >
          <Scene7Opinion
            audioFrames={timings[6].audioFrames}
            durationInFrames={timings[6].durationInFrames}
          />
        </TransitionSeries.Sequence>
        {slideLeft}

        <TransitionSeries.Sequence
          durationInFrames={timings[7].durationInFrames}
          name="8 · 채널 홍보 (아웃트로)"
        >
          <ChannelOutro
            videoId={VIDEO.id}
            audioFrames={timings[7].audioFrames}
            durationInFrames={timings[7].durationInFrames}
          />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      <Bgm scenes={timings} totalFrames={totalDurationInFrames(timings)} />
    </AbsoluteFill>
  );
};
