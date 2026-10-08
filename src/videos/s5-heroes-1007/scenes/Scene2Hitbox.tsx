import React from "react";
import { Card } from "../../../components/Card";
import { HeroRow } from "../../../components/HeroRow";
import { PersonIcon } from "../../../components/Icons";
import { SceneFrame } from "../../../components/SceneFrame";
import { Lines, SceneBackdrop } from "../../../shared/blocks";
import { COLORS } from "../../../theme";
import { at, type SceneProps } from "../../../timing";
import { HERO_DIR, IMG_DIR, SCENE_META, VIDEO } from "../meta";

const meta = SCENE_META[1];

/** 타점이 커진 쪽은 맞기 쉬워진 것(하향) · 줄어든 쪽은 상향 */
const HEROES = [
  { id: "kiriko", name: "키리코", tone: "down" as const },
  { id: "mercy", name: "메르시", tone: "down" as const },
  { id: "sombra", name: "솜브라", tone: "down" as const },
  { id: "cassidy", name: "캐서디", tone: "up" as const },
  { id: "zenyatta", name: "젠야타", tone: "up" as const },
  { id: "torbjorn", name: "토르비욘", tone: "up" as const },
];

const BIGGER = [
  { text: "키리코 머리 14.9→16", em: "14.9→16" },
  { text: "메르시 머리 14.4→17", em: "14.4→17" },
  { text: "솜브라 머리 14→16", em: "14→16" },
];

const SMALLER = [
  { text: "캐서디 몸통 37→33", em: "37→33", color: COLORS.green },
  { text: "젠야타 머리 20→17", em: "20→17", color: COLORS.green },
  { text: "토르비욘 머리 23.3→20", em: "23.3→20", color: COLORS.green },
];

/** Scene 2 · 영웅 34명 타점 조정 — 커진 쪽과 줄어든 쪽 */
export const Scene2Hitbox: React.FC<SceneProps> = ({ audioFrames }) => {
  const smallerAt = at(audioFrames, 0.5);

  return (
    <SceneFrame
      videoId={VIDEO.id}
      sceneId="scene2"
      kicker={meta.kicker}
      titleLines={["영웅 34명", "타점이 바뀜"]}
      titleEm={{ "34명": COLORS.orange }}
      titleSize={124}
      subtitle="커진 영웅과 줄어든 영웅"
      source={meta.source}
      backdrop={<SceneBackdrop src={`${IMG_DIR}/grimsvotn.jpg`} focusY={50} />}
    >
      <HeroRow dir={HERO_DIR} heroes={HEROES} delay={12} size={92} />

      <Card delay={26} accent={COLORS.orange} header="커진 타점 (맞기 쉬워짐)" name="커진 타점">
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <PersonIcon size={72} color={COLORS.orange} glow style={{ flexShrink: 0 }} />
          <Lines lines={BIGGER} start={36} step={10} size={36} />
        </div>
      </Card>

      <Card delay={smallerAt} accent={COLORS.green} header="줄어든 타점" name="줄어든 타점">
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <PersonIcon size={72} color={COLORS.green} glow style={{ flexShrink: 0 }} />
          <Lines lines={SMALLER} start={smallerAt + 10} step={10} size={36} />
        </div>
      </Card>
    </SceneFrame>
  );
};
