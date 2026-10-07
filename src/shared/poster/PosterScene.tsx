import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { MOTION } from "../../theme";
import type { SceneProps } from "../../timing";
import { useAssetExists } from "../../components/useAssetExists";
import { PosterFrame } from "./PosterFrame";
import {
  POSTER,
  POSTER_MOTION,
  type PosterLayout,
  type PosterMotion,
} from "./theme";

export type PosterSceneProps = SceneProps & {
  readonly videoId: string;
  readonly sceneId: string;
  /** public/ 기준 포스터 경로. 예: "img/0911/1.png" */
  readonly image: string;
  /** 하단에 다시 그릴 출처 한 줄 */
  readonly source: string;
  /** 포스터의 색에 맞춘 강조색 (기본: 라이트 포스터의 오렌지) */
  readonly accent?: string;
  /** 하단 스크림·자막·출처 배치 */
  readonly layout?: PosterLayout;
  /** 켄번즈 세기. 하단 여백이 좁은 포스터 세트는 약하게 준다 */
  readonly motion?: PosterMotion;
  /**
   * 켄번즈가 흐르는 방향. 장면마다 반대로 주면 연달아 볼 때 같은 화면이
   * 반복되는 느낌이 줄어든다. 보통 장면 인덱스를 그대로 넘긴다.
   */
  readonly drift?: number;
};

/**
 * 완성된 장면 포스터(1080x1920 비율) 한 장을 화면 가득 깔고,
 * 그 위에 나레이션·자막·출처만 얹는 장면.
 *
 * 포스터 안에 제목·카드·수치가 이미 다 들어 있어서 따로 그릴 것이 없다.
 * 대신 아주 느린 켄번즈로 정지 화면처럼 보이지 않게 한다.
 * 이미지가 없으면 배경만 남고 렌더는 깨지지 않는다.
 */
export const PosterScene: React.FC<PosterSceneProps> = ({
  videoId,
  sceneId,
  image,
  source,
  accent,
  layout,
  motion = POSTER_MOTION,
  drift = 0,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const exists = useAssetExists(image);

  // from 배율에서 시작해 항상 오버스캔을 남긴다 — 흘러도 가장자리가 비치지 않게.
  const zoom = interpolate(
    frame,
    [0, durationInFrames],
    [motion.from, motion.from + motion.travel * MOTION],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.linear,
    },
  );

  // 아주 느린 대각 드리프트. 장면마다 방향을 뒤집는다.
  // 폭은 오버스캔 안쪽으로만 움직여야 가장자리가 비지 않는다.
  const way = drift % 2 === 0 ? 1 : -1;
  const shift = (from: number, to: number) =>
    interpolate(frame, [0, durationInFrames], [from, to], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.linear,
    });
  const driftX = shift(motion.driftX * way, -motion.driftX * way) * MOTION;
  const driftY = shift(-motion.driftY * way, motion.driftY * way) * MOTION;

  return (
    <PosterFrame
      videoId={videoId}
      sceneId={sceneId}
      source={source}
      accent={accent}
      layout={layout}
    >
      <AbsoluteFill style={{ backgroundColor: POSTER.bg1, overflow: "hidden" }}>
        {exists ? (
          <Img
            src={staticFile(image)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              scale: zoom,
              translate: `${driftX}% ${driftY}%`,
            }}
          />
        ) : null}
      </AbsoluteFill>
    </PosterFrame>
  );
};
