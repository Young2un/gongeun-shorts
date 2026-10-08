import React from "react";
import { GearIcon, HeartIcon, ShieldIcon, type IconProps } from "../../../components/Icons";
import { SceneFrame } from "../../../components/SceneFrame";
import { IconRowCard, Pair, SceneBackdrop, StatCard } from "../../../shared/blocks";
import { COLORS } from "../../../theme";
import { at, type SceneProps } from "../../../timing";
import { IMG_DIR, SCENE_META, VIDEO } from "../meta";

const meta = SCENE_META[12];

const Removed: React.FC<IconProps> = (props) => <ShieldIcon {...props} mark="loss" />;

const KIT = [
  { Icon: Removed, color: COLORS.grey, label: "해킹 제거" },
  { Icon: Removed, color: COLORS.grey, label: "바이러스 제거" },
  { Icon: HeartIcon, color: COLORS.green, label: "긴급 패치 신규" },
  { Icon: GearIcon, color: COLORS.green, label: "사이버 스페이스 신규" },
];

/** Scene 13 · 솜브라가 내준 것 — 해킹·바이러스 삭제, EMP 비용 67.5% 증가 */
export const Scene13SombraCost: React.FC<SceneProps> = ({ audioFrames }) => (
  <SceneFrame
    videoId={VIDEO.id}
    sceneId="scene13"
    kicker={meta.kicker}
    titleLines={["EMP 비용", "67.5% 증가"]}
    titleEm={{ "67.5% 증가": COLORS.orange }}
    titleSize={120}
    subtitle="해킹·바이러스는 삭제"
    source={meta.source}
    backdrop={<SceneBackdrop src={`${IMG_DIR}/kit-sombra-roadhog.jpg`} focusY={50} />}
    cardsAlign="center"
  >
    <IconRowCard
      delay={12}
      accent={COLORS.orange}
      header="솜브라 기술 변화"
      items={KIT}
      labelSize={26}
      footnote="공격 역할에서 지원 역할로 변경"
    />

    <Pair>
      <StatCard
        delay={at(audioFrames, 0.4)}
        accent={COLORS.grey}
        header="EMP 피해"
        value="25→20%"
        valueSize={92}
        note="현재 생명력 기준 · 궁극기 비용 67.5% 증가"
        padding={30}
        style={{ flex: 1 }}
      />
      <StatCard
        delay={at(audioFrames, 0.72)}
        accent={COLORS.grey}
        header="위치변환기 사거리"
        headerSize={34}
        value="18→12.25m"
        valueSize={80}
        note="재사용 대기시간 6초→7.5초"
        padding={30}
        style={{ flex: 1 }}
      />
    </Pair>
  </SceneFrame>
);
