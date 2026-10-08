import React from "react";
import { Em } from "../../../components/Em";
import { CrownIcon } from "../../../components/Icons";
import { MediaFrame } from "../../../components/MediaFrame";
import { SceneFrame } from "../../../components/SceneFrame";
import { TipBox } from "../../../components/TipBox";
import { BODY } from "../../../styles";
import { COLORS } from "../../../theme";
import { at, type SceneProps } from "../../../timing";
import { IMG_DIR, SCENE_META, VIDEO } from "../meta";
import { Pair, ParagraphCard, SceneBackdrop } from "../../../shared/blocks";

const meta = SCENE_META[3];

const POINTS = [
  { ratio: 0.08, text: "전설 스킨 5종 · 특급 스킨 3종", em: "5종" },
  { ratio: 0.5, text: "신화 영웅 스킨: 용의 협객 우양", em: "용의 협객 우양" },
  { ratio: 0.72, text: "신화 무기 스킨: 트레블메이커 루시우", em: "트레블메이커" },
];

/** Scene 4 · 5시즌 배틀 패스 — 신화 프리즘 최대 80개, 신화 스킨 둘 */
export const Scene4BattlePass: React.FC<SceneProps> = ({ audioFrames }) => (
  <SceneFrame
    videoId={VIDEO.id}
    sceneId="scene4"
    kicker={meta.kicker}
    titleLines={["신화 프리즘", "최대 80개"]}
    titleEm={{ "최대 80개": COLORS.orange }}
    titleSize={124}
    subtitle="전설 5종·특급 3종"
    source={meta.source}
    backdrop={<SceneBackdrop src={`${IMG_DIR}/lucio-mythic.png`} focusY={50} />}
  >
    <Pair>
      <MediaFrame
        src={`${IMG_DIR}/battlepass-bundle.jpg`}
        delay={12}
        height={280}
        focusY={40}
        overlay="5시즌 배틀 패스"
        credit="출처: Blizzard Entertainment"
        style={{ flex: 1 }}
      />
      <MediaFrame
        src={`${IMG_DIR}/lucio-mythic.png`}
        delay={18}
        height={280}
        focusY={50}
        overlay="트레블메이커"
        credit="출처: Blizzard Entertainment"
        style={{ flex: 1 }}
      />
    </Pair>

    <ParagraphCard
      audioFrames={audioFrames}
      delay={at(audioFrames, 0.04)}
      items={POINTS}
      size={38}
    />

    <TipBox
      delay={at(audioFrames, 0.82)}
      title="궁극의 배틀 패스 구성"
      icon={<CrownIcon size={62} color={COLORS.orange} glow />}
    >
      <div style={{ ...BODY, fontSize: 36 }}>
        <Em
          text={"진홍빛 섭정 독트린 · 유령 항해자 벤처\n20단계 건너뛰기 · 코인 2,000개"}
          em={{ "진홍빛 섭정 독트린": COLORS.orange }}
        />
      </div>
    </TipBox>
  </SceneFrame>
);
