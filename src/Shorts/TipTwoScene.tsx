import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { bodyFont, displayFont } from "../fonts";

export const TipTwoScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      name="TipTwoScene"
      style={{
        justifyContent: "center",
        paddingLeft: 88,
        paddingRight: 88,
        paddingTop: 100,
        paddingBottom: 100,
      }}
    >
      <Interactive.Div
        name="Step badge"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: 168,
          height: 168,
          borderRadius: 48,
          backgroundColor: "#4ADE80",
          color: "#0B0D14",
          fontFamily: displayFont,
          fontSize: 96,
          marginBottom: 56,
          scale: interpolate(frame, [0, 0.8 * fps], [0.4, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.spring({ damping: 200 }),
            output: "perceptual-scale",
          }),
          rotate: interpolate(frame, [0, 0.8 * fps], ["-14deg", "0deg"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.spring({ damping: 200 }),
          }),
        }}
      >
        2
      </Interactive.Div>
      <Interactive.Div
        name="Title"
        style={{
          fontFamily: displayFont,
          fontSize: 128,
          lineHeight: 1.16,
          color: "#FFFFFF",
          opacity: interpolate(frame, [8, 0.9 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
          translate: interpolate(
            frame,
            [8, 0.9 * fps],
            ["0px 40px", "0px 0px"],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            },
          ),
        }}
      >
        자막은
        <br />
        화면 중앙에
      </Interactive.Div>
      <Interactive.Div
        name="Body"
        style={{
          fontFamily: bodyFont,
          fontWeight: 400,
          fontSize: 52,
          lineHeight: 1.55,
          color: "rgba(255,255,255,0.76)",
          marginTop: 44,
          opacity: interpolate(frame, [0.7 * fps, 1.4 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
          translate: interpolate(
            frame,
            [0.7 * fps, 1.4 * fps],
            ["0px 28px", "0px 0px"],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            },
          ),
        }}
      >
        하단 자막은 UI에 가립니다. 세로 중앙 상단 60% 지점이 가장 오래 읽힙니다.
      </Interactive.Div>
      <Interactive.Div
        name="Tag"
        style={{
          alignSelf: "flex-start",
          fontFamily: bodyFont,
          fontWeight: 700,
          fontSize: 40,
          letterSpacing: 2,
          color: "#4ADE80",
          borderWidth: 3,
          borderStyle: "solid",
          borderColor: "#4ADE80",
          borderRadius: 9999,
          paddingLeft: 34,
          paddingRight: 34,
          paddingTop: 16,
          paddingBottom: 16,
          marginTop: 56,
          opacity: interpolate(frame, [1.2 * fps, 1.8 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
          scale: interpolate(frame, [1.2 * fps, 1.8 * fps], [0.9, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.spring({ damping: 200 }),
            output: "perceptual-scale",
          }),
        }}
      >
        #가독성
      </Interactive.Div>
    </AbsoluteFill>
  );
};
