# 팀 드라이브 쇼츠 (TeamDriveShorts)

오버워치 경쟁전 신규 이벤트 "팀 드라이브"를 설명하는 유튜브 쇼츠용 세로 영상.
1080×1920 / 30fps, 전체 길이는 나레이션 오디오 길이에 맞춰 자동으로 계산된다.

## 빠른 시작

```console
npm i                        # 1. 의존성 설치
pip install edge-tts mutagen # 2. TTS 도구 설치 (최초 1회)
npm run voice                # 3. 나레이션 mp3 + 길이 + 자막 생성
npm run dev                  # 4. Remotion Studio 로 미리보기
npm run render               # 5. out/team-drive-shorts.mp4 로 출력
```

`npm run voice` 를 돌리지 않아도 렌더는 된다. 이 경우 나레이션·자막 없이
`src/theme.ts` 의 `FALLBACK_SCENE_SECONDS` 길이로 영상만 만들어진다.

## 스크립트

| 명령 | 하는 일 |
| --- | --- |
| `npm run voice` | edge-tts: `src/script.json` → `public/voice/sceneN.mp3`, `durations.json`, `public/captions/sceneN.json` |
| `npm run voice:gemini` | Gemini 프리빌트 보이스: `sceneN.wav` + `durations.json` (자막은 별도) |
| `npm run voice:check` | 나레이션이 원문대로 발음됐는지 whisper 로 검사 |
| `npm run captions` | whisper.cpp 로 자막 JSON 을 다시 뽑는다 (선택) |
| `npm run dev` | Remotion Studio |
| `npm run render` | `out/team-drive.mp4` (전체 8장면) |
| `npm run new-video` | 새 영상 폴더 생성 |
| `npm run outro` | `out/channel-outro.mp4` (채널 홍보 아웃트로만) |
| `npm run still` | 프레임 한 장 PNG |
| `npm run lint` | eslint + tsc |

## 나레이션

`scripts/generate-voice.py` 가 [edge-tts](https://github.com/rany2/edge-tts) 로
장면별 mp3 를 만들고, mutagen 으로 길이를 재서 `public/voice/durations.json` 에 적는다.
Remotion 의 `calculateMetadata` 가 이 파일을 읽어 장면 길이를 계산한다:

```
장면 길이 = 0.4초(여백) + 오디오 길이 + 0.4초(꼬리)
전체 길이 = 장면 합계 − 전환 겹침(0.4초 × 6)
```

앞뒤 여백은 전환(slide 0.4초) 길이와 같다. 그래서 **나레이션이 화면 전환과 절대 겹치지
않는다** — 여백이 없으면 다음 장면 첫 마디가 슬라이드에 묻혀 잘린 것처럼 들린다.
장면 안의 등장 타이밍(`at(audioFrames, ratio)`)도 이 여백만큼 자동으로 밀린다.

```console
npm run voice                                  # 기본: ko-KR-InJoonNeural, rate +8%
python3 scripts/generate-voice.py --voice sunhi        # 여성 음성
python3 scripts/generate-voice.py --rate "+16%"        # 더 빠르게
python3 scripts/generate-voice.py --only scene3        # 한 장면만 다시
```

`durations.json` 이 없으면 `src/theme.ts` 의 `FALLBACK_SCENE_SECONDS`
(4, 9, 11, 8, 9, 5, 14, 9초) 로 폴백한다.

### Gemini 프리빌트 보이스로 바꾸기

Gemini API 의 TTS 모델에는 30개 프리빌트 보이스(Charon, Kore, Puck, Zephyr, Sulafat …)가 있고
한국어도 된다. 말투는 파라미터가 아니라 **자연어 지시문**으로 조절한다.

```console
pip install google-genai

cp .env.example .env        # .env 에 GEMINI_API_KEY=... 채우기 (git 에 안 올라감)
npm run voice:gemini                                              # 기본 Charon

python3 scripts/generate-voice-gemini.py --voice Kore
python3 scripts/generate-voice-gemini.py --style "차분하고 신뢰감 있는 톤으로"
python3 scripts/generate-voice-gemini.py --list-voices
```

API 키는 `.env` → 환경변수 `GEMINI_API_KEY` → `--api-key` 순으로 찾는다.
키 발급은 [Google AI Studio](https://aistudio.google.com/apikey).

**유료 계정 기준으로 설정돼 있다.** 요청 사이 대기 없이(`--pace 0`, 기본값) 연속 생성한다.
429 를 만나면 서버가 알려준 시간만큼 기다렸다 자동 재시도하는 안전망은 남아 있다.

무료 티어(분당 3회 · 하루 10회)로 쓸 때는 간격을 줘야 한다:

```console
python3 scripts/generate-voice-gemini.py --pace 21    # 무료 티어
```

**요금** (2026-09 확인): 오디오 출력 $10/1M 토큰 · 25토큰 = 1초 기준.
이 영상(약 100초) 전체를 다시 뽑는 데 약 **$0.03**. 최신 요금은
[공식 페이지](https://ai.google.dev/gemini-api/docs/pricing)에서 확인.

더 좋은 모델을 쓰려면 `--model` 로 바꾸면 된다 (유료 계정이면 전부 사용 가능):

```console
python3 scripts/generate-voice-gemini.py --model gemini-2.5-pro-preview-tts
python3 scripts/generate-voice-gemini.py --model gemini-3.1-flash-tts-preview
```

출력은 `public/voice/sceneN.wav` (24kHz PCM) 이고, `durations.json` 은 그대로 쓰기 때문에
**Remotion 코드는 고칠 게 없다** (`<Narration>` 이 mp3 → wav 순으로 찾는다).
기존 edge-tts mp3 는 `.mp3.bak` 으로 밀어둔다.

**음량 정규화**: 생성 호출마다 음량이 최대 5dB 씩 튀어서 같은 목소리인데도 톤이
바뀐 것처럼 들린다. 그래서 장면마다 공통 RMS(-19.4 dBFS)로 맞추고 피크를 제한한다.
끄려면 `--no-normalize`.

**음성 섞임 방지**: `public/voice/meta.json` 에 장면별 음성·모델·말투를 기록하고,
장면끼리 음성이 다르면 경고를 띄운다. 중간에 할당량이 떨어져 일부만 다시 뽑았을 때
목소리가 바뀐 채로 렌더되는 사고를 막는다.

**속도 조절**: Gemini 는 edge-tts 의 `--rate` 같은 파라미터가 없고 `--style` 지시문으로 조절한다.
"또박또박"과 "빠르게"는 서로 반대 방향이라 둘 다 세게 주면 한쪽이 진다.
참고 수치 — edge-tts(+8%) 114초 / "빠르게" 78초 / 현재 "또박또박" 94초.
너무 밀어붙이면 발음이 뭉개지거나 문장을 건너뛸 수 있으니 꼭 들어보고 결정할 것.
(내용이 빠졌는지는 `npm run captions` 후 자막 글자 수를 원문과 대조하면 알 수 있다.)

**한 가지 트레이드오프**: Gemini TTS 는 단어 단위 타임스탬프를 주지 않는다.
edge-tts 는 WordBoundary 를 공짜로 주므로 자막이 자동으로 붙지만, Gemini 를 쓰면
자막은 `npm run captions` (whisper) 로 따로 뽑아야 한다. 대신 Gemini 스크립트가
`.cache/whisper-wav/` 에 16kHz wav 를 같이 만들어 두므로 **ffmpeg 없이** 돌아간다.

> 모델 이름(`gemini-2.5-flash-preview-tts`)과 보이스 목록은 바뀔 수 있으니
> [공식 문서](https://ai.google.dev/gemini-api/docs/speech-generation)에서 확인하고
> `--model` / `--voice` 로 덮어쓰면 된다.

### ElevenLabs 로 바꾸기

Remotion 쪽 코드는 파일 경로만 보기 때문에, **같은 위치에 같은 이름으로 저장하면
코드는 한 줄도 고칠 필요가 없다.** ElevenLabs API 로 `src/script.json` 의 각 `text` 를
합성해 `public/voice/scene1.mp3` ~ `scene7.mp3` 로 저장하고, 각 mp3 의 길이(초)를
`{"scene1": 10.82, ...}` 형태로 `public/voice/durations.json` 에 쓰면 끝이다
(길이는 `mutagen.mp3.MP3(path).info.length` 로 잰다). 자막까지 그대로 쓰려면
`public/captions/sceneN.json` 은 지우지 말고 두거나, `npm run captions` 로 다시 뽑으면 된다.

## 발음이 이상할 때 — 후보 뽑아서 고르기

Gemini TTS 는 **호출마다 결과가 다르다.** 같은 문장도 어떤 테이크는 단어가 뭉개진다.
그래서 한 장면만 여러 번 뽑아 듣고 고르는 흐름을 만들어 뒀다.

```console
# 후보 4개 생성 (본 파일은 건드리지 않는다)
npm run voice:gemini -- --video s4-midseason --only scene1 --takes 4

# out/takes/s4-midseason/scene1-1.wav ~ scene1-4.wav 생성됨
# Finder 에서 스페이스바로 미리듣기하거나
afplay out/takes/s4-midseason/scene1-2.wav

# 마음에 드는 번호를 채택
npm run voice:gemini -- --video s4-midseason --only scene1 --apply-take 2
npm run captions -- --video s4-midseason --only scene1
```

채택하면 본 파일 · whisper 용 16kHz 변환본 · `durations.json` 이 한 번에 갱신된다.

## 발음 검사

TTS 가 단어를 뭉개거나 잘못 읽는 일이 있다. 귀로 일일이 듣지 않고 잡아내려면:

```console
npm run voice:check -- --video s4-midseason
npm run voice:check -- --video s4-midseason --only scene1
```

whisper 가 **들은 그대로** 출력하고(원문 스냅을 하지 않는다), 원문과 다르게 들린 단어를
`⚠` 로 표시한다. 실제로 "시즌 4" 가 "시젠코" 로 뭉개진 것을 이걸로 잡았다.

**한계**: whisper 는 한국어 언어 모델을 갖고 있어서 애매한 발음을 그럴듯한 단어로
자동 보정한다. "드디어" 를 "드디오" 처럼 읽어도 "드디어" 로 복원해 버린다.
크게 뭉개진 것은 잡지만 **미세한 발음은 사람 귀가 필요하다** — 그럴 때 위의 `--takes` 를 쓴다.

## 자막

`npm run voice` 가 edge-tts 의 **단어 경계(WordBoundary)** 정보를 그대로
`public/captions/sceneN.json` (`@remotion/captions` 의 `Caption[]` 형식) 으로 저장한다.
원문 텍스트를 그대로 쓰기 때문에 ASR 보다 정확하고, 별도 실행이 필요 없다.

ASR 로 다시 뽑고 싶거나, Gemini 보이스를 쓴 경우:

```console
brew install ffmpeg     # mp3 → 16kHz wav 변환에 필요 (Gemini 판은 불필요)
npm run captions        # whisper.cpp 설치 + 모델 다운로드 (수 GB, 오래 걸림)
npm run captions -- --model large-v3-turbo --only scene7
```

자막은 화면 하단에 **검정 딤드 박스** 위로 올라가고, 색은 전부 흰색이다
(구절 자동 매칭 강조는 오탐이 많아 쓰지 않는다).

**분할은 시간이 아니라 의미 단위**로 한다 (`markPageBreaks`):
문장 끝(`. ! ?`)에서는 항상 끊고, 쉼표는 16자 이상 쌓였을 때만 끊는다
("소셜, 일반," 같은 나열이 잘게 쪼개지는 것 방지). 부호 없이 길어지면
44자에서 강제로 끊어 최대 두 줄을 유지한다. 한 페이지는 다음 문장이
시작할 때까지 떠 있어서 문장 사이 침묵에 깜빡이지 않는다.

whisper 로 뽑을 때는 **타임스탬프만 쓰고 텍스트는 `script.json` 원문으로 교체**한다
(`snapToScript`). ASR 오인식("모 아니면 도" → "뭐 아니면 도")이 자막에 노출되지 않고,
원문의 문장부호도 그대로 살아난다.

글자 수가 정확히 같지 않아도 **최장 공통 부분수열로 정렬**해서 맞춘다 —
whisper 가 "125에서 150" 을 "125~150" 으로 줄여 들어도 나머지 글자로 위치를 잡는다.
원문 글자의 80% 미만만 대응되면 다른 내용으로 보고 whisper 결과를 그대로 쓰며 경고를 띄운다.

`src/theme.ts` 의 `SHOW_CAPTIONS` 를 `false` 로 두면 자막이 꺼진다.

## 에셋 (전부 선택 사항, 없어도 렌더된다)

| 경로 | 쓰임 |
| --- | --- |
| `public/shared/assets/bg.jpg` | 전체 배경 (blur 6px + brightness 0.35). 없으면 그라데이션 |
| `public/shared/assets/profile.jpg` | 아웃트로 프로필 사진 (원형). 없으면 사람 아이콘 |
| `public/shared/assets/chzzk_logo.png` | 아웃트로 치지직 로고. 없으면 "치지직" 텍스트 배지 |

**파일 이름은 위 경로 그대로여야 한다.** `shared/assets/img/내사진.jpg` 처럼 다른 이름으로 두면
찾지 못하고 폴백으로 렌더된다.

인물 사진은 원형으로 잘리므로 `<Avatar>` 의 `zoom`(기본 1.35) 과 `focusY`(기본 28%)로
얼굴 위치를 맞춘다. 아이콘형 로고를 넣었다면 `<ChzzkBadge>` 가 옆에 "치지직" 라벨을
같이 붙여준다 (워드마크 로고라면 `withLabel={false}`).
| `public/fonts/Koverwatch.ttf` | 제목 폰트 (없으면 Noto Sans KR 900) |
| `public/fonts/big_noodle_titling.ttf` | 숫자·영문 강조 (없으면 Koverwatch → Noto Sans KR) |
| `public/shared/bgm.mp3` | 배경음악 (볼륨 0.12, 나레이션 구간 0.06 으로 자동 덕킹) |

모든 에셋은 렌더 전에 존재 여부를 확인하고, 없으면 그 자리를 비우거나 폴백한다.

> 치지직 로고는 [브랜드 가이드](https://chzzk.gitbook.io/chzzk/resources/brand-guides)에서
> 공식 파일을 받아 그대로 넣는다. 가이드가 **형태·색상 임의 변경을 금지**하므로
> 직접 그리거나 색을 바꾸지 않는다 — `ChzzkBadge` 는 넣어준 이미지를 필터 없이 그대로 렌더한다.
>
> 브랜드 컬러 `#00FFA3` 은 [공식 로고 SVG](https://upload.wikimedia.org/wikipedia/commons/c/ce/Chzzk_Logo.svg)
> 에서 확인한 값이며, 로고가 아닌 우리 UI 요소(프로필 링 · 카드 헤더 · 텍스트 배지)에만 쓴다.

## 특정 장면만 미리보기

Studio 좌측 `TeamDrive-Scenes` 폴더에 장면별 컴포지션이 따로 등록돼 있다.
각 장면도 `durations.json` 을 읽어 실제 나레이션 길이로 열린다.

```console
npm run dev
# 브라우저에서 http://localhost:3000/TD-3-Reputation  (TD-1 ~ TD-8)
```

전체 타임라인에서 장면 시퀀스를 더블클릭해도 해당 장면 컴포지션으로 이동한다.
한 장면만 렌더하려면:

```console
npx remotion render TD-3-Reputation out/scene3.mp4
npx remotion still TeamDriveShorts out/frame.png --frame=900
```

## 채널 홍보 아웃트로 (재사용)

마지막 장면은 다른 영상에도 그대로 붙일 수 있게 분리해 뒀다.
컴포지션 id 는 `ChannelOutro`, 컴포넌트는 `src/scenes/ChannelOutro.tsx`.

```console
npm run outro          # out/channel-outro.mp4 로 단독 출력
npm run dev            # http://localhost:3000/ChannelOutro 로 미리보기
```

장면 배열(`SCENE_META`)과 분리해서 `theme.ts` 의 `OUTRO` 상수가 문구를 갖고 있고,
음성·자막 파일도 `sceneN` 이 아니라 `outro` 이름을 쓴다. 장면 수가 바뀌어도 영향받지 않는다.

필요한 파일:

```
public/videos/<영상>/voice/outro.wav       나레이션
public/videos/<영상>/captions/outro.json   자막
public/shared/assets/profile.jpg           프로필 사진
public/shared/assets/chzzk_logo.png        치지직 로고
```

대사를 바꾸려면 `src/script.json` 의 `outro` 항목을 고치고:

```console
npm run voice:gemini -- --only outro
npm run captions -- --only outro
npm run outro
```

다른 Remotion 프로젝트로 옮길 때는 위 4개 파일 + `ChannelOutro.tsx` +
`components/`(Avatar, ChzzkBadge, Card, SceneFrame, Icons 등) 를 같이 가져가면 된다.

## 구조

영상 하나마다 폴더가 하나. **공유 코드와 영상별 데이터를 분리**해 뒀다.

```
src/
  components/           공유 컴포넌트 (Card, Icons, SceneFrame, Caption ...)
  theme.ts              색 · 레이아웃 토큰 · 전역 플래그
  styles.ts             텍스트 프리셋
  typography.ts         폰트 로딩
  timing.ts             오디오 길이 → 장면/전체 길이 (VideoConfig 를 받는다)
  shared/
    ChannelOutro.tsx    모든 영상이 갖다 쓰는 채널 홍보 아웃트로
    outro.ts            아웃트로 문구 (새 영상 script.json 에 복사됨)
  videos/
    team-drive/
      script.json       대본 (아웃트로 포함)
      meta.ts           SCENE_META + VideoConfig
      index.tsx         TransitionSeries 배치
      scenes/           Scene1Hook ~ Scene7Opinion
  Root.tsx              모든 컴포지션 등록

public/
  shared/
    assets/             bg.jpg · profile.jpg · chzzk_logo.png
    bgm.mp3
  videos/
    team-drive/
      voice/            sceneN.wav · durations.json · meta.json
      captions/         sceneN.json

out/
  team-drive.mp4
  channel-outro.mp4

scripts/
  generate-voice-gemini.py  Gemini 나레이션 (--video)
  generate-voice.py         edge-tts 나레이션
  generate-captions.mjs     whisper 자막 (--video)
  new-video.mjs             새 영상 폴더 생성
```

## 새 영상 만들기

```console
npm run new-video -- season5-patch "시즌 5 패치노트"
```

폴더와 뼈대 파일이 생긴다. 그다음:

1. `src/videos/season5-patch/script.json` 에 대본 채우기
2. `meta.ts` 의 `SCENE_META` 채우기 (장면 수와 맞춰야 한다)
3. `scenes/` 에 장면 컴포넌트 만들기 — `team-drive/scenes/` 를 참고
4. `src/Root.tsx` 에 컴포지션 등록
5. 음성 · 자막 · 렌더

```console
npm run voice:gemini -- --video season5-patch
npm run captions -- --video season5-patch
npx remotion render Season5Patch out/season5-patch.mp4
```

영상이 하나뿐이면 `--video` 는 생략해도 자동으로 잡힌다.

## 영웅 초상화

`<HeroRow>` 가 영웅 초상화를 가로로 늘어놓는다. 밸런스 패치 영상에서 이번에 바뀐
영웅을 한눈에 보여줄 때 쓴다.

```tsx
<HeroRow
  dir="videos/s4-midseason/heroes"
  heroes={[
    { id: "dva", name: "D.Va", tone: "up" },      // 테두리 green
    { id: "kiriko", name: "키리코", tone: "down" }, // 테두리 grey
  ]}
  delay={14}
  size={92}
/>
```

`tone` 이 상향(`up`) · 하향(`down`) · 그 외(`neutral`) 를 테두리 색으로 구분한다.
초상화는 `public/videos/<영상>/heroes/<id>.png` 에 둔다 (256×256 정사각 권장).
파일이 없으면 빈 원으로 남고 렌더는 깨지지 않는다.

## 외부 이미지 넣기

`<MediaFrame>` 이 이미지를 카드 시스템에 맞춰 보여준다 — 테마 테두리 · 느린 켄번즈 ·
등장 스윕 · 하단 출처 표기가 한 번에 붙는다.

```tsx
<MediaFrame
  src="videos/blizzcon-news/images/blizzcon-header.jpg"
  delay={12}
  height={330}
  focusY={38}                       // 인물이 위쪽이면 낮춘다
  overlay="블리즈컨 2026 · 9월 12~13일"
  credit="출처: Blizzard Entertainment"
/>
```

이미지는 `public/videos/<영상>/images/` 에 둔다. 파일이 없으면 그냥 안 그린다.

**출처 표기는 필수다.** `credit` 이 화면에 항상 남고, 장면 하단 출처 카드에도 같은
출처가 들어간다. 공식 이미지를 뉴스·해설 목적으로 인용하는 것이므로 어디서 가져왔는지
항상 보이게 한다.

### 배경 사진

`public/shared/assets/bg.jpg` 를 넣으면 전체 배경이 된다.
**blur 16px · brightness 0.18 · 테마색 스크림**까지 씌워 세게 누른다 —
배경은 질감이지 내용이 아니다. 밝은 이미지를 그대로 쓰면 본문과 경쟁한다.

## 테마 · 모션

`src/theme.ts` 위쪽 두 값으로 전체 인상이 바뀐다.

```ts
export const THEME: ThemeName = "neon";  // "dark" | "neon"
export const MOTION = 1;                 // 0 = 정지, 1 = 기본, 1.5 = 과하게
```

| | `dark` | `neon` |
| --- | --- | --- |
| 배경 | 거의 검정 (#070A0F) | 딥 퍼플 (#080418 → #1C1046) |
| 카드 | 얇은 흰 테두리 | 보라 림 라이트 + 바깥 글로우 |
| 제목 | 검정 그림자만 | 보라 헤일로 추가 |
| 배경 광선 | 없음 | 비스듬한 조명 3줄 |

`MOTION` 이 켜져 있으면 공통으로 붙는 것:

- 오렌지 글로우가 좌우로 아주 느리게 흐르고 밝기가 숨 쉰다
- 불티 22개가 아래에서 위로 떠오른다
- 카드가 등장한 직후 대각선 빛이 한 번 훑고 지나간다
- 제목이 살짝 크게 들어왔다 제자리로 튕기고, 강조어에 글로우가 붙는다
- 배경 사진(`bg.jpg`)이 있으면 아주 느린 켄번즈 줌

성능이 부담되면 `MOTION = 0` 으로 두면 전부 꺼진다 (색과 테두리는 유지).

## 디자인 규칙

색은 **역할별로 고정**한다 — 장식 목적으로 섞지 않는다.

| 색 | 의미 |
| --- | --- |
| `green` | 승리 · 성공 · 상승 (트로피, "승") |
| `blue` | 나 · 솔로 · 사용자 (사람 아이콘, 설정) |
| `gold` | 최종 보상 · 칭호 (선착순 1만 명) |
| `orange` | 그 외 핵심 강조 · 헤더 바 · 팁 박스 테두리 |
| `chzzk` | 치지직 플랫폼 표기 전용 (Scene 8) — `#00FFA3` |
| `grey` / `dim` | 보조 텍스트, 비활성 아이콘, 출처 |

제목만 중앙 정렬(italic + `skewX(-8deg)` + 두꺼운 다크 섀도)이고,
그 아래는 전부 카드 패널로 구조를 만든다. 육각형·블레이드 장식은 쓰지 않는다.

애니메이션은 전부 `useCurrentFrame()` 기반의 `interpolate()` 로만 만든다
(CSS `transition`/`animation` 은 렌더에 반영되지 않는다).
장면 내부 등장 타이밍은 절대 초가 아니라 **해당 장면 오디오 길이의 비율(0~1)** 로
계산하기 때문에, 나레이션을 다시 뽑아도 연출이 그대로 따라간다.

---

이 저장소에는 다른 컴포지션(`Shorts`)도 함께 들어 있다. Remotion 자체에 대한 문서는
[fundamentals](https://www.remotion.dev/docs/the-fundamentals) 참고.
일부 기업 사용에는 라이선스가 필요하다 —
[약관](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md).
