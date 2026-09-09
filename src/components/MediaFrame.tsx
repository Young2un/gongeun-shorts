import React from "react";
import {
  Easing,
  Img,
  Interactive,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { CARD, COLORS, MOTION, THEME_FX, withAlpha } from "../theme";
import { useAssetExists } from "./useAssetExists";

/**
 * 외부 이미지를 디자인에 맞춰 보여주는 카드.
 *
 * - 테마 톤의 테두리·글로우를 씌워 카드 시스템과 붙는다
 * - 아주 느린 켄번즈로 정지 이미지도 살아 있게 만든다
 * - 하단에 출처를 항상 함께 노출한다 (인용 표기)
 *
 * 파일이 없으면 아무것도 그리지 않아서 렌더가 깨지지 않는다.
 */
export const MediaFrame: React.FC<{
  /** public/ 기준 경로 */
  readonly src: string;
  /** 등장 시작 프레임 */
  readonly delay: number;
  readonly height: number;
  /** 이미지 위에 얹는 한 줄 문구 */
  readonly overlay?: string;
  /** 하단 출처 표기 */
  readonly credit: string;
  /** 세로 초점(%). 인물이 위쪽이면 낮춘다 */
  readonly focusY?: number;
  readonly style?: React.CSSProperties;
}> = ({ src, delay, height, overlay, credit, focusY = 50, style }) => {
  const frame = useCurrentFrame();
  const exists = useAssetExists(src);

  if (!exists) {
    return null;
  }

  return (
    <Interactive.Div
      name="이미지"
      style={{
        position: "relative",
        height,
        borderRadius: CARD.radius,
        overflow: "hidden",
        border: `1px solid ${
          THEME_FX.cardRim ? withAlpha(COLORS.rim, 0.55) : COLORS.panelBorder
        }`,
        boxShadow: THEME_FX.cardRim
          ? `0 0 0 1px ${withAlpha(COLORS.rim, 0.22)}, 0 18px 60px ${withAlpha(COLORS.rim, 0.3)}`
          : undefined,
        opacity: interpolate(frame, [delay, delay + 14], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        }),
        translate: interpolate(
          frame,
          [delay, delay + 26],
          ["0px 40px", "0px 0px"],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.spring({ damping: 18 }),
          },
        ),
        ...style,
      }}
    >
      <Img
        src={staticFile(src)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: `50% ${focusY}%`,
          // 아주 느리게 밀고 들어간다
          scale: interpolate(frame, [delay, delay + 420], [1.04, 1.16], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.linear,
          }),
        }}
      />

      {/* 아래쪽을 어둡게 깔아 문구와 출처가 읽히게 */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: "58%",
          background: `linear-gradient(180deg, transparent 0%, ${withAlpha(COLORS.bg0, 0.92)} 100%)`,
        }}
      />

      {overlay ? (
        <div
          style={{
            position: "absolute",
            left: 26,
            right: 26,
            bottom: 52,
            fontSize: 40,
            fontWeight: 800,
            lineHeight: 1.3,
            color: COLORS.white,
            textShadow: "0 3px 12px rgba(0,0,0,0.9)",
            opacity: interpolate(frame, [delay + 12, delay + 28], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
          }}
        >
          {overlay}
        </div>
      ) : null}

      <div
        style={{
          position: "absolute",
          left: 26,
          bottom: 18,
          fontSize: 24,
          fontWeight: 500,
          color: COLORS.dim,
        }}
      >
        {credit}
      </div>

      {/* 등장 직후 빛이 한 번 훑는다 */}
      {MOTION > 0 ? (
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            width: "38%",
            pointerEvents: "none",
            background:
              "linear-gradient(100deg, transparent 0%, rgba(255,255,255,0.18) 50%, transparent 100%)",
            transform: "skewX(-16deg)",
            left: interpolate(
              frame,
              [delay + 8, delay + 46],
              ["-45%", "135%"],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(0.3, 0, 0.2, 1),
              },
            ),
          }}
        />
      ) : null}
    </Interactive.Div>
  );
};
