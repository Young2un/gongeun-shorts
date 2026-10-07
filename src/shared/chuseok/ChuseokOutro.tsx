import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  Interactive,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Avatar } from "../../components/Avatar";
import { ChzzkBadge } from "../../components/ChzzkBadge";
import { BellIcon, HeartIcon } from "../../components/Icons";
import { HEIGHT, LAYOUT, MARGIN } from "../../theme";
import { at, type SceneProps } from "../../timing";
import { TITLE_FONT } from "../../typography";
import { OUTRO } from "../outro";
import { ChuseokFrame } from "./ChuseokFrame";
import { CHUSEOK, CHUSEOK_LAYOUT } from "./theme";

/** 이 세트의 밤하늘을 그대로 배경으로 쓴다 (글자가 남지 않게 크게 흐린다) */
const BACKDROP = "img/0918/5.png";

/**
 * 카드 — 포스터의 흰 카드와 같은 모양 (둥근 모서리 + 알약 헤더).
 * 배치는 다크 판(ChannelOutro)과 같은 앵커를 쓰고 색만 추석 세트로 바꾼다.
 */
const OutroCard: React.FC<{
  readonly delay: number;
  readonly header: string;
  readonly headerColor: string;
  readonly children?: React.ReactNode;
}> = ({ delay, header, headerColor, children }) => {
  const frame = useCurrentFrame();
  const show = interpolate(frame, [delay, delay + 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <div
      style={{
        borderRadius: 34,
        backgroundColor: "#FBF7F9",
        boxShadow: "0 16px 44px rgba(16,8,38,0.45)",
        padding: "34px 44px 44px",
        opacity: interpolate(frame, [delay, delay + 12], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
        translate: `0px ${(1 - show) * 44}px`,
      }}
    >
      <div
        style={{
          display: "inline-block",
          padding: "12px 34px",
          borderRadius: 30,
          backgroundColor: headerColor,
          color: "#FFFFFF",
          fontSize: 34,
          fontWeight: 800,
          marginBottom: 26,
        }}
      >
        {header}
      </div>
      {children}
    </div>
  );
};

/**
 * 채널 홍보 아웃트로 — 추석 포스터 세트 판.
 *
 * **배치는 다크 판(src/shared/ChannelOutro.tsx)과 같게 맞춘다.** 같은 앵커
 * (kickerY · titleY · cardsY), 같은 카드 두 장, 같은 내부 구성(프로필 + 이름·설명·배지 /
 * 하트·종 + 문구 세 줄). 영상마다 아웃트로가 따로 놀지 않게 하려는 것이고,
 * 바뀌는 것은 색과 배경뿐이다 — 밤하늘 + 핑크 + 흰 카드.
 *
 * 치지직 그린(#00FFA3)은 손대지 않는다. 흰 카드 위에서는 읽히지 않으므로
 * 어두운 칩 위에 얹어 대비만 확보한다 (PosterOutro 와 같은 방식).
 */
export const ChuseokOutro: React.FC<
  SceneProps & { readonly videoId: string }
> = ({ videoId, audioFrames, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ctaAt = at(audioFrames, 0.5);
  const headIn = interpolate(frame, [2, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <ChuseokFrame
      videoId={videoId}
      sceneId="outro"
      source={OUTRO.source.join(" · ")}
    >
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <Img
          src={staticFile(BACKDROP)}
          style={{
            position: "absolute",
            left: -80,
            top: -100,
            width: 1240,
            height: 2120,
            maxWidth: "none",
            objectFit: "cover",
            filter: "blur(40px) saturate(1.08)",
            scale: interpolate(frame, [0, durationInFrames], [1.02, 1.07], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        />
        <AbsoluteFill
          style={{
            background:
              "linear-gradient(180deg, rgba(20,14,52,0.62) 0%, rgba(26,14,54,0.52) 45%, rgba(14,10,38,0.82) 100%)",
          }}
        />
        {/* 보름달 — 세트의 상징. 제목 뒤에서 은은하게 */}
        <div
          style={{
            position: "absolute",
            right: -80,
            top: 40,
            width: 520,
            height: 520,
            borderRadius: 260,
            background:
              "radial-gradient(circle at 50% 50%, rgba(255,226,140,0.5) 0%, rgba(255,200,120,0.18) 45%, rgba(255,200,120,0) 70%)",
          }}
        />

        <div
          style={{
            position: "absolute",
            left: MARGIN,
            top: LAYOUT.kickerY,
            padding: "10px 28px",
            borderRadius: 26,
            backgroundColor: CHUSEOK.pink,
            color: "#FFFFFF",
            fontSize: 30,
            fontWeight: 800,
            opacity: headIn,
          }}
        >
          {OUTRO.kicker}
        </div>

        <div
          style={{
            position: "absolute",
            left: MARGIN,
            right: MARGIN,
            top: LAYOUT.titleY,
            textAlign: "center",
            opacity: headIn,
            translate: `0px ${(1 - headIn) * 30}px`,
          }}
        >
          <div
            style={{
              fontFamily: TITLE_FONT,
              fontSize: 112,
              fontWeight: 900,
              lineHeight: 1.2,
              letterSpacing: -2,
              color: "#FFFFFF",
              textShadow: "0 6px 30px rgba(10,6,30,0.9)",
            }}
          >
            <div>거의 매일</div>
            <div>
              <span style={{ color: "#FF8FC5" }}>오버워치 방송</span> 중
            </div>
          </div>
          <div
            style={{
              marginTop: 26,
              fontSize: 42,
              fontWeight: 600,
              color: "rgba(255,255,255,0.9)",
              textShadow: "0 3px 14px rgba(10,6,30,0.9)",
            }}
          >
            치지직에서 &apos;김공은&apos;으로 만나요
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            left: MARGIN,
            right: MARGIN,
            top: LAYOUT.cardsY,
            bottom: HEIGHT - CHUSEOK_LAYOUT.scrimFrom,
            display: "flex",
            flexDirection: "column",
            gap: 30,
          }}
        >
          <OutroCard delay={14} header="방송 채널" headerColor={CHUSEOK.ink2}>
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
                <Avatar size={300} />
              </Interactive.Div>

              <div>
                <div
                  style={{
                    fontFamily: TITLE_FONT,
                    fontSize: 92,
                    fontWeight: 900,
                    lineHeight: 1.15,
                    letterSpacing: -2,
                    color: CHUSEOK.ink,
                  }}
                >
                  김공은
                </div>
                <div
                  style={{
                    fontSize: 38,
                    fontWeight: 600,
                    lineHeight: 1.5,
                    color: CHUSEOK.muted,
                    marginTop: 10,
                  }}
                >
                  거의 매일 오버워치 생방송
                </div>
                {/* 브랜드 색은 그대로 두고 어두운 칩 위에 얹어 대비만 얻는다 */}
                <div
                  style={{
                    marginTop: 20,
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "12px 22px",
                    borderRadius: 16,
                    backgroundColor: CHUSEOK.ink,
                  }}
                >
                  <ChzzkBadge height={50} />
                </div>
              </div>
            </div>
          </OutroCard>

          <OutroCard
            delay={ctaAt}
            header="구독 · 좋아요"
            headerColor={CHUSEOK.pink}
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
                  <HeartIcon size={78} color={CHUSEOK.pink} />
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
                  <BellIcon size={78} color={CHUSEOK.pink} />
                </Interactive.Div>
              </div>

              <div>
                <div
                  style={{
                    fontSize: 40,
                    fontWeight: 800,
                    lineHeight: 1.5,
                    color: CHUSEOK.ink,
                  }}
                >
                  관심 있으시면{" "}
                  <span style={{ color: CHUSEOK.pink }}>놀러 오세요!</span>
                </div>
                <div
                  style={{
                    fontSize: 36,
                    fontWeight: 600,
                    lineHeight: 1.5,
                    color: CHUSEOK.ink2,
                    marginTop: 6,
                  }}
                >
                  <span style={{ color: CHUSEOK.pink, fontWeight: 800 }}>
                    구독과 좋아요
                  </span>
                  도 부탁드립니다.
                </div>
                <div
                  style={{
                    fontSize: 32,
                    fontWeight: 500,
                    lineHeight: 1.5,
                    color: CHUSEOK.muted,
                    marginTop: 10,
                  }}
                >
                  방송 일정은 채널 공지에서 확인
                </div>
              </div>
            </div>
          </OutroCard>
        </div>

        {/* 카드 아래 빈 자리는 세트의 인사말로 채운다 (5번 포스터와 같은 문구) */}
        <div
          style={{
            position: "absolute",
            left: MARGIN,
            right: MARGIN,
            top: 1452,
            textAlign: "center",
            fontSize: 40,
            fontWeight: 700,
            letterSpacing: 0.5,
            color: "#FFB3D6",
            textShadow: "0 3px 16px rgba(10,6,30,0.9)",
            opacity: interpolate(frame, [ctaAt + 24, ctaAt + 44], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
          }}
        >
          따뜻하고 행복한 한가위 되세요 ♡
        </div>

        {/* 마지막 1초 페이드아웃 */}
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
      </AbsoluteFill>
    </ChuseokFrame>
  );
};
