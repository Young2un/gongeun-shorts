import React from "react";
import { Easing, Interactive, interpolate, useCurrentFrame } from "remotion";
import { Card } from "../../../components/Card";
import { Em, type Highlights } from "../../../components/Em";
import { HeroRow, type Hero } from "../../../components/HeroRow";
import { SceneFrame } from "../../../components/SceneFrame";
import { BODY, BODY_SM } from "../../../styles";
import { COLORS } from "../../../theme";
import { at, type SceneProps } from "../../../timing";
import { HERO_DIR, VIDEO } from "../meta";

export type ChangeList = {
  readonly accent: string;
  readonly header: string;
  readonly heroId: string;
  readonly lines: readonly { readonly text: string; readonly em: Highlights }[];
  readonly note: string;
};

/**
 * 역할군 변경 장면 (돌격 · 공격 · 지원).
 * 위에 바뀐 영웅 줄, 아래에 변경 내역 카드 두 장. 셋이 구조가 같아 공용으로 쓴다.
 */
export const RoleScene: React.FC<
  SceneProps & {
    readonly sceneId: string;
    readonly kicker: string;
    readonly source: readonly string[];
    readonly titleLines: readonly string[];
    readonly titleEm: Highlights;
    readonly subtitle: string;
    readonly heroes: readonly Hero[];
    readonly lists: readonly [ChangeList, ChangeList];
  }
> = ({
  audioFrames,
  sceneId,
  kicker,
  source,
  titleLines,
  titleEm,
  subtitle,
  heroes,
  lists,
}) => {
  const frame = useCurrentFrame();

  return (
    <SceneFrame
      videoId={VIDEO.id}
      sceneId={sceneId}
      kicker={kicker}
      titleLines={titleLines}
      titleEm={titleEm}
      titleSize={104}
      subtitle={subtitle}
      source={source}
    >
      <HeroRow dir={HERO_DIR} heroes={heroes} delay={14} size={92} />

      {lists.map((list, listIndex) => {
        const delay = listIndex === 0 ? 30 : at(audioFrames, 0.45);

        return (
          <Card
            key={list.header}
            delay={delay}
            accent={list.accent}
            header={list.header}
            name={list.header}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
              <HeroRow
                dir={HERO_DIR}
                heroes={[{ id: list.heroId, name: "", tone: "neutral" }]}
                delay={delay + 6}
                size={92}
                style={{ flexShrink: 0 }}
              />
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {list.lines.map((line, i) => (
                  <Interactive.Div
                    key={line.text}
                    name={`변경 ${i + 1}`}
                    style={{
                      ...BODY,
                      fontSize: 38,
                      fontWeight: 700,
                      opacity: interpolate(
                        frame,
                        [delay + 10 + i * 7, delay + 22 + i * 7],
                        [0, 1],
                        {
                          extrapolateLeft: "clamp",
                          extrapolateRight: "clamp",
                          easing: Easing.bezier(0.16, 1, 0.3, 1),
                        },
                      ),
                    }}
                  >
                    <Em text={line.text} em={line.em} />
                  </Interactive.Div>
                ))}
                <div style={{ ...BODY_SM, fontSize: 30, marginTop: 4 }}>
                  {list.note}
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </SceneFrame>
  );
};

/** 상향은 green, 하향은 grey 로 통일 */
export const UP = COLORS.green;
export const DOWN = COLORS.grey;
