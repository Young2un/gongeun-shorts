import { Audio } from "@remotion/media";
import React from "react";
import { interpolate, staticFile } from "remotion";
import { BGM } from "../theme";
import { HEAD_FRAMES, type SceneTiming } from "../timing";
import { useAssetExists } from "./useAssetExists";

/** 덕킹이 걸리고 풀리는 데 걸리는 프레임 */
const DUCK_RAMP = 8;

/**
 * 배경음악. `public/bgm.mp3` 가 있을 때만 재생하고,
 * 나레이션이 나오는 구간에서는 볼륨을 자동으로 낮춘다(덕킹).
 */
export const Bgm: React.FC<{
  readonly scenes: readonly SceneTiming[];
  readonly totalFrames: number;
}> = ({ scenes, totalFrames }) => {
  const exists = useAssetExists(BGM.src);

  if (!exists) {
    return null;
  }

  return (
    <Audio
      src={staticFile(BGM.src)}
      loop
      volume={(f) => {
        // 나레이션이 겹치는 정도(0~1). 가장 강한 구간을 따른다.
        const duck = scenes.reduce((strongest, scene) => {
          const start = scene.startFrame + HEAD_FRAMES;
          const end = start + scene.audioFrames;
          return Math.max(
            strongest,
            interpolate(
              f,
              [start - DUCK_RAMP, start, end, end + DUCK_RAMP],
              [0, 1, 1, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            ),
          );
        }, 0);

        const base = BGM.volume + (BGM.duckedVolume - BGM.volume) * duck;

        // 시작 0.5초 페이드인, 마지막 1초 페이드아웃
        const envelope = interpolate(
          f,
          [0, 15, totalFrames - 30, totalFrames - 1],
          [0, 1, 1, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        );

        return base * envelope;
      }}
    />
  );
};
