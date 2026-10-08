import React from "react";
import { HeroRow } from "../../../components/HeroRow";
import { SceneFrame } from "../../../components/SceneFrame";
import { ParagraphCard, SceneBackdrop, StatCard } from "../../../shared/blocks";
import { COLORS } from "../../../theme";
import { at, type SceneProps } from "../../../timing";
import { HERO_DIR, IMG_DIR, SCENE_META, VIDEO } from "../meta";

const meta = SCENE_META[0];

const TOPICS = [
  { ratio: 0.58, text: "영웅 34명 타점 조정", em: "34명" },
  { ratio: 0.66, text: "독트린, 출시 전 체험 때보다 하향", em: "독트린" },
  { ratio: 0.74, text: "캐서디 궁극기 조합 차단", em: "조합 차단" },
  { ratio: 0.82, text: "로드호그·솜브라 개편 수치", em: "개편 수치" },
];

/** Scene 1 · 훅 — 루시우 머리 타점 13.2→16, 솜브라에 가려진 변경들 */
export const Scene1Hook: React.FC<SceneProps> = ({ audioFrames }) => (
  <SceneFrame
    videoId={VIDEO.id}
    sceneId="scene1"
    kicker={meta.kicker}
    titleLines={["루시우 머리", "타점 13.2→16"]}
    titleEm={{ "13.2→16": COLORS.orange }}
    titleSize={108}
    subtitle="10월 7일 패치 노트 수치"
    source={meta.source}
    backdrop={<SceneBackdrop src={`${IMG_DIR}/doctrine.png`} focusY={30} />}
  >
    <HeroRow
      dir={HERO_DIR}
      heroes={[{ id: "lucio", name: "루시우", tone: "down" }]}
      delay={12}
      size={128}
    />

    <StatCard
      delay={24}
      accent={COLORS.orange}
      header="루시우 머리 타점"
      value="13.2→16"
      note="약 21% 증가 (패치 노트 수치로 계산)"
    />

    <ParagraphCard
      audioFrames={audioFrames}
      delay={at(audioFrames, 0.52)}
      items={TOPICS}
      size={36}
    />
  </SceneFrame>
);
