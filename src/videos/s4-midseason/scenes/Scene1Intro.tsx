import React from "react";
import { Easing, Interactive, interpolate, useCurrentFrame } from "remotion";
import { Card } from "../../../components/Card";
import { Em } from "../../../components/Em";
import { HeroRow } from "../../../components/HeroRow";
import { DocumentIcon } from "../../../components/Icons";
import { SceneFrame } from "../../../components/SceneFrame";
import { TipBox } from "../../../components/TipBox";
import { BODY, BODY_SM } from "../../../styles";
import { COLORS } from "../../../theme";
import { at, type SceneProps } from "../../../timing";
import { NUMERIC_FONT } from "../../../typography";
import { HERO_DIR, SCENE_META, VIDEO } from "../meta";

const meta = SCENE_META[0];

/** 이번 패치에서 체감이 큰 세 명 */
const HIGHLIGHT = [
  { id: "kiriko", name: "키리코", tone: "down" as const },
  { id: "freya", name: "프레야", tone: "down" as const },
  { id: "dva", name: "D.Va", tone: "up" as const },
];

/** Scene 1 · 훅 — 중간 패치가 왔다 */
export const Scene1Intro: React.FC<SceneProps> = ({ audioFrames }) => {
  const frame = useCurrentFrame();

  return (
    <SceneFrame
      videoId={VIDEO.id}
      sceneId="scene1"
      kicker={meta.kicker}
      titleLines={["누가 웃고", "누가 울었나"]}
      titleEm={{ 울었나: COLORS.orange }}
      titleSize={132}
      subtitle="이벤트부터 밸런스까지 총정리"
      source={meta.source}
    >
      <HeroRow dir={HERO_DIR} heroes={HIGHLIGHT} delay={14} size={116} />

      <Card
        delay={26}
        accent={COLORS.orange}
        header="패치 적용일"
        name="적용일"
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "center",
            gap: 20,
          }}
        >
          <Interactive.Div
            name="적용일 강조"
            style={{
              fontFamily: NUMERIC_FONT,
              fontSize: 118,
              fontWeight: 900,
              lineHeight: 1,
              color: COLORS.orange,
              scale: interpolate(frame, [28, 54], [0.78, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.spring({ damping: 16 }),
                output: "perceptual-scale",
              }),
            }}
          >
            9월 9일
          </Interactive.Div>
          <span style={{ ...BODY_SM, fontSize: 36 }}>한국 서비스 기준</span>
        </div>
      </Card>

      <TipBox
        delay={at(audioFrames, 0.5)}
        title="이번 패치 요약"
        icon={<DocumentIcon size={62} color={COLORS.orange} glow />}
      >
        <div style={{ ...BODY, fontSize: 38 }}>
          <Em
            text="이벤트 · 영웅 조정 · 오류 수정"
            em={{ "영웅 조정": COLORS.orange }}
          />
        </div>
      </TipBox>
    </SceneFrame>
  );
};
