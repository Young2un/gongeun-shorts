import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { bodyFont, displayFont } from "../fonts";

export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      name="Hook"
      style={{
        justifyContent: "center",
        alignItems: "center",
        paddingLeft: 80,
        paddingRight: 80,
        paddingTop: 100,
        paddingBottom: 100,
      }}
    >
      <Interactive.Div
        name="Eyebrow"
        style={{
          fontFamily: bodyFont,
          fontWeight: 700,
          fontSize: 46,
          letterSpacing: 12,
          color: "#FFD166",
          marginBottom: 44,
          opacity: interpolate(frame, [0, 12], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
          translate: interpolate(frame, [0, 20], ["0px 28px", "0px 0px"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        30초 요약
      </Interactive.Div>
      <Interactive.Div
        name="Headline"
        style={{
          fontFamily: displayFont,
          fontSize: 156,
          lineHeight: 1.12,
          color: "#FFFFFF",
          textAlign: "center",
          opacity: interpolate(frame, [6, 20], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
          scale: interpolate(frame, [6, 1 * fps], [0.86, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.spring({ damping: 200 }),
            output: "perceptual-scale",
          }),
        }}
      >
        쇼츠 조회수
        <br />
        터지는 3가지
      </Interactive.Div>
      <Interactive.Div
        name="Accent bar"
        style={{
          height: 14,
          borderRadius: 9999,
          backgroundColor: "#FFD166",
          marginTop: 52,
          width: interpolate(frame, [18, 1.4 * fps], ["0px", "420px"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      />
      <Interactive.Div
        name="Subline"
        style={{
          fontFamily: bodyFont,
          fontWeight: 400,
          fontSize: 50,
          lineHeight: 1.5,
          color: "rgba(255,255,255,0.72)",
          textAlign: "center",
          marginTop: 52,
          opacity: interpolate(frame, [1.2 * fps, 1.9 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
          translate: interpolate(
            frame,
            [1.2 * fps, 1.9 * fps],
            ["0px 24px", "0px 0px"],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            },
          ),
        }}
      >
        끝까지 보면 하나는 오늘 바로 적용 가능
      </Interactive.Div>
    </AbsoluteFill>
  );
};
