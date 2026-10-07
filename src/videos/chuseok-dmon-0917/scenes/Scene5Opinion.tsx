import React from "react";
import { Easing, Interactive, interpolate, useCurrentFrame } from "remotion";
import { Card } from "../../../components/Card";
import { Em, type Highlights } from "../../../components/Em";
import { BellIcon } from "../../../components/Icons";
import { SceneFrame } from "../../../components/SceneFrame";
import { TipBox } from "../../../components/TipBox";
import { BODY } from "../../../styles";
import { COLORS } from "../../../theme";
import { at, type SceneProps } from "../../../timing";
import { SCENE_META, VIDEO } from "../meta";

const meta = SCENE_META[4];

const PARAGRAPHS: readonly {
  readonly ratio: number;
  readonly text: string;
  readonly em: Highlights;
}[] = [
  {
    ratio: 0.52,
    text: "열 명 추첨이라 당첨 확률은 높지 않습니다.",
    em: { "높지 않습니다": COLORS.orange },
  },
  {
    ratio: 0.72,
    text: "그래도 댓글 하나면 참여할 수 있어요.",
    em: { "댓글 하나": COLORS.orange },
  },
];

/** Scene 5 · 공은의 한마디 — 확률은 낮지만 댓글 하나면 끝 */
export const Scene5Opinion: React.FC<SceneProps> = ({ audioFrames }) => {
  const frame = useCurrentFrame();

  return (
    <SceneFrame
      videoId={VIDEO.id}
      sceneId="scene5"
      kicker={meta.kicker}
      titleLines={["열 명이라 빡세도", "댓글이면 해볼 만"]}
      titleEm={{ "해볼 만": COLORS.orange }}
      titleSize={116}
      subtitle="당첨 공지와 입력 기간 확인"
      source={meta.source}
      cardsAlign="center"
    >
      <TipBox
        delay={14}
        title="당첨 후에도 확인"
        icon={<BellIcon size={62} color={COLORS.orange} glow />}
      >
        <div style={{ ...BODY, fontSize: 38 }}>
          <Em
            text={"10월 6일 당첨자 발표\n수령 동의·정보 입력 필수"}
            em={{ "10월 6일": COLORS.orange }}
          />
        </div>
      </TipBox>

      <Card delay={at(audioFrames, 0.45)} name="의견 카드">
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
    </SceneFrame>
  );
};
