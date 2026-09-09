import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { AbsoluteFill } from "remotion";
import { Background } from "./Background";
import { CtaScene } from "./CtaScene";
import { HookScene } from "./HookScene";
import { ProgressBar } from "./ProgressBar";
import { TipOneScene } from "./TipOneScene";
import { TipThreeScene } from "./TipThreeScene";
import { TipTwoScene } from "./TipTwoScene";

export const Shorts: React.FC = () => {
  return (
    <AbsoluteFill name="Shorts">
      <Background />
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={90} name="Hook">
          <HookScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 12 })}
        />
        <TransitionSeries.Sequence durationInFrames={105} name="Tip 1">
          <TipOneScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-bottom" })}
          timing={linearTiming({ durationInFrames: 12 })}
        />
        <TransitionSeries.Sequence durationInFrames={105} name="Tip 2">
          <TipTwoScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-bottom" })}
          timing={linearTiming({ durationInFrames: 12 })}
        />
        <TransitionSeries.Sequence durationInFrames={105} name="Tip 3">
          <TipThreeScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 12 })}
        />
        <TransitionSeries.Sequence durationInFrames={90} name="CTA">
          <CtaScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>
      <ProgressBar />
    </AbsoluteFill>
  );
};
