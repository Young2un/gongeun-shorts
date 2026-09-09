import React from "react";
import { Easing, Interactive, interpolate, useCurrentFrame } from "remotion";
import { Card } from "../../../components/Card";
import { Em } from "../../../components/Em";
import { DocumentIcon, MegaphoneIcon } from "../../../components/Icons";
import { MediaFrame } from "../../../components/MediaFrame";
import { SceneFrame } from "../../../components/SceneFrame";
import { TipBox } from "../../../components/TipBox";
import { BODY, BODY_SM } from "../../../styles";
import { COLORS } from "../../../theme";
import { at, type SceneProps } from "../../../timing";
import { SCENE_META, VIDEO } from "../meta";

const meta = SCENE_META[2];

const PROGRAM = [
  { text: "블리즈컨 개막식", em: "" },
  { text: "오버워치 개발자 방송", em: "개발자 방송" },
  { text: "영웅 심층 분석", em: "영웅" },
];

/** Scene 3 · 블리즈컨에서 뭘 보여주는지 */
export const Scene3Program: React.FC<SceneProps> = ({ audioFrames }) => {
  const frame = useCurrentFrame();
  const listAt = 28;

  return (
    <SceneFrame
      videoId={VIDEO.id}
      sceneId="scene3"
      kicker={meta.kicker}
      titleLines={["앞으로의 변화", "직접 공개한다"]}
      titleEm={{ "직접 공개": COLORS.orange }}
      titleSize={112}
      subtitle="개발진 방송과 영웅 발표 예정"
      source={meta.source}
    >
      <MediaFrame
        src="videos/blizzcon-news/images/hero-lineup.jpg"
        delay={12}
        height={300}
        focusY={45}
        overlay="유튜브 · 트위치 무료 생중계"
        credit="출처: Blizzard Entertainment"
      />

      <Card
        delay={listAt}
        accent={COLORS.orange}
        header="공식 프로그램"
        name="프로그램"
      >
        <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
          <MegaphoneIcon
            size={86}
            color={COLORS.orange}
            glow
            style={{ flexShrink: 0 }}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {PROGRAM.map((line, i) => (
              <Interactive.Div
                key={line.text}
                name={`프로그램 ${i + 1}`}
                style={{
                  ...BODY,
                  fontWeight: 700,
                  opacity: interpolate(
                    frame,
                    [listAt + 10 + i * 9, listAt + 24 + i * 9],
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
            <div style={{ ...BODY_SM, marginTop: 6 }}>온라인 무료 생중계</div>
          </div>
        </div>
      </Card>

      <TipBox
        delay={at(audioFrames, 0.6)}
        title="여기부터는 예상"
        icon={<DocumentIcon size={62} color={COLORS.orange} glow />}
      >
        <div style={{ ...BODY, fontSize: 38 }}>
          <Em
            text="구체적인 발표 내용은 아직 미공개"
            em={{ "아직 미공개": COLORS.orange }}
          />
        </div>
      </TipBox>
    </SceneFrame>
  );
};
