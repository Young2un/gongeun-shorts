import React from "react";
import { AbsoluteFill, Easing, interpolate, useVideoConfig } from "remotion";
import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from "@remotion/transitions";
import { withAlpha } from "../../theme";
import { POSTER } from "./theme";

export type SlashWipeProps = {
  /**
   * 경계선의 기울기. 아래쪽이 위쪽보다 왼쪽으로 밀리는 정도(화면 폭 %).
   * 포스터의 오렌지 스트릭이 쓰는 skewX(-22deg) 와 같은 방향이다.
   */
  readonly slant?: number;
  /** 경계에 얹는 발광 띠 두께(px) */
  readonly edgeWidth?: number;
  /**
   * 발광 띠 색. 포스터 세트의 강조색을 그대로 넘긴다
   * (기본값은 라이트 "오버워치 테크" 포스터의 오렌지).
   */
  readonly color?: string;
  /** 띠 가운데의 밝은 쪽 색 */
  readonly colorSoft?: string;
};

const SlashWipePresentation: React.FC<
  TransitionPresentationComponentProps<SlashWipeProps>
> = ({
  children,
  presentationProgress,
  presentationDirection,
  passedProps,
}) => {
  const { width, height } = useVideoConfig();
  const slant = passedProps.slant ?? 34;
  const edgeWidth = passedProps.edgeWidth ?? 26;
  const color = passedProps.color ?? POSTER.orange;
  const colorSoft = passedProps.colorSoft ?? POSTER.orangeSoft;

  // 두 방향 모두 progress 가 0 → 1 로 간다.
  const eased = interpolate(presentationProgress, [0, 1], [0, 1], {
    easing: Easing.bezier(0.5, 0, 0.2, 1),
  });

  if (presentationDirection === "exiting") {
    // 나가는 장면은 아주 살짝 당겨지며 어두워진다 — 두 장이 겹친 깊이가 생긴다.
    // 축소가 아니라 확대인 이유: 줄이면 가장자리에 배경색 여백이 드러난다.
    return (
      <AbsoluteFill
        style={{
          scale: interpolate(eased, [0, 1], [1, 1.035]),
          filter: `brightness(${interpolate(eased, [0, 1], [1, 0.74])})`,
        }}
      >
        {children}
      </AbsoluteFill>
    );
  }

  // 경계선은 (xTop%, 0) 에서 (xBot%, 100%) 를 지난다.
  // 오른쪽 바깥에서 시작해 왼쪽 바깥으로 빠져나가고, 오른쪽이 드러나는 쪽이다.
  const xTop = (100 + slant) * (1 - eased);
  const xBot = xTop - slant;

  // 같은 기울기를 skewX 각도로 환산 (transform-origin 이 가운데라 위/아래가 대칭으로 벌어진다)
  const angle = -Math.atan(((slant / 100) * width) / height) * (180 / Math.PI);

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          clipPath: `polygon(${xTop}% 0%, 100% 0%, 100% 100%, ${xBot}% 100%)`,
          // 들어오면서 살짝 당겨진 채로 제자리를 찾는다. 확대 방향이라 가장자리가 비지 않는다.
          scale: interpolate(eased, [0, 1], [1.06, 1]),
        }}
      >
        {children}
      </AbsoluteFill>

      {/* 경계를 타고 지나가는 발광 띠 */}
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          width: edgeWidth,
          left: `calc(${xTop - slant / 2}% - ${edgeWidth / 2}px)`,
          transform: `skewX(${angle}deg)`,
          pointerEvents: "none",
          background: `linear-gradient(180deg,
            ${withAlpha(color, 0)} 0%,
            ${color} 14%,
            ${colorSoft} 50%,
            ${color} 86%,
            ${withAlpha(color, 0)} 100%)`,
          boxShadow: `0 0 44px ${withAlpha(color, 0.9)}, 0 0 130px ${withAlpha(color, 0.45)}`,
          opacity: interpolate(
            presentationProgress,
            [0, 0.12, 0.86, 1],
            [0, 1, 1, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          ),
        }}
      />
    </AbsoluteFill>
  );
};

/**
 * 사선 와이프 — 새 장면이 비스듬한 경계를 따라 오른쪽에서 덮어 온다.
 * 경계에는 발광 띠가 얹히고, 나가는 장면은 뒤로 밀리며 어두워진다.
 *
 * 기울기는 포스터가 쓰는 비스듬한 오렌지 스트릭과 같은 방향으로 맞췄다.
 * 장면이 전부 정지 이미지라 전환이 유일한 움직임이 되므로, 그냥 슬라이드보다
 * 한 겹 더 준 것이다.
 */
export const slashWipe = (
  props: SlashWipeProps = {},
): TransitionPresentation<SlashWipeProps> => ({
  component: SlashWipePresentation,
  props,
});
