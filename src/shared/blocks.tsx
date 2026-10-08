import React, { useContext } from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  Interactive,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { Card } from "../components/Card";
import { Em, type Highlights } from "../components/Em";
import { ChevronIcon, type IconProps } from "../components/Icons";
import { BODY, BODY_SM, LABEL } from "../styles";
import { COLORS, withAlpha } from "../theme";
import { at } from "../timing";
import { NUMERIC_FONT } from "../typography";

/**
 * SCRIPT-SPEC 의 블록(paragraphs · flow · icons-row · stat)을 그대로 그리는 공용 부품.
 * 대본 JSON 의 블록을 장면 컴포넌트에서 거의 1:1 로 옮길 수 있게 해 둔 것이다.
 */

const CLAMP = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

/** 강조 구절 하나를 orange 로 — 대본 JSON 의 `em` 필드 그대로 */
export const hi = (em?: string, color: string = COLORS.orange): Highlights =>
  em ? { [em]: color } : {};

/** 페이드 + 아래서 올라오기 */
export const rise = (
  frame: number,
  start: number,
  distance = 22,
): React.CSSProperties => ({
  opacity: interpolate(frame, [start, start + 12], [0, 1], {
    ...CLAMP,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  }),
  translate: interpolate(
    frame,
    [start, start + 24],
    [`0px ${distance}px`, "0px 0px"],
    { ...CLAMP, easing: Easing.spring({ damping: 200 }) },
  ),
});

export type Line = {
  readonly text: string;
  readonly em?: string;
  readonly color?: string;
};

/** 줄 목록 — `start` 부터 `step` 프레임 간격으로 순서대로 등장 */
export const Lines: React.FC<{
  readonly lines: readonly Line[];
  readonly start: number;
  readonly step?: number;
  readonly size?: number;
  readonly weight?: number;
  readonly gap?: number;
}> = ({ lines, start, step = 8, size = 40, weight = 700, gap = 10 }) => {
  const frame = useCurrentFrame();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap }}>
      {lines.map((line, i) => (
        <Interactive.Div
          key={line.text}
          name={`줄 ${i + 1}`}
          style={{
            ...BODY,
            fontSize: size,
            fontWeight: weight,
            lineHeight: 1.5,
            ...rise(frame, start + i * step, 14),
          }}
        >
          <Em text={line.text} em={hi(line.em, line.color)} />
        </Interactive.Div>
      ))}
    </div>
  );
};

/** 문단 카드 — 나레이션 비율(ratio) 시점에 한 문단씩 */
export const ParagraphCard: React.FC<{
  readonly audioFrames: number;
  readonly delay: number;
  readonly items: readonly (Line & { readonly ratio: number })[];
  readonly size?: number;
  readonly name?: string;
}> = ({ audioFrames, delay, items, size = 40, name = "문단 카드" }) => {
  const frame = useCurrentFrame();

  return (
    <Card delay={delay} name={name}>
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {items.map((item, i) => (
          <Interactive.Div
            key={item.text}
            name={`문단 ${i + 1}`}
            style={{
              ...BODY,
              fontSize: size,
              lineHeight: 1.5,
              ...rise(frame, at(audioFrames, item.ratio)),
            }}
          >
            <Em text={item.text} em={hi(item.em, item.color)} />
          </Interactive.Div>
        ))}
      </div>
    </Card>
  );
};

export type Step = {
  readonly Icon: React.FC<IconProps>;
  readonly color: string;
  readonly label: string;
  readonly note: string;
};

/** 흐름 카드 — 아이콘 단계가 화살표로 이어진다 */
export const FlowCard: React.FC<{
  readonly delay: number;
  readonly accent: string;
  readonly header: string;
  readonly steps: readonly Step[];
}> = ({ delay, accent, header, steps }) => {
  const frame = useCurrentFrame();

  return (
    <Card
      delay={delay}
      accent={accent}
      header={header}
      name={header}
      padding={30}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          gap: 8,
        }}
      >
        {steps.map((step, i) => (
          <React.Fragment key={step.label}>
            {i > 0 ? (
              <ChevronIcon
                width={52}
                to={step.color}
                style={{ marginTop: 32, opacity: 0.9 }}
              />
            ) : null}
            <Interactive.Div
              name={step.label}
              style={{
                width: 220,
                flexShrink: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 12,
                opacity: interpolate(
                  frame,
                  [delay + 10 + i * 10, delay + 24 + i * 10],
                  [0, 1],
                  { ...CLAMP, easing: Easing.bezier(0.16, 1, 0.3, 1) },
                ),
                scale: interpolate(
                  frame,
                  [delay + 10 + i * 10, delay + 34 + i * 10],
                  [0.68, 1],
                  {
                    ...CLAMP,
                    easing: Easing.spring({ damping: 12 }),
                    output: "perceptual-scale",
                  },
                ),
              }}
            >
              <step.Icon
                size={82}
                color={step.color}
                glow={i === steps.length - 1}
              />
              <div
                style={{
                  ...LABEL,
                  fontSize: 36,
                  color: step.color,
                  whiteSpace: "nowrap",
                }}
              >
                {step.label}
              </div>
              <div style={{ ...BODY_SM, fontSize: 30, whiteSpace: "nowrap" }}>
                {step.note}
              </div>
            </Interactive.Div>
          </React.Fragment>
        ))}
      </div>
    </Card>
  );
};

export type RowItem = {
  readonly Icon: React.FC<IconProps>;
  readonly color: string;
  readonly label: string;
};

/** 아이콘 나열 카드 */
export const IconRowCard: React.FC<{
  readonly delay: number;
  readonly accent: string;
  readonly header: string;
  readonly items: readonly RowItem[];
  readonly footnote?: string;
  readonly labelSize?: number;
}> = ({ delay, accent, header, items, footnote, labelSize = 30 }) => {
  const frame = useCurrentFrame();

  return (
    <Card
      delay={delay}
      accent={accent}
      header={header}
      name={header}
      padding={30}
    >
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        {items.map((item, i) => (
          <Interactive.Div
            key={item.label}
            name={item.label}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
              opacity: interpolate(
                frame,
                [delay + 10 + i * 6, delay + 22 + i * 6],
                [0, 1],
                { ...CLAMP, easing: Easing.bezier(0.16, 1, 0.3, 1) },
              ),
              scale: interpolate(
                frame,
                [delay + 10 + i * 6, delay + 30 + i * 6],
                [0.6, 1],
                {
                  ...CLAMP,
                  easing: Easing.spring({ damping: 12 }),
                  output: "perceptual-scale",
                },
              ),
            }}
          >
            <item.Icon size={72} color={item.color} glow />
            <div
              style={{
                ...LABEL,
                fontSize: labelSize,
                color: item.color === COLORS.grey ? COLORS.grey : COLORS.white,
                whiteSpace: "nowrap",
              }}
            >
              {item.label}
            </div>
          </Interactive.Div>
        ))}
      </div>
      {footnote ? (
        <div
          style={{
            ...BODY_SM,
            fontSize: 30,
            marginTop: 18,
            textAlign: "center",
          }}
        >
          {footnote}
        </div>
      ) : null}
    </Card>
  );
};

/** 큰 숫자 카드 */
export const StatCard: React.FC<{
  readonly delay: number;
  readonly accent: string;
  readonly header: string;
  readonly value: string;
  readonly note?: string;
  readonly valueSize?: number;
  readonly Icon?: React.FC<IconProps>;
  readonly padding?: number;
  readonly headerSize?: number;
  readonly style?: React.CSSProperties;
}> = ({
  delay,
  accent,
  header,
  value,
  note,
  valueSize = 112,
  Icon,
  padding,
  headerSize,
  style,
}) => {
  const frame = useCurrentFrame();

  return (
    <Card
      delay={delay}
      accent={accent}
      header={header}
      name={header}
      padding={padding}
      headerSize={headerSize}
      style={style}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 30,
        }}
      >
        {Icon ? (
          <Icon size={92} color={accent} glow style={{ flexShrink: 0 }} />
        ) : null}
        <Interactive.Div
          name="숫자 강조"
          style={{
            fontFamily: NUMERIC_FONT,
            fontSize: valueSize,
            fontWeight: 900,
            lineHeight: 1,
            color: accent,
            whiteSpace: "nowrap",
            scale: interpolate(frame, [delay + 4, delay + 32], [0.76, 1], {
              ...CLAMP,
              easing: Easing.spring({ damping: 16 }),
              output: "perceptual-scale",
            }),
          }}
        >
          {value}
        </Interactive.Div>
      </div>
      {note ? (
        <div
          style={{
            ...BODY_SM,
            fontSize: 34,
            marginTop: 16,
            textAlign: "center",
          }}
        >
          {note}
        </div>
      ) : null}
    </Card>
  );
};

/** 이미지 두 장을 나란히 */
export const Pair: React.FC<{ readonly children: React.ReactNode }> = ({
  children,
}) => <div style={{ display: "flex", gap: 24 }}>{children}</div>;

/**
 * 화려한 판 스위치. 영상의 Rich 컴포지션이 true 로 감싸면
 * 각 장면의 `SceneBackdrop` 이 공식 키아트를 화면 전체에 깐다.
 */
export const RichContext = React.createContext(false);

/**
 * 장면 키아트 배경 — 기본 배경 위, 내용 아래.
 * 세로 화면이라 가로 원본의 가운데만 보인다. `focusY` 로 위아래 초점을 잡는다.
 * 카드가 읽히도록 아래로 갈수록 진한 스크림을 얹고, 제목 뒤에는 오렌지 빛을 모은다.
 */
export const SceneBackdrop: React.FC<{
  /** public/ 기준 경로 */
  readonly src: string;
  readonly focusY?: number;
}> = ({ src, focusY = 40 }) => {
  const rich = useContext(RichContext);
  const frame = useCurrentFrame();

  if (!rich) {
    return null;
  }

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Img
        src={staticFile(src)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: `50% ${focusY}%`,
          filter: "brightness(0.66) saturate(1.3) blur(1.5px)",
          opacity: interpolate(frame, [0, 16], [0, 1], CLAMP),
          scale: interpolate(frame, [0, 720], [1.12, 1.24], {
            ...CLAMP,
            easing: Easing.linear,
          }),
        }}
      />
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, ${withAlpha(COLORS.bg0, 0.5)} 0%, ${withAlpha(COLORS.bg0, 0.28)} 26%, ${withAlpha(COLORS.bg0, 0.68)} 58%, ${withAlpha(COLORS.bg0, 0.94)} 100%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(900px 640px at 50% 16%, ${withAlpha(COLORS.orange, 0.2)} 0%, transparent 70%)`,
        }}
      />
    </AbsoluteFill>
  );
};
