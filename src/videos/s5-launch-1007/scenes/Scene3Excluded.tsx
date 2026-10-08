import React from "react";
import { Em } from "../../../components/Em";
import {
  BellIcon,
  CrownIcon,
  DocumentIcon,
  GearIcon,
  ProfileCardIcon,
  TrophyIcon,
} from "../../../components/Icons";
import { SceneFrame } from "../../../components/SceneFrame";
import { TipBox } from "../../../components/TipBox";
import { BODY } from "../../../styles";
import { COLORS } from "../../../theme";
import { at, type SceneProps } from "../../../timing";
import { IMG_DIR, SCENE_META, VIDEO } from "../meta";
import { IconRowCard, SceneBackdrop } from "../../../shared/blocks";

const meta = SCENE_META[2];

/** 재출시 패스에서 빠지는 것 — 전부 비활성(grey) */
const EXCLUDED = [
  { Icon: CrownIcon, color: COLORS.grey, label: "신화 스킨" },
  { Icon: GearIcon, color: COLORS.grey, label: "신화 프리즘" },
  { Icon: TrophyIcon, color: COLORS.grey, label: "오버워치 코인" },
  { Icon: BellIcon, color: COLORS.grey, label: "경험치 부스트" },
  { Icon: ProfileCardIcon, color: COLORS.grey, label: "칭호" },
];

/** Scene 3 · 빠지는 보상 — 신화 스킨·코인·프리즘·칭호는 없다 */
export const Scene3Excluded: React.FC<SceneProps> = ({ audioFrames }) => (
  <SceneFrame
    videoId={VIDEO.id}
    sceneId="scene3"
    kicker={meta.kicker}
    titleLines={["신화 스킨은", "포함 안 됨"]}
    titleEm={{ "포함 안 됨": COLORS.orange }}
    titleSize={124}
    subtitle="코인·프리즘·칭호도 제외"
    source={meta.source}
    backdrop={<SceneBackdrop src={`${IMG_DIR}/battlepass-bundle.jpg`} focusY={40} />}
    cardsAlign="center"
  >
    <IconRowCard
      delay={14}
      accent={COLORS.grey}
      header="재출시 패스 제외 보상"
      items={EXCLUDED}
      labelSize={26}
      footnote="블리자드 새소식 · 넥슨 패치 노트 기준"
    />

    <TipBox
      delay={at(audioFrames, 0.62)}
      title="구매 전 확인"
      icon={<DocumentIcon size={62} color={COLORS.orange} glow />}
    >
      <div style={{ ...BODY, fontSize: 38 }}>
        <Em
          text={"원하는 보상이 해당 패스에\n포함돼 있는지 먼저 확인"}
          em={{ "먼저 확인": COLORS.orange }}
        />
      </div>
    </TipBox>
  </SceneFrame>
);
