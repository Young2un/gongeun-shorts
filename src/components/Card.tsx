import React from "react";
import { Easing, Interactive, interpolate, useCurrentFrame } from "remotion";
import { CARD, COLORS, MOTION, shade, THEME_FX, withAlpha } from "../theme";

/** 의미색을 카드 헤더용 어두운 그라데이션으로 바꾼다 */
const headerBackground = (accent: string) =>
  `linear-gradient(100deg, ${shade(accent, 0.42)} 0%, ${shade(accent, 0.74)} 100%)`;

/**
 * 카드 패널.
 * 아래에서 spring 으로 올라오고, 헤더 바는 좌→우 wipe 로 열린다.
 */
export const Card: React.FC<{
  /** 등장 시작 프레임 */
  readonly delay: number;
  /** 헤더 색 (의미색). 없으면 헤더 없는 순수 패널 */
  readonly accent?: string;
  readonly header?: string;
  /** bar = 카드 전체 폭 헤더, tab = 좌상단 작은 라벨 */
  readonly headerVariant?: "bar" | "tab";
  /** 헤더 글자 크기. 좁은 카드에서는 줄인다. */
  readonly headerSize?: number;
  readonly padding?: number;
  readonly style?: React.CSSProperties;
  readonly name?: string;
  readonly children?: React.ReactNode;
}> = ({
  delay,
  accent,
  header,
  headerVariant = "bar",
  headerSize,
  padding = CARD.padding,
  style,
  name = "카드",
  children,
}) => {
  const frame = useCurrentFrame();

  return (
    <Interactive.Div
      name={name}
      style={{
        backgroundColor: COLORS.panel,
        border: `1px solid ${THEME_FX.cardRim ? withAlpha(COLORS.rim, 0.55) : COLORS.panelBorder}`,
        boxShadow: THEME_FX.cardRim
          ? `0 0 0 1px ${withAlpha(COLORS.rim, 0.22)}, 0 18px 60px ${withAlpha(COLORS.rim, 0.28)}, inset 0 1px 0 rgba(255,255,255,0.07)`
          : undefined,
        borderRadius: CARD.radius,
        overflow: "hidden",
        position: "relative",
        opacity: interpolate(frame, [delay, delay + 12], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        }),
        translate: interpolate(
          frame,
          [delay, delay + 24],
          ["0px 46px", "0px 0px"],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.spring({ damping: 18 }),
          },
        ),
        ...style,
      }}
    >
      {/* 등장 직후 빛이 한 번 훑고 지나간다 */}
      {MOTION > 0 ? (
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            width: "38%",
            pointerEvents: "none",
            background:
              "linear-gradient(100deg, transparent 0%, rgba(255,255,255,0.13) 50%, transparent 100%)",
            transform: "skewX(-16deg)",
            left: interpolate(
              frame,
              [delay + 6, delay + 42],
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

      {header && accent ? (
        <div
          style={{
            height:
              headerVariant === "bar"
                ? Math.max(CARD.headerHeight, (headerSize ?? 40) + 24)
                : (headerSize ?? 34) + 20,
            margin: headerVariant === "bar" ? 0 : "18px 0 0 18px",
            width: headerVariant === "bar" ? "100%" : "fit-content",
            borderRadius:
              headerVariant === "bar"
                ? `${CARD.radius - 1}px ${CARD.radius - 1}px 0 0`
                : CARD.headerRadius,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              padding: "0 26px",
              background: headerBackground(accent),
              borderBottom: `2px solid ${accent}`,
              whiteSpace: "nowrap",
              color: COLORS.white,
              fontSize: headerSize ?? (headerVariant === "bar" ? 40 : 34),
              fontWeight: 800,
              textShadow: "0 2px 6px rgba(0,0,0,0.75)",
              width: interpolate(
                frame,
                [delay + 6, delay + 22],
                ["0%", "100%"],
                {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.bezier(0.16, 1, 0.3, 1),
                },
              ),
            }}
          >
            {header}
          </div>
        </div>
      ) : null}

      <div style={{ padding }}>{children}</div>
    </Interactive.Div>
  );
};
