import React from "react";
import { Easing, Interactive, interpolate, useCurrentFrame } from "remotion";
import { Card } from "../../../components/Card";
import { Em } from "../../../components/Em";
import {
  ChevronIcon,
  MegaphoneIcon,
  PersonIcon,
  ShieldIcon,
  TrophyIcon,
} from "../../../components/Icons";
import { SceneFrame } from "../../../components/SceneFrame";
import { TipBox } from "../../../components/TipBox";
import { BODY, BODY_SM, LABEL } from "../../../styles";
import { COLORS } from "../../../theme";
import { SCENE_META, VIDEO } from "../meta";
import { at, type SceneProps } from "../../../timing";

const meta = SCENE_META[2];

/** 연승 단계 — 트로피 개수로 보너스 크기를 보여준다 */
const STEPS = [
  {
    trophies: 1,
    big: false,
    color: COLORS.green,
    label: "1승",
    note: "그룹 생성",
  },
  {
    trophies: 2,
    big: false,
    color: COLORS.green,
    label: "2승",
    note: "팀 유지",
  },
  {
    trophies: 3,
    big: false,
    color: COLORS.green,
    label: "3승",
    note: "보너스 ↑",
  },
  {
    trophies: 3,
    big: true,
    color: COLORS.gold,
    label: "연승!",
    note: "보너스 ↑↑",
  },
];

const TrophyStack: React.FC<{
  readonly count: number;
  readonly big: boolean;
  readonly color: string;
}> = ({ count, big, color }) => (
  <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 70 }}>
    {new Array(count).fill(true).map((_, i) => (
      <TrophyIcon
        key={i}
        size={big && i === Math.floor(count / 2) ? 56 : big ? 40 : 46}
        color={color}
        glow={i === 0}
      />
    ))}
  </div>
);

/** Scene 3 · 명성 보너스 — 그룹을 유지할수록 더 받는다 */
export const Scene3Reputation: React.FC<SceneProps> = ({ audioFrames }) => {
  const frame = useCurrentFrame();
  const flowAt = 16;

  return (
    <SceneFrame
      videoId={VIDEO.id}
      sceneId="scene3"
      kicker={meta.kicker}
      titleLines={["그룹 유지하고", "연승할수록 명성 UP!"]}
      titleEm={{ "명성 UP!": COLORS.orange }}
      titleSize={100}
      subtitle="그룹 안 깨고 이길수록 보너스가 커진다"
      source={meta.source}
    >
      <Card
        delay={flowAt}
        accent={COLORS.blue}
        header="예시 흐름"
        headerVariant="tab"
        padding={30}
        name="연승 흐름"
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: 4 }}>
          <div
            style={{
              width: 120,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{ height: 70, display: "flex", alignItems: "flex-end" }}
            >
              <PersonIcon size={68} color={COLORS.blue} glow />
            </div>
            <div
              style={{
                ...LABEL,
                fontSize: 26,
                whiteSpace: "nowrap",
                color: COLORS.blue,
              }}
            >
              솔로 시작
            </div>
          </div>

          {STEPS.map((step, i) => (
            <React.Fragment key={step.label}>
              <ChevronIcon
                width={36}
                to={step.color}
                style={{ marginTop: 24, opacity: 0.9 }}
              />
              <Interactive.Div
                name={`${step.label} 단계`}
                style={{
                  width: 150,
                  flexShrink: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 12,
                  opacity: interpolate(
                    frame,
                    [flowAt + 12 + i * 9, flowAt + 24 + i * 9],
                    [0, 1],
                    {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                      easing: Easing.bezier(0.16, 1, 0.3, 1),
                    },
                  ),
                  scale: interpolate(
                    frame,
                    [flowAt + 12 + i * 9, flowAt + 34 + i * 9],
                    [0.65, 1],
                    {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                      easing: Easing.spring({ damping: 12 }),
                      output: "perceptual-scale",
                    },
                  ),
                }}
              >
                <TrophyStack
                  count={step.trophies}
                  big={step.big}
                  color={step.color}
                />
                <div style={{ ...LABEL, fontSize: 36, color: step.color }}>
                  {step.label}
                </div>
                <div style={{ ...BODY_SM, fontSize: 28, whiteSpace: "nowrap" }}>
                  {step.note}
                </div>
              </Interactive.Div>
            </React.Fragment>
          ))}
        </div>
      </Card>

      <Card delay={at(audioFrames, 0.3)} name="연승 권유">
        <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
          <MegaphoneIcon
            size={64}
            color={COLORS.blue}
            glow
            style={{ flexShrink: 0 }}
          />
          <div>
            <div style={{ ...BODY, fontWeight: 700 }}>
              좋은 팀을 만났다면? 계속 함께 연승 GO!
            </div>
            <div style={{ ...BODY, fontSize: 38, marginTop: 6 }}>
              <Em
                text="연승할수록 더 큰 명성 보너스를 받습니다."
                em={{ "명성 보너스": COLORS.orange }}
              />
            </div>
          </div>
        </div>
      </Card>

      <TipBox
        delay={at(audioFrames, 0.55)}
        title="중간에 그룹을 나가면?"
        icon={<ShieldIcon size={62} color={COLORS.orange} mark="loss" glow />}
      >
        <div style={{ ...BODY, fontSize: 38 }}>
          <Em
            text="내 명성은 남지만, 같이 이긴 사람에게서 오던 보너스는 사라집니다."
            em={{ "보너스는 사라집니다": COLORS.orange }}
          />
        </div>
      </TipBox>
    </SceneFrame>
  );
};
