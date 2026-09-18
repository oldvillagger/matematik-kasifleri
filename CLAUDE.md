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

**Durum:** Planlama tamamlandı, kod henüz yazılmadı. Sıradaki iş Faz 0 / Sprint S0.1
(monorepo iskeleti kısmen kuruldu — bkz. `agents-notes/00-oturum-gunlugu.md` Oturum 002).

---

## Önce şunları oku (bu sırayla)

| Sıra | Dosya | Ne için |
|---|---|---|
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
  kaygı üretiyor. (Opsiyonel, varsayılan kapalı, veli/öğretmen açarsa görünen süreli pratik modu
  Faz 2 backlog'unda — bkz. `agents-notes/08-genisletilmis-platform-mimarisi.md` §3. Bu backlog
  maddesi bu kuralı bozmaz çünkü ayrı ve isteğe bağlıdır.)
- **A1 (somut) aşamasında puan, skor, kırmızı X, "yanlış" sesi olamaz.** Hata diegetic
  olmalı: terazi eğilir, köprü sallanır.
- **Genel lider tablosu, seri (streak) baskısı, can/enerji sistemi, şans kutusu yok.**
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
packages/engine-core/   ⭐ saf TypeScript. React YOK, DOM YOK, ağ YOK.
                           CRA aşama makinesi, destek azaltma, kanıt üretimi.
                           Bu paket başka platformlara taşınacak — bağımlılık ekleme.
packages/curriculum/    TYMM verisi (23 çıktı, süreç bileşenleri). Bağımlılığı yok.
packages/content-schema/Zod şemaları. Kırmızı çizgiler burada CI'da zorlanır.
packages/manipulatives/ React bileşenleri: terazi, birim kare ızgarası, pergel, açıölçer.
apps/web/               Next.js 15 kabuk.
content/mat-5/          Görevler JSON olarak — kod değil.
```

**`engine-core` içine React, DOM API'si veya ağ çağrısı eklemek mimariyi bozar.** Bu paketin
saf kalması, motorun staj yerinin platformuna gömülebilmesinin tek sebebi.

**Yeni görev eklemek kod yazmayı gerektirmez** — `content/` altına JSON eklenir,
`pnpm content:lint` doğrular.

---

## Çalışma kuralları

- **Yığın:** TypeScript (strict) · Next.js 15 · React 19 · Tailwind 4 · PostgreSQL + Prisma ·
  pnpm + Turborepo · Vitest + Playwright
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
