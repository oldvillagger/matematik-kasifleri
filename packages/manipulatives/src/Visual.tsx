"use client";

import type { VisualSpec } from "./types";

/**
 * A1'in tek görsel alfabesi. Rakam yok: bir taş "5" değildir, *büyük mor bir
 * altıgen*tir. Ağırlık/çokluk hissi boyut ve renk yoğunluğuyla verilir.
 */

const COLORS: Record<VisualSpec["color"], { fill: string; stroke: string }> = {
  violet: { fill: "#7c3aed", stroke: "#5a00c6" },
  cyan: { fill: "#4cd7f6", stroke: "#00687a" },
  emerald: { fill: "#4edea3", stroke: "#005b3d" },
  amber: { fill: "#f9a03c", stroke: "#b45309" },
  rose: { fill: "#fb7185", stroke: "#9f1239" },
  slate: { fill: "#cbdbf5", stroke: "#4a4455" },
};

const SIZES = { sm: 34, md: 50, lg: 70 } as const;

const PATHS: Record<VisualSpec["shape"], (s: number) => React.ReactNode> = {
  circle: (s) => <circle cx={s / 2} cy={s / 2} r={s / 2 - 3} />,
  square: (s) => <rect x={3} y={3} width={s - 6} height={s - 6} rx={s * 0.16} />,
  triangle: (s) => <polygon points={`${s / 2},4 ${s - 4},${s - 5} 4,${s - 5}`} />,
  diamond: (s) => <polygon points={`${s / 2},3 ${s - 3},${s / 2} ${s / 2},${s - 3} 3,${s / 2}`} />,
  hexagon: (s) => {
    const r = s / 2 - 3;
    const c = s / 2;
    const pts = Array.from({ length: 6 }, (_, i) => {
      const a = (Math.PI / 3) * i - Math.PI / 6;
      return `${(c + r * Math.cos(a)).toFixed(1)},${(c + r * Math.sin(a)).toFixed(1)}`;
    });
    return <polygon points={pts.join(" ")} />;
  },
  star: (s) => {
    const c = s / 2;
    const outer = s / 2 - 3;
    const inner = outer * 0.45;
    const pts = Array.from({ length: 10 }, (_, i) => {
      const r = i % 2 === 0 ? outer : inner;
      const a = (Math.PI / 5) * i - Math.PI / 2;
      return `${(c + r * Math.cos(a)).toFixed(1)},${(c + r * Math.sin(a)).toFixed(1)}`;
    });
    return <polygon points={pts.join(" ")} />;
  },
};

export function Visual({ spec, label }: { spec: VisualSpec; label?: string }) {
  const size = SIZES[spec.size ?? "md"];
  const { fill, stroke } = COLORS[spec.color];

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label={label ?? `${spec.size ?? "orta"} boy ${spec.shape}`}
      style={{ display: "block", filter: "drop-shadow(0 2px 3px rgba(11,28,48,0.18))" }}
    >
      <g fill={fill} stroke={stroke} strokeWidth={2.5} strokeLinejoin="round">
        {PATHS[spec.shape](size)}
      </g>
    </svg>
  );
}

/** Görsel taşın "ağırlığı" — terazi eğilmesini sürmek için, ekranda asla yazılmaz. */
export function visualWeight(spec: VisualSpec): number {
  return { sm: 1, md: 2, lg: 3 }[spec.size ?? "md"];
}
