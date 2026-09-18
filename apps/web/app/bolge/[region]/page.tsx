import Link from "next/link";
import { notFound } from "next/navigation";
import { TYMM_5_MATEMATIK } from "@matematik-kasifleri/curriculum";
import { REGIONS } from "../../regions";

export default async function RegionPage({ params }: { params: Promise<{ region: string }> }) {
  const { region: slug } = await params;
  const region = REGIONS.find((r) => r.slug === slug);
  if (!region) {
    notFound();
  }

  const doc = TYMM_5_MATEMATIK;
  const themes = doc.themes.filter((t) => region.themeCodes.includes(t.code));

  return (
    <main className="shell">
      <Link href="/" className="back-link">
        ← Haritaya dön
      </Link>
      <header className="hero" style={{ paddingBlockStart: 0 }}>
        <span className="hero__kicker">{region.phase === "F0" ? "İnşa ediliyor" : "Yakında"}</span>
        <h1>{region.name}</h1>
        <p>
          Bu bölgede henüz oynanabilir bir görev yok — motor ve manipülatifler kuruluyor
          (agents-notes/06-yol-haritasi.md). Aşağıda bu bölgenin öğreteceği şeylerin gerçek
          listesi var.
        </p>
      </header>

      {themes.map((theme) => {
        const outcomes = doc.outcomes.filter((o) => o.themeCode === theme.code);
        return (
          <section key={theme.code} className="theme-block">
            <h2>
              {theme.code} — {theme.title}
            </h2>
            {outcomes.map((outcome) => (
              <div key={outcome.code} className="outcome-row">
                <span className="outcome-row__code mono">{outcome.code}</span>
                <span>{outcome.title}</span>
              </div>
            ))}
          </section>
        );
      })}
    </main>
  );
}
