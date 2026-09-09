import type { Hero } from "../../components/HeroRow";
import { OUTRO_FALLBACK_SECONDS } from "../../shared/outro";
import type { VideoConfig } from "../../timing";
import script from "./script.json";

/** 영웅 초상화 폴더 (public/ 기준) */
export const HERO_DIR = "videos/s4-midseason/heroes";

const PATCH_SOURCE = [
  "오버워치 공식 패치 노트 (2026.09.09)",
  "시즌 4 중간 시즌 업데이트",
] as const;

/** 장면별 상단 소제목 · 하단 출처 (아웃트로 제외) */
export const SCENE_META = [
  { kicker: "패치 왔다", source: PATCH_SOURCE },
  { kicker: "이벤트", source: PATCH_SOURCE },
  { kicker: "탱커 패치", source: PATCH_SOURCE },
  { kicker: "딜러 패치", source: PATCH_SOURCE },
  { kicker: "힐러 패치", source: PATCH_SOURCE },
  {
    kicker: "버그 수정 · 총평",
    source: [
      "오버워치 공식 패치 노트 (2026.09.09)",
      "마지막 한 줄은 개인 의견",
    ],
  },
] as const;

/** 역할군별로 이번 패치에서 바뀐 영웅 (tone: 상향 up · 하향 down) */
export const TANKS: readonly Hero[] = [
  { id: "dva", name: "D.Va", tone: "up" },
  { id: "winston", name: "윈스턴", tone: "up" },
  { id: "mauga", name: "마우가", tone: "neutral" },
  { id: "domina", name: "도미나", tone: "up" },
  { id: "dmon", name: "D.Mon", tone: "neutral" },
  { id: "wreckingball", name: "레킹볼", tone: "neutral" },
  { id: "zarya", name: "자리야", tone: "neutral" },
];

export const DAMAGE: readonly Hero[] = [
  { id: "freya", name: "프레야", tone: "down" },
  { id: "junkrat", name: "정크랫", tone: "up" },
  { id: "sierra", name: "시에라", tone: "neutral" },
  { id: "torbjorn", name: "토르비욘", tone: "down" },
  { id: "anran", name: "안란", tone: "neutral" },
  { id: "symmetra", name: "시메트라", tone: "neutral" },
  { id: "vendetta", name: "벤데타", tone: "neutral" },
];

export const SUPPORT: readonly Hero[] = [
  { id: "baptiste", name: "바티스트", tone: "up" },
  { id: "kiriko", name: "키리코", tone: "down" },
  { id: "brigitte", name: "브리기테", tone: "neutral" },
  { id: "zenyatta", name: "젠야타", tone: "neutral" },
  { id: "wuyang", name: "우양", tone: "neutral" },
  { id: "jetpackcat", name: "제트팩 캣", tone: "neutral" },
];

export const VIDEO: VideoConfig = {
  id: "s4-midseason",
  compositionId: "S4Midseason",
  script,
  fallbackSeconds: [11, 11, 13, 12, 13, 12, OUTRO_FALLBACK_SECONDS],
};
