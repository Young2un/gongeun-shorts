import React from "react";
import { Img, staticFile } from "remotion";
import { boxOf, CHUSEOK, POSTER_PX, type Rect } from "./theme";

/** 포스터 위를 단색으로 덮는다 (문구를 갈아 끼우기 전에 바탕을 지우는 용도) */
export const Fill: React.FC<{
  readonly rect: Rect;
  readonly color: string;
  readonly radius?: number;
}> = ({ rect, color, radius = 0 }) => (
  <div
    style={{
      position: "absolute",
      ...boxOf(rect),
      backgroundColor: color,
      borderRadius: radius,
    }}
  />
);

/**
 * 2번 포스터의 날짜 칸을 다시 그린 것.
 *
 * 원본에는 "오전 11:00" 이 적혀 있지만 공식 공지에는 시작 시각이 없다.
 * 한 칸만 고치면 옆 칸과 폰트가 달라 보이므로 두 칸을 같은 코드로 다시 그린다.
 */
export const DateCell: React.FC<{
  readonly rect: Rect;
  readonly date: string;
  readonly day: string;
  readonly note: string;
}> = ({ rect, date, day, note }) => (
  <div
    style={{
      position: "absolute",
      ...boxOf(rect),
      borderRadius: 26,
      backgroundColor: CHUSEOK.cellBg,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 4,
    }}
  >
    <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
      <span
        style={{
          fontSize: 54,
          fontWeight: 800,
          letterSpacing: -1,
          color: CHUSEOK.pink,
        }}
      >
        {date}
      </span>
      <span style={{ fontSize: 36, fontWeight: 700, color: CHUSEOK.pink }}>
        ({day})
      </span>
    </div>
    <div style={{ fontSize: 34, fontWeight: 600, color: CHUSEOK.muted }}>
      {note}
    </div>
  </div>
);

/** 날짜 칸 사이의 물결표 */
export const Tilde: React.FC<{ readonly rect: Rect }> = ({ rect }) => (
  <div
    style={{
      position: "absolute",
      ...boxOf(rect),
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 52,
      fontWeight: 800,
      color: CHUSEOK.ink2,
    }}
  >
    ~
  </div>
);

/**
 * 일러스트 위의 문구를 갈아 끼우는 조각.
 * 그 자리 포스터를 흐리게 깔고 눌러서 원래 글자를 지운 뒤 새 문구를 올린다.
 */
export const GlassPatch: React.FC<{
  readonly image: string;
  readonly rect: Rect;
  readonly text: string;
  readonly fontSize?: number;
  readonly radius?: number;
}> = ({ image, rect, text, fontSize = 34, radius = 34 }) => {
  const b = boxOf(rect);

  return (
    <div
      style={{
        position: "absolute",
        ...b,
        borderRadius: radius,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Img
        src={staticFile(image)}
        style={{
          position: "absolute",
          left: -b.left,
          top: -b.top,
          width: POSTER_PX.w,
          height: POSTER_PX.h,
          maxWidth: "none",
          filter: "blur(26px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(20,24,67,0.66)",
        }}
      />
      <span
        style={{
          position: "relative",
          fontSize,
          fontWeight: 700,
          color: "#FFFFFF",
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </span>
    </div>
  );
};

/** 카드 안에서 줄을 갈아 끼울 때 쓰는 문단 (배경색까지 같이 덮는다) */
export const CardNote: React.FC<{
  readonly rect: Rect;
  readonly lines: readonly string[];
  readonly color?: string;
  readonly background?: string;
  readonly fontSize?: number;
}> = ({
  rect,
  lines,
  color = "#383970",
  background = CHUSEOK.cardBody,
  fontSize = 31,
}) => (
  <div
    style={{
      position: "absolute",
      ...boxOf(rect),
      backgroundColor: background,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 4,
      fontSize,
      fontWeight: 700,
      lineHeight: 1.35,
      color,
      textAlign: "center",
    }}
  >
    {lines.map((line) => (
      <div key={line}>{line}</div>
    ))}
  </div>
);

/**
 * 1번 포스터의 흰 카드와 같은 모양 — 포스터가 없는 장면(경품·당첨 인원)을
 * 세트 안에 섞여 보이게 그리려고 좌표·모서리·알약 헤더까지 맞췄다.
 */
export const ChuseokCard: React.FC<{
  readonly rect: Rect;
  readonly pill: string;
  readonly pillColor: string;
  readonly children?: React.ReactNode;
}> = ({ rect, pill, pillColor, children }) => (
  <div
    style={{
      position: "absolute",
      ...boxOf(rect),
      borderRadius: 26,
      backgroundColor: "#FBF7F9",
      boxShadow: "0 12px 34px rgba(16,8,38,0.42)",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    }}
  >
    <div
      style={{
        marginTop: 26,
        padding: "9px 32px",
        borderRadius: 26,
        backgroundColor: pillColor,
        color: "#FFFFFF",
        fontSize: 29,
        fontWeight: 800,
        whiteSpace: "nowrap",
      }}
    >
      {pill}
    </div>
    <div
      style={{
        marginTop: 12,
        paddingBottom: 18,
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      {children}
    </div>
  </div>
);
