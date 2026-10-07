/**
 * 추석 포스터 세트(public/img/0918/*.png) 테마.
 *
 * 색은 전부 포스터 픽셀에서 직접 뽑았다 — 포스터 위에 카드를 덧그리거나
 * 문구를 정정할 때 원본과 이어 붙여도 티가 나지 않아야 하기 때문이다.
 *
 * 0911/0916 세트가 쓰는 src/shared/poster/theme.ts 와는 별개다.
 */

/** 포스터 원본 크기. 좌표를 전부 이 좌표계로 쓴다 (1080x1920 으로 자동 확대) */
export const POSTER_PX = { w: 941, h: 1672 } as const;

export const CHUSEOK = {
  /** 날짜·강조 핑크 ("9월 17일") */
  pink: "#DF3C89",
  /** 밝은 핑크 (배지·점) */
  pinkSoft: "#F8C2E7",
  /** 카드 안 큰 글자 */
  ink: "#1A1D46",
  /** 헤더·기호 */
  ink2: "#2C3358",
  /** 카드 안 보조 설명 */
  muted: "#746DA2",
  /** 날짜 칸 배경 */
  cellBg: "#FBF2F7",
  /** 흰 패널 배경 */
  panel: "#FDFBFC",
  /** 연보라 카드 본문 배경 (3번 포스터) */
  cardBody: "#F9EFFB",
  /** 밤하늘 (배경 폴백) */
  night: "#141843",
} as const;

/** 자막·출처가 앉는 하단 배치 (1080x1920 기준) */
export const CHUSEOK_LAYOUT = {
  /** 하단 스크림이 페이드로 시작되는 높이 */
  scrimFrom: 1560,
  /** 스크림이 가장 진해지는 높이 */
  scrimTo: 1700,
  /** 스크림 최대 알파. 0911 세트와 달리 가릴 출처 줄이 없어 불투명까지 가지 않는다 */
  scrimAlpha: 0.88,
  captionBottom: 1846,
  captionFontSize: 36,
  captionMaxWidth: 940,
  sourceY: 1862,
  sourceFontSize: 25,
} as const;

/** 켄번즈 세기. 카드가 y 1430(포스터 기준)까지 내려와 있어 약하게 준다 */
export const CHUSEOK_MOTION = {
  from: 1.02,
  travel: 0.035,
  driftX: 0.4,
  driftY: 0.3,
} as const;

/** 포스터 좌표계 → 화면. 가로를 꽉 채우는 배율 하나로 통일한다 */
export const POSTER_SCALE = 1080 / POSTER_PX.w;

/** 포스터 좌표 사각형 [x, y, w, h] */
export type Rect = readonly [number, number, number, number];

/** 사각형을 CSS 박스로. `grow` 만큼 사방으로 넓힌다 (카드 그림자까지 덮으려고) */
export const boxOf = ([x, y, w, h]: Rect, grow = 0) => ({
  left: x - grow,
  top: y - grow,
  width: w + grow * 2,
  height: h + grow * 2,
});
