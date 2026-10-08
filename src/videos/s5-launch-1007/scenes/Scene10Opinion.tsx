import React from "react";
import { Card } from "../../../components/Card";
import { Em } from "../../../components/Em";
import { DocumentIcon, HeartIcon } from "../../../components/Icons";
import { SceneFrame } from "../../../components/SceneFrame";
import { TipBox } from "../../../components/TipBox";
import { BODY, BODY_SM } from "../../../styles";
import { COLORS } from "../../../theme";
import { at, type SceneProps } from "../../../timing";
import { IMG_DIR, SCENE_META, VIDEO } from "../meta";
import { Lines, ParagraphCard, SceneBackdrop } from "../../../shared/blocks";

const meta = SCENE_META[9];

/** 영웅 체험 주말 이후 조정 (넥슨 패치 노트 10/7) — 전부 하향이라 grey */
const TUNING = [
  { text: "궁극기 충전 8% 느려짐 (비용 8% 증가)", em: "8% 느려짐", color: COLORS.grey },
  { text: "추진형 장막: 쿨 7→8초, 피해 감소 50→40%", em: "50→40%", color: COLORS.grey },
  { text: "구제: 추가 생명력·약화 8→6초, 부패 5→4초", em: "8→6초", color: COLORS.grey },
  { text: "활기 드론 35→30%, 수혈 변환율 50% 감소", em: "35→30%", color: COLORS.grey },
];

const OPINION = [
  {
    ratio: 0.04,
    text: "사실: 개발자 코멘트 \"다른 지원보다 지나치게 좋았다\"",
    em: "사실",
  },
  {
    ratio: 0.2,
    text: "의견: 패스를 매번 채우면 재출시 패스는 체감이 적음",
    em: "의견",
  },
];

/** Scene 10 · 개인 의견 — 재출시 패스보다 조정된 독트린이 궁금하다 */
export const Scene10Opinion: React.FC<SceneProps> = ({ audioFrames }) => {
  const tuneAt = at(audioFrames, 0.42);

  return (
    <SceneFrame
      videoId={VIDEO.id}
      sceneId="scene10"
      kicker={meta.kicker}
      titleLines={["독트린이", "얼마나 바뀌었나"]}
      titleEm={{ 독트린이: COLORS.orange }}
      titleSize={108}
      subtitle="재출시 패스보다 이게 궁금해요"
      source={meta.source}
    backdrop={<SceneBackdrop src={`${IMG_DIR}/doctrine.png`} focusY={30} />}
    >
      <ParagraphCard
        audioFrames={audioFrames}
        delay={12}
        items={OPINION}
        size={34}
      />

      <Card
        delay={tuneAt}
        accent={COLORS.orange}
        header="체험 주말 이후 조정 (패치 노트)"
        name="독트린 조정"
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <HeartIcon
            size={72}
            color={COLORS.green}
            glow
            style={{ flexShrink: 0 }}
          />
          <div>
            <Lines lines={TUNING} start={tuneAt + 10} step={9} size={32} gap={6} />
            <div style={{ ...BODY_SM, fontSize: 28, marginTop: 10 }}>
              장막 치명타 면역 효과도 삭제
            </div>
          </div>
        </div>
      </Card>

      <TipBox
        delay={at(audioFrames, 0.84)}
        title="출처"
        icon={<DocumentIcon size={62} color={COLORS.orange} glow />}
      >
        <div style={{ ...BODY, fontSize: 36 }}>
          <Em
            text={"넥슨 오버워치 패치 노트 10/7\n블리자드 오버워치 새소식"}
            em={{ "10/7": COLORS.orange }}
          />
        </div>
      </TipBox>
    </SceneFrame>
  );
};
