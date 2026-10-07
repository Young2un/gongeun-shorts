import React from "react";
import { Easing, Interactive, interpolate, useCurrentFrame } from "remotion";
import { Card } from "../../../components/Card";
import { Em } from "../../../components/Em";
import { GroupIcon, TrophyIcon } from "../../../components/Icons";
import { SceneFrame } from "../../../components/SceneFrame";
import { TipBox } from "../../../components/TipBox";
import { BODY, BODY_SM } from "../../../styles";
import { COLORS } from "../../../theme";
import { at, type SceneProps } from "../../../timing";
import { NUMERIC_FONT } from "../../../typography";
import { SCENE_META, VIDEO } from "../meta";

const meta = SCENE_META[2];

/** Scene 3 · 경품과 당첨 인원 — 디몬 장패드, 열 명 추첨 */
export const Scene3Prize: React.FC<SceneProps> = ({ audioFrames }) => {
  const frame = useCurrentFrame();
  const countAt = 14;

  return (
    <SceneFrame
      videoId={VIDEO.id}
      sceneId="scene3"
      kicker={meta.kicker}
      titleLines={["디몬 장패드 추첨", "당첨자는 총 10명"]}
      titleEm={{ "10명": COLORS.orange }}
      titleSize={106}
      subtitle="게임 접속만으로는 참여 불가"
      source={meta.source}
      cardsAlign="center"
    >
      <Card
        delay={countAt}
        accent={COLORS.gold}
        header="당첨 인원"
        name="당첨 인원 카드"
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 30,
          }}
        >
          <GroupIcon
            size={96}
            color={COLORS.gold}
            glow
            style={{ flexShrink: 0 }}
          />
          <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
            <span style={{ ...BODY_SM, fontSize: 44, color: COLORS.grey }}>
              총
            </span>
            <Interactive.Div
              name="인원 강조"
              style={{
                fontFamily: NUMERIC_FONT,
                fontSize: 132,
                fontWeight: 900,
                lineHeight: 1,
                color: COLORS.gold,
                scale: interpolate(
                  frame,
                  [countAt + 4, countAt + 32],
                  [0.76, 1],
                  {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                    easing: Easing.spring({ damping: 16 }),
                    output: "perceptual-scale",
                  },
                ),
              }}
            >
              10명
            </Interactive.Div>
          </div>
        </div>

        <div
          style={{
            ...BODY_SM,
            fontSize: 36,
            marginTop: 18,
            textAlign: "center",
          }}
        >
          댓글 참여자 중 추첨
        </div>
      </Card>

      <TipBox
        delay={at(audioFrames, 0.5)}
        title="자동 지급 아님"
        icon={<TrophyIcon size={62} color={COLORS.orange} glow />}
      >
        <div style={{ ...BODY, fontSize: 38 }}>
          <Em
            text={"게임 접속이 아닌\n공식 게시글 댓글 응모"}
            em={{ "댓글 응모": COLORS.orange }}
          />
        </div>
      </TipBox>
    </SceneFrame>
  );
};
