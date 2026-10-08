import React from "react";
import { Em } from "../../../components/Em";
import { BellIcon } from "../../../components/Icons";
import { MediaFrame } from "../../../components/MediaFrame";
import { SceneFrame } from "../../../components/SceneFrame";
import { TipBox } from "../../../components/TipBox";
import { BODY } from "../../../styles";
import { COLORS } from "../../../theme";
import { at, type SceneProps } from "../../../timing";
import { IMG_DIR, SCENE_META, VIDEO } from "../meta";
import { Pair, ParagraphCard, SceneBackdrop } from "../../../shared/blocks";

const meta = SCENE_META[6];

const DATES = [
  { ratio: 0.12, text: "그림자 군주 콜라보: 10월 7일~21일", em: "10월 7일~21일" },
  { ratio: 0.36, text: "테크 마녀 수집품: 10월 10일~27일", em: "10월 10일~27일" },
  {
    ratio: 0.62,
    text: "콜라보 스킨 5종: 겐지·리퍼·안란·라인하르트·라이프위버",
    em: "5종",
  },
];

/** Scene 7 · 기간 한정 — 그림자 군주 콜라보 10/7~21, 테크 마녀 10/10~27 (한국 기준) */
export const Scene7Schedule: React.FC<SceneProps> = ({ audioFrames }) => (
  <SceneFrame
    videoId={VIDEO.id}
    sceneId="scene7"
    kicker={meta.kicker}
    titleLines={["그림자 군주", "21일까지"]}
    titleEm={{ "21일까지": COLORS.orange }}
    titleSize={116}
    subtitle="테크 마녀는 10월 27일까지"
    source={meta.source}
    backdrop={<SceneBackdrop src={`${IMG_DIR}/shadow-lord-collab.jpg`} focusY={40} />}
  >
    <Pair>
      <MediaFrame
        src={`${IMG_DIR}/shadow-lord-collab.jpg`}
        delay={12}
        height={280}
        focusY={40}
        overlay="그림자 군주 콜라보"
        credit="출처: Blizzard Entertainment"
        style={{ flex: 1 }}
      />
      <MediaFrame
        src={`${IMG_DIR}/tech-witches.jpg`}
        delay={18}
        height={280}
        focusY={40}
        overlay="테크 마녀"
        credit="출처: Blizzard Entertainment"
        style={{ flex: 1 }}
      />
    </Pair>

    <ParagraphCard
      audioFrames={audioFrames}
      delay={at(audioFrames, 0.1)}
      items={DATES}
      size={36}
    />

    <TipBox
      delay={at(audioFrames, 0.5)}
      title="둘 다 기간 한정"
      icon={<BellIcon size={62} color={COLORS.orange} glow />}
    >
      <div style={{ ...BODY, fontSize: 36 }}>
        <Em
          text={"그림자 군주 10월 21일까지\n테크 마녀 10월 27일까지"}
          em={{ "10월 21일": COLORS.orange, "10월 27일": COLORS.orange }}
        />
      </div>
    </TipBox>
  </SceneFrame>
);
