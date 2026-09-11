import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Caption } from "../../components/Caption";
import { Narration } from "../../components/Narration";
import { SafeAreaGuide } from "../../components/SafeAreaGuide";
import { MARGIN, SHOW_CAPTIONS, SHOW_SAFE_AREA, WIDTH } from "../../theme";
import { POSTER, POSTER_LAYOUT } from "./theme";

/**
 * 포스터 장면의 공통 껍데기.
 *
 * `children` 이 화면을 꽉 채우는 배경(포스터 이미지 또는 코드로 그린 장면)이고,
 * 그 위에 하단 스크림 · 자막 · 출처 · 나레이션을 얹는다.
 *
 * 하단 스크림은 포스터가 자체적으로 그려 둔 출처 줄(y 1765~1805)을 덮는다.
 * 같은 내용을 `source` 로 받아 아래에 다시 그리기 때문에 출처는 항상 화면에 남는다.
 */
export const PosterFrame: React.FC<{
  readonly videoId: string;
  readonly sceneId: string;
  /** 하단에 한 줄로 다시 그릴 출처 */
  readonly source: string;
  /** 화면 전체를 덮는 레이어 (페이드아웃 등) */
  readonly overlay?: React.ReactNode;
  readonly children?: React.ReactNode;
}> = ({ videoId, sceneId, source, overlay, children }) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: POSTER.bg1 }}>
      {children}

      {/* 자막이 앉을 자리를 어둡게 눌러 준다.
          포스터는 밝은 은색이라 흰 자막이 그냥은 읽히지 않는다.
          scrimSolid 아래는 완전히 불투명해야 포스터 자체 출처 줄이 비치지 않는다. */}
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background: `linear-gradient(to bottom,
            rgba(10,14,20,0) ${(POSTER_LAYOUT.scrimFrom / 1920) * 100}%,
            rgba(10,14,20,0.85) ${(POSTER_LAYOUT.scrimSolid / 1920) * 100}%,
            rgba(10,14,20,0.85) 100%)`,
        }}
      />

      {/* 완전히 불투명한 바닥. 알파가 조금이라도 남으면 포스터가 그려 둔
          진한 잉크 출처 줄이 자막 뒤로 비쳐서 출처가 두 번 보인다. */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: POSTER_LAYOUT.scrimSolid,
          bottom: 0,
          pointerEvents: "none",
          backgroundColor: "#0A0E14",
        }}
      />

      {/* 스크림 위쪽 경계에 얇은 오렌지 선 — 포스터의 코너 악센트와 같은 언어 */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: POSTER_LAYOUT.scrimSolid,
          height: 3,
          width: interpolate(frame, [6, 30], [0, WIDTH], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
          background: `linear-gradient(90deg, ${POSTER.orange} 0%, rgba(246,90,1,0) 100%)`,
        }}
      />

      {SHOW_CAPTIONS ? (
        <Caption
          videoId={videoId}
          sceneId={sceneId}
          variant="bare"
          bottom={POSTER_LAYOUT.captionBottom}
          fontSize={POSTER_LAYOUT.captionFontSize}
          maxWidth={POSTER_LAYOUT.captionMaxWidth}
        />
      ) : null}

      {/* 포스터가 그려 둔 출처 줄은 스크림에 가려지므로 여기서 다시 그린다 */}
      <div
        style={{
          position: "absolute",
          left: MARGIN,
          right: MARGIN,
          top: POSTER_LAYOUT.sourceY,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          opacity: interpolate(frame, [10, 26], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <div
          style={{
            width: 4,
            height: 24,
            backgroundColor: POSTER.orange,
            transform: "skewX(-16deg)",
          }}
        />
        <span
          style={{
            fontSize: 26,
            fontWeight: 600,
            letterSpacing: 0.2,
            color: "rgba(255,255,255,0.66)",
            whiteSpace: "nowrap",
          }}
        >
          {source}
        </span>
      </div>

      <Narration videoId={videoId} sceneId={sceneId} />

      {overlay}

      {SHOW_SAFE_AREA ? <SafeAreaGuide /> : null}
    </AbsoluteFill>
  );
};
