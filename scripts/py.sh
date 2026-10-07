#!/bin/sh
# 나레이션 스크립트를 돌릴 파이썬을 고른다.
#
# 프로젝트 전용 venv(.venv)가 있으면 그것을 먼저 쓴다.
# macOS 의 python3 는 brew 가 올릴 때마다 site-packages 가 통째로 비고,
# 3.13 부터는 표준 라이브러리에서 audioop 까지 빠졌다(PEP 594).
# venv 를 쓰면 generate-voice-gemini.py 가 그 두 가지에 흔들리지 않는다.
#
#   python3 -m venv .venv
#   .venv/bin/pip install google-genai audioop-lts mutagen edge-tts
set -e
ROOT=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
if [ -x "$ROOT/.venv/bin/python" ]; then
  exec "$ROOT/.venv/bin/python" "$@"
fi
exec python3 "$@"
