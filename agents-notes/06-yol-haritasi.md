# 06 — Yol Haritası

Başlangıç: **18 Eylül 2026**

Faz 0'ın tek amacı **staj yerine sunulacak, çalışan, ikna edici bir demo**. Ürün değil, kavram kanıtı. Faz 0'ı şişirmek bu projenin en olası ölüm sebebidir — bu yüzden kapsam bilinçli olarak dar tutuldu.

---

## Faz 0 — Staj Demosu (3 hafta: 18 Eylül → 9 Ekim 2026)

### Kapsam

| Var | Yok |
|---|---|
| 2 modül: **Denge Şehri** (MAT.5.2.1), **Birim Kare Atölyesi** (MAT.5.4.1-3) | Diğer 10 modül |
| Tam A1→A2→A3 döngüsü, ikisinde de | Uyarlanabilir model, aralıklı tekrar |
| Süreç bileşeni kanıt kaydı | Gerçek veritabanı (localStorage + IndexedDB yeterli) |
| Basit öğretmen görünümü (tek çocuğun kanıt tablosu) | Çok kullanıcılı panel, sınıf yönetimi |
| Yazdırılabilir fiziksel görev kâğıdı (2 adet) | Fotoğraf yükleme |
| Karargâh + harita + Kâşif Kartı (ilk 10 kart) | Avatar özelleştirme, hikâye bölümleri |
| Gerçek kimlik yok — demo kullanıcısı | Auth, KVKK akışı (gerçek veri yok çünkü) |

### Sprintler

**S0.1 — Temel (18-24 Eylül)**
- [ ] pnpm + Turborepo monorepo iskeleti, TS strict, ESLint, Vitest, CI
- [ ] `packages/curriculum`: 23 çıktı + süreç bileşenleri veri olarak (PDF'lerden çıkarıldı, doğrulandı)
- [ ] `packages/content-schema`: Zod şemaları + `content:lint` (kırmızı çizgi kuralları dâhil)
- [ ] `packages/engine-core`: `cra-machine`, `support-policy`, `evidence` — **testleriyle birlikte**
- [ ] `apps/web`: Next.js iskeleti, tasarım token'ları, Tailwind
- **Çıktı:** boş ama doğru iskelet; `pnpm test` yeşil

**S0.2 — Denge Şehri (25 Eylül – 1 Ekim)**
- [ ] `manipulatives/balance-scale`: sürükle-bırak + dokunma alternatifi + klavye, spring animasyonlu eğilme
- [ ] A1: serbest keşif + ön tahmin + **Çift El eldiveni** açılışı
- [ ] A2: terazi → şema → sembol geçişi, `support` 1.0→0.0 azaltması
- [ ] A3: "Usta Sınavı", zamansız/ipucusuz, 5 soru + 1 açık uçlu
- [ ] 18 görev içeriği (6 × 3 aşama)
- [ ] Kanıt kaydı: MAT.5.2.1 a/b/c/ç/d
- **Çıktı:** tek modül baştan sona oynanabilir

**S0.3 — Birim Kare + Kabuk (2-8 Ekim)**
- [ ] `manipulatives/unit-grid`: döşeme, satır kopyalama, çevre/alan okuma
- [ ] 3 sipariş türü (alanı bul / 24 karo tüm dikdörtgenler / 20 m çit)
- [ ] 18 görev içeriği
- [ ] Karargâh + harita + Kâşif Kartı ekranı
- [ ] Öğretmen görünümü: süreç bileşeni kanıt tablosu
- [ ] 2 yazdırılabilir fiziksel görev kâğıdı (PDF)
- [ ] Erişilebilirlik geçişi (axe temiz), mobil/tablet düzen kontrolü
- **Çıktı:** tek linkle paylaşılabilen demo

**S0.4 — Sunum (9 Ekim)**
- [ ] `docs/sunum.md` — 10 slaytlık anlatı
- [ ] 2 dakikalık ekran kaydı (internet olmayan toplantı ihtimaline karşı)
- [ ] README'de "5 dakikada dene" bölümü

### Faz 0 kabul kriterleri

1. Bir yetişkin, hiç açıklama olmadan Denge Şehri'ni açıp **90 saniye içinde** eşitliğin korunumunu keşfedebiliyor.
2. A1'de hiçbir yerde puan, süre, kırmızı X görünmüyor.
3. A2'de destek gerçekten azalıyor ve **geri de artabiliyor** (iki ardışık hatada).
4. A3'te şemada `timeLimit` alanı **tanımlı bile değil**.
5. Öğretmen görünümü, "MAT.5.2.1-ç henüz kanıtlanmadı" diyebiliyor.
6. `pnpm content:lint` her görevin gerçek bir süreç bileşenine bağlı olduğunu doğruluyor.
7. Demo, düşük-orta bir Android tablette akıcı çalışıyor.

### Sunumun anlatısı (staj yerine)

> 1. TYMM 2024-2025 ile müfredat beceri temelli oldu; öğretmenler **süreç bileşenlerini ölçemiyor**.
> 2. Araştırma: oyunlaştırma (puan/rozet) küçük etki yapıyor; matematiği oyunun mekaniği yapmak büyük etki yapıyor.
> 3. Bu yüzden matematiği ödül değil, mekanik yaptık. **[demoyu aç, Çift El'i göster]**
> 4. Oyundan teste geçiş sıçrama değil, CRA köprüsü. **[A1→A2→A3'ü göster]**
> 5. Ve bu, MEB'in kendi programının tarif ettiği etkinlik: *"kefeli terazi… sanal manipülatifler"* — **[resmî PDF'ten alıntıyı göster]**
> 6. Yan ürün: öğretmenin kâğıtla ölçemediği süreç bileşeni verisi. **[kanıt tablosunu göster]**
> 7. Ve bu bir sayfa değil, gömülebilir bir motor — sizin platformunuza şu üç yoldan girer. **[entegrasyon şeması]**

---

## Faz 1 — MVP (Ekim–Aralık 2026)

**Amaç:** Sınıf pilotuna girebilecek gerçek ürün.

- Modüller: + Pergel Adası, Açı Kulesi, Örüntü Bahçesi, Sıra Kapıları, Veri Dedektifi (toplam 7 modül, ~13 çıktı)
- PostgreSQL + Prisma, gerçek kalıcılık
- Kimlik: sınıf kodu + görsel parola (çocuk), e-posta (öğretmen/veli)
- **KVKK akışı: veli açık rızası, aydınlatma metni, veri saklama politikası** — bkz. `07`
- Öğretmen paneli: sınıf ısı haritası, süreç bileşeni kırılımı, yazdırılabilir materyaller
- Aralıklı tekrar (3/7/21 gün)
- Veli görünümü: haftalık özet, ekran süresi kontrolü, bildirim ayarları (varsayılan kapalı)
- PWA + çevrimdışı
- **Entegrasyon:** Senaryo B (iframe + postMessage) çalışır hâlde
- 5-8 çocukla kullanılabilirlik testi + bulguların işlenmesi

**Faz 1 çıkış kriteri:** Bir öğretmen, hiç destek almadan sınıfını kurup bir çıktıyı baştan sona işletebiliyor.

---

## Faz 2 — Kapsam tamamlama ve pilot (Ocak–Nisan 2027)

- Kalan 5 modül → **23 çıktının tamamı kapsanır**
- MAT.5.3.2 / MAT.5.3.6 için **yansıtma aracı** (günlük/sunum) — oyun değil
- Fiziksel görev fotoğraf yükleme (KVKK değerlendirmesi sonrası)
- Hikâye bölümleri, avatar/karargâh özelleştirme
- Veli-çocuk kooperatif görevleri
- `apps/studio`: içerik editörü (öğretmen/editör kendi görevini üretebilir)
- Uyarlanabilir zorluk: telemetri birikince Elo/BKT değerlendirmesi
- **Okul pilotu (2. dönem, Şubat 2027)** — 2-3 sınıf, kâğıt-kalem ön/son test ile transfer ölçümü
- LTI 1.3 (Senaryo C) gerekiyorsa

---

## Faz 3 — Ticarileşme (2027 yazı → 2027-2028 öğretim yılı)

- 6. sınıfa genişleme (aynı motor, yeni müfredat verisi + temalandırma — mimari bunun için kuruldu)
- Okul/kurum lisans yönetimi, faturalama
- Çok kiracılı (multi-tenant) mimari
- Öğretmen eğitimi materyalleri, satış demosu
- Erişilebilirlik ve güvenlik denetimi (dış)

---

## Riskler ve karşılıkları

| Risk | Erken uyarı işareti | Karşılık |
|---|---|---|
| **Kapsam patlaması** (en yüksek olasılık) | Faz 0'da 3. modül konuşulmaya başlanırsa | Faz 0 kapsam tablosu sözleşme kabul edilir; yeni fikir `07-backlog`'a yazılır, yapılmaz |
| Manipülatif tasarımı beklenenden zor | Terazi 1 haftada bitmezse | SVG + basit fizik; gerçek fizik motoru yok. Gerekirse A1 basitleşir, A2/A3 korunur |
| Matematiğin kabuk kalması | "Bunu bir platform oyununa çevirsek" cümlesi | Her mekanik için §0 testi; kod incelemesinde zorunlu |
| Staj yerinin stack'i uyumsuz çıkması | — | Mimari zaten üç senaryoyu destekliyor; motor etkilenmez (`05` §7) |
| KVKK gecikmesi Faz 1'i bloklar | Faz 1 ortasında rıza akışı hâlâ yoksa | Faz 0'da gerçek veri toplanmıyor; KVKK işi Faz 1 başında paralel başlatılır, sona bırakılmaz |
| İçerik üretimi geliştirmeden yavaş | Faz 1'de modül hazır, görev yoksa | Görev üreteçleri (parametrik) S0.1'de değil ama Faz 1 başında yazılır |
| Tek kişilik proje / staj süresi biterse | — | `agents-notes/` bu yüzden var: karar gerekçeleri devredilebilir |

---

## Ölçülecekler (ürün sağlığı)

Faz 1'den itibaren, "kaç kullanıcı" değil bunlar:

- **Öğrenme:** A2 çıkışında `support=0` ile çözüm oranı; A2→A3 başarı düşüşü (≤15 puan hedef)
- **Bağlılık:** 4. hafta / 1. hafta oturum süresi oranı (yenilik etkisi sönüyor mu?)
- **Kapsama:** Kanıtlanan süreç bileşeni / toplam bileşen
- **Kaygı:** A3 öncesi/sonrası duygu ölçeri (opsiyonel, atlanabilir)
- **Öğretmen değeri:** Panelin yazdırılan materyal sayısı — kullanılmayan panel, yapılmamış panel
