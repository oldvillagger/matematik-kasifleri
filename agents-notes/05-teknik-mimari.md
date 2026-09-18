# 05 — Teknik Mimari

---

## 1. Mimariyi belirleyen üç kısıt

Stack seçimi zevk meselesi değil; bu projede üç sert kısıt var ve doğru cevabı büyük ölçüde onlar veriyor.

**K1 — Bu bir modül, bir uygulama değil.**
Ürün, staj yerinin mevcut eğitim yazılımına **entegre edilecek**. Yani asıl teslim edilen şey bir web sitesi değil, **başka bir sistemin içine gömülebilen bir öğrenme motoru**. Bir Laravel uygulaması başka bir uygulamanın içine gömülemez; bir TypeScript paketi ve bir iframe/web-component gömülebilir.

**K2 — Değer, etkileşimli manipülatifte.**
Ürünün tamamı sürükle-bırak terazi, birim kare ızgarası, pergel inşası, açıölçer gibi **durum yoğun, kare kare animasyonlu istemci bileşenlerinden** oluşuyor. Bu, sunucu tarafında render edilebilecek bir şey değil. Hangi backend seçilirse seçilsin, önde React (veya dengi) olacak.

**K3 — İçerik hacmi koddan büyük.**
23 öğrenme çıktısı, ~100 süreç bileşeni, 300-400 görev. Bunların **veri olması, kod olmaması** gerekiyor; ve veri **doğrulanabilir** olmalı (her görev var olan bir süreç bileşenine bağlanmalı, yoksa CI reddetmeli).

---

## 2. Karar: TypeScript monorepo — çerçeveden bağımsız motor + ince kabuk

```
matematik-kasifleri/
├── packages/
│   ├── curriculum/          # TYMM verisi: temalar, 23 çıktı, ~100 süreç bileşeni
│   │                        # Tek doğruluk kaynağı. Bağımlılığı yok.
│   ├── engine-core/         # ⭐ ÜRÜNÜN KALBİ — saf TypeScript, React yok, DOM yok
│   │   ├── cra-machine.ts       # A1→A2→A3 aşama makinesi (saf reducer)
│   │   ├── support-policy.ts    # destek azaltma (scaffolding fading)
│   │   ├── difficulty.ts        # kural tabanlı zorluk merdiveni
│   │   ├── spaced-review.ts     # 3/7/21 gün aralıklı tekrar kuyruğu
│   │   ├── evidence.ts          # süreç bileşeni kanıtı üretimi
│   │   └── events.ts            # append-only olay günlüğü tipleri
│   ├── content-schema/      # Zod şemaları + içerik doğrulayıcı (CI'da çalışır)
│   ├── manipulatives/       # React: terazi, ızgara, pergel, açıölçer, sayı doğrusu…
│   ├── ui-kit/              # tasarım sistemi, erişilebilir temel bileşenler
│   └── sdk/                 # gömme SDK'sı (postMessage köprüsü + npm API)
├── apps/
│   ├── web/                 # Next.js 15 — öğrenci uygulaması + öğretmen/veli paneli
│   └── studio/              # (F2) içerik editörü
├── content/
│   └── mat-5/               # görevler, JSON — kod değil
│       ├── mat-5-2-1/       # Denge Şehri
│       └── mat-5-4-x/       # Birim Kare Atölyesi
├── docs/
└── agents-notes/            # bu klasör
```

**Anahtar fikir:** `engine-core` hiçbir çerçeveye, DOM'a, ağa bağımlı değil. Girdi olarak olay alır, çıktı olarak yeni durum + kanıt kaydı üretir. Bu yüzden:
- Birim testi kolay (saf fonksiyonlar)
- Sunucuda da çalışır (öğretmen raporlarını sunucuda yeniden hesaplamak için)
- **Başka bir platformun içine taşınabilir** (K1)

### Seçilen teknolojiler

| Katman | Seçim | Neden |
|---|---|---|
| Dil | **TypeScript 5.x (strict)** | İçerik şeması, motor ve UI aynı tipleri paylaşır; şema tekrarı yok |
| Monorepo | **pnpm workspaces + Turborepo** | Paket sınırlarını gerçekten zorlar; motorun React'e sızmasını engeller |
| Kabuk | **Next.js 15 (App Router) + React 19** | Öğrenci uygulaması, panel ve API tek yerde; PWA ve statik demo dağıtımı kolay |
| Stil | **Tailwind CSS 4** | Hızlı, tutarlı, tasarım token'larıyla iyi anlaşıyor |
| Bileşen | **Radix UI** (temel) + kendi manipülatiflerimiz | Erişilebilirlik hazır gelir (WCAG 2.2 AA hedefi) |
| Animasyon | **Motion** (eski Framer Motion) | Spring tabanlı; terazi eğilmesi ve karo oturması için doğru araç |
| Çizim | **SVG** varsayılan, **PixiJS** sadece gerekirse | Manipülatiflerin hiçbiri yüzlerce sprite gerektirmiyor. SVG erişilebilir, ölçeklenir, DOM'dan test edilebilir |
| Durum | `engine-core` saf reducer + **Zustand** bağlaması | Olay günlüğü doğal olarak serileşir |
| Veritabanı | **PostgreSQL** | İlişkisel model + JSONB (olay yükleri) + gerçek analitik |
| ORM | **Prisma** | Ekip aşinalığı, migration olgunluğu. (Alternatif: Drizzle — daha hafif, ama ekip maliyeti) |
| Kimlik | **Auth.js v5**, çocuk için sınıf kodu + görsel parola | Çocuktan e-posta istemiyoruz — KVKK. Bkz. `07` |
| Test | **Vitest** (birim) + **Playwright** (uçtan uca) + **Storybook** (manipülatifler) | |
| Çevrimdışı | **PWA + Workbox + IndexedDB kuyruğu** | Okul internetine güvenilmez. Görevler önbelleğe alınır, olaylar sonra gönderilir |

---

## 3. ADR-001 — Neden Laravel değil?

Önceki projeler Laravel'di, bu yüzden bu kararın gerekçelendirilmesi gerekiyor. Laravel **kötü bir seçim değil**; sadece bu ürünün şekline uymuyor.

| Kriter | Laravel (+ Inertia/React) | TS monorepo (Next.js) |
|---|---|---|
| Gömülebilirlik (K1) | ✗ Bir Laravel uygulaması başka bir uygulamanın içine gömülemez; en fazla iframe ile yan yana durur | ✓ Motor bir npm paketi; kabuk iframe/web-component |
| Manipülatif yoğunluğu (K2) | ~ React zaten gerekecek → iki dil, iki ekosistem | ✓ Tek dil |
| İçerik şeması tek kaynak (K3) | ✗ PHP tarafında doğrulama + TS tarafında tip = iki kez tanımlama | ✓ Zod şeması hem doğrular hem tip üretir |
| Motorun sunucuda çalışması | ✗ Motor TS ise PHP'de tekrar yazılır | ✓ Aynı kod |
| Ekip aşinalığı | ✓ | ~ öğrenme maliyeti var |
| Admin/panel hızı | ✓ Filament ile çok hızlı | ~ elle yazılır |
| Çevrimdışı/PWA | ~ | ✓ |

**Karar:** TypeScript monorepo.
**Ama:** Laravel'in güçlü olduğu yer (yönetim paneli, faturalama, okul/lisans yönetimi) yadsınmıyor — bkz. §7, "Laravel geri dönüş planı".

### Reddedilen diğer seçenekler

- **Unity / Godot (WebGL):** Paket boyutu okul cihazları için ağır, erişilebilirlik (ekran okuyucu, klavye) neredeyse imkânsız, entegrasyon yüzeyi kötü. Bizim manipülatiflerimiz oyun motoru gerektirecek karmaşıklıkta değil.
- **Phaser:** Canvas tabanlı; DOM erişilebilirliğini kaybederiz, HTML formlarıyla (A3 aşaması) karışık olur.
- **XState** (aşama makinesi için): Değerlendirildi. Saf reducer tercih edildi çünkü olay günlüğü zaten append-only ve serileşebilir olmalı; XState'in katma değeri bu yapıda maliyetini karşılamıyor.
- **Ayrı NestJS API'si (F0/F1'de):** Erken bölünme. Next.js route handler'ları yeterli; veri erişimi repository katmanının arkasında olduğu için gerekirse F2'de ayrılabilir.

---

## 4. İçerik şeması (K3'ün cevabı)

Bir görev, kod değil veridir:

```jsonc
// content/mat-5/mat-5-2-1/a1-ilk-denge.task.json
{
  "id": "mat-5-2-1.a1.ilk-denge",
  "outcome": "MAT.5.2.1",
  "stage": "A1",                          // A1 | A2 | A3
  "manipulative": "balance-scale",
  "difficulty": 1,
  "processComponents": ["a"],             // curriculum paketinde VAR OLMALI
  "physicalTask": null,
  "setup": {
    "left":  [{ "type": "weight", "value": 5 }],
    "right": [{ "type": "box", "id": "x" }, { "type": "weight", "value": 2 }],
    "tools":  ["place", "remove", "undo"] // "doubleHand" henüz açık değil
  },
  "goal":     { "type": "balance" },
  "prompt":   { "tr": "Terazi neden eğik? Dengeye getir." },
  "hints":    [],                          // A1'de ipucu yok
  "evidence": [
    { "component": "a", "trigger": "prediction.submitted" }
  ]
}
```

**CI'da zorlanan kurallar** (`content-schema` + `pnpm content:lint`):

1. `outcome` gerçek bir TYMM kodu olmalı (`curriculum` paketinden).
2. `processComponents` o çıktının gerçek bileşenleri olmalı (`a`, `b`, `c`, `ç`… — uydurma harf reddedilir).
3. Her görev **en az bir** `evidence` kaydı üretmeli. **Kanıt üretmeyen görev içeriğe girmez.**
4. `stage: "A1"` ise `hints` boş, skor bileşeni kapalı, zaman sınırı yok.
5. `stage: "A3"` ise `hints` boş **ve** `timeLimit` alanı hiç olmamalı (şema bu alanı A3'te yasaklıyor).
6. Her öğrenme çıktısının **üç aşamasında da** en az bir görev olmalı — eksik aşama, eksik kapsama demektir.

> Kural 4, 5 ve 6 pedagojik kırmızı çizgilerin (`03-pedagojik-mimari.md` §5) **koda gömülmüş hâli**. Bir tasarımcı ya da sonraki geliştirici yanlışlıkla A3'e süre koyamaz — şema izin vermez.

---

## 5. Veri modeli (özet)

```
Organization ──< School ──< Classroom ──< Enrollment >── Learner
                                              │
Learner ──< Session ──< EventLog (append-only, JSONB)
   │
   └──< OutcomeState          (çıktı bazında: aşama, support, zorluk)
   └──< ComponentEvidence     (süreç bileşeni bazında kanıt — ÜRÜNÜN ASIL ÇIKTISI)
   └──< ReviewQueueItem       (aralıklı tekrar: nextDueAt, box)

Guardian ──< GuardianLink >── Learner     (veli erişimi, rıza kaydı)
Teacher  ──< Classroom
ConsentRecord  (KVKK: kim, ne zaman, neye, hangi sürüme rıza verdi)
```

**Tasarım kararları:**

- **`EventLog` append-only ve olay kaynaklıdır.** Tüm türetilmiş durumlar (`OutcomeState`, `ComponentEvidence`) olaylardan yeniden hesaplanabilir. Neden: pedagojik parametreler (destek azaltma eşiği, zorluk kuralı) değişecek; geçmiş veriyi yeni kurala göre **yeniden hesaplayabilmek** araştırma değeri taşıyor.
- **`ComponentEvidence` ürünün ticari farkı.** "Öğrenci %72" değil, "MAT.5.2.1-a ve -b kanıtlandı, -ç henüz yok". Öğretmenin TYMM'de ölçmekte zorlandığı şey tam olarak bu.
- **Çocuk kaydında kişisel veri minimumda:** ad yerine takma ad, doğum tarihi yerine sınıf düzeyi, e-posta yok. Bkz. `07`.

---

## 6. Telemetri ve öğretmen paneli

Olay sözlüğü (xAPI'den esinlenen, ama kendi sade şemamız):

```
session.started | task.started | manipulative.moved | prediction.submitted
hint.requested  | attempt.submitted | support.changed | task.completed
evidence.recorded | review.scheduled | session.ended
```

`manipulative.moved` **önemli ve sık**: çocuğun terazide yaptığı her hamle. Bu olaydan "çocuk çözüme nasıl vardı?" sorusu cevaplanır — kâğıt sınavın asla veremeyeceği şey. Hacim kontrolü için istemcide toplulaştırılır (debounce + hamle özeti), ham koordinat akışı gönderilmez.

**Öğretmen paneli (F1):**
- Sınıf × çıktı ısı haritası (kırmızı = bu çıktıda sınıfın çoğu takılı)
- Süreç bileşeni kırılımı (hangi bileşende takılıyorlar — "genelleme kuruyorlar ama sınamıyorlar")
- Yazdırılabilir fiziksel görev kâğıtları
- **Kıyaslamalı öğrenci sıralaması yok** (pedagojik kırmızı çizgi panelde de geçerli)

---

## 7. Entegrasyon yüzeyi (K1 — asıl teslim)

Staj yerinin platformunun ne olduğu **henüz bilinmiyor** (`00-oturum-gunlugu.md`, açık soru 1). Üç senaryonun üçü de destekleniyor; hangisinin yapılacağı cevaba göre seçilecek. Motor çerçeveden bağımsız olduğu için üçü de aynı çekirdeği kullanır.

### Senaryo A — npm paketi olarak gömme (platform React ise)
```tsx
import { LearningModule } from "@matematik-kasifleri/sdk";

<LearningModule
  outcome="MAT.5.2.1"
  learnerToken={jwt}
  onEvidence={(e) => platform.recordSkill(e)}
/>
```
En sıkı entegrasyon; tek sayfada, tek oturumda.

### Senaryo B — iframe + postMessage köprüsü (platform ne olursa olsun) ← **varsayılan**
```js
frame.postMessage({ type: "init", learnerToken, outcome: "MAT.5.2.1" });
window.onmessage = (e) => { /* evidence, progress, sessionEnd */ };
```
Platformun diline bakmaz. **Laravel, .NET, PHP, WordPress — hepsiyle çalışır.** Kimlik doğrulama kısa ömürlü imzalı JWT ile; çocuk ikinci kez giriş yapmaz.

### Senaryo C — LTI 1.3 (platform bir LMS ise: Moodle, Canvas, ALMS)
Standart LTI Advantage: derin bağlama (Deep Linking) ile öğretmen çıktı seçer, Assignment & Grade Services ile kanıtlar geri yazılır. Okul pazarına satış için en güçlü seçenek.

### Laravel geri dönüş planı
Staj yeri "backend Laravel olacak" derse mimari **bozulmaz**: `apps/web` Next.js sadece istemci + BFF olarak kalır, veri erişimi `repository` arayüzünün arkasındadır ve arkasına Laravel API'si takılır. `engine-core`, `manipulatives` ve `content` hiç etkilenmez. Bu senaryo için `docs/adr/` altında bir adaptör notu bırakılacak.

---

## 8. Performans ve cihaz bütçesi

Hedef cihaz varsayımı (doğrulanacak — açık soru 3): **okul tableti / düşük-orta Android / Chromebook, Chrome.**

| Metrik | Bütçe |
|---|---|
| İlk yükleme (3G Fast) | ≤ 3 sn etkileşime hazır |
| Modül JS paketi (motor + manipülatif) | ≤ 180 KB gzip |
| Manipülatif etkileşim gecikmesi | ≤ 50 ms |
| Animasyon | 60 fps hedef, 30 fps taban |
| Çevrimdışı | Bir modülün tüm görevleri önbellekte |

Uygulama: modül bazlı kod bölme (bir çocuk aynı anda tek modüldedir), SVG (sprite sheet değil), font subsetting (Türkçe glifler), görsel varlıklar WebP/AVIF.

---

## 9. Kalite kapıları (CI)

```
pnpm lint        → ESLint + TS strict, hata = kırmızı
pnpm test        → Vitest: engine-core %90+ kapsam (pedagojik mantık burada)
pnpm content:lint→ İçerik şeması + müfredat bağlantısı + kırmızı çizgi kuralları
pnpm test:e2e    → Playwright: bir çıktının A1→A2→A3 tam akışı
pnpm a11y        → axe-core, WCAG 2.2 AA ihlali = kırmızı
pnpm build       → paket boyutu bütçesi aşılırsa kırmızı
```

`engine-core` testlerinin özel önemi var: **destek azaltma politikası ve zorluk merdiveni birer pedagojik iddiadır.** Test edilmemiş pedagoji, uygulanmamış pedagojidir.

---

## 10. Dağıtım

| Ortam | Nerede | Not |
|---|---|---|
| Faz 0 demo | Vercel / statik | **Gerçek çocuk verisi yok** — demo sahte kullanıcıyla çalışır |
| Faz 1+ | Docker + AB/TR veri merkezi, yönetilen PostgreSQL | KVKK yurt dışı aktarım kısıtları için bkz. `07` |
| Gözlemlenebilirlik | Sentry (PII maskeli) + yapılandırılmış log | Çocuk verisi loglara girmez |

Faz 0 demosu **tek komutla ayağa kalkmalı** (`pnpm dev`) ve **tek linkle paylaşılabilmeli** — staj sunumunun pratik gereği.
