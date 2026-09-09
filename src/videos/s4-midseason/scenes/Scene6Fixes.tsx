import React from "react";
import { Easing, Interactive, interpolate, useCurrentFrame } from "remotion";
import { Card } from "../../../components/Card";
import { Em, type Highlights } from "../../../components/Em";
import { HeroRow } from "../../../components/HeroRow";
import { GearIcon } from "../../../components/Icons";
import { SceneFrame } from "../../../components/SceneFrame";
import { BODY, BODY_SM } from "../../../styles";
import { COLORS } from "../../../theme";
import { at, type SceneProps } from "../../../timing";
import { HERO_DIR, SCENE_META, VIDEO } from "../meta";

const meta = SCENE_META[5];

const FIXES: readonly {
  readonly text: string;
  readonly em: Highlights;
}[] = [
  { text: "배틀 패스 경험치 수정", em: { 경험치: COLORS.green } },
  { text: "핑 관련 오류 수정", em: { 핑: COLORS.green } },
  { text: "검은 숲 재활성화", em: { 재활성화: COLORS.green } },
];

const OPINION: readonly {
  readonly ratio: number;
  readonly text: string;
  readonly em: Highlights;
}[] = [
  {
    ratio: 0.6,
    text: "바티스트는 확실히 편해졌어요.",
    em: { 편해졌어요: COLORS.orange },
  },
  {
    ratio: 0.76,
    text: "키리코는 이제 방울 타이밍 싸움.",
    em: { "타이밍 싸움": COLORS.orange },
  },
];

/** Scene 6 · 오류 수정과 마무리 의견 */
export const Scene6Fixes: React.FC<SceneProps> = ({ audioFrames }) => {
  const frame = useCurrentFrame();

  return (
    <SceneFrame
      videoId={VIDEO.id}
      sceneId="scene6"
      kicker={meta.kicker}
      titleLines={["승자는 바티스트", "패자는 키리코"]}
      titleEm={{ 승자는: COLORS.orange }}
      titleSize={100}
      subtitle="버그 수정이랑 한 줄 총평"
      source={meta.source}
    >
      <Card
        delay={14}
        accent={COLORS.green}
        header="버그 수정"
        name="버그 수정"
      >
        <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
          <GearIcon
            size={78}
            color={COLORS.green}
            glow
            style={{ flexShrink: 0 }}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {FIXES.map((fix, i) => (
              <Interactive.Div
                key={fix.text}
                name={`수정 ${i + 1}`}
                style={{
                  ...BODY,
                  fontWeight: 700,
                  opacity: interpolate(
                    frame,
                    [24 + i * 8, 36 + i * 8],
                    [0, 1],
                    {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                      easing: Easing.bezier(0.16, 1, 0.3, 1),
                    },
                  ),
                }}
              >
                <Em text={fix.text} em={fix.em} />
              </Interactive.Div>
            ))}
            <div style={{ ...BODY_SM, marginTop: 4 }}>공식 버그 수정 사항</div>
          </div>
        </div>
      </Card>

      <HeroRow
        dir={HERO_DIR}
        heroes={[
          { id: "baptiste", name: "바티스트", tone: "up" },
          { id: "kiriko", name: "키리코", tone: "down" },
        ]}
        delay={at(audioFrames, 0.55)}
        size={104}
      />

      <Card delay={at(audioFrames, 0.58)} name="개인 의견">
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {OPINION.map((line, i) => (
            <Interactive.Div
              key={i}
              name={`의견 ${i + 1}`}
              style={{
                ...BODY,
                opacity: interpolate(
                  frame,
                  [
                    at(audioFrames, line.ratio),
                    at(audioFrames, line.ratio) + 14,
                  ],
                  [0, 1],
                  {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                    easing: Easing.bezier(0.16, 1, 0.3, 1),
                  },
                ),
                translate: interpolate(
                  frame,
                  [
                    at(audioFrames, line.ratio),
                    at(audioFrames, line.ratio) + 24,
                  ],
                  ["0px 22px", "0px 0px"],
                  {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                    easing: Easing.spring({ damping: 200 }),
                  },
                ),
              }}
            >
              <Em text={line.text} em={line.em} />
            </Interactive.Div>
          ))}
        </div>
      </Card>
    </SceneFrame>
  );
};
