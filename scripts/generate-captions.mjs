/**
 * whisper.cpp 로 public/voice/*.mp3 를 전사해서
 * public/captions/sceneN.json (단어 단위 타임스탬프) 을 만든다.
 *
 * 사용:
 *   npm run captions                       # 전체
 *   npm run captions -- --only scene3      # 한 장면만
 *   npm run captions -- --model large-v3-turbo
 *
 * 필요한 것:
 *   - 최초 1회 whisper.cpp 빌드 + 모델 다운로드 (수 GB, 시간이 걸린다)
 *   - ffmpeg (mp3 → 16kHz wav 변환용).  macOS: brew install ffmpeg
 *     단, Gemini 판(generate-voice-gemini.py)을 썼다면 .cache/whisper-wav 에
 *     이미 16kHz wav 가 있어서 ffmpeg 없이도 돌아간다.
 *
 * 참고: `npm run voice` 가 이미 edge-tts 의 단어 경계로 같은 JSON 을 만들어 두기 때문에
 * 보통은 이 스크립트를 돌릴 필요가 없다. 원문 그대로라 오히려 더 정확하다.
 * ASR 로 다시 뽑고 싶을 때만 쓰고, 결과는 같은 파일을 덮어쓴다.
 * (덮어쓴 뒤 `npm run voice` 를 다시 돌리면 되돌아가므로, 유지하려면 `-- --no-captions`)
 *
 * 자막을 아예 끄려면 src/theme.ts 의 SHOW_CAPTIONS 를 false 로 두면 된다.
 * 이 JSON 이 없어도 영상은 그대로 렌더된다.
 */

import {
  downloadWhisperModel,
  installWhisperCpp,
  toCaptions,
  transcribe,
} from "@remotion/install-whisper-cpp";
import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const VIDEOS_SRC = path.join(ROOT, "src", "videos");
const WHISPER_DIR = path.join(ROOT, "whisper.cpp");
const WHISPER_VERSION = "1.5.5";

const arg = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`);
  return i === -1 ? fallback : process.argv[i + 1];
};

const model = arg("model", "medium");
const only = arg("only", null);

/** src/videos/ 아래에서 script.json 을 가진 폴더 목록 */
const listVideos = () =>
  fs.existsSync(VIDEOS_SRC)
    ? fs
        .readdirSync(VIDEOS_SRC)
        .filter((d) => fs.existsSync(path.join(VIDEOS_SRC, d, "script.json")))
        .sort()
    : [];

const resolveVideo = () => {
  const available = listVideos();
  if (available.length === 0) {
    console.error("src/videos/ 아래에 영상 폴더가 없습니다.");
    process.exit(1);
  }
  const requested = arg("video", null);
  if (requested === null) {
    if (available.length === 1) {
      return available[0];
    }
    console.error("--video 로 영상을 지정하세요. 사용 가능:");
    available.forEach((v) => console.error("  " + v));
    process.exit(1);
  }
  if (!available.includes(requested)) {
    console.error(`'${requested}' 영상을 찾을 수 없습니다. 사용 가능:`);
    available.forEach((v) => console.error("  " + v));
    process.exit(1);
  }
  return requested;
};

const VIDEO = resolveVideo();
const VOICE_DIR = path.join(ROOT, "public", "videos", VIDEO, "voice");
const CAPTIONS_DIR = path.join(ROOT, "public", "videos", VIDEO, "captions");
const WHISPER_WAV_DIR = path.join(ROOT, ".cache", "whisper-wav", VIDEO);
console.log(`영상: ${VIDEO}`);

const hasFfmpeg = () =>
  spawnSync("ffmpeg", ["-version"], { stdio: "ignore" }).status === 0;

const requireFfmpeg = () => {
  if (hasFfmpeg()) {
    return;
  }
  console.error(
    [
      "ffmpeg 를 찾을 수 없습니다. mp3 를 16kHz wav 로 바꿔야 전사가 가능합니다.",
      "",
      "  macOS:  brew install ffmpeg",
      "  Ubuntu: sudo apt install ffmpeg",
      "",
      "자막 없이 렌더하려면 src/theme.ts 의 SHOW_CAPTIONS 를 false 로 두세요.",
    ].join("\n"),
  );
  process.exit(1);
};

/** 문장부호·공백을 뺀 실제 글자(한글/영문/숫자)만 남긴다 */
const lettersOf = (text) => [...text].filter((ch) => /[\p{L}\p{N}]/u.test(ch));

/**
 * 두 글자열을 최장 공통 부분수열로 정렬해서,
 * `heard[i]` 가 `source` 의 몇 번째 글자에 대응하는지 돌려준다.
 *
 * whisper 가 "125에서 150" 을 "125~150" 처럼 줄여 들어도
 * 나머지 글자를 기준으로 위치를 맞출 수 있다.
 */
const alignLetters = (heard, source) => {
  const n = heard.length;
  const m = source.length;

  // dp[i][j] = heard[i..] 와 source[j..] 의 LCS 길이
  const dp = Array.from({ length: n + 1 }, () => new Uint16Array(m + 1));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i][j] =
        heard[i] === source[j]
          ? dp[i + 1][j + 1] + 1
          : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }

  const map = new Array(n).fill(-1);
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (heard[i] === source[j]) {
      map[i] = j;
      i += 1;
      j += 1;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      i += 1;
    } else {
      j += 1;
    }
  }

  // 매칭되지 않은 자리는 직전 매칭 위치를 이어받는다 (단조 증가 유지)
  let last = -1;
  for (let k = 0; k < n; k++) {
    if (map[k] >= 0) {
      last = map[k];
    } else {
      map[k] = last;
    }
  }
  return { map, matched: map.filter((v) => v >= 0).length };
};

/**
 * whisper 의 타임스탬프는 그대로 두고, 텍스트만 원문(script.json)으로 바꿔 끼운다.
 * ASR 오인식이 자막에 노출되는 것도 막고, 원문의 문장부호도 되살린다.
 *
 * 글자 수가 정확히 같지 않아도 정렬로 맞춘다. 너무 많이 어긋나면 null 을 돌려
 * whisper 결과를 그대로 쓰게 한다.
 */
const snapToScript = (captions, sourceText) => {
  const heardLetters = captions.flatMap((caption) => lettersOf(caption.text));
  const sourceLetters = lettersOf(sourceText);

  if (heardLetters.length === 0 || sourceLetters.length === 0) {
    return null;
  }

  const { map, matched } = alignLetters(heardLetters, sourceLetters);

  // 원문 글자의 80% 이상이 대응되지 않으면 다른 내용으로 보고 포기한다
  if (matched / sourceLetters.length < 0.8) {
    return null;
  }

  // n번째 글자가 원문에서 몇 번째 문자인지
  const positions = [];
  [...sourceText].forEach((ch, i) => {
    if (/[\p{L}\p{N}]/u.test(ch)) {
      positions.push(i);
    }
  });

  let consumed = 0;
  let cursor = 0;

  const snapped = captions.map((caption, index) => {
    const length = lettersOf(caption.text).length;
    if (length === 0) {
      return caption;
    }

    consumed += length;
    const letterIndex = map[consumed - 1];
    if (letterIndex < 0) {
      return caption;
    }

    // 마지막 글자 뒤에 붙은 문장부호(,.?!)까지 이 토큰에 포함시킨다.
    let stop = positions[letterIndex];
    while (
      stop + 1 < sourceText.length &&
      /[^\s\p{L}\p{N}]/u.test(sourceText[stop + 1])
    ) {
      stop += 1;
    }

    if (stop < cursor) {
      return { ...caption, text: "" };
    }

    const slice = sourceText.slice(cursor, stop + 1);
    cursor = stop + 1;
    return { ...caption, text: index === 0 ? slice.trimStart() : slice };
  });

  // 마지막 글자 뒤에 남은 문장부호를 마지막 토큰에 붙인다.
  const tail = sourceText.slice(cursor);
  if (tail && snapped.length > 0) {
    const last = snapped[snapped.length - 1];
    snapped[snapped.length - 1] = { ...last, text: last.text + tail };
  }

  return snapped.filter((caption) => caption.text !== "");
};

/**
 * whisper 가 가끔 마지막 토큰의 끝 시각을 오디오 길이 밖으로 늘린다.
 * 오디오 길이로 잘라내고, 그 바람에 길이가 0이 된 토큰은 앞 토큰에 합친다.
 * (안 그러면 나레이션이 끝난 뒤에 자막이 뜨거나 장면 밖으로 밀려 잘린다)
 */
const clampToAudio = (captions, durationMs) => {
  if (!durationMs) {
    return captions;
  }

  const out = [];
  for (const caption of captions) {
    const startMs = Math.min(caption.startMs, durationMs);
    const endMs = Math.min(caption.endMs, durationMs);

    if (endMs - startMs < 1 && out.length > 0) {
      const prev = out[out.length - 1];
      out[out.length - 1] = { ...prev, text: prev.text + caption.text };
      continue;
    }

    out.push({
      ...caption,
      startMs,
      endMs,
      timestampMs:
        caption.timestampMs === null
          ? null
          : Math.min(caption.timestampMs, durationMs),
    });
  }
  return out;
};

/** 한 페이지에 담을 최대 글자 수 (44px 기준 두 줄) */
const MAX_PAGE_CHARS = 44;
/** 쉼표에서 끊으려면 최소 이만큼은 쌓여 있어야 한다 (나열이 잘게 쪼개지는 것 방지) */
const MIN_COMMA_CHARS = 16;

const TRAILING = `["'\u201d\u2019)\\]]*`;
const ENDS_SENTENCE = new RegExp(`[.!?]${TRAILING}$`);
const ENDS_COMMA = new RegExp(`[,]${TRAILING}$`);

/**
 * 자막을 시간(고정 ms)이 아니라 의미 단위로 끊는다.
 * createTikTokStyleCaptions 가 pageBreakAfter 를 보고 페이지를 나눈다.
 *
 * - 문장 끝(. ! ?) 에서는 항상 끊는다
 * - 쉼표는 이미 충분히 쌓였을 때만 끊는다 ("소셜, 일반," 이 따로 놀지 않게)
 * - 부호 없이 길어지면 두 줄 한도에서 강제로 끊는다
 */
const markPageBreaks = (captions) => {
  let length = 0;

  return captions.map((caption) => {
    const text = caption.text.trimEnd();
    length += caption.text.trim().length;

    const pageBreakAfter =
      ENDS_SENTENCE.test(text) ||
      (ENDS_COMMA.test(text) && length >= MIN_COMMA_CHARS) ||
      length >= MAX_PAGE_CHARS;

    if (pageBreakAfter) {
      length = 0;
    }

    return { ...caption, pageBreakAfter };
  });
};

const durations = (() => {
  const file = path.join(VOICE_DIR, "durations.json");
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf-8")) : {};
})();

const scenes = JSON.parse(
  fs.readFileSync(path.join(VIDEOS_SRC, VIDEO, "script.json"), "utf-8"),
);

fs.mkdirSync(CAPTIONS_DIR, { recursive: true });

console.log(`whisper.cpp ${WHISPER_VERSION} 준비 중...`);
await installWhisperCpp({ to: WHISPER_DIR, version: WHISPER_VERSION });

console.log(`모델 "${model}" 준비 중... (최초 1회는 오래 걸립니다)`);
await downloadWhisperModel({ model, folder: WHISPER_DIR });

for (const scene of scenes) {
  if (only && scene.id !== only) {
    continue;
  }

  // Gemini 판이 미리 만들어 둔 16kHz wav 가 있으면 변환을 건너뛴다.
  const prepared = path.join(WHISPER_WAV_DIR, `${scene.id}.wav`);
  const source = [
    path.join(VOICE_DIR, `${scene.id}.mp3`),
    path.join(VOICE_DIR, `${scene.id}.wav`),
  ].find((candidate) => fs.existsSync(candidate));

  let wav;
  let temporary = false;

  if (fs.existsSync(prepared)) {
    wav = prepared;
  } else if (source) {
    requireFfmpeg();
    wav = path.join(os.tmpdir(), `teamdrive-${scene.id}.wav`);
    temporary = true;
    execFileSync(
      "ffmpeg",
      [
        "-i",
        source,
        "-ar",
        "16000",
        "-ac",
        "1",
        "-c:a",
        "pcm_s16le",
        wav,
        "-y",
      ],
      { stdio: "ignore" },
    );
  } else {
    console.warn(`  건너뜀: ${scene.id} 나레이션 없음 (먼저 npm run voice)`);
    continue;
  }

  console.log(`  ▶ ${scene.id} 전사 중...`);
  const whisperCppOutput = await transcribe({
    model,
    whisperPath: WHISPER_DIR,
    whisperCppVersion: WHISPER_VERSION,
    inputPath: wav,
    tokenLevelTimestamps: true,
    language: "ko",
    splitOnWord: true,
  });

  const { captions } = toCaptions({ whisperCppOutput });

  const snapped = snapToScript(captions, scene.text);
  if (!snapped) {
    console.warn(
      `     주의: ${scene.id} 는 원문과 글자 수가 달라 whisper 인식 결과를 그대로 씁니다.`,
    );
  }

  const broken = markPageBreaks(snapped ?? captions);

  const clamped = clampToAudio(
    broken,
    durations[scene.id] ? durations[scene.id] * 1000 : null,
  );

  const out = path.join(CAPTIONS_DIR, `${scene.id}.json`);
  fs.writeFileSync(out, `${JSON.stringify(clamped, null, 2)}\n`);
  if (temporary) {
    fs.rmSync(wav, { force: true });
  }

  console.log(
    `     ${scene.id}.json · ${clamped.length}개 토큰${snapped ? " (원문으로 보정)" : ""}`,
  );
}

console.log(`\n자막 JSON 생성 완료 → ${path.relative(ROOT, CAPTIONS_DIR)}/`);
