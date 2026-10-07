import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { MOTION } from "../../theme";
import {
  CHUSEOK,
  CHUSEOK_MOTION,
  POSTER_PX,
  POSTER_SCALE,
  type Rect,
} from "./theme";

/**
 * 포스터 좌표계(941x1672)를 그대로 쓰는 무대.
 *
 * 안에 들어가는 것은 전부 포스터 픽셀 좌표로 배치한다 — 글자 크기까지 포함해서.
 * 바깥에서 1080 폭에 맞춰 한 번만 확대하므로, 포스터에서 잰 좌표를 변환 없이 쓴다.
 * 느린 켄번즈도 여기서 건다 (안의 카드·정정 조각이 전부 같이 움직여야 한다).
 */
export const ChuseokStage: React.FC<{
  readonly durationInFrames: number;
  /** 켄번즈 방향. 보통 장면 인덱스를 넘긴다 */
  readonly drift?: number;
  readonly children?: React.ReactNode;
}> = ({ durationInFrames, drift = 0, children }) => {
  const frame = useCurrentFrame();

  const zoom = interpolate(
    frame,
    [0, durationInFrames],
    [CHUSEOK_MOTION.from, CHUSEOK_MOTION.from + CHUSEOK_MOTION.travel * MOTION],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const way = drift % 2 === 0 ? 1 : -1;
  const shift = (from: number, to: number) =>
    interpolate(frame, [0, durationInFrames], [from, to], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

  return (
    <AbsoluteFill
      style={{ overflow: "hidden", backgroundColor: CHUSEOK.night }}
    >
      <AbsoluteFill
        style={{
          scale: zoom,
          translate: `${shift(CHUSEOK_MOTION.driftX * way, -CHUSEOK_MOTION.driftX * way) * MOTION}% ${
            shift(-CHUSEOK_MOTION.driftY * way, CHUSEOK_MOTION.driftY * way) *
            MOTION
          }%`,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: POSTER_PX.w,
            height: POSTER_PX.h,
            transform: `scale(${POSTER_SCALE})`,
            transformOrigin: "top left",
          }}
        >
          {children}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** 포스터 한 장을 무대에 그대로 깐다 */
export const PosterPlate: React.FC<{ readonly image: string }> = ({
  image,
}) => (
  <Img
    src={staticFile(image)}
    style={{
      position: "absolute",
      left: 0,
      top: 0,
      width: POSTER_PX.w,
      height: POSTER_PX.h,
      maxWidth: "none",
    }}
  />
);

/**
 * 포스터의 일부를 오려서 다른 자리에 붙인다 (장패드 제품 컷 같은 것).
 * `src` 와 `dest` 의 비율은 맞춰서 넘긴다 — 다르면 늘어난다.
 */
export const PosterCutout: React.FC<{
  readonly image: string;
  readonly src: Rect;
  readonly dest: Rect;
  readonly radius?: number;
  readonly style?: React.CSSProperties;
}> = ({ image, src, dest, radius = 0, style }) => {
  const [sx, sy, sw, sh] = src;
  const [dx, dy, dw, dh] = dest;
  const kx = dw / sw;
  const ky = dh / sh;

  return (
    <div
      style={{
        position: "absolute",
        left: dx,
        top: dy,
        width: dw,
        height: dh,
        overflow: "hidden",
        borderRadius: radius,
        ...style,
      }}
    >
      <Img
        src={staticFile(image)}
        style={{
          position: "absolute",
          left: -sx * kx,
          top: -sy * ky,
          width: POSTER_PX.w * kx,
          height: POSTER_PX.h * ky,
          maxWidth: "none",
        }}
      />
    </div>
  );
};
