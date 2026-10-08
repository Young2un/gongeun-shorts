import React from "react";
import { Card } from "../../../components/Card";
import { HeroRow } from "../../../components/HeroRow";
import { GearIcon, MegaphoneIcon, ShieldIcon } from "../../../components/Icons";
import { SceneFrame } from "../../../components/SceneFrame";
import { FlowCard, Lines, ParagraphCard, SceneBackdrop } from "../../../shared/blocks";
import { COLORS } from "../../../theme";
import { at, type SceneProps } from "../../../timing";
import { HERO_DIR, IMG_DIR, SCENE_META, VIDEO } from "../meta";

const meta = SCENE_META[10];

const STEPS = [
  { Icon: ShieldIcon, color: COLORS.blue, label: "2초 흡수", note: "전방 투사체" },
  { Icon: GearIcon, color: COLORS.orange, label: "피해 변환", note: "흡수량 30%" },
  { Icon: MegaphoneIcon, color: COLORS.orange, label: "폭발탄 발사", note: "75~200" },
];

const BREATHER = [
  { ratio: 0.62, text: "숨 돌리기 최대 지속 3초→2초", em: "3초→2초", color: COLORS.grey },
  { ratio: 0.74, text: "숨 돌리기 초당 치유량 150→200", em: "150→200", color: COLORS.green },
  { ratio: 0.84, text: "피해 감소 40%→35% · 대기시간 1.25초→2초", em: "40%→35%", color: COLORS.grey },
];

const PERKS = [
  { text: "보조 특전 이리 와 꼬마 돼지야: 돼재앙 중 갈고리 대기시간 80% 감소", em: "이리 와 꼬마 돼지야" },
  { text: "주요 특전 독기 배출: 압축기 중 전방 적 30% 둔화, 초당 20 피해", em: "독기 배출" },
];

/** Scene 11 · 로드호그 신규 기술 — 쓰레기 압축기, 숨 돌리기, 특전 */
export const Scene11Compactor: React.FC<SceneProps> = ({ audioFrames }) => {
  const perksAt = at(audioFrames, 0.88);

  return (
    <SceneFrame
      videoId={VIDEO.id}
      sceneId="scene11"
      kicker={meta.kicker}
      titleLines={["쓰레기 압축기", "투사체 흡수"]}
      titleEm={{ "투사체 흡수": COLORS.orange }}
      titleSize={116}
      subtitle="숨 돌리기는 초당 150→200"
      source={meta.source}
      backdrop={<SceneBackdrop src={`${IMG_DIR}/kit-sombra-roadhog.jpg`} focusY={50} />}
    >
      <FlowCard delay={12} accent={COLORS.orange} header="쓰레기 압축기 (신규)" steps={STEPS} />

      <ParagraphCard
        audioFrames={audioFrames}
        delay={at(audioFrames, 0.58)}
        items={BREATHER}
        size={34}
        name="숨 돌리기"
      />

      <Card delay={perksAt} accent={COLORS.gold} header="신규 특전" name="특전" padding={30}>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <HeroRow
            dir={HERO_DIR}
            heroes={[{ id: "roadhog", name: "", tone: "neutral" }]}
            delay={perksAt + 6}
            size={84}
            style={{ flexShrink: 0 }}
          />
          <Lines lines={PERKS} start={perksAt + 10} step={10} size={30} weight={600} gap={6} />
        </div>
      </Card>
    </SceneFrame>
  );
};
