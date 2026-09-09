import React from "react";
import { COLORS } from "../../../theme";
import type { SceneProps } from "../../../timing";
import { SCENE_META, SUPPORT } from "../meta";
import { RoleScene } from "./RoleScene";

const meta = SCENE_META[4];

/** Scene 5 · 지원군 변경 */
export const Scene5Support: React.FC<SceneProps> = (props) => (
  <RoleScene
    {...props}
    sceneId="scene5"
    kicker={meta.kicker}
    source={meta.source}
    titleLines={["바티스트 개상향", "키리코는 칼너프"]}
    titleEm={{ 개상향: COLORS.orange }}
    subtitle="이번 패치 최대 변수"
    heroes={SUPPORT}
    lists={[
      {
        accent: COLORS.green,
        header: "바티스트 버프",
        heroId: "baptiste",
        lines: [
          { text: "내구도 125 → 150", em: { "150": COLORS.green } },
          { text: "재사용 22 → 20초", em: { "20초": COLORS.green } },
          { text: "최소 생명력 20 → 25%", em: { "25%": COLORS.green } },
        ],
        note: "생존기 확실히 세짐",
      },
      {
        accent: COLORS.grey,
        header: "키리코 너프",
        heroId: "kiriko",
        lines: [
          { text: "부적 속도 24 → 18", em: { "18": COLORS.grey } },
          { text: "추적 거리 35 → 30m", em: { "30m": COLORS.grey } },
          { text: "무적 0.65 → 0.5초", em: { "0.5초": COLORS.grey } },
        ],
        note: "방울 범위 5 → 4m",
      },
    ]}
  />
);
