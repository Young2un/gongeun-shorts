import React from "react";
import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
} from "remotion";
import {
  COLORS,
  MOTION,
  THEME_FX,
  HEIGHT,
  LAYOUT,
  MARGIN,
  SHOW_CAPTIONS,
  SHOW_SAFE_AREA,
  SHOW_SOURCE_CARD,
  withAlpha,
} from "../theme";
import { TITLE_FONT } from "../typography";
import { Background } from "./Background";
import { Caption } from "./Caption";
import { Em, type Highlights } from "./Em";
import { Narration } from "./Narration";
import { SafeAreaGuide } from "./SafeAreaGuide";
import { SourceCard } from "./SourceCard";
import { Kicker } from "./Kicker";

/**
 * 모든 장면이 공유하는 껍데기.
 * 배경 · 상단 배지 · 제목 · 부제 · 하단 출처 카드 · 진행 점 · 나레이션 · 자막.
 * `children` 에는 카드 패널들을 넣는다.
 */
export const SceneFrame: React.FC<{
  /** 영상 폴더 id. 에셋 경로에 쓰인다 */
  readonly videoId: string;
  readonly sceneId: string;
  /** 좌상단 소제목 */
  readonly kicker: string;
  /** 제목 (최대 2줄) */
  readonly titleLines: readonly string[];
  /** 제목에서 orange 로 강조할 구절 */
  readonly titleEm?: Highlights;
  readonly titleSize?: number;
  readonly subtitle: string;
  readonly source: readonly string[];
  /** 카드가 적을 때 세로 가운데로 모은다 */
  readonly cardsAlign?: "start" | "center";
  /** 배경 바로 위, 내용 아래에 까는 레이어 (장면별 키아트 등) */
  readonly backdrop?: React.ReactNode;
  /** 화면 전체를 덮는 레이어 (페이드아웃 등) */
  readonly overlay?: React.ReactNode;
  readonly children?: React.ReactNode;
}> = ({
  videoId,
  sceneId,
  kicker,
  titleLines,
  titleEm,
  titleSize = 120,
  subtitle,
  source,
  cardsAlign = "start",
  backdrop,
  overlay,
  children,
}) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill>
      <Background />
      {backdrop}

      <Kicker text={kicker} />

      {/* 제목 뒤에서 숨 쉬는 오렌지 글로우 — 첫 화면 시선을 위쪽으로 모은다 */}
      {MOTION > 0 ? (
        <AbsoluteFill
          style={{
            pointerEvents: "none",
            background: `radial-gradient(760px 420px at 50% ${LAYOUT.titleY + 130}px, ${COLORS.orangeGlow} 0%, transparent 70%)`,
            opacity:
              interpolate(frame, [0, 18], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(0.16, 1, 0.3, 1),
              }) *
              (0.34 + Math.sin(frame / 30) * 0.1 * MOTION),
          }}
        />
      ) : null}

      <div
        style={{
          position: "absolute",
          left: MARGIN,
          right: MARGIN,
          top: LAYOUT.titleY,
          textAlign: "center",
        }}
      >
        {titleLines.map((line, i) => (
          <Interactive.Div
            key={line}
            name={`제목 ${i + 1}행`}
            style={{
              fontFamily: TITLE_FONT,
              fontSize: titleSize,
              fontWeight: 900,
              lineHeight: 1.18,
              letterSpacing: -1,
              color: COLORS.white,
              whiteSpace: "nowrap",
              textShadow: THEME_FX.titleHalo
                ? `0 6px 0 #000, 0 0 30px rgba(0,0,0,0.85), 0 0 30px ${withAlpha(COLORS.rim, 0.55)}`
                : "0 6px 0 #000, 0 0 30px rgba(0,0,0,0.8)",
              opacity: interpolate(frame, [i * 4, i * 4 + 12], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(0.16, 1, 0.3, 1),
              }),
              translate: interpolate(
                frame,
                [i * 4, i * 4 + 26],
                ["0px 46px", "0px 0px"],
                {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.spring({ damping: 13 }),
                },
              ),
              // 살짝 크게 들어왔다 제자리로 — 첫인상을 세게
              scale: interpolate(frame, [i * 4, i * 4 + 28], [1.12, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.spring({ damping: 13 }),
                output: "perceptual-scale",
              }),
            }}
          >
            <Em text={line} em={titleEm} />
          </Interactive.Div>
        ))}

        <Interactive.Div
          name="부제"
          style={{
            marginTop: 30,
            textAlign: "center",
            fontSize: 46,
            fontWeight: 600,
            lineHeight: 1.35,
            color: COLORS.white,
            textShadow: "0 3px 12px rgba(0,0,0,0.8)",
            opacity: interpolate(frame, [10, 24], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
          }}
        >
          {subtitle}
        </Interactive.Div>
      </div>

      <div
        style={{
          position: "absolute",
          left: MARGIN,
          right: MARGIN,
          top: LAYOUT.cardsY,
          bottom: HEIGHT - LAYOUT.cardsBottom,
          display: "flex",
          flexDirection: "column",
          justifyContent: cardsAlign === "center" ? "center" : "flex-start",
          gap: 34,
        }}
      >
        {children}
      </div>

      {SHOW_SOURCE_CARD ? <SourceCard lines={source} delay={16} /> : null}

      <Narration videoId={videoId} sceneId={sceneId} />
      {SHOW_CAPTIONS ? <Caption videoId={videoId} sceneId={sceneId} /> : null}

      {overlay}

      {SHOW_SAFE_AREA ? <SafeAreaGuide /> : null}
    </AbsoluteFill>
  );
};
