import React from "react";
import { Em } from "../../../components/Em";
import { HeroRow } from "../../../components/HeroRow";
import { BellIcon } from "../../../components/Icons";
import { SceneFrame } from "../../../components/SceneFrame";
import { TipBox } from "../../../components/TipBox";
import { Pair, SceneBackdrop, StatCard } from "../../../shared/blocks";
import { BODY } from "../../../styles";
import { COLORS } from "../../../theme";
import { at, type SceneProps } from "../../../timing";
import { HERO_DIR, IMG_DIR, SCENE_META, VIDEO } from "../meta";

const meta = SCENE_META[11];

/** Scene 12 · 솜브라 지원 전환 — 긴급 패치와 사이버 스페이스 수치 */
export const Scene12Sombra: React.FC<SceneProps> = ({ audioFrames }) => (
  <SceneFrame
    videoId={VIDEO.id}
    sceneId="scene12"
    kicker={meta.kicker}
    titleLines={["약화 효과", "피해·치유 -50%"]}
    titleEm={{ "-50%": COLORS.orange }}
    titleSize={112}
    subtitle="긴급 패치는 총 175 치유"
    source={meta.source}
    backdrop={<SceneBackdrop src={`${IMG_DIR}/kit-sombra-roadhog.jpg`} focusY={50} />}
  >
    <HeroRow
      dir={HERO_DIR}
      heroes={[{ id: "sombra", name: "솜브라 (지원)", tone: "neutral" }]}
      delay={12}
      size={116}
    />

    <Pair>
      <StatCard
        delay={at(audioFrames, 0.44)}
        accent={COLORS.green}
        header="긴급 패치 즉시 치유"
        headerSize={32}
        value="65"
        note="이후 초당 25 · 총 175 · 12초 · 충전 2회"
        padding={30}
        style={{ flex: 1 }}
      />
      <StatCard
        delay={at(audioFrames, 0.7)}
        accent={COLORS.orange}
        header="사이버 스페이스 약화"
        headerSize={32}
        value="-50%"
        note="반경 5m · 3초 · 적이 주는 피해·치유량 감소"
        padding={30}
        style={{ flex: 1 }}
      />
    </Pair>

    <TipBox
      delay={at(audioFrames, 0.86)}
      title="신규 지속 능력 공모자"
      icon={<BellIcon size={62} color={COLORS.orange} glow />}
    >
      <div style={{ ...BODY, fontSize: 36 }}>
        <Em
          text={"완전히 충전된 적의 궁극기가\n솜브라에게 드러남"}
          em={{ 드러남: COLORS.orange }}
        />
      </div>
    </TipBox>
  </SceneFrame>
);
