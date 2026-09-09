import React from "react";
import { Easing, Interactive, interpolate, useCurrentFrame } from "remotion";
import { Card } from "../../../components/Card";
import { Em } from "../../../components/Em";
import { CrownIcon, ShieldIcon } from "../../../components/Icons";
import { SceneFrame } from "../../../components/SceneFrame";
import { TipBox } from "../../../components/TipBox";
import { BODY, BODY_SM, LABEL } from "../../../styles";
import { COLORS } from "../../../theme";
import { SCENE_META, VIDEO } from "../meta";
import { at, type SceneProps } from "../../../timing";
import { NUMERIC_FONT } from "../../../typography";

const meta = SCENE_META[3];

/** 최근 4판 중 3승 — 세 번째 판만 패배 */
const RESULTS = [
  { label: "승", win: true },
  { label: "승", win: true },
  { label: "패", win: false },
  { label: "승", win: true },
];

/** Scene 4 · 최후의 시련 — 등급을 다 채워도 마지막 관문이 있다 */
export const Scene4FinalTrial: React.FC<SceneProps> = ({ audioFrames }) => {
  const frame = useCurrentFrame();
  // 나레이션의 "최근 4판 중 3승" 시점
  const revealAt = at(audioFrames, 0.55);

  return (
    <SceneFrame
      videoId={VIDEO.id}
      sceneId="scene4"
      kicker={meta.kicker}
      titleLines={["등급 채워도 끝이 아니다", "최근 4판 중 3승!"]}
      titleEm={{ "4판 중 3승": COLORS.orange }}
      titleSize={96}
      subtitle="마지막에 최후의 시련이 하나 더 남는다"
      source={meta.source}
    >
      <Card
        delay={16}
        accent={COLORS.orange}
        header="최후의 시련 · 완료 조건"
        name="시련 카드"
      >
        <div
          style={{ display: "flex", justifyContent: "space-between", gap: 20 }}
        >
          {RESULTS.map((result, i) => (
            <Interactive.Div
              key={i}
              name={`${i + 1}번째 판`}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 14,
                opacity: interpolate(
                  frame,
                  [revealAt + i * 10, revealAt + i * 10 + 8],
                  [0, 1],
                  {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                    easing: Easing.bezier(0.16, 1, 0.3, 1),
                  },
                ),
                scale: interpolate(
                  frame,
                  [revealAt + i * 10, revealAt + i * 10 + 22],
                  [0.6, 1],
                  {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                    easing: Easing.spring({ damping: 11 }),
                    output: "perceptual-scale",
                  },
                ),
              }}
            >
              <ShieldIcon
                size={132}
                color={result.win ? COLORS.green : COLORS.grey}
                mark={result.win ? "win" : "loss"}
                glow={result.win}
              />
              <div
                style={{
                  ...LABEL,
                  fontSize: 40,
                  color: result.win ? COLORS.green : COLORS.grey,
                }}
              >
                {result.label}
              </div>
            </Interactive.Div>
          ))}
        </div>

        <div
          style={{
            marginTop: 30,
            paddingTop: 26,
            borderTop: `1px solid ${COLORS.panelBorder}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
          }}
        >
          <CrownIcon size={52} color={COLORS.orange} glow />
          <span
            style={{
              fontFamily: NUMERIC_FONT,
              fontSize: 56,
              fontWeight: 900,
              color: COLORS.orange,
            }}
          >
            4판 중 3승
          </span>
          <span style={{ ...BODY_SM, fontSize: 36 }}>이면 통과</span>
        </div>
      </Card>

      <TipBox
        delay={at(audioFrames, 0.65)}
        title="검투사 등급은 체크포인트일 뿐"
        icon={<ShieldIcon size={62} color={COLORS.orange} glow />}
      >
        <div style={{ ...BODY, fontSize: 38 }}>
          <Em
            text="이 시련을 통과해야 진짜 완료로 인정됩니다."
            em={{ "진짜 완료": COLORS.orange }}
          />
        </div>
      </TipBox>
    </SceneFrame>
  );
};
