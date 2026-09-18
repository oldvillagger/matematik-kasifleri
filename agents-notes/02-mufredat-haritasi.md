# 02 — Müfredat Haritası

TYMM 5. Sınıf Matematik: **6 tema kodu / 7 program teması, 23 öğrenme çıktısı, ~174 ders saati.**
Aşağıdaki kodlar resmî *TYMM Ortaokul Matematik Dersi Öğretim Programı (5-8. Sınıf)* PDF'inden **kod-kod çıkarıldı**, elle yazılmadı.

> Kod yapısı: `MAT.5.<tema>.<sıra>`. Program dokümanı kesirleri (MAT.5.1.3-4) ders planında ayrı bir tema gibi sunuyor; kod olarak Sayılar ve Nicelikler altında.

---

## 1. Tema ağırlıkları

| Tema | Kod ailesi | Çıktı | Ders saati | Ağırlık |
|---|---|---|---|---|
| Geometrik Şekiller | MAT.5.3.x | 7 | 38 | %21 |
| Sayılar ve Nicelikler (2) — Kesir/Ondalık/Yüzde | MAT.5.1.3-4 | 2 | 33 | %18 |
| Sayılar ve Nicelikler (1) — Doğal sayılar | MAT.5.1.1-2 | 2 | 28 | %16 |
| İstatistiksel Araştırma Süreci | MAT.5.5.x | 2 | 24 | %13 |
| Geometrik Nicelikler — Çevre/Alan | MAT.5.4.x | 4 | 20 | %11 |
| İşlemlerle Cebirsel Düşünme | MAT.5.2.x | 4 | 20 | %11 |
| Veriden Olasılığa | MAT.5.6.x | 2 | 9 | %5 |

**Planlama sonucu:** Ders saati ≠ çıktı sayısı. Geometrik Şekiller hem en çok çıktıya hem en çok saate sahip → **en büyük içerik yükü orada**, ama DGBL etkisinin en düşük olduğu alan da orası (g=0,43). Bu çelişki, geometri modüllerinin **hibrit (dijital + fiziksel araç)** tasarlanmasını zorunlu kılıyor. Detay: `04-oyun-tasarimi.md` §Pergel Adası.

---

## 2. 23 öğrenme çıktısı → modül eşlemesi

Sütunlar:
- **Mekanik uygunluğu**: çıktı doğrudan bir oyun mekaniğine gömülebiliyor mu?
- **Fiziksel katman**: paralel fiziksel görev zorunlu mu (Z), önerilir mi (Ö), gereksiz mi (—)?
- **Faz**: hangi sürümde yapılacak (`06-yol-haritasi.md`)

### Tema 1 — Sayılar ve Nicelikler

| Kod | Öğrenme çıktısı | Modül | Mekanik uygunluğu | Fiziksel | Faz |
|---|---|---|---|---|---|
| MAT.5.1.1 | Altı basamaklı sayıları okuma/yazmayı çok basamaklı sayılara genelleyebilme | Basamak Kulesi | Yüksek | Ö | F2 |
| MAT.5.1.2 | Doğal sayılar ve işlemler içeren gerçek yaşam problemlerini çözebilme | Basamak Kulesi / Çarşı | Orta — 9 süreç bileşeni, problem çözme süreci uzun | — | F2 |
| MAT.5.1.3 | Gerçek yaşam kesirlerini farklı biçimlerde temsil edebilme | Kesir Krallığı | Yüksek | Z (kâğıt katlama) | F2 |
| MAT.5.1.4 | Farklı gösterimlerle ifade edilen kesirlerin karşılaştırılmasına yönelik çıkarım | Kesir Krallığı | Yüksek | Ö | F2 |

### Tema 2 — İşlemlerle Cebirsel Düşünme ← **demo modülü burada**

| Kod | Öğrenme çıktısı | Modül | Mekanik uygunluğu | Fiziksel | Faz |
|---|---|---|---|---|---|
| **MAT.5.2.1** | **Eşitliğin korunumuna ve işlem özelliklerine yönelik çıkarım yapabilme** | **Denge Şehri** | **Çok yüksek — program zaten "kefeli terazi" diyor** | Ö (askı terazi) | **F0** |
| MAT.5.2.2 | İşlem önceliğini yorumlayabilme | Sıra Kapıları | Yüksek | — | F1 |
| MAT.5.2.3 | Sayı ve şekil örüntülerinin kuralına ilişkin muhakeme | Örüntü Bahçesi | Çok yüksek | Ö | F1 |
| MAT.5.2.4 | Temel aritmetik algoritmaları yorumlayabilme | Algoritma Atölyesi | Yüksek (blok tabanlı akış) | — | F2 |

### Tema 3 — Geometrik Şekiller (en ağır tema)

| Kod | Öğrenme çıktısı | Modül | Mekanik uygunluğu | Fiziksel | Faz |
|---|---|---|---|---|---|
| MAT.5.3.1 | Temel geometrik çizimler için matematiksel araç ve teknolojiden yararlanabilme | Pergel Adası | Yüksek (Euclidea tarzı inşa) | **Z** | F1 |
| MAT.5.3.2 | Temel geometrik çizimlere dayalı deneyimlerini yansıtabilme | Pergel Adası — Günlük | Düşük (yansıtma = üretim/anlatım) | **Z** | F2 |
| MAT.5.3.3 | Açıları ölçmek için araç ve teknolojiden yararlanabilme | Açı Kulesi | Yüksek (açıölçer = nişan aleti) | **Z** | F1 |
| MAT.5.3.4 | İki/üç doğrunun durumuna bağlı açılara dair çıkarım | Açı Kulesi | Çok yüksek (ışın/ayna bulmacası) | Ö | F1 |
| MAT.5.3.5 | Çokgenleri kesişen doğruların oluşturduğu kapalı şekiller olarak yorumlayabilme | Çokgen Fabrikası | Yüksek | Ö | F2 |
| MAT.5.3.6 | Çokgenlerin özellikleri ile ilgili deneyimleri yansıtabilme | Çokgen Fabrikası — Günlük | Düşük (yansıtma) | Ö | F2 |
| MAT.5.3.7 | Kesişen çember çiftiyle inşa edilen üçgenlerin kenar özelliklerine yönelik muhakeme | Pergel Adası — Usta Görevi | Çok yüksek (klasik inşa problemi) | **Z** | F2 |

### Tema 4 — Geometrik Nicelikler ← **demo modülü burada**

| Kod | Öğrenme çıktısı | Modül | Mekanik uygunluğu | Fiziksel | Faz |
|---|---|---|---|---|---|
| MAT.5.4.1 | Çevre uzunluğu verilen dikdörtgenin farklı alanlara sahip olabileceği | Birim Kare Atölyesi | Çok yüksek (döşeme bulmacası) | Ö (kareli kâğıt) | **F0** |
| **MAT.5.4.2** | **Birim karelerden yola çıkarak dikdörtgenin alanını değerlendirebilme** | **Birim Kare Atölyesi** | **Çok yüksek** | Ö | **F0** |
| MAT.5.4.3 | Alanı verilen dikdörtgenin farklı çevrelere sahip olabileceği | Birim Kare Atölyesi | Çok yüksek | Ö | **F0** |
| MAT.5.4.4 | Çevre ve alan ile ilgili problemleri çözebilme | Birim Kare Atölyesi — Sipariş | Yüksek | — | F1 |

### Tema 5 — İstatistiksel Araştırma Süreci

| Kod | Öğrenme çıktısı | Modül | Mekanik uygunluğu | Fiziksel | Faz |
|---|---|---|---|---|---|
| MAT.5.5.1 | Kategorik veri ile çalışabilme ve veriye dayalı karar verebilme | Veri Dedektifi | Yüksek (NPC anketi → grafik → karar) | Ö (sınıf anketi) | F1 |
| MAT.5.5.2 | Başkalarının kategorik veriye dayalı sonuçlarını tartışabilme | Veri Dedektifi — Yanıltıcı Grafik | Çok yüksek (hatayı bul türü) | — | F1 |

### Tema 6 — Veriden Olasılığa

| Kod | Öğrenme çıktısı | Modül | Mekanik uygunluğu | Fiziksel | Faz |
|---|---|---|---|---|---|
| MAT.5.6.1 | Bir olayın olasılığının 0 ile 1 arasında olduğu | Olasılık Çarşısı | Yüksek (0-1 cetveli) | Ö (zar/torba) | F2 |
| MAT.5.6.2 | Olayları az/çok olasılıklı şeklinde yapılandırabilme | Olasılık Çarşısı | Yüksek | Ö | F2 |

---

## 3. Süreç bileşenleri = ürünün asıl ölçme birimi

TYMM'nin en ayırt edici yanı: her öğrenme çıktısı **a, b, c, ç, d…** harfli süreç bileşenlerine ayrılmış. Örnek (MAT.5.2.1, resmî metin):

```
a) Eşitliğin korunumuna, doğal sayılarla toplama ve çarpma işlemlerinin değişme,
   birleşme; çarpmanın toplama ve çıkarma işlemleri üzerine dağılma özelliklerine
   yönelik varsayımlarda bulunur.
b) İncelediği örnekler üzerinden varsayımına yönelik genellemeleri belirler.
c) Elde ettiği genellemelerin varsayımını karşılayıp karşılamadığını çeşitli
   örnekler üzerinden sınar.
ç) Varsayımı ile ilgili ulaştığı sonuca yönelik doğrulayabileceği matematiksel bir
   önermeyi sözel ve sembolik temsil ile sunar.
d) Sunduğu önermenin katkısına yönelik gerekçe sunar.
```

Bu, ürün için iki şey demek:

1. **Rapor bunu bir fırsat olarak işaret etti ve haklı:** Öğretmenler yeni programda *beceri* ölçmekte zorlanıyor. Kâğıt sınav "a) varsayımda bulunur" bileşenini ölçemiyor. Bir yazılım ölçebilir — çünkü çocuğun terazi üzerinde yaptığı her hamleyi görür.

2. **Veri modeli buna göre kurulmalı.** İlerleme `%73 tamamlandı` olarak değil, **hangi süreç bileşeninin kanıtı toplandı** olarak tutulmalı.
   → `05-teknik-mimari.md` §İçerik Şeması, `ProcessComponentEvidence` kaydı.

**Mekanik → süreç bileşeni eşleme örneği (Denge Şehri / MAT.5.2.1):**

| Çocuğun yaptığı | Kanıtladığı bileşen |
|---|---|
| Teraziyi dengelemeden önce "sence hangisi ağır?" tahmini | a) varsayımda bulunur |
| 3 farklı eşitlikte aynı hamleyi tekrar etmesi | b) genellemeleri belirler |
| Kendi bulduğu kuralı yeni bir teraziye uygulaması | c) genellemenin varsayımı karşılayıp karşılamadığını sınar |
| Kuralı sembolik ifadeyle eşleştirmesi / yazması | ç) sözel-sembolik temsil ile sunar |
| "Neden işe yaradı?" sorusuna gerekçe seçmesi/yazması | d) gerekçe sunar |

Bu tablo her modül için `04-oyun-tasarimi.md` içinde tekrar üretilecek. **İçerik yazımının kabul kriteri budur:** bileşen kanıtı üretmeyen görev, içeriğe alınmaz.

---

## 4. Ölçme-değerlendirme çerçevesi

Resmî program ölçmeyi zaten "sürekli, çoklu araçlı" tanımlıyor: izleme testi, çalışma kâğıdı, performans görevi, öz değerlendirme formu, akran değerlendirme formu, poster/afiş, dijital sunum.

Ürün karşılıkları:

| MEB aracı | Ürün karşılığı |
|---|---|
| İzleme testi | Aşama 3 "Bağımsız Geri Çağır" — zamansız, ipucusuz |
| Çalışma kâğıdı | Yazdırılabilir fiziksel görev kâğıdı (paralel katman) |
| Performans görevi | Fiziksel inşa görevi + fotoğraf/çıktı yükleme |
| Öz değerlendirme | Haftalık **Kâşif Günlüğü** (kıyaslamasız) |
| Akran değerlendirme | F2 — veli/sınıf ortak görevi |
| Poster / dijital sunum | F2 — yansıtma çıktıları (MAT.5.3.2, MAT.5.3.6) için doğal ev |

> **Kritik:** MAT.5.3.2 ve MAT.5.3.6 çıktıları "**deneyimlerini yansıtabilme**" diyor. Bunlar oyunla ölçülemez — üretim ister. Bu iki çıktı için oyun değil, **yapılandırılmış günlük/sunum aracı** tasarlanacak. Bunu "oyunlaştırılamaz" diye atlamak müfredat kapsamında delik bırakır.
