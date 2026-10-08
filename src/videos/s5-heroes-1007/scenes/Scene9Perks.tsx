import React from "react";
import { HeroRow } from "../../../components/HeroRow";
import { SceneFrame } from "../../../components/SceneFrame";
import { ParagraphCard, SceneBackdrop } from "../../../shared/blocks";
import { COLORS } from "../../../theme";
import { at, type SceneProps } from "../../../timing";
import { HERO_DIR, IMG_DIR, SCENE_META, VIDEO } from "../meta";

const meta = SCENE_META[8];

const ANA = [
  { ratio: 0.1, text: "아나 신규 보조 특전 국소 마취 (혼미 제거)", em: "국소 마취" },
  { ratio: 0.3, text: "수면총 적중 시 폭발, 적 둔화", em: "폭발" },
  { ratio: 0.5, text: "3초에 걸쳐 45 피해", em: "45 피해" },
];

const SION = [
  { ratio: 0.66, text: "시온 신규 보조 특전 생존 본능", em: "생존 본능" },
  { ratio: 0.8, text: "피하기의 추가 생명력 지속 시간 1초 증가", em: "1초 증가", color: COLORS.green },
  { ratio: 0.9, text: "키네틱 재장전 특전은 제거", em: "제거", color: COLORS.grey },
];

/** Scene 9 · 특전 교체 — 아나 국소 마취, 시온 생존 본능 */
export const Scene9Perks: React.FC<SceneProps> = ({ audioFrames }) => (
  <SceneFrame
    videoId={VIDEO.id}
    sceneId="scene9"
    kicker={meta.kicker}
    titleLines={["아나 수면총", "이제 폭발"]}
    titleEm={{ 폭발: COLORS.orange }}
    titleSize={124}
    subtitle="시온은 생존 본능 추가"
    source={meta.source}
    backdrop={<SceneBackdrop src={`${IMG_DIR}/grimsvotn.jpg`} focusY={40} />}
  >
    <HeroRow
      dir={HERO_DIR}
      heroes={[
        { id: "ana", name: "아나", tone: "neutral" },
        { id: "sion", name: "시온", tone: "neutral" },
      ]}
      delay={12}
      size={116}
    />
    <ParagraphCard audioFrames={audioFrames} delay={24} items={ANA} size={36} name="아나" />
    <ParagraphCard
      audioFrames={audioFrames}
      delay={at(audioFrames, 0.62)}
      items={SION}
      size={36}
      name="시온"
    />
  </SceneFrame>
);
