import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Caption } from "../../components/Caption";
import { Narration } from "../../components/Narration";
import { SafeAreaGuide } from "../../components/SafeAreaGuide";
import { MARGIN, SHOW_CAPTIONS, SHOW_SAFE_AREA, WIDTH } from "../../theme";
import { CHUSEOK, CHUSEOK_LAYOUT } from "./theme";

/**
 * 추석 포스터 장면의 공통 껍데기.
 *
 * `children` 이 화면을 채우는 포스터고, 그 위에 하단 스크림 · 자막 · 출처 ·
 * 나레이션을 얹는다.
 *
 * 0911/0916 세트의 PosterFrame 과 달리 **불투명한 바닥을 깔지 않는다.**
 * 이 세트는 포스터가 자체 출처 줄을 그려 두지 않았고, 하단이 한옥·달 일러스트라
 * 통째로 덮으면 그림이 잘려 보인다. 대신 자막이 읽힐 만큼만 눌러 준다.
 */
export const ChuseokFrame: React.FC<{
  readonly videoId: string;
  readonly sceneId: string;
  /** 하단에 한 줄로 그릴 출처 */
  readonly source: string;
  readonly children?: React.ReactNode;
}> = ({ videoId, sceneId, source, children }) => {
  const frame = useCurrentFrame();
  const L = CHUSEOK_LAYOUT;

  return (
    <AbsoluteFill style={{ backgroundColor: CHUSEOK.night }}>
      {children}

      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background: `linear-gradient(to bottom,
            rgba(12,10,32,0) ${(L.scrimFrom / 1920) * 100}%,
            rgba(12,10,32,${L.scrimAlpha}) ${(L.scrimTo / 1920) * 100}%,
            rgba(12,10,32,${L.scrimAlpha}) 100%)`,
        }}
      />

      {/* 스크림이 시작되는 자리에 핑크 실선 — 포스터의 진행 바와 같은 언어 */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: L.scrimTo,
          height: 3,
          width: interpolate(frame, [6, 30], [0, WIDTH], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
          background: `linear-gradient(90deg, ${CHUSEOK.pink} 0%, rgba(223,60,137,0) 100%)`,
        }}
      />

      {SHOW_CAPTIONS ? (
        <Caption
          videoId={videoId}
          sceneId={sceneId}
          variant="bare"
          bottom={L.captionBottom}
          fontSize={L.captionFontSize}
          maxWidth={L.captionMaxWidth}
        />
      ) : null}

      <div
        style={{
          position: "absolute",
          left: MARGIN,
          right: MARGIN,
          top: L.sourceY,
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
            width: 10,
            height: 10,
            borderRadius: 5,
            backgroundColor: CHUSEOK.pink,
          }}
        />
        <span
          style={{
            fontSize: L.sourceFontSize,
            fontWeight: 600,
            letterSpacing: 0.2,
            color: "rgba(255,255,255,0.68)",
            whiteSpace: "nowrap",
          }}
        >
          {source}
        </span>
      </div>

      <Narration videoId={videoId} sceneId={sceneId} />

      {SHOW_SAFE_AREA ? <SafeAreaGuide /> : null}
    </AbsoluteFill>
  );
};
