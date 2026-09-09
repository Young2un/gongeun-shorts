/**
 * 새 영상 폴더를 만든다.
 *
 *   npm run new-video -- season5-patch "시즌 5 패치노트"
 *
 * 만들어지는 것:
 *   src/videos/<slug>/script.json   대본 (아웃트로 포함된 뼈대)
 *   src/videos/<slug>/meta.ts       장면 문구 + VideoConfig
 *   src/videos/<slug>/index.tsx     TransitionSeries 배치
 *   src/videos/<slug>/scenes/       (비어 있음 — 장면 컴포넌트를 여기 만든다)
 *   public/videos/<slug>/{voice,captions}/
 *
 * 만든 뒤에 할 일:
 *   1. script.json 에 대본 채우기
 *   2. meta.ts 의 SCENE_META 채우기
 *   3. scenes/ 에 장면 컴포넌트 만들기
 *   4. src/Root.tsx 에 컴포지션 등록
 *   5. npm run voice:gemini -- --video <slug>
 *      npm run captions -- --video <slug>
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const [slug, titleArg] = process.argv.slice(2);

if (!slug || !/^[a-z0-9][a-z0-9-]*$/.test(slug)) {
  console.error('사용법: npm run new-video -- <slug> ["영상 제목"]');
  console.error("  slug 은 영소문자·숫자·하이픈만 (예: season5-patch)");
  process.exit(1);
}

const title = titleArg ?? slug;
const srcDir = path.join(ROOT, "src", "videos", slug);
const publicDir = path.join(ROOT, "public", "videos", slug);

if (fs.existsSync(srcDir)) {
  console.error(`이미 있습니다: src/videos/${slug}`);
  process.exit(1);
}

/** PascalCase 컴포지션 id */
const compositionId = slug
  .split("-")
  .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
  .join("");

fs.mkdirSync(path.join(srcDir, "scenes"), { recursive: true });
fs.mkdirSync(path.join(publicDir, "voice"), { recursive: true });
fs.mkdirSync(path.join(publicDir, "captions"), { recursive: true });

// 공유 아웃트로 문구를 그대로 가져와 script.json 마지막에 넣는다
const outroSrc = fs.readFileSync(
  path.join(ROOT, "src", "shared", "outro.ts"),
  "utf-8",
);
const outroText = outroSrc.match(/text:\s*"([^"]+)"/)?.[1] ?? "";

fs.writeFileSync(
  path.join(srcDir, "script.json"),
  `${JSON.stringify(
    [
      { id: "scene1", text: "여기에 첫 장면 나레이션을 적는다." },
      { id: "outro", text: outroText },
    ],
    null,
    2,
  )}\n`,
);

fs.writeFileSync(
  path.join(srcDir, "meta.ts"),
  `import { OUTRO_FALLBACK_SECONDS } from "../../shared/outro";
import type { VideoConfig } from "../../timing";
import script from "./script.json";

/** 장면별 상단 소제목 · 하단 출처 (아웃트로 제외, script.json 순서와 맞춘다) */
export const SCENE_META = [
  {
    kicker: "소제목",
    source: ["출처 1줄", "출처 2줄"],
  },
] as const;

export const VIDEO: VideoConfig = {
  id: "${slug}",
  compositionId: "${compositionId}",
  script,
  /** durations.json 이 없을 때 쓸 장면 길이(초). script.json 순서 + 아웃트로 */
  fallbackSeconds: [8, OUTRO_FALLBACK_SECONDS],
};
`,
);

fs.writeFileSync(
  path.join(srcDir, "index.tsx"),
  `import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import React from "react";
import { AbsoluteFill } from "remotion";
import { Bgm } from "../../components/Bgm";
import { ChannelOutro } from "../../shared/ChannelOutro";
import { COLORS, TRANSITION_FRAMES } from "../../theme";
import {
  fallbackTimings,
  totalDurationInFrames,
  type VideoProps,
} from "../../timing";
import { VIDEO } from "./meta";

/** 0.4초 slide-left — 새 장면이 오른쪽에서 들어오며 화면이 왼쪽으로 밀린다. */
const slideLeft = (
  <TransitionSeries.Transition
    presentation={slide({ direction: "from-right" })}
    timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
  />
);

/** ${title} */
export const ${compositionId}: React.FC<VideoProps> = ({ scenes }) => {
  const timings =
    scenes.length === VIDEO.script.length ? scenes : fallbackTimings(VIDEO);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
      <TransitionSeries>
        {/* TODO: 장면 컴포넌트를 여기에 추가한다 */}
        {slideLeft}

        <TransitionSeries.Sequence
          durationInFrames={timings[timings.length - 1].durationInFrames}
          name="채널 홍보 (아웃트로)"
        >
          <ChannelOutro
            videoId={VIDEO.id}
            audioFrames={timings[timings.length - 1].audioFrames}
            durationInFrames={timings[timings.length - 1].durationInFrames}
          />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      <Bgm scenes={timings} totalFrames={totalDurationInFrames(timings)} />
    </AbsoluteFill>
  );
};
`,
);

console.log(`만들었습니다:
  src/videos/${slug}/          script.json · meta.ts · index.tsx · scenes/
  public/videos/${slug}/       voice/ · captions/

다음 순서:
  1. src/videos/${slug}/script.json 에 대본 채우기
  2. src/videos/${slug}/meta.ts 의 SCENE_META 채우기
  3. src/videos/${slug}/scenes/ 에 장면 컴포넌트 만들기
  4. src/Root.tsx 에 ${compositionId} 컴포지션 등록
  5. npm run voice:gemini -- --video ${slug}
     npm run captions -- --video ${slug}
     npx remotion render ${compositionId} out/${slug}.mp4`);
