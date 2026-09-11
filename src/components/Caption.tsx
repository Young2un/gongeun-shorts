import {
  createTikTokStyleCaptions,
  type Caption as CaptionType,
} from "@remotion/captions";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  AbsoluteFill,
  Sequence,
  staticFile,
  useDelayRender,
  useVideoConfig,
} from "remotion";
import { CAPTION_PAGE_MS, COLORS, HEIGHT, LAYOUT, MARGIN } from "../theme";
import { captionsDir, HEAD_FRAMES } from "../timing";

/**
 * 자막 생김새.
 * - "box"  검정 딤드 박스 위에 흰 글자 (어두운 배경의 기본 장면용)
 * - "bare" 박스 없이 흰 글자 + 강한 그림자 (뒤에 이미 스크림이 깔린 경우용)
 */
export type CaptionVariant = "box" | "bare";

export type CaptionStyle = {
  readonly variant?: CaptionVariant;
  /** 자막 블록의 아래쪽 기준선 (여러 줄이면 위로 자란다) */
  readonly bottom?: number;
  readonly fontSize?: number;
  readonly maxWidth?: number;
};

const CaptionPage: React.FC<
  CaptionStyle & {
    readonly page: ReturnType<typeof createTikTokStyleCaptions>["pages"][number];
  }
> = ({
  page,
  variant = "box",
  bottom = LAYOUT.captionBottom,
  fontSize = 44,
  maxWidth = 940,
}) => {
  const boxed = variant === "box";

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: MARGIN,
          right: MARGIN,
          bottom: HEIGHT - bottom,
          display: "flex",
          justifyContent: "center",
        }}
      >
        {/* 자막인 게 확실히 보이도록 뒤에 검정 딤드를 깐다 */}
        <div
          style={{
            maxWidth,
            padding: boxed ? "18px 32px" : 0,
            borderRadius: boxed ? 16 : undefined,
            backgroundColor: boxed ? "rgba(0,0,0,0.72)" : undefined,
            border: boxed ? "1px solid rgba(255,255,255,0.08)" : undefined,
            boxShadow: boxed ? "0 10px 40px rgba(0,0,0,0.55)" : undefined,
            textAlign: "center",
            fontSize,
            fontWeight: 700,
            lineHeight: 1.4,
            color: COLORS.white,
            textShadow: boxed
              ? "0 3px 10px rgba(0,0,0,0.9)"
              : "0 2px 4px rgba(0,0,0,0.95), 0 4px 22px rgba(0,0,0,0.85)",
            // 문장 단위라 두 줄까지 자연스럽게 흐르게 둔다
            wordBreak: "keep-all",
          }}
        >
          {page.tokens.map((token, i) => (
            <span key={`${token.fromMs}-${i}`}>{token.text}</span>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/**
 * 장면 나레이션의 자동 자막. 전체 흰색으로만 표시한다
 * (구절 단위 자동 강조는 오탐이 많아서 쓰지 않는다).
 * `public/videos/<videoId>/captions/<sceneId>.json` 이 없으면 아무것도 그리지 않는다.
 * (생성: `npm run voice`, 또는 ASR 로 다시 뽑으려면 `npm run captions`)
 *
 * 위치·크기·박스 유무는 옵션으로 바꿀 수 있다. 기본값은 기존 장면들이 쓰던 값 그대로다.
 */
export const Caption: React.FC<
  CaptionStyle & {
    readonly videoId: string;
    readonly sceneId: string;
  }
> = ({ videoId, sceneId, ...style }) => {
  const { fps } = useVideoConfig();
  const [captions, setCaptions] = useState<CaptionType[] | null>(null);
  const { delayRender, continueRender } = useDelayRender();
  const [handle] = useState(() => delayRender(`자막 로딩: ${sceneId}`));

  const load = useCallback(async () => {
    try {
      const res = await fetch(
        staticFile(`${captionsDir(videoId)}/${sceneId}.json`),
      );
      setCaptions(res.ok ? ((await res.json()) as CaptionType[]) : []);
    } catch {
      setCaptions([]);
    } finally {
      continueRender(handle);
    }
  }, [videoId, sceneId, handle, continueRender]);

  useEffect(() => {
    load();
  }, [load]);

  const pages = useMemo(() => {
    if (!captions || captions.length === 0) {
      return [];
    }
    return createTikTokStyleCaptions({
      captions,
      combineTokensWithinMilliseconds: CAPTION_PAGE_MS,
    }).pages;
  }, [captions]);

  if (pages.length === 0) {
    return null;
  }

  return (
    <AbsoluteFill>
      {pages.map((page, index) => {
        const nextPage = pages[index + 1] ?? null;
        // 나레이션이 HEAD_FRAMES 뒤에 시작하므로 자막도 같이 민다.
        const startFrame =
          HEAD_FRAMES + Math.round((page.startMs / 1000) * fps);

        // 다음 문장이 시작할 때까지 띄워 둔다 (문장 사이 숨 쉬는 구간에 깜빡이지 않게).
        // 마지막 문장은 발화가 끝나고 0.4초만 더 보여준다.
        const endMs = nextPage
          ? nextPage.startMs
          : page.startMs + page.durationMs + 400;
        const durationInFrames =
          HEAD_FRAMES + Math.round((endMs / 1000) * fps) - startFrame;

        if (durationInFrames <= 0) {
          return null;
        }

        return (
          <Sequence
            key={index}
            from={startFrame}
            durationInFrames={durationInFrames}
            name={`자막 ${index + 1}`}
            layout="none"
          >
            <CaptionPage page={page} {...style} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
