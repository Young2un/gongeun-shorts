import React, { useMemo } from "react";

export type Highlights = Record<string, string>;

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * 문자열 안의 특정 구절만 다른 색/굵기로 강조해서 렌더한다.
 *
 * ```tsx
 * <Em text={"기존 드라이브의 팀 버전."} em={{ 드라이브: COLORS.cyan, "팀 버전": COLORS.orange2 }} />
 * ```
 *
 * `\n` 은 줄바꿈으로 유지된다.
 */
export const Em: React.FC<{
  readonly text: string;
  readonly em?: Highlights;
  readonly style?: React.CSSProperties;
}> = ({ text, em, style }) => {
  const parts = useMemo(() => {
    // 빈 문자열 키가 섞이면 정규식이 모든 위치에 매칭돼 글자 단위로 쪼개진다.
    const keys = Object.keys(em ?? {}).filter((key) => key.length > 0);
    if (keys.length === 0) {
      return [{ text, color: undefined as string | undefined }];
    }
    // 긴 구절을 먼저 매칭해야 짧은 구절에 잘려나가지 않는다.
    const sorted = [...keys].sort((a, b) => b.length - a.length);
    const re = new RegExp(`(${sorted.map(escapeRegExp).join("|")})`, "g");

    return text
      .split(re)
      .filter((chunk) => chunk !== "")
      .map((chunk) => ({ text: chunk, color: (em ?? {})[chunk] }));
  }, [text, em]);

  return (
    <span style={{ whiteSpace: "pre-line", ...style }}>
      {parts.map((part, i) =>
        part.color ? (
          <span key={i} style={{ color: part.color }}>
            {part.text}
          </span>
        ) : (
          <React.Fragment key={i}>{part.text}</React.Fragment>
        ),
      )}
    </span>
  );
};
