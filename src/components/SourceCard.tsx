import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { CARD, COLORS, LAYOUT, MARGIN } from "../theme";
import { DocumentIcon } from "./Icons";

/** 하단 출처 카드 — 문서 아이콘 + 2줄 */
export const SourceCard: React.FC<{
  readonly lines: readonly string[];
  readonly delay?: number;
}> = ({ lines, delay = 0 }) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        position: "absolute",
        left: MARGIN,
        right: MARGIN,
        top: LAYOUT.sourceY,
        display: "flex",
        alignItems: "center",
        gap: 22,
        padding: "18px 26px",
        borderRadius: CARD.radius,
        backgroundColor: COLORS.panel,
        border: `1px solid ${COLORS.panelBorder}`,
        opacity: interpolate(frame, [delay, delay + 16], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        }),
      }}
    >
      <DocumentIcon size={46} color={COLORS.grey} style={{ flexShrink: 0 }} />
      <div
        style={{
          fontSize: 28,
          fontWeight: 400,
          lineHeight: 1.4,
          color: COLORS.dim,
        }}
      >
        {lines.map((line) => (
          <div key={line}>{line}</div>
        ))}
      </div>
    </div>
  );
};
