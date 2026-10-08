import React from "react";
import {
  CrownIcon,
  PersonIcon,
  ShieldIcon,
  type IconProps,
} from "../../../components/Icons";
import { SceneFrame } from "../../../components/SceneFrame";
import { COLORS } from "../../../theme";
import { at, type SceneProps } from "../../../timing";
import { IMG_DIR, SCENE_META, VIDEO } from "../meta";
import { FlowCard, ParagraphCard, SceneBackdrop } from "../../../shared/blocks";

const meta = SCENE_META[5];

/** 사망 단계는 방패에 X 표시 */
const DeathIcon: React.FC<IconProps> = (props) => (
  <ShieldIcon {...props} mark="loss" />
);

const STEPS = [
  { Icon: PersonIcon, color: COLORS.blue, label: "무작위 영웅", note: "시작" },
  { Icon: DeathIcon, color: COLORS.grey, label: "사망", note: "능력 획득" },
  { Icon: CrownIcon, color: COLORS.orange, label: "부활", note: "능력 누적" },
];

const RULES = [
  { ratio: 0.4, text: "5대5 자유 역할, 1-2-2 역할 구성 보장", em: "1-2-2" },
  { ratio: 0.52, text: "3판 2선승제 쟁탈전 방식", em: "3판 2선승제" },
  { ratio: 0.64, text: "공물 투표로 애쉬·모이라·윈스턴 추가", em: "공물 투표" },
  { ratio: 0.76, text: "매주 새로운 이벤트 패스 공개", em: "이벤트 패스" },
];

/** Scene 6 · 할로윈 모드 — 수수께끼의 광기: 묘한 게임 */
export const Scene6Halloween: React.FC<SceneProps> = ({ audioFrames }) => (
  <SceneFrame
    videoId={VIDEO.id}
    sceneId="scene6"
    kicker={meta.kicker}
    titleLines={["수수께끼의 광기", "묘한 게임"]}
    titleEm={{ "묘한 게임": COLORS.orange }}
    titleSize={108}
    subtitle="10월 7일~11월 3일"
    source={meta.source}
    backdrop={<SceneBackdrop src={`${IMG_DIR}/mystery-madness-rewards.png`} focusY={50} />}
    cardsAlign="center"
  >
    <FlowCard
      delay={14}
      accent={COLORS.orange}
      header="모드 진행"
      steps={STEPS}
    />

    <ParagraphCard
      audioFrames={audioFrames}
      delay={at(audioFrames, 0.36)}
      items={RULES}
      size={38}
    />
  </SceneFrame>
);
