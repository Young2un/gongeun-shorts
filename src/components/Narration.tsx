import { Audio } from "@remotion/media";
import React, { useMemo } from "react";
import { Sequence, staticFile } from "remotion";
import { HEAD_FRAMES, voiceDir } from "../timing";
import { useFirstExistingAsset } from "./useAssetExists";

/**
 * 장면 나레이션 오디오.
 * `public/videos/<videoId>/voice/<sceneId>.mp3` 를 먼저 찾고, 없으면 `.wav` 를 쓴다.
 * (edge-tts 는 mp3, Gemini TTS 는 wav 를 만든다)
 * 둘 다 없으면 조용히 건너뛴다.
 *
 * 장면 시작 직후가 아니라 HEAD_FRAMES(전환 길이) 뒤에 재생해서,
 * 첫 마디가 화면 전환에 묻히지 않게 한다.
 */
export const Narration: React.FC<{
  readonly videoId: string;
  readonly sceneId: string;
}> = ({ videoId, sceneId }) => {
  const candidates = useMemo(
    () => [
      `${voiceDir(videoId)}/${sceneId}.mp3`,
      `${voiceDir(videoId)}/${sceneId}.wav`,
    ],
    [videoId, sceneId],
  );
  const src = useFirstExistingAsset(candidates);

  if (!src) {
    return null;
  }

  return (
    <Sequence from={HEAD_FRAMES} name="나레이션" layout="none">
      <Audio src={staticFile(src)} />
    </Sequence>
  );
};
