# 08 — Genişletilmiş Platform Mimarisi (Oturum 002 kararları)

Bu doküman, `00`–`07` dosyalarındaki planlamanın üstüne, 2026-09-18 oturumunda kullanıcıyla
yapılan beyin fırtınasında alınan **mimariyi değiştiren** kararları kayda geçirir. `00-oturum-gunlugu.md`
kronolojik özet tutar; burası bu kararların **teknik gerekçesi ve tasarımıdır.**

---

## 1. Neden bu doküman var

Kullanıcı üç yönde netlik istedi:

1. `04-oyun-tasarimi.md`'deki spesifik mekanik fikirleri (terazi, "Denge Şehri" vb.) **sabit kabul edilmeyecek** —
   konu/müfredat eşlemesi ve CRA pedagojik çerçevesi korunacak, ama her modülün **yaratıcı oyun konsepti**
   yeniden tasarlanacak (bkz. §4).
2. Ürün sadece "TYMM 5. sınıf matematik" değil, **çok derslik/çok konulu bir platforma** dönüşecek.
   Mimari bunu baştan destekleyecek şekilde kurulmalı — sonradan yeniden yazmak pahalı.
3. Her öğrenme çıktısı bloğunun sonunda, alıştırma aşamaları (A1→A2→A3) bittikten sonra,
   **gerçek problem çözmeyi gerektiren, ~10 sorluk, süresiz bir "Konu Sonu Testi"** olacak.

Yığın kararı **değişmedi**: React (Next.js 15) + Node.js. PHP/Laravel kullanılmayacak — bu zaten
`05-teknik-mimari.md` ADR-001'de gerekçelendirilmişti, kullanıcı bunu bu oturumda **teyit etti.**

---

## 2. Çok-derslik jenerik veri modeli

### Eski model (tek derse kilitli)

```
packages/curriculum/   → TYMM 5. sınıf matematiğine hardcode edilmiş TS dizisi
content/mat-5/          → sadece matematik görevleri
```

Bu model, ikinci bir ders (örn. Fen Bilimleri, 6. sınıf matematik) eklendiğinde
`packages/curriculum`'un kodunun yeniden yazılmasını gerektirirdi. Kabul edilemez —
CLAUDE.md'nin kendi ilkesiyle çelişir: *"Yeni görev eklemek kod yazmayı gerektirmez."*
Bu ilke artık **yeni ders eklemek** için de geçerli olmalı.

### Yeni model (jenerik hiyerarşi)

```
Subject          (örn. "Matematik", slug: "matematik")
  └─ Course       (örn. "TYMM 5. Sınıf", slug: "tymm-5", bir müfredat sürümü)
       └─ Theme        (örn. MAT.5.2 İşlemlerle Cebirsel Düşünme)
            └─ Outcome      (örn. MAT.5.2.1 — öğrenme çıktısı)
                 └─ ProcessComponent  (a, b, c, ç, d…)
       └─ Module       (örn. "Denge Meydanı" — 1+ outcome'u kapsayan oyun konsepti)
            └─ Task         (A1 | A2 | A3 | Assessment — JSON içerik)
```

**Kritik ayrım — `Outcome` ile `Module` farklı kavramlar:**
- `Outcome` müfredatın kendisi (resmî, değiştirilemez, `curriculum` verisinden gelir).
- `Module` bizim tasarladığımız oyun/etkileşim konsepti; bir modül birden çok çıktıyı
  kapsayabilir (örn. mevcut planda Denge Meydanı hem eşitlik korunumu hem değişme/birleşme/
  dağılma özelliklerini kapsıyordu). Modül-çıktı eşlemesi **many-to-many**.

### Depolama (Faz 0 — hâlâ kod değil, JSON)

```
content/
  matematik/
    tymm-5/
      curriculum.json      ← Subject→Course→Theme→Outcome→ProcessComponent (tek dosya, Zod doğrulanır)
      modules/
        <module-slug>.module.json   ← modül meta verisi: hangi outcome'ları kapsıyor, hangi manipülatif/oyun tipi
      tasks/
        <module-slug>/
          a1/*.task.json
          a2/*.task.json
          a3/*.task.json
          assessment/*.task.json    ← §3, yeni içerik tipi
  <baska-ders-slug>/               ← Faz 2+: ikinci ders buraya, kod değişmeden eklenir
```

**`packages/curriculum` paketi artık veri deposu değil, tipli bir yükleyici/erişim katmanı.**
`outcomes.ts` içindeki hardcode TYMM dizisi, bu JSON modeline taşınacak (bkz. §5, açık iş).
TYMM 5. sınıf matematik, bu jenerik modelin **ilk (ve Faz 0-1'de tek) doldurulmuş kursu** olur —
veri kaybı yok, sadece TS dizisinden JSON dosyasına taşınıyor, Zod şeması ile doğrulanıyor.

### Admin panel bunun üzerine oturur

`apps/studio` (roadmap'te Faz 2'ye yazılmıştı — **öncelik yükseltildi**, mimari şimdi kuruluyor,
tam CRUD UI'ı kademeli gelecek):

- **Faz 0/1 kapsamı:** salt-okunur içerik gezgini + `content:lint` sonuçlarını gösteren panel
  (hangi outcome'un component'i eksik, hangi task hangi kırmızı çizgiyi ihlal ediyor).
- **Faz 1/2 kapsamı:** Subject/Course/Theme/Outcome CRUD, Module tanımlama formu, Task editörü
  (şema-doğrulamalı form, canlı önizleme).
- Yetkilendirme: sadece içerik editörü rolü (öğretmen/veli **değil** — ayrı roller, bkz. `07`).

Bunun mimari sonucu: **API katmanı (repository arayüzü) content CRUD'unu baştan bu jenerik
modele göre tasarlar** (`05-teknik-mimari.md` §7'deki "Laravel geri dönüş planı"ndaki repository
soyutlamasıyla aynı prensip — veri erişimi arayüzün arkasında, üstüne hangi UI/DB gelirse gelsin
değişmez).

---

## 3. Konu Sonu Testi (yeni içerik tipi: `assessment`)

### Ne değişti

Eski tasarımda A3 ("Bağımsız Geri Çağır") hem günlük aralıklı-tekrar sorularını hem de
"Usta Sınavı"nı (5 soru + 1 açık uçlu) taşıyordu. Kullanıcı bunu yetersiz buldu: her öğrenme
bloğunun sonunda, **gerçek test formatında, problem çözmeyi gerektiren, en az ~10 sorudan
oluşan** bir değerlendirme istiyor.

### Karar

`assessment`, A3'ün alt kümesi değil, **dördüncü bir içerik tipi.** Bir modülün tüm outcome'ları
A1→A2→A3'ü tamamladıktan sonra açılır.

```
A1 → A2 → A3 (her outcome için, mevcut CRA döngüsü — DEĞİŞMEDİ)
                    │
                    ▼ modüldeki tüm outcome'lar A3'ü bitirdiğinde açılır
            ┌───────────────────┐
            │   ASSESSMENT      │  "Konu Sonu Testi"
            │   (Konu Sonu)     │
            └───────────────────┘
```

**Kırmızı çizgiler burada da geçerli, değişmedi:**
- Süre sınırı yok (`timeLimit` şemada yok — A3'teki kural buraya da uygulanır).
- İpucu yok.
- Puan değil, harita/rozet biçiminde sonuç ("10 sorudan 8'i çözüldü" değil, hangi süreç
  bileşenlerinin kanıtlandığı gösterilir — `03-pedagojik-mimari.md` ile tutarlı).
- Kaygı kelimesi yok ("sınav" yerine "Konu Sonu Görevi" gibi çocuğa görünen bir isim seçilecek,
  kesin isim §4 marka çalışmasıyla birlikte belirlenecek).

**Değişen:** soru sayısı 5-6'dan **8-10'a** çıktı, format daha çok "gerçek problem çözme"
(çok adımlı, bağlamsal problem) ağırlıklı, salt hatırlama sorusu değil. Bu, MAT.5.1.2'nin 9
süreç bileşenli problem-çözme yapısına da daha iyi oturuyor.

**İleride (Faz 2+, backlog, ŞİMDİ YAPILMAYACAK):** veli/öğretmen açarsa görünen, **opsiyonel**
süreli deneme modu. Varsayılan kapalı. Bu, `07-ticari-kvkk-entegrasyon.md` §7 backlog'una da
eklendi. A3/assessment'in süresiz kuralını **bozmaz** çünkü ayrı, isteğe bağlı bir moddur.

### content-schema etkisi

`content-schema` paketine yeni bir `stage: "ASSESSMENT"` değeri eklenecek:
- `hints` boş olmalı (A3 kuralı burada da geçerli).
- `timeLimit` alanı şemada yasak (A3 kuralı burada da geçerli).
- `items` alanı en az 8 soru içermeli (yeni kural, CI'da zorlanır).
- Bir modülün assessment'i, o modüldeki **her outcome'dan en az 1 soru** içermeli (kapsama kuralı).

---

## 4. Yaratıcı oyun tasarımı — süreç

`04-oyun-tasarimi.md`'deki modül/mekanik eşlemesi (hangi outcome hangi modülde, hangi fiziksel
görev zorunlu/önerilir) **müfredat doğrulaması olarak geçerliliğini koruyor** — bunlar MEB
metninden türetildi, atılmıyor. Atılan şey **spesifik oyun konsepti/isim/görsel fikirleri**
(terazi, "Denge Şehri", "Usta Nazlı" vb.).

**Yeni süreç:** Her modül için, aynı tasarım testi (`CLAUDE.md` — mekaniği çıkarınca matematik
kalıyor mu / matematiği çıkarınca oyun kalıyor mu) uygulanarak **birden fazla yaratıcı konsept**
üretilecek, kullanıcıyla birlikte seçilecek, sonra buraya ve `04-oyun-tasarimi.md`'nin yerini
alacak yeni bir dosyaya (`09-oyun-konseptleri-v2.md`) yazılacak.

**Bu oturumda başlanan:** Faz 0'ın iki demo modülü (MAT.5.2.1, MAT.5.4.1-3) için konsept
alternatifleri kullanıcıya sunuldu — sonucu `09-oyun-konseptleri-v2.md`'de.

---

## 5. Açık işler (bu kararların sonucu)

1. `packages/curriculum/src/outcomes.ts` (hardcode TS) → `content/matematik/tymm-5/curriculum.json`'a
   taşınacak; paket yükleyici/erişim katmanına dönüşecek. **Henüz yapılmadı.**
2. `content-schema` paketine `Subject/Course/Theme` seviyesi + `stage: "ASSESSMENT"` eklenecek.
3. MAT.5.4.x süreç bileşenleri hâlâ kaynakta yok (`00-oturum-gunlugu.md` açık soru — henüz cevap gelmedi).
   Konu Sonu Testi'nin kapsama kuralı (§3) bu eksik giderilmeden Birim Kare modülü için doğrulanamaz.
4. `apps/studio` iskeleti (salt-okunur içerik gezgini) Faz 0 kapsamına eklenmeli mi, yoksa S0.1
   bitince mi başlanmalı — roadmap (`06-yol-haritasi.md`) güncellenmedi, bu karar bekliyor.
