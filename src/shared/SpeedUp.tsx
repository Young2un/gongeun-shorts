import React from "react";
import type { CalculateMetadataFunction } from "remotion";
import { AbsoluteFill, OffthreadVideo, staticFile } from "remotion";
import { FPS } from "../theme";

export type SpeedUpProps = {
  /** public/ 기준 경로 (예: tmp/s5-heroes-1007-rich.mp4) */
  readonly src: string;
  /** 배속 (1.5 = 1.5배 빠르게) */
  readonly rate: number;
  /** 원본 길이(초) — 결과 길이 = seconds / rate */
  readonly seconds: number;
};

/**
 * 완성된 mp4 를 배속해서 다시 뽑는 컴포지션.
 * Remotion 번들 ffmpeg 에는 setpts/atempo 필터가 없어서, 외부 ffmpeg 없이 배속하려면 이걸 쓴다.
 *
 *   cp out/영상.mp4 public/tmp/
 *   npx remotion render SpeedUp out/영상-x150.mp4 \
 *     --props='{"src":"tmp/영상.mp4","rate":1.5,"seconds":207.47}'
 */
export const SpeedUp: React.FC<SpeedUpProps> = ({ src, rate }) => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <OffthreadVideo src={staticFile(src)} playbackRate={rate} />
  </AbsoluteFill>
);

export const speedUpMetadata: CalculateMetadataFunction<SpeedUpProps> = ({
  props,
}) => ({
  durationInFrames: Math.max(1, Math.ceil((props.seconds / props.rate) * FPS)),
});
