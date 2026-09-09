import React from "react";
import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Avatar } from "../components/Avatar";
import { Card } from "../components/Card";
import { ChzzkBadge } from "../components/ChzzkBadge";
import { Em } from "../components/Em";
import { BellIcon, HeartIcon } from "../components/Icons";
import { SceneFrame } from "../components/SceneFrame";
import { BODY, BODY_SM } from "../styles";
import { COLORS } from "../theme";
import { OUTRO } from "./outro";
import { at, type SceneProps } from "../timing";
import { TITLE_FONT } from "../typography";

/**
 * 채널 홍보 아웃트로 — 구독·좋아요 유도 후 페이드아웃.
 *
 * 팀 드라이브 영상의 마지막 장면이자, 다른 영상에도 그대로 붙일 수 있는 조각이다.
 * 단독 렌더: `npm run outro` (컴포지션 id `ChannelOutro`)
 * 필요한 파일: public/videos/<videoId>/voice/outro.wav · captions/outro.json
 *             public/shared/assets/profile.jpg · public/shared/assets/chzzk_logo.png
 */
export type ChannelOutroProps = SceneProps & {
  /** 어느 영상 폴더의 outro 에셋을 쓸지 */
  readonly videoId: string;
};

export const ChannelOutro: React.FC<ChannelOutroProps> = ({
  videoId,
  audioFrames,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ctaAt = at(audioFrames, 0.5);

  return (
    <SceneFrame
      videoId={videoId}
      sceneId="outro"
      kicker={OUTRO.kicker}
      titleLines={["거의 매일", "오버워치 방송 중"]}
      titleEm={{ "오버워치 방송": COLORS.orange }}
      titleSize={118}
      subtitle="치지직에서 '김공은'으로 만나요"
      source={OUTRO.source}
      overlay={
        /* 마지막 1초 페이드아웃 */
        <AbsoluteFill
          style={{
            backgroundColor: "#000000",
            pointerEvents: "none",
            opacity: interpolate(
              frame,
              [durationInFrames - fps, durationInFrames - 1],
              [0, 1],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(0.4, 0, 1, 1),
              },
            ),
          }}
        />
      }
    >
      <Card
        delay={14}
        accent={COLORS.chzzk}
        header="방송 채널"
        name="채널 카드"
      >
        <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
          <Interactive.Div
            name="프로필 사진"
            style={{
              scale: interpolate(frame, [14, 44], [0.6, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.spring({ damping: 12 }),
                output: "perceptual-scale",
              }),
            }}
          >
            <Avatar size={320} />
          </Interactive.Div>

          <div>
            <div
              style={{
                fontFamily: TITLE_FONT,
                fontSize: 96,
                fontWeight: 900,
                lineHeight: 1.15,
                letterSpacing: -1,
                color: COLORS.white,
                textShadow: "0 4px 0 #000",
              }}
            >
              김공은
            </div>
            <div style={{ ...BODY, fontSize: 40, marginTop: 10 }}>
              거의 매일 오버워치 생방송
            </div>
            <ChzzkBadge height={58} style={{ marginTop: 20 }} />
          </div>
        </div>
      </Card>

      <Card
        delay={ctaAt}
        accent={COLORS.orange}
        header="구독 · 좋아요"
        name="CTA 카드"
      >
        <div style={{ display: "flex", alignItems: "center", gap: 34 }}>
          <div style={{ display: "flex", gap: 18, flexShrink: 0 }}>
            <Interactive.Div
              name="하트"
              style={{
                scale: interpolate(
                  frame,
                  [ctaAt + 10, ctaAt + 22, ctaAt + 34],
                  [0.6, 1.15, 1],
                  {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                    easing: Easing.bezier(0.16, 1, 0.3, 1),
                    output: "perceptual-scale",
                  },
                ),
              }}
            >
              <HeartIcon size={82} color={COLORS.orange} glow />
            </Interactive.Div>
            <Interactive.Div
              name="종"
              style={{
                scale: interpolate(
                  frame,
                  [ctaAt + 18, ctaAt + 30, ctaAt + 42],
                  [0.6, 1.15, 1],
                  {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                    easing: Easing.bezier(0.16, 1, 0.3, 1),
                    output: "perceptual-scale",
                  },
                ),
              }}
            >
              <BellIcon size={82} color={COLORS.orange} glow />
            </Interactive.Div>
          </div>

          <div>
            <div style={{ ...BODY, fontWeight: 700 }}>
              <Em
                text="관심 있으시면 놀러 오세요!"
                em={{ "놀러 오세요": COLORS.orange }}
              />
            </div>
            <div style={{ ...BODY, fontSize: 38, marginTop: 6 }}>
              <Em
                text="구독과 좋아요도 부탁드립니다."
                em={{ "구독과 좋아요": COLORS.orange }}
              />
            </div>
            <div style={{ ...BODY_SM, marginTop: 10 }}>
              방송 일정은 채널 공지에서 확인
            </div>
          </div>
        </div>
      </Card>
    </SceneFrame>
  );
};
