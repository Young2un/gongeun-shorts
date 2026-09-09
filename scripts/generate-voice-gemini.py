#!/usr/bin/env python3
"""
Gemini API 의 프리빌트 보이스로 나레이션을 만든다.
edge-tts 판(generate-voice.py)과 같은 파일 구조를 쓰기 때문에 Remotion 코드는 그대로다.

  public/voice/sceneN.wav        나레이션 (24kHz / 16bit / mono)
  public/voice/durations.json    각 나레이션 길이(초)
  .cache/whisper-wav/sceneN.wav  자막용 16kHz 변환본 (npm run captions 가 그대로 씀)

설치:
    pip install google-genai

API 키는 다음 중 아무 방법이나 (앞에서부터 먼저 찾은 것을 쓴다):
    1) 프로젝트 루트의 .env 파일에  GEMINI_API_KEY=...     (gitignore 됨, 권장)
    2) 환경변수                     export GEMINI_API_KEY="..."
    3) 실행 인자                    --api-key "..."
    키 발급: https://aistudio.google.com/apikey

사용:
    python3 scripts/generate-voice-gemini.py                       # 기본 Charon
    python3 scripts/generate-voice-gemini.py --voice Kore
    python3 scripts/generate-voice-gemini.py --style "차분하고 신뢰감 있는 톤으로"
    python3 scripts/generate-voice-gemini.py --only scene3
    python3 scripts/generate-voice-gemini.py --model gemini-2.5-pro-preview-tts

요금 (2026-09 기준): 오디오 출력 $10 / 1M 토큰 · 25토큰 = 1초.
     이 영상(약 100초) 한 번 전체 생성에 약 $0.03.
     무료 티어를 쓸 경우 분당 3회 · 하루 10회 제한이 있으니 --pace 21 로 준다.

주의: Gemini TTS 는 단어 단위 타임스탬프를 주지 않는다.
     따라서 자막은 `npm run captions` (whisper) 로 따로 뽑아야 한다.
     edge-tts 판은 타임스탬프를 공짜로 주므로, 자막이 중요하면 그쪽이 유리하다.
"""

import argparse
import audioop
import json
import math
import os
import re
import sys
import time
import wave

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VIDEOS_SRC = os.path.join(ROOT, "src", "videos")

# --video 로 정해지는 경로들 (resolve_video 가 채운다)
SCRIPT_JSON = ""
VOICE_CONFIG_JSON = ""
VOICE_DIR = ""
CAPTIONS_DIR = ""
DURATIONS_JSON = ""
META_JSON = ""
WHISPER_DIR = ""
MP3_BACKUP_DIR = ""
TAKES_DIR = ""


def list_videos():
    """src/videos/ 아래에서 script.json 을 가진 폴더 목록"""
    if not os.path.isdir(VIDEOS_SRC):
        return []
    return sorted(
        d
        for d in os.listdir(VIDEOS_SRC)
        if os.path.isfile(os.path.join(VIDEOS_SRC, d, "script.json"))
    )


def resolve_video(name):
    """--video 값(또는 자동 선택)으로 경로들을 정한다."""
    global SCRIPT_JSON, VOICE_DIR, CAPTIONS_DIR, DURATIONS_JSON, META_JSON
    global WHISPER_DIR, MP3_BACKUP_DIR

    available = list_videos()
    if not available:
        print("src/videos/ 아래에 영상 폴더가 없습니다.", file=sys.stderr)
        sys.exit(1)

    if name is None:
        if len(available) == 1:
            name = available[0]
        else:
            print("--video 로 영상을 지정하세요. 사용 가능:", file=sys.stderr)
            for v in available:
                print("  " + v, file=sys.stderr)
            sys.exit(1)
    elif name not in available:
        print("'%s' 영상을 찾을 수 없습니다. 사용 가능:" % name, file=sys.stderr)
        for v in available:
            print("  " + v, file=sys.stderr)
        sys.exit(1)

    global VOICE_CONFIG_JSON
    SCRIPT_JSON = os.path.join(VIDEOS_SRC, name, "script.json")
    VOICE_CONFIG_JSON = os.path.join(VIDEOS_SRC, name, "voice.json")
    VOICE_DIR = os.path.join(ROOT, "public", "videos", name, "voice")
    CAPTIONS_DIR = os.path.join(ROOT, "public", "videos", name, "captions")
    DURATIONS_JSON = os.path.join(VOICE_DIR, "durations.json")
    META_JSON = os.path.join(VOICE_DIR, "meta.json")
    WHISPER_DIR = os.path.join(ROOT, ".cache", "whisper-wav", name)
    global TAKES_DIR
    TAKES_DIR = os.path.join(ROOT, "out", "takes", name)
    MP3_BACKUP_DIR = os.path.join(ROOT, ".cache", "edge-tts-mp3", name)
    return name

# Gemini TTS 출력 포맷 (고정)
SAMPLE_RATE = 24000
SAMPLE_WIDTH = 2
CHANNELS = 1
WHISPER_RATE = 16000

# 장면마다 생성 호출이 달라 음량이 최대 5dB 씩 튄다.
# 같은 목소리인데도 톤이 바뀐 것처럼 들리므로 공통 RMS 로 맞춘다.
# (int16 기준. 3500 ≈ -19.4 dBFS)
TARGET_RMS = 3500
PEAK_CEILING = 31000

# gemini-2.5-flash-preview-tts 는 무료 티어가 있어서 기본값으로 둔다.
# 더 최신 모델(Gemini 3.1 Flash TTS Preview 등)을 쓰려면 --model 로 지정.
# 요금/모델 목록: https://ai.google.dev/gemini-api/docs/pricing
DEFAULT_MODEL = "gemini-2.5-flash-preview-tts"

# 프리빌트 보이스. 모델 업데이트로 목록이 바뀔 수 있으니 --voice 는 아무 이름이나 받는다.
# https://ai.google.dev/gemini-api/docs/speech-generation 에서 최신 목록 확인.
VOICES = [
    "Zephyr", "Puck", "Charon", "Kore", "Fenrir", "Leda", "Orus", "Aoede",
    "Callirrhoe", "Autonoe", "Enceladus", "Iapetus", "Umbriel", "Algieba",
    "Despina", "Erinome", "Algenib", "Rasalgethi", "Laomedeia", "Achernar",
    "Alnilam", "Schedar", "Gacrux", "Pulcherrima", "Achird", "Zubenelgenubi",
    "Vindemiatrix", "Sadachbia", "Sadaltager", "Sulafat",
]

# 쇼츠용이라 속도를 살리되, 발음 명료도를 최우선으로 지시한다.
# "빠짐없이" 를 같이 넣어야 모델이 문장을 건너뛰지 않는다.
DEFAULT_STYLE = (
    "한국어 유튜브 쇼츠 나레이션. 모든 단어를 또박또박 정확하게 발음하고, "
    "조사와 문장 끝까지 흐리지 말고 분명하게 맺어줘. "
    "속도는 살짝 빠르게 유지하되 발음 명료도를 최우선으로 하고, "
    "주어진 문장은 하나도 빠뜨리지 말고 전부 읽어줘"
)


def load_dotenv():
    """
    프로젝트 루트의 .env 를 읽어 환경변수로 올린다.
    (의존성 없이 KEY=VALUE 한 줄씩만 처리한다. 이미 설정된 값은 덮어쓰지 않는다.)
    """
    path = os.path.join(ROOT, ".env")
    if not os.path.exists(path):
        return

    with open(path, encoding="utf-8") as f:
        for raw in f:
            line = raw.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, _, value = line.partition("=")
            key = key.strip()
            value = value.strip().strip('"').strip("'")
            if key and key not in os.environ:
                os.environ[key] = value


def load_scenes():
    with open(SCRIPT_JSON, encoding="utf-8") as f:
        return json.load(f)


def normalize_pcm(pcm):
    """공통 RMS 로 음량을 맞추되, 피크가 넘치면 게인을 줄여 클리핑을 막는다."""
    rms = audioop.rms(pcm, SAMPLE_WIDTH)
    if rms == 0:
        return pcm, 1.0

    gain = TARGET_RMS / float(rms)
    peak = audioop.max(pcm, SAMPLE_WIDTH)
    if peak * gain > PEAK_CEILING:
        gain = PEAK_CEILING / float(peak)

    return audioop.mul(pcm, SAMPLE_WIDTH, gain), gain


def write_scene_audio(scene_id, pcm):
    """본 파일 + whisper 용 16kHz 변환본을 함께 쓴다."""
    os.makedirs(VOICE_DIR, exist_ok=True)
    os.makedirs(WHISPER_DIR, exist_ok=True)
    write_wav(os.path.join(VOICE_DIR, "%s.wav" % scene_id), pcm, SAMPLE_RATE)
    pcm16, _ = audioop.ratecv(
        pcm, SAMPLE_WIDTH, CHANNELS, SAMPLE_RATE, WHISPER_RATE, None
    )
    write_wav(os.path.join(WHISPER_DIR, "%s.wav" % scene_id), pcm16, WHISPER_RATE)


def apply_take(scene_id, number):
    """골라둔 후보를 본 파일로 채택한다."""
    path = os.path.join(TAKES_DIR, "%s-%d.wav" % (scene_id, number))
    if not os.path.exists(path):
        print("후보를 찾을 수 없습니다: %s" % path, file=sys.stderr)
        sys.exit(1)

    with wave.open(path, "rb") as w:
        pcm = w.readframes(w.getnframes())

    write_scene_audio(scene_id, pcm)

    durations = {}
    if os.path.exists(DURATIONS_JSON):
        with open(DURATIONS_JSON, encoding="utf-8") as f:
            durations = json.load(f)
    durations[scene_id] = measure_audio(scene_id)
    save_durations(durations)

    print("%s ← %s (%.2fs)" % (scene_id, os.path.basename(path), durations[scene_id]))
    print("자막도 다시 맞추세요:")
    print("  npm run captions -- --video <영상> --only %s" % scene_id)


def measure_audio(scene_id):
    """
    디스크에 실제로 있는 나레이션 길이를 잰다 (wav 우선, 없으면 mp3).
    한 장면만 다시 생성했을 때 나머지 장면 길이가 옛날 값으로 남는 걸 막는다.
    """
    wav_path = os.path.join(VOICE_DIR, "%s.wav" % scene_id)
    if os.path.exists(wav_path):
        with wave.open(wav_path, "rb") as w:
            return round(w.getnframes() / float(w.getframerate()), 3)

    mp3_path = os.path.join(VOICE_DIR, "%s.mp3" % scene_id)
    if os.path.exists(mp3_path):
        try:
            from mutagen.mp3 import MP3

            return round(float(MP3(mp3_path).info.length), 3)
        except ImportError:
            return None

    return None


def load_meta():
    if os.path.exists(META_JSON):
        try:
            with open(META_JSON, encoding="utf-8") as f:
                return json.load(f)
        except (ValueError, OSError):
            pass
    return {}


def save_meta(meta):
    with open(META_JSON, "w", encoding="utf-8") as f:
        json.dump(meta, f, ensure_ascii=False, indent=2)
        f.write("\n")


def warn_if_mixed(meta, scenes):
    """
    장면마다 음성이 다르면(중간에 실패했거나 일부만 다시 뽑았을 때) 크게 경고한다.
    섞인 채로 렌더하면 영상 중간에 목소리가 바뀐다.
    """
    voices = {}
    for scene in scenes:
        entry = meta.get(scene["id"])
        voices.setdefault(entry["voice"] if entry else "(없음)", []).append(scene["id"])

    if len(voices) <= 1:
        return

    print("")
    print("!! 경고: 장면별 음성이 섞여 있습니다. 이대로 렌더하면 중간에 목소리가 바뀝니다.")
    for voice, ids in voices.items():
        print("   %-10s %s" % (voice, ", ".join(ids)))
    print("   → 부족한 장면만 다시 뽑으세요:  --only sceneN --voice <이름>")
    print("")


def save_durations(durations):
    with open(DURATIONS_JSON, "w", encoding="utf-8") as f:
        json.dump(durations, f, ensure_ascii=False, indent=2)
        f.write("\n")


def write_wav(path, pcm, rate):
    with wave.open(path, "wb") as w:
        w.setnchannels(CHANNELS)
        w.setsampwidth(SAMPLE_WIDTH)
        w.setframerate(rate)
        w.writeframes(pcm)


def retry_delay_from(message):
    """429 응답이 알려주는 대기 시간을 초 단위로 뽑는다."""
    for pattern in (r"'retryDelay': '([\d.]+)s'", r"retry in ([\d.]+)s"):
        found = re.search(pattern, message)
        if found:
            return float(found.group(1))
    return None


def synthesize(client, types, model, text, voice, style, max_retries=6):
    """
    429(RESOURCE_EXHAUSTED) 를 만나면 서버가 알려주는 시간만큼 기다렸다 다시 시도한다.
    유료 계정에서도 순간적으로 걸릴 수 있어서 안전망으로 남겨둔다.
    """
    for attempt in range(max_retries):
        try:
            return _synthesize_once(client, types, model, text, voice, style)
        except Exception as error:
            message = str(error)
            rate_limited = "RESOURCE_EXHAUSTED" in message or "429" in message
            if not rate_limited or attempt == max_retries - 1:
                raise
            wait = retry_delay_from(message) or min(60.0, 5.0 * (2 ** attempt))
            print("     rate limit — %.0f초 대기 후 재시도 (%d/%d)"
                  % (wait, attempt + 1, max_retries - 1))
            time.sleep(wait + 2)

    raise RuntimeError("재시도 횟수를 초과했습니다.")


def _synthesize_once(client, types, model, text, voice, style):
    prompt = "%s:\n\n%s" % (style, text)

    response = client.models.generate_content(
        model=model,
        contents=prompt,
        config=types.GenerateContentConfig(
            response_modalities=["AUDIO"],
            speech_config=types.SpeechConfig(
                voice_config=types.VoiceConfig(
                    prebuilt_voice_config=types.PrebuiltVoiceConfig(voice_name=voice)
                )
            ),
        ),
    )

    for part in response.candidates[0].content.parts:
        inline = getattr(part, "inline_data", None)
        if inline is not None and inline.data:
            return inline.data

    raise RuntimeError("응답에 오디오가 없습니다. 모델 이름과 API 키를 확인하세요.")


def main():
    parser = argparse.ArgumentParser(description="Gemini 프리빌트 보이스 나레이션 생성기")
    parser.add_argument("--voice", default="Leda", help="프리빌트 보이스 이름 (기본: Leda)")
    parser.add_argument("--model", default=DEFAULT_MODEL, help="TTS 모델 (기본: %s)" % DEFAULT_MODEL)
    parser.add_argument("--style", default=DEFAULT_STYLE, help="말투 지시문 (자연어)")
    parser.add_argument("--only", default=None, help="특정 장면 id 하나만 (예: scene3)")
    parser.add_argument("--list-voices", action="store_true", help="알려진 보이스 목록 출력")
    parser.add_argument("--api-key", default=None, help="GEMINI_API_KEY 대신 직접 전달")
    parser.add_argument(
        "--video",
        default=None,
        help="영상 폴더 이름 (src/videos/ 아래). 하나뿐이면 생략 가능",
    )
    parser.add_argument(
        "--takes",
        type=int,
        default=0,
        help="본 파일을 덮지 않고 후보를 N개 만든다 (out/takes/). --only 와 함께 쓴다",
    )
    parser.add_argument(
        "--apply-take",
        type=int,
        default=0,
        help="만들어둔 후보 N번을 본 파일로 채택한다 (--only 필요)",
    )
    parser.add_argument(
        "--no-normalize",
        action="store_true",
        help="음량 정규화를 하지 않는다 (장면 간 음량이 튈 수 있음)",
    )
    parser.add_argument(
        "--pace",
        type=float,
        default=0.0,
        help="요청 사이 대기 초. 유료 계정은 0(기본). 무료 티어(3 RPM)면 21 로 준다.",
    )
    args = parser.parse_args()

    if args.list_voices:
        print("\n".join(VOICES))
        return

    video = resolve_video(args.video)
    print("영상: %s" % video)

    # 영상 폴더의 voice.json 이 있으면 기본값으로 쓴다 (CLI 인자가 우선)
    voice_config = {}
    if os.path.exists(VOICE_CONFIG_JSON):
        try:
            with open(VOICE_CONFIG_JSON, encoding="utf-8") as f:
                voice_config = json.load(f)
            print("음성 설정: %s" % os.path.relpath(VOICE_CONFIG_JSON, ROOT))
        except (ValueError, OSError):
            voice_config = {}

    if args.voice == parser.get_default("voice") and voice_config.get("voice"):
        args.voice = voice_config["voice"]
    if args.style == DEFAULT_STYLE and voice_config.get("style"):
        args.style = voice_config["style"]

    load_dotenv()
    api_key = args.api_key or os.environ.get("GEMINI_API_KEY")

    if not api_key:
        print("GEMINI_API_KEY 를 찾을 수 없습니다. 셋 중 하나로 넣어주세요:", file=sys.stderr)
        print("", file=sys.stderr)
        print("  1) 프로젝트 루트에 .env 파일 만들기 (권장, git 에 안 올라감)", file=sys.stderr)
        print("       echo 'GEMINI_API_KEY=발급받은키' >> .env", file=sys.stderr)
        print("  2) 환경변수", file=sys.stderr)
        print('       export GEMINI_API_KEY="발급받은키"', file=sys.stderr)
        print("  3) 실행 인자", file=sys.stderr)
        print('       npm run voice:gemini -- --api-key "발급받은키"', file=sys.stderr)
        print("", file=sys.stderr)
        print("  키 발급: https://aistudio.google.com/apikey", file=sys.stderr)
        sys.exit(1)

    try:
        from google import genai
        from google.genai import types
    except ImportError:
        print("google-genai 가 설치되어 있지 않습니다:  pip install google-genai", file=sys.stderr)
        sys.exit(1)

    if args.voice not in VOICES:
        print("참고: '%s' 는 알려진 목록에 없습니다. 그대로 시도합니다." % args.voice)

    client = genai.Client(api_key=api_key)

    if args.apply_take:
        if not args.only:
            print("--apply-take 는 --only sceneN 과 함께 써야 합니다.", file=sys.stderr)
            sys.exit(1)
        apply_take(args.only, args.apply_take)
        return

    if args.takes:
        if not args.only:
            print("--takes 는 --only sceneN 과 함께 써야 합니다.", file=sys.stderr)
            sys.exit(1)
        scene = next((s for s in load_scenes() if s["id"] == args.only), None)
        if scene is None:
            print("'%s' 장면이 없습니다." % args.only, file=sys.stderr)
            sys.exit(1)

        os.makedirs(TAKES_DIR, exist_ok=True)
        print("후보 %d개 생성 (본 파일은 건드리지 않습니다)" % args.takes)
        for n in range(1, args.takes + 1):
            if n > 1 and args.pace > 0:
                time.sleep(args.pace)
            pcm = synthesize(
                client, types, args.model, scene["text"], args.voice, args.style
            )
            if not args.no_normalize:
                pcm, _ = normalize_pcm(pcm)
            out = os.path.join(TAKES_DIR, "%s-%d.wav" % (args.only, n))
            write_wav(out, pcm, SAMPLE_RATE)
            print("  %s · %.2fs" % (os.path.relpath(out, ROOT), len(pcm) / (SAMPLE_RATE * SAMPLE_WIDTH)))

        print("")
        print("들어보고 채택:")
        print("  npm run voice:gemini -- --video <영상> --only %s --apply-take <번호>" % args.only)
        return

    os.makedirs(VOICE_DIR, exist_ok=True)
    os.makedirs(WHISPER_DIR, exist_ok=True)
    scenes = load_scenes()

    meta = load_meta()
    durations = {}
    if os.path.exists(DURATIONS_JSON):
        try:
            with open(DURATIONS_JSON, encoding="utf-8") as f:
                durations = json.load(f)
        except (ValueError, OSError):
            durations = {}

    print("모델: %s / 보이스: %s" % (args.model, args.voice))
    print("말투: %s" % args.style)

    pending = [s for s in scenes if not args.only or s["id"] == args.only]

    for index, scene in enumerate(pending):
        scene_id = scene["id"]
        out_path = os.path.join(VOICE_DIR, "%s.wav" % scene_id)

        # 무료 티어(3 RPM)를 쓸 때만 간격을 둔다. 유료면 0 이라 그냥 지나간다.
        if index > 0 and args.pace > 0:
            time.sleep(args.pace)

        print("  ▶ %s (%d자) 생성 중..." % (scene_id, len(scene["text"])))
        pcm = synthesize(client, types, args.model, scene["text"], args.voice, args.style)

        gain = 1.0
        if not args.no_normalize:
            pcm, gain = normalize_pcm(pcm)

        write_scene_audio(scene_id, pcm)

        durations[scene_id] = round(len(pcm) / (SAMPLE_RATE * SAMPLE_WIDTH * CHANNELS), 3)

        # edge-tts 로 만든 mp3 가 남아 있으면 그쪽이 먼저 재생되므로 치운다.
        # public/ 밖(.cache)으로 옮겨야 번들에도 안 들어간다.
        stale_mp3 = os.path.join(VOICE_DIR, "%s.mp3" % scene_id)
        if os.path.exists(stale_mp3):
            os.makedirs(MP3_BACKUP_DIR, exist_ok=True)
            os.rename(stale_mp3, os.path.join(MP3_BACKUP_DIR, "%s.mp3" % scene_id))
            print("     (이전 %s.mp3 → .cache/edge-tts-mp3/ 로 백업)" % scene_id)

        meta[scene_id] = {
            "voice": args.voice,
            "model": args.model,
            "style": args.style,
        }

        print("     %s.wav · %.2fs · %s · 게인 %+.1fdB"
              % (scene_id, durations[scene_id], args.voice,
                 20 * math.log10(gain) if gain > 0 else 0))

        # 중간에 실패해도 여기까지의 결과가 남도록 매 장면마다 저장한다.
        save_durations(durations)
        save_meta(meta)

    # 디스크에 있는 실제 파일 기준으로 전체를 다시 맞춘다.
    durations = {}
    for scene in scenes:
        measured = measure_audio(scene["id"])
        if measured is not None:
            durations[scene["id"]] = measured

    save_durations(durations)
    save_meta(meta)
    warn_if_mixed(meta, scenes)

    total = sum(durations.values())
    print("")
    print("durations.json 저장 완료 → %s" % DURATIONS_JSON)
    print("나레이션 합계: %.2fs" % total)
    print("")
    print("자막은 Gemini 가 타임스탬프를 주지 않으므로 따로 뽑아야 합니다:")
    print("  npm run captions      (.cache/whisper-wav 를 쓰므로 ffmpeg 불필요)")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        sys.exit(130)
