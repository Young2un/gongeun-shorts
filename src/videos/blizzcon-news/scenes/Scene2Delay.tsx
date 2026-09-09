import React from "react";
import { Easing, Interactive, interpolate, useCurrentFrame } from "remotion";
import { Card } from "../../../components/Card";
import { Em } from "../../../components/Em";
import {
  ChevronIcon,
  DocumentIcon,
  GearIcon,
  MegaphoneIcon,
  TrophyIcon,
} from "../../../components/Icons";
import { MediaFrame } from "../../../components/MediaFrame";
import { SceneFrame } from "../../../components/SceneFrame";
import { TipBox } from "../../../components/TipBox";
import { BODY, BODY_SM, LABEL } from "../../../styles";
import { COLORS } from "../../../theme";
import { at, type SceneProps } from "../../../timing";
import { SCENE_META, VIDEO } from "../meta";

const meta = SCENE_META[1];

const STEPS = [
  {
    Icon: DocumentIcon,
    color: COLORS.grey,
    label: "기존 계획",
    note: "중간 패치",
  },
  {
    Icon: GearIcon,
    color: COLORS.orange,
    label: "추가 검수",
    note: "오류 방지",
  },
  { Icon: TrophyIcon, color: COLORS.green, label: "시즌 5", note: "출시 예정" },
];

/** Scene 2 · 과거 배틀패스가 시즌 5로 밀린 이유 */
export const Scene2Delay: React.FC<SceneProps> = ({ audioFrames }) => {
  const frame = useCurrentFrame();
  const flowAt = 28;

  return (
    <SceneFrame
      videoId={VIDEO.id}
      sceneId="scene2"
      kicker={meta.kicker}
      titleLines={["과거 배틀패스", "시즌 5로 연기"]}
      titleEm={{ "시즌 5로 연기": COLORS.orange }}
      titleSize={112}
      subtitle="중간 패치 출시는 취소됐습니다"
      source={meta.source}
    >
      <MediaFrame
        src="videos/blizzcon-news/images/battlepass-skins.jpg"
        delay={12}
        height={280}
        focusY={40}
        overlay="다시 열릴 예정이던 과거 배틀패스"
        credit="출처: Blizzard Entertainment"
      />

      <Card
        delay={flowAt}
        accent={COLORS.orange}
        header="일정 변경"
        headerVariant="tab"
        padding={30}
        name="일정 흐름"
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            gap: 8,
          }}
        >
          {STEPS.map((step, i) => (
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
                  width: 210,
                  flexShrink: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 12,
                  opacity: interpolate(
                    frame,
                    [flowAt + 10 + i * 10, flowAt + 24 + i * 10],
                    [0, 1],
                    {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                      easing: Easing.bezier(0.16, 1, 0.3, 1),
                    },
                  ),
                  scale: interpolate(
                    frame,
                    [flowAt + 10 + i * 10, flowAt + 34 + i * 10],
                    [0.68, 1],
                    {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                      easing: Easing.spring({ damping: 12 }),
                      output: "perceptual-scale",
                    },
                  ),
                }}
              >
                <step.Icon size={82} color={step.color} glow={i > 0} />
                <div style={{ ...LABEL, fontSize: 38, color: step.color }}>
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

      <TipBox
        delay={at(audioFrames, 0.55)}
        title="기능이 취소된 건 아님"
        icon={<MegaphoneIcon size={62} color={COLORS.orange} glow />}
      >
        <div style={{ ...BODY, fontSize: 38 }}>
          <Em
            text="품질 검수를 위해 시즌 5로 연기"
            em={{ "시즌 5": COLORS.orange }}
          />
        </div>
      </TipBox>
    </SceneFrame>
  );
};
