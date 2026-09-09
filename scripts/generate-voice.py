#!/usr/bin/env python3
"""
edge-tts 로 src/script.json 의 장면별 나레이션을 public/voice/sceneN.mp3 로 생성하고,
각 mp3 의 실제 길이를 public/voice/durations.json 에 기록한다.

TTS 가 알려주는 단어 경계(WordBoundary)를 그대로 public/captions/sceneN.json 으로도
저장하기 때문에, whisper 없이도 자막이 바로 붙는다.
ASR 기반 자막으로 바꾸고 싶으면 `npm run captions` 로 덮어쓰면 된다.

설치:
    pip install edge-tts mutagen

사용:
    python3 scripts/generate-voice.py                    # 기본 음성(남성, InJoon)
    python3 scripts/generate-voice.py --voice sunhi      # 여성(SunHi)
    python3 scripts/generate-voice.py --rate "+12%"      # 말 속도 조절
    python3 scripts/generate-voice.py --only scene3      # 특정 장면만 다시 생성
"""

import argparse
import asyncio
import json
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SCRIPT_JSON = os.path.join(ROOT, "src", "script.json")
VOICE_DIR = os.path.join(ROOT, "public", "voice")
CAPTIONS_DIR = os.path.join(ROOT, "public", "captions")
DURATIONS_JSON = os.path.join(VOICE_DIR, "durations.json")

# edge-tts 의 offset/duration 은 100나노초 단위다.
TICKS_PER_MS = 10_000

VOICES = {
    "injoon": "ko-KR-InJoonNeural",
    "sunhi": "ko-KR-SunHiNeural",
}


def load_scenes():
    with open(SCRIPT_JSON, encoding="utf-8") as f:
        return json.load(f)


async def synthesize(text, voice, rate, volume, pitch, out_path):
    """mp3 를 저장하면서 단어 경계(WordBoundary) 타임스탬프도 함께 모은다."""
    import edge_tts

    try:
        # edge-tts 7.x: 단어 단위 경계를 요청한다.
        communicate = edge_tts.Communicate(
            text, voice, rate=rate, volume=volume, pitch=pitch, boundary="WordBoundary"
        )
    except TypeError:
        # 구버전 edge-tts 는 boundary 인자를 모른다 → 문장 단위로만 받는다.
        communicate = edge_tts.Communicate(
            text, voice, rate=rate, volume=volume, pitch=pitch
        )

    boundaries = []
    with open(out_path, "wb") as f:
        async for chunk in communicate.stream():
            if chunk["type"] == "audio":
                f.write(chunk["data"])
            elif chunk["type"] == "WordBoundary":
                boundaries.append(
                    {
                        "text": chunk["text"],
                        "startMs": chunk["offset"] / TICKS_PER_MS,
                        "endMs": (chunk["offset"] + chunk["duration"]) / TICKS_PER_MS,
                    }
                )

    return boundaries


def dedupe_boundaries(boundaries):
    """
    edge-tts 는 문장부호 근처에서 한 단어를 두 이벤트에 걸쳐 중복해서 알려줄 때가 있다.
    (예: "3일. 뭔" 다음에 "일. 뭔지")

    앞 토큰이 여러 단어를 걸치고 있고 뒤 토큰이 그 꼬리를 그대로 반복하면
    반복 구간을 잘라내고, 잘라낸 토큰은 앞 단어에 이어 붙게 표시한다.
    """
    fixed = 0

    for i in range(1, len(boundaries)):
        prev = boundaries[i - 1]["text"]
        cur = boundaries[i]["text"]

        # 정상 토큰(공백 없는 한 단어)은 건드리지 않는다.
        if " " not in prev:
            continue

        for k in range(min(len(prev), len(cur)), 1, -1):
            if prev.endswith(cur[:k]):
                boundaries[i]["text"] = cur[k:]
                boundaries[i]["join"] = True
                fixed += 1
                break

    # 잘라낸 뒤 빈 토큰이 남으면 버린다.
    cleaned = [w for w in boundaries if w["text"]]
    return cleaned, fixed


def write_captions(scene_id, boundaries):
    """
    단어 경계를 @remotion/captions 의 Caption[] 형식으로 저장한다.
    text 는 공백까지 포함해야 하므로 첫 단어를 뺀 나머지 앞에 공백을 붙인다.
    """
    if not boundaries:
        return 0

    boundaries, fixed = dedupe_boundaries(boundaries)
    if fixed:
        print("     (단어 경계 중복 %d곳 정리)" % fixed)

    captions = []
    for i, word in enumerate(boundaries):
        start = int(round(word["startMs"]))
        end = int(round(word["endMs"]))
        captions.append(
            {
                "text": ("" if i == 0 or word.get("join") else " ") + word["text"],
                "startMs": start,
                "endMs": end,
                "timestampMs": (start + end) // 2,
                "confidence": None,
            }
        )

    os.makedirs(CAPTIONS_DIR, exist_ok=True)
    out = os.path.join(CAPTIONS_DIR, "%s.json" % scene_id)
    with open(out, "w", encoding="utf-8") as f:
        json.dump(captions, f, ensure_ascii=False, indent=2)
        f.write("\n")

    return len(captions)


def measure(path):
    from mutagen.mp3 import MP3

    return round(float(MP3(path).info.length), 3)


async def main():
    parser = argparse.ArgumentParser(description="edge-tts 나레이션 생성기")
    parser.add_argument(
        "--voice",
        default="injoon",
        help="injoon | sunhi | 또는 edge-tts 음성 이름 전체 (기본: injoon)",
    )
    parser.add_argument("--rate", default="+8%", help='말 속도, 예: "+8%%" (기본: +8%%)')
    parser.add_argument("--volume", default="+0%", help='볼륨, 예: "+0%%"')
    parser.add_argument("--pitch", default="+0Hz", help='피치, 예: "+0Hz"')
    parser.add_argument(
        "--only", default=None, help="특정 장면 id 하나만 생성 (예: scene3)"
    )
    parser.add_argument(
        "--no-captions",
        action="store_true",
        help="public/captions/*.json 을 만들지 않는다 (whisper 결과를 유지하고 싶을 때)",
    )
    args = parser.parse_args()

    voice = VOICES.get(args.voice.lower(), args.voice)

    os.makedirs(VOICE_DIR, exist_ok=True)
    scenes = load_scenes()

    # 기존 durations 를 읽어 두고, 다시 만든 장면만 갱신한다.
    durations = {}
    if os.path.exists(DURATIONS_JSON):
        try:
            with open(DURATIONS_JSON, encoding="utf-8") as f:
                durations = json.load(f)
        except (ValueError, OSError):
            durations = {}

    print("음성: %s / rate: %s" % (voice, args.rate))

    for scene in scenes:
        scene_id = scene["id"]
        out_path = os.path.join(VOICE_DIR, "%s.mp3" % scene_id)

        if args.only and scene_id != args.only:
            # 건너뛰더라도 이미 파일이 있으면 길이는 유지/보정한다.
            if os.path.exists(out_path) and scene_id not in durations:
                durations[scene_id] = measure(out_path)
            continue

        text = scene["text"]
        print("  ▶ %s (%d자) 생성 중..." % (scene_id, len(text)))
        boundaries = await synthesize(
            text, voice, args.rate, args.volume, args.pitch, out_path
        )
        durations[scene_id] = measure(out_path)

        token_count = 0
        if not args.no_captions:
            token_count = write_captions(scene_id, boundaries)

        print(
            "     %s.mp3 · %.2fs · 자막 토큰 %d개"
            % (scene_id, durations[scene_id], token_count)
        )

    # script.json 에 없는 장면은 정리한다.
    valid = {s["id"] for s in scenes}
    durations = {k: v for k, v in durations.items() if k in valid}

    with open(DURATIONS_JSON, "w", encoding="utf-8") as f:
        json.dump(durations, f, ensure_ascii=False, indent=2)
        f.write("\n")

    total = sum(durations.values())
    print("")
    print("durations.json 저장 완료 → %s" % DURATIONS_JSON)
    print("나레이션 합계: %.2fs (장면 간 0.4s 여유 포함 시 약 %.1fs)" % (total, total + 0.4 * len(durations)))


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        sys.exit(130)
