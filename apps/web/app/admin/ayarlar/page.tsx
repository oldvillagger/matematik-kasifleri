import Link from "next/link";
import { loadSettings } from "../../lib/settings";
import { saveProgressionSettings } from "./actions";

export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ kaydedildi?: string }>;
}) {
  const settings = await loadSettings();
  const { kaydedildi } = await searchParams;

  return (
    <main className="admin-shell">
      <p className="admin-top-strip">
        <Link href="/admin">İçerik Masası</Link> · Ayarlar
      </p>
      <h1>Oyunlaştırma Ayarları</h1>
      <p>
        Bu anahtarlar <code>content/settings.json</code> dosyasına yazılır ve öğrenci arayüzünü anında
        etkiler. Kapatılan bir sistem öğrenciye hiç gösterilmez; toplanan veri silinmez.
      </p>

      {kaydedildi === "1" && <p className="admin-flash">Ayarlar kaydedildi.</p>}

      <form action={saveProgressionSettings} className="admin-form">
        <label className="admin-toggle">
          <input type="checkbox" name="streakEnabled" defaultChecked={settings.streakEnabled} />
          <span>
            <strong>Öğrenme Serisi (streak 🔥)</strong>
            <small>
              Üst bardaki gün sayacı, ders sayfasındaki seri kartı ve karnedeki 7 günlük çubuk. Karar K14:
              varsayılan açık, öğrenci başarı verisi toplandıktan sonra yeniden değerlendirilecek. Kapatmak
              çocuğun ilerlemesini etkilemez.
            </small>
          </span>
        </label>

        <label className="admin-toggle">
          <input type="checkbox" name="pointsEnabled" defaultChecked={settings.pointsEnabled} />
          <span>
            <strong>Puan sayacı</strong>
            <small>
              Üst bardaki puan göstergesi ve test ekranındaki “+10 Puan” rozeti. Keşfet (A1) aşamasında
              bu ayardan bağımsız olarak hiçbir zaman puan gösterilmez — pedagojik kırmızı çizgi.
            </small>
          </span>
        </label>

        <label className="admin-field">
          <span>
            <strong>Günlük hedef (konu/gün)</strong>
            <small>Ana sayfadaki “Günlük Hedefin 3 / 5 Konu” çubuğunun hedefi. 1–20 arası.</small>
          </span>
          <input type="number" name="dailyGoalTarget" min={1} max={20} defaultValue={settings.dailyGoalTarget} />
        </label>

        <div className="admin-note">
          <strong>Kapatılamayan şeyler (kırmızı çizgi):</strong> A3 ve Konu Sonu Testi’nde süre sınırı,
          genel lider tablosu, can/enerji sistemi, şans kutusu, reklam ve ücretli içerik kilidi. Bunlar
          ayar değil, ürün sınırıdır (CLAUDE.md).
        </div>

        <button type="submit" className="admin-save">
          Ayarları Kaydet
        </button>
      </form>
    </main>
  );
}
