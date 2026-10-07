import React from "react";
import { Img, staticFile, useCurrentFrame } from "remotion";
import { ChuseokCard } from "../../../shared/chuseok/parts";
import { entrance } from "../../../shared/chuseok/RevealScene";
import { ChuseokFrame } from "../../../shared/chuseok/ChuseokFrame";
import { ChuseokStage, PosterCutout } from "../../../shared/chuseok/Stage";
import { CHUSEOK, POSTER_PX } from "../../../shared/chuseok/theme";
import { at, type SceneProps } from "../../../timing";
import { TITLE_FONT } from "../../../typography";

const POSTER = "img/0918/1.png";

/**
 * 3번 장면 · 경품과 당첨 인원.
 *
 * 이 장면만 포스터가 없어서 코드로 그린다. 세트 안에 섞여 보이도록
 * 1번 포스터의 좌표를 그대로 빌려 썼다 — 배지 y 200, 제목 300~500,
 * 카드 y 1172~1396(좌 59 / 우 479). 배경도 같은 포스터를 흐려서 깐다.
 */
export const Scene3Prize: React.FC<SceneProps> = ({
  audioFrames,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const head = entrance(frame, 4, "up");
  const pad = entrance(frame, at(audioFrames, 0.08), "up");
  const cardA = entrance(frame, at(audioFrames, 0.3), "up");
  const cardB = entrance(frame, at(audioFrames, 0.58), "up");

  return (
    <ChuseokFrame
      videoId="chuseok-dmon-0917"
      sceneId="scene3"
      source="출처: 넥슨 오버워치 공식 공지 · 경품 안내"
    >
      <ChuseokStage durationInFrames={durationInFrames} drift={2}>
        {/* 같은 세트의 밤하늘을 배경으로 쓴다 — 크게 흐려서 글자는 남지 않는다 */}
        <Img
          src={staticFile(POSTER)}
          style={{
            position: "absolute",
            left: -70,
            top: -90,
            width: POSTER_PX.w + 140,
            height: POSTER_PX.h + 180,
            maxWidth: "none",
            filter: "blur(36px) saturate(1.05)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(14,10,38,0.52) 0%, rgba(14,10,38,0.62) 55%, rgba(14,10,38,0.8) 100%)",
          }}
        />

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 196,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            opacity: head.opacity,
            translate: head.translate,
          }}
        >
          <div
            style={{
              padding: "12px 42px",
              borderRadius: 32,
              backgroundColor: CHUSEOK.pink,
              color: "#FFFFFF",
              fontSize: 31,
              fontWeight: 800,
              letterSpacing: 1,
            }}
          >
            경품과 당첨 인원
          </div>

          <div
            style={{
              marginTop: 34,
              fontFamily: TITLE_FONT,
              fontSize: 78,
              fontWeight: 900,
              lineHeight: 1.26,
              letterSpacing: -1,
              color: "#FFFFFF",
              textAlign: "center",
              textShadow: "0 6px 26px rgba(10,6,30,0.85)",
            }}
          >
            <div>디몬 장패드 추첨</div>
            <div>
              당첨자는 <span style={{ color: "#FF8FC5" }}>총 10명</span>
            </div>
          </div>

          <div
            style={{
              marginTop: 22,
              fontSize: 32,
              fontWeight: 600,
              color: "rgba(255,255,255,0.86)",
              textShadow: "0 3px 12px rgba(10,6,30,0.9)",
            }}
          >
            게임 접속만으로는 참여 불가
          </div>
        </div>

        {/* 1번 포스터 안의 장패드 제품 컷을 오려 크게 보여준다 */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: pad.opacity,
            translate: pad.translate,
            scale: pad.scale,
            transformOrigin: "470px 846px",
          }}
        >
          <PosterCutout
            image={POSTER}
            src={[118, 716, 800, 396]}
            dest={[70, 648, 800, 396]}
            radius={18}
            style={{ boxShadow: "0 26px 60px rgba(8,4,24,0.6)" }}
          />
        </div>

        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: cardA.opacity,
            translate: cardA.translate,
            scale: cardA.scale,
            transformOrigin: "261px 1284px",
          }}
        >
          <ChuseokCard
            rect={[59, 1172, 405, 224]}
            pill="당첨 인원"
            pillColor={CHUSEOK.pink}
          >
            <div
              style={{
                fontSize: 58,
                fontWeight: 900,
                lineHeight: 1.1,
                letterSpacing: -1,
                color: CHUSEOK.ink,
              }}
            >
              총 10명
            </div>
            <div
              style={{
                marginTop: 10,
                fontSize: 26,
                fontWeight: 600,
                lineHeight: 1.2,
                color: CHUSEOK.muted,
              }}
            >
              댓글 참여자 중 추첨
            </div>
          </ChuseokCard>
        </div>

        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: cardB.opacity,
            translate: cardB.translate,
            scale: cardB.scale,
            transformOrigin: "680px 1284px",
          }}
        >
          <ChuseokCard
            rect={[479, 1172, 402, 224]}
            pill="지급 방식"
            pillColor={CHUSEOK.ink2}
          >
            <div
              style={{
                fontSize: 33,
                fontWeight: 800,
                lineHeight: 1.45,
                color: CHUSEOK.ink,
              }}
            >
              이벤트 종료 후
              <br />
              <span style={{ color: CHUSEOK.pink }}>추첨</span>으로 지급
            </div>
          </ChuseokCard>
        </div>
      </ChuseokStage>
    </ChuseokFrame>
  );
};
