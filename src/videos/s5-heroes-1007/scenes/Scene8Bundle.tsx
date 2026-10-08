import React from "react";
import { HeroRow } from "../../../components/HeroRow";
import { SceneFrame } from "../../../components/SceneFrame";
import { ParagraphCard, SceneBackdrop } from "../../../shared/blocks";
import { COLORS } from "../../../theme";
import { at, type SceneProps } from "../../../timing";
import { HERO_DIR, IMG_DIR, SCENE_META, VIDEO } from "../meta";

const meta = SCENE_META[7];

const HEROES = [
  { id: "dva", name: "D.Va", tone: "up" as const },
  { id: "lucio", name: "루시우", tone: "up" as const },
  { id: "domina", name: "도미나", tone: "up" as const },
  { id: "emre", name: "엠레", tone: "up" as const },
  { id: "bastion", name: "바스티온", tone: "down" as const },
];

const FIRST = [
  { ratio: 0.02, text: "D.Va 마이크로 미사일 초당 11→14발", em: "11→14발", color: COLORS.green },
  { ratio: 0.1, text: "총 공격력은 그대로, 순간 공격력 잠재력 상승", em: "총 공격력은 그대로" },
  { ratio: 0.22, text: "루시우 소리 방벽 지속 5초→6초", em: "5초→6초", color: COLORS.green },
  { ratio: 0.3, text: "비트 드롭: 시전 후 4초간 볼륨을 높여라! 활성화", em: "4초간" },
];

const SECOND = [
  { ratio: 0.42, text: "도미나 수정 발사 재사용 대기시간 8초→7초", em: "8초→7초", color: COLORS.green },
  { ratio: 0.5, text: "도미나 재조립 기술 생명력 흡수 75%→100%", em: "75%→100%", color: COLORS.green },
  { ratio: 0.6, text: "엠레 사이버 파편 수류탄 대기시간 10초→9초", em: "10초→9초", color: COLORS.green },
  { ratio: 0.8, text: "바스티온 재설정 지속 6초→5초 (하향)", em: "6초→5초", color: COLORS.grey },
];

/** Scene 8 · 수치 조정 묶음 — D.Va · 루시우 · 도미나 · 엠레 · 바스티온 */
export const Scene8Bundle: React.FC<SceneProps> = ({ audioFrames }) => (
  <SceneFrame
    videoId={VIDEO.id}
    sceneId="scene8"
    kicker={meta.kicker}
    titleLines={["D.Va 미사일", "초당 11→14발"]}
    titleEm={{ "11→14발": COLORS.orange }}
    titleSize={108}
    subtitle="바스티온은 하향"
    source={meta.source}
    backdrop={<SceneBackdrop src={`${IMG_DIR}/battlepass-bundle.jpg`} focusY={40} />}
  >
    <HeroRow dir={HERO_DIR} heroes={HEROES} delay={12} size={92} />
    <ParagraphCard audioFrames={audioFrames} delay={20} items={FIRST} size={32} name="D.Va · 루시우" />
    <ParagraphCard
      audioFrames={audioFrames}
      delay={at(audioFrames, 0.38)}
      items={SECOND}
      size={32}
      name="도미나 · 엠레 · 바스티온"
    />
  </SceneFrame>
);
