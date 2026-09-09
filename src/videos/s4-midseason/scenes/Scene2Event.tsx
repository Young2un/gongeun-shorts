import React from "react";
import { Easing, Interactive, interpolate, useCurrentFrame } from "remotion";
import { Card } from "../../../components/Card";
import { Em } from "../../../components/Em";
import { HeroRow } from "../../../components/HeroRow";
import { BellIcon } from "../../../components/Icons";
import { SceneFrame } from "../../../components/SceneFrame";
import { TipBox } from "../../../components/TipBox";
import { BODY, BODY_SM } from "../../../styles";
import { COLORS, withAlpha } from "../../../theme";
import { at, type SceneProps } from "../../../timing";
import { HERO_DIR, SCENE_META, VIDEO } from "../meta";

const meta = SCENE_META[1];
const EVENT_SPAN = 70;

/** Scene 2 · 정크랫의 전리품 사냥 */
export const Scene2Event: React.FC<SceneProps> = ({ audioFrames }) => {
  const frame = useCurrentFrame();

  return (
    <SceneFrame
      videoId={VIDEO.id}
      sceneId="scene2"
      kicker={meta.kicker}
      titleLines={["정크랫 보물", "사냥 열린다"]}
      titleEm={{ 보물: COLORS.orange }}
      titleSize={112}
      subtitle="9월 13일부터 30일까지"
      source={meta.source}
    >
      <HeroRow
        dir={HERO_DIR}
        heroes={[{ id: "junkrat", name: "정크랫", tone: "neutral" }]}
        delay={14}
        size={128}
      />

      <Card delay={26} accent={COLORS.orange} header="이벤트 기간" name="기간">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 34,
            fontWeight: 700,
            color: COLORS.grey,
            marginBottom: 14,
          }}
        >
          <span>9월 13일</span>
          <span>9월 30일</span>
        </div>

        <div
          style={{
            position: "relative",
            height: 76,
            borderRadius: 12,
            backgroundColor: withAlpha(COLORS.white, 0.06),
            border: `1px solid ${COLORS.panelBorder}`,
            overflow: "hidden",
          }}
        >
          <Interactive.Div
            name="이벤트 구간"
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              display: "flex",
              alignItems: "center",
              paddingLeft: 24,
              whiteSpace: "nowrap",
              background: `linear-gradient(90deg, ${COLORS.orange} 0%, ${withAlpha(COLORS.orange, 0.72)} 100%)`,
              fontSize: 36,
              fontWeight: 800,
              color: COLORS.onBright,
              width: interpolate(
                frame,
                [30, at(audioFrames, 0.3)],
                ["0%", `${EVENT_SPAN}%`],
                {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.bezier(0.16, 1, 0.3, 1),
                },
              ),
            }}
          >
            전리품 사냥
          </Interactive.Div>
        </div>

        <div style={{ ...BODY_SM, marginTop: 16 }}>기간 한정 콘텐츠</div>
      </Card>

      <TipBox
        delay={at(audioFrames, 0.55)}
        title="놓치면 끝"
        icon={<BellIcon size={62} color={COLORS.orange} glow />}
      >
        <div style={{ ...BODY, fontSize: 38 }}>
          <Em
            text="9월 30일 지나면 못 합니다"
            em={{ "9월 30일": COLORS.orange }}
          />
        </div>
      </TipBox>
    </SceneFrame>
  );
};
