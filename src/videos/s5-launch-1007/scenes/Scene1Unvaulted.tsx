import React from "react";
import { DocumentIcon } from "../../../components/Icons";
import { MediaFrame } from "../../../components/MediaFrame";
import { SceneFrame } from "../../../components/SceneFrame";
import { TipBox } from "../../../components/TipBox";
import { BODY } from "../../../styles";
import { COLORS } from "../../../theme";
import { at, type SceneProps } from "../../../timing";
import { Em } from "../../../components/Em";
import { IMG_DIR, SCENE_META, VIDEO } from "../meta";
import { SceneBackdrop, StatCard } from "../../../shared/blocks";

const meta = SCENE_META[0];

/** Scene 1 · 훅 — 1~15시즌 배틀 패스가 재출시 패스로 돌아왔다 */
export const Scene1Unvaulted: React.FC<SceneProps> = ({ audioFrames }) => (
  <SceneFrame
    videoId={VIDEO.id}
    sceneId="scene1"
    kicker={meta.kicker}
    titleLines={["지난 배틀패스", "다시 열립니다"]}
    titleEm={{ "다시 열립니다": COLORS.orange }}
    titleSize={116}
    subtitle="1~15시즌 재출시 패스"
    source={meta.source}
    backdrop={<SceneBackdrop src={`${IMG_DIR}/doctrine.png`} focusY={30} />}
  >
    <MediaFrame
      src={`${IMG_DIR}/doctrine.png`}
      delay={12}
      height={300}
      focusY={30}
      overlay="5시즌 '어둠의 신조' · 10월 7일 시작"
      credit="출처: Blizzard Entertainment"
    />

    <StatCard
      delay={at(audioFrames, 0.5)}
      accent={COLORS.gold}
      header="재출시 대상"
      value="1~15시즌"
      note="5시즌 시작일: 2026년 10월 7일"
    />

    <TipBox
      delay={at(audioFrames, 0.72)}
      title="이용 경로"
      icon={<DocumentIcon size={62} color={COLORS.orange} glow />}
    >
      <div style={{ ...BODY, fontSize: 38 }}>
        <Em
          text={"홈 화면 > 배틀 패스 > 과거 패스\n구매: 상점 재출시 배틀 패스 탭"}
          em={{ "과거 패스": COLORS.orange, "재출시 배틀 패스": COLORS.orange }}
        />
      </div>
    </TipBox>
  </SceneFrame>
);
