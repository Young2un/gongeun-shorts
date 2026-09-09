import { OUTRO_FALLBACK_SECONDS } from "../../shared/outro";
import type { VideoConfig } from "../../timing";
import script from "./script.json";

const BLIZZCON_SOURCE = [
  "Blizzard 「Season 4 Midcycle Takes You To The BlizzCon Stage!」 (2026.09.04)",
  "BlizzCon 2026 · 9월 12~13일 (현지 시각)",
] as const;

/** 장면별 상단 소제목 · 하단 출처 (아웃트로 제외, script.json 순서와 맞춘다) */
export const SCENE_META = [
  { kicker: "공식 소식 정리", source: BLIZZCON_SOURCE },
  {
    kicker: "출시 일정 변경",
    source: [
      "게임 디렉터 아론 켈러 공식 공지 (2026.09.04)",
      "Unvaulted Passes → 시즌 5 시작으로 연기",
    ],
  },
  { kicker: "블리즈컨 예고", source: BLIZZCON_SOURCE },
  {
    kicker: "최초 공식 RPG",
    source: [
      "Overwatch 공식 X 계정 · Questwatch 발표",
      "블리즈컨 메인 스테이지 · 9월 13일",
    ],
  },
  {
    kicker: "개인적인 생각",
    source: ["개인 의견 · 공식 발표와 무관", "발표 후 다시 정리 예정"],
  },
] as const;

export const VIDEO: VideoConfig = {
  id: "blizzcon-news",
  compositionId: "BlizzconNews",
  script,
  /** durations.json 이 없을 때 쓸 장면 길이(초). script.json 순서 + 아웃트로 */
  fallbackSeconds: [11, 11, 13, 12, 14, OUTRO_FALLBACK_SECONDS],
};
