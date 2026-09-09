import React from "react";
import { Easing, Interactive, interpolate, useCurrentFrame } from "remotion";
import { Card } from "../../../components/Card";
import { Em } from "../../../components/Em";
import { GearIcon, PersonIcon } from "../../../components/Icons";
import { SceneFrame } from "../../../components/SceneFrame";
import { TipBox } from "../../../components/TipBox";
import { BODY, BODY_SM } from "../../../styles";
import { COLORS, withAlpha } from "../../../theme";
import { SCENE_META, VIDEO } from "../meta";
import { at, type SceneProps } from "../../../timing";

const meta = SCENE_META[5];

/** 이벤트가 시즌 안에서 차지하는 비율 */
const EVENT_SPAN = 70;

/** Scene 6 · 일정과 설정 — 언제까지, 그리고 끄는 법 */
export const Scene6Schedule: React.FC<SceneProps> = ({ audioFrames }) => {
  const frame = useCurrentFrame();

  return (
    <SceneFrame
      videoId={VIDEO.id}
      sceneId="scene6"
      kicker={meta.kicker}
      titleLines={["딱 3일만!", "9/5 → 9/8"]}
      titleEm={{ "9/5 → 9/8": COLORS.orange }}
      titleSize={130}
      subtitle="한국 시각 새벽 3시 시작 · 새벽 3시 종료"
      source={meta.source}
    >
      <Card
        delay={14}
        accent={COLORS.orange}
        header="진행 기간"
        name="타임라인"
      >
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
          <span>토 새벽 3시</span>
          <span>화 새벽 3시</span>
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
                [0, at(audioFrames, 0.2)],
                ["0%", `${EVENT_SPAN}%`],
                {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.bezier(0.16, 1, 0.3, 1),
                },
              ),
            }}
          >
            팀 드라이브 진행
          </Interactive.Div>
        </div>

        <div style={{ ...BODY_SM, marginTop: 16 }}>
          시즌 중반 패치 직전 · 일반 드라이브보다 짧음
        </div>
      </Card>

      <Card
        delay={at(audioFrames, 0.3)}
        accent={COLORS.blue}
        header="자동 파티 끄는 법"
        name="설정 카드"
      >
        <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
          <GearIcon
            size={82}
            color={COLORS.blue}
            glow
            style={{ flexShrink: 0 }}
          />
          <div style={{ ...BODY, fontSize: 38 }}>
            <Em
              text={
                "소셜 → 일반 → 그룹\n'팀 드라이브 승리 시 자동 그룹 배치 활성화' OFF"
              }
              em={{ OFF: COLORS.orange }}
            />
          </div>
        </div>
      </Card>

      <TipBox
        delay={at(audioFrames, 0.65)}
        title="단, 솔로는 훨씬 어렵다"
        icon={<PersonIcon size={62} color={COLORS.orange} glow />}
      >
        <div style={{ ...BODY, fontSize: 38 }}>
          <Em
            text={"보너스를 덜 받아 완료 난이도가\n훨씬 높아짐 (공식 설명)."}
            em={{ "훨씬 높아짐": COLORS.orange }}
          />
        </div>
      </TipBox>
    </SceneFrame>
  );
};
