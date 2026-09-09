import React from "react";
import { Easing, Interactive, interpolate, useCurrentFrame } from "remotion";
import { Card } from "../../../components/Card";
import { Em, type Highlights } from "../../../components/Em";
import { BellIcon } from "../../../components/Icons";
import { MediaFrame } from "../../../components/MediaFrame";
import { SceneFrame } from "../../../components/SceneFrame";
import { TipBox } from "../../../components/TipBox";
import { BODY } from "../../../styles";
import { COLORS } from "../../../theme";
import { at, type SceneProps } from "../../../timing";
import { SCENE_META, VIDEO } from "../meta";

const meta = SCENE_META[4];

const POINTS: readonly {
  readonly ratio: number;
  readonly text: string;
  readonly em: Highlights;
}[] = [
  {
    ratio: 0.05,
    text: "과거 배틀패스는 시즌 5로 연기.",
    em: { "시즌 5": COLORS.orange },
  },
  {
    ratio: 0.22,
    text: "블리즈컨 신규 발표는 공식 예고.",
    em: { "공식 예고": COLORS.orange },
  },
  {
    ratio: 0.4,
    text: "구체적인 발표 내용은 아직 미공개.",
    em: { "아직 미공개": COLORS.orange },
  },
];

/** Scene 5 · 정리와 개인 의견 */
export const Scene5Opinion: React.FC<SceneProps> = ({ audioFrames }) => {
  const frame = useCurrentFrame();

  return (
    <SceneFrame
      videoId={VIDEO.id}
      sceneId="scene5"
      kicker={meta.kicker}
      titleLines={["진짜 핵심은", "블리즈컨 발표"]}
      titleEm={{ "블리즈컨 발표": COLORS.orange }}
      titleSize={112}
      subtitle="확정 정보와 예상은 구분해야"
      source={meta.source}
    >
      <MediaFrame
        src="videos/blizzcon-news/images/s4-trailer.jpg"
        delay={12}
        height={260}
        focusY={45}
        overlay="구체적인 신규 발표는 아직 미공개"
        credit="출처: PlayOverwatch 공식 유튜브 (시즌 4 트레일러)"
      />

      <Card delay={26} name="정리 카드">
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {POINTS.map((point, i) => (
            <Interactive.Div
              key={i}
              name={`정리 ${i + 1}`}
              style={{
                ...BODY,
                opacity: interpolate(
                  frame,
                  [
                    at(audioFrames, point.ratio),
                    at(audioFrames, point.ratio) + 14,
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
                    at(audioFrames, point.ratio),
                    at(audioFrames, point.ratio) + 24,
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
              <Em text={point.text} em={point.em} />
            </Interactive.Div>
          ))}
        </div>
      </Card>

      <TipBox
        delay={at(audioFrames, 0.68)}
        title="발표 후 다시 확인"
        icon={<BellIcon size={62} color={COLORS.orange} glow />}
      >
        <div style={{ ...BODY, fontSize: 38 }}>
          <Em
            text="공식 발표와 적용 여부를 검증 예정"
            em={{ "공식 발표": COLORS.orange }}
          />
        </div>
      </TipBox>
    </SceneFrame>
  );
};
