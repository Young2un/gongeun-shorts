import { linearTiming, TransitionSeries } from "@remotion/transitions";
import React from "react";
import { AbsoluteFill } from "remotion";
import { Bgm } from "../../../components/Bgm";
import { ChuseokOutro } from "../../../shared/chuseok/ChuseokOutro";
import { RevealScene } from "../../../shared/chuseok/RevealScene";
import { CHUSEOK } from "../../../shared/chuseok/theme";
import { slashWipe } from "../../../shared/poster/slashWipe";
import { TRANSITION_FRAMES } from "../../../theme";
import {
  fallbackTimings,
  totalDurationInFrames,
  type SceneProps,
  type VideoProps,
} from "../../../timing";
import { POSTER_SCENES, VIDEO_POSTER } from "./meta";
import { Scene3Prize } from "./Scene3Prize";

/** 0.4초 사선 와이프. 이 세트의 색 언어에 맞춰 핑크로 넘어간다 */
const slash = (
  <TransitionSeries.Transition
    presentation={slashWipe({ color: "#FF6FB0", colorSoft: "#FFD3E9" })}
    timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
  />
);

/**
 * 추석 댓글 이벤트 · 포스터판.
 *
 * 장면 1·2·4·5 는 받은 포스터를 그대로 깔고, 포스터 안의 카드만 오려서
 * 나레이션에 맞춰 하나씩 들여보낸다(RevealScene). 장면 3 은 포스터가 없어
 * 같은 좌표·같은 카드 모양으로 코드로 그린다.
 */
export const ChuseokDmon0918: React.FC<VideoProps> = ({ scenes }) => {
  const timings =
    scenes.length === VIDEO_POSTER.script.length
      ? scenes
      : fallbackTimings(VIDEO_POSTER);

  /** 포스터가 있는 장면 → script.json 인덱스 */
  const posterAt = [0, 1, 3, 4] as const;

  const outro = timings[timings.length - 1];

  return (
    <AbsoluteFill style={{ backgroundColor: CHUSEOK.night }}>
      <TransitionSeries>
        {posterAt.slice(0, 2).map((i, n) => (
          <React.Fragment key={VIDEO_POSTER.script[i].id}>
            <TransitionSeries.Sequence
              durationInFrames={timings[i].durationInFrames}
              name={POSTER_SCENES[n].name}
            >
              <RevealScene
                videoId={VIDEO_POSTER.id}
                sceneId={VIDEO_POSTER.script[i].id}
                image={POSTER_SCENES[n].image}
                source={POSTER_SCENES[n].source}
                slotColor={POSTER_SCENES[n].slotColor}
                reveals={POSTER_SCENES[n].reveals}
                overlays={POSTER_SCENES[n].overlays}
                drift={i}
                audioFrames={timings[i].audioFrames}
                durationInFrames={timings[i].durationInFrames}
              />
            </TransitionSeries.Sequence>
            {slash}
          </React.Fragment>
        ))}

        {/* 포스터가 없는 장면 — 같은 세트처럼 보이게 코드로 그린다 */}
        <TransitionSeries.Sequence
          durationInFrames={timings[2].durationInFrames}
          name="3 · 경품"
        >
          <Scene3Prize
            audioFrames={timings[2].audioFrames}
            durationInFrames={timings[2].durationInFrames}
          />
        </TransitionSeries.Sequence>
        {slash}

        {posterAt.slice(2).map((i, k) => (
          <React.Fragment key={VIDEO_POSTER.script[i].id}>
            <TransitionSeries.Sequence
              durationInFrames={timings[i].durationInFrames}
              name={POSTER_SCENES[k + 2].name}
            >
              <RevealScene
                videoId={VIDEO_POSTER.id}
                sceneId={VIDEO_POSTER.script[i].id}
                image={POSTER_SCENES[k + 2].image}
                source={POSTER_SCENES[k + 2].source}
                slotColor={POSTER_SCENES[k + 2].slotColor}
                reveals={POSTER_SCENES[k + 2].reveals}
                overlays={POSTER_SCENES[k + 2].overlays}
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
          <ChuseokOutro
            videoId={VIDEO_POSTER.id}
            audioFrames={outro.audioFrames}
            durationInFrames={outro.durationInFrames}
          />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      <Bgm scenes={timings} totalFrames={totalDurationInFrames(timings)} />
    </AbsoluteFill>
  );
};

/**
 * Studio 에서 장면 하나만 열어 보기 위한 컴포넌트들.
 *
 * Remotion 의 defaultProps 는 JSON 으로 직렬화되기 때문에, 카드 정정(JSX)이
 * 들어 있는 reveals 를 그대로 넘길 수 없다. 그래서 장면별 컴포넌트로 싸 둔다.
 */
export const POSTER_SCENE_COMPOSITIONS = POSTER_SCENES.map((meta, n) => {
  const index = [0, 1, 3, 4][n];
  const Component: React.FC<SceneProps> = (props) => (
    <RevealScene
      videoId={VIDEO_POSTER.id}
      sceneId={VIDEO_POSTER.script[index].id}
      image={meta.image}
      source={meta.source}
      slotColor={meta.slotColor}
      reveals={meta.reveals}
      overlays={meta.overlays}
      drift={index}
      {...props}
    />
  );
  Component.displayName = `ChuseokPosterScene${index + 1}`;

  return { id: `CP-${index + 1}`, index, Component };
});

/** 아웃트로도 Studio 에서 따로 열어 볼 수 있게 싸 둔다 */
export const ChuseokPosterOutro: React.FC<SceneProps> = (props) => (
  <ChuseokOutro videoId={VIDEO_POSTER.id} {...props} />
);
