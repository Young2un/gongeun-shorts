/**
 * 폰트 로딩.
 *
 * - Noto Sans KR 은 @remotion/google-fonts 로 항상 로드된다 (본문 + 최종 폴백).
 * - Koverwatch / Big Noodle Titling 은 public/fonts/ 에 파일이 있을 때만 로드한다.
 *   파일이 없으면 조용히 건너뛰고, CSS font stack 이 자동으로 Noto Sans KR 로 떨어진다.
 *
 * 로컬 폰트는 900 weight 로 등록하기 때문에, 폰트가 없어서 폴백되더라도
 * `fontWeight: 900` 이 그대로 Noto Sans KR 900 에 적용된다.
 */

import { loadFont as loadLocalFont } from "@remotion/fonts";
import { loadFont as loadNotoSansKr } from "@remotion/google-fonts/NotoSansKR";
import { continueRender, delayRender, staticFile } from "remotion";

export const { fontFamily: notoSansKr } = loadNotoSansKr("normal", {
  weights: ["400", "500", "700", "900"],
  subsets: ["korean", "latin"],
  ignoreTooManyRequestsWarning: true,
});

const LOCAL_FONTS = [
  { family: "Koverwatch", file: "fonts/Koverwatch.ttf" },
  { family: "Big Noodle Titling", file: "fonts/big_noodle_titling.ttf" },
] as const;

const fileExists = async (url: string): Promise<boolean> => {
  try {
    const res = await fetch(url, { method: "HEAD" });
    if (res.status === 405 || res.status === 501) {
      // HEAD 를 지원하지 않는 서버는 GET 으로 다시 확인한다.
      return (await fetch(url)).ok;
    }
    return res.ok;
  } catch {
    return false;
  }
};

const handle = delayRender("로컬 폰트 확인 및 로딩");

Promise.all(
  LOCAL_FONTS.map(async ({ family, file }) => {
    const url = staticFile(file);
    if (!(await fileExists(url))) {
      return;
    }
    await loadLocalFont({
      family,
      url,
      format: "truetype",
      weight: "900",
      display: "block",
    });
  }),
)
  .catch(() => undefined)
  .then(() => continueRender(handle));

const quoted = (name: string) => `"${name}"`;

/** 제목용: Koverwatch → Noto Sans KR 900 */
export const TITLE_FONT = [
  quoted("Koverwatch"),
  quoted(notoSansKr),
  "sans-serif",
].join(", ");

/** 숫자·영문 강조용: Big Noodle Titling → Koverwatch → Noto Sans KR */
export const NUMERIC_FONT = [
  quoted("Big Noodle Titling"),
  quoted("Koverwatch"),
  quoted(notoSansKr),
  "sans-serif",
].join(", ");

/** 본문용: Noto Sans KR */
export const BODY_FONT = [quoted(notoSansKr), "sans-serif"].join(", ");
