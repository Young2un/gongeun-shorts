import { OUTRO_FALLBACK_SECONDS } from "../../shared/outro";
import type { VideoConfig } from "../../timing";
import script from "./script.json";

/** 장면별 상단 소제목 · 하단 출처 (아웃트로 제외, script.json 순서와 맞춘다) */
export const SCENE_META = [
  {
    kicker: "오버워치 · 경쟁전 신규 이벤트",
    source: [
      "오버워치 2 · 2026 시즌 4 「부산의 영웅」",
      "경쟁전 › 팀 드라이브 (실험 단계)",
    ],
  },
  {
    kicker: "규칙 ① 자동 파티",
    source: [
      "넥슨 오버워치 공식 패치노트 (2026.08.12)",
      "경쟁전 업데이트 › 자동 그룹 배치",
    ],
  },
  {
    kicker: "규칙 ② 명성 보너스",
    source: [
      "넥슨 오버워치 공식 패치노트 (2026.08.12)",
      "경쟁전 업데이트 › 명성 · 검투사 등급",
    ],
  },
  {
    kicker: "규칙 ③ 최후의 시련",
    source: [
      "넥슨 오버워치 공식 패치노트 (2026.08.12)",
      "경쟁전 업데이트 › 최후의 시련",
    ],
  },
  {
    kicker: "보상",
    source: [
      "넥슨 오버워치 공식 패치노트 (2026.08.12)",
      "보상은 이벤트 종료 후 일괄 지급",
    ],
  },
  {
    kicker: "일정 · 설정",
    source: [
      "넥슨 오버워치 공식 패치노트 (2026.08.12)",
      "2026.09.01 기준 정보",
    ],
  },
  {
    kicker: "내 생각",
    source: ["개인 의견 · 공식 발표와 무관", "토요일 새벽에 봅시다"],
  },
] as const;

export const VIDEO: VideoConfig = {
  id: "team-drive",
  compositionId: "TeamDriveShorts",
  script,
  /** durations.json 이 없을 때 쓸 장면 길이(초). script.json 순서 + 아웃트로 */
  fallbackSeconds: [4, 9, 11, 8, 9, 5, 14, OUTRO_FALLBACK_SECONDS],
};
