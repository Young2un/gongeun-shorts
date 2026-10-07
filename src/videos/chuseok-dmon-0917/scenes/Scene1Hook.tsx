import React from "react";
import { Easing, Interactive, interpolate, useCurrentFrame } from "remotion";
import { Card } from "../../../components/Card";
import { Em } from "../../../components/Em";
import { MegaphoneIcon, TrophyIcon } from "../../../components/Icons";
import { MediaFrame } from "../../../components/MediaFrame";
import { SceneFrame } from "../../../components/SceneFrame";
import { TipBox } from "../../../components/TipBox";
import { BODY, BODY_SM } from "../../../styles";
import { COLORS } from "../../../theme";
import { at, type SceneProps } from "../../../timing";
import { TITLE_FONT } from "../../../typography";
import { SCENE_META, VIDEO } from "../meta";

const meta = SCENE_META[0];

/** Scene 1 · 훅 — 추석 댓글 이벤트가 열렸고, 경품은 디몬 장패드 */
export const Scene1Hook: React.FC<SceneProps> = ({ audioFrames }) => {
  const frame = useCurrentFrame();
  const prizeAt = 26;

  return (
    <SceneFrame
      videoId={VIDEO.id}
      sceneId="scene1"
      kicker={meta.kicker}
      titleLines={["소원 댓글 남기고", "디몬 굿즈 응모"]}
      titleEm={{ "디몬 굿즈": COLORS.orange }}
      titleSize={116}
      subtitle="공식 게시글 댓글 이벤트"
      source={meta.source}
    >
      <MediaFrame
        src="videos/chuseok-dmon-0917/images/event-banner.jpg"
        delay={12}
        height={400}
        focusY={50}
        credit="출처: 넥슨 오버워치 공식 이벤트 이미지"
      />

      <Card
        delay={prizeAt}
        accent={COLORS.gold}
        header="추첨 경품"
        name="경품 카드"
      >
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <TrophyIcon
            size={92}
            color={COLORS.gold}
            glow
            style={{ flexShrink: 0 }}
          />
          <div>
            <Interactive.Div
              name="경품 강조"
              style={{
                fontFamily: TITLE_FONT,
                fontSize: 88,
                fontWeight: 900,
                lineHeight: 1.1,
                letterSpacing: -1,
                color: COLORS.gold,
                textShadow: "0 4px 0 #000",
                scale: interpolate(
                  frame,
                  [prizeAt + 4, prizeAt + 30],
                  [0.8, 1],
                  {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                    easing: Easing.spring({ damping: 16 }),
                    output: "perceptual-scale",
                  },
                ),
              }}
            >
              디몬 장패드
            </Interactive.Div>
            <div style={{ ...BODY_SM, fontSize: 36, marginTop: 10 }}>
              댓글 참여자 대상 추첨
            </div>
          </div>
        </div>
      </Card>

      <TipBox
        delay={at(audioFrames, 0.55)}
        title="참여 내용"
        icon={<MegaphoneIcon size={62} color={COLORS.orange} glow />}
      >
        <div style={{ ...BODY, fontSize: 38 }}>
          <Em
            text={"보름달에 빌고 싶은 소원을\n공식 게시글에 댓글로 작성"}
            em={{ 댓글: COLORS.orange }}
          />
        </div>
      </TipBox>
    </SceneFrame>
  );
};
