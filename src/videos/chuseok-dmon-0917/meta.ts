import { OUTRO_FALLBACK_SECONDS } from "../../shared/outro";
import type { VideoConfig } from "../../timing";
import script from "./script.json";

/** 장면별 상단 소제목 · 하단 출처 (아웃트로 제외, script.json 순서와 맞춘다) */
export const SCENE_META = [
  {
    kicker: "한국 전용 추석 이벤트",
    source: [
      "넥슨 오버워치 「보름달에 소원 빌기」 이벤트 공지 (2026.09.17)",
      "한국 전용 · 공식 게시글 댓글 추첨",
    ],
  },
  {
    kicker: "참여 기간과 방법",
    source: [
      "넥슨 오버워치 공식 공지 · 이벤트 기간",
      "9/17 ~ 9/27 23:59 (한국 시각)",
    ],
  },
  {
    kicker: "경품과 당첨 인원",
    source: ["넥슨 오버워치 공식 공지 · 경품 안내", "디몬 장패드 · 추첨 10명"],
  },
  {
    kicker: "참여 전 주의사항",
    source: [
      "넥슨 오버워치 공식 공지 · 유의사항",
      "계정당 댓글 1회 · 개인정보 기재 금지",
    ],
  },
  {
    kicker: "공은의 한마디",
    source: [
      "넥슨 오버워치 공식 공지 · 당첨자 발표 (10/6)",
      "추첨 확률에 대한 평가는 개인 의견",
    ],
  },
] as const;

export const VIDEO: VideoConfig = {
  id: "chuseok-dmon-0917",
  compositionId: "ChuseokDmon0917",
  script,
  /** durations.json 이 없을 때 쓸 장면 길이(초). script.json 순서 + 아웃트로 */
  fallbackSeconds: [12, 13, 12, 13, 14, OUTRO_FALLBACK_SECONDS],
};
