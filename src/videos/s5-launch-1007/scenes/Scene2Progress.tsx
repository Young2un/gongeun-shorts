import React from "react";
import {
  DocumentIcon,
  GearIcon,
  TrophyIcon,
} from "../../../components/Icons";
import { SceneFrame } from "../../../components/SceneFrame";
import { COLORS } from "../../../theme";
import { at, type SceneProps } from "../../../timing";
import { IMG_DIR, SCENE_META, VIDEO } from "../meta";
import { FlowCard, ParagraphCard, SceneBackdrop } from "../../../shared/blocks";

const meta = SCENE_META[1];

const STEPS = [
  { Icon: DocumentIcon, color: COLORS.blue, label: "패스 획득", note: "영구 이용" },
  { Icon: GearIcon, color: COLORS.blue, label: "이어서 진행", note: "기존 진척도" },
  { Icon: TrophyIcon, color: COLORS.green, label: "경험치 적용", note: "두 패스 모두" },
];

const POINTS = [
  { ratio: 0.3, text: "현재 패스 + 재출시 패스 1개 동시 진행", em: "1개" },
  { ratio: 0.55, text: "완료하면 다음 재출시 패스로 자동 전환", em: "자동 전환" },
  { ratio: 0.78, text: "2026년 4시즌 패스는 시즌 중반부터 이용", em: "시즌 중반" },
];

/** Scene 2 · 진행 방식 — 멈춘 지점부터, 두 패스 동시에 */
export const Scene2Progress: React.FC<SceneProps> = ({ audioFrames }) => (
  <SceneFrame
    videoId={VIDEO.id}
    sceneId="scene2"
    kicker={meta.kicker}
    titleLines={["두 패스를", "동시에 진행"]}
    titleEm={{ "동시에 진행": COLORS.orange }}
    titleSize={124}
    subtitle="경험치는 양쪽 모두 적용"
    source={meta.source}
    backdrop={<SceneBackdrop src={`${IMG_DIR}/grimsvotn.jpg`} focusY={50} />}
    cardsAlign="center"
  >
    <FlowCard
      delay={14}
      accent={COLORS.blue}
      header="재출시 패스 진행"
      steps={STEPS}
    />

    <ParagraphCard
      audioFrames={audioFrames}
      delay={at(audioFrames, 0.26)}
      items={POINTS}
      size={38}
    />
  </SceneFrame>
);
