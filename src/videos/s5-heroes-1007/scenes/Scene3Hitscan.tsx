import React from "react";
import { SceneFrame } from "../../../components/SceneFrame";
import { ParagraphCard, SceneBackdrop, StatCard } from "../../../shared/blocks";
import { COLORS } from "../../../theme";
import { at, type SceneProps } from "../../../timing";
import { IMG_DIR, SCENE_META, VIDEO } from "../meta";

const meta = SCENE_META[2];

const INTENT = [
  { ratio: 0.5, text: "개발 의도: 영웅 간 피격 판정 불일치 완화", em: "피격 판정 불일치 완화" },
  { ratio: 0.62, text: "히트스캔은 비슷한 효율을 유지하도록 축소", em: "비슷한 효율" },
  { ratio: 0.8, text: "플레이 체감은 크게 다르지 않을 것이라는 설명", em: "크게 다르지 않을 것" },
];

/** Scene 3 · 히트스캔 투사체 크기도 같이 줄었다 */
export const Scene3Hitscan: React.FC<SceneProps> = ({ audioFrames }) => (
  <SceneFrame
    videoId={VIDEO.id}
    sceneId="scene3"
    kicker={meta.kicker}
    titleLines={["투사체 크기", "0.07→0.04m"]}
    titleEm={{ "0.07→0.04m": COLORS.orange }}
    titleSize={108}
    subtitle="체감은 비슷하게 유지 의도"
    source={meta.source}
    backdrop={<SceneBackdrop src={`${IMG_DIR}/grimsvotn.jpg`} focusY={55} />}
    cardsAlign="center"
  >
    <StatCard
      delay={at(audioFrames, 0.3)}
      accent={COLORS.orange}
      header="히트스캔 대형 투사체"
      value="0.04m"
      note="대형 0.07→0.04미터 · 소형 0.04→0.02미터"
    />

    <ParagraphCard
      audioFrames={audioFrames}
      delay={at(audioFrames, 0.46)}
      items={INTENT}
      size={36}
    />
  </SceneFrame>
);
