import React from "react";
import { Easing, Interactive, interpolate, useCurrentFrame } from "remotion";
import { Card } from "../../../components/Card";
import { Em } from "../../../components/Em";
import { DocumentIcon, PersonIcon } from "../../../components/Icons";
import { SceneFrame } from "../../../components/SceneFrame";
import { TipBox } from "../../../components/TipBox";
import { BODY, BODY_SM } from "../../../styles";
import { COLORS } from "../../../theme";
import { at, type SceneProps } from "../../../timing";
import { NUMERIC_FONT } from "../../../typography";
import { SCENE_META, VIDEO } from "../meta";

const meta = SCENE_META[3];

/** Scene 4 · 주의사항 — 계정당 한 번, 개인정보는 쓰지 말 것 */
export const Scene4Caution: React.FC<SceneProps> = ({ audioFrames }) => {
  const frame = useCurrentFrame();
  const countAt = 14;

  return (
    <SceneFrame
      videoId={VIDEO.id}
      sceneId="scene4"
      kicker={meta.kicker}
      titleLines={["계정당 댓글 1회", "개인정보 적지 마세요"]}
      titleEm={{ "댓글 1회": COLORS.orange }}
      titleSize={98}
      subtitle="실명·연락처는 쓰지 마세요"
      source={meta.source}
      cardsAlign="center"
    >
      <Card
        delay={countAt}
        accent={COLORS.blue}
        header="참여 횟수"
        name="참여 횟수 카드"
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 30,
          }}
        >
          <PersonIcon
            size={92}
            color={COLORS.blue}
            glow
            style={{ flexShrink: 0 }}
          />
          <Interactive.Div
            name="횟수 강조"
            style={{
              fontFamily: NUMERIC_FONT,
              fontSize: 124,
              fontWeight: 900,
              lineHeight: 1,
              color: COLORS.blue,
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
            ID당 1회
          </Interactive.Div>
        </div>

        <div
          style={{
            ...BODY_SM,
            fontSize: 36,
            marginTop: 18,
            textAlign: "center",
          }}
        >
          여러 개 남겨도 기회는 그대로
        </div>
      </Card>

      <TipBox
        delay={at(audioFrames, 0.45)}
        title="댓글 작성 주의"
        icon={<DocumentIcon size={62} color={COLORS.orange} glow />}
      >
        <div style={{ ...BODY, fontSize: 38 }}>
          <Em
            text={"개인정보·타인 글 도용 금지\n부적절한 내용은 참여 제한"}
            em={{ "참여 제한": COLORS.orange }}
          />
        </div>
      </TipBox>
    </SceneFrame>
  );
};
