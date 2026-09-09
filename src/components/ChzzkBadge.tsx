import React from "react";
import { Img, staticFile } from "remotion";
import { COLORS, withAlpha } from "../theme";
import { useAssetExists } from "./useAssetExists";

/**
 * 치지직 표기.
 *
 * 치지직 브랜드 가이드는 로고의 형태·색상 임의 변경을 금지하므로 직접 그리지 않는다.
 * `public/shared/assets/chzzk_logo.png` 에 공식 로고 파일을 넣으면 그대로 쓰고,
 * 없으면 플랫폼 이름을 브랜드 컬러(#00FFA3, 공식 로고 SVG 에서 확인)로 적은
 * 단순 텍스트 배지로 대체한다. 공식 로고 이미지에는 어떤 색도 덧입히지 않는다.
 *
 * 로고 내려받기: https://chzzk.gitbook.io/chzzk/resources/brand-guides
 */
export const ChzzkBadge: React.FC<{
  readonly height?: number;
  /**
   * 로고 옆에 "치지직" 글자를 함께 보여줄지.
   * 아이콘형 로고만 넣었을 때 무엇인지 바로 읽히게 하려는 것으로,
   * 로고 자체를 변형하는 것이 아니라 옆에 라벨을 두는 것이다.
   * 워드마크(글자 포함) 로고를 넣었다면 false 로 끈다.
   */
  readonly withLabel?: boolean;
  readonly style?: React.CSSProperties;
}> = ({ height = 46, withLabel = true, style }) => {
  const exists = useAssetExists("shared/assets/chzzk_logo.png");

  if (exists) {
    return (
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 12,
          ...style,
        }}
      >
        <Img
          src={staticFile("shared/assets/chzzk_logo.png")}
          style={{ height, width: "auto", objectFit: "contain" }}
        />
        {withLabel ? (
          <span
            style={{
              fontSize: height * 0.62,
              fontWeight: 800,
              letterSpacing: 1,
              color: COLORS.chzzk,
            }}
          >
            치지직
          </span>
        ) : null}
      </div>
    );
  }

  return (
    <div
      style={{
        height,
        display: "inline-flex",
        alignItems: "center",
        padding: "0 18px",
        borderRadius: 10,
        border: `2px solid ${COLORS.chzzk}`,
        backgroundColor: withAlpha(COLORS.chzzk, 0.12),
        boxShadow: `0 0 22px ${withAlpha(COLORS.chzzk, 0.35)}`,
        fontSize: height * 0.52,
        fontWeight: 800,
        letterSpacing: 1,
        color: COLORS.chzzk,
        ...style,
      }}
    >
      치지직
    </div>
  );
};
