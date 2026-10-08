import React from "react";
import { Card } from "../../../components/Card";
import { Em } from "../../../components/Em";
import { DocumentIcon, HeartIcon } from "../../../components/Icons";
import { MediaFrame } from "../../../components/MediaFrame";
import { SceneFrame } from "../../../components/SceneFrame";
import { TipBox } from "../../../components/TipBox";
import { Lines, SceneBackdrop } from "../../../shared/blocks";
import { BODY } from "../../../styles";
import { COLORS } from "../../../theme";
import { at, type SceneProps } from "../../../timing";
import { IMG_DIR, SCENE_META, VIDEO } from "../meta";

const meta = SCENE_META[3];

const TUNING = [
  { text: "궁극기 비용 8% 증가", em: "8% 증가", color: COLORS.grey },
  { text: "활기 드론 공격 속도 35%→30%", em: "35%→30%", color: COLORS.grey },
  { text: "주요 특전 수혈 변환율 50% 감소", em: "50% 감소", color: COLORS.grey },
];

/** Scene 4 · 독트린은 체험 때 그대로가 아니다 */
export const Scene4Doctrine: React.FC<SceneProps> = ({ audioFrames }) => {
  const listAt = at(audioFrames, 0.5);

  return (
    <SceneFrame
      videoId={VIDEO.id}
      sceneId="scene4"
      kicker={meta.kicker}
      titleLines={["체험 때 그대로", "아닙니다"]}
      titleEm={{ 아닙니다: COLORS.orange }}
      titleSize={116}
      subtitle="궁극기 비용 8% 증가"
      source={meta.source}
      backdrop={<SceneBackdrop src={`${IMG_DIR}/kit-doctrine.jpg`} focusY={50} />}
    >
      <MediaFrame
        src={`${IMG_DIR}/doctrine.png`}
        delay={12}
        height={300}
        focusY={30}
        overlay="독트린 · 영웅 체험 주말 이후 조정"
        credit="출처: Blizzard Entertainment"
      />

      <Card delay={listAt} accent={COLORS.grey} header="조정 수치 (하향)" name="독트린 조정">
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <HeartIcon size={72} color={COLORS.green} glow style={{ flexShrink: 0 }} />
          <Lines lines={TUNING} start={listAt + 10} step={10} size={36} />
        </div>
      </Card>

      <TipBox
        delay={at(audioFrames, 0.2)}
        title="개발자의 의견"
        icon={<DocumentIcon size={62} color={COLORS.orange} glow />}
      >
        <div style={{ ...BODY, fontSize: 36 }}>
          <Em
            text={"다른 지원 영웅보다 성능이 지나치게 좋았다\n핵심 흐름은 유지, 기술 구성 여러 부분 조정"}
            em={{ "지나치게 좋았다": COLORS.orange }}
          />
        </div>
      </TipBox>
    </SceneFrame>
  );
};
