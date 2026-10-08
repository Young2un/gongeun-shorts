import React from "react";
import { Em } from "../../../components/Em";
import { DocumentIcon } from "../../../components/Icons";
import { MediaFrame } from "../../../components/MediaFrame";
import { SceneFrame } from "../../../components/SceneFrame";
import { TipBox } from "../../../components/TipBox";
import { ParagraphCard, SceneBackdrop } from "../../../shared/blocks";
import { BODY } from "../../../styles";
import { COLORS } from "../../../theme";
import { at, type SceneProps } from "../../../timing";
import { IMG_DIR, SCENE_META, VIDEO } from "../meta";

const meta = SCENE_META[13];

const OPINION = [
  { ratio: 0.3, text: "사실: 궁극기 비용 8% 증가 등 체험 대비 하향", em: "사실" },
  { ratio: 0.5, text: "의견: 그래도 가장 먼저 해 보고 싶은 영웅", em: "의견" },
];

/** Scene 14 · 개인 의견 — 수치는 내려도 독트린이 제일 기대된다 */
export const Scene14Opinion: React.FC<SceneProps> = ({ audioFrames }) => (
  <SceneFrame
    videoId={VIDEO.id}
    sceneId="scene14"
    kicker={meta.kicker}
    titleLines={["독트린이", "제일 기대돼요"]}
    titleEm={{ 독트린이: COLORS.orange }}
    titleSize={116}
    subtitle="수치는 내려도 흐름은 유지"
    source={meta.source}
    backdrop={<SceneBackdrop src={`${IMG_DIR}/kit-doctrine.jpg`} focusY={50} />}
  >
    <MediaFrame
      src={`${IMG_DIR}/doctrine.png`}
      delay={12}
      height={320}
      focusY={30}
      overlay="독트린 (지원)"
      credit="출처: Blizzard Entertainment"
    />

    <ParagraphCard audioFrames={audioFrames} delay={at(audioFrames, 0.26)} items={OPINION} size={36} />

    <TipBox
      delay={at(audioFrames, 0.74)}
      title="수치 출처"
      icon={<DocumentIcon size={62} color={COLORS.orange} glow />}
    >
      <div style={{ ...BODY, fontSize: 36 }}>
        <Em
          text={"넥슨 오버워치 패치 노트\n2026년 10월 7일"}
          em={{ "10월 7일": COLORS.orange }}
        />
      </div>
    </TipBox>
  </SceneFrame>
);
