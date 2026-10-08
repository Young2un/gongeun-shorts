import { OUTRO_FALLBACK_SECONDS } from "../../shared/outro";
import type { VideoConfig } from "../../timing";
import script from "./script.json";

/** 이미지 · 영웅 초상화 폴더 (public/ 기준) */
export const IMG_DIR = "videos/s5-heroes-1007/images";
export const HERO_DIR = "videos/s5-heroes-1007/heroes";

const NEXON = "넥슨 오버워치 패치 노트 · 2026년 10월 7일";
const BLIZZARD_EN = "Blizzard 영문 패치 노트 (2026.10.06) · 수치 대조";

/** 장면별 상단 소제목 · 하단 출처 (아웃트로 제외, script.json 순서와 맞춘다) */
export const SCENE_META = [
  { kicker: "솜브라에 가려진 변경", source: [NEXON, BLIZZARD_EN] },
  { kicker: "타점 조정", source: [NEXON, "영웅 타점 조정 · 34명"] },
  { kicker: "히트스캔도 조정", source: [NEXON, "히트스캔 투사체 크기 · 개발자 의견"] },
  { kicker: "신규 영웅 독트린", source: [NEXON, "독트린 · 영웅 체험 주말 이후 조정"] },
  { kicker: "독트린 세부 조정", source: [NEXON, "독트린 · 추진형 장막 · 구제 · 수혈"] },
  { kicker: "막힌 조합", source: [NEXON, "캐서디 황야의 무법자 · 개발자 의견"] },
  { kicker: "상향된 영웅", source: [NEXON, "겐지 질풍참 · 용검"] },
  { kicker: "수치 조정 묶음", source: [NEXON, "D.Va · 루시우 · 도미나 · 엠레 · 바스티온"] },
  { kicker: "특전 교체", source: [NEXON, "아나 국소 마취 · 시온 생존 본능"] },
  { kicker: "로드호그 개편", source: [NEXON, "로드호그 사슬 갈고리 · 고철총"] },
  { kicker: "로드호그 신규 기술", source: [NEXON, "쓰레기 압축기 · 숨 돌리기 · 특전"] },
  { kicker: "솜브라 지원 전환", source: [NEXON, "솜브라 긴급 패치 · 사이버 스페이스"] },
  { kicker: "솜브라가 내준 것", source: [NEXON, "솜브라 EMP · 위치변환기"] },
  { kicker: "개인 의견", source: [NEXON, "마지막 줄은 개인 의견"] },
] as const;

export const VIDEO: VideoConfig = {
  id: "s5-heroes-1007",
  compositionId: "S5Heroes1007",
  script,
  /** durations.json 이 없을 때 쓸 장면 길이(초). script.json 순서 + 아웃트로 */
  fallbackSeconds: [11, 12, 13, 13, 14, 10, 10, 16, 14, 14, 13, 14, 10, 10, OUTRO_FALLBACK_SECONDS],
};
