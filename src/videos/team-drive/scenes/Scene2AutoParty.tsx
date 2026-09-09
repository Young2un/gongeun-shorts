import React from "react";
import { Easing, Interactive, interpolate, useCurrentFrame } from "remotion";
import { Card } from "../../../components/Card";
import { Em } from "../../../components/Em";
import {
  ChevronIcon,
  CrownIcon,
  GearIcon,
  PersonIcon,
  TrophyIcon,
} from "../../../components/Icons";
import { SceneFrame } from "../../../components/SceneFrame";
import { TipBox } from "../../../components/TipBox";
import { BODY, BODY_SM, LABEL } from "../../../styles";
import { COLORS } from "../../../theme";
import { SCENE_META, VIDEO } from "../meta";
import { at, type SceneProps } from "../../../timing";

const meta = SCENE_META[1];

/** 그룹으로 묶이는 팀원 5명 */
const TEAM = [
  COLORS.orange,
  COLORS.white,
  COLORS.white,
  COLORS.white,
  COLORS.white,
];

/** 흐름 카드 한 칸 */
const Step: React.FC<{
  readonly delay: number;
  readonly accent: string;
  readonly header: string;
  readonly grow: number;
  readonly children: React.ReactNode;
}> = ({ delay, accent, header, grow, children }) => (
  <Card
    delay={delay}
    accent={accent}
    header={header}
    headerSize={26}
    padding={18}
    name={header}
    style={{ flexGrow: grow, flexBasis: 0, minWidth: 0 }}
  >
    <div
      style={{
        height: 210,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 14,
      }}
    >
      {children}
    </div>
  </Card>
);

/** Scene 2 · 자동 파티 — 이기면 5명이 그대로 묶인다 */
export const Scene2AutoParty: React.FC<SceneProps> = ({ audioFrames }) => {
  const frame = useCurrentFrame();
  const flowAt = 14;

  return (
    <SceneFrame
      videoId={VIDEO.id}
      sceneId="scene2"
      kicker={meta.kicker}
      titleLines={["혼자 해도 OK!", "이기면 자동 그룹!"]}
      titleEm={{ "자동 그룹": COLORS.orange }}
      titleSize={112}
      subtitle="승리하면 그 팀원들과 자동으로 그룹 생성"
      source={meta.source}
    >
      {/* 솔로 → 승리 → 자동 그룹 */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Step delay={flowAt} accent={COLORS.blue} header="솔로로 시작" grow={1}>
          <PersonIcon size={104} color={COLORS.blue} glow />
          <div style={{ ...LABEL, color: COLORS.blue }}>나 (솔로)</div>
        </Step>

        <ChevronIcon width={58} to={COLORS.green} />

        <Step
          delay={flowAt + 8}
          accent={COLORS.green}
          header="경쟁전 승리!"
          grow={1}
        >
          <TrophyIcon size={104} color={COLORS.green} glow />
          <div style={{ ...LABEL, color: COLORS.green }}>VICTORY!</div>
        </Step>

        <ChevronIcon width={58} to={COLORS.orange} />

        <Step
          delay={flowAt + 16}
          accent={COLORS.orange}
          header="자동 그룹 생성"
          grow={1.6}
        >
          <div style={{ display: "flex", alignItems: "flex-end", gap: 10 }}>
            {TEAM.map((color, i) => (
              <Interactive.Div
                key={i}
                name={`팀원 ${i + 1}`}
                style={{
                  position: "relative",
                  opacity: interpolate(
                    frame,
                    [flowAt + 24 + i * 4, flowAt + 32 + i * 4],
                    [0, 1],
                    {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                      easing: Easing.bezier(0.16, 1, 0.3, 1),
                    },
                  ),
                  scale: interpolate(
                    frame,
                    [flowAt + 24 + i * 4, flowAt + 42 + i * 4],
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
                {i === 0 ? (
                  <CrownIcon
                    size={30}
                    color={COLORS.orange}
                    style={{ position: "absolute", top: -26, left: 12 }}
                  />
                ) : null}
                <PersonIcon size={56} color={color} glow={i === 0} />
              </Interactive.Div>
            ))}
          </div>
          <div style={{ ...LABEL, color: COLORS.orange }}>
            같은 그룹으로 묶임
          </div>
        </Step>
      </div>

      <TipBox
        delay={at(audioFrames, 0.55)}
        title="자동 그룹이 싫다면?"
        icon={<GearIcon size={62} color={COLORS.orange} glow />}
      >
        <div style={{ ...BODY, fontSize: 36 }}>
          <Em
            text={
              "소셜 → 일반 → 그룹 → '팀 드라이브 승리 시\n자동 그룹 배치 활성화' 를 OFF"
            }
            em={{ OFF: COLORS.orange }}
          />
        </div>
      </TipBox>

      <Card delay={at(audioFrames, 0.78)} name="직접 그룹">
        <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
          <PersonIcon
            size={58}
            color={COLORS.blue}
            glow
            style={{ flexShrink: 0 }}
          />
          <div>
            <div style={BODY}>
              <Em
                text={"친구끼리만 하고 싶으면\n직접 그룹을 만들어 참여해도 OK."}
                em={{ "직접 그룹": COLORS.orange }}
              />
            </div>
            <div style={{ ...BODY_SM, marginTop: 6 }}>
              솔큐로 들어가도 규칙은 똑같다.
            </div>
          </div>
        </div>
      </Card>
    </SceneFrame>
  );
};
