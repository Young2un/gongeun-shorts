import React from "react";
import { COLORS } from "../../../theme";
import type { SceneProps } from "../../../timing";
import { DAMAGE, SCENE_META } from "../meta";
import { RoleScene } from "./RoleScene";

const meta = SCENE_META[3];

/** Scene 4 · 공격군 변경 */
export const Scene4Damage: React.FC<SceneProps> = (props) => (
  <RoleScene
    {...props}
    sceneId="scene4"
    kicker={meta.kicker}
    source={meta.source}
    titleLines={["프레야 칼너프", "정크랫은 버프"]}
    titleEm={{ 칼너프: COLORS.orange }}
    subtitle="화력이랑 기동성 재조정"
    heroes={DAMAGE}
    lists={[
      {
        accent: COLORS.grey,
        header: "프레야 칼너프",
        heroId: "freya",
        lines: [
          { text: "기본 피해 30 → 28", em: { "28": COLORS.grey } },
          { text: "폭발 피해 80 → 75", em: { "75": COLORS.grey } },
          { text: "회수 화살 8 → 5개", em: { "5개": COLORS.grey } },
        ],
        note: "화력 전반 하향",
      },
      {
        accent: COLORS.green,
        header: "나머지 딜러",
        heroId: "junkrat",
        lines: [
          { text: "정크랫 지뢰 8 → 7초", em: { "7초": COLORS.green } },
          { text: "시에라 투사체 90 → 120", em: { "120": COLORS.green } },
          { text: "토르비욘 산탄폭 감소", em: { 감소: COLORS.grey } },
        ],
        note: "시에라 피해는 하향",
      },
    ]}
  />
);
