import React from "react";
import { Card } from "../../../components/Card";
import { HeartIcon } from "../../../components/Icons";
import { MediaFrame } from "../../../components/MediaFrame";
import { SceneFrame } from "../../../components/SceneFrame";
import { COLORS } from "../../../theme";
import { at, type SceneProps } from "../../../timing";
import { IMG_DIR, SCENE_META, VIDEO } from "../meta";
import { Lines, Pair, SceneBackdrop, StatCard } from "../../../shared/blocks";

const meta = SCENE_META[4];

const KIT = [
  { text: "영겁의 홀: 아군 치유 · 적 공격", em: "영겁의 홀" },
  { text: "활기 드론: 치유 · 공격 속도 증가", em: "활기 드론" },
  { text: "구제: 추가 생명력, 적 최대 생명력 감소", em: "구제" },
];

/** Scene 5 · 신규 영웅 독트린과 호위 전장 그림스뵈튼 */
export const Scene5Doctrine: React.FC<SceneProps> = ({ audioFrames }) => {
  const kitAt = at(audioFrames, 0.12);

  return (
    <SceneFrame
      videoId={VIDEO.id}
      sceneId="scene5"
      kicker={meta.kicker}
      titleLines={["독트린과", "그림스뵈튼"]}
      titleEm={{ 독트린: COLORS.orange }}
      titleSize={128}
      subtitle="지원 영웅과 호위 전장 추가"
      source={meta.source}
    backdrop={<SceneBackdrop src={`${IMG_DIR}/doctrine.png`} focusY={22} />}
    >
      <Pair>
        <MediaFrame
          src={`${IMG_DIR}/doctrine.png`}
          delay={12}
          height={280}
          focusY={34}
          overlay="독트린 (지원)"
          credit="출처: Blizzard Entertainment"
          style={{ flex: 1 }}
        />
        <MediaFrame
          src={`${IMG_DIR}/grimsvotn.jpg`}
          delay={18}
          height={280}
          focusY={55}
          overlay="그림스뵈튼 (호위)"
          credit="출처: Blizzard Entertainment"
          style={{ flex: 1 }}
        />
      </Pair>

      <Card delay={kitAt} accent={COLORS.orange} header="독트린 (지원)" name="독트린 기술">
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <HeartIcon
            size={78}
            color={COLORS.green}
            glow
            style={{ flexShrink: 0 }}
          />
          <Lines lines={KIT} start={kitAt + 10} step={10} size={36} />
        </div>
      </Card>

      <StatCard
        delay={at(audioFrames, 0.8)}
        accent={COLORS.orange}
        header="신규 호위 전장"
        value="그림스뵈튼"
        valueSize={84}
        note="아이슬란드 화산 균열 속 감시 기지"
        padding={30}
      />
    </SceneFrame>
  );
};
