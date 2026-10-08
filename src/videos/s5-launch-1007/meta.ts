import { OUTRO_FALLBACK_SECONDS } from "../../shared/outro";
import type { VideoConfig } from "../../timing";
import script from "./script.json";

/** 이미지 폴더 (public/ 기준) */
export const IMG_DIR = "videos/s5-launch-1007/images";

const BLIZZARD = "블리자드 오버워치 새소식 · 5시즌 어둠의 신조 (2026.10.07)";
const NEXON = "넥슨 오버워치 패치 노트 · 2026년 10월 7일";

/** 장면별 상단 소제목 · 하단 출처 (아웃트로 제외, script.json 순서와 맞춘다) */
export const SCENE_META = [
  { kicker: "5시즌 어둠의 신조", source: [BLIZZARD, NEXON] },
  { kicker: "재출시 패스 진행", source: [BLIZZARD, "재출시 패스 · 진행 방식 안내"] },
  { kicker: "빠지는 보상", source: [BLIZZARD, NEXON] },
  { kicker: "5시즌 배틀 패스", source: [BLIZZARD, "5시즌 배틀 패스 · 신화 스킨 안내"] },
  { kicker: "신규 영웅 · 전장", source: [BLIZZARD, "독트린 영웅 소개 · 그림스뵈튼 전장"] },
  { kicker: "할로윈 이벤트", source: [BLIZZARD, "수수께끼의 광기: 묘한 게임 (10/7~11/3)"] },
  {
    kicker: "기간 한정 일정",
    source: ["넥슨 오버워치 공지 · 5시즌 신규 콜라보레이션 안내", "콜라보 10/7~10/21 · 테크 마녀 10/10~27 (블리자드 새소식)"],
  },
  { kicker: "경쟁전 변경", source: [NEXON, "팀 드라이브 일정은 블리자드 새소식 기준"] },
  { kicker: "편의 · 대기열", source: [NEXON, "전장 투표 · 스타디움 · 설정"] },
  {
    kicker: "개인 의견",
    source: [NEXON, "독트린 조정 수치 · 마지막 줄은 개인 의견"],
  },
] as const;

export const VIDEO: VideoConfig = {
  id: "s5-launch-1007",
  compositionId: "S5Launch1007",
  script,
  /** durations.json 이 없을 때 쓸 장면 길이(초). script.json 순서 + 아웃트로 */
  fallbackSeconds: [12, 16, 14, 16, 16, 13, 15, 15, 12, 20, OUTRO_FALLBACK_SECONDS],
};
