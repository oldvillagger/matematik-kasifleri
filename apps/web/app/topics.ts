/**
 * Which outcomes have a real, playable lesson right now (Faz 0, 4 konu).
 * Product-layer registry, not curriculum data — mirrors the pattern in the
 * old regions.ts (removed): lore/UI grouping lives here, official outcome
 * data stays in packages/curriculum.
 */
export interface Topic {
  outcomeCode: string;
  title: string;
  game: "balance" | "grid" | "pattern";
  accent: string;
  icon: "gate" | "tiles" | "fence" | "grid";
}

export const TOPICS: readonly Topic[] = [
  { outcomeCode: "MAT.5.2.1", title: "Yankı Kapısı", game: "balance", accent: "#2f5d50", icon: "gate" },
  { outcomeCode: "MAT.5.2.3", title: "Örüntü Anahtarı", game: "pattern", accent: "#a8752f", icon: "tiles" },
  { outcomeCode: "MAT.5.4.2", title: "Harita Kâşifi — Alan", game: "grid", accent: "#35566b", icon: "grid" },
  { outcomeCode: "MAT.5.4.1", title: "Harita Kâşifi — Çevre", game: "grid", accent: "#7a4a6b", icon: "fence" },
];

export function findTopic(outcomeCode: string): Topic | undefined {
  return TOPICS.find((t) => t.outcomeCode === outcomeCode);
}
