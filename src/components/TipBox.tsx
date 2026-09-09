import React from "react";
import { Easing, Interactive, interpolate, useCurrentFrame } from "remotion";
import { CARD, COLORS, THEME_FX, withAlpha } from "../theme";

/** 좌측 아이콘 + 우측 텍스트의 팁/주의 박스. 테두리 orange, 배경 orangeGlow 8%. */
export const TipBox: React.FC<{
  readonly delay: number;
  readonly icon: React.ReactNode;
  readonly title?: string;
  readonly style?: React.CSSProperties;
  readonly children?: React.ReactNode;
}> = ({ delay, icon, title, style, children }) => {
  const frame = useCurrentFrame();

  return (
    <Interactive.Div
      name="팁 박스"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 28,
        padding: "26px 32px",
        borderRadius: CARD.radius,
        border: `1px solid ${COLORS.orange}`,
        backgroundColor: withAlpha(COLORS.orange, 0.08),
        boxShadow: THEME_FX.cardRim
          ? `0 0 34px ${withAlpha(COLORS.orange, 0.22)}`
          : undefined,
        opacity: interpolate(frame, [delay, delay + 12], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        }),
        translate: interpolate(
          frame,
          [delay, delay + 24],
          ["0px 36px", "0px 0px"],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.spring({ damping: 18 }),
          },
        ),
        ...style,
      }}
    >
      <div style={{ flexShrink: 0 }}>{icon}</div>
      <div>
        {title ? (
          <div
            style={{
              fontSize: 40,
              fontWeight: 800,
              color: COLORS.orange,
              marginBottom: 8,
            }}
          >
            {title}
          </div>
        ) : null}
        {children}
      </div>
    </Interactive.Div>
  );
};
