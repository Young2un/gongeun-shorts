/**
 * 채널 홍보 아웃트로.
 *
 * 모든 영상이 공유하는 조각이라 문구를 여기 한 곳에 둔다.
 * 새 영상을 만들 때 `script.json` 마지막에 `OUTRO_SCRIPT` 를 그대로 넣으면 된다.
 */

export const OUTRO_ID = "outro";

/** script.json 에 넣을 항목 */
export const OUTRO_SCRIPT = {
  id: OUTRO_ID,
  text: "저는 거의 매일 치지직에서 '김공은'으로 오버워치 방송 중이에요. 관심 있으시면 놀러 오시고, 구독·좋아요도 부탁드립니다!",
} as const;

/** 화면 문구 */
export const OUTRO = {
  kicker: "채널 소개",
  source: ["치지직 · 김공은", "거의 매일 오버워치 생방송"],
} as const;

/** durations.json 이 없을 때 쓸 아웃트로 길이(초) */
export const OUTRO_FALLBACK_SECONDS = 10;
