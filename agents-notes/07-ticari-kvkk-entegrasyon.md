# 07 — Ticari Model, KVKK ve Entegrasyon

> **Uyarı:** Bu doküman hukuki danışmanlık değildir. KVKK ve çocuk verisi başlıkları, ürün gerçek kullanıcıya açılmadan önce **bir avukat tarafından** gözden geçirilmelidir. Aşağıdakiler, o incelemeye hazırlık niteliğinde mühendislik notlarıdır.

---

## 1. Çocuk verisi ve KVKK — mimariyi belirleyen kısıtlar

10-11 yaş çocuk verisi işlemek, "kullanıcı kaydı" işlemekten kategorik olarak farklı. Kararlar kod yazılmadan alınmalı, çünkü sonradan düzeltmek veri modelini yeniden yazmak demek.

### Veri minimizasyonu (varsayılan tasarım)

| Toplanmayacak | Yerine |
|---|---|
| Çocuğun e-posta adresi | Yok — çocuk sınıf kodu + görsel parola ile girer |
| Çocuğun tam adı | Takma ad / avatar adı (veli veya öğretmen belirler) |
| Doğum tarihi | Sınıf düzeyi (5) |
| Telefon | Yok |
| Konum | Yok |
| Yüz/ses kaydı | Yok |
| Fotoğraf (fiziksel görev kanıtı) | **Faz 2'ye ertelendi** — ayrı rıza + saklama kararı gerektirir |
| Üçüncü taraf reklam/analitik tanımlayıcıları | **Hiçbir zaman.** Reklam SDK'sı yok |

### Rıza mimarisi

- Rıza **veliden** alınır, çocuktan değil.
- `ConsentRecord` tablosu: kim, ne zaman, hangi amaç, **aydınlatma metninin hangi sürümü**. Metin değişince rıza yenilenir.
- **Okul senaryosunda** (B2B) veri sorumlusu büyük ihtimalle okul/kurum, biz veri işleyeniz → **veri işleyen sözleşmesi** gerekir. Bu ayrım faturalamayı ve sorumluluğu değiştirir; satış öncesi netleşmeli.
- Veli paneli: **verileri görme, dışa aktarma ve silme** düğmeleri — ürün özelliği olarak, e-posta talebi olarak değil.

### Saklama ve silme

- Ham `EventLog`: 12 ay, sonra toplulaştırılıp anonimleştirilir.
- Türetilmiş ilerleme (`ComponentEvidence`): öğrenci kayıtlı olduğu sürece.
- Hesap silme → 30 gün içinde tam silme, yedeklerden temizlenme dâhil.

### Yurt dışı aktarım

KVKK'nın yurt dışına veri aktarım rejimi, ABD merkezli bulut kullanımını karmaşıklaştırıyor. Mühendislik kararı: **üretim veritabanı ve olay deposu Türkiye veya AB'de tutulacak.** Faz 0 demosu Vercel'de olabilir çünkü **gerçek çocuk verisi yok**; Faz 1'de dağıtım taşınır (`05-teknik-mimari.md` §10).

### Log ve hata izleme

Sentry/log satırlarına çocuk tanımlayıcısı girmez. Hata raporlarında `learnerId` yerine oturum bazlı geçici takma kimlik kullanılır.

---

## 2. Ürün etiği — ticari kararın pedagojiye teslim olduğu yerler

Bunlar gelir artırabilecek ama yapılmayacak şeyler. Karar önceden verildi ki, baskı geldiğinde tartışma yeniden açılmasın:

| Yapılmayacak | Neden |
|---|---|
| Öğrenme içeriğini kilitleyen premium | Ödeme gücü, öğrenme hakkını belirleyemez |
| Rastgele ödül kutusu / kart paketi | Kumar mekaniği; çocuk ürününde kabul edilemez |
| Çocuğa gösterilen satın alma çağrısı | Satın alma kararı velinin; çocuk baskı aracı değildir |
| Seri (streak) bildirimi ile geri çağırma | Suçluluk üzerinden tutundurma |
| Reklam | — |
| Genel lider tablosu | `03-pedagojik-mimari.md` §5 |
| Çocuklar arası açık mesajlaşma | Güvenlik + moderasyon yükü |

**Ödeme sadece kozmetik olabilir** (karargâh eşyası, avatar). Kozmetik bile çocuğa değil, veli hesabına satılır.

---

## 3. İş modeli seçenekleri

Hangisinin geçerli olduğu staj yerinin cevabına bağlı (açık soru 2). Üçünün de mimari sonuçları farklı:

### A) B2B — Okul/kurum lisansı ← **en olası ve en uygun**
- Alıcı: okul, kurs, yayınevi, eğitim yazılımı firması
- Fiyat: öğrenci başına yıllık, sınıf/okul paketleri
- Mimari sonuç: **çok kiracılı (multi-tenant)**, okul→sınıf→öğrenci hiyerarşisi, öğretmen paneli kritik, LTI değerli
- Avantaj: rıza ve fatura tek noktada; çocuğa hiç ödeme gösterilmez
- **Not:** Staj yerinin mevcut eğitim yazılımına entegre edilecek olması, bu modülün zaten B2B bir ürünün parçası olacağı anlamına geliyor. Varsayılan bu.

### B) B2C — Veli aboneliği
- Mimari sonuç: veli hesabı birincil, ödeme altyapısı (iyzico/PayTR), abonelik yaşam döngüsü
- Risk: Çocuk ürünlerinde B2C tutundurma, yasakladığımız mekaniklerin tam olarak kullanıldığı yer. Bu kısıtla B2C daha zor

### C) B2B2C — Kurum dağıtır, veli öder
- Mimari sonuç: her ikisinin karması; en karmaşık. Faz 3'ten önce ele alınmamalı

**Faz 0-1 için karar:** B2B varsayımıyla ilerlenir (okul/sınıf hiyerarşisi veri modelinde baştan var), B2C kapısı kapatılmaz.

---

## 4. Entegrasyon — staj yerinin platformuna giriş

Teknik detay `05-teknik-mimari.md` §7'de. Burada iş tarafı:

| Senaryo | Ne zaman | Efor | Onlar için maliyet |
|---|---|---|---|
| **B — iframe + postMessage** | Varsayılan; platform dilinden bağımsız | Düşük | Bir iframe + bir JWT endpoint'i |
| **A — npm paketi** | Platformları React ise | Orta | Paket kurulumu + sürüm yönetimi |
| **C — LTI 1.3** | Platformları bir LMS ise | Yüksek | Standart; ama karşılığında okul pazarı açılır |

**İlk toplantıda sorulacak:** *"Mevcut platformunuzun önyüzü ne? Kullanıcı oturumunu nasıl doğruluyorsunuz? Tek oturum açma (SSO) için bize kısa ömürlü imzalı bir token verebilir misiniz?"* — Bu üç cevap entegrasyon senaryosunu belirler.

**Sunumda vurgulanacak:** Bu modül onların platformunu **değiştirmeyi gerektirmiyor**. Motor çerçeveden bağımsız; Laravel de olsa .NET de olsa aynı şekilde takılıyor.

---

## 5. Fikri mülkiyet — public repo uyarısı

Bu repo, talep üzerine **public** açıldı. Ticari bir ürün için bunun somut sonuçları var; karar bilinçli alınsın diye not ediliyor:

- Kaynak kod herkes tarafından okunabilir, kopyalanabilir, çatallanabilir (fork).
- Lisans konulmazsa **varsayılan olarak tüm haklar saklıdır** — kimse yasal olarak kullanamaz. Ama pratikte kopyalamayı engellemez.
- Staj yeri kodun sahipliği konusunda bir beklenti taşıyor olabilir (staj sözleşmesinde fikri mülkiyet maddesi olması olağandır). **Bu, repo public kalmadan önce onlara sorulmalı.**
- Pedagojik mimari ve müfredat eşlemesi (`agents-notes/`) ürünün asıl farkı; bunlar da açık.

**Alınan önlem:** Açık kaynak lisansı **konulmadı**; `LICENSE` yerine `NOTICE.md` ile "tüm hakları saklıdır" bildirimi eklendi.

**Öneri:** Staj yeriyle görüşene kadar repo public kalabilir (henüz kod yok, sadece planlama). Faz 0 kodu yazılmadan önce şu karar verilmeli:
- Public kalsın (portföy değeri, işveren görebilir) **veya**
- Private'a alınsın, sadece sunum için erişim verilsin.

Varsayılan olarak public bırakıldı — kullanıcının açık talebi bu yönde. Karar değişirse `gh repo edit --visibility private` tek komut.

---

## 6. Rekabet ve konumlandırma

| Oyuncu | Ne yapıyor | Bizim farkımız |
|---|---|---|
| Prodigy Math | RPG kabuğu + matematik soruları | Matematik kabuğun içinde değil, mekaniğin kendisi. Premium baskısı yok |
| DragonBox | Cebiri mekanikle öğretiyor (çok iyi) | Tek konu değil, **TYMM müfredatının tamamı**; öğretmen ölçme verisi var |
| Khan Academy / EBA | Kapsam geniş, oyunlaştırma minimum | Manipülatif etkileşim ve süreç bileşeni kanıtı |
| Yerli soru bankası uygulamaları | Soru çözme + istatistik | Kavram inşası; sorudan önce gelen aşama |

**Tek cümlelik konumlandırma:**
> TYMM'nin süreç bileşenlerini gerçekten ölçebilen, matematiği ödül değil mekanik yapan, oyundan sınava kademeli köprü kuran 5. sınıf matematik modülü.

**Asıl ticari kanca, öğrenci tarafında değil öğretmen tarafında:** Yeni müfredat öğretmenden beceri ölçmesini istiyor, ama kâğıt-kalem "varsayımda bulunur" bileşenini ölçemiyor. Bunu ölçebilen ilk ürün olmak, satın alma kararını veren kişiye (okul/kurum) doğrudan hitap eder.

---

## 7. Backlog — şimdi yapılmayacak ama unutulmayacak fikirler

Faz 0/1 kapsamına girmeye çalışan her fikir buraya yazılır, yapılmaz.

- 6, 7, 8. sınıf genişlemesi (mimari hazır)
- Öğretmenin kendi görevini üretebildiği içerik stüdyosu (F2)
- Sınıf içi ortak hedef (kooperatif, rekabet değil)
- Çocuğun kendi bulmacasını kurup paylaşması
- Sesli anlatım / TTS ile tam sesli mod (erişilebilirlik ötesi: okuma güçlüğü)
- Offline-first tablet dağıtımı (internet olmayan okullar)
- Öğrenci performansından otomatik veli raporu (özet dil modeli ile — KVKK değerlendirmesi gerekir)
- xAPI/LRS entegrasyonu (kurumsal müşteri isterse)
- Uyarlanabilir model (BKT/Elo) — veri biriktikten sonra
