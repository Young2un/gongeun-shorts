import React from "react";
import { Easing, Interactive, interpolate, useCurrentFrame } from "remotion";
import { Card } from "../../../components/Card";
import { Em, type Highlights } from "../../../components/Em";
import { MegaphoneIcon } from "../../../components/Icons";
import { SceneFrame } from "../../../components/SceneFrame";
import { BODY, BODY_SM } from "../../../styles";
import { COLORS } from "../../../theme";
import { SCENE_META, VIDEO } from "../meta";
import { at, type SceneProps } from "../../../timing";
import { TITLE_FONT } from "../../../typography";

const meta = SCENE_META[6];

const PARAGRAPHS: readonly {
  readonly ratio: number;
  readonly text: string;
  readonly em: Highlights;
}[] = [
  {
    ratio: 0.16,
    text: "그룹 경쟁전은 원래 더 빡세다.",
    em: { 빡세다: COLORS.orange },
  },
  {
    ratio: 0.31,
    text: "잘 맞는 사람이랑 그룹은 해봤지만\n시스템이 강제로 묶는 건 처음.",
    em: { "강제로 묶는 건": COLORS.orange },
  },
  {
    ratio: 0.47,
    text: "솔직히 감이 안 온다. 해봐야 알 듯.",
    em: { "감이 안 온다": COLORS.orange },
  },
];

/** Scene 7 · 내 생각 — 마무리와 페이드아웃 */
export const Scene7Opinion: React.FC<SceneProps> = ({ audioFrames }) => {
  const frame = useCurrentFrame();
  const outroAt = at(audioFrames, 0.7);

  return (
    <SceneFrame
      videoId={VIDEO.id}
      sceneId="scene7"
      kicker={meta.kicker}
      titleLines={["흥미로운데", "모 아니면 도"]}
      titleEm={{ "모 아니면 도": COLORS.orange }}
      titleSize={130}
      subtitle="해봐야 알 것 같습니다"
      source={meta.source}
    >
      <Card delay={14} name="의견 카드">
        <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
          {PARAGRAPHS.map((paragraph, i) => (
            <Interactive.Div
              key={i}
              name={`문단 ${i + 1}`}
              style={{
                ...BODY,
                opacity: interpolate(
                  frame,
                  [
                    at(audioFrames, paragraph.ratio),
                    at(audioFrames, paragraph.ratio) + 14,
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
                    at(audioFrames, paragraph.ratio),
                    at(audioFrames, paragraph.ratio) + 24,
                  ],
                  ["0px 24px", "0px 0px"],
                  {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                    easing: Easing.spring({ damping: 200 }),
                  },
                ),
              }}
            >
              <Em text={paragraph.text} em={paragraph.em} />
            </Interactive.Div>
          ))}
        </div>
      </Card>

      <Card
        delay={outroAt}
        accent={COLORS.orange}
        header="그래도"
        name="마무리 카드"
      >
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <MegaphoneIcon
            size={92}
            color={COLORS.orange}
            glow
            style={{ flexShrink: 0 }}
          />
          <div>
            <div
              style={{
                fontFamily: TITLE_FONT,
                fontSize: 72,
                fontWeight: 900,
                lineHeight: 1.2,
                letterSpacing: -1,
                color: COLORS.orange,
                textShadow: "0 4px 0 #000",
              }}
            >
              오버워치가 살아있다
            </div>
            <div style={{ ...BODY_SM, fontSize: 38, marginTop: 10 }}>
              토요일 새벽에 봅시다.
            </div>
          </div>
        </div>
      </Card>
    </SceneFrame>
  );
};
