import React from "react";
import {
  Easing,
  Img,
  Interactive,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { COLORS, withAlpha } from "../theme";
import { useAssetExists } from "./useAssetExists";

export type Hero = {
  /** 파일 이름 (확장자 제외) */
  readonly id: string;
  readonly name: string;
  /** 테두리 색으로 변경 방향을 표시 — 상향 green · 하향 grey */
  readonly tone?: "up" | "down" | "neutral";
};

const TONE_COLOR = {
  up: COLORS.green,
  down: COLORS.grey,
  neutral: COLORS.orange,
} as const;

const Portrait: React.FC<{
  readonly dir: string;
  readonly hero: Hero;
  readonly size: number;
  readonly delay: number;
}> = ({ dir, hero, size, delay }) => {
  const frame = useCurrentFrame();
  const src = `${dir}/${hero.id}.png`;
  const exists = useAssetExists(src);
  const color = TONE_COLOR[hero.tone ?? "neutral"];

  return (
    <Interactive.Div
      name={hero.name}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        opacity: interpolate(frame, [delay, delay + 10], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        }),
        scale: interpolate(frame, [delay, delay + 22], [0.6, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.spring({ damping: 12 }),
          output: "perceptual-scale",
        }),
      }}
    >
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          overflow: "hidden",
          border: `3px solid ${color}`,
          backgroundColor: COLORS.bg1,
          boxShadow: `0 0 20px ${withAlpha(color, 0.3)}`,
        }}
      >
        {exists ? (
          <Img
            src={staticFile(src)}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : null}
      </div>
      <div
        style={{
          fontSize: size * 0.24,
          fontWeight: 700,
          color: hero.tone === "down" ? COLORS.grey : COLORS.white,
          whiteSpace: "nowrap",
        }}
      >
        {hero.name}
      </div>
    </Interactive.Div>
  );
};

/**
 * 영웅 초상화 가로 줄.
 * 이번 패치에서 바뀐 영웅을 한눈에 보여줄 때 쓴다.
 * 테두리 색으로 상향(green) · 하향(grey) 을 구분한다.
 */
export const HeroRow: React.FC<{
  /** public/ 기준 초상화 폴더 */
  readonly dir: string;
  readonly heroes: readonly Hero[];
  readonly delay: number;
  readonly size?: number;
  readonly style?: React.CSSProperties;
}> = ({ dir, heroes, delay, size = 96, style }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      gap: 14,
      ...style,
    }}
  >
    {heroes.map((hero, i) => (
      <Portrait
        key={hero.id}
        dir={dir}
        hero={hero}
        size={size}
        delay={delay + i * 4}
      />
    ))}
  </div>
);
