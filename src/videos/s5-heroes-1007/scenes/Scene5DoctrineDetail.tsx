import React from "react";
import { SceneFrame } from "../../../components/SceneFrame";
import { ParagraphCard, SceneBackdrop } from "../../../shared/blocks";
import { COLORS } from "../../../theme";
import { at, type SceneProps } from "../../../timing";
import { IMG_DIR, SCENE_META, VIDEO } from "../meta";

const meta = SCENE_META[4];

const SHROUD = [
  { ratio: 0.04, text: "추진형 장막 재사용 대기시간 7초→8초", em: "7초→8초", color: COLORS.grey },
  { ratio: 0.18, text: "추진형 장막 피해 감소 50%→40%", em: "50%→40%", color: COLORS.grey },
  { ratio: 0.36, text: "추진형 장막 사용 중 치명타 면역 제거", em: "치명타 면역 제거", color: COLORS.grey },
];

const DELIVERANCE = [
  { ratio: 0.52, text: "구제 드론 발사 속도 4→5", em: "4→5", color: COLORS.green },
  { ratio: 0.72, text: "구제 추가 생명력·약화 효과 지속 8초→6초", em: "8초→6초", color: COLORS.grey },
  { ratio: 0.8, text: "구제 부패 지속 5초→4초", em: "5초→4초", color: COLORS.grey },
];

/** Scene 5 · 독트린 세부 — 추진형 장막과 구제 */
export const Scene5DoctrineDetail: React.FC<SceneProps> = ({ audioFrames }) => (
  <SceneFrame
    videoId={VIDEO.id}
    sceneId="scene5"
    kicker={meta.kicker}
    titleLines={["추진형 장막", "치명타 면역 삭제"]}
    titleEm={{ "치명타 면역 삭제": COLORS.orange }}
    titleSize={104}
    subtitle="구제는 8초에서 6초로"
    source={meta.source}
    backdrop={<SceneBackdrop src={`${IMG_DIR}/kit-doctrine.jpg`} focusY={50} />}
    cardsAlign="center"
  >
    <ParagraphCard audioFrames={audioFrames} delay={12} items={SHROUD} size={36} name="추진형 장막" />
    <ParagraphCard
      audioFrames={audioFrames}
      delay={at(audioFrames, 0.48)}
      items={DELIVERANCE}
      size={36}
      name="구제"
    />
  </SceneFrame>
);
