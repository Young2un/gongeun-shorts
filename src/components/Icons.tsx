import React from "react";
import { COLORS, shade, withAlpha } from "../theme";

export type IconProps = {
  readonly size?: number;
  /** 의미 색. 아이콘은 이 색 → 약간 어두운 색으로 그라데이션이 걸린다. */
  readonly color?: string;
  /** 뒤에 같은 색 글로우를 깐다 */
  readonly glow?: boolean;
  readonly style?: React.CSSProperties;
};

/** 아이콘 공통 래퍼: viewBox 비율 유지 + 글로우 */
const Svg: React.FC<
  IconProps & {
    readonly viewBox: string;
    readonly ratio: number;
    readonly children: (fill: string) => React.ReactNode;
  }
> = ({
  size = 64,
  color = COLORS.white,
  glow,
  style,
  viewBox,
  ratio,
  children,
}) => {
  const id = React.useId();
  const isHex = color.startsWith("#");

  return (
    <svg
      width={size * ratio}
      height={size}
      viewBox={viewBox}
      style={{
        display: "block",
        filter:
          glow && isHex
            ? `drop-shadow(0 0 20px ${withAlpha(color, 0.4)})`
            : undefined,
        ...style,
      }}
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} />
          <stop offset="100%" stopColor={isHex ? shade(color, 0.22) : color} />
        </linearGradient>
      </defs>
      {children(`url(#${id})`)}
    </svg>
  );
};

/** 사람 실루엣 (머리 + 어깨) */
export const PersonIcon: React.FC<IconProps> = (props) => (
  <Svg {...props} viewBox="0 0 24 24" ratio={1}>
    {(fill) => (
      <g fill={fill}>
        <circle cx="12" cy="7" r="4.6" />
        <path d="M12 13.4c-4.7 0-8.5 3.1-8.5 7v2.1c0 .8.7 1.5 1.5 1.5h14c.8 0 1.5-.7 1.5-1.5v-2.1c0-3.9-3.8-7-8.5-7Z" />
      </g>
    )}
  </Svg>
);

/** 사람 5명 그룹 */
export const GroupIcon: React.FC<IconProps> = (props) => (
  <Svg {...props} viewBox="0 0 64 24" ratio={64 / 24}>
    {(fill) => (
      <g fill={fill}>
        {[6, 18, 32, 46, 58].map((cx, i) => {
          const r = i === 2 ? 4.6 : 3.8;
          return (
            <g key={cx}>
              <circle cx={cx} cy={i === 2 ? 7 : 8.5} r={r} />
              <path
                d={`M${cx} ${i === 2 ? 13 : 14} c-${r * 1.7} 0 -${r * 1.7} 0 -${r * 1.7} ${r * 1.6} v${r * 1.5} h${r * 3.4} v-${r * 1.5} c0-${r * 1.6}-${r * 1.7}-${r * 1.6}-${r * 1.7}-${r * 1.6}Z`}
              />
            </g>
          );
        })}
      </g>
    )}
  </Svg>
);

/** 트로피 */
export const TrophyIcon: React.FC<IconProps> = (props) => (
  <Svg {...props} viewBox="0 0 24 24" ratio={1}>
    {(fill) => (
      <g fill={fill}>
        <path d="M6.5 2h11v5.5a5.5 5.5 0 0 1-11 0V2Z" />
        <path d="M6.5 3.2H3v2.1a4.3 4.3 0 0 0 3.9 4.3V7.5A2.4 2.4 0 0 1 6.5 6V3.2Z" />
        <path d="M17.5 3.2H21v2.1a4.3 4.3 0 0 1-3.9 4.3V7.5c.3-.4.4-1 .4-1.5V3.2Z" />
        <rect x="10.6" y="12.6" width="2.8" height="4" rx="0.6" />
        <rect x="7.2" y="16.4" width="9.6" height="2.4" rx="1.2" />
        <rect x="5.6" y="19" width="12.8" height="2.6" rx="1.3" />
      </g>
    )}
  </Svg>
);

/** 왕관 */
export const CrownIcon: React.FC<IconProps> = (props) => (
  <Svg {...props} viewBox="0 0 24 24" ratio={1}>
    {(fill) => (
      <g fill={fill}>
        <path d="M2.6 6.6 6.8 11 12 3.4 17.2 11l4.2-4.4 -1.7 11.1H4.3L2.6 6.6Z" />
        <rect x="4.3" y="19" width="15.4" height="2.4" rx="1.2" />
      </g>
    )}
  </Svg>
);

/** 기어 (설정) */
export const GearIcon: React.FC<IconProps> = (props) => (
  <Svg {...props} viewBox="0 0 24 24" ratio={1}>
    {(fill) => (
      <path
        fill={fill}
        fillRule="evenodd"
        d="M19.14 12.94a7.07 7.07 0 0 0 .06-.94c0-.32-.02-.63-.06-.94l2.03-1.58a.5.5 0 0 0 .12-.62l-1.92-3.32a.5.5 0 0 0-.6-.22l-2.39.96a7.03 7.03 0 0 0-1.62-.94l-.36-2.54a.5.5 0 0 0-.5-.42h-3.84a.5.5 0 0 0-.5.42l-.36 2.54c-.59.24-1.13.56-1.62.94l-2.39-.96a.5.5 0 0 0-.6.22L2.74 8.86a.5.5 0 0 0 .12.62l2.03 1.58c-.04.31-.06.62-.06.94s.02.63.06.94l-2.03 1.58a.5.5 0 0 0-.12.62l1.92 3.32c.12.22.38.3.6.22l2.39-.96c.49.38 1.03.7 1.62.94l.36 2.54c.04.24.25.42.5.42h3.84c.25 0 .46-.18.5-.42l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.48 0 .6-.22l1.92-3.32a.5.5 0 0 0-.12-.62l-2.03-1.58ZM12 15.6A3.6 3.6 0 1 1 15.6 12 3.6 3.6 0 0 1 12 15.6Z"
      />
    )}
  </Svg>
);

/** 확성기 */
export const MegaphoneIcon: React.FC<IconProps> = (props) => (
  <Svg {...props} viewBox="0 0 24 24" ratio={1}>
    {(fill) => (
      <g fill={fill}>
        <path d="M20 2.6v18.8L9.6 16.6V7.4L20 2.6Z" />
        <path d="M8.4 8H4.8A2.8 2.8 0 0 0 2 10.8v2.4A2.8 2.8 0 0 0 4.8 16h3.6V8Z" />
        <path d="M5.2 17.2h3.2l1 4.2H6.2l-1-4.2Z" />
      </g>
    )}
  </Svg>
);

/** 문서 (출처) */
export const DocumentIcon: React.FC<IconProps> = (props) => (
  <Svg {...props} viewBox="0 0 24 24" ratio={1}>
    {(fill) => (
      <g fill={fill}>
        <path d="M5.4 2.6h8L19 8.2v12.6c0 .9-.7 1.6-1.6 1.6H5.4a1.6 1.6 0 0 1-1.6-1.6V4.2c0-.9.7-1.6 1.6-1.6Z" />
        <path d="M13.4 2.6 19 8.2h-5.6V2.6Z" opacity="0.45" />
        <g fill={COLORS.bg0} opacity="0.75">
          <rect x="6.6" y="11.4" width="9.4" height="1.5" rx="0.75" />
          <rect x="6.6" y="14.6" width="9.4" height="1.5" rx="0.75" />
          <rect x="6.6" y="17.8" width="6" height="1.5" rx="0.75" />
        </g>
      </g>
    )}
  </Svg>
);

/** 방패 — 승/패 표시 */
export const ShieldIcon: React.FC<
  IconProps & { readonly mark?: "win" | "loss" }
> = ({ mark = "win", ...props }) => (
  <Svg {...props} viewBox="0 0 24 24" ratio={1}>
    {(fill) => (
      <g>
        <path
          fill={fill}
          d="M12 1.8 20.4 5v6.3c0 5.2-3.5 9.9-8.4 11.4C7.1 21.2 3.6 16.5 3.6 11.3V5L12 1.8Z"
        />
        {mark === "win" ? (
          <path
            fill={COLORS.bg0}
            d="m10.8 15.4-3.2-3.2 1.7-1.7 1.5 1.5 4.2-4.2 1.7 1.7-5.9 5.9Z"
          />
        ) : (
          <path
            fill={COLORS.bg0}
            d="m15.5 9.2-1.7-1.7L12 9.3l-1.8-1.8-1.7 1.7 1.8 1.8-1.8 1.8 1.7 1.7 1.8-1.8 1.8 1.8 1.7-1.7-1.8-1.8 1.8-1.8Z"
          />
        )}
      </g>
    )}
  </Svg>
);

/** 프로필 카드 프레임 */
export const ProfileCardIcon: React.FC<IconProps> = (props) => (
  <Svg {...props} viewBox="0 0 24 24" ratio={1}>
    {(fill) => (
      <g>
        <rect x="2.4" y="3.6" width="19.2" height="16.8" rx="2.4" fill={fill} />
        <rect
          x="4.8"
          y="6"
          width="14.4"
          height="12"
          rx="1.2"
          fill={COLORS.bg0}
        />
        <circle cx="12" cy="10.6" r="2.4" fill={fill} />
        <path
          d="M12 13.6c-2.5 0-4.5 1.6-4.5 3.6V18h9v-.8c0-2-2-3.6-4.5-3.6Z"
          fill={fill}
        />
      </g>
    )}
  </Svg>
);

/** 주사위 (테이블탑 RPG) */
export const DiceIcon: React.FC<IconProps> = (props) => (
  <Svg {...props} viewBox="0 0 24 24" ratio={1}>
    {(fill) => (
      <g>
        <rect x="2.6" y="2.6" width="18.8" height="18.8" rx="4" fill={fill} />
        <g fill={COLORS.bg0}>
          <circle cx="8" cy="8" r="1.9" />
          <circle cx="16" cy="8" r="1.9" />
          <circle cx="12" cy="12" r="1.9" />
          <circle cx="8" cy="16" r="1.9" />
          <circle cx="16" cy="16" r="1.9" />
        </g>
      </g>
    )}
  </Svg>
);

/** 하트 (좋아요) */
export const HeartIcon: React.FC<IconProps> = (props) => (
  <Svg {...props} viewBox="0 0 24 24" ratio={1}>
    {(fill) => (
      <path
        fill={fill}
        d="M12 21.2 3.9 13.4a5.6 5.6 0 0 1 0-8 5.6 5.6 0 0 1 8 0l.1.1.1-.1a5.6 5.6 0 0 1 8 0 5.6 5.6 0 0 1 0 8L12 21.2Z"
      />
    )}
  </Svg>
);

/** 종 (알림 · 구독) */
export const BellIcon: React.FC<IconProps> = (props) => (
  <Svg {...props} viewBox="0 0 24 24" ratio={1}>
    {(fill) => (
      <g fill={fill}>
        <path d="M12 2.2a2 2 0 0 1 2 2v.7a6.6 6.6 0 0 1 4.6 6.3v3.4l1.7 2.6a1 1 0 0 1-.8 1.5H4.5a1 1 0 0 1-.8-1.5l1.7-2.6v-3.4A6.6 6.6 0 0 1 10 4.9v-.7a2 2 0 0 1 2-2Z" />
        <path d="M9.3 20.1h5.4a2.7 2.7 0 0 1-5.4 0Z" />
      </g>
    )}
  </Svg>
);

/** 두꺼운 chevron 화살표 — 그레이에서 의미색으로 그라데이션 */
export const ChevronIcon: React.FC<{
  readonly width?: number;
  readonly to?: string;
  readonly style?: React.CSSProperties;
}> = ({ width = 72, to = COLORS.white, style }) => {
  const id = React.useId();

  return (
    <svg
      width={width}
      height={width * 0.5}
      viewBox="0 0 48 24"
      style={{ display: "block", flexShrink: 0, ...style }}
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={COLORS.grey} stopOpacity="0.35" />
          <stop offset="100%" stopColor={to} />
        </linearGradient>
      </defs>
      <path fill={`url(#${id})`} d="M0 7h24V0l24 12-24 12v-7H0V7Z" />
    </svg>
  );
};
