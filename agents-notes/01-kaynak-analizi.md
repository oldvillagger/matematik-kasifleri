# 01 — Kaynak Analizi

Bu doküman, projeye girdi olan araştırmanın **ne dediğini değil, bizim ondan ne aldığımızı** kayıt altına alır. Rapor iki sürüm hâlinde geldi ve aralarında ciddi mimari fark var; hangisini neden aldığımız burada.

---

## 1. Girdi kaynakları

| Kaynak | Tür | Güven | Kullanım |
|---|---|---|---|
| `TYMM Ortaokul Matematik Dersi Öğretim Programı (5-8)` | **Resmî MEB** | Birincil / bağlayıcı | Öğrenme çıktısı kodları, süreç bileşenleri, öğrenme-öğretme uygulamaları |
| `TYMM 5. Sınıf Öğrenme Çıktıları ve Süreç Bileşenleri` | Resmî (TTKB) | Birincil | Süreç bileşenlerinin (a, b, c, ç…) tam metni |
| `TYMM 5. Sınıf Matematik Ders Planı` | Resmî | İkincil | Ders saati dağılımı, etkinlik formatı |
| `Araştırma Raporu.pdf` (**v2**) | AI destekli sentez | İkincil | Pedagojik mimari, meta-analiz özetleri |
| `Araştırma Raporu-1.pdf` (**v1**) | AI destekli sentez | Üçüncül | Kesir Krallığı örneği (fikir olarak saklandı) |
| Sohbet ekran görüntüleri | Tartışma kaydı | — | Mimarinin son düzeltmesi |

> **Not:** Raporlardaki etki büyüklükleri (Hedges' g) ve meta-analiz atıfları doğrudan doğrulanmadı. Tasarım kararlarında **yön göstergesi** olarak kullanıldılar, ürün pazarlamasında sayısal iddia olarak kullanılmamalı. Staja sunumda "araştırma şunu gösteriyor" derken kaynak listesi eklenmeli, sayı okunmamalı.

---

## 2. İki rapor sürümü arasındaki fark

### v1 — 5 Aşamalı Geçiş Modeli
```
1. Keşif Oyunu → 2. Rehberli Görev → 3. Bağımsız Misyon → 4. Mini-Sınama → 5. Sınav Hazırlığı
```
- Örnek modül: **Kesir Krallığı** (MAT.5.1.3 / MAT.5.1.4)
- 7 TYMM temasına **birebir 7 krallık**, her biri kendi hikâye evreni

### v2 — 3 Aşamalı CRA Çekirdek Döngüsü
```
1. Keşfet/Manipüle Et (Somut) → 2. Temsile ve Sembole Bağla (Yarı-soyut) → 3. Bağımsız Geri Çağır (Soyut)
```
- Örnek modül: **Denge Şehri** (İşlemlerle Cebirsel Düşünme)
- 23 çıktı için **tek yeniden kullanılabilir şablon**, her çıktıya özgün evren değil

### Neden v2?

| Konu | v1 sorunu | v2 çözümü |
|---|---|---|
| Aşama sayısı | "Mini-sınama" ve "sınav hazırlığı" ayrı aşama sayılmış — ikisi de aynı şeyin (geri çağırma) farklı yoğunlukları | Tek soyut aşama, formatı değişken |
| Kapsam | 7 özgün hikâye evreni × 23 çıktı = üretilemez | Ortak mekanik + temalandırma |
| Modül seçimi | Kesirler (DGBL etkisi g=0,46 — düşük) | Cebir (g=1,60 — en yüksek) |
| Kuramsal temel | Ad hoc aşamalandırma | CRA (Concrete-Representational-Abstract), literatürde yerleşik |

**v1'den korunanlar:** "Kesir Krallığı" modül fikri (Faz 2'ye alındı), 7 bölge metaforu (meta-harita katmanı olarak korundu — ama 7 ayrı oyun olarak değil, tek haritanın 7 bölgesi olarak).

---

## 3. Sohbetteki mimari düzeltme (nihai hâl)

Kullanıcı 5 adımlı bir mimari önerdi, üzerine üç itiraz geldi. Üçü de haklı ve **nihai mimariye işlendi**:

### İtiraz 1 — "Oyunlaştırma yanlış başlangıç noktası"
Başlangıç aşaması "puan/rozet/hikâye" olarak tanımlanmıştı. Ama:
- Salt oyunlaştırma (puan/rozet/lider tablosu) → içsel motivasyona **küçük** etki (g≈0,26)
- Matematiğin oyunun mekaniği olması (DGBL) → başarıya **büyük** etki (g≈0,84–0,92)

→ **1. aşama "oyun tabanlı keşif" olmalı; matematik oyunun ödülü değil, kendisi.**

### İtiraz 2 — "Hafif oyundan kopma ayrı bir aşama olmamalı"
Destek azaltma (scaffolding fading) **kademeli ve sürekli** bir süreçtir, ayrı bir geçiş basamağı değil.

→ **Destek azaltma, aşama değil; 2. aşamanın içine gömülü sürekli bir parametre.**

### İtiraz 3 — "Fiziksel görevler yanlış yerde"
Fiziksel görevler 4. sıraya, test hazırlığından sonraya konmuştu. Oysa:
- TYMM zaten **pergel, cetvel, açıölçer, kâğıt katlama** kullanımını öğrenme çıktısının içine gömmüş (MAT.5.3.1, MAT.5.3.3, MAT.5.3.7)
- CRA'nın "somut" aşaması **zaten fiziksel manipülasyon** demek

→ **Fiziksel görev, 1. aşamaya paralel yatay bir katman.** Sona konursa çocuk dijital-soyut modele alışmış olur ve fiziksele geçiş yeniden bir sıçramaya dönüşür.

---

## 4. Resmî programla çapraz doğrulama (bu projenin en güçlü kozu)

Araştırma raporunun önerdiği mekanikleri resmî TYMM programının kendi metniyle karşılaştırdım. Sonuç: **öneriler programın zaten tarif ettiği etkinliklerle örtüşüyor.**

### MAT.5.2.1 — Eşitliğin korunumu
Resmî program, öğrenme-öğretme uygulamasında aynen şöyle diyor:

> "Bu süreçte öğrencilerin günlük hayatta aşina oldukları durumlardan (**kefeli terazi, tahterevalli** gibi) ya da çeşitli araç ve teknolojilerden (**sanal manipülatifler** gibi) yararlanılır."

Ve beklenen genelleme:
> "Eşitliğin her iki tarafına aynı sayının eklenmesi veya her iki tarafından aynı sayının çıkarılması ve iki tarafın aynı sayıyla çarpılması veya bölünmesi durumunda eşitlik korunur."

→ **Denge Şehri modülü, MEB'in tarif ettiği terazi etkinliğinin sanal manipülatif hâli.** Bu bir "yaratıcı yorum" değil, programın literal uygulaması.

### MAT.5.2.1 — Dağılma özelliği
Resmî program:
> "...öğrenciler kareli kâğıt üzerine çizilmiş bir dikdörtgenin genişliğini (5 birim) ya da uzunluğunu (9 birim) parçalara ayırabilir ve her bir parçadaki birim kareleri toplayarak alanı [(5x3)+(5x6) gibi] hesaplayabilir."

→ **Birim Kare Atölyesi modülü**, cebirsel dağılma özelliği ile alan modelini aynı ekranda birleştiriyor — bu da programın kendi önerisi. Aynı zamanda MAT.5.4.2'ye köprü.

### MAT.5.3.x — Araç kullanımı
Üç ayrı çıktı "matematiksel araç ve teknolojiden yararlanabilme" diye yazılmış (5.3.1 çizim, 5.3.3 açı ölçme, 5.3.7 çember/üçgen inşası).

→ **Pergel/cetvel/açıölçer dijital olarak simüle edilmeli** ve fiziksel karşılığı ödev olarak verilmeli. Rapordaki "geometride DGBL etkisi düşük (g=0,43)" bulgusunun çaresi tam olarak bu hibrit tasarım.

---

## 5. Raporun kabul edilmeyen / yumuşatılan noktaları

| Rapor önerisi | Bizim kararımız | Neden |
|---|---|---|
| "7 temaya birebir 7 krallık" | Tek harita, 7 bölge; her bölge aynı motoru kullanır | Üretilebilirlik. 7 ayrı evren = 7 ayrı oyun projesi |
| "Uyarlanabilir zorluk algoritması" (MVP'de) | Faz 2'ye ertelendi; MVP'de kural tabanlı basit zorluk merdiveni | Uyarlanabilir sistem, kalibre edilecek veri olmadan zarar verir |
| "Takım/işbirliği görevleri" | Faz 2; MVP'de sadece veli-çocuk ortak görevi | Çocuklar arası etkileşim = moderasyon + KVKK yükü |
| Piaget aşamalarının katı uygulanması | Yön göstergesi olarak alındı | Raporun kendi uyarısı: "katı bir kural değil" |
| Meta-analiz sayılarının pazarlamada kullanımı | **Kullanılmayacak** | Doğrulanmadı; ikincil kaynak üzerinden aktarım |

---

## 6. Bu analizden çıkan tek cümlelik tasarım kuralı

> **Her mekanik için sor: "Çocuğun yaptığı bu hareket, matematiksel işlemin ta kendisi mi, yoksa doğru cevabın ödülü mü?"**
> Cevap "ödülü" ise mekanik yeniden tasarlanır.
