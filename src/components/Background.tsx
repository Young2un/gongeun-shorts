import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { COLORS, MOTION, THEME_FX, withAlpha } from "../theme";
import { useAssetExists } from "./useAssetExists";

/** 아주 미세한 노이즈 텍스처 */
const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)'/%3E%3C/svg%3E\")";

/** 프레임마다 흔들리지 않도록 seed 기반 의사 난수를 쓴다 (Math.random 금지) */
const rand = (seed: number) => {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

const EMBER_COUNT = 22;
/** 불티 하나가 아래에서 위로 지나가는 데 걸리는 프레임 */
const EMBER_CYCLE = 320;

/** 위로 천천히 떠오르는 불티 */
const Embers: React.FC<{ readonly frame: number }> = ({ frame }) => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    {new Array(EMBER_COUNT).fill(true).map((_, i) => {
      const seed = i + 1;
      const size = 3 + rand(seed) * 5;
      const offset = rand(seed * 7) * EMBER_CYCLE;
      const progress = ((frame + offset) % EMBER_CYCLE) / EMBER_CYCLE;
      const drift = Math.sin((frame + offset) / 46 + seed) * 26;

      return (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${rand(seed * 3) * 100}%`,
            top: `${105 - progress * 115}%`,
            width: size,
            height: size,
            borderRadius: "50%",
            backgroundColor: COLORS.orange,
            translate: `${drift}px 0px`,
            // 화면 중앙에서 가장 밝고 위아래로 갈수록 사라진다
            opacity:
              Math.sin(progress * Math.PI) *
              0.42 *
              MOTION *
              (0.5 + rand(seed * 11)),
            filter: "blur(1px)",
          }}
        />
      );
    })}
  </AbsoluteFill>
);

/**
 * 공통 배경.
 * `public/shared/assets/bg.jpg` 가 있으면 blur + 어둡게 깔고, 없으면 bg1→bg0 그라데이션.
 * 그 위에 상하 비네트 · 천천히 움직이는 오렌지 글로우 · 불티 · 노이즈를 얹는다.
 */
export const Background: React.FC = () => {
  const hasPhoto = useAssetExists("shared/assets/bg.jpg");
  const frame = useCurrentFrame();

  // 글로우가 좌우로 아주 느리게 흐른다 (한 바퀴 ≈ 20초)
  const drift = Math.sin(frame / 96) * 14 * MOTION;
  const breathe = 0.25 + Math.sin(frame / 70) * 0.07 * MOTION;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
      {hasPhoto ? (
        <AbsoluteFill style={{ overflow: "hidden" }}>
          <Img
            src={staticFile("shared/assets/bg.jpg")}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              // 배경은 어디까지나 질감. 내용과 경쟁하지 않도록 세게 누른다.
              filter: "blur(16px) brightness(0.18) saturate(0.75)",
              // 아주 느린 켄번즈. blur 로 생기는 가장자리 비침도 같이 덮는다
              scale: interpolate(frame, [0, 900], [1.08, 1.16], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.linear,
              }),
            }}
          />
        </AbsoluteFill>
      ) : (
        <AbsoluteFill
          style={{
            background: `linear-gradient(180deg, ${COLORS.bg1} 0%, ${COLORS.bg0} 100%)`,
          }}
        />
      )}

      {/* 사진 배경 위에 테마색 스크림 — 사진이 있어도 톤이 유지된다 */}
      {hasPhoto ? (
        <AbsoluteFill
          style={{ backgroundColor: withAlpha(COLORS.bg1, 0.72) }}
        />
      ) : null}

      {/* 상하 비네트 */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, ${COLORS.bg0} 0%, ${withAlpha(COLORS.bg0, 0)} 28%, ${withAlpha(COLORS.bg0, 0)} 68%, ${COLORS.bg0} 100%)`,
        }}
      />

      {/* 화면 좌우 가장자리에 비치는 따뜻한 오렌지 — 천천히 흐르고 숨 쉰다 */}
      <AbsoluteFill
        style={{
          opacity: breathe,
          background: `radial-gradient(700px 700px at ${-drift}% 100%, ${COLORS.orangeGlow} 0%, transparent 70%)`,
        }}
      />
      <AbsoluteFill
        style={{
          opacity: breathe,
          background: `radial-gradient(700px 700px at ${100 + drift}% 100%, ${COLORS.orangeGlow} 0%, transparent 70%)`,
        }}
      />
      {/* 상단에도 옅게 하나 더 — 화면이 아래만 밝던 걸 완화한다 */}
      <AbsoluteFill
        style={{
          opacity: 0.16 * MOTION,
          background: `radial-gradient(620px 620px at ${50 + drift * 1.4}% -8%, ${COLORS.orangeGlow} 0%, transparent 70%)`,
        }}
      />

      {/* 비스듬히 지나가는 광선 — 무대 조명 느낌 */}
      {THEME_FX.beams
        ? [0, 1, 2].map((i) => (
            <AbsoluteFill
              key={i}
              style={{
                pointerEvents: "none",
                overflow: "hidden",
                opacity: 0.55,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "-30%",
                  bottom: "-30%",
                  width: 240 + i * 90,
                  background: `linear-gradient(90deg, transparent 0%, ${COLORS.beam} 50%, transparent 100%)`,
                  transform: "rotate(14deg)",
                  filter: "blur(28px)",
                  left: `${8 + i * 33 + Math.sin(frame / (150 + i * 40) + i) * 6 * MOTION}%`,
                }}
              />
            </AbsoluteFill>
          ))
        : null}

      {MOTION > 0 ? <Embers frame={frame} /> : null}

      <AbsoluteFill style={{ opacity: 0.04, backgroundImage: NOISE }} />
    </AbsoluteFill>
  );
};
