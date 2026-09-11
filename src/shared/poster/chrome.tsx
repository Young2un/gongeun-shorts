import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { MARGIN, MOTION, shade } from "../../theme";
import { TITLE_FONT } from "../../typography";
import { POSTER } from "./theme";

/**
 * 받은 포스터(public/img/0911/*.png)의 조형 언어를 코드로 옮긴 부품들.
 * 포스터가 없는 장면을 그릴 때 같은 인상이 나오게 하는 것이 목적이다.
 *
 * 공통 규칙:
 *   - 밝은 은색 테크 배경 · 진한 잉크 글자 · 오렌지는 강조에만
 *   - 카드는 좌상단/우하단 모서리를 비스듬히 자르고 그 자리에 오렌지 삼각형
 *   - 헤더 문구 양옆에 오렌지 더블 셰브론
 */

/** 밝은 은색 테크 배경 — 비스듬한 패널 · 오렌지 스트릭 · 큰 워터마크 원 */
export const PosterBackground: React.FC = () => {
  const frame = useCurrentFrame();

  // 아주 느리게 숨 쉬는 빛 (MOTION=0 이면 멈춘다)
  const breathe = 0.5 + Math.sin(frame / 46) * 0.5 * MOTION;

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, ${POSTER.bg0} 0%, ${POSTER.bg1} 58%, ${POSTER.bg2} 100%)`,
        overflow: "hidden",
      }}
    >
      {/* 비스듬한 금속 패널 — 아주 옅은 명암만 */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(108deg,
            rgba(255,255,255,0.55) 0%,
            rgba(255,255,255,0) 26%,
            rgba(30,42,51,0.05) 44%,
            rgba(255,255,255,0.5) 62%,
            rgba(30,42,51,0.06) 100%)`,
        }}
      />

      {/* 커다란 워터마크 원 — 포스터 가운데 뒤에 깔린 옅은 링 */}
      <div
        style={{
          position: "absolute",
          left: 300,
          top: 560,
          width: 700,
          height: 700,
          borderRadius: "50%",
          border: `44px solid rgba(30,42,51,0.045)`,
        }}
      />

      {/* 오렌지 스트릭 (우상단 · 좌측) */}
      <div
        style={{
          position: "absolute",
          right: -60,
          top: -120,
          width: 150,
          height: 620,
          transform: "skewX(-22deg)",
          background: `linear-gradient(180deg, ${POSTER.orange} 0%, rgba(246,90,1,0) 100%)`,
          opacity: 0.32 + breathe * 0.1,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: -40,
          top: 300,
          width: 70,
          height: 420,
          transform: "skewX(-22deg)",
          background: `linear-gradient(180deg, rgba(246,90,1,0) 0%, ${POSTER.orange} 100%)`,
          opacity: 0.22,
        }}
      />

      {/* 하단 은색 바닥 — 포스터의 "바닥에 놓인" 느낌 */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 520,
          background: `linear-gradient(180deg, rgba(217,214,215,0) 0%, ${POSTER.bg2} 100%)`,
        }}
      />
    </AbsoluteFill>
  );
};

/** 오렌지 더블 셰브론 (헤더 양옆 장식) */
export const Chevrons: React.FC<{ readonly flip?: boolean }> = ({ flip }) => (
  <span
    style={{
      display: "inline-flex",
      gap: 6,
      transform: flip ? "scaleX(-1)" : undefined,
    }}
  >
    {[0, 1].map((i) => (
      <span
        key={i}
        style={{
          width: 10,
          height: 26,
          backgroundColor: POSTER.orange,
          transform: "skewX(-20deg)",
          opacity: i === 0 ? 1 : 0.55,
        }}
      />
    ))}
  </span>
);

/** 좌상단 소제목 줄: 오렌지 마크 + 세로 구분선 + 라벨 */
export const PosterKicker: React.FC<{ readonly text: string }> = ({ text }) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        position: "absolute",
        left: MARGIN,
        top: 54,
        display: "flex",
        alignItems: "center",
        gap: 22,
        opacity: interpolate(frame, [0, 14], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
      }}
    >
      <div
        style={{
          width: 62,
          height: 62,
          borderRadius: "50%",
          backgroundColor: POSTER.ink,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
        }}
      >
        <Chevrons />
      </div>
      <div style={{ width: 3, height: 44, backgroundColor: POSTER.ink }} />
      <span
        style={{
          fontSize: 38,
          fontWeight: 800,
          letterSpacing: -0.5,
          color: POSTER.ink,
        }}
      >
        {text}
      </span>
    </div>
  );
};

/** 큰 제목 두 줄 + 양옆에 선이 붙은 부제 */
export const PosterTitle: React.FC<{
  readonly lines: readonly string[];
  /** 오렌지로 강조할 구절 (각 줄 안에 실제로 있어야 한다) */
  readonly em?: string;
  readonly subtitle: string;
  readonly size?: number;
  readonly top?: number;
}> = ({ lines, em, subtitle, size = 112, top = 178 }) => {
  const frame = useCurrentFrame();

  const paint = (line: string) => {
    if (!em || !line.includes(em)) {
      return line;
    }
    const [before, ...rest] = line.split(em);
    return (
      <>
        {before}
        <span style={{ color: POSTER.orange }}>{em}</span>
        {rest.join(em)}
      </>
    );
  };

  return (
    <div
      style={{
        position: "absolute",
        left: MARGIN,
        right: MARGIN,
        top,
        textAlign: "center",
      }}
    >
      {lines.map((line, i) => (
        <div
          key={line}
          style={{
            fontFamily: TITLE_FONT,
            fontSize: size,
            fontWeight: 900,
            lineHeight: 1.16,
            letterSpacing: -2,
            color: POSTER.ink,
            whiteSpace: "nowrap",
            textShadow: "0 3px 0 rgba(255,255,255,0.85)",
            opacity: interpolate(frame, [i * 4, i * 4 + 12], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
            translate: interpolate(
              frame,
              [i * 4, i * 4 + 26],
              ["0px 40px", "0px 0px"],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.spring({ damping: 13 }),
              },
            ),
          }}
        >
          {paint(line)}
        </div>
      ))}

      <div
        style={{
          marginTop: 26,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 22,
          opacity: interpolate(frame, [10, 24], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        <div style={{ width: 54, height: 4, backgroundColor: POSTER.ink }} />
        <span
          style={{
            fontSize: 44,
            fontWeight: 800,
            letterSpacing: -0.5,
            color: POSTER.ink,
            whiteSpace: "nowrap",
          }}
        >
          {subtitle}
        </span>
        <div style={{ width: 54, height: 4, backgroundColor: POSTER.ink }} />
      </div>
    </div>
  );
};

/** 좌상단·우하단 모서리를 자른 흰 카드. 자른 자리에 오렌지 삼각형이 들어간다. */
export const NotchedCard: React.FC<{
  readonly delay: number;
  readonly style?: React.CSSProperties;
  readonly children?: React.ReactNode;
}> = ({ delay, style, children }) => {
  const frame = useCurrentFrame();
  const cut = 46;

  const appear = {
    opacity: interpolate(frame, [delay, delay + 12], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    }),
    translate: interpolate(
      frame,
      [delay, delay + 24],
      ["0px 40px", "0px 0px"],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.spring({ damping: 18 }),
      },
    ),
  };

  const clip = `polygon(${cut}px 0, 100% 0, 100% calc(100% - ${cut}px), calc(100% - ${cut}px) 100%, 0 100%, 0 ${cut}px)`;

  return (
    <div style={{ position: "relative", ...appear, ...style }}>
      {/* 오렌지 코너 — 카드보다 살짝 바깥으로 나와 잘린 자리를 채운다 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: POSTER.orange,
          clipPath: `polygon(0 0, ${cut + 14}px 0, 0 ${cut + 14}px)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: POSTER.orange,
          clipPath: `polygon(100% 100%, 100% calc(100% - ${cut + 14}px), calc(100% - ${cut + 14}px) 100%)`,
        }}
      />
      <div
        style={{
          position: "relative",
          backgroundColor: POSTER.card,
          border: `1px solid ${POSTER.cardBorder}`,
          clipPath: clip,
          boxShadow: "0 18px 44px rgba(30,42,51,0.16)",
        }}
      >
        {children}
      </div>
    </div>
  );
};

/** 카드 안 헤더: 양옆 셰브론 사이의 굵은 잉크 문구 */
export const CardHeader: React.FC<{ readonly text: string }> = ({ text }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 20,
      fontSize: 46,
      fontWeight: 900,
      letterSpacing: -1,
      color: POSTER.ink,
    }}
  >
    <Chevrons flip />
    <span>{text}</span>
    <Chevrons />
  </div>
);

/**
 * 흰 카드 위에 흰 글자를 얹어야 하는 헤더 바용으로, 의미색을 충분히 어둡게 만든다.
 *
 * 고정 비율로 어둡게 하면 안 된다 — 치지직 그린(#00FFA3)은 오렌지(#F65A01)보다
 * 훨씬 밝아서 같은 비율로 낮추면 흰 글자가 안 읽힌다. 그래서 색마다
 * 체감 밝기를 재서 같은 수준까지 내린다.
 */
const forWhiteText = (hex: string, extra = 0) => {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  const luma = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  const amount = Math.min(0.9, Math.max(0, 1 - 0.34 / Math.max(luma, 0.01)));
  return shade(hex, Math.min(0.92, amount + extra));
};

/**
 * 헤더 바가 달린 라이트 테마 카드.
 *
 * 배치는 기본(다크) 테마의 `components/Card` 와 같다 — 전체 폭 헤더 바 + 본문.
 * 다른 영상들과 아웃트로 레이아웃을 맞추면서 색만 포스터 톤으로 바꾸려고 만들었다.
 * 모서리 노치와 오렌지 삼각형은 포스터 카드와 같은 모양으로 유지한다.
 */
export const PosterCard: React.FC<{
  readonly delay: number;
  /** 헤더 바 색 (의미색). 흰 글자가 읽히도록 자동으로 어두워진다. */
  readonly accent: string;
  readonly header: string;
  readonly headerSize?: number;
  readonly padding?: number;
  readonly style?: React.CSSProperties;
  readonly children?: React.ReactNode;
}> = ({
  delay,
  accent,
  header,
  headerSize = 40,
  padding = 42,
  style,
  children,
}) => {
  const frame = useCurrentFrame();

  return (
    <NotchedCard delay={delay} style={style}>
      <div style={{ position: "relative", overflow: "hidden" }}>
        {/* 등장 직후 따뜻한 빛이 한 번 훑고 지나간다.
            흰 카드라 흰 스윕은 보이지 않아서 오렌지 기운을 섞는다. */}
        {MOTION > 0 ? (
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              width: "38%",
              zIndex: 1,
              pointerEvents: "none",
              background:
                "linear-gradient(100deg, transparent 0%, rgba(246,90,1,0.12) 50%, transparent 100%)",
              transform: "skewX(-16deg)",
              left: interpolate(frame, [delay + 6, delay + 42], ["-45%", "135%"], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(0.3, 0, 0.2, 1),
              }),
            }}
          />
        ) : null}

        <div style={{ height: Math.max(64, headerSize + 24), overflow: "hidden" }}>
          <div
            style={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              padding: "0 26px",
              background: `linear-gradient(100deg, ${forWhiteText(accent)} 0%, ${forWhiteText(accent, 0.22)} 100%)`,
              borderBottom: `3px solid ${accent}`,
              whiteSpace: "nowrap",
              color: "#FFFFFF",
              fontSize: headerSize,
              fontWeight: 800,
              letterSpacing: -0.5,
              width: interpolate(frame, [delay + 6, delay + 22], ["0%", "100%"], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(0.16, 1, 0.3, 1),
              }),
            }}
          >
            {header}
          </div>
        </div>

        <div style={{ padding }}>{children}</div>
      </div>
    </NotchedCard>
  );
};

/**
 * 카드 왼쪽 끝에 붙는 어두운 아이콘 타일.
 * 포스터의 "공식 설명 / 수치 변경 발표 없음" 행 카드가 쓰는 모양이다.
 * 카드의 clipPath 안에 들어가므로 좌상단 모서리가 카드와 같이 잘린다.
 */
export const IconTile: React.FC<{
  readonly width?: number;
  readonly children?: React.ReactNode;
}> = ({ width = 168, children }) => (
  <div
    style={{
      width,
      alignSelf: "stretch",
      flexShrink: 0,
      backgroundColor: POSTER.slate,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 18,
      position: "relative",
    }}
  >
    {children}
    {/* 타일 우하단 오렌지 코너 — 포스터와 같은 디테일 */}
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: POSTER.orange,
        clipPath: "polygon(100% 100%, 100% calc(100% - 26px), calc(100% - 26px) 100%)",
      }}
    />
  </div>
);

/**
 * 화면 가장자리의 옅은 회색 대문자 장식.
 * 좌측 블록은 카드가 위로 올라오는 배치에서는 겹치므로 끌 수 있다.
 */
export const EdgeCaps: React.FC<{ readonly left?: boolean }> = ({
  left = true,
}) => (
  <>
    {left ? (
    <div
      style={{
        position: "absolute",
        left: 24,
        top: 880,
        fontSize: 26,
        fontWeight: 800,
        lineHeight: 1.35,
        letterSpacing: 1,
        color: POSTER.faint,
      }}
    >
      HEROES
      <br />
      MAKE A
      <br />
      BRIGHTER
      <br />
      TOMORROW
    </div>
    ) : null}

    <div
      style={{
        position: "absolute",
        right: 34,
        top: 58,
        textAlign: "right",
        fontSize: 24,
        fontWeight: 800,
        lineHeight: 1.35,
        letterSpacing: 1,
        color: POSTER.faint,
      }}
    >
      A<br />
      BRIGHTER
      <br />
      TOMORROW
      <br />
      TOGETHER
    </div>
  </>
);

/** 좌하단 워드마크 줄 (포스터의 "OVERWATCH //// A MORE CONNECTED WORLD" 자리) */
export const PosterFooter: React.FC<{
  readonly label?: string;
  readonly lines?: readonly string[];
  readonly top?: number;
}> = ({
  label = "OVERWATCH",
  lines = ["A MORE", "CONNECTED WORLD"],
  top = 1580,
}) => (
  <div
    style={{
      position: "absolute",
      left: MARGIN,
      top,
      fontSize: 24,
      fontWeight: 800,
      lineHeight: 1.4,
      letterSpacing: 1.5,
      color: POSTER.faint,
    }}
  >
    <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
      {label}
      <span style={{ display: "inline-flex", gap: 4 }}>
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            style={{
              width: 6,
              height: 16,
              backgroundColor: POSTER.faint,
              transform: "skewX(-20deg)",
            }}
          />
        ))}
      </span>
    </span>
    {lines.map((line) => (
      <React.Fragment key={line}>
        <br />
        {line}
      </React.Fragment>
    ))}
  </div>
);
