import React from "react";
import { SceneFrame } from "../../../components/SceneFrame";
import { ParagraphCard, SceneBackdrop, StatCard } from "../../../shared/blocks";
import { COLORS } from "../../../theme";
import { at, type SceneProps } from "../../../timing";
import { IMG_DIR, SCENE_META, VIDEO } from "../meta";

const meta = SCENE_META[9];

const HOOK = [
  { ratio: 0.08, text: "사슬 갈고리 최종 거리 3m→4.5m", em: "3m→4.5m", color: COLORS.grey },
  { ratio: 0.26, text: "기절 0.4초→0.3초 · 대기시간 7초→6초 (5대5)", em: "0.4초→0.3초" },
  { ratio: 0.36, text: "개발 의도: 갈고리의 치명성 완화", em: "치명성 완화" },
];

const GUN = [
  { ratio: 0.62, text: "산탄 수 25→16, 산탄 공격력 7→4.25", em: "25→16" },
  { ratio: 0.72, text: "중앙 투사체 34 피해 추가, 보조 발사 삭제", em: "34 피해" },
  { ratio: 0.82, text: "탄 퍼짐 8→6, 투사체 속도 80→100", em: "80→100" },
];

/** Scene 10 · 로드호그 — 갈고리 콤보와 2연발 고철총 */
export const Scene10Roadhog: React.FC<SceneProps> = ({ audioFrames }) => (
  <SceneFrame
    videoId={VIDEO.id}
    sceneId="scene10"
    kicker={meta.kicker}
    titleLines={["갈고리 거리", "3→4.5미터"]}
    titleEm={{ "3→4.5미터": COLORS.orange }}
    titleSize={116}
    subtitle="고철총은 2연발로 변경"
    source={meta.source}
    backdrop={<SceneBackdrop src={`${IMG_DIR}/kit-sombra-roadhog.jpg`} focusY={50} />}
  >
    <ParagraphCard audioFrames={audioFrames} delay={12} items={HOOK} size={34} name="사슬 갈고리" />

    <StatCard
      delay={at(audioFrames, 0.5)}
      accent={COLORS.grey}
      header="고철총 치명타 배율"
      value="2→1.5배"
      valueSize={96}
      note="2연발 · 연발당 피해 175→204 · 탄약 6발→12발"
      padding={30}
    />

    <ParagraphCard
      audioFrames={audioFrames}
      delay={at(audioFrames, 0.58)}
      items={GUN}
      size={34}
      name="고철총"
    />
  </SceneFrame>
);
