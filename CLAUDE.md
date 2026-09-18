# CLAUDE.md

Bu dosya Claude Code tarafından her oturumda otomatik okunur. Projeye yeni giren bir ajanın
bilmesi gereken minimum bilgi burada; ayrıntı `agents-notes/` altında.

---

## Proje nedir

**Matematik Kâşifleri** — TYMM (Türkiye Yüzyılı Maarif Modeli) 5. sınıf matematik müfredatıyla
başlayan, oyun tabanlı bir öğrenme motoru. Ticari ürün. Staj yerinin mevcut eğitim yazılımına
**entegre edilecek** — yani teslim edilen şey bir web sitesi değil, başka bir platforma
gömülebilen bir öğrenme motoru.

**Önemli:** Ürün TYMM matematiğe kilitli değil. Mimari baştan **çok-derslik/çok-konulu bir
platform** olacak şekilde kuruluyor (bkz. `agents-notes/08-genisletilmis-platform-mimarisi.md`) —
TYMM 5. sınıf matematik bu platformun ilk doldurulmuş kursu. Yeni ders/konu eklemek kod yazmayı
gerektirmemeli; bu yüzden içerik yönetimi için bir **admin panel** (`apps/studio`) mimarisi de
baştan tasarlanıyor, önceliği Faz 2'den öne çekildi.

**Durum (2026-09-18, oturum 003):** `09-arayuz-yeniden-tasarim-v2.md` §5 TODO listesi
**uygulandı.** 4 konu Stitch tasarımına birebir uyarlanmış üç fazlı akışla uçtan uca
oynanabilir: **Faz 1 Keşfet (rakamsız, tamamen görsel)** → **Faz 2 Bağla (sayılar girer,
yanlış yok, sistem ipucu açar)** → **Faz 3 Gerçek Teste Hazırlık (Stitch test ekranı:
soru matrisi + karalama tahtası + Ders İçeriği paneli)**. Puan/günlük hedef/seri/rozet/hata
kitapçığı var, admin panelden (`/admin/ayarlar`) açılıp kapanıyor. `pnpm build` temiz,
38 test geçiyor. Detay: `agents-notes/09-arayuz-yeniden-tasarim-v2.md` + oturum günlüğü.

---

## Önce şunları oku (bu sırayla)

| Sıra | Dosya | Ne için |
|---|---|---|
| 0 | `agents-notes/09-arayuz-yeniden-tasarim-v2.md` | **EN GÜNCEL — arayüz sözleşmesi: 3 faz, Stitch birebir uyum, K14/K15** |
| 1 | `README.md` | Ürünün ne olduğu, 3 ilke, mimari özet |
| 2 | `agents-notes/00-oturum-gunlugu.md` | Alınan 7 karar + **cevaplanmamış 5 açık soru** |
| 3 | `agents-notes/03-pedagojik-mimari.md` | Çekirdek döngü + **yasaklı desenler** (§5 — kırmızı çizgi) |
| 4 | `agents-notes/05-teknik-mimari.md` | Yığın kararı, monorepo yapısı, içerik şeması, ADR'ler |
| 5 | `agents-notes/06-yol-haritasi.md` | Şu an hangi sprintteyiz, kabul kriterleri ne |
| 6 | `agents-notes/08-genisletilmis-platform-mimarisi.md` | **Oturum 002 kararları** — çok-derslik jenerik veri modeli, admin panel, Konu Sonu Testi |

Görev bir modülün oyun mekaniğine dokunuyorsa → `agents-notes/04-oyun-tasarimi.md` (müfredat
eşlemesi hâlâ geçerli) + `agents-notes/09-oyun-konseptleri-v2.md` (varsa — yaratıcı konsept
yeniden tasarımı, `08` §4)
Görev bir öğrenme çıktısına dokunuyorsa → `agents-notes/02-mufredat-haritasi.md` +
`agents-notes/kaynaklar/tymm-5-matematik-ciktilari.md`
Görev veri/kullanıcı/gizlilik ile ilgiliyse → `agents-notes/07-ticari-kvkk-entegrasyon.md`
Görev içerik modeli / admin panel / yeni ders ekleme ile ilgiliyse → `agents-notes/08-genisletilmis-platform-mimarisi.md`

---

## Değiştirilemez kurallar

Bunlar tercih değil, pedagojik/etik sınır. Bir değişiklik bunlardan birini ihlal ediyorsa
**yapma, önce kullanıcıya sor.** Gerekçeler `agents-notes/03-pedagojik-mimari.md` §5'te.

- **A3 (soyut) ve ASSESSMENT (Konu Sonu Testi) aşamalarında süre sınırı olamaz.** `timeLimit`
  alanı şemada bu ikisi için tanımlı değildir ve tanımlanmayacaktır. Süreli matematik testi
  kaygı üretiyor. **K15 (2026-09-18):** Stitch test ekranında çalışan bir 14:25 geri sayım
  sayacı vardı; "tasarıma birebir uy" talimatıyla çakıştığı kullanıcıya bildirildi ve kullanıcı
  **sayacı koymama** kararı verdi. Test ekranında sayaç yerine "Süre sınırı yok" rozeti ve
  "n / m Soru" ilerlemesi var. Bu, tasarımdan bilinçli ve tek sapmadır.
  (Opsiyonel, varsayılan kapalı, veli/öğretmen açarsa görünen süreli pratik modu
  Faz 2 backlog'unda — bkz. `agents-notes/08-genisletilmis-platform-mimarisi.md` §3. Bu backlog
  maddesi bu kuralı bozmaz çünkü ayrı ve isteğe bağlıdır.)
- **A1 (somut/Keşfet) aşamasında RAKAM olamaz.** Puan, skor, kırmızı X, "yanlış" sesi de yok.
  Hata diegetic olmalı: terazi eğilir, çerçeve dolar. Görevler tamamen görsel dille kurulur
  (şekil/renk/boyut) — bu kural `content-schema`'daki `a1IsNumberless` refine'ı ile **şema
  düzeyinde zorlanır**, içerik yazarı yanlışlıkla sayı koyamaz.
- **A2 (Bağla) aşamasında "yanlış" geri bildirimi olamaz.** Kırmızı uyarı yerine sistem
  ipucunu kendiliğinden açar (Stitch'in "Pratik İpucu" kutusu). Kullanıcı talimatı:
  "burda hata yoktur, tip verir sistem."
- **Genel lider tablosu yok (backlog — kullanıcı erteledi).** **Seri (streak) sistemi VAR**
  — kullanıcının 2026-09-18 tarihli açık, bilgilendirilmiş kararıyla (K14,
  `agents-notes/09-arayuz-yeniden-tasarim-v2.md` §2) bu kural gevşetildi: admin panelden
  aç/kapa anahtarlı (`/admin/ayarlar` → `content/settings.json`), varsayılan açık, kullanıcı
  davranış verisi toplanınca gözden geçirilecek. Puan sayacı, rozetler, hata kitapçığı da
  **eklendi** (aynı karar, `packages/progression`). **A1 oyun ekranının içinde puan/seri
  gösterilmez ve A1 hiç puan vermez** (`STAGE_POINTS.A1 = 0`, testli) — bunlar genel
  navigasyonda (üst bar, ana sayfa) kalır, bu ayrım değişmedi. Can/enerji sistemi, şans kutusu
  **hâlâ yasak.**
- **Öğrenme içeriğini kilitleyen ücretli katman yok.** Ödeme yalnızca kozmetik olabilir.
- **Çocuğa gösterilen satın alma çağrısı yok, reklam yok, açık sohbet yok.**
- **Çocuktan e-posta, tam ad, doğum tarihi, konum toplanmaz.** Takma ad + sınıf düzeyi.
- **Öğrenme çıktısı kodu uydurulamaz.** Geçerli kodların tek kaynağı
  `agents-notes/kaynaklar/tymm-5-matematik-ciktilari.md` (23 kod: MAT.5.1.1 – MAT.5.6.2).

---

## Tasarım testi (her yeni mekanik için)

> **Mekaniği çıkarınca matematik kalıyor mu?** Kalıyorsa mekanik bir kabuktur — at.
> **Matematiği çıkarınca oyun kalıyor mu?** Kalıyorsa yine kabuktur — at.
> İkisi ayrılamıyorsa mekanik doğrudur.

Bu proje, "oyun oynarsın, arada soru çıkar" kalıbından kaçınmak için var. Matematik oyunun
**ödülü** değil, **mekaniğinin kendisi** olmalı.

---

## Mimari — kritik sınır

```
packages/engine-core/   ⭐ saf TypeScript. React YOK, DOM YOK, ağ YOK. VAR (2026-09-18).
                           cra-machine + support-policy + evidence, testli (9 test).
packages/curriculum/    TYMM verisi (23 çıktı, süreç bileşenleri). JSON tabanlı yükleyici. VAR.
packages/content-schema/Zod şemaları (task.ts) + loader.ts. Kırmızı çizgiler burada zorlanır. VAR.
packages/manipulatives/ React: BalanceGame ("Yankı Kapısı"), GridGame ("Harita Kâşifi"),
                           PatternGame ("Örüntü Anahtarı") + Visual.tsx (A1'in rakamsız
                           görsel alfabesi) + shell.tsx (ortak Prompt/HintCard/AnswerPad).
                           Her oyun `stage` prop'u alır; görsel dil tamamen ona bağlı. VAR.
packages/progression/   ⭐ saf TypeScript. Puan, günlük hedef, seri (streak), rozet, hata
                           kitapçığı. React/DOM/ağ YOK. 15 test. VAR (2026-09-18).
packages/ui-kit/        Eski tasarım tokenları — artık yalnızca /admin'in elle yazılmış CSS'i
                           kullanıyor. Öğrenci tarafı Tailwind + Stitch config'i kullanır.
apps/web/               Next.js 15 + **Tailwind v3** (config = Stitch'in kendi config'inin
                           birebir kopyası, `tailwind.config.cjs`). TEK uygulama:
                             app/(site)/   öğrenci kabuğu — `/`, `/[subject]`,
                                           `/[subject]/[outcome]`, `/[subject]/analiz`
                             app/admin/    içerik masası + `/admin/ayarlar` (K14 anahtarları)
                             app/lib/      ProgressProvider, SiteChrome, course, settings, topics
content/matematik/tymm-5/tasks/  4 konunun görev JSON'u (MAT.5.2.1, 5.2.3, 5.4.1, 5.4.2).
content/settings.json            Oyunlaştırma anahtarları (admin panel yazar).
```

**`engine-core` içine React, DOM API'si veya ağ çağrısı eklemek mimariyi bozar.** Bu paketin
saf kalması, motorun staj yerinin platformuna gömülebilmesinin tek sebebi.

**Yeni görev eklemek kod yazmayı gerektirmez** — `content/` altına JSON eklenir,
`content-schema`'nın `TaskSchema`/`AssessmentSchema`'sı (ve `loadLesson`) doğrular. **Not:**
ayrı bir `pnpm content:lint` CLI komutu henüz yazılmadı — şema zaten var ve `loadLesson` her
görevi parse ederken zorluyor (uyumsuz JSON atılırsa throw eder), CLI sarmalayıcı ilerideki iş.

---

## Görsel kimlik

Kullanıcının verdiği Stitch tasarımına ("Vibrant Junior Learn") **birebir uyuluyor** — sadece
renk değil, ekran düzenleri de. Kaynak: proje kökündeki
`stitch_i_lk_retim_etkile_imli_renme_portal.zip` (gitignore'da) içindeki 4 ekranın
`code.html` dosyaları. Token'lar `apps/web/tailwind.config.cjs`'e **hiç değiştirilmeden**
kopyalandı (`primary`, `surface-container-lowest`, `font-label-md`, `space-md` … adları aynı),
böylece Stitch markup'ı doğrudan taşınabiliyor. İkonlar Material Symbols Outlined.

**Tasarımdan bilinçli sapmalar** (hepsi kullanıcı onaylı, gerekçeli):
1. **Geri sayım sayacı yok** — K15, kırmızı çizgi (yukarıda).
2. **Haftalık liderlik tablosu yok** — K14, kullanıcı erteledi. Ana sayfada o kartın yerinde
   "Kanıt Panom" var (hangi süreç bileşeni kanıtlandı).
3. **Canlı Soru-Cevap Odası kartı görsel olarak duruyor ama pasif** — arkasında öğretmen
   altyapısı yok; kullanıcı "görsel olarak koy, pasif" dedi.
4. **Sahte A–E şıkkı uydurulmadı** — test ekranının kabuğu birebir, içindeki cevap widget'ı
   görevin kendi tipinden geliyor (sayı girişi / görsel seçim).
5. Boş ders kartı yok: Stitch'te 5 ders vardı, bizde gerçek içeriği olan Matematik + onun
   6 ünitesi gösteriliyor.

## Çalışma kuralları

- **Yığın:** TypeScript (strict) · Next.js 15 · React 19 · **Tailwind v3** · Framer Motion ·
  Zod · pnpm + Turborepo · Vitest. Prisma/Postgres yok — Faz 0'da öğrenci ilerlemesi
  `localStorage`'da (`mk.progress.v1`), ayarlar `content/settings.json`'da.
  **Tailwind kararı (K16, 2026-09-18):** Stitch tasarımı Tailwind ile yazılmış; "birebir uy"
  talimatını karşılamanın tek dürüst yolu aynı config'i kullanmaktı. `/admin` hâlâ elle
  yazılmış `admin.css` kullanıyor, ona dokunulmadı.
- **Test komutu:** `pnpm -r test` şu an paketleri doğru bulamıyor (bilinen aksaklık);
  paket paket çalıştır: `pnpm --filter @matematik-kasifleri/<paket> test`.
- **Dil:** Kod ve teknik yorumlar İngilizce; dokümanlar, içerik ve kullanıcıya görünen her
  metin Türkçe. Çocuğa görünen metinlerde kaygı kelimeleri yok ("sınav", "yanlış",
  "başarısız", "kaybettin" → "usta görevi", "bu sefer olmadı", "tekrar bak").
- **`engine-core` testsiz değişmez.** Destek azaltma politikası ve zorluk merdiveni birer
  pedagojik iddiadır; test edilmemiş pedagoji uygulanmamış pedagojidir.
- **Kapsam disiplini:** Faz 0 kapsamı (`06-yol-haritasi.md`) sözleşme sayılır. Yeni fikirler
  `07-ticari-kvkk-entegrasyon.md` §7 backlog'una yazılır, yapılmaz. Kapsam patlaması bu
  projenin bir numaralı riski.
- **Erişilebilirlik isteğe bağlı değil:** Sürükle-bırak tek etkileşim yolu olamaz (dokunma ve
  klavye alternatifi şart). Hedef WCAG 2.2 AA.

---

## Yaptığın işi kaydet

Önemli bir analiz, karar veya mimari değişiklik yaptıysan
**`agents-notes/00-oturum-gunlugu.md` dosyasına yeni bir oturum bölümü ekle** (kararı ve
*gerekçesini*). Bu proje tek kişilik ve devredilebilir olmalı; gerekçesi yazılmamış karar,
sonraki oturumda yeniden tartışılır.

---

## Cevaplanmamış sorular (bunlara dayanan iş yapma, önce sor)

1. ~~Staj yerinin mevcut platformunun yığını ne?~~ **Şimdilik gündem dışı** — kullanıcı: "entegrasyonu
   şuan düşünmeye gerek yok" (2026-09-18). Entegrasyon senaryosu tasarımına (Senaryo A/B/C,
   `05-teknik-mimari.md` §7) şimdi zaman harcanmayacak; `engine-core`'un çerçeveden bağımsız
   kalması zaten bu kararı erken vermeyi gereksiz kılıyor.
2. ~~Kullanıcı kim — B2B mi B2C mi?~~ **Kapandı** — kullanıcı: "lisans kısmı entegre edilecek
   sistemde zaten var, düşünme" (2026-09-18). Lisans/abonelik/kullanıcı yönetimi **bizim
   kapsamımızda değil**; motor, host sistemin zaten sahip olduğu bir lisans/kimlik yapısına
   gömülecek. Bu, `07-ticari-kvkk-entegrasyon.md` §3'teki B2B/B2C mimarisini de gereksiz kılıyor
   — kendi auth/faturalama sistemimizi tasarlamıyoruz.
3. Hedef cihaz? (okul tableti / Chromebook / veli telefonu)
4. İçeriği kim üretecek — editör paneli gerekli mi? **Kısmen cevaplandı** — admin panel (K11,
   `08-genisletilmis-platform-mimarisi.md`) öncelik kazandı, ama "kim kullanacak" (öğretmen mi,
   içerik ekibi mi) hâlâ açık.
5. Repo public kalacak mı? (ticari ürün + staj sözleşmesi fikri mülkiyet maddesi)
6. ~~MAT.5.4.x süreç bileşenleri~~ **Kapandı (2026-09-18)** — resmî `tymm.meb.gov.tr` portalından
   23 çıktının tamamı için süreç bileşenleri bulundu ve işlendi. Detay: `agents-notes/kaynaklar/README.md`.
