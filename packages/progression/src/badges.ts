import type { Badge, BadgeId, ProgressState } from "./types";

export const BADGES: Record<BadgeId, Badge> = {
  "ilk-adim": { id: "ilk-adim", title: "İlk Adım", emoji: "🌱", description: "İlk konunu tamamladın." },
  "denge-ustasi": { id: "denge-ustasi", title: "Denge Ustası", emoji: "⚖️", description: "Yankı Kapısı konusunu bitirdin." },
  "oruntu-avcisi": { id: "oruntu-avcisi", title: "Örüntü Avcısı", emoji: "🔷", description: "Örüntü Anahtarı konusunu bitirdin." },
  "harita-kasifi": { id: "harita-kasifi", title: "Harita Kâşifi", emoji: "🗺️", description: "Alan ve çevre konularını bitirdin." },
  "kanit-toplayici": { id: "kanit-toplayici", title: "Kanıt Toplayıcı", emoji: "🔎", description: "10 süreç bileşenini kanıtladın." },
  "seri-5": { id: "seri-5", title: "Beş Gün Üst Üste", emoji: "🔥", description: "5 gün aralıksız çalıştın." },
  "hatasini-duzelten": { id: "hatasini-duzelten", title: "Hatasını Düzelten", emoji: "🛠️", description: "Hata kitapçığından bir soruyu tekrar çözüp düzelttin." },
};

const OUTCOME_BADGES: ReadonlyArray<{ id: BadgeId; outcomes: readonly string[] }> = [
  { id: "denge-ustasi", outcomes: ["MAT.5.2.1"] },
  { id: "oruntu-avcisi", outcomes: ["MAT.5.2.3"] },
  { id: "harita-kasifi", outcomes: ["MAT.5.4.1", "MAT.5.4.2"] },
];

/**
 * Durumdan hangi rozetlerin hak edildiğini türetir. Rozet "verilmez",
 * durumdan *okunur* — böylece sıralama/zamanlama hatası rozet kaybettiremez.
 */
export function earnedBadges(state: ProgressState): BadgeId[] {
  const earned: BadgeId[] = [];

  if (state.completedOutcomes.length > 0) earned.push("ilk-adim");

  for (const rule of OUTCOME_BADGES) {
    if (rule.outcomes.every((code) => state.completedOutcomes.includes(code))) earned.push(rule.id);
  }

  if (state.provenComponents.length >= 10) earned.push("kanit-toplayici");
  if (state.streak.best >= 5) earned.push("seri-5");
  if (state.mistakes.some((m) => m.resolved)) earned.push("hatasini-duzelten");

  return earned;
}
