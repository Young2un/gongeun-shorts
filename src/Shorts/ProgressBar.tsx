import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill name="Progress" style={{ justifyContent: "flex-end" }}>
      <Interactive.Div
        name="Progress track"
        style={{
          height: 12,
          marginLeft: 80,
          marginRight: 80,
          marginBottom: 100,
          borderRadius: 9999,
          backgroundColor: "rgba(255,255,255,0.16)",
        }}
      >
        <Interactive.Div
          name="Progress fill"
          style={{
            height: 12,
            borderRadius: 9999,
            backgroundColor: "#FFD166",
            width: interpolate(
              frame,
              [0, durationInFrames - 1],
              ["0%", "100%"],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.linear,
              },
            ),
          }}
        />
      </Interactive.Div>
    </AbsoluteFill>
  );
};
