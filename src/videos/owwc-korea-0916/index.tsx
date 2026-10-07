import { linearTiming, TransitionSeries } from "@remotion/transitions";
import React from "react";
import { AbsoluteFill } from "remotion";
import { Bgm } from "../../components/Bgm";
import { ChannelOutro } from "../../shared/ChannelOutro";
import { PosterScene } from "../../shared/poster/PosterScene";
import { slashWipe } from "../../shared/poster/slashWipe";
import { COLORS, TRANSITION_FRAMES } from "../../theme";
import {
  fallbackTimings,
  totalDurationInFrames,
  type VideoProps,
} from "../../timing";
import { ACCENT, KEN_BURNS, LAYOUT, SCENE_META, VIDEO } from "./meta";

/**
 * 0.4초 사선 와이프 — 포스터의 블루 발광 경계가 비스듬히 훑고 지나간다.
 *
 * 장면이 전부 정지 포스터라 전환이 이 영상의 거의 유일한 움직임이다.
 * 길이는 TRANSITION_FRAMES(0.4초) 그대로 둔다 — 나레이션 앞 여백
 * (SCENE_HEAD_SECONDS)과 같아야 첫 마디가 전환에 묻히지 않는다.
 */
const slash = (
  <TransitionSeries.Transition
    presentation={slashWipe({ color: ACCENT.line, colorSoft: ACCENT.glow })}
    timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
  />
);

/** OWWC 대한민국 우승 기념 이스포츠 전리품 상자 이벤트 */
export const OwwcKorea0916: React.FC<VideoProps> = ({ scenes }) => {
  const timings =
    scenes.length === VIDEO.script.length ? scenes : fallbackTimings(VIDEO);
  const outro = timings[timings.length - 1];

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
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
                accent={ACCENT.line}
                layout={LAYOUT}
                motion={KEN_BURNS}
                drift={i}
                audioFrames={timings[i].audioFrames}
                durationInFrames={timings[i].durationInFrames}
              />
            </TransitionSeries.Sequence>
            {slash}
          </React.Fragment>
        ))}

        {/* 포스터가 다크 톤이라 아웃트로도 라이트 PosterOutro 가 아니라 공용 다크 판을 쓴다 */}
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
