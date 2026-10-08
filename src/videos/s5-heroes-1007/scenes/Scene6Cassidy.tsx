import React from "react";
import { Em } from "../../../components/Em";
import { HeroRow } from "../../../components/HeroRow";
import { ShieldIcon } from "../../../components/Icons";
import { SceneFrame } from "../../../components/SceneFrame";
import { TipBox } from "../../../components/TipBox";
import { ParagraphCard, SceneBackdrop } from "../../../shared/blocks";
import { BODY } from "../../../styles";
import { COLORS } from "../../../theme";
import { at, type SceneProps } from "../../../timing";
import { HERO_DIR, IMG_DIR, SCENE_META, VIDEO } from "../meta";

const meta = SCENE_META[5];

const INTENT = [
  { ratio: 0.58, text: "개발 의도: 위치를 바꿔 처치하는 조합이 과도", em: "조합이 과도" },
  { ratio: 0.8, text: "다른 궁극기 조합은 사례별로 계속 평가", em: "사례별로 계속 평가" },
];

/** Scene 6 · 막힌 조합 — 황야의 무법자 중 제트팩 캣 생명줄 불가 */
export const Scene6Cassidy: React.FC<SceneProps> = ({ audioFrames }) => (
  <SceneFrame
    videoId={VIDEO.id}
    sceneId="scene6"
    kicker={meta.kicker}
    titleLines={["캐서디 궁극기", "생명줄 불가"]}
    titleEm={{ "생명줄 불가": COLORS.orange }}
    titleSize={116}
    subtitle="제트팩 캣 조합 차단"
    source={meta.source}
    backdrop={<SceneBackdrop src={`${IMG_DIR}/grimsvotn.jpg`} focusY={45} />}
    cardsAlign="center"
  >
    <HeroRow
      dir={HERO_DIR}
      heroes={[
        { id: "cassidy", name: "캐서디", tone: "down" },
        { id: "jetpackcat", name: "제트팩 캣", tone: "neutral" },
      ]}
      delay={12}
      size={116}
    />

    <TipBox
      delay={at(audioFrames, 0.22)}
      title="황야의 무법자 사용 중"
      icon={<ShieldIcon mark="loss" size={62} color={COLORS.orange} glow />}
    >
      <div style={{ ...BODY, fontSize: 38 }}>
        <Em
          text={"제트팩 캣의 생명줄에\n붙을 수 없도록 변경"}
          em={{ "붙을 수 없도록": COLORS.orange }}
        />
      </div>
    </TipBox>

    <ParagraphCard audioFrames={audioFrames} delay={at(audioFrames, 0.54)} items={INTENT} size={36} />
  </SceneFrame>
);
