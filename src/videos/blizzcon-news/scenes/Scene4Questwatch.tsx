import React from "react";
import { Easing, Interactive, interpolate, useCurrentFrame } from "remotion";
import { Card } from "../../../components/Card";
import { Em } from "../../../components/Em";
import { DiceIcon } from "../../../components/Icons";
import { MediaFrame } from "../../../components/MediaFrame";
import { SceneFrame } from "../../../components/SceneFrame";
import { BODY, BODY_SM } from "../../../styles";
import { COLORS } from "../../../theme";
import { at, type SceneProps } from "../../../timing";
import { TITLE_FONT } from "../../../typography";
import { SCENE_META, VIDEO } from "../meta";

const meta = SCENE_META[3];

const FACTS = [
  { text: "진행자 매튜 머서", em: "매튜 머서" },
  { text: "9월 13일 라이브", em: "9월 13일" },
];

/** Scene 4 · 퀘스트워치 — 시리즈 최초 테이블탑 RPG */
export const Scene4Questwatch: React.FC<SceneProps> = ({ audioFrames }) => {
  const frame = useCurrentFrame();
  const factsAt = at(audioFrames, 0.4);

  return (
    <SceneFrame
      videoId={VIDEO.id}
      sceneId="scene4"
      kicker={meta.kicker}
      titleLines={["퀘스트워치", "정체가 공개된다"]}
      titleEm={{ 퀘스트워치: COLORS.orange }}
      titleSize={112}
      subtitle="오버워치 세계관의 새 시도"
      source={meta.source}
    >
      {/* 공식 이미지는 Threads 에만 있어 자동 수집이 막혀 있다.
          public/videos/blizzcon-news/images/questwatch.jpg 를 넣으면 자동으로 표시된다. */}
      <MediaFrame
        src="videos/blizzcon-news/images/questwatch.jpg"
        delay={12}
        height={300}
        overlay="오버워치 최초 공식 TTRPG"
        credit="출처: @PlayOverwatch 공식 Threads"
      />

      <Card delay={14} accent={COLORS.gold} header="퀘스트워치" name="최초 RPG">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 30,
          }}
        >
          <Interactive.Div
            name="주사위"
            style={{
              scale: interpolate(frame, [16, 44], [0.6, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.spring({ damping: 12 }),
                output: "perceptual-scale",
              }),
              rotate: interpolate(frame, [16, 44], ["-18deg", "0deg"], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.spring({ damping: 14 }),
              }),
            }}
          >
            <DiceIcon size={104} color={COLORS.gold} glow />
          </Interactive.Div>
          <div>
            <div
              style={{
                fontFamily: TITLE_FONT,
                fontSize: 84,
                fontWeight: 900,
                lineHeight: 1.1,
                letterSpacing: -1,
                color: COLORS.gold,
                textShadow: "0 4px 0 #000",
              }}
            >
              시리즈 최초
            </div>
            <div style={{ ...BODY_SM, fontSize: 36, marginTop: 6 }}>
              공식 테이블탑 RPG
            </div>
          </div>
        </div>
      </Card>

      <Card
        delay={factsAt}
        accent={COLORS.orange}
        header="공식 확인 정보"
        name="확인 정보"
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {FACTS.map((fact, i) => (
            <Interactive.Div
              key={fact.text}
              name={`정보 ${i + 1}`}
              style={{
                ...BODY,
                fontWeight: 700,
                opacity: interpolate(
                  frame,
                  [factsAt + 10 + i * 9, factsAt + 24 + i * 9],
                  [0, 1],
                  {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                    easing: Easing.bezier(0.16, 1, 0.3, 1),
                  },
                ),
              }}
            >
              <Em text={fact.text} em={{ [fact.em]: COLORS.orange }} />
            </Interactive.Div>
          ))}
          <div style={{ ...BODY_SM, marginTop: 6 }}>
            게임 모드 출시는 발표되지 않음
          </div>
        </div>
      </Card>
    </SceneFrame>
  );
};
