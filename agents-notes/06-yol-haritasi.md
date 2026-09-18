# 06 — Yol Haritası

Başlangıç: **18 Eylül 2026**

Faz 0'ın amacı **çalışan, ikna edici bir kavram kanıtı**. Ürün değil, kavram kanıtı. Faz 0'ı
şişirmek bu projenin en olası ölüm sebebidir — bu yüzden kapsam bilinçli olarak dar tutuldu.

> **2026-09-18 güncellemesi (Oturum 002):** Bu doküman, o oturumda alınan K8–K12 kararlarına göre
> güncellendi. Değişenler: (1) modül isimleri artık sabit değil — "Denge Şehri" gibi spesifik
> konseptler yerine öğrenme çıktısı kodları kullanılıyor, yaratıcı konsept seçimi bekleniyor
> (K8, `08-genisletilmis-platform-mimarisi.md` §4); (2) içerik modeli baştan çok-derslik/jenerik
> (K10); (3) admin panel (`apps/studio`) önceliği Faz 2'den öne çekildi ve **iskeleti zaten
> kuruldu** (K11); (4) yeni bir `ASSESSMENT` içerik tipi eklendi (K12); (5) entegrasyon senaryosu
> ve lisans/B2B-B2C tasarımı **gündem dışı bırakıldı** — host sistemde zaten var (`CLAUDE.md`
> "Cevaplanmamış sorular" 1-2).

---

## Faz 0 — Kavram Kanıtı (18 Eylül → 9 Ekim 2026 hedef)

### Kapsam

| Var | Yok |
|---|---|
| 2 modül: **MAT.5.2.1** (eşitliğin korunumu) + **MAT.5.4.1-4** (çevre/alan) — isimleri K8 sonrası netleşecek | Diğer modüller (bkz. `02-mufredat-haritasi.md` faz sütunu) |
| Tam A1→A2→A3→**Assessment** döngüsü (K12), ikisinde de | Uyarlanabilir model, aralıklı tekrar |
| Süreç bileşeni kanıt kaydı | Gerçek veritabanı (localStorage + IndexedDB yeterli) |
| Admin panel: içerik gezgini + tam CRUD (**zaten var**, K11) | Çok kullanıcılı roller, yetkilendirme |
| Yazdırılabilir fiziksel görev kâğıdı (2 adet) | Fotoğraf yükleme |
| Karargâh + harita + Kâşif Kartı (ilk 10 kart) | Avatar özelleştirme, hikâye bölümleri |
| Gerçek kimlik yok — demo kullanıcısı | Auth, KVKK akışı, entegrasyon (gündem dışı) |

### Sprintler ve gerçek durum

**S0.1 — Temel** — **kısmen tamam**
- [x] pnpm + Turborepo monorepo iskeleti, TS strict, ESLint
- [x] `packages/curriculum`: 23 çıktının **tamamı**, resmî `tymm.meb.gov.tr` portalından ve MEB
      PDF'lerinden doğrulanmış süreç bileşenleriyle — JSON tabanlı, çok-derslik mimariye uygun
      (K10)
- [x] `apps/studio`: admin panel iskeleti — tema/çıktı listesi + tam düzenlenebilir form
      (K11, plandan önde)
- [x] `apps/web`: Next.js iskeleti + `packages/ui-kit` tasarım kimliği ("Kâşif Günlüğü")
- [ ] `packages/content-schema`: Zod şemaları + `content:lint` (kırmızı çizgi kuralları +
      `ASSESSMENT` stage, K12) — **yapılmadı, sıradaki iş**
- [ ] `packages/engine-core`: `cra-machine`, `support-policy`, `evidence` — testleriyle birlikte
      — **yapılmadı**
- [ ] Vitest + CI kurulmadı
- **Çıktı (hedef):** `pnpm test` yeşil — **henüz karşılanmadı**

**S0.1.5 — Yaratıcı konsept kararı (yeni, K8 gereği)**
- [ ] MAT.5.2.1 için oyun konsepti seçimi (Yankı Kapısı / İkiz Vinç / başka)
- [ ] MAT.5.4.1-4 için oyun konsepti seçimi (Harita Kâşifi / Işık Bahçesi / başka)
- [ ] Seçilenler `agents-notes/09-oyun-konseptleri-v2.md`'ye yazılır, `04-oyun-tasarimi.md`'nin
      müfredat eşlemesi korunur, sadece konsept/isim/görsel katmanı değişir
- **Çıktı:** S0.2'ye başlamadan önce bu karar netleşmeli — motor mekaniği tasarıma göre şekillenir

**S0.2 — İlk modül (MAT.5.2.1)**
- [ ] `packages/manipulatives`: seçilen konseptin çekirdek etkileşimi (sürükle-bırak + dokunma
      alternatifi + klavye, spring animasyonlu geri bildirim)
- [ ] A1: serbest keşif + ön tahmin + "güç" açılışı (eski adıyla Çift El — eşitliğin korunumu
      aksiyomu)
- [ ] A2: manipülatif → şema → sembol geçişi, `support` 1.0→0.0 azaltması (iki yönlü)
- [ ] A3: zamansız/ipucusuz geri çağırma
- [ ] **Assessment:** modül tamamlanınca açılan 8-10 sorulu Konu Sonu Testi (K12)
- [ ] 18+ görev içeriği (a/b/c/ç/d süreç bileşenlerinin her biri için)
- **Çıktı:** tek modül baştan sona oynanabilir

**S0.3 — İkinci modül (MAT.5.4.1-4) + kabuk**
- [ ] `packages/manipulatives`: ikinci konseptin çekirdek etkileşimi
- [ ] Sipariş/görev türleri (alan bul / sabit alan-değişken çevre / sabit çevre-değişken alan)
- [ ] 18+ görev içeriği + Assessment
- [ ] Karargâh + harita + Kâşif Kartı ekranı (temel iskeleti `apps/web`'de var, oyun bağlanacak)
- [ ] Admin panelin "İçerik (görevler)" bölümü gerçek task editörüne dönüşür (content-schema
      hazır olduğunda)
- [ ] 2 yazdırılabilir fiziksel görev kâğıdı (PDF)
- [ ] Erişilebilirlik geçişi (axe temiz), mobil/tablet düzen kontrolü
- **Çıktı:** tek linkle paylaşılabilen demo

**S0.4 — Sunum**
- [ ] `docs/sunum.md` — anlatı
- [ ] Ekran kaydı
- [ ] README'de "5 dakikada dene" bölümü

### Faz 0 kabul kriterleri

1. Bir yetişkin, hiç açıklama olmadan ilk modülü açıp **90 saniye içinde** çekirdek fikri
   keşfedebiliyor.
2. A1'de hiçbir yerde puan, süre, kırmızı X görünmüyor.
3. A2'de destek gerçekten azalıyor ve **geri de artabiliyor** (iki ardışık hatada).
4. A3 ve Assessment'te şemada `timeLimit` alanı **tanımlı bile değil**.
5. Admin panel, "MAT.5.2.1-ç henüz kanıtlanmadı" diyebiliyor (zaten gösteriyor — kaynak
   verisi tam).
6. `pnpm content:lint` her görevin gerçek bir süreç bileşenine bağlı olduğunu doğruluyor.
7. Demo, düşük-orta bir Android tablette akıcı çalışıyor.

---

## Faz 1 — MVP

**Amaç:** Sınıf pilotuna girebilecek gerçek ürün.

- Modüller: kalan yüksek-öncelikli çıktılar (bkz. `02-mufredat-haritasi.md` Faz sütunu)
- PostgreSQL + Prisma, gerçek kalıcılık
- Kimlik: sınıf kodu + görsel parola (çocuk) — **lisans/kullanıcı yönetimi host sistemde,
  bizim kapsamımızda değil** (`CLAUDE.md` açık soru 2, kapandı)
- **KVKK akışı: veli açık rızası, aydınlatma metni, veri saklama politikası** — bkz. `07`
- `apps/studio`: salt-okunur gezgin → **tam admin panel** (S0.1'de zaten başladı, burada olgunlaşır)
  — süreç bileşeni kırılımı, yazdırılabilir materyaller
- Aralıklı tekrar (3/7/21 gün)
- Veli görünümü: haftalık özet, ekran süresi kontrolü, bildirim ayarları (varsayılan kapalı)
- PWA + çevrimdışı
- **Entegrasyon:** gündeme alınmadı, gerektiğinde `05-teknik-mimari.md` §7'deki üç senaryodan
  biri seçilir — motor çerçeveden bağımsız olduğu için mimari şimdiden hazır
- 5-8 çocukla kullanılabilirlik testi + bulguların işlenmesi

**Faz 1 çıkış kriteri:** Bir öğretmen/editör, hiç destek almadan admin panelden yeni bir görev
ekleyip yayınlayabiliyor; bir öğrenci bir çıktıyı baştan sona işletebiliyor.

---

## Faz 2 — Kapsam tamamlama, çok-derslik genişleme ve pilot

- Kalan modüller → **TYMM 5. sınıf matematiğin 23 çıktısının tamamı kapsanır**
- **İkinci ders/kurs eklenir** (K10 mimarisinin ilk gerçek testi) — `tymm.meb.gov.tr` portalı
  aynı yöntemle taranır (`agents-notes/kaynaklar/README.md`), kod değişikliği gerekmez
- MAT.5.3.2 / MAT.5.3.6 için **yansıtma aracı** (günlük/sunum) — oyun değil
- Fiziksel görev fotoğraf yükleme (KVKK değerlendirmesi sonrası)
- Hikâye bölümleri, avatar/karargâh özelleştirme
- Veli-çocuk kooperatif görevleri
- **Opsiyonel süreli pratik modu** (backlog, `08` §3) — varsayılan kapalı, A3/Assessment'in
  süresiz kuralını bozmaz
- Uyarlanabilir zorluk: telemetri birikince Elo/BKT değerlendirmesi
- **Okul pilotu** — kâğıt-kalem ön/son test ile transfer ölçümü
- LTI 1.3 gerekirse (entegrasyon gündeme gelirse)

---

## Faz 3 — Ticarileşme

- Ek sınıf seviyelerine genişleme (mimari bunun için kuruldu — K10)
- Okul/kurum lisans yönetimi, faturalama — **eğer host sistem bunu sağlamıyorsa**
- Çok kiracılı (multi-tenant) mimari
- Öğretmen eğitimi materyalleri, satış demosu
- Erişilebilirlik ve güvenlik denetimi (dış)

---

## Riskler ve karşılıkları

| Risk | Erken uyarı işareti | Karşılık |
|---|---|---|
| **Kapsam patlaması** (en yüksek olasılık) | Faz 0'da 3. modül konuşulmaya başlanırsa | Faz 0 kapsam tablosu sözleşme kabul edilir; yeni fikir `07-backlog`'a yazılır, yapılmaz |
| Manipülatif tasarımı beklenenden zor | İlk modül 1 haftada bitmezse | SVG + basit fizik; gerçek fizik motoru yok. Gerekirse A1 basitleşir, A2/A3 korunur |
| Matematiğin kabuk kalması | "Bunu bir platform oyununa çevirsek" cümlesi | Her mekanik için CLAUDE.md'deki tasarım testi; kod incelemesinde zorunlu |
| Oyun konsepti kararı gecikirse S0.2 bloklanır | S0.1.5 bir haftadan uzun sürerse | İki seçenek de zaten tasarlandı (bu oturumda); karar bir sonraki oturumda hızlı verilmeli |
| İçerik üretimi geliştirmeden yavaş | Modül hazır, görev yoksa | Görev üreteçleri (parametrik) planlanmalı |
| Tek kişilik proje | — | `agents-notes/` bu yüzden var: karar gerekçeleri devredilebilir |

---

## Ölçülecekler (ürün sağlığı)

Faz 1'den itibaren, "kaç kullanıcı" değil bunlar:

- **Öğrenme:** A2 çıkışında `support=0` ile çözüm oranı; A2→A3 başarı düşüşü (≤15 puan hedef)
- **Bağlılık:** 4. hafta / 1. hafta oturum süresi oranı (yenilik etkisi sönüyor mu?)
- **Kapsama:** Kanıtlanan süreç bileşeni / toplam bileşen
- **Kaygı:** A3/Assessment öncesi/sonrası duygu ölçeri (opsiyonel, atlanabilir)
- **İçerik editörü değeri:** Admin panelden eklenen/düzenlenen görev sayısı — kullanılmayan
  panel, yapılmamış panel
