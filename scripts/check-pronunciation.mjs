/**
 * 생성된 나레이션이 원문대로 발음됐는지 whisper 로 확인한다.
 *
 *   node scripts/check-pronunciation.mjs --video s4-midseason --only scene1
 *
 * 자막용 스크립트와 달리 **원문 스냅을 하지 않고 whisper 가 들은 그대로** 보여준다.
 * TTS 가 단어를 뭉개거나 잘못 읽었는지 귀 없이 잡아내는 용도.
 */

import { toCaptions, transcribe } from "@remotion/install-whisper-cpp";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const arg = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`);
  return i === -1 ? fallback : process.argv[i + 1];
};

const video = arg("video", null);
const only = arg("only", null);
const model = arg("model", "medium");

if (!video) {
  console.error("사용법: node scripts/check-pronunciation.mjs --video <영상> [--only sceneN]");
  process.exit(1);
}

const WHISPER_DIR = path.join(ROOT, "whisper.cpp");
const WAV_DIR = path.join(ROOT, ".cache", "whisper-wav", video);
const scenes = JSON.parse(
  fs.readFileSync(path.join(ROOT, "src", "videos", video, "script.json"), "utf-8"),
);

const letters = (t) => [...t].filter((c) => /[\p{L}\p{N}]/u.test(c)).join("");

for (const scene of scenes) {
  if (only && scene.id !== only) continue;

  const wav = path.join(WAV_DIR, `${scene.id}.wav`);
  if (!fs.existsSync(wav)) {
    console.warn(`  건너뜀: ${scene.id} (${path.relative(ROOT, wav)} 없음)`);
    continue;
  }

  // 세그먼트 텍스트는 UTF-8 이 중간에서 잘려 깨진다.
  // 자막 파이프라인과 같이 토큰 단위로 받아 toCaptions 로 합쳐야 한글이 온전하다.
  const whisperCppOutput = await transcribe({
    model,
    whisperPath: WHISPER_DIR,
    whisperCppVersion: "1.5.5",
    inputPath: wav,
    tokenLevelTimestamps: true,
    language: "ko",
    splitOnWord: true,
  });

  const { captions } = toCaptions({ whisperCppOutput });
  const heard = captions.map((c) => c.text).join("").trim();
  console.log(`\n[${scene.id}]`);
  console.log(`  원문: ${scene.text}`);
  console.log(`  들림: ${heard}`);

  // 원문 단어 중 whisper 가 못 알아들은 것 표시
  const heardLetters = letters(heard);
  const missing = scene.text
    .split(/\s+/)
    .map((w) => letters(w))
    .filter((w) => w.length >= 2 && !heardLetters.includes(w));
  if (missing.length > 0) {
    console.log(`  ⚠ 다르게 들린 단어: ${missing.join(", ")}`);
  }
}

fs.rmSync(path.join(ROOT, "tmp.json"), { force: true });
