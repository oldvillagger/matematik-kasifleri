import Link from "next/link";
import { TYMM_5_MATEMATIK } from "@matematik-kasifleri/curriculum";
import { REGIONS } from "./regions";

export default function HomePage() {
  const doc = TYMM_5_MATEMATIK;

  const regionStats = REGIONS.map((region) => {
    const outcomes = doc.outcomes.filter((o) => region.themeCodes.includes(o.themeCode));
    const themes = doc.themes.filter((t) => region.themeCodes.includes(t.code));
    return { region, outcomes, themes };
  });

  return (
    <main className="shell">
      <header className="hero">
        <span className="hero__kicker">Kâşif Günlüğü — 5. sınıf</span>
        <h1>Matematik, keşfedilecek bir kıta.</h1>
        <p>
          Her bölge bir fikri saklıyor. Terazi dengeyi kurunca, kareler bir odayı döşeyince,
          bir kural üç örnekte tekrar edince — matematik ortaya çıkıyor. Puan için değil,
          anlamak için oyna.
        </p>
      </header>

      <section className="map">
        {regionStats.map(({ region, outcomes, themes }) => {
          const sourced = outcomes.filter((o) => o.componentsSourced).length;
          const sizeClass =
            region.phase === "F0" ? "region-card--f0" : region.phase === "F1" ? "region-card--f1" : "region-card--f2";
          return (
            <Link key={region.slug} href={`/bolge/${region.slug}`} className={`region-card ${sizeClass}`}>
              <span className={`badge ${region.phase === "F0" ? "badge--building" : "badge--soon"}`}>
                {region.phase === "F0" ? "İnşa ediliyor" : "Yakında"}
              </span>
              <h2>{region.name}</h2>
              <span className="region-card__stat">
                {themes.length === 1 ? themes[0]?.title : `${themes.length} tema`} · {outcomes.length} öğrenme
                çıktısı · {sourced} kaynaklandı
              </span>
            </Link>
          );
        })}
      </section>
    </main>
  );
}
