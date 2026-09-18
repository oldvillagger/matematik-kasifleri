# 04 — Oyun Tasarımı

Bu doküman, "eğitici oyun" klişesinden kaçınmak için yazıldı. Ürünün başarısız olmasının en olası yolu, **matematiği oyunun ödülü yapan** bir şey üretmektir: bir platform oyunu oynarsın, arada soru çıkar, doğru cevaplarsan zıplamaya devam edersin. Bu, çocuğun matematiği "oynamaya engel olan şey" olarak öğrenmesidir.

Aşağıdaki her mekanik tek bir testten geçirildi:

> **Mekaniği çıkarınca matematik kalıyor mu? Kalıyorsa mekanik bir kabuktur, at.**
> **Matematiği çıkarınca oyun kalıyor mu? Kalıyorsa yine kabuktur, at.**
> İkisi ayrılamıyorsa mekanik doğrudur.

---

## 0. Neden çocuklar bazı oyunlara bağlanıyor — kullanacağımız desenler

Araştırmanın söylediği "hikâye + avatar + rol yapma uzun vadeli motivasyonu en iyi koruyan unsurlar" bulgusunu somut tasarım desenlerine çevirdim. Aşağıdakiler, çocuk oyunlarında tekrar tekrar işe yaramış, doğrulanabilir desenler:

| Desen | Nereden biliyoruz | Bizde karşılığı |
|---|---|---|
| **Onarım/inşa döngüsü** — bozuk bir yeri adım adım geri getirmek | Stardew Valley'in topluluk merkezi paketleri, Animal Crossing ada geliştirme | Kâşif Karargâhı + Denge Şehri'nin onarılması. İlerleme = yerin değişmesi |
| **Kurala hükmetme** — oyuncunun oyunun kuralını değiştirmesi | Baba Is You | Çocuk "eşitliği koruyan hamle" kuralını keşfeder ve kural ona *yeni hamle* açar |
| **Fizik sezgisi** — sonucun hesapla değil, gözle görülmesi | Slice Fractions, Cut the Rope | Terazi gerçekten eğilir; kesir yanlışsa parça delikten geçmez |
| **Az metin, çok gösterim** — kurallar anlatılmaz, keşfedilir | DragonBox, Monument Valley | Hiçbir modül metin öğreticiyle başlamaz |
| **Koleksiyon** — toplanabilir, takas edilemez, kayıpsız | Pokédex mantığı (ama kart paketi/şans yok) | Kâşif Kartları — süreç bileşeni kanıtıyla açılır |
| **Yaratma ve paylaşma** | Scratch, Minecraft | Çocuk kendi bulmacasını kurar, veliye/öğretmene gönderir (F2) |
| **Kısa oturum, net kapanış** | Mobil bulmaca oyunları | Her oturum 8-12 dakikada anlamlı bir yerde biter; "bir tane daha" için yapay engel yok |
| **Karakterin sana ihtiyacı olması** | Rol yapma oyunlarının en eski kancası | Usta Nazlı ve Pergel senin yardımın olmadan ilerleyemez |

**Bilinçli olarak kullanmadıklarımız:** enerji/can sistemi, günlük giriş serisi, şans kutusu, lider tablosu, geri sayım. Gerekçe: `03-pedagojik-mimari.md` §5.

---

## 1. Dünya ve meta-katman

### Çerçeve hikâye

> **Denge Şehri**, matematiğin fiziksel bir güç olduğu bir yer. Şehir yıllardır işleyen dev bir denge sistemi üzerinde duruyor: köprüler eşitliklerle, binalar birim karelerle, saat kulesi örüntülerle ayakta. Bir gün sistem bozuluyor — parçalar dağılıyor, köprüler sallanıyor, bölgeler karanlıkta kalıyor.
>
> Çocuk bir **kâşif çırağı**. Görevi savaşmak değil, **anlamak ve onarmak**. Her bölge, o bölgeyi ayakta tutan matematiksel fikri yeniden keşfettiğinde aydınlanır.

Bu çerçeve üç işi birden yapıyor:
- Onarım döngüsünü ("ilerleme = yerin değişmesi") doğal kılıyor,
- Rekabeti hikâyeden çıkarıyor (düşman yok, rakip yok),
- 7 TYMM temasını **tek haritanın bölgeleri** yapıyor — 7 ayrı oyun değil.

### Harita

```
                       ╔══════════════════════╗
                       ║   KÂŞİF KARARGÂHI    ║  ← ana ekran, özelleştirilebilir
                       ║  (günlük, kartlar)   ║
                       ╚══════════╤═══════════╝
        ┌──────────────┬──────────┼──────────┬───────────────┐
   ┌────▼────┐   ┌─────▼────┐ ┌───▼────┐ ┌───▼─────┐  ┌──────▼──────┐
   │ DENGE   │   │ BİRİM    │ │ PERGEL │ │ SAYI    │  │  VERİ       │
   │ MEYDANI │   │ KARE     │ │ ADASI  │ │ LİMANI  │  │  ÇARŞISI    │
   │ MAT.5.2 │   │ ATÖLYESİ │ │MAT.5.3 │ │ MAT.5.1 │  │MAT.5.5/5.6  │
   └─────────┘   │ MAT.5.4  │ └────────┘ └─────────┘  └─────────────┘
                 └──────────┘
```

Bölgeler **kilitli değil**. Çocuk istediği yere gidebilir (özerklik). Sıra önerilir, dayatılmaz. Sadece bir bölgenin *içindeki* görevler sıralıdır.

### Kâşif Kartları (koleksiyon katmanı)

- Her kart **bir süreç bileşenine** karşılık gelir, bir soruya değil.
  Örnek: `MAT.5.2.1-a — "İlk Sezgi"` kartı, çocuk bir terazide tahminde bulunduğunda açılır.
- 23 çıktı × ort. 4-5 bileşen ≈ **~100 kart**. Bu, TYMM'nin kendi yapısının koleksiyon hâli.
- Kart açılışı **şansa bağlı değil**, kayıp yok, takas yok, satın alınamaz.
- Kartın arkasında: o fikrin gerçek hayattaki hâli (terazi, mimari, tarif). Öğrenme içeriği ödülün *içinde*.

### Kâşif Günlüğü

Haftada bir açılan, kıyaslamasız tek sayfa:
- "Bu hafta neyi ilk kez kendin çözdün?" (motorun kaydından otomatik dolar)
- "Hangisi zor geldi?" (çocuk seçer)
- "Gelecek hafta neyi denemek istersin?" (çocuk seçer → sıradaki görevleri etkiler)

Bu ekran öz-değerlendirme formunun (MEB ölçme araçlarından biri) dijital karşılığı ve aynı zamanda özerklik kaldıracı.

---

## 2. Modül: DENGE ŞEHRİ — `MAT.5.2.1` ★ Faz 0 demo

**Tema:** İşlemlerle Cebirsel Düşünme — eşitliğin korunumu, değişme/birleşme/dağılma
**Neden bu modül demo:** DGBL etkisinin en yüksek olduğu alan cebir (g=1,60) **ve** resmî TYMM programı bu çıktının uygulamasında birebir "kefeli terazi, tahterevalli… sanal manipülatifler" diyor. Yani mekanik bizim yorumumuz değil, programın tarifi.

**Tasarım öncülü:** DragonBox Algebra — çocuk "denklem çözüyorum" demez, "dengeyi kuruyorum" der.

### Çekirdek mekanik

Ekranda iki kefeli bir terazi. Üzerine konabilecekler:
- **Ağırlık taşları** (1, 5, 10 — bilinen sayılar)
- **Sır Kutuları** (içi görünmeyen, aynı renk = aynı ağırlık — değişken)
- **Sandıklar** (n adet aynı kutuyu gruplayan kap — çarpım)

Terazi **gerçek zamanlı eğilir**. Yanlış hamle bir hata mesajı üretmez; terazi eğilir, çocuk görür.

**Kilit mekanik — "Çift El":**
A1'de çocuk taşları serbestçe koyar. Ama bir noktada bir kural açılır: **Çift El eldiveni.**
Çift El takılıyken yapılan her hamle **iki tarafa aynı anda** uygulanır. Yani:

> "Eşitliğin her iki tarafına aynı sayının eklenmesi… durumunda eşitlik korunur."
> — resmî TYMM metni, MAT.5.2.1 beklenen genelleme

Bu cümle, bir metin olarak öğretilmiyor; **çocuğun eline geçen bir güç olarak** öğretiliyor. Çocuk "eşitliğin korunumu kuralını öğrendim" demez, "Çift El eldivenini kazandım" der. Kuralı kullanarak dengeyi bozmadan sadeleştirir ve sır kutusunun içindekini bulur.

Bu, mekaniğin matematik olduğu andır: **Çift El = eşitliğin korunumu aksiyomu.**

### Aşama aşama

| Aşama | Ekranda | Çocuğun yaptığı | Süreç bileşeni |
|---|---|---|---|
| **A1** Keşfet | Fiziksel terazi, taşlar, kutular. Sembol yok | Serbest koyma. "Sence hangi taraf ağır?" ön tahmini. Dengeyi kurma | **a)** varsayımda bulunur |
| **A1b** Çift El | Eldiven açılır | Aynı hamleyi iki tarafa uygular, dengenin bozulmadığını 3 farklı kurulumda görür | **b)** genellemeleri belirler |
| **A2** Bağla | Terazi yavaşça çizime dönüşür; yanında `☐ + 3 = 7` belirir. `support` azalır | Aynı işi bu kez şema üzerinde, sonra sembol üzerinde yapar | **c)** genellemeyi sınar |
| **A2b** Ad koyma | Sır kutusu artık `x` olarak da gösterilir | Kendi kuralını seçenekler arasından sembolik ifadeyle eşleştirir / yazar | **ç)** sözel-sembolik temsille sunar |
| **A3** Geri Çağır | "Usta Sınavı" — hikâye kabuğu var, terazi yok | `x + 12 = 20` türü, ipucusuz, zamansız, 5 soru + 1 açık uçlu "neden?" | **d)** gerekçe sunar |

### İşlem özellikleri alt-modülleri (aynı çıktının diğer yarısı)

MAT.5.2.1 sadece eşitliğin korunumu değil; **değişme, birleşme ve dağılma** özelliklerini de içeriyor. Resmî program bunlar için birim küp ve kareli kâğıt öneriyor. Karşılıklarımız:

- **Değişme** — "Yükleme Rampası": aynı kasaları farklı sırayla yükle, kamyonun toplam ağırlığı değişmez. Terazi bunu doğrular.
- **Birleşme** — "Koli Oyunu": programın kendi örneği. 20 paket × 10 bisküvi × 25 kutu. Çocuk kolileri farklı gruplayabilir: `(20×10)×25` veya `20×(10×25)`. İkisi de aynı depoyu doldurur — **görsel olarak aynı hacim**.
- **Dağılma** — "Duvar Kırma": `25×(100+100)`. Bir dikdörtgen duvarı dikey bir çizgiyle ikiye böl; her parçanın birim karelerini ayrı say, topla. **Bu mekanik doğrudan Birim Kare Atölyesi'nin motorunu kullanır** — iki modül aynı manipülatifi paylaşır. Programın kendisi de bu bağı kuruyor.

### Fiziksel paralel görev (önerilir)

Bir elbise askısı, iki file, ataçlar/mandallar → gerçek bir terazi. Çocuk aynı Çift El kuralını fiziksel olarak dener. Yazdırılabilir tek sayfa görev kâğıdı ürünle birlikte gelir.

### Neden çocuk bunu oynar

Sır kutusunun içinde ne olduğunu merak etmek, 10 yaşındaki biri için "x'i bul" dan kıyas kabul etmez şekilde daha güçlü bir kancadır. Ve Çift El, çocuğa **bir güç** verir — oyunlarda güç kazanmak en eski ödül biçimidir, ama burada güç = matematiksel ilke.

---

## 3. Modül: BİRİM KARE ATÖLYESİ — `MAT.5.4.1–5.4.4` ★ Faz 0 demo

**Tema:** Geometrik Nicelikler — dikdörtgen çevre ve alan
**Neden demo:** Rapor "geometride DGBL etkisi düşük" diyor (g=0,43). Bu modülün amacı **tam olarak o zayıflığın çaresini göstermek**: iyi tasarlanmış manipülatif + fiziksel paralel. Staj sunumunda "kolay olanı seçmedik" argümanı.

### Çekirdek mekanik

Çocuk bir **döşeme ustası**. Siparişler geliyor:

**Sipariş türü 1 — "Alanı bul":** Zemin verilmiş, birim kareleri döşe. Sayarak başlar, sonra sıra × sütun kısayolunu kendi keşfeder (oyun 6×4'ü döşerken tek satırı kopyalama düğmesi verir — kısayol keşfi mekaniğin içinde).

**Sipariş türü 2 — "24 karo, tüm olasılıklar" (MAT.5.4.2 + 5.4.3):**
> "Elimde tam 24 karo var. Kaç farklı dikdörtgen oda döşeyebilirim?"

Çocuk 1×24, 2×12, 3×8, 4×6… bulur. Sonra oyun sorar:
> "Hangisine en az duvar (çevre) gerekir? Duvar pahalı."

Aynı alan, farklı çevre — **öğrenme çıktısının kendisi, bir bütçe problemine dönüşmüş**. Bu, tablo doldurma egzersizinin oyun hâli değil; oyunun kazanma koşulunun matematiksel içgörü olması.

**Sipariş türü 3 — "20 metre çit" (MAT.5.4.1):** Ters problem. Çevre sabit, alanı büyüt. Çocuk 1×9'dan 5×5'e doğru ilerledikçe alanın büyüdüğünü **bahçenin fiziksel olarak genişlemesiyle** görür.

**Sipariş türü 4 — "Duvar Kırma" (dağılma özelliği, MAT.5.2.1 ile ortak):** 9 birim genişliğindeki duvarı 3+6 diye böl, parçaları ayrı ayrı hesapla. Cebir ile geometri aynı ekranda birleşir.

### Aşamalar

| Aşama | Ekranda | Çocuğun yaptığı | Bileşen |
|---|---|---|---|
| A1 | Karo sürükle-bırak, ızgara, sayaç | Tek tek döşer, sayar | belirler / inceler |
| A1b | "Satırı kopyala" düğmesi açılır | Kısayolu keşfeder: 6 sütun × 4 satır | genelleme kurar |
| A2 | Izgara soluklaşır, `6 × 4 = 24` belirir; `support` azalır | Döşemeden sonucu tahmin eder, sonra doğrular | genellemeyi sınar |
| A3 | Izgara yok, sadece sayılar ve kısa problem | Zamansız, ipucusuz sipariş çözer | sunar / gerekçelendirir |

### Fiziksel paralel (önerilir → geometri için zorunluya yakın)

Kareli kâğıt + makas. "24 kareyi kes, kaç farklı dikdörtgen yapabildiğini defterine çiz." Resmî program kareli kâğıdı zaten adıyla öneriyor.

---

## 4. Modül: PERGEL ADASI — `MAT.5.3.1, 5.3.2, 5.3.7`

**Tasarım öncülü:** Euclidea — pergel ve cetvelle inşa bulmacaları. Bu tür, dünyada işe yaradığı kanıtlanmış bir bulmaca türü ve TYMM'nin "matematiksel araç ve teknolojiden yararlanabilme" ifadesinin birebir karşılığı.

**Mekanik:** Ekranda sadece iki alet var — **pergel** ve **çizgeç**. Başka hiçbir şey yok. Hedef şekil hayalet olarak gösterilir; çocuk onu yalnız bu iki aletle inşa etmeye çalışır.

- Seviye 1: İki noktadan geçen doğru
- Seviye 2: Verilen uzunluğu taşı (pergel açıklığı)
- Seviye 3: Bir doğru parçasını ikiye böl (orta dikme)
- Seviye 4: **İki noktada kesişen çember çifti → kesişim noktasıyla üçgen** — bu, MAT.5.3.7'nin kendisi. Çocuk inşa ettikten sonra kenarları ölçer ve "iki kenar neden hep eşit?" sorusuna kendi varsayımını kurar.

**Neden bağımlılık yapar:** Kısıtlı araç + net hedef + "daha az hamlede yapabilir misin?" (hamle sayısı kendi rekorun, başkasının değil). Bu, rekabetsiz bir ustalaşma döngüsü.

**Fiziksel paralel: ZORUNLU.** TYMM bu çıktıyı araç kullanımı olarak tanımlamış; dijital pergel gerçek pergelin yerine geçemez. Modül, her seviyenin sonunda aynı inşayı **gerçek pergelle** yapmayı ister ve MAT.5.3.2 ("deneyimlerini yansıtabilme") için çocuğun defterinin fotoğrafı/çizimi bir yansıtma görevine bağlanır.

---

## 5. Modül: AÇI KULESİ — `MAT.5.3.3, 5.3.4`

**Mekanik — ışın ve ayna bulmacası.** Kulenin tepesindeki feneri, aynalarla yansıtarak hedefe ulaştır. Aynanın açısını **açıölçerle** ayarlarsın — açıölçer bir ölçme aracı değil, **nişan aleti**.

MAT.5.3.4 (iki/üç doğrunun oluşturduğu açılar) buradan doğal çıkıyor: iki ışın kesiştiğinde ters açılar eşit olur; çocuk bunu ölçerek değil, **bulmacayı çözmek için kullanarak** öğrenir. Bir seviye şöyle: "Bu açıyı ölçemiyorsun (sis var). Ama karşısındakini ölçebiliyorsun."

**Zorluk merdiveni:** 1 ayna → 2 ayna → paralel iki doğruyu kesen bir ışın → üç doğrunun oluşturduğu üçgen boşluk.

**Fiziksel paralel (zorunlu):** Gerçek açıölçerle defterde açı ölçme ve çizme. Dijital açıölçer, gerçeğinin kullanımını öğretmek için aynı tutma/hizalama hareketini ister (0 çizgisini kenara oturtma) — bu ayrıntı, "dijitalde kolay, kâğıtta beceremiyor" sorununu önler.

---

## 6. Modül: ÖRÜNTÜ BAHÇESİ — `MAT.5.2.3`

**Mekanik:** Bahçede bitkiler bir kurala göre büyüyor. Çocuk ilk 3 terimi görür, 4.'yü tahmin eder, eker. Doğruysa bitki büyür; yanlışsa solmaz — **başka bir şey olur** (farklı bir bitki çıkar), yani hata bilgi verir, ceza değil.

**Derinleşme:** "Kural Tezgâhı" — çocuk kuralı seçeneklerden seçmez, **kurar**: `[her adımda] [+3]` gibi blokları birleştirir. Bu, MAT.5.2.3'ün "önermeyi sözel ve sembolik temsil ile sunar" bileşeninin doğrudan karşılığı ve erken fonksiyon makinesi sezgisi.

**Ters mod (çocukların en sevdiği kısım):** Çocuk kendi örüntüsünü kurar, oyun onu çözmeye çalışır. Kurma, çözmekten daha çok sahiplik yaratır.

---

## 7. Modül: SIRA KAPILARI — `MAT.5.2.2` (işlem önceliği)

**Mekanik:** Bir mekanizmada kapılar var; her kapı bir işlem. Hepsini açmak yetmez, **doğru sırayla** açman gerekir. Yanlış sırada açarsan mekanizma başka bir sonuç üretir ve bunu görürsün — `3 + 4 × 2` için hem 14 hem 11 fiziksel olarak üretilebilir, hangisinin "doğru" olduğu bir kural meselesidir ve oyun bunu bir mühendislik standardı gibi sunar.

Bu, işlem önceliğini "ezberlenecek kural" olmaktan çıkarıp **neden bir standarda ihtiyaç olduğu** sorusuna çevirir.

---

## 8. Modül: ALGORİTMA ATÖLYESİ — `MAT.5.2.4`

**Tasarım öncülü:** Scratch'in blok mantığı + Human Resource Machine'in "küçük makine" hissi.

**Mekanik:** Çocuk bir hesap makinesi kurar: `[al] → [×3] → [+5] → [yaz]`. Girdiler bir bant üzerinde gelir, çıktı tabloya yazılır. MAT.5.2.4 zaten "algoritmik yapıyı tablo temsiline veya aritmetik işlemlere dönüştürür" diyor — **tablo, mekaniğin çıktısı.**

Bu modül aynı zamanda ürünün "STEM" vitrini: veliye ve okula anlatması kolay.

---

## 9. Modül: KESİR KRALLIĞI — `MAT.5.1.3, 5.1.4` (Faz 2)

**Tasarım öncülü:** Slice Fractions — kesmek, fiziksel bir eylem olarak kesir.

**Mekanik:** Fırın. Siparişler kesirle geliyor ("3/4 tepsi"). Çocuk hamuru **keserek** böler. Kesim çizgisi eşit değilse parçalar eşit olmaz ve bu görülür — kesrin tanımındaki "eşit parçalar" şartı bir kuralla değil, bir başarısızlıkla öğretilir.

**Denklik (MAT.5.1.3):** Aynı siparişi farklı kesimlerle karşılama. 2/8 ile 1/4 aynı deliği doldurur.
**Karşılaştırma (MAT.5.1.4):** İki sipariş, tek tepsi — hangisi daha çok yer kaplıyor? Sayı doğrusu üzerinde yan yana yerleştirme.
**Fiziksel paralel (zorunlu):** Kâğıt katlama. 1/2, 1/4, 1/8 — katlayarak. En ucuz ve en etkili manipülatif.

> Rapor kesirleri DGBL'de düşük etkili (g=0,46) buluyor. Bu yüzden Faz 0'a alınmadı; Faz 2'de daha uzun tasarım ve test bütçesiyle yapılacak.

---

## 10. Modül: VERİ DEDEKTİFİ — `MAT.5.5.1, 5.5.2`

**Mekanik A (5.5.1):** Şehirde NPC'lere soru sor ("en sevdiğin meyve?"), cevapları çetele tut, grafiğe dök, sonra **bir karar ver**: "Çarşıya hangi meyveyi getirtelim?" Kararın sonucu ertesi gün şehirde görünür. Veri → karar zinciri tamamlanır; grafik çizmek amaç değil, araç olur.

**Mekanik B (5.5.2) — en eğlenceli parça:** Şehrin gazetesi yanıltıcı grafikler basıyor. Çocuk **hatayı bulur**: kesik y ekseni, farklı genişlikte sütunlar, eksik kategori, "10 kişiye sorduk" örneklemi. "Bu grafik neden yalan söylüyor?"

MAT.5.5.2 zaten "başkaları tarafından oluşturulan veriye dayalı sonuçları **tartışabilme**" diyor. Bu, medya okuryazarlığıyla kesişiyor ve veliye/öğretmene anlatması çok kolay bir değer önerisi.

---

## 11. Modül: OLASILIK ÇARŞISI — `MAT.5.6.1, 5.6.2` (Faz 2)

**Mekanik:** 0 ile 1 arasında bir **cetvel**. Şehirde olaylar duyurulur ("yarın kar yağacak", "torbadan kırmızı top çıkacak"). Çocuk her olayı cetvel üzerine yerleştirir. Sonra olay **gerçekten çalıştırılır** (100 deneme animasyonu) ve çocuk tahminini deneyle karşılaştırır.

MAT.5.6.1 "0 (imkânsız) ile 1 (kesin) arasında" diyor — cetvel bu ifadenin birebir görselleştirmesi.

---

## 12. Modül: SAYI LİMANI / BASAMAK KULESİ — `MAT.5.1.1, 5.1.2` (Faz 2)

**Mekanik:** Liman vinci, konteynerleri basamaklara yerleştiriyor. 10 birim konteyner otomatik olarak 1 onluğa **birleşir** (görsel olarak paketlenir) — basamak değeri bir kural değil, bir paketleme mekaniği.

Altı basamağı aşınca (MAT.5.1.1 "çok basamaklı sayılara genelleyebilme") vinç yetmez, ikinci bir rıhtım açılır; okuyuş kalıbının kendini üçerli gruplar hâlinde tekrar ettiğini çocuk **yapıyı görerek** fark eder.

MAT.5.1.2 (gerçek yaşam problemleri, 9 süreç bileşeni) için liman "sipariş/lojistik" bağlamı sunar; bu çıktı oyunla değil, **yapılandırılmış problem çözme aracıyla** işlenir (strateji seçimi, kontrol, geneleme adımları ekranda ayrı ayrı istenir).

---

## 13. Modül: ÇOKGEN FABRİKASI — `MAT.5.3.5, 5.3.6` (Faz 2)

**Mekanik:** Düzleme doğrular çiz; doğrular kesiştikçe kapalı bölgeler oluşur. Görev: "Tam 3 üçgen ve 1 dörtgen oluşturacak şekilde 4 doğru çiz."

Bu, MAT.5.3.5'in tanımının ta kendisi: *"Çokgenleri düzlemde ardışık olarak kesişen doğruların oluşturduğu kapalı şekiller olarak yorumlayabilme."* Çokgen bir isim listesi olarak değil, **bir oluşum süreci** olarak öğrenilir.

---

## 14. Ses, görsel dil ve karakterler

**Kaçınılacak:** Jenerik "eğitim yazılımı" estetiği — parlak renkli kalın butonlar, clipart, alkış sesi, "Aferin!" balonu. 10-11 yaş bunu çocuksu bulur ve ürünü küçümser. Bu yaş grubu, **kendisine küçük muamelesi yapılmadığını** hissettiği ürünleri sever.

**Hedeflenen:** Sakin, sıcak, elle çizilmiş hissi veren bir dünya. Doygun ama gürültüsüz renkler. Az ama anlamlı animasyon. Ses tasarımı ürünün yarısı: terazinin gıcırtısı, karoların oturma sesi, pergelin çizgisi. **Doğru/yanlış sesi yok**; olayların sesi var.

**Karakterler (2-3 taneyle sınırlı, hepsi ihtiyacı olan taraf):**
- **Usta Nazlı** — şehrin denge ustası, sana öğretmez, seninle düşünür. Hata yaptığında kızmaz, merak eder: "Hmm, bu ilginç oldu. Neden böyle olduğunu anladın mı?"
- **Pergel** — sadık ama beceriksiz yardımcı; bazen yanlış yapar ve çocuk onu düzeltir. (Çocuğun öğretmen rolüne geçmesi, en güçlü öğrenme mekanizmalarından biridir.)
- **Şehir** — üçüncü karakter, konuşmaz ama değişir.

**Dil:** 10-11 yaş Türkçesi. Kaygı yaratan kelimeler yok: "sınav", "test", "yanlış", "başarısız", "kaybettin". Yerine: "usta görevi", "deneme", "bu sefer olmadı", "tekrar bak".

---

## 15. Oturum ritmi

| Süre | Ne olur |
|---|---|
| 0-30 sn | Karargâh açılır, dün kaldığın yer hatırlatılır, tek düğme: "Devam" |
| 30 sn-2 dk | Sızdırılmış aralıklı tekrar: eski bir çıktıdan 2 soru, hikâye içinde |
| 2-10 dk | Ana görev bloğu (A1 / A2 / A3'ten biri) |
| 10-12 dk | Kapanış: şehirde görünür bir değişiklik + varsa yeni Kâşif Kartı |
| Haftada 1 | Kâşif Günlüğü |

**12. dakikada oyun kendini durdurmaz ama doğal bir kapanış verir.** Yapay engel ("yarın gel") yok; sadece iyi bir bitiş noktası. Ekran süresi kontrolü velide (`07`).

---

## 16. Üretim maliyeti gerçeği

12 modül × ortalama 3 aşama × 8-15 görev ≈ **300-400 içerik parçası**. Bu, elle yazılabilecek bir hacim değil; bu yüzden:

1. **Manipülatifler yeniden kullanılır.** Birim kare ızgarası 3 modülde (alan, dağılma, çokgen), sayı doğrusu 4 modülde kullanılır. Hedef: 12 modül için **6-7 manipülatif bileşeni**.
2. **Görevler içerik dosyasıdır, kod değil.** Bir görev = JSON. Yeni görev eklemek kod yazmayı gerektirmez. Bkz. `05-teknik-mimari.md` §İçerik Şeması.
3. **Görev üreteçleri.** Parametrik görevler (terazi kurulumları, dikdörtgen bölenleri) tohumdan üretilir; elle yazılan sadece "öğretici" örneklerdir.

**Faz 0 demosu için gerçekçi hedef: 2 modül × 3 aşama × 6 görev = 36 görev.** Bu, iki haftada üretilebilir ve sunum için fazlasıyla yeterli.
