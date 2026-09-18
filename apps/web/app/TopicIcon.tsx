export function TopicIcon({ icon, accent }: { icon: "gate" | "tiles" | "fence" | "grid"; accent: string }) {
  const common = { width: 56, height: 56, viewBox: "0 0 56 56", fill: "none" };
  switch (icon) {
    case "gate":
      return (
        <svg {...common} aria-hidden="true">
          <rect x="6" y="10" width="16" height="36" rx="4" fill={accent} opacity="0.85" />
          <rect x="34" y="10" width="16" height="36" rx="4" fill={accent} />
          <path d="M22 28 H34" stroke="#ece3cc" strokeWidth="2.5" strokeDasharray="3 3" />
        </svg>
      );
    case "tiles":
      return (
        <svg {...common} aria-hidden="true">
          <rect x="4" y="22" width="12" height="12" rx="3" fill={accent} opacity="0.6" />
          <rect x="20" y="22" width="12" height="12" rx="3" fill={accent} opacity="0.8" />
          <rect x="36" y="22" width="12" height="12" rx="3" fill={accent} />
          <path d="M40 14 l4 4 -4 4" stroke={accent} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "grid":
      return (
        <svg {...common} aria-hidden="true">
          {[0, 1, 2].map((r) =>
            [0, 1, 2, 3].map((c) => (
              <rect key={`${r}-${c}`} x={4 + c * 12} y={8 + r * 12} width="10" height="10" rx="2" fill={accent} opacity={0.5 + (r + c) * 0.06} />
            )),
          )}
        </svg>
      );
    case "fence":
      return (
        <svg {...common} aria-hidden="true">
          <rect x="8" y="14" width="40" height="28" rx="3" fill="none" stroke={accent} strokeWidth="3" strokeDasharray="5 4" />
          <rect x="20" y="22" width="16" height="12" rx="2" fill={accent} opacity="0.7" />
        </svg>
      );
  }
}
