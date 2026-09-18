# 09 — Arayüz Yeniden Tasarımı v2 (Oturum 002 devam 5 — düzeltme)

Bu doküman, kullanıcının Stitch zip'ini ("stitch_ilkogretim_etkilesimli_ogrenme_portali.zip",
sistem: "Vibrant Junior Learn") gerçek ekran görüntüleriyle incelemesinden sonra verdiği
**düzeltme talimatının** planı. Önceki oturumda (`00-oturum-gunlugu.md` devam 4) kurulan
LessonRunner/BalanceGame/GridGame/PatternGame **yanlış yorumlanmıştı** — bu doküman neyin
yanlış olduğunu ve doğrusunun ne olduğunu kayıt altına alıyor.

---

## 1. Ne yanlıştı

1. **A1'de (Keşfet) sayı gösterdim.** BalanceGame `5 = 2 3` gibi rakamlar gösteriyordu.
   Kullanıcının kastı: **A1 tamamen görsel/materyal tabanlı olmalı, hiç rakam olmamalı** —
   verdiği örnek görsel (ders kitabından "Öğrenme Yaşantısı-7": tekne/iskele resimleri,
   "kaç farklı yol çizilebilir" gibi tamamen görsel-uzamsal bir görev, rakam yok).
2. **Assessment/gerçek test aşaması hiç yoktu** — ben A3 ile Assessment'i aynı basit
   sayısal-cevap ekranıyla çözdüm. Kullanıcının verdiği "TYT Kimya" ekran görüntüsü, gerçek
   test aşamasının **nasıl görünmesi gerektiğinin** birebir referansı: soru numarası
   navigatörü (1-11 ızgara), çizim araçları, ana panelde soru + görsel + A-E şıkları,
   "AI Yardım" butonu, sağda "Ders İçeriği" ağacı (ünite/konu/test/video, ilerleme yüzdeleri,
   tamamlanma ikonları), "Sınavı Kaydet" butonu.
3. **Stitch tasarımının sadece renk/tipografi tokenlarını aldım, gerçek ekran yapılarını
   (code.html) hiç okumadım.** Kullanıcı "orda ne özellik varsa ne renk varsa birebir uy" dedi.
4. **Bilgi mimarisi (IA) yanlıştı.** Ben "ana menü → düz mesh grid → oyun" kurdum. Kullanıcının
   kastı ve Stitch tasarımının kendisi: **ana sayfa (ders kartları) → ders sayfası (ünite/konu
   akordiyonu, kilit/ilerleme durumlu, "akış şeklinde sağ tarafta ileki kademeler görünür") →
   konuya tıklayınca oyun/ders başlar.**
5. **Oyunlaştırma sistemlerini (Stitch'te var olan) hiç kurmadım** — puan, günlük seri,
   rozetler, hata kitapçığı, günlük hedef. Bunları önceki oturumda "kırmızı çizgilerle çelişiyor"
   diye bilerek atlamıştım ve kullanıcıya sormuştum. **Kullanıcı şimdi netleştirdi (aşağıda K14).**

---

## 2. K14 — Oyunlaştırma kararı (kırmızı çizgi override, kullanıcı onaylı)

CLAUDE.md'nin "Değiştirilemez kurallar" bölümü **kullanıcının kendi açık isteğiyle** kısmen
gevşetildi. Bu, önceki oturumda ben çelişkiyi flag'leyip sorduktan sonra kullanıcının verdiği
**bilinçli, bilgilendirilmiş bir ürün kararı** — sessizce yapılmadı.

| Sistem | Karar | Not |
|---|---|---|
| **Puan (Puan sayacı, üst bar)** | **EKLE** | Stitch'teki "1,450 Puan" göstergesi |
| **Günlük Hedef** ("3/5 Ders") | **EKLE** | Ana sayfa hero'sunda |
| **Öğrenme Serisi (streak, 🔥)** | **EKLE — ama admin panelden aç/kapa anahtarlı** | Kullanıcı: "seri mantığını ekle, istersek admin panelden açıp kapatırız. Bu duruma kullanıcılardan topladığımız başarı verisine göre karar vereceğim." → **varsayılan AÇIK, veri toplanınca karar gözden geçirilecek** |
| **Haftalık Liderlik Tablosu** | **ŞİMDİLİK YAPMA** | Kullanıcı açıkça erteledi |
| **Rozetler / Başarı Nişanları** | **EKLE** | Stitch'teki "18 Rozet" / "Kazanılan Başarı Nişanları" |
| **Hata Kitapçığı** (yanlış yapılan sorular, "Tekrar Çöz") | **EKLE** | Süreç bileşeni kanıt fikriyle **çelişmiyor** — aslında onu güçlendiriyor: "hangi bileşende hata var" listesi |
| **AI Yardım butonu** (test ekranında) | **PLANLA, şimdilik stub/backlog** | Gerçek bir LLM entegrasyonu; kapsam disiplini gereği Faz 0'da UI yer tutucu olarak durabilir, gerçek çağrı sonraki iş |
| **Canlı Soru-Cevap Odası** (öğretmenle sohbet) | **BACKLOG, yapılmıyor** | CLAUDE.md'nin "açık sohbet yok" kuralı hâlâ geçerli — bu farklı, öğretmen-moderasyonlu bir özellik ama altyapı gerektiriyor, kapsam dışı bırakıldı, kullanıcı bunu ayrıca istemedi |
| A1'de puan/skor gösterimi | **HÂLÂ YASAK** | Kullanıcı bunu değiştirmedi; puan/seri sistemi **genel navigasyonda** (üst bar, ana sayfa) gösterilir, **A1 oyun ekranının içinde değil** |
| Can/enerji sistemi, şans kutusu, reklam, ücretli kilit | **HÂLÂ YASAK** | Kullanıcı bunlara hiç değinmedi, önceki karar geçerli |

**CLAUDE.md'ye işlenmesi gereken değişiklik:** "Genel lider tablosu, seri (streak) baskısı...
yok" satırı → "Genel lider tablosu yok (backlog). **Seri (streak) sistemi VAR, admin panelden
aç/kapa anahtarlı, varsayılan açık — K14, kullanıcı onaylı override, veri toplanınca gözden
geçirilecek.**" şeklinde güncellenmeli.

---

## 3. Doğru bilgi mimarisi (IA)

```
/  (Ana Sayfa)
   Hero: "Hoş geldin {isim}!", Günlük Hedef ilerleme çubuğu
   Ders kartları (Matematik, Fen Bilimleri, Türkçe, ...) — ilerleme %'si, "Derse Git"
   Hızlı erişim: Bugünün Ödevleri, (Liderlik Tablosu YOK), Son Çözülen Test özeti
   Üst bar: Puan sayacı, 🔥 Seri sayacı (varsa), bildirim, profil

/matematik  (Ders Sayfası)
   Modül özeti: toplam ünite, konu anlatımı, test, çözülmüş soru sayısı, genel ilerleme %
   Ünite akordiyonu (Tüm Üniteler / Devam Edenler / Tamamlananlar sekmeleri):
     Ünite N (tamamlandı ✓ / şu an buradasın ▶ / kilitli 🔒)
       → Konu 1 (izlendi, "Notları Aç")
       → Konu 2 (kaldığın yer, "Derse Devam Et")
       → Test 1 (+puan, "Hemen Çöz")
   ("akış şeklinde sağ tarafta ileki kademeler görünür" — kullanıcının tarif ettiği tam bu)

/matematik/[konu]  (Oyun / Ders — LessonRunner, 3 FAZ)
   Faz 1 — Keşfet (A1): SAYI YOK, sadece görsel/materyal etkileşimi
   Faz 2 — Bağla (A2): sayı + grafik girer, YANLIŞ YOK — sistem ipucu/tüyo verir
   Faz 3 — Gerçek Teste Hazırlık (A3 + Assessment): Stitch'in test ekranı birebir
     (soru navigatörü + ana panel + "Ders İçeriği" sağ panel + Sınavı Kaydet)

/matematik/analiz  (Başarı ve Gelişim Karnem — Stitch "başarı takip" ekranı)
   Toplam soru, doğruluk %, ders süresi, rozet sayısı, seri
   Ders bazlı başarı grafiği (yatay çubuklar, % doğruluk)
   Hata Kitapçığı: yanlış yapılan sorular, süreç bileşeni etiketli, "Tekrar Çöz"

/admin/...  (İçerik Masası — mevcut, değişmedi)
   + yeni: Ayarlar sayfası → seri (streak) sistemi aç/kapa anahtarı (K14)
```

---

## 4. Faz içi 3-katmanlı görsel model (LessonRunner düzeltmesi)

Bu, kullanıcının orijinal "Önerilen Düzeltilmiş Mimari" (5 maddelik, ilk oturumda verilen)
ile şimdi birebir netleşti:

### Faz 1 — Keşfet (A1) — **SAYI YOK**
- Mevcut `BalanceGame`/`GridGame`/`PatternGame`'in A1 modları **yeniden yazılmalı**: taş/token
  üzerinde rakam **gösterilmeyecek** — renk/şekil/boyut ile ayırt edilecek (örn. büyük mavi
  blok vs küçük sarı blok), teraziye konunca gerçek zamanlı eğilme *hâlâ* olacak ama "5" yazısı
  yerine görsel ağırlık ipucu (blok büyüklüğü) kullanılacak.
- GridGame A1: "Alan: 6 birim kare" gibi sayısal okuma **gösterilmeyecek**, sadece döşeme
  animasyonu ve dolan/boş alan görseli.
- PatternGame A1: sayı dizisi yerine **renk/şekil örüntüsü** (🔵🔴🔵🔴?) kullanılacak.
- Kullanıcının verdiği ders kitabı örneği (tekne/iskele, "kaç farklı yol çizilebilir") gösteriyor
  ki bu seviyede asıl beklenen şey **çizim/yol bulma/uzamsal karşılaştırma** — ileride yeni bir
  "path/uzamsal" mekanik türü de eklenebilir (şimdilik mevcut 3 mekaniğin sayısız versiyonu
  yeterli, S1'de genişletilebilir).

### Faz 2 — Bağla (A2) — **sayı + grafik girer, hata yok, ipucu var**
- Rakamlar ve basit grafikler görünür (mevcut haliyle uyumlu — x=? sembolik geçiş, ızgara
  sayıları).
- **"Henüz dengede değil, tekrar dene" gibi kırmızı/hata rengi mesajlar kaldırılmalı.**
  Kullanıcı: "burda hata yoktur, tip verir sistem" — yanlış cevapta kırmızı uyarı yerine
  **otomatik bir ipucu/tüyo** gösterilecek (ceza değil, yönlendirme). Support-policy zaten bunu
  destekliyor (iki ardışık hata → support artar) — sadece UI'daki "wrong" renk/metin tonu
  yumuşatılmalı.

### Faz 3 — Gerçek Teste Hazırlık (A3 + Assessment) — **Stitch test ekranı birebir**
- `etkileşimli_test_ve_soru_zum_ekran/code.html` **okunup** birebir uyarlanmalı: sol soru
  numarası ızgarası (cevaplanan/cevaplanmayan/işaretli renk kodlaması — DESIGN.md §"Question
  Number Matrix"), orta panelde soru + görsel + seçenekler, sağda "Ders İçeriği" ağacı
  (bu oturumun konusunun ünite/konu/test listesi, ilerleme çubuklu), "AI Yardım" (stub),
  "Sınavı Kaydet" (bizim akışımızda: Assessment'i bitirip kanıt ekranına dönme).
- **Süre sınırı YOK** kuralı hâlâ geçerli — Stitch'in tasarımında görünür bir sayaç yok zaten
  (kontrol edildi, DESIGN.md'de time limit UI'ı belirtilmemiş), bu yüzden çelişki yok.
- Bizim görev tipleri (balance/grid/pattern) doğal olarak A-E çoktan seçmeli değil; bu ekranın
  "kabuğunu" (navigator + sidebar + kaydet) alıp içine kendi cevap mekanizmamızı (sayı girişi /
  seçim çipleri) oturtacağız — sahte A-E şıkkı uydurmayacağız.

---

## 5. Şu an ne var, ne eksik (bir sonraki oturumun TODO'su)

| # | İş | Durum |
|---|---|---|
| 1 | `BalanceGame`/`GridGame`/`PatternGame` A1 modlarından rakamları kaldır, görsel/şekil tabanlı yap | ❌ yapılmadı |
| 2 | A2'de "wrong" kırmızı mesajı kaldır, otomatik ipucu akışına çevir | ❌ yapılmadı |
| 3 | Gerçek test ekranı (soru navigatörü + sidebar + AI Yardım stub) — Stitch `code.html`'i okuyup birebir uyarla | ❌ yapılmadı |
| 4 | Ana sayfa: Stitch'teki "E-Eğitim Genç" düzenine birebir uy (hero, ders kartları, hızlı erişim — liderlik tablosu HARİÇ) | ❌ yapılmadı |
| 5 | Ders sayfası: düz mesh yerine ünite/konu akordiyon akışı | ❌ yapılmadı — mevcut `/[subject]/page.tsx` tamamen değişecek |
| 6 | Puan + Seri (streak, admin togglelı) + Rozet veri modeli — muhtemelen `engine-core`'a veya yeni bir `packages/progression` paketine | ❌ yapılmadı |
| 7 | Hata Kitapçığı ekranı (`/matematik/analiz`) | ❌ yapılmadı |
| 8 | Admin ayarlar sayfası: streak aç/kapa | ❌ yapılmadı |
| 9 | CLAUDE.md kırmızı çizgi satırını K14'e göre güncelle | ❌ yapılmadı (bu oturumda, hemen sonra yapılacak) |
| 10 | 4 konunun içindeki "yakında" etiketi kaldırılmış olmalı (zaten mesh'te 4 seçilen konuda yoktu, akordiyonda da olmayacak) | ✅ zaten doğru davranış, korunacak |

**Mevcut çalışan alt yapı (değişmeden kalacak):** `packages/engine-core` (cra-machine,
support-policy, evidence) — pedagojik motor doğru, sadece **UI katmanı** yanlıştı.
`packages/content-schema` ve 4 konunun görev JSON'u da geçerli, sadece oyun bileşenlerinin
A1 render mantığı değişecek (JSON şeması muhtemelen bir `visualOnly`/ikon alanı kazanacak).

---

## 6. Kaynak dosyalar (bir sonraki oturumda okunacak)

Zip, proje kökünde `stitch_i_lk_retim_etkile_imli_renme_portal.zip` (gitignore'da, commit'e
girmiyor). İçindeki 4 ekran + kod:

- `e_e_itim_5._s_n_f_dersler_ana_sayfa/code.html` — ana sayfa
- `5._s_n_f_matematik_nite_konu_listesi/code.html` — ders/ünite/konu akordiyon sayfası
- `etkile_imli_test_ve_soru_z_m_ekran/code.html` — gerçek test ekranı
- `ba_ar_takip_ve_hata_kitap_analizi/code.html` — analiz/hata kitapçığı sayfası
- `vibrant_junior_learn/DESIGN.md` — zaten okundu, `packages/ui-kit/src/tokens.css`'e işlendi

**Not:** Bu oturumda sadece `screen.png`'ler (ekran görüntüleri) incelendi, `code.html`'ler
**henüz okunmadı**. Bir sonraki oturumda "birebir uy" için önce bu 4 `code.html` dosyası
okunup gerçek class/CSS yapısı çıkarılmalı, sonra uygulanmalı.
