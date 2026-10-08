import "./index.css";
import { Composition, Folder } from "remotion";
import { CtaScene } from "./Shorts/CtaScene";
import { HookScene } from "./Shorts/HookScene";
import { Shorts } from "./Shorts/Shorts";
import { TipOneScene } from "./Shorts/TipOneScene";
import { TipThreeScene } from "./Shorts/TipThreeScene";
import { TipTwoScene } from "./Shorts/TipTwoScene";
import { ChannelOutro, type ChannelOutroProps } from "./shared/ChannelOutro";
import { PosterOutro } from "./shared/poster/PosterOutro";
import { SpeedUp, speedUpMetadata } from "./shared/SpeedUp";
import {
  PosterScene,
  type PosterSceneProps,
} from "./shared/poster/PosterScene";
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
import { ChuseokDmon0917 } from "./videos/chuseok-dmon-0917";
import {
  ChuseokDmon0918,
  ChuseokPosterOutro,
  POSTER_SCENE_COMPOSITIONS as CHUSEOK_POSTER_SCENES,
} from "./videos/chuseok-dmon-0917/poster";
import { VIDEO_POSTER as CHUSEOK_POSTER } from "./videos/chuseok-dmon-0917/poster/meta";
import { Scene3Prize as ChuseokPosterScene3 } from "./videos/chuseok-dmon-0917/poster/Scene3Prize";
import { VIDEO as CHUSEOK } from "./videos/chuseok-dmon-0917/meta";
import { Scene1Hook as ChuseokScene1 } from "./videos/chuseok-dmon-0917/scenes/Scene1Hook";
import { Scene2Howto as ChuseokScene2 } from "./videos/chuseok-dmon-0917/scenes/Scene2Howto";
import { Scene3Prize as ChuseokScene3 } from "./videos/chuseok-dmon-0917/scenes/Scene3Prize";
import { Scene4Caution as ChuseokScene4 } from "./videos/chuseok-dmon-0917/scenes/Scene4Caution";
import { Scene5Opinion as ChuseokScene5 } from "./videos/chuseok-dmon-0917/scenes/Scene5Opinion";
import { Hotfix0910 } from "./videos/hotfix-0910";
import {
  SCENE_META as HOTFIX_SCENES,
  VIDEO as HOTFIX,
} from "./videos/hotfix-0910/meta";
import { VIDEO as BLIZZCON } from "./videos/blizzcon-news/meta";
import { OwwcKorea0916 } from "./videos/owwc-korea-0916";
import {
  ACCENT as OWWC_ACCENT,
  KEN_BURNS as OWWC_KEN_BURNS,
  LAYOUT as OWWC_LAYOUT,
  SCENE_META as OWWC_SCENES,
  VIDEO as OWWC,
} from "./videos/owwc-korea-0916/meta";
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
import {
  RICH_SCENES as S5_RICH_SCENES,
  S5Launch1007,
  S5Launch1007Rich,
  SCENES as S5_SCENES,
} from "./videos/s5-launch-1007";
import { VIDEO as S5 } from "./videos/s5-launch-1007/meta";
import {
  RICH_SCENES as S5H_RICH_SCENES,
  S5Heroes1007,
  S5Heroes1007Rich,
  SCENES as S5H_SCENES,
} from "./videos/s5-heroes-1007";
import { VIDEO as S5H } from "./videos/s5-heroes-1007/meta";

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

      <Composition
        id={HOTFIX.compositionId}
        component={Hotfix0910}
        durationInFrames={totalDurationInFrames(fallbackTimings(HOTFIX))}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{ scenes: fallbackTimings(HOTFIX) }}
        calculateMetadata={makeVideoMetadata(HOTFIX)}
      />

      <Composition
        id={CHUSEOK.compositionId}
        component={ChuseokDmon0917}
        durationInFrames={totalDurationInFrames(fallbackTimings(CHUSEOK))}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{ scenes: fallbackTimings(CHUSEOK) }}
        calculateMetadata={makeVideoMetadata(CHUSEOK)}
      />

      <Composition
        id={CHUSEOK_POSTER.compositionId}
        component={ChuseokDmon0918}
        durationInFrames={totalDurationInFrames(
          fallbackTimings(CHUSEOK_POSTER),
        )}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{ scenes: fallbackTimings(CHUSEOK_POSTER) }}
        calculateMetadata={makeVideoMetadata(CHUSEOK_POSTER)}
      />

      <Composition
        id={OWWC.compositionId}
        component={OwwcKorea0916}
        durationInFrames={totalDurationInFrames(fallbackTimings(OWWC))}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{ scenes: fallbackTimings(OWWC) }}
        calculateMetadata={makeVideoMetadata(OWWC)}
      />

      <Composition
        id={S5.compositionId}
        component={S5Launch1007}
        durationInFrames={totalDurationInFrames(fallbackTimings(S5))}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{ scenes: fallbackTimings(S5) }}
        calculateMetadata={makeVideoMetadata(S5)}
      />

      <Composition
        id={`${S5.compositionId}Rich`}
        component={S5Launch1007Rich}
        durationInFrames={totalDurationInFrames(fallbackTimings(S5))}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{ scenes: fallbackTimings(S5) }}
        calculateMetadata={makeVideoMetadata(S5)}
      />

      <Composition
        id={S5H.compositionId}
        component={S5Heroes1007}
        durationInFrames={totalDurationInFrames(fallbackTimings(S5H))}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{ scenes: fallbackTimings(S5H) }}
        calculateMetadata={makeVideoMetadata(S5H)}
      />

      <Composition
        id={`${S5H.compositionId}Rich`}
        component={S5Heroes1007Rich}
        durationInFrames={totalDurationInFrames(fallbackTimings(S5H))}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{ scenes: fallbackTimings(S5H) }}
        calculateMetadata={makeVideoMetadata(S5H)}
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

      <Folder name="S5Launch1007-Scenes">
        {S5_SCENES.map((scene, i) => (
          <SceneComposition
            key={scene.id}
            video={S5}
            index={i}
            id={scene.id}
            component={scene.Component}
          />
        ))}
      </Folder>

      <Folder name="S5Heroes1007-Scenes">
        {S5H_SCENES.map((scene, i) => (
          <SceneComposition
            key={scene.id}
            video={S5H}
            index={i}
            id={scene.id}
            component={scene.Component}
          />
        ))}
      </Folder>

      <Folder name="S5Heroes1007Rich-Scenes">
        {S5H_RICH_SCENES.map((scene, i) => (
          <SceneComposition
            key={scene.id}
            video={S5H}
            index={i}
            id={scene.id}
            component={scene.Component}
          />
        ))}
      </Folder>

      <Folder name="S5Launch1007Rich-Scenes">
        {S5_RICH_SCENES.map((scene, i) => (
          <SceneComposition
            key={scene.id}
            video={S5}
            index={i}
            id={scene.id}
            component={scene.Component}
          />
        ))}
      </Folder>

      <Folder name="ChuseokDmon0918-Scenes">
        {CHUSEOK_POSTER_SCENES.map((scene) => (
          <SceneComposition
            key={scene.id}
            video={CHUSEOK_POSTER}
            index={scene.index}
            id={scene.id}
            component={scene.Component}
          />
        ))}
        <SceneComposition
          video={CHUSEOK_POSTER}
          index={2}
          id="CP-3-Prize"
          component={ChuseokPosterScene3}
        />
        <SceneComposition
          video={CHUSEOK_POSTER}
          index={CHUSEOK_POSTER.script.length - 1}
          id="CP-Outro"
          component={ChuseokPosterOutro}
        />
      </Folder>

      <Folder name="ChuseokDmon0917-Scenes">
        <SceneComposition
          video={CHUSEOK}
          index={0}
          id="CD-1-Hook"
          component={ChuseokScene1}
        />
        <SceneComposition
          video={CHUSEOK}
          index={1}
          id="CD-2-Howto"
          component={ChuseokScene2}
        />
        <SceneComposition
          video={CHUSEOK}
          index={2}
          id="CD-3-Prize"
          component={ChuseokScene3}
        />
        <SceneComposition
          video={CHUSEOK}
          index={3}
          id="CD-4-Caution"
          component={ChuseokScene4}
        />
        <SceneComposition
          video={CHUSEOK}
          index={4}
          id="CD-5-Opinion"
          component={ChuseokScene5}
        />
      </Folder>

      <Folder name="OwwcKorea0916-Scenes">
        {OWWC_SCENES.map((meta, i) => (
          <Composition
            key={meta.image}
            id={`OW-${i + 1}`}
            component={PosterScene}
            durationInFrames={fallbackTimings(OWWC)[i].durationInFrames}
            fps={FPS}
            width={WIDTH}
            height={HEIGHT}
            defaultProps={{
              videoId: OWWC.id,
              sceneId: OWWC.script[i].id,
              image: meta.image,
              source: meta.source,
              accent: OWWC_ACCENT.line,
              layout: OWWC_LAYOUT,
              motion: OWWC_KEN_BURNS,
              drift: i,
              ...sceneDefaults(OWWC, i),
            }}
            calculateMetadata={makeSceneMetadata<PosterSceneProps>(OWWC, i)}
          />
        ))}
        <Composition
          id="OW-Outro"
          component={ChannelOutro}
          durationInFrames={
            fallbackTimings(OWWC)[OWWC.script.length - 1].durationInFrames
          }
          fps={FPS}
          width={WIDTH}
          height={HEIGHT}
          defaultProps={{
            videoId: OWWC.id,
            ...sceneDefaults(OWWC, OWWC.script.length - 1),
          }}
          calculateMetadata={makeSceneMetadata<ChannelOutroProps>(
            OWWC,
            OWWC.script.length - 1,
          )}
        />
      </Folder>

      <Folder name="Hotfix0910-Scenes">
        {HOTFIX_SCENES.map((meta, i) => (
          <Composition
            key={meta.image}
            id={`HF-${i + 1}`}
            component={PosterScene}
            durationInFrames={fallbackTimings(HOTFIX)[i].durationInFrames}
            fps={FPS}
            width={WIDTH}
            height={HEIGHT}
            defaultProps={{
              videoId: HOTFIX.id,
              sceneId: HOTFIX.script[i].id,
              image: meta.image,
              source: meta.source,
              drift: i,
              ...sceneDefaults(HOTFIX, i),
            }}
            calculateMetadata={makeSceneMetadata<PosterSceneProps>(HOTFIX, i)}
          />
        ))}
        <Composition
          id="HF-Outro"
          component={PosterOutro}
          durationInFrames={
            fallbackTimings(HOTFIX)[HOTFIX.script.length - 1].durationInFrames
          }
          fps={FPS}
          width={WIDTH}
          height={HEIGHT}
          defaultProps={{
            videoId: HOTFIX.id,
            ...sceneDefaults(HOTFIX, HOTFIX.script.length - 1),
          }}
          calculateMetadata={makeSceneMetadata<ChannelOutroProps>(
            HOTFIX,
            HOTFIX.script.length - 1,
          )}
        />
      </Folder>

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

      {/* 완성 mp4 배속 변환 (public/tmp/ 에 복사해 두고 --props 로 지정) */}
      <Composition
        id="SpeedUp"
        component={SpeedUp}
        durationInFrames={30}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{ src: "tmp/s5-heroes-1007-rich.mp4", rate: 1.5, seconds: 207.467 }}
        calculateMetadata={speedUpMetadata}
      />

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
