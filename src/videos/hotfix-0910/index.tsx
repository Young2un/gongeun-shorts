import { linearTiming, TransitionSeries } from "@remotion/transitions";
import React from "react";
import { AbsoluteFill } from "remotion";
import { Bgm } from "../../components/Bgm";
import { PosterOutro } from "../../shared/poster/PosterOutro";
import { PosterScene } from "../../shared/poster/PosterScene";
import { slashWipe } from "../../shared/poster/slashWipe";
import { POSTER } from "../../shared/poster/theme";
import { TRANSITION_FRAMES } from "../../theme";
import {
  fallbackTimings,
  totalDurationInFrames,
  type VideoProps,
} from "../../timing";
import { SCENE_META, VIDEO } from "./meta";

/**
 * 0.4초 사선 와이프 — 오렌지 발광 경계가 비스듬히 훑고 지나간다.
 *
 * 장면이 전부 정지 포스터라 전환이 이 영상의 거의 유일한 움직임이다.
 * 길이는 TRANSITION_FRAMES(0.4초) 그대로 둔다 — 나레이션 앞 여백
 * (SCENE_HEAD_SECONDS)과 같아야 첫 마디가 전환에 묻히지 않는다.
 */
const slash = (
  <TransitionSeries.Transition
    presentation={slashWipe()}
    timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
  />
);

/** 9/10 핫픽스와 기존 노트 추가 변경 */
export const Hotfix0910: React.FC<VideoProps> = ({ scenes }) => {
  const timings =
    scenes.length === VIDEO.script.length ? scenes : fallbackTimings(VIDEO);
  const outro = timings[timings.length - 1];

  return (
    <AbsoluteFill style={{ backgroundColor: POSTER.bg1 }}>
      <TransitionSeries>
        {SCENE_META.map((meta, i) => (
          <React.Fragment key={meta.image}>
            <TransitionSeries.Sequence
              durationInFrames={timings[i].durationInFrames}
              name={meta.name}
            >
              <PosterScene
                videoId={VIDEO.id}
                sceneId={VIDEO.script[i].id}
                image={meta.image}
                source={meta.source}
                drift={i}
                audioFrames={timings[i].audioFrames}
                durationInFrames={timings[i].durationInFrames}
              />
            </TransitionSeries.Sequence>
            {slash}
          </React.Fragment>
        ))}

        <TransitionSeries.Sequence
          durationInFrames={outro.durationInFrames}
          name="채널 홍보 (아웃트로)"
        >
          <PosterOutro
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
