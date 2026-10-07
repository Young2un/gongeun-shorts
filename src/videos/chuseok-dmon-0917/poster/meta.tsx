import React from "react";
import {
  CardNote,
  DateCell,
  Fill,
  GlassPatch,
  Tilde,
} from "../../../shared/chuseok/parts";
import type { Reveal } from "../../../shared/chuseok/RevealScene";
import { CHUSEOK } from "../../../shared/chuseok/theme";
import { OUTRO_FALLBACK_SECONDS } from "../../../shared/outro";
import type { VideoConfig } from "../../../timing";
import script from "../script.json";

/**
 * 추석 포스터판 (public/img/0918/*.png).
 *
 * 대본·나레이션·자막은 코드로 그린 판(chuseok-dmon-0917)과 같은 것을 쓴다.
 * 여기서 정하는 것은 "포스터의 어느 카드가 언제 들어오는가" 뿐이다.
 *
 * 좌표는 전부 포스터 원본(941x1672) 픽셀이다. 실제 픽셀을 재서 잡았고,
 * 카드 그림자까지 덮이도록 사방 12px 여유(grow 기본값)가 자동으로 붙는다.
 *
 * 3번 장면(경품·당첨 인원)은 포스터가 없어서 코드로 그린다 (Scene3Prize).
 */

const P1 = "img/0918/1.png";
const P2 = "img/0918/2.png";
const P4 = "img/0918/3.png";
const P5 = "img/0918/5.png";

/** 2번 포스터 날짜 칸 정정 — 공지에는 시작 "시각"이 없다 (날짜만 표기) */
const periodCover = (
  <>
    <Fill rect={[52, 588, 838, 182]} color={CHUSEOK.panel} />
    <DateCell
      rect={[66, 601, 370, 155]}
      date="9월 17일"
      day="목"
      note="이벤트 시작"
    />
    <Tilde rect={[436, 601, 69, 155]} />
    <DateCell
      rect={[505, 601, 370, 155]}
      date="9월 27일"
      day="일"
      note="밤 11:59"
    />
  </>
);

export type PosterSceneMeta = {
  readonly name: string;
  readonly image: string;
  readonly source: string;
  /** 카드가 나오기 전 그 자리를 덮을 색 (포스터에서 카드 둘레를 재서 넣었다) */
  readonly slotColor: string;
  readonly reveals: readonly Reveal[];
  readonly overlays?: React.ReactNode;
};

export const POSTER_SCENES: readonly PosterSceneMeta[] = [
  {
    name: "1 · 훅",
    image: P1,
    source: "출처: 넥슨 오버워치 공식 이벤트 공지 (2026.09.17)",
    /** 두 카드가 나란히 붙어 있어 색을 다르게 주면 가운데 경계가 보인다 */
    slotColor: "#332432",
    reveals: [
      { rect: [59, 1172, 405, 224], at: 0.3 },
      { rect: [479, 1172, 402, 224], at: 0.58 },
    ],
  },
  {
    name: "2 · 기간과 방법",
    image: P2,
    source: "출처: 넥슨 오버워치 공식 공지 · 이벤트 기간",
    /** 카드가 전부 흰 패널 위에 있어서 패널색으로 덮으면 자리가 티나지 않는다 */
    slotColor: "#FEFDFE",
    reveals: [
      { rect: [60, 595, 822, 168], at: 0.1, cover: periodCover },
      { rect: [86, 772, 770, 64], at: 0.26, from: "left" },
      { rect: [66, 1018, 248, 278], at: 0.52 },
      { rect: [355, 1018, 248, 278], at: 0.62 },
      { rect: [640, 1018, 248, 278], at: 0.72 },
    ],
  },
  {
    name: "4 · 주의사항",
    image: P4,
    source: "출처: 넥슨 오버워치 공식 공지 · 유의사항",
    slotColor: "#2C2A55",
    /** 부제 "기간 안에는 댓글 수정 가능" 은 공지에 없는 문구라 갈아 끼운다 */
    overlays: (
      <GlassPatch
        image={P4}
        rect={[104, 418, 392, 64]}
        text="공식 게시글 댓글만 인정돼요"
        fontSize={33}
      />
    ),
    reveals: [
      {
        rect: [33, 525, 436, 548],
        at: 0.22,
        slot: "#262247",
        /** 카드 안 "이벤트 기간 내 수정 가능" 도 같은 이유로 교체 */
        cover: (
          <CardNote
            rect={[50, 938, 400, 116]}
            lines={["중복 참여가 확인되면", "당첨이 취소될 수 있어요"]}
          />
        ),
      },
      { rect: [477, 525, 436, 548], at: 0.45, slot: "#373160" },
      { rect: [33, 1085, 878, 352], at: 0.68, slot: "#33346D" },
    ],
  },
  {
    name: "5 · 공은의 한마디",
    image: P5,
    source: "출처: 넥슨 오버워치 공식 공지 · 유의사항 · 이하 개인 의견",
    slotColor: "#FDFBFD",
    reveals: [
      { rect: [56, 612, 830, 108], at: 0.1, slot: "#FEFDFE" },
      { rect: [56, 752, 830, 108], at: 0.28, slot: "#FBF3F9" },
      { rect: [56, 892, 830, 108], at: 0.46, slot: "#FBF3F9" },
      { rect: [56, 1032, 830, 110], at: 0.62 },
      { rect: [33, 1190, 878, 212], at: 0.8, slot: "#FAF4F7" },
    ],
  },
];

/** 코드판과 같은 음성·자막(public/videos/chuseok-dmon-0917/)을 그대로 쓴다 */
export const VIDEO_POSTER: VideoConfig = {
  id: "chuseok-dmon-0917",
  compositionId: "ChuseokDmon0918",
  script,
  fallbackSeconds: [12, 11, 12, 12, 14, OUTRO_FALLBACK_SECONDS],
};
