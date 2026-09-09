import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { bodyFont, displayFont } from "../fonts";

export const CtaScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      name="CTA"
      style={{
        justifyContent: "center",
        alignItems: "center",
        paddingLeft: 88,
        paddingRight: 88,
        paddingTop: 100,
        paddingBottom: 100,
      }}
    >
      <Interactive.Div
        name="CTA headline"
        style={{
          fontFamily: displayFont,
          fontSize: 140,
          lineHeight: 1.15,
          color: "#FFFFFF",
          textAlign: "center",
          scale: interpolate(frame, [0, 0.9 * fps], [0.8, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.spring({ damping: 200 }),
            output: "perceptual-scale",
          }),
          opacity: interpolate(frame, [0, 14], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        하나만 골라
        <br />
        오늘 적용해보기
      </Interactive.Div>
      <Interactive.Div
        name="CTA button"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: bodyFont,
          fontWeight: 900,
          fontSize: 54,
          color: "#0B0D14",
          backgroundColor: "#FFD166",
          borderRadius: 9999,
          paddingLeft: 68,
          paddingRight: 68,
          paddingTop: 32,
          paddingBottom: 32,
          marginTop: 72,
          opacity: interpolate(frame, [0.8 * fps, 1.4 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
          scale: interpolate(frame, [0.8 * fps, 1.6 * fps], [0.82, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.spring({ damping: 200 }),
            output: "perceptual-scale",
          }),
        }}
      >
        저장하고 다시 보기
      </Interactive.Div>
      <Interactive.Div
        name="Handle"
        style={{
          fontFamily: bodyFont,
          fontWeight: 700,
          fontSize: 44,
          letterSpacing: 4,
          color: "rgba(255,255,255,0.6)",
          marginTop: 56,
          opacity: interpolate(frame, [1.4 * fps, 2 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        @gongeun
      </Interactive.Div>
    </AbsoluteFill>
  );
};
