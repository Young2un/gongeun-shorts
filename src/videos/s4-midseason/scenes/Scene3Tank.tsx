import React from "react";
import { COLORS } from "../../../theme";
import type { SceneProps } from "../../../timing";
import { SCENE_META, TANKS } from "../meta";
import { RoleScene } from "./RoleScene";

const meta = SCENE_META[2];

/** Scene 3 · 돌격군 변경 */
export const Scene3Tank: React.FC<SceneProps> = (props) => (
  <RoleScene
    {...props}
    sceneId="scene3"
    kicker={meta.kicker}
    source={meta.source}
    titleLines={["디바 체력 버프", "마우가 재조정"]}
    titleEm={{ 버프: COLORS.orange }}
    subtitle="탱커 7명 손봤습니다"
    heroes={TANKS}
    lists={[
      {
        accent: COLORS.green,
        header: "디바 버프",
        heroId: "dva",
        lines: [
          { text: "175 → 200", em: { "200": COLORS.green } },
          { text: "5대5 역할 고정 기준", em: {} },
        ],
        note: "체감 꽤 큽니다",
      },
      {
        accent: COLORS.orange,
        header: "나머지 탱커",
        heroId: "winston",
        lines: [
          { text: "윈스턴 방벽 12 → 10초", em: { "10초": COLORS.green } },
          { text: "마우가 방어력 150 → 125", em: { "125": COLORS.grey } },
          { text: "도미나 궁극기 비용 -6%", em: { "-6%": COLORS.green } },
        ],
        note: "모드별로 적용 범위 다름",
      },
    ]}
  />
);
