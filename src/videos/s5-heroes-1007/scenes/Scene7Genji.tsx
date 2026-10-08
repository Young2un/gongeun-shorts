import React from "react";
import { HeroRow } from "../../../components/HeroRow";
import { SceneFrame } from "../../../components/SceneFrame";
import { SceneBackdrop, StatCard } from "../../../shared/blocks";
import { COLORS } from "../../../theme";
import { at, type SceneProps } from "../../../timing";
import { HERO_DIR, IMG_DIR, SCENE_META, VIDEO } from "../meta";

const meta = SCENE_META[6];

/** Scene 7 · 겐지 — 질풍참 50→60, 용검 110→100 (15% 가속) */
export const Scene7Genji: React.FC<SceneProps> = ({ audioFrames }) => (
  <SceneFrame
    videoId={VIDEO.id}
    sceneId="scene7"
    kicker={meta.kicker}
    titleLines={["겐지 질풍참", "50→60"]}
    titleEm={{ "50→60": COLORS.orange }}
    titleSize={124}
    subtitle="용검은 110→100, 15% 가속"
    source={meta.source}
    backdrop={<SceneBackdrop src={`${IMG_DIR}/battlepass-bundle.jpg`} focusY={40} />}
  >
    <HeroRow
      dir={HERO_DIR}
      heroes={[{ id: "genji", name: "겐지", tone: "up" }]}
      delay={12}
      size={128}
    />

    <StatCard
      delay={at(audioFrames, 0.2)}
      accent={COLORS.green}
      header="질풍참 공격력"
      value="50→60"
      note="핵심 콤보로 적을 확실히 처치하도록 강화"
    />

    <StatCard
      delay={at(audioFrames, 0.56)}
      accent={COLORS.grey}
      header="용검 공격력"
      value="110→100"
      note="휘두르기 속도는 15% 증가"
    />
  </SceneFrame>
);
