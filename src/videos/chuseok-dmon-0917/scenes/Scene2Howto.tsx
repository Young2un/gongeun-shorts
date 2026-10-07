import React from "react";
import { Easing, Interactive, interpolate, useCurrentFrame } from "remotion";
import { Card } from "../../../components/Card";
import {
  ChevronIcon,
  DocumentIcon,
  MegaphoneIcon,
  PersonIcon,
} from "../../../components/Icons";
import { SceneFrame } from "../../../components/SceneFrame";
import { BODY_SM, LABEL } from "../../../styles";
import { COLORS, withAlpha } from "../../../theme";
import { at, type SceneProps } from "../../../timing";
import { SCENE_META, VIDEO } from "../meta";

const meta = SCENE_META[1];

const STEPS = [
  { Icon: PersonIcon, color: COLORS.blue, label: "로그인", note: "넥슨 ID" },
  {
    Icon: DocumentIcon,
    color: COLORS.orange,
    label: "공식 글",
    note: "이벤트",
  },
  {
    Icon: MegaphoneIcon,
    color: COLORS.gold,
    label: "댓글 작성",
    note: "참여 완료",
  },
];

/** Scene 2 · 기간과 참여 방법 — 9/17 ~ 9/27, 로그인하고 댓글 */
export const Scene2Howto: React.FC<SceneProps> = ({ audioFrames }) => {
  const frame = useCurrentFrame();
  const flowAt = at(audioFrames, 0.42);

  return (
    <SceneFrame
      videoId={VIDEO.id}
      sceneId="scene2"
      kicker={meta.kicker}
      titleLines={["27일 밤 마감", "공식 글에 댓글"]}
      titleEm={{ "27일 밤": COLORS.orange }}
      titleSize={120}
      subtitle="넥슨 아이디 로그인이 필요"
      source={meta.source}
      cardsAlign="center"
    >
      <Card
        delay={14}
        accent={COLORS.orange}
        header="이벤트 기간"
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
          <span>9/17</span>
          <span>9/27 23:59</span>
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
          {/* 바 전체가 응모 가능 구간이다 — 왼쪽 끝이 시작, 오른쪽 끝이 마감 */}
          <Interactive.Div
            name="응모 구간"
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
                [0, at(audioFrames, 0.25)],
                ["0%", "100%"],
                {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.bezier(0.16, 1, 0.3, 1),
                },
              ),
            }}
          >
            댓글 응모 기간
          </Interactive.Div>
        </div>

        <div style={{ ...BODY_SM, marginTop: 16 }}>
          한국 시각 기준 · 마감 후에는 참여 불가
        </div>
      </Card>

      <Card
        delay={flowAt}
        accent={COLORS.blue}
        header="참여 순서"
        name="참여 흐름"
        padding={30}
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
                <step.Icon size={82} color={step.color} glow={i === 2} />
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
    </SceneFrame>
  );
};
