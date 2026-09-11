import { OUTRO_FALLBACK_SECONDS } from "../../shared/outro";
import type { VideoConfig } from "../../timing";
import script from "./script.json";

/**
 * 장면별 포스터 이미지와 하단 출처.
 *
 * 이 영상은 장면을 코드로 그리지 않는다. 완성된 1080x1920 비율 포스터가
 * public/img/0911/ 에 있고, 장면 컴포넌트는 그것을 깔고 나레이션·자막만 얹는다.
 * (아웃트로만 포스터가 없어서 src/shared/poster/PosterOutro.tsx 로 그린다)
 *
 * script.json 순서와 맞춘다. 아웃트로는 여기 넣지 않는다.
 */
export const SCENE_META = [
  {
    name: "1 · 핫픽스 총정리",
    image: "img/0911/1.png",
    source: "출처: 오버워치 공식 패치 노트 (2026.09.10)",
  },
  {
    name: "2 · 라마트라",
    image: "img/0911/2.png",
    source: "출처: 오버워치 공식 9/10 패치 노트",
  },
  {
    name: "3 · 제트팩 캣",
    image: "img/0911/3.png",
    source: "출처: 오버워치 공식 9/10 패치 노트",
  },
  {
    name: "4 · 벤데타",
    image: "img/0911/4.png",
    source: "출처: 오버워치 공식 9/10 패치 노트",
  },
  {
    name: "5 · 위도우메이커",
    image: "img/0911/5.png",
    source: "출처: 오버워치 공식 한국어 9/9 패치 노트",
  },
] as const;

export const VIDEO: VideoConfig = {
  id: "hotfix-0910",
  compositionId: "Hotfix0910",
  script,
  /** durations.json 이 없을 때 쓸 장면 길이(초). script.json 순서 + 아웃트로 */
  fallbackSeconds: [12, 14, 14, 13, 15, OUTRO_FALLBACK_SECONDS],
};
