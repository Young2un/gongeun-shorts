import React from "react";
import { Easing, Interactive, interpolate, useCurrentFrame } from "remotion";
import { Card } from "../../../components/Card";
import { Em } from "../../../components/Em";
import { ChevronIcon, MegaphoneIcon } from "../../../components/Icons";
import { SceneFrame } from "../../../components/SceneFrame";
import { TipBox } from "../../../components/TipBox";
import { BODY, BODY_SM, LABEL } from "../../../styles";
import { COLORS } from "../../../theme";
import { SCENE_META, VIDEO } from "../meta";
import { at, type SceneProps } from "../../../timing";
import { NUMERIC_FONT } from "../../../typography";

const meta = SCENE_META[0];

/** 시작/종료 시각 한 칸 */
const TimeSlot: React.FC<{ readonly label: string; readonly time: string }> = ({
  label,
  time,
}) => (
  <div style={{ flex: 1, textAlign: "center" }}>
    <div style={{ ...LABEL, color: COLORS.grey, marginBottom: 10 }}>
      {label}
    </div>
    <div
      style={{
        fontFamily: NUMERIC_FONT,
        fontSize: 62,
        fontWeight: 900,
        color: COLORS.white,
      }}
    >
      {time}
    </div>
  </div>
);

/** Scene 1 · 훅 — 언제, 무엇이 열리는지 */
export const Scene1Hook: React.FC<SceneProps> = ({ audioFrames }) => {
  const frame = useCurrentFrame();

  return (
    <SceneFrame
      videoId={VIDEO.id}
      sceneId="scene1"
      kicker={meta.kicker}
      titleLines={["9월 5일 새벽 3시!", "팀 드라이브 시작"]}
      titleEm={{ "팀 드라이브": COLORS.orange }}
      titleSize={112}
      subtitle="경쟁전에 처음 열리는 3일 한정 이벤트"
      source={meta.source}
    >
      <Card
        delay={20}
        accent={COLORS.orange}
        header="이벤트 기간"
        name="기간 카드"
      >
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <TimeSlot label="시작" time="9/5 03:00" />
          <ChevronIcon width={78} to={COLORS.orange} />
          <TimeSlot label="종료" time="9/8 03:00" />
        </div>

        <div
          style={{
            marginTop: 34,
            paddingTop: 30,
            borderTop: `1px solid ${COLORS.panelBorder}`,
            display: "flex",
            alignItems: "baseline",
            justifyContent: "center",
            gap: 18,
          }}
        >
          <Interactive.Div
            name="3일 강조"
            style={{
              fontFamily: NUMERIC_FONT,
              fontSize: 120,
              fontWeight: 900,
              lineHeight: 1,
              color: COLORS.orange,
              // 나레이션의 "딱 3일" 시점(오디오의 약 64%)에 맞춘다.
              scale: interpolate(
                frame,
                [at(audioFrames, 0.64), at(audioFrames, 0.64) + 26],
                [0.78, 1],
                {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.spring({ damping: 16 }),
                  output: "perceptual-scale",
                },
              ),
            }}
          >
            단 3일
          </Interactive.Div>
          <span style={{ ...BODY_SM, fontSize: 38 }}>한국 시각 기준</span>
        </div>
      </Card>

      <TipBox
        delay={at(audioFrames, 0.7)}
        title="기존 드라이브의 팀 버전"
        icon={<MegaphoneIcon size={62} color={COLORS.orange} glow />}
      >
        <div style={BODY}>
          <Em
            text="아직 실험 단계라 반응 따라 바뀔 수 있음."
            em={{ "실험 단계": COLORS.orange }}
          />
        </div>
      </TipBox>
    </SceneFrame>
  );
};
