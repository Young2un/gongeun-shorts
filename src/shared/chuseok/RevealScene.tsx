import React from "react";
import {
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { at, type SceneProps } from "../../timing";
import { ChuseokFrame } from "./ChuseokFrame";
import { ChuseokStage, PosterPlate } from "./Stage";
import { boxOf, POSTER_PX, type Rect } from "./theme";

export type Dir = "up" | "down" | "left" | "right";

/**
 * 카드 하나가 제자리로 들어오는 움직임.
 * 끝(진행도 1)에서 이동·확대가 정확히 0 이어야 포스터 원본 픽셀과 다시 맞물린다.
 */
export const entrance = (frame: number, start: number, from: Dir = "up") => {
  const p = interpolate(frame, [start, start + 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const off = (1 - p) * 38;

  return {
    opacity: interpolate(frame, [start, start + 12], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
    translate:
      from === "up"
        ? `0px ${off}px`
        : from === "down"
          ? `0px ${-off}px`
          : from === "left"
            ? `${off}px 0px`
            : `${-off}px 0px`,
    scale: 0.965 + 0.035 * p,
  };
};

/**
 * 포스터에 이미 그려져 있는 카드 한 장을 "아직 안 나온 상태"로 되돌리는 가림판.
 *
 * 그 자리 배경색으로 카드 모양만큼만 덮는다 — 카드가 앉을 빈 슬롯처럼 보이게.
 * 색은 포스터에서 카드 둘레를 재서 넣는다(meta 의 slot). 흰 패널 위 카드는
 * 패널색으로 덮여 아예 티가 나지 않고, 일러스트 위 카드는 주변 밤하늘색이 된다.
 */
const PosterSlot: React.FC<{
  readonly rect: Rect;
  readonly grow: number;
  readonly color: string;
  readonly radius: number;
}> = ({ rect, grow, color, radius }) => (
  <div
    style={{
      position: "absolute",
      ...boxOf(rect, grow),
      backgroundColor: color,
      borderRadius: radius,
    }}
  />
);

/**
 * 포스터의 카드 영역을 그대로 오려서 애니메이션으로 다시 앉힌다.
 *
 * 오려낸 조각은 원본 픽셀이라, 움직임이 끝나면 화면이 포스터와 1:1로 같아진다.
 * 새로 그린 카드가 아니기 때문에 폰트·그림자·그라데이션이 어긋날 일이 없다.
 */
const PosterSlice: React.FC<{
  readonly image: string;
  readonly rect: Rect;
  readonly grow: number;
  readonly start: number;
  readonly from: Dir;
}> = ({ image, rect, grow, start, from }) => {
  const frame = useCurrentFrame();
  const e = entrance(frame, start, from);
  const b = boxOf(rect, grow);

  return (
    <div
      style={{
        position: "absolute",
        ...b,
        overflow: "hidden",
        opacity: e.opacity,
        translate: e.translate,
        scale: e.scale,
      }}
    >
      <Img
        src={staticFile(image)}
        style={{
          position: "absolute",
          left: -b.left,
          top: -b.top,
          width: POSTER_PX.w,
          height: POSTER_PX.h,
          maxWidth: "none",
        }}
      />
    </div>
  );
};

/**
 * 카드 위에 덮어 그리는 층.
 *
 * 카드(PosterSlice)와 같은 타이밍·같은 기준점으로 움직여야 한 덩어리로 보인다.
 * 확대 기준점을 카드 중심에 맞춘다 — 화면 중심에 두면 카드와 어긋난다.
 */
const CoverLayer: React.FC<{
  readonly rect: Rect;
  readonly start: number;
  readonly from: Dir;
  readonly children: React.ReactNode;
}> = ({ rect, start, from, children }) => {
  const frame = useCurrentFrame();
  const e = entrance(frame, start, from);
  const [x, y, w, h] = rect;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity: e.opacity,
        translate: e.translate,
        scale: e.scale,
        transformOrigin: `${x + w / 2}px ${y + h / 2}px`,
      }}
    >
      {children}
    </div>
  );
};

export type Reveal = {
  /** 포스터 좌표계 [x, y, w, h] */
  readonly rect: Rect;
  /** 나레이션 길이 대비 등장 시점 (0~1) */
  readonly at: number;
  readonly from?: Dir;
  /** 카드 그림자까지 덮도록 사방으로 넓히는 여유 (기본 12) */
  readonly grow?: number;
  /** 카드가 나오기 전 그 자리를 덮을 색. 없으면 장면 기본값(slotColor) */
  readonly slot?: string;
  /** 슬롯 모서리 둥글기 (기본 30) */
  readonly slotRadius?: number;
  /**
   * 이 카드 위에 덮어 그릴 것 (공지에 없는 문구 정정 등).
   * 카드와 같은 타이밍으로 따라온다. 안에서는 포스터 좌표를 그대로 쓴다.
   */
  readonly cover?: React.ReactNode;
  /**
   * 포스터 조각은 건드리지 않고 `cover` 만 얹는다.
   * 카드가 아니라 일러스트 위의 문구를 갈아 끼울 때 쓴다.
   */
  readonly coverOnly?: boolean;
};

export type RevealSceneProps = SceneProps & {
  readonly videoId: string;
  readonly sceneId: string;
  /** public/ 기준 포스터 경로 */
  readonly image: string;
  readonly source: string;
  readonly reveals?: readonly Reveal[];
  /** 카드가 나오기 전 자리를 덮을 기본 색 (포스터에서 카드 둘레를 재서 넣는다) */
  readonly slotColor?: string;
  /** 애니메이션 없이 포스터 위에 항상 얹어 두는 것 (문구 정정 등) */
  readonly overlays?: React.ReactNode;
  /** 켄번즈 방향. 보통 장면 인덱스를 넘긴다 */
  readonly drift?: number;
};

/** 포스터를 깔고, 그 위에서 카드만 애니메이션으로 들어오게 하는 장면 */
export const RevealScene: React.FC<RevealSceneProps> = ({
  videoId,
  sceneId,
  image,
  source,
  reveals = [],
  slotColor = "#2A2450",
  overlays,
  drift = 0,
  audioFrames,
  durationInFrames,
}) => {
  const sliced = reveals.filter((r) => !r.coverOnly);

  return (
    <ChuseokFrame videoId={videoId} sceneId={sceneId} source={source}>
      <ChuseokStage durationInFrames={durationInFrames} drift={drift}>
        <PosterPlate image={image} />

        {sliced.map((r) => (
          <PosterSlot
            key={`slot-${r.rect.join()}`}
            rect={r.rect}
            grow={r.grow ?? 12}
            color={r.slot ?? slotColor}
            radius={r.slotRadius ?? 30}
          />
        ))}

        {sliced.map((r) => (
          <PosterSlice
            key={`slice-${r.rect.join()}`}
            image={image}
            rect={r.rect}
            grow={r.grow ?? 12}
            start={at(audioFrames, r.at)}
            from={r.from ?? "up"}
          />
        ))}

        {overlays}

        {reveals.map((r) =>
          r.cover ? (
            <CoverLayer
              key={`cover-${r.rect.join()}`}
              rect={r.rect}
              start={at(audioFrames, r.at)}
              from={r.from ?? "up"}
            >
              {r.cover}
            </CoverLayer>
          ) : null,
        )}
      </ChuseokStage>
    </ChuseokFrame>
  );
};
