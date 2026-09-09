import "./index.css";
import { Composition, Folder } from "remotion";
import { CtaScene } from "./Shorts/CtaScene";
import { HookScene } from "./Shorts/HookScene";
import { Shorts } from "./Shorts/Shorts";
import { TipOneScene } from "./Shorts/TipOneScene";
import { TipThreeScene } from "./Shorts/TipThreeScene";
import { TipTwoScene } from "./Shorts/TipTwoScene";
import { ChannelOutro, type ChannelOutroProps } from "./shared/ChannelOutro";
import { FPS, HEIGHT, WIDTH } from "./theme";
import {
  fallbackTimings,
  makeSceneMetadata,
  makeVideoMetadata,
  sceneDefaults,
  totalDurationInFrames,
  type SceneProps,
  type VideoConfig,
} from "./timing";
import { BlizzconNews } from "./videos/blizzcon-news";
import { VIDEO as BLIZZCON } from "./videos/blizzcon-news/meta";
import { Scene1Headline } from "./videos/blizzcon-news/scenes/Scene1Headline";
import { Scene2Delay } from "./videos/blizzcon-news/scenes/Scene2Delay";
import { Scene3Program } from "./videos/blizzcon-news/scenes/Scene3Program";
import { Scene4Questwatch } from "./videos/blizzcon-news/scenes/Scene4Questwatch";
import { Scene5Opinion } from "./videos/blizzcon-news/scenes/Scene5Opinion";
import { S4Midseason } from "./videos/s4-midseason";
import { VIDEO as S4MID } from "./videos/s4-midseason/meta";
import { Scene1Intro } from "./videos/s4-midseason/scenes/Scene1Intro";
import { Scene2Event } from "./videos/s4-midseason/scenes/Scene2Event";
import { Scene3Tank } from "./videos/s4-midseason/scenes/Scene3Tank";
import { Scene4Damage } from "./videos/s4-midseason/scenes/Scene4Damage";
import { Scene5Support } from "./videos/s4-midseason/scenes/Scene5Support";
import { Scene6Fixes } from "./videos/s4-midseason/scenes/Scene6Fixes";
import { TeamDriveShorts } from "./videos/team-drive";
import { VIDEO as TEAM_DRIVE } from "./videos/team-drive/meta";
import { Scene1Hook } from "./videos/team-drive/scenes/Scene1Hook";
import { Scene2AutoParty } from "./videos/team-drive/scenes/Scene2AutoParty";
import { Scene3Reputation } from "./videos/team-drive/scenes/Scene3Reputation";
import { Scene4FinalTrial } from "./videos/team-drive/scenes/Scene4FinalTrial";
import { Scene5Rewards } from "./videos/team-drive/scenes/Scene5Rewards";
import { Scene6Schedule } from "./videos/team-drive/scenes/Scene6Schedule";
import { Scene7Opinion } from "./videos/team-drive/scenes/Scene7Opinion";

/** 장면 하나짜리 컴포지션 등록을 줄여 쓰기 위한 헬퍼 */
const SceneComposition: React.FC<{
  readonly video: VideoConfig;
  readonly index: number;
  readonly id: string;
  readonly component: React.ComponentType<SceneProps>;
}> = ({ video, index, id, component }) => (
  <Composition
    id={id}
    component={component}
    durationInFrames={fallbackTimings(video)[index].durationInFrames}
    fps={FPS}
    width={WIDTH}
    height={HEIGHT}
    defaultProps={sceneDefaults(video, index)}
    calculateMetadata={makeSceneMetadata(video, index)}
  />
);

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id={TEAM_DRIVE.compositionId}
        component={TeamDriveShorts}
        durationInFrames={totalDurationInFrames(fallbackTimings(TEAM_DRIVE))}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{ scenes: fallbackTimings(TEAM_DRIVE) }}
        calculateMetadata={makeVideoMetadata(TEAM_DRIVE)}
      />

      <Composition
        id={BLIZZCON.compositionId}
        component={BlizzconNews}
        durationInFrames={totalDurationInFrames(fallbackTimings(BLIZZCON))}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{ scenes: fallbackTimings(BLIZZCON) }}
        calculateMetadata={makeVideoMetadata(BLIZZCON)}
      />

      <Composition
        id={S4MID.compositionId}
        component={S4Midseason}
        durationInFrames={totalDurationInFrames(fallbackTimings(S4MID))}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{ scenes: fallbackTimings(S4MID) }}
        calculateMetadata={makeVideoMetadata(S4MID)}
      />

      {/* 다른 영상에도 그대로 붙여 쓰는 채널 홍보 아웃트로 (단독 렌더 가능) */}
      <Composition
        id="ChannelOutro"
        component={ChannelOutro}
        durationInFrames={
          fallbackTimings(TEAM_DRIVE)[TEAM_DRIVE.script.length - 1]
            .durationInFrames
        }
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{
          videoId: TEAM_DRIVE.id,
          ...sceneDefaults(TEAM_DRIVE, TEAM_DRIVE.script.length - 1),
        }}
        calculateMetadata={makeSceneMetadata<ChannelOutroProps>(
          TEAM_DRIVE,
          TEAM_DRIVE.script.length - 1,
        )}
      />

      <Folder name="S4Midseason-Scenes">
        <SceneComposition
          video={S4MID}
          index={0}
          id="S4-1-Intro"
          component={Scene1Intro}
        />
        <SceneComposition
          video={S4MID}
          index={1}
          id="S4-2-Event"
          component={Scene2Event}
        />
        <SceneComposition
          video={S4MID}
          index={2}
          id="S4-3-Tank"
          component={Scene3Tank}
        />
        <SceneComposition
          video={S4MID}
          index={3}
          id="S4-4-Damage"
          component={Scene4Damage}
        />
        <SceneComposition
          video={S4MID}
          index={4}
          id="S4-5-Support"
          component={Scene5Support}
        />
        <SceneComposition
          video={S4MID}
          index={5}
          id="S4-6-Fixes"
          component={Scene6Fixes}
        />
      </Folder>

      <Folder name="BlizzconNews-Scenes">
        <SceneComposition
          video={BLIZZCON}
          index={0}
          id="BN-1-Headline"
          component={Scene1Headline}
        />
        <SceneComposition
          video={BLIZZCON}
          index={1}
          id="BN-2-Delay"
          component={Scene2Delay}
        />
        <SceneComposition
          video={BLIZZCON}
          index={2}
          id="BN-3-Program"
          component={Scene3Program}
        />
        <SceneComposition
          video={BLIZZCON}
          index={3}
          id="BN-4-Questwatch"
          component={Scene4Questwatch}
        />
        <SceneComposition
          video={BLIZZCON}
          index={4}
          id="BN-5-Opinion"
          component={Scene5Opinion}
        />
      </Folder>

      <Folder name="TeamDrive-Scenes">
        <SceneComposition
          video={TEAM_DRIVE}
          index={0}
          id="TD-1-Hook"
          component={Scene1Hook}
        />
        <SceneComposition
          video={TEAM_DRIVE}
          index={1}
          id="TD-2-AutoParty"
          component={Scene2AutoParty}
        />
        <SceneComposition
          video={TEAM_DRIVE}
          index={2}
          id="TD-3-Reputation"
          component={Scene3Reputation}
        />
        <SceneComposition
          video={TEAM_DRIVE}
          index={3}
          id="TD-4-FinalTrial"
          component={Scene4FinalTrial}
        />
        <SceneComposition
          video={TEAM_DRIVE}
          index={4}
          id="TD-5-Rewards"
          component={Scene5Rewards}
        />
        <SceneComposition
          video={TEAM_DRIVE}
          index={5}
          id="TD-6-Schedule"
          component={Scene6Schedule}
        />
        <SceneComposition
          video={TEAM_DRIVE}
          index={6}
          id="TD-7-Opinion"
          component={Scene7Opinion}
        />
      </Folder>

      {/* 이전 세션에서 만든 다른 컴포지션 */}
      <Composition
        id="Shorts"
        component={Shorts}
        durationInFrames={447}
        fps={30}
        width={1080}
        height={1920}
      />
      <Folder name="Shorts-Scenes">
        <Composition
          id="Hook"
          component={HookScene}
          durationInFrames={90}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="Tip1"
          component={TipOneScene}
          durationInFrames={105}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="Tip2"
          component={TipTwoScene}
          durationInFrames={105}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="Tip3"
          component={TipThreeScene}
          durationInFrames={105}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="CTA"
          component={CtaScene}
          durationInFrames={90}
          fps={30}
          width={1080}
          height={1920}
        />
      </Folder>
    </>
  );
};
