import React from "react";
import { Em } from "../../../components/Em";
import {
  GearIcon,
  HeartIcon,
  PersonIcon,
  ShieldIcon,
} from "../../../components/Icons";
import { SceneFrame } from "../../../components/SceneFrame";
import { TipBox } from "../../../components/TipBox";
import { BODY } from "../../../styles";
import { COLORS } from "../../../theme";
import { at, type SceneProps } from "../../../timing";
import { IMG_DIR, SCENE_META, VIDEO } from "../meta";
import { IconRowCard, ParagraphCard, SceneBackdrop } from "../../../shared/blocks";

const meta = SCENE_META[8];

const VOTE = [
  { ratio: 0.08, text: "최근 2시간 내 마지막 2개 전장은 제외", em: "마지막 2개 전장" },
  { ratio: 0.26, text: "호위와 혼합은 같은 모드로 취급", em: "같은 모드" },
  { ratio: 0.36, text: "할로윈 테마 전장 3종은 11월 4일까지", em: "11월 4일까지" },
  { ratio: 0.46, text: "수수께끼의 영웅: 돌격 최대 3명 제한 복원", em: "돌격 최대 3명" },
];

const ROLES = [
  { Icon: ShieldIcon, color: COLORS.orange, label: "돌격 1명 (필수)" },
  { Icon: PersonIcon, color: COLORS.blue, label: "공격 최대 2명" },
  { Icon: HeartIcon, color: COLORS.green, label: "지원 최대 3명" },
];

/** Scene 9 · 편의·대기열 — 전장 투표 중복 방지, 스타디움 빠른 대전 자유 역할 */
export const Scene9Queue: React.FC<SceneProps> = ({ audioFrames }) => (
  <SceneFrame
    videoId={VIDEO.id}
    sceneId="scene9"
    kicker={meta.kicker}
    titleLines={["전장 투표", "중복 방지"]}
    titleEm={{ "중복 방지": COLORS.orange }}
    titleSize={128}
    subtitle="스타디움 빠른 대전도 변경"
    source={meta.source}
    backdrop={<SceneBackdrop src={`${IMG_DIR}/grimsvotn.jpg`} focusY={60} />}
  >
    <ParagraphCard
      audioFrames={audioFrames}
      delay={12}
      items={VOTE}
      size={36}
    />

    <IconRowCard
      delay={at(audioFrames, 0.56)}
      accent={COLORS.blue}
      header="스타디움 빠른 대전 역할 제한"
      items={ROLES}
      footnote="자유 역할 방식 · 경쟁전에는 영향 없음"
    />

    <TipBox
      delay={at(audioFrames, 0.86)}
      title="사용자 지정 금지어"
      icon={<GearIcon size={62} color={COLORS.orange} glow />}
    >
      <div style={{ ...BODY, fontSize: 36 }}>
        <Em
          text={"소셜 > 텍스트 대화에서 설정\n해당 메시지는 경고와 함께 숨김"}
          em={{ 숨김: COLORS.orange }}
        />
      </div>
    </TipBox>
  </SceneFrame>
);
