import React from "react";
import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Avatar } from "../../components/Avatar";
import { ChzzkBadge } from "../../components/ChzzkBadge";
import { BellIcon, HeartIcon } from "../../components/Icons";
import { COLORS, HEIGHT, LAYOUT, MARGIN } from "../../theme";
import { at, type SceneProps } from "../../timing";
import { TITLE_FONT } from "../../typography";
import { OUTRO } from "../outro";
import { PosterFrame } from "./PosterFrame";
import {
  EdgeCaps,
  PosterBackground,
  PosterCard,
  PosterFooter,
  PosterKicker,
  PosterTitle,
} from "./chrome";
import { POSTER, POSTER_LAYOUT } from "./theme";

/**
 * 채널 홍보 아웃트로 — 라이트 포스터 테마 판.
 *
 * **배치는 다크 테마 판(src/shared/ChannelOutro.tsx)과 같게 맞춘다.**
 * 같은 앵커(LAYOUT.kickerY · titleY · cardsY), 같은 카드 두 장,
 * 같은 내부 구성(프로필 320 + 이름/설명/배지, 하트·종 + 문구 세 줄).
 * 다른 영상들과 아웃트로가 따로 놀지 않게 하려는 것이고,
 * 바뀌는 것은 색뿐이다 — 은색 배경 · 잉크 글자 · 오렌지 강조.
 *
 * 치지직 그린(#00FFA3)은 그대로 쓴다. 다만 흰 카드 위에서는 그 자체로
 * 읽히지 않아서, 채널 카드 헤더는 자동으로 어두워지고(PosterCard)
 * 배지는 어두운 칩 위에 얹어 브랜드 색을 손대지 않고 대비만 확보한다.
 */
export const PosterOutro: React.FC<
  SceneProps & { readonly videoId: string }
> = ({ videoId, audioFrames, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ctaAt = at(audioFrames, 0.5);

  return (
    <PosterFrame
      videoId={videoId}
      sceneId="outro"
      source={OUTRO.source.join(" · ")}
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
      <AbsoluteFill>
        <PosterBackground />
        {/* 좌측 장식은 끈다 — 카드가 여기까지 올라와서 겹친다 */}
        <EdgeCaps left={false} />
        <PosterKicker text={OUTRO.kicker} />

        <PosterTitle
          lines={["거의 매일", "오버워치 방송 중"]}
          em="오버워치 방송"
          subtitle="치지직에서 '김공은'으로 만나요"
          size={118}
          top={LAYOUT.titleY}
        />

        <div
          style={{
            position: "absolute",
            left: MARGIN,
            right: MARGIN,
            top: LAYOUT.cardsY,
            bottom: HEIGHT - POSTER_LAYOUT.scrimFrom,
            display: "flex",
            flexDirection: "column",
            gap: 34,
          }}
        >
          <PosterCard delay={14} accent={COLORS.chzzk} header="방송 채널" padding={52}>
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
                <Avatar size={340} />
              </Interactive.Div>

              <div>
                <div
                  style={{
                    fontFamily: TITLE_FONT,
                    fontSize: 96,
                    fontWeight: 900,
                    lineHeight: 1.15,
                    letterSpacing: -2,
                    color: POSTER.ink,
                  }}
                >
                  김공은
                </div>
                <div
                  style={{
                    fontSize: 40,
                    fontWeight: 600,
                    lineHeight: 1.5,
                    color: POSTER.body,
                    marginTop: 10,
                  }}
                >
                  거의 매일 오버워치 생방송
                </div>
                {/* 브랜드 색을 바꾸지 않고 대비만 얻으려고 어두운 칩 위에 얹는다 */}
                <div
                  style={{
                    marginTop: 20,
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "12px 22px",
                    borderRadius: 14,
                    backgroundColor: POSTER.slate,
                  }}
                >
                  <ChzzkBadge height={52} />
                </div>
              </div>
            </div>
          </PosterCard>

          <PosterCard
            delay={ctaAt}
            accent={POSTER.orange}
            header="구독 · 좋아요"
            padding={52}
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
                  <HeartIcon size={82} color={POSTER.orange} />
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
                  <BellIcon size={82} color={POSTER.orange} />
                </Interactive.Div>
              </div>

              <div>
                <div
                  style={{
                    fontSize: 42,
                    fontWeight: 800,
                    lineHeight: 1.5,
                    color: POSTER.ink,
                  }}
                >
                  관심 있으시면{" "}
                  <span style={{ color: POSTER.orange }}>놀러 오세요!</span>
                </div>
                <div
                  style={{
                    fontSize: 38,
                    fontWeight: 600,
                    lineHeight: 1.5,
                    color: POSTER.body,
                    marginTop: 6,
                  }}
                >
                  <span style={{ color: POSTER.orange, fontWeight: 800 }}>
                    구독과 좋아요
                  </span>
                  도 부탁드립니다.
                </div>
                <div
                  style={{
                    fontSize: 34,
                    fontWeight: 500,
                    lineHeight: 1.5,
                    color: POSTER.faint,
                    marginTop: 10,
                  }}
                >
                  방송 일정은 채널 공지에서 확인
                </div>
              </div>
            </div>
          </PosterCard>
        </div>

        {/* 다크 판은 이 아래를 자막 박스 + 출처 카드가 채운다.
            포스터 판은 둘 다 스크림 안으로 내려가 있어서(장면 1~5 와 자막 위치를
            맞추려고) 그 자리가 비는데, 포스터의 하단 워드마크로 채운다. */}
        <PosterFooter
          label="CHZZK"
          lines={["OVERWATCH", "EVERY DAY"]}
          top={1522}
        />
      </AbsoluteFill>
    </PosterFrame>
  );
};
