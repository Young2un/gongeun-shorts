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
import { Scene1Hook } from "./scenes/Scene1Hook";
import { Scene2Howto } from "./scenes/Scene2Howto";
import { Scene3Prize } from "./scenes/Scene3Prize";
import { Scene4Caution } from "./scenes/Scene4Caution";
import { Scene5Opinion } from "./scenes/Scene5Opinion";

/** 0.4초 slide-left — 새 장면이 오른쪽에서 들어오며 화면이 왼쪽으로 밀린다. */
const slideLeft = (
  <TransitionSeries.Transition
    presentation={slide({ direction: "from-right" })}
    timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
  />
);

/** 추석 「보름달에 소원 빌기」 댓글 이벤트 — 디몬 장패드 추첨 */
export const ChuseokDmon0917: React.FC<VideoProps> = ({ scenes }) => {
  const timings =
    scenes.length === VIDEO.script.length ? scenes : fallbackTimings(VIDEO);
  const outro = timings[timings.length - 1];

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
          name="2 · 기간과 방법"
        >
          <Scene2Howto
            audioFrames={timings[1].audioFrames}
            durationInFrames={timings[1].durationInFrames}
          />
        </TransitionSeries.Sequence>
        {slideLeft}

        <TransitionSeries.Sequence
          durationInFrames={timings[2].durationInFrames}
          name="3 · 경품"
        >
          <Scene3Prize
            audioFrames={timings[2].audioFrames}
            durationInFrames={timings[2].durationInFrames}
          />
        </TransitionSeries.Sequence>
        {slideLeft}

        <TransitionSeries.Sequence
          durationInFrames={timings[3].durationInFrames}
          name="4 · 주의사항"
        >
          <Scene4Caution
            audioFrames={timings[3].audioFrames}
            durationInFrames={timings[3].durationInFrames}
          />
        </TransitionSeries.Sequence>
        {slideLeft}

        <TransitionSeries.Sequence
          durationInFrames={timings[4].durationInFrames}
          name="5 · 공은의 한마디"
        >
          <Scene5Opinion
            audioFrames={timings[4].audioFrames}
            durationInFrames={timings[4].durationInFrames}
          />
        </TransitionSeries.Sequence>
        {slideLeft}

        <TransitionSeries.Sequence
          durationInFrames={outro.durationInFrames}
          name="채널 홍보 (아웃트로)"
        >
          <ChannelOutro
            videoId={VIDEO.id}
            audioFrames={outro.audioFrames}
            durationInFrames={outro.durationInFrames}
          />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      <Bgm scenes={timings} totalFrames={totalDurationInFrames(timings)} />
    </AbsoluteFill>
  );
};
