/**
 * 팀 드라이브 쇼츠 · 디자인 토큰과 전역 설정.
 * 다크 게임 인포그래픽 카드 스타일.
 */

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

/**
 * 테마.
 * "dark" = 차분한 기본 · "neon" = 화려한 e스포츠 방송 톤
 * 이 한 줄만 바꾸면 색·배경·카드 테두리·제목 글로우가 전부 따라간다.
 */
export type ThemeName = "dark" | "neon";
export const THEME: ThemeName = "dark";

/**
 * 색은 역할별로 고정한다.
 * 승리/성공/상승 = green, 나·솔로 = blue, 최종 보상·칭호 = gold, 그 외 강조 = orange.
 * 치지직 플랫폼을 가리킬 때만 chzzk. 장식 목적으로 섞지 말 것.
 */
type Palette = {
  readonly bg0: string;
  readonly bg1: string;
  readonly panel: string;
  readonly panelBorder: string;
  readonly white: string;
  readonly orange: string;
  readonly orangeGlow: string;
  readonly green: string;
  readonly blue: string;
  readonly gold: string;
  readonly grey: string;
  readonly dim: string;
  readonly chzzk: string;
  readonly onBright: string;
  /** 카드 테두리에 얹는 림 라이트 */
  readonly rim: string;
  /** 배경 광선 색 */
  readonly beam: string;
};

const PALETTES: Record<ThemeName, Palette> = {
  dark: {
    bg0: "#070A0F",
    bg1: "#0E141C",
    panel: "rgba(12,18,26,0.82)",
    panelBorder: "rgba(255,255,255,0.10)",
    white: "#FFFFFF",
    orange: "#F7941D",
    orangeGlow: "rgba(247,148,29,0.35)",
    green: "#8CDB2E",
    blue: "#3B8BEB",
    gold: "#F5C518",
    grey: "#C9CFD8",
    dim: "rgba(255,255,255,0.55)",
    chzzk: "#00FFA3",
    onBright: "#150E00",
    rim: "rgba(255,255,255,0.10)",
    beam: "rgba(247,148,29,0.14)",
  },
  neon: {
    bg0: "#080418",
    bg1: "#1C1046",
    panel: "rgba(26,16,58,0.74)",
    panelBorder: "rgba(255,255,255,0.14)",
    white: "#FFFFFF",
    orange: "#FF9A1F",
    orangeGlow: "rgba(255,154,31,0.45)",
    green: "#7DF64A",
    blue: "#4DA3FF",
    gold: "#FFD34D",
    grey: "#C9CFD8",
    dim: "rgba(255,255,255,0.62)",
    chzzk: "#00FFA3",
    onBright: "#150E00",
    rim: "#8B5CF6",
    beam: "rgba(139,92,246,0.20)",
  },
};

export const COLORS = PALETTES[THEME];

/** 테마별 연출 스위치 */
type ThemeFx = {
  /** 카드 테두리에 림 라이트 + 바깥 글로우 */
  readonly cardRim: boolean;
  /** 배경에 비스듬한 광선 */
  readonly beams: boolean;
  /** 제목 흰 글자에 보라 헤일로 */
  readonly titleHalo: boolean;
};

const FX: Record<ThemeName, ThemeFx> = {
  dark: { cardRim: false, beams: false, titleHalo: false },
  neon: { cardRim: true, beams: true, titleHalo: true },
};

export const THEME_FX = FX[THEME];

/** 좌우 안전 여백 */
export const MARGIN = 50;

/** 카드 */
export const CARD = {
  radius: 20,
  padding: 42,
  headerHeight: 64,
  headerRadius: 12,
} as const;

/**
 * 공통 레이아웃 앵커 (1080x1920 기준 절대 좌표).
 *
 * 참고: 쇼츠 UI(하단 제목·설명 약 390px, 우측 버튼 약 150px)를 기준으로 보면
 * 자막·출처 카드가 가려진다. SHOW_SAFE_AREA 로 확인할 수 있고,
 * 안전 영역에 맞추려면 값을 위로 당기면 된다 (그만큼 카드 영역이 줄어든다).
 */
export const LAYOUT = {
  kickerY: 46,
  titleY: 128,
  cardsY: 548,
  /** 카드 영역의 아래 한계 (그 아래는 자막 자리) */
  cardsBottom: 1590,
  /** 자막 블록의 아래쪽 기준선 (여러 줄이면 위로 자란다) */
  captionBottom: 1690,
  sourceY: 1730,
} as const;

/** 장면 간 전환 길이 (0.4초) */
export const TRANSITION_FRAMES = Math.round(0.4 * FPS);

/**
 * 장면이 시작되고 나레이션이 나오기까지의 여백 (0.4초).
 * 전환(slide) 길이와 같게 두면, 슬라이드가 끝난 뒤에 말이 시작된다.
 * 이게 없으면 다음 장면 첫 마디가 화면 전환에 묻힌다.
 */
export const SCENE_HEAD_SECONDS = 0.4;

/** 나레이션이 끝난 뒤 다음 장면으로 넘어가기 전 여유 (0.4초) */
export const SCENE_TAIL_SECONDS = 0.4;

/**
 * 유튜브 쇼츠 UI 가 덮는 영역 (1080x1920 기준, 보수적으로 잡은 값).
 * 하단은 제목·채널명·설명, 우측은 좋아요/댓글/공유 버튼이 올라온다.
 */
export const SAFE_AREA = {
  top: 180,
  bottom: 390,
  side: 60,
  /** 우측 버튼이 차지하는 폭 */
  right: 150,
  /** 우측 버튼이 시작되는 높이 */
  rightFrom: 1000,
} as const;

/** 세이프존 가이드 오버레이 (개발용). 출력 전에는 반드시 false */
export const SHOW_SAFE_AREA = false;

/** 하단 출처 카드 on/off */
export const SHOW_SOURCE_CARD = true;

/**
 * 화면 모션 강도.
 * 0 = 정적 (배경 흐름·카드 스윕·제목 글로우 끔)
 * 1 = 기본
 * 1.5 이상 = 과하게. 정보 전달형에서는 1 근처를 권장한다.
 */
export const MOTION = 0.6;

/** 자막 on/off */
export const SHOW_CAPTIONS = true;

/**
 * 자막 페이지 최대 길이(ms).
 * 실제 분할은 문장부호(pageBreakAfter)로 하고, 이 값은
 * 부호 없이 길게 이어질 때를 대비한 상한이다.
 */
export const CAPTION_PAGE_MS = 5000;

/** 배경음악 */
export const BGM = {
  src: "shared/bgm.mp3",
  /** 나레이션이 없을 때의 볼륨 */
  volume: 0.12,
  /** 나레이션 구간에서 낮추는 볼륨(덕킹) */
  duckedVolume: 0.06,
} as const;

/** #RRGGBB 를 어둡게 (0~1) */
export const shade = (hex: string, amount: number) => {
  const n = parseInt(hex.slice(1), 16);
  const channel = (shift: number) =>
    Math.round(((n >> shift) & 255) * (1 - amount));
  return `rgb(${channel(16)}, ${channel(8)}, ${channel(0)})`;
};

/** #RRGGBB 에 알파 적용 */
export const withAlpha = (hex: string, alpha: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
};
