import type React from "react";
import { COLORS } from "./theme";

/** 카드 본문 */
export const BODY: React.CSSProperties = {
  fontSize: 42,
  fontWeight: 500,
  lineHeight: 1.6,
  color: COLORS.white,
};

/** 카드 안 보조 설명 */
export const BODY_SM: React.CSSProperties = {
  fontSize: 34,
  fontWeight: 500,
  lineHeight: 1.5,
  color: COLORS.grey,
};

/** 아이콘 아래 붙는 라벨 */
export const LABEL: React.CSSProperties = {
  fontSize: 32,
  fontWeight: 700,
  lineHeight: 1.35,
  color: COLORS.white,
  textAlign: "center",
};
