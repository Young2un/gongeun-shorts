import type { CalculateMetadataFunction } from "remotion";
import { staticFile } from "remotion";
import {
  FPS,
  SCENE_HEAD_SECONDS,
  SCENE_TAIL_SECONDS,
  TRANSITION_FRAMES,
} from "./theme";

/** 장면 시작 ~ 나레이션 시작 사이 여백 (전환에 첫 마디가 묻히지 않게) */
export const HEAD_FRAMES = Math.round(SCENE_HEAD_SECONDS * FPS);
export const TAIL_FRAMES = Math.round(SCENE_TAIL_SECONDS * FPS);

/** script.json 한 항목 */
export type ScriptEntry = {
  readonly id: string;
  readonly text: string;
};

/**
 * 영상 하나의 설정.
 * `src/videos/<id>/meta.ts` 가 이 모양으로 내보낸다.
 */
export type VideoConfig = {
  /** 폴더 이름이자 에셋 경로. 예: "team-drive" */
  readonly id: string;
  /** Remotion 컴포지션 id. 예: "TeamDriveShorts" */
  readonly compositionId: string;
  /** 장면 목록 (아웃트로 포함) */
  readonly script: readonly ScriptEntry[];
  /** durations.json 이 없을 때 쓸 장면 길이(초) */
  readonly fallbackSeconds: readonly number[];
};

export type SceneTiming = {
  readonly id: string;
  /** 나레이션 오디오 길이 (프레임) */
  readonly audioFrames: number;
  /** 장면 전체 길이 = 여백 + 오디오 + 꼬리 (프레임) */
  readonly durationInFrames: number;
  /** 전환 겹침을 반영한 타임라인상 시작 프레임 */
  readonly startFrame: number;
};

export type SceneProps = {
  readonly audioFrames: number;
  readonly durationInFrames: number;
};

/**
 * 장면 오디오 길이 대비 비율(0~1)을 장면 내 프레임으로 바꾼다.
 * 나레이션이 HEAD_FRAMES 뒤에 시작하므로 그만큼 밀어준다.
 */
export const at = (audioFrames: number, ratio: number) =>
  HEAD_FRAMES + Math.round(audioFrames * ratio);

/** 영상별 에셋 경로 */
export const voiceDir = (videoId: string) => `videos/${videoId}/voice`;
export const captionsDir = (videoId: string) => `videos/${videoId}/captions`;

/**
 * `public/videos/<id>/voice/durations.json` 을 읽는다.
 * 파일이 없거나 형식이 다르면 null 을 돌려주고 폴백 길이를 쓰게 한다.
 */
export const loadDurations = async (
  videoId: string,
  signal?: AbortSignal,
): Promise<Record<string, number> | null> => {
  try {
    const res = await fetch(staticFile(`${voiceDir(videoId)}/durations.json`), {
      signal,
    });
    if (!res.ok) {
      return null;
    }
    const data = (await res.json()) as Record<string, number>;
    return typeof data === "object" && data !== null ? data : null;
  } catch {
    return null;
  }
};

/**
 * 장면별 타이밍을 계산한다.
 * `secondsById` 가 없으면 `fallbackSeconds` 로 폴백한다.
 */
export const buildSceneTimings = (
  video: VideoConfig,
  secondsById: Record<string, number> | null,
): SceneTiming[] => {
  let cursor = 0;

  return video.script.map((scene, index) => {
    const measured = secondsById?.[scene.id];

    // durations.json 은 "오디오 길이", 폴백 배열은 "장면 전체 길이" 기준이다.
    const durationInFrames =
      typeof measured === "number" && Number.isFinite(measured) && measured > 0
        ? HEAD_FRAMES + Math.round(measured * FPS) + TAIL_FRAMES
        : Math.round((video.fallbackSeconds[index] ?? 8) * FPS);

    const audioFrames = Math.max(
      1,
      durationInFrames - HEAD_FRAMES - TAIL_FRAMES,
    );
    const startFrame = cursor;

    // 다음 장면은 전환 길이만큼 앞당겨 시작한다 (TransitionSeries 겹침).
    cursor += durationInFrames - TRANSITION_FRAMES;

    return { id: scene.id, audioFrames, durationInFrames, startFrame };
  });
};

/** 전환 겹침까지 반영한 전체 길이 */
export const totalDurationInFrames = (timings: readonly SceneTiming[]) => {
  const last = timings[timings.length - 1];
  return last.startFrame + last.durationInFrames;
};

/** durations.json 을 못 읽었을 때 쓰는 타이밍 */
export const fallbackTimings = (video: VideoConfig) =>
  buildSceneTimings(video, null);

export type VideoProps = {
  readonly scenes: SceneTiming[];
};

/** 메인 컴포지션: 나레이션 길이에 맞춰 전체 길이를 자동 계산한다. */
export const makeVideoMetadata =
  (video: VideoConfig): CalculateMetadataFunction<VideoProps> =>
  async ({ props, abortSignal }) => {
    const scenes = buildSceneTimings(
      video,
      await loadDurations(video.id, abortSignal),
    );

    return {
      durationInFrames: totalDurationInFrames(scenes),
      props: { ...props, scenes },
    };
  };

/**
 * 개별 장면 컴포지션도 같은 방식으로 길이를 맞춘다.
 * `videoId` 같은 추가 prop 을 갖는 컴포넌트도 받을 수 있게 제네릭으로 둔다.
 */
export const makeSceneMetadata =
  <T extends SceneProps>(
    video: VideoConfig,
    index: number,
  ): CalculateMetadataFunction<T> =>
  async ({ props, abortSignal }) => {
    const timing = buildSceneTimings(
      video,
      await loadDurations(video.id, abortSignal),
    )[index];

    return {
      durationInFrames: timing.durationInFrames,
      props: {
        ...props,
        audioFrames: timing.audioFrames,
        durationInFrames: timing.durationInFrames,
      },
    };
  };

/** 개별 장면 컴포지션의 기본 props */
export const sceneDefaults = (
  video: VideoConfig,
  index: number,
): SceneProps => {
  const timing = fallbackTimings(video)[index];
  return {
    audioFrames: timing.audioFrames,
    durationInFrames: timing.durationInFrames,
  };
};
