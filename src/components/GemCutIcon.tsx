import React from 'react';

interface Props {
  cut: string;
  size?: number;
  className?: string;
}

export default function GemCutIcon({ cut, size = 40, className = '' }: Props) {
  const s = size;
  const c = s / 2;

  const icons: Record<string, React.ReactElement> = {
    // 垫形 Cushion — 方形圆角，放射状刻面
    cushion: (
      <svg width={s} height={s} viewBox="0 0 40 40" fill="none" className={className}>
        <rect x="5" y="5" width="30" height="30" rx="7" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="10" y="10" width="20" height="20" rx="4" stroke="currentColor" strokeWidth="0.8"/>
        <line x1="5" y1="5" x2="10" y2="10" stroke="currentColor" strokeWidth="0.8"/>
        <line x1="35" y1="5" x2="30" y2="10" stroke="currentColor" strokeWidth="0.8"/>
        <line x1="5" y1="35" x2="10" y2="30" stroke="currentColor" strokeWidth="0.8"/>
        <line x1="35" y1="35" x2="30" y2="30" stroke="currentColor" strokeWidth="0.8"/>
        <line x1="20" y1="5" x2="20" y2="10" stroke="currentColor" strokeWidth="0.8"/>
        <line x1="20" y1="35" x2="20" y2="30" stroke="currentColor" strokeWidth="0.8"/>
        <line x1="5" y1="20" x2="10" y2="20" stroke="currentColor" strokeWidth="0.8"/>
        <line x1="35" y1="20" x2="30" y2="20" stroke="currentColor" strokeWidth="0.8"/>
        <circle cx="20" cy="20" r="3" stroke="currentColor" strokeWidth="0.8"/>
      </svg>
    ),

    // 椭圆 Oval — 椭圆明亮式
    oval: (
      <svg width={s} height={s} viewBox="0 0 40 40" fill="none" className={className}>
        <ellipse cx="20" cy="20" rx="13" ry="17" stroke="currentColor" strokeWidth="1.5"/>
        <ellipse cx="20" cy="20" rx="8" ry="11" stroke="currentColor" strokeWidth="0.8"/>
        <line x1="20" y1="3" x2="20" y2="9" stroke="currentColor" strokeWidth="0.8"/>
        <line x1="20" y1="37" x2="20" y2="31" stroke="currentColor" strokeWidth="0.8"/>
        <line x1="7" y1="20" x2="12" y2="20" stroke="currentColor" strokeWidth="0.8"/>
        <line x1="33" y1="20" x2="28" y2="20" stroke="currentColor" strokeWidth="0.8"/>
        <line x1="9" y1="11" x2="13" y2="14" stroke="currentColor" strokeWidth="0.8"/>
        <line x1="31" y1="11" x2="27" y2="14" stroke="currentColor" strokeWidth="0.8"/>
        <line x1="9" y1="29" x2="13" y2="26" stroke="currentColor" strokeWidth="0.8"/>
        <line x1="31" y1="29" x2="27" y2="26" stroke="currentColor" strokeWidth="0.8"/>
        <circle cx="20" cy="20" r="2.5" stroke="currentColor" strokeWidth="0.8"/>
      </svg>
    ),

    // 雷地恩 Radiant — 矩形切角
    radiant: (
      <svg width={s} height={s} viewBox="0 0 40 40" fill="none" className={className}>
        <polygon points="12,4 28,4 36,12 36,28 28,36 12,36 4,28 4,12" stroke="currentColor" strokeWidth="1.5"/>
        <polygon points="15,9 25,9 31,15 31,25 25,31 15,31 9,25 9,15" stroke="currentColor" strokeWidth="0.8"/>
        <line x1="12" y1="4" x2="15" y2="9" stroke="currentColor" strokeWidth="0.8"/>
        <line x1="28" y1="4" x2="25" y2="9" stroke="currentColor" strokeWidth="0.8"/>
        <line x1="36" y1="12" x2="31" y2="15" stroke="currentColor" strokeWidth="0.8"/>
        <line x1="36" y1="28" x2="31" y2="25" stroke="currentColor" strokeWidth="0.8"/>
        <line x1="28" y1="36" x2="25" y2="31" stroke="currentColor" strokeWidth="0.8"/>
        <line x1="12" y1="36" x2="15" y2="31" stroke="currentColor" strokeWidth="0.8"/>
        <line x1="4" y1="28" x2="9" y2="25" stroke="currentColor" strokeWidth="0.8"/>
        <line x1="4" y1="12" x2="9" y2="15" stroke="currentColor" strokeWidth="0.8"/>
        <rect x="14" y="14" width="12" height="12" stroke="currentColor" strokeWidth="0.6"/>
      </svg>
    ),

    // 梨形 Pear — 水滴形
    pear: (
      <svg width={s} height={s} viewBox="0 0 40 40" fill="none" className={className}>
        <path d="M20 36 C10 36 5 28 5 22 C5 14 12 8 20 4 C28 8 35 14 35 22 C35 28 30 36 20 36 Z" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M20 31 C13 31 9 25 9 21 C9 16 14 12 20 8 C26 12 31 16 31 21 C31 25 27 31 20 31 Z" stroke="currentColor" strokeWidth="0.8"/>
        <line x1="20" y1="4" x2="20" y2="8" stroke="currentColor" strokeWidth="0.8"/>
        <line x1="20" y1="36" x2="20" y2="31" stroke="currentColor" strokeWidth="0.8"/>
        <line x1="5" y1="22" x2="9" y2="21" stroke="currentColor" strokeWidth="0.8"/>
        <line x1="35" y1="22" x2="31" y2="21" stroke="currentColor" strokeWidth="0.8"/>
        <line x1="8" y1="14" x2="12" y2="16" stroke="currentColor" strokeWidth="0.8"/>
        <line x1="32" y1="14" x2="28" y2="16" stroke="currentColor" strokeWidth="0.8"/>
        <circle cx="20" cy="21" r="2.5" stroke="currentColor" strokeWidth="0.7"/>
      </svg>
    ),

    // 阿斯切 Asscher — 方形阶梯切割
    asscher: (
      <svg width={s} height={s} viewBox="0 0 40 40" fill="none" className={className}>
        <polygon points="11,4 29,4 36,11 36,29 29,36 11,36 4,29 4,11" stroke="currentColor" strokeWidth="1.5"/>
        <polygon points="14,8 26,8 32,14 32,26 26,32 14,32 8,26 8,14" stroke="currentColor" strokeWidth="0.8"/>
        <rect x="13" y="13" width="14" height="14" stroke="currentColor" strokeWidth="0.8"/>
        <line x1="11" y1="4" x2="14" y2="8" stroke="currentColor" strokeWidth="0.7"/>
        <line x1="29" y1="4" x2="26" y2="8" stroke="currentColor" strokeWidth="0.7"/>
        <line x1="36" y1="11" x2="32" y2="14" stroke="currentColor" strokeWidth="0.7"/>
        <line x1="36" y1="29" x2="32" y2="26" stroke="currentColor" strokeWidth="0.7"/>
        <line x1="29" y1="36" x2="26" y2="32" stroke="currentColor" strokeWidth="0.7"/>
        <line x1="11" y1="36" x2="14" y2="32" stroke="currentColor" strokeWidth="0.7"/>
        <line x1="4" y1="29" x2="8" y2="26" stroke="currentColor" strokeWidth="0.7"/>
        <line x1="4" y1="11" x2="8" y2="14" stroke="currentColor" strokeWidth="0.7"/>
      </svg>
    ),

    // 心形 Heart
    heart: (
      <svg width={s} height={s} viewBox="0 0 40 40" fill="none" className={className}>
        <path d="M20 34 L6 20 C3 17 3 12 6 9 C9 6 13 6 16 9 L20 13 L24 9 C27 6 31 6 34 9 C37 12 37 17 34 20 Z" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M20 28 L10 19 C8 17 8 14 10 12 C12 10 14 10 16 12 L20 16 L24 12 C26 10 28 10 30 12 C32 14 32 17 30 19 Z" stroke="currentColor" strokeWidth="0.8"/>
        <line x1="20" y1="13" x2="20" y2="16" stroke="currentColor" strokeWidth="0.8"/>
        <line x1="20" y1="34" x2="20" y2="28" stroke="currentColor" strokeWidth="0.8"/>
        <line x1="6" y1="20" x2="10" y2="19" stroke="currentColor" strokeWidth="0.8"/>
        <line x1="34" y1="20" x2="30" y2="19" stroke="currentColor" strokeWidth="0.8"/>
        <circle cx="20" cy="20" r="2" stroke="currentColor" strokeWidth="0.7"/>
      </svg>
    ),

    // 圆形 Round — 明亮式圆形
    round: (
      <svg width={s} height={s} viewBox="0 0 40 40" fill="none" className={className}>
        <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="20" cy="20" r="10" stroke="currentColor" strokeWidth="0.8"/>
        <circle cx="20" cy="20" r="3" stroke="currentColor" strokeWidth="0.8"/>
        {[0,30,60,90,120,150,180,210,240,270,300,330].map((deg) => {
          const rad = (deg * Math.PI) / 180;
          const x1 = 20 + 10 * Math.cos(rad);
          const y1 = 20 + 10 * Math.sin(rad);
          const x2 = 20 + 16 * Math.cos(rad);
          const y2 = 20 + 16 * Math.sin(rad);
          return <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="0.8"/>;
        })}
      </svg>
    ),

    // 祖母绿形 Emerald — 长方形阶梯
    emerald: (
      <svg width={s} height={s} viewBox="0 0 40 40" fill="none" className={className}>
        <polygon points="11,4 29,4 36,10 36,30 29,36 11,36 4,30 4,10" stroke="currentColor" strokeWidth="1.5"/>
        <polygon points="13,8 27,8 32,12 32,28 27,32 13,32 8,28 8,12" stroke="currentColor" strokeWidth="0.8"/>
        <rect x="12" y="14" width="16" height="12" stroke="currentColor" strokeWidth="0.8"/>
        <line x1="12" y1="17" x2="28" y2="17" stroke="currentColor" strokeWidth="0.6"/>
        <line x1="12" y1="20" x2="28" y2="20" stroke="currentColor" strokeWidth="0.6"/>
        <line x1="12" y1="23" x2="28" y2="23" stroke="currentColor" strokeWidth="0.6"/>
      </svg>
    ),

    // 凸圆形 Cabochon — 平滑弧顶，无刻面
    cabochon: (
      <svg width={s} height={s} viewBox="0 0 40 40" fill="none" className={className}>
        <ellipse cx="20" cy="20" rx="15" ry="11" stroke="currentColor" strokeWidth="1.5"/>
        <ellipse cx="20" cy="20" rx="10" ry="7" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2 2"/>
        <ellipse cx="20" cy="20" rx="5" ry="3.5" stroke="currentColor" strokeWidth="0.6" strokeDasharray="1.5 2"/>
        <path d="M8 17 Q20 10 32 17" stroke="currentColor" strokeWidth="0.8" fill="none"/>
      </svg>
    ),

    // 三角形 Trillion
    trillion: (
      <svg width={s} height={s} viewBox="0 0 40 40" fill="none" className={className}>
        <polygon points="20,4 36,33 4,33" stroke="currentColor" strokeWidth="1.5"/>
        <polygon points="20,10 31,29 9,29" stroke="currentColor" strokeWidth="0.8"/>
        <polygon points="20,16 26,26 14,26" stroke="currentColor" strokeWidth="0.8"/>
        <line x1="20" y1="4" x2="20" y2="10" stroke="currentColor" strokeWidth="0.8"/>
        <line x1="36" y1="33" x2="31" y2="29" stroke="currentColor" strokeWidth="0.8"/>
        <line x1="4" y1="33" x2="9" y2="29" stroke="currentColor" strokeWidth="0.8"/>
        <circle cx="20" cy="21" r="2" stroke="currentColor" strokeWidth="0.7"/>
      </svg>
    ),

    // 花式 Fancy — 马眼形 Marquise
    fancy: (
      <svg width={s} height={s} viewBox="0 0 40 40" fill="none" className={className}>
        <path d="M20 4 C28 10 36 16 36 20 C36 24 28 30 20 36 C12 30 4 24 4 20 C4 16 12 10 20 4 Z" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M20 9 C26 13 31 17 31 20 C31 23 26 27 20 31 C14 27 9 23 9 20 C9 17 14 13 20 9 Z" stroke="currentColor" strokeWidth="0.8"/>
        <line x1="20" y1="4" x2="20" y2="9" stroke="currentColor" strokeWidth="0.8"/>
        <line x1="20" y1="36" x2="20" y2="31" stroke="currentColor" strokeWidth="0.8"/>
        <line x1="4" y1="20" x2="9" y2="20" stroke="currentColor" strokeWidth="0.8"/>
        <line x1="36" y1="20" x2="31" y2="20" stroke="currentColor" strokeWidth="0.8"/>
        <line x1="8.5" y1="13" x2="13" y2="16" stroke="currentColor" strokeWidth="0.8"/>
        <line x1="31.5" y1="13" x2="27" y2="16" stroke="currentColor" strokeWidth="0.8"/>
        <line x1="8.5" y1="27" x2="13" y2="24" stroke="currentColor" strokeWidth="0.8"/>
        <line x1="31.5" y1="27" x2="27" y2="24" stroke="currentColor" strokeWidth="0.8"/>
        <circle cx="20" cy="20" r="2.5" stroke="currentColor" strokeWidth="0.7"/>
      </svg>
    ),
  };

  return icons[cut] ?? (
    <svg width={s} height={s} viewBox="0 0 40 40" fill="none" className={className}>
      <circle cx="20" cy="20" r="14" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  );
}
