import React from "react";
import { AbsoluteFill } from "remotion";
import { HEIGHT, SAFE_AREA, WIDTH } from "../theme";

const Band: React.FC<{
  readonly label: string;
  readonly style: React.CSSProperties;
}> = ({ label, style }) => (
  <div
    style={{
      position: "absolute",
      backgroundColor: "rgba(255,0,64,0.28)",
      border: "2px dashed rgba(255,80,110,0.9)",
      color: "#fff",
      fontSize: 26,
      fontWeight: 800,
      padding: 8,
      ...style,
    }}
  >
    {label}
  </div>
);

/**
 * 유튜브 쇼츠 UI 가 덮는 영역을 붉게 표시하는 개발용 오버레이.
 * `src/theme.ts` 의 SHOW_SAFE_AREA 로 켜고 끈다. 실제 출력에는 켜지 않는다.
 */
export const SafeAreaGuide: React.FC = () => {
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <Band
        label={`상단 ${SAFE_AREA.top}px`}
        style={{ left: 0, right: 0, top: 0, height: SAFE_AREA.top }}
      />
      <Band
        label={`하단 ${SAFE_AREA.bottom}px · 제목/채널명/설명`}
        style={{ left: 0, right: 0, bottom: 0, height: SAFE_AREA.bottom }}
      />
      <Band
        label="우측 버튼"
        style={{
          right: 0,
          width: SAFE_AREA.right,
          top: SAFE_AREA.rightFrom,
          bottom: SAFE_AREA.bottom,
          writingMode: "vertical-rl",
        }}
      />
      <Band
        label=""
        style={{
          left: 0,
          width: SAFE_AREA.side,
          top: 0,
          bottom: 0,
          backgroundColor: "rgba(255,0,64,0.18)",
        }}
      />

      {/* 안전 영역 테두리 */}
      <div
        style={{
          position: "absolute",
          left: SAFE_AREA.side,
          right: SAFE_AREA.side,
          top: SAFE_AREA.top,
          bottom: SAFE_AREA.bottom,
          border: "3px solid rgba(80,255,140,0.9)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: SAFE_AREA.side,
          top: SAFE_AREA.top + 8,
          color: "#7cff9b",
          fontSize: 28,
          fontWeight: 800,
        }}
      >
        안전 영역 {WIDTH - SAFE_AREA.side * 2} ×{" "}
        {HEIGHT - SAFE_AREA.top - SAFE_AREA.bottom}
      </div>
    </AbsoluteFill>
  );
};
