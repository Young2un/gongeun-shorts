import React from "react";
import { TrophyIcon } from "../../../components/Icons";
import { SceneFrame } from "../../../components/SceneFrame";
import { COLORS } from "../../../theme";
import { at, type SceneProps } from "../../../timing";
import { IMG_DIR, SCENE_META, VIDEO } from "../meta";
import { ParagraphCard, SceneBackdrop, StatCard } from "../../../shared/blocks";

const meta = SCENE_META[7];

const CHANGES = [
  { ratio: 0.18, text: "순위표 기본 정렬: 챌린저 점수 → 등급", em: "챌린저 점수 → 등급" },
  { ratio: 0.36, text: "시즌 종료 칭호도 등급 기준으로 제공", em: "등급 기준" },
  { ratio: 0.52, text: "열기 보너스 삭제", em: "삭제" },
];

/** Scene 8 · 경쟁전 — 상위 500위 정렬 기준 변경, 열기 보너스 삭제, 팀 드라이브 일정 */
export const Scene8Competitive: React.FC<SceneProps> = ({ audioFrames }) => (
  <SceneFrame
    videoId={VIDEO.id}
    sceneId="scene8"
    kicker={meta.kicker}
    titleLines={["상위 500위", "등급 기준"]}
    titleEm={{ "등급 기준": COLORS.orange }}
    titleSize={120}
    subtitle="열기 보너스 삭제"
    source={meta.source}
    backdrop={<SceneBackdrop src={`${IMG_DIR}/tech-witches.jpg`} focusY={40} />}
    cardsAlign="center"
  >
    <ParagraphCard
      audioFrames={audioFrames}
      delay={14}
      items={CHANGES}
      size={38}
    />

    <StatCard
      delay={at(audioFrames, 0.66)}
      accent={COLORS.orange}
      header="팀 드라이브"
      value="10월 30일"
      note="11월 2일까지 · 블리자드 새소식 기준"
      Icon={TrophyIcon}
    />
  </SceneFrame>
);
