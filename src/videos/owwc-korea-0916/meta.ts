import { OUTRO_FALLBACK_SECONDS } from "../../shared/outro";
import { posterLayout, type PosterMotion } from "../../shared/poster/theme";
import type { VideoConfig } from "../../timing";
import script from "./script.json";

/**
 * 장면별 포스터 이미지와 하단 출처.
 *
 * hotfix-0910 과 같은 방식이다 — 장면을 코드로 그리지 않고, 완성된 1080x1920 비율
 * 포스터(public/img/0916/)를 깔고 나레이션·자막·출처만 얹는다.
 * (아웃트로만 포스터가 없어서 공용 다크 ChannelOutro 를 쓴다)
 *
 * script.json 순서와 맞춘다. 아웃트로는 여기 넣지 않는다.
 */
export const SCENE_META = [
  {
    name: "1 · 우승 보상 떴다",
    image: "img/0916/1.png",
    source: "출처: 넥슨 오버워치 공식 이벤트 공지 (2026.09.16)",
  },
  {
    name: "2 · 수령 기간",
    image: "img/0916/2.png",
    source: "출처: 넥슨 오버워치 공식 공지 · 이벤트 기간",
  },
  {
    name: "3 · 참여 방법",
    image: "img/0916/3.png",
    source: "출처: 넥슨 오버워치 공식 공지 · 참여 방법",
  },
  {
    name: "4 · 보상 유의사항",
    image: "img/0916/4.png",
    source: "출처: 넥슨 오버워치 공식 공지 · 유의사항",
  },
  {
    name: "5 · 공은의 한마디",
    image: "img/0916/5.png",
    source: "출처: 넥슨 오버워치 공식 공지 · 이하 개인 의견",
  },
] as const;

/**
 * 이 포스터 세트의 강조색.
 *
 * 0911 세트는 라이트 "오버워치 테크" 톤이라 오렌지였지만, 0916 은 다크 e스포츠
 * 무대 톤이고 카드 테두리·번호 글로우가 전부 밝은 블루다. 기본 오렌지를 그대로
 * 두면 하단 스크림 선과 전환 발광 띠만 혼자 튄다.
 */
export const ACCENT = {
  line: "#3FA9F5",
  glow: "#8CD6FF",
} as const;

/**
 * 이 세트는 0911 라이트 세트보다 카드가 아래까지 내려온다.
 * 1번 포스터의 팁 카드 바닥이 1920 기준 약 1723 이라, 기본값(1742)으로 덮으면
 * 카드 아래 테두리가 잘린 것처럼 보인다. 포스터가 자체적으로 그린 출처 줄도
 * 없어서 스크림이 불투명할 이유가 없으므로, 경계를 내리고 자막을 그만큼 줄인다.
 */
export const LAYOUT = posterLayout({
  scrimFrom: 1690,
  scrimSolid: 1768,
  captionBottom: 1856,
  captionFontSize: 34,
  sourceY: 1868,
  sourceFontSize: 24,
});

/**
 * 켄번즈도 기본값보다 약하게 준다.
 * 포스터는 화면을 정확히 채우므로 확대한 만큼 아래가 스크림으로 밀려 내려간다.
 * 확대 끝(1.05)에서도 팁 카드 바닥이 scrimSolid 위에 남는 세기다.
 */
export const KEN_BURNS: PosterMotion = {
  from: 1.02,
  travel: 0.05,
  driftX: 0.5,
  driftY: 0.3,
};

export const VIDEO: VideoConfig = {
  id: "owwc-korea-0916",
  compositionId: "OwwcKorea0916",
  script,
  /** durations.json 이 없을 때 쓸 장면 길이(초). script.json 순서 + 아웃트로 */
  fallbackSeconds: [16, 15, 17, 16, 16, OUTRO_FALLBACK_SECONDS],
};
