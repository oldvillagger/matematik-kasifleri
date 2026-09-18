# 03 — Pedagojik Mimari (Çekirdek Döngü v3)

Bu, ürünün **motorudur**. Her modül bu döngüyü uygular; değişen sadece temalandırma, görsel varlıklar ve manipülatif tipidir. 23 öğrenme çıktısı için 23 ayrı oyun değil, **1 döngü × 12 manipülatif** üretilecek.

---

## 1. Döngü

```
        ┌──────────────────── PARALEL KATMAN ────────────────────┐
        │  FİZİKSEL GÖREV (pergel, cetvel, kâğıt katlama,        │
        │  askı terazi, kareli kâğıt, zar/torba)                 │
        └───┬────────────────────┬───────────────────────┬───────┘
            │                    │                       │
   ┌────────▼────────┐  ┌────────▼────────┐  ┌───────────▼────────┐
   │  A1  KEŞFET     │→ │  A2  BAĞLA      │→ │  A3  GERİ ÇAĞIR    │
   │  (Somut)        │  │  (Yarı-soyut)   │  │  (Soyut)           │
   ├─────────────────┤  ├─────────────────┤  ├────────────────────┤
   │ Tam manipülatif │  │ Nesne → şema →  │  │ Sembol tek başına  │
   │ Hata risksiz    │  │ sembol, yan yana│  │ İpucu yok          │
   │ Puan yok        │  │ Destek SÜREKLİ  │  │ Süre yok           │
   │ Hikâye bağlamı  │  │ azalır (fading) │  │ Düşük riskli       │
   │ Serbest deneme  │  │ Ölçme: ipuçsuz  │  │ Format ≈ izleme    │
   │                 │  │ çözüm oranı     │  │ testi              │
   └─────────────────┘  └─────────────────┘  └────────────────────┘
            ▲                                            │
            └──────── aralıklı tekrar (spaced) ──────────┘
                      3 / 7 / 21 gün sonra
```

### Neden 3 aşama, neden 5 değil

İlk taslak 5 aşamalıydı (Keşif → Rehberli Görev → Bağımsız Misyon → Mini-Sınama → Sınav Hazırlığı). Üç sorun vardı:

1. **"Rehberli → Bağımsız" bir aşama geçişi değil, bir parametrenin sürekli değişmesi.** Destek azaltma (scaffolding fading) kademeli olmalı; ayrı basamak yapmak onu bir kopuş noktasına çevirir.
2. **"Mini-Sınama" ile "Sınav Hazırlığı" aynı bilişsel eylemdir** (geri çağırma), sadece uzunlukları farklı. Ayrı aşama değil, aynı aşamanın iki uzunluğu.
3. **Fiziksel görevler 4. sıraya konmuştu.** Bu, çocuk dijital-soyut modele alıştıktan *sonra* fiziksele dönmesi demek — yeni bir sıçrama yaratır. Oysa CRA'nın "somut"u zaten fiziksel manipülasyon; TYMM de pergel/cetvel/açıölçeri çıktının içine gömmüş.

**Sonuç:** 3 aşama + 1 paralel katman.

---

## 2. Aşama sözleşmeleri

Her aşamanın motorda uygulanan kesin kuralları var. Bunlar içerik yazarının keyfine bırakılmaz; `engine-core` bunları zorlar.

### A1 — Keşfet / Manipüle Et

| Kural | Uygulama |
|---|---|
| Puan/rozet/skor **gösterilmez** | UI'da skor bileşeni bu aşamada render edilmez |
| "Yanlış" geri bildirimi **yok** | Hata diegetic: köprü sallanır, terazi eğilir. Kırmızı X yok, ses yok |
| Geri alma **sınırsız** | Her hamle geri alınabilir; deneme maliyeti sıfır |
| Çıkış koşulu **başarı değil, keşif** | N farklı denge durumu bulmak, 3 farklı dikdörtgen üretmek gibi |
| Süre **ölçülmez ve gösterilmez** | Arka planda telemetri var, çocuğa gösterilmez |
| Metin **minimum** | 10-11 yaş okuma yükü; talimat gösterilerek verilir, yazılarak değil |

**Sonlanma sinyali:** çocuk aynı ilişkiyi ardışık 2-3 farklı örnekte *kendiliğinden* üretiyorsa A2'ye geçilir.

### A2 — Temsile ve Sembole Bağla

Burada tek bir sayı yönetiyor: **`support` ∈ [1.0 → 0.0]**.

| `support` | Ekranda ne var |
|---|---|
| 1.00 | Tam manipülatif + şema + sembol, üçü aynı anda, senkron animasyonlu |
| 0.75 | Manipülatif soluklaşır (opacity), şema + sembol net |
| 0.50 | Manipülatif gizli ama "göster" düğmesiyle çağrılabilir; şema + sembol |
| 0.25 | Sadece sembol + tek dokunuşluk şema önizlemesi |
| 0.00 | Sadece sembol |

**Azaltma politikası (varsayılan):** Son 3 görevin 3'ü de ilk denemede ve ipucu çağırmadan doğruysa `support -= 0.25`. İki ardışık hata veya bir ipucu çağrısı → `support += 0.25` (tavan: girişteki değer). Yani destek **iki yönlü**; bu, uzmanlık tersine dönüş etkisini hem yukarı hem aşağı yönde yönetir.

> Bu politika `engine-core/support-policy.ts` içinde tek bir saf fonksiyondur ve **birim testi vardır**. Pedagojik parametre, koda gömülü sihirli sayı değil, içerik dosyasından override edilebilir.

### A3 — Bağımsız Geri Çağır

| Kural | Neden |
|---|---|
| **Süre sınırı yok, sayaç yok** | Süreli matematik testleri kaygılı öğrencilerde çalışma belleğini tüketiyor (Boaler; Ramirez/Beilock 2013) |
| **İpucu yok** — ama "sonra dön" var | Geri çağırma pratiğinin şartı: hatırlamaya çalışmak. Ama çıkmazda bırakmak da yanlış |
| **Tek deneme**, sonra düzeltici geri bildirim | Roediger/düşük riskli değerlendirme: not toplamak değil, düzeltmek |
| **Kısa**: 4-6 soru | Büyük üniteyi birkaç gün arayla küçük tekrarlı testlere bölmek |
| **Hikâye kabuğu korunur** | Format izleme testine yaklaşır ama ekran "yabancı bir sınav ekranı" gibi görünmez |
| Sonuç **puan olarak değil, harita olarak** | "18/20" yerine "Denge Şehri'nin 4 bölgesinden 3'ü aydınlandı" |

**Aralıklı tekrar:** A3 tamamlandıktan 3, 7 ve 21 gün sonra o çıktıdan 2 soru, o günkü oturumun içine **sızdırılır** (ayrı bir "tekrar testi" ekranı olarak değil). Basit Leitner benzeri kutu mantığı yeterli; SM-2 gibi karmaşık algoritma MVP'de gereksiz.

### Paralel katman — Fiziksel görev

| Ne zaman tetiklenir | Nasıl |
|---|---|
| A1 sırasında (geometri modüllerinde **zorunlu**) | "Şimdi gerçek pergelini al" — dijital inşa ile aynı görev |
| A2 sonrası (diğer modüllerde önerilir) | Yazdırılabilir tek sayfa görev kâğıdı |
| Ev/veli görevi | Askı terazi, kâğıt katlama, mutfak ölçümü |

Çıktı: fotoğraf yükleme (F2) veya çocuğun "yaptım" onayı + velinin tek dokunuşluk doğrulaması (F1). **Fotoğraf yükleme KVKK açısından ayrı bir karardır** — bkz. `07`.

---

## 3. Uyarlanabilir zorluk (MVP: kural tabanlı)

Rapor "uyarlanabilir algoritma" öneriyor. MVP'de **öğrenen bir model kullanılmayacak** — kalibre edecek veri yokken zarar verir. Bunun yerine:

```
zorluk ∈ {1,2,3,4,5}   (içerik dosyasında her göreve elle atanır)

kural:  ardışık 2 doğru (ipuçsuz, ilk deneme) → zorluk +1
        ardışık 2 hata                        → zorluk -1
        tavan: modülün en yüksek zorluğu
        taban: 1  (asla "kolaylaştıramama" durumu olmasın)
```

Bir görev seviyesinde takılan çocuğa **daha kolay soru değil, daha çok destek** verilir (A2'ye geri düşülür). Bu ayrım önemli: zorluğu düşürmek konuyu atlatır, desteği artırmak konuyu öğretir.

F2'de telemetri birikince Bayesian Knowledge Tracing veya Elo tabanlı bir model değerlendirilebilir.

---

## 4. Geri bildirim tasarımı

| Durum | Yanlış yaklaşım | Bizim yaklaşım |
|---|---|---|
| Hata (A1) | ❌ + "Tekrar dene" | Terazi eğilir, kalır. Hiçbir yargı yok. Çocuk düzeltir |
| Hata (A2) | "Yanlış!" | Şema üzerinde **nerede** ayrıldığı gösterilir: "Sol tarafa 3 ekledin, sağ taraf olduğu gibi kaldı" |
| Hata (A3) | Puan kesintisi | Doğru çözüm **adım adım animasyonla** gösterilir, sonra "benzer bir tane daha" 3 gün sonraya kuyruğa alınır |
| Doğru | "Harika! +50 puan 🎉" | Hikâyede bir şey **olur**: köprü kurulur, kapı açılır, ışık yanar |

**Kural:** Ödül ile eylem arasında anlam bağı olmalı. "Doğru cevap → rastgele parlak efekt" bağ kurmaz; "dengeyi kurdun → köprü ayakta durdu" kurar.

---

## 5. Yasaklı desenler (kırmızı çizgi)

Bunlar ürün kararı değil, pedagojik/etik kırmızı çizgi. Kod incelemesinde reddedilir.

| Yasak | Gerekçe |
|---|---|
| **Genel lider tablosu** | Rekabet, az rekabetçi ve düşük performanslı çocuklarda motivasyonu düşürüyor, kaygı yaratıyor (Ratinho & Martins 2023). Sınıf içi opsiyonel tablo F2'de öğretmen kararına bırakılabilir |
| **Seri (streak) baskısı** | "Serini kaybettin" bildirimi = suçluluk mekaniği. 10-11 yaş için etik dışı |
| **Geri sayım sayacı / süreli test** | Matematik kaygısı ve çalışma belleği tüketimi |
| **Can / enerji sistemi** | Oynamayı kısıtlayıp beklemeye veya ödemeye zorlar |
| **Öğrenme içeriğini kilitleyen premium** | Ödeme sadece kozmetik olabilir. "Kazanmak için öde" yok |
| **Rastgele ödül kutusu (loot box)** | Kumar mekaniği. Çocuk ürününde yeri yok |
| **Herkese açık sohbet / mesajlaşma** | Moderasyon ve güvenlik yükü, KVKK riski |
| **Push bildirimle geri çağırma** | Varsayılan kapalı. Sadece veli açarsa, sadece haftalık özet |
| **Doğru/yanlış sesi ile utandırma** | "Buzzer" sesi yok |

---

## 6. Motivasyon katmanı (azınlık katman)

Oyunlaştırma **var ama küçük ve dikkatli**. Sırayla:

1. **Hikâye ilerlemesi** — birincil motivasyon. Bölüm bölüm açılır.
2. **Kişisel harita** — lider tablosu değil; kendi haritanın dolması.
3. **Avatar/karargâh özelleştirme** — özerklik hissi (meta-analizde oyunlaştırmanın en güçlü etkisi burada: g≈0,64).
4. **Kâşif Kartları** — koleksiyon, ama **süreç bileşeni kanıtına** bağlı (puan değil). Bkz. `04-oyun-tasarimi.md` §Meta.
5. **Kâşif Günlüğü** — haftalık, kıyaslamasız öz-değerlendirme.
6. **Kooperatif görev** — veli-çocuk ortak görevi (F1), sınıf ortak hedefi (F2).

Puan/rozet katmanı **en sona** konur ve hiçbir zaman ana ekranın merkezinde durmaz.

---

## 7. Erişilebilirlik ve kapsayıcılık (pedagojik şart, "nice to have" değil)

- **Okuma yükü**: Her talimat ≤ 2 cümle, ≤ 12 kelime. Sesli okuma düğmesi (TTS) her metinde.
- **Disleksi**: Alternatif yazı tipi seçeneği, satır aralığı ayarı.
- **Renk körlüğü**: Hiçbir bilgi yalnız renkle taşınmaz (şekil + desen + etiket).
- **Diskalkuli**: Sayı doğrusu ve nokta örüntüsü (subitizing) destekleri her manipülatifte çağrılabilir.
- **Motor beceri**: Sürükle-bırak her yerde **dokunma alternatifiyle** de yapılabilir (seç → hedefe dokun). Sürükleme zorunlu tek etkileşim olamaz.
- **Klavye**: Tam klavye navigasyonu (okul bilgisayarları, fare olmayan ortamlar).
- Hedef: **WCAG 2.2 AA**.

---

## 8. Doğrulama planı (bu mimari işe yarıyor mu?)

Faz sonlarında ölçülecek, "kullanıcı beğendi" ile yetinilmeyecek:

| Soru | Ölçüm |
|---|---|
| Matematik oyunun kendisi mi oldu? | Her mekanik için hakem kontrolü: mekaniği çıkarınca matematik kalıyor mu? Kalıyorsa mekanik kabuktur |
| Destek azaltma çalışıyor mu? | A2 çıkışında `support=0` ile çözüm oranı ≥ %70 |
| A3'e geçiş sıçrama mı? | A2 son çeyrek ile A3 ilk çeyrek başarı farkı ≤ 15 puan |
| Kaygı yaratıyor mu? | A3 öncesi/sonrası 3 emoji'lik duygu ölçeri (opsiyonel, atlanabilir) |
| Yenilik etkisi sönüyor mu? | 4. hafta oturum süresi / 1. hafta oturum süresi |
| Gerçek teste transfer var mı? | Aynı kazanımdan kâğıt-kalem mini test (okul iş birliği, F2) |

**5-8 çocukla kullanılabilirlik testi, Faz 0 demosundan sonra yapılmalı.** Staj yerine sunulacak demo, bu testin ham malzemesidir.
