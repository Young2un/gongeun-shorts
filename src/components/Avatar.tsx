import React from "react";
import { Img, staticFile } from "remotion";
import { COLORS } from "../theme";
import { PersonIcon } from "./Icons";
import { useAssetExists } from "./useAssetExists";

/**
 * 원형 프로필 사진.
 * `public/shared/assets/profile.jpg` 가 없으면 사람 아이콘으로 대체한다.
 */
export const Avatar: React.FC<{
  readonly size: number;
  readonly ring?: string;
  /** 확대 배율. 인물 사진은 얼굴이 작게 잡히므로 조금 당겨준다. */
  readonly zoom?: number;
  /** 세로 초점(%). 낮을수록 위쪽(얼굴)을 잡는다. */
  readonly focusY?: number;
  readonly style?: React.CSSProperties;
}> = ({ size, ring = COLORS.chzzk, zoom = 1.35, focusY = 28, style }) => {
  const exists = useAssetExists("shared/assets/profile.jpg");

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        overflow: "hidden",
        flexShrink: 0,
        border: `5px solid ${ring}`,
        backgroundColor: COLORS.bg1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: `0 0 46px ${ring}66, 0 0 90px ${ring}33`,
        ...style,
      }}
    >
      {exists ? (
        <Img
          src={staticFile("shared/assets/profile.jpg")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: `50% ${focusY}%`,
            scale: zoom,
          }}
        />
      ) : (
        <PersonIcon size={size * 0.62} color={COLORS.grey} />
      )}
    </div>
  );
};
