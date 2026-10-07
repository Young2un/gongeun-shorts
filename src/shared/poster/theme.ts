/**
 * 라이트 "오버워치 테크" 포스터 테마.
 *
 * public/img/0911/*.png 로 받은 장면 포스터에서 실제 픽셀을 뽑아 맞춘 토큰이다.
 * 포스터가 없는 장면(아웃트로 등)을 코드로 그릴 때 같은 인상이 나오도록 쓴다.
 *
 * 기본 다크 테마(src/theme.ts)와는 별개다. 이 테마를 쓰는 장면은
 * COLORS 대신 POSTER 를 본다.
 */

export const POSTER = {
  /** 페이지 배경 (위 밝음 → 아래 약간 어두움) */
  bg0: "#F7F3F0",
  bg1: "#E4E1E1",
  bg2: "#D9D6D7",
  /** 제목용 진한 잉크 */
  ink: "#1E2A33",
  /** 본문 잉크 */
  body: "#333D45",
  /** 강조 오렌지 (포스터에서 추출) */
  orange: "#F65A01",
  orangeSoft: "#FF8A3D",
  /** 카드 바탕 */
  card: "#FCF7F5",
  cardBorder: "rgba(30,42,51,0.14)",
  /** 어두운 아이콘 타일 */
  slate: "#3A444C",
  /** 장식용 옅은 회색 캡션 (HEROES MAKE A BRIGHTER TOMORROW 등) */
  faint: "#AAA3A0",
  /** 치지직 브랜드 컬러 */
  chzzk: "#00FFA3",
} as const;

/**
 * 포스터 공통 레이아웃 (1080x1920 기준).
 *
 * 아래 값들은 받은 포스터 5장의 실제 픽셀 분포를 재서 잡았다:
 *   ~1710      마지막 카드가 끝나는 지점
 *   1715~1760  빈 구간
 *   1765~1805  포스터가 자체적으로 그린 출처 줄
 *   1810~1920  빈 구간
 * 그래서 1715 아래를 통째로 자막·출처 자리로 쓴다
 * (포스터 자체 출처 줄은 가려지므로 같은 내용을 SOURCE_Y 에 다시 그린다).
 */
export const POSTER_LAYOUT = {
  /** 하단 스크림이 페이드로 시작되는 높이 */
  scrimFrom: 1700,
  /**
   * 스크림이 불투명해지는 높이.
   * 포스터가 자체적으로 그린 출처 줄(1765~1805)을 확실히 덮어야 한다 —
   * 반투명하게 두면 진한 잉크 글자가 자막 뒤로 비쳐 출처가 두 번 보인다.
   */
  scrimSolid: 1742,
  /** 자막 블록의 아래쪽 기준선 */
  captionBottom: 1852,
  captionFontSize: 38,
  captionMaxWidth: 960,
  /** 출처 한 줄의 위쪽 기준선 */
  sourceY: 1864,
  sourceFontSize: 26,
} as const;

/**
 * 포스터 세트가 바뀌면 이 값들도 다시 재야 한다.
 * 위 기본값은 0911 라이트 세트에서 잰 것이고, 하단 여백이 다른 세트는
 * `meta.ts` 에서 필요한 값만 덮어쓴다.
 */
export type PosterLayout = {
  -readonly [K in keyof typeof POSTER_LAYOUT]: number;
};

export const posterLayout = (
  overrides: Partial<PosterLayout> = {},
): PosterLayout => ({ ...POSTER_LAYOUT, ...overrides });

/**
 * 포스터에 거는 켄번즈 세기.
 *
 * 포스터는 화면을 정확히 채우기 때문에 확대하면 반드시 어딘가가 잘린다.
 * 위는 장식 여백이라 잘려도 되지만, 아래는 확대한 만큼 카드가 스크림 밑으로
 * 밀려 들어간다. 하단 여백이 좁은 세트는 `travel` 을 줄여야 한다.
 */
export type PosterMotion = {
  /** 시작 배율. 1 이면 오버스캔이 없어 드리프트가 가장자리를 드러낸다 */
  readonly from: number;
  /** 장면 동안 늘어나는 배율 (전역 MOTION 이 곱해진다) */
  readonly travel: number;
  /** 가로 드리프트 폭 (화면 폭 %) */
  readonly driftX: number;
  /** 세로 드리프트 폭 (화면 높이 %) */
  readonly driftY: number;
};

export const POSTER_MOTION: PosterMotion = {
  from: 1.03,
  travel: 0.05,
  driftX: 0.7,
  driftY: 0.5,
};
