import React from "react";
import { Easing, Interactive, interpolate, useCurrentFrame } from "remotion";
import { Card } from "../../../components/Card";
import { Em } from "../../../components/Em";
import { MegaphoneIcon } from "../../../components/Icons";
import { MediaFrame } from "../../../components/MediaFrame";
import { SceneFrame } from "../../../components/SceneFrame";
import { BODY, BODY_SM } from "../../../styles";
import { COLORS } from "../../../theme";
import { at, type SceneProps } from "../../../timing";
import { NUMERIC_FONT } from "../../../typography";
import { SCENE_META, VIDEO } from "../meta";

const meta = SCENE_META[0];

const HEADLINES = [
  { text: "과거 배틀패스 출시 연기", em: "출시 연기" },
  { text: "오버워치 신규 발표 예고", em: "신규 발표" },
  { text: "최초 공식 테이블탑 RPG", em: "최초" },
];

/** Scene 1 · 훅 — 블리즈컨을 앞두고 나온 세 가지 소식 */
export const Scene1Headline: React.FC<SceneProps> = ({ audioFrames }) => {
  const frame = useCurrentFrame();
  const listAt = at(audioFrames, 0.45);

  return (
    <SceneFrame
      videoId={VIDEO.id}
      sceneId="scene1"
      kicker={meta.kicker}
      titleLines={["오버워치에", "큰 발표 온다"]}
      titleEm={{ "큰 발표": COLORS.orange }}
      titleSize={124}
      subtitle="연기 소식부터 블리즈컨까지"
      source={meta.source}
    >
      <MediaFrame
        src="videos/blizzcon-news/images/blizzcon-keyart.jpg"
        delay={12}
        height={330}
        focusY={42}
        overlay="블리즈컨 2026 · 9월 12~13일"
        credit="출처: Blizzard Entertainment"
      />

      <Card
        delay={26}
        accent={COLORS.orange}
        header="블리즈컨 개최"
        name="개최일"
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "center",
            gap: 20,
          }}
        >
          <Interactive.Div
            name="개최일 강조"
            style={{
              fontFamily: NUMERIC_FONT,
              fontSize: 120,
              fontWeight: 900,
              lineHeight: 1,
              color: COLORS.orange,
              scale: interpolate(frame, [28, 54], [0.78, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.spring({ damping: 16 }),
                output: "perceptual-scale",
              }),
            }}
          >
            9/12~13
          </Interactive.Div>
          <span style={{ ...BODY_SM, fontSize: 36 }}>현지 날짜 기준</span>
        </div>
      </Card>

      <Card
        delay={listAt}
        accent={COLORS.orange}
        header="이번 소식 핵심"
        name="핵심 3가지"
      >
        <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
          <MegaphoneIcon
            size={78}
            color={COLORS.orange}
            glow
            style={{ flexShrink: 0 }}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {HEADLINES.map((line, i) => (
              <Interactive.Div
                key={line.text}
                name={`핵심 ${i + 1}`}
                style={{
                  ...BODY,
                  fontWeight: 700,
                  opacity: interpolate(
                    frame,
                    [listAt + 10 + i * 8, listAt + 22 + i * 8],
                    [0, 1],
                    {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                      easing: Easing.bezier(0.16, 1, 0.3, 1),
                    },
                  ),
                }}
              >
                <Em text={line.text} em={{ [line.em]: COLORS.orange }} />
              </Interactive.Div>
            ))}
            <div style={{ ...BODY_SM, marginTop: 6 }}>
              모두 블리자드 공식 발표
            </div>
          </div>
        </div>
      </Card>
    </SceneFrame>
  );
};
