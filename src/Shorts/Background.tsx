import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
} from "remotion";

export const Background: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      name="Background"
      style={{
        backgroundColor: "#0B0D14",
        overflow: "hidden",
      }}
    >
      <Interactive.Div
        name="Glow warm"
        style={{
          position: "absolute",
          top: -260,
          left: -220,
          width: 1100,
          height: 1100,
          borderRadius: 9999,
          backgroundColor: "#FF6B35",
          filter: "blur(220px)",
          opacity: 0.42,
          translate: interpolate(frame, [0, 450], ["0px 0px", "160px 220px"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.45, 0, 0.55, 1),
          }),
        }}
      />
      <Interactive.Div
        name="Glow cool"
        style={{
          position: "absolute",
          bottom: -320,
          right: -260,
          width: 1200,
          height: 1200,
          borderRadius: 9999,
          backgroundColor: "#3D5AFE",
          filter: "blur(240px)",
          opacity: 0.45,
          translate: interpolate(
            frame,
            [0, 450],
            ["0px 0px", "-180px -160px"],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.45, 0, 0.55, 1),
            },
          ),
        }}
      />
      <Interactive.Div
        name="Vignette"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(115% 68% at 50% 42%, rgba(11,13,20,0) 0%, rgba(11,13,20,0.72) 78%, rgba(11,13,20,0.94) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
