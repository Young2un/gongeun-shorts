import React from "react";
import { Easing, Interactive, interpolate, useCurrentFrame } from "remotion";
import { Card } from "../../../components/Card";
import { Em } from "../../../components/Em";
import {
  CrownIcon,
  ProfileCardIcon,
  TrophyIcon,
} from "../../../components/Icons";
import { SceneFrame } from "../../../components/SceneFrame";
import { BODY, BODY_SM } from "../../../styles";
import { COLORS } from "../../../theme";
import { SCENE_META, VIDEO } from "../meta";
import { at, type SceneProps } from "../../../timing";
import { NUMERIC_FONT } from "../../../typography";

const meta = SCENE_META[4];

/** Scene 5 · 보상 — 카드 테두리, 그리고 선착순 1만 명 칭호 */
export const Scene5Rewards: React.FC<SceneProps> = ({ audioFrames }) => {
  const frame = useCurrentFrame();
  const punchAt = at(audioFrames, 0.5);

  return (
    <SceneFrame
      videoId={VIDEO.id}
      sceneId="scene5"
      kicker={meta.kicker}
      titleLines={["프로필 카드", "테두리 획득!"]}
      titleEm={{ 테두리: COLORS.orange }}
      titleSize={124}
      subtitle="시그니처 대신 주어지는 이번 이벤트 보상"
      source={meta.source}
    >
      <Card
        delay={14}
        accent={COLORS.orange}
        header="기본 보상"
        name="기본 보상"
      >
        <div style={{ display: "flex", alignItems: "center", gap: 34 }}>
          <ProfileCardIcon
            size={116}
            color={COLORS.orange}
            glow
            style={{ flexShrink: 0 }}
          />
          <div>
            <div style={{ ...BODY, fontWeight: 700 }}>+ 경쟁전 점수</div>
            <div style={{ ...BODY, fontWeight: 700, marginTop: 6 }}>
              <Em
                text="+ 프로필 카드 테두리"
                em={{ "프로필 카드 테두리": COLORS.orange }}
              />
            </div>
            <div style={{ ...BODY_SM, marginTop: 10 }}>
              등급을 채우면 누구나 받는 보상
            </div>
          </div>
        </div>
      </Card>

      <Card
        delay={at(audioFrames, 0.3)}
        accent={COLORS.gold}
        header="선착순 보상"
        name="선착순 보상"
      >
        <div style={{ display: "flex", alignItems: "center", gap: 34 }}>
          <div style={{ position: "relative", flexShrink: 0 }}>
            <CrownIcon
              size={44}
              color={COLORS.gold}
              style={{ position: "absolute", top: -30, left: 36 }}
            />
            <TrophyIcon size={116} color={COLORS.gold} glow />
          </div>
          <div>
            <Interactive.Div
              name="선착순 1만 명"
              style={{
                transformOrigin: "0% 50%",
                fontFamily: NUMERIC_FONT,
                fontSize: 72,
                fontWeight: 900,
                lineHeight: 1.1,
                color: COLORS.gold,
                scale: interpolate(
                  frame,
                  [punchAt, punchAt + 8, punchAt + 22],
                  [1, 1.14, 1],
                  {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                    easing: Easing.bezier(0.16, 1, 0.3, 1),
                    output: "perceptual-scale",
                  },
                ),
              }}
            >
              선착순 10,000명
            </Interactive.Div>
            <div style={{ ...BODY, fontWeight: 700, marginTop: 8 }}>
              완료 순위가 찍힌 역동적 칭호
            </div>
            <div style={{ ...BODY_SM, marginTop: 8, color: COLORS.dim }}>
              시련까지 끝낸 순서대로 · 이벤트 종료 후 지급
            </div>
          </div>
        </div>
      </Card>
    </SceneFrame>
  );
};
