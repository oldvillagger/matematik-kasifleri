/**
 * The map's 5 regions. This is OUR product lore, not MEB data — it groups
 * official themes (packages/curriculum) into the explorer-map layout from
 * agents-notes/04-oyun-tasarimi.md. Kept in apps/web, not in the curriculum
 * package, which stays official-data-only.
 */
export interface Region {
  slug: string;
  name: string;
  themeCodes: string[];
  /** Faz 0 demo scope (agents-notes/06-yol-haritasi.md) gets built first. */
  phase: "F0" | "F1" | "F2";
}

export const REGIONS: readonly Region[] = [
  { slug: "denge-meydani", name: "Denge Meydanı", themeCodes: ["MAT.5.2"], phase: "F0" },
  { slug: "birim-kare-atolyesi", name: "Birim Kare Atölyesi", themeCodes: ["MAT.5.4"], phase: "F0" },
  { slug: "pergel-adasi", name: "Pergel Adası ve Açı Kulesi", themeCodes: ["MAT.5.3"], phase: "F1" },
  { slug: "sayi-limani", name: "Sayı Limanı", themeCodes: ["MAT.5.1"], phase: "F2" },
  { slug: "veri-carsisi", name: "Veri Çarşısı", themeCodes: ["MAT.5.5", "MAT.5.6"], phase: "F1" },
];
