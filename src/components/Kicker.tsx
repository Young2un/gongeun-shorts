import React from "react";
import { COLORS, LAYOUT, MARGIN } from "../theme";

/** 좌상단 장면 소제목 */
export const Kicker: React.FC<{ readonly text: string }> = ({ text }) => {
  return (
    <div
      style={{
        position: "absolute",
        left: MARGIN,
        top: LAYOUT.kickerY,
        fontSize: 34,
        fontWeight: 600,
        color: COLORS.white,
        textShadow: "0 2px 10px rgba(0,0,0,0.8)",
      }}
    >
      {text}
    </div>
  );
};
