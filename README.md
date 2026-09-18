<div align="center">

# Matematik Kâşifleri

**TYMM 5. Sınıf Matematik Öğrenme Modülü**

Matematiği oyunun *ödülü* değil, *mekaniği* yapan;
oyundan sınava kademeli köprü kuran bir ortaokul matematik modülü.

`Durum: Planlama tamamlandı — Faz 0 geliştirmesi başlıyor`

</div>

---

## Sorun

2024-2025'ten itibaren kademeli uygulamaya giren **Türkiye Yüzyılı Maarif Modeli (TYMM)**, matematik programını içerik temelli yapıdan **beceri temelli** yapıya taşıdı. Her öğrenme çıktısı `a) varsayımda bulunur`, `b) genellemeleri belirler`, `c) sınar` gibi **süreç bileşenlerine** ayrıldı.

Buradaki pratik sorun şu: **öğretmen bu bileşenleri kâğıt-kalemle ölçemiyor.** Bir sınav kâğıdı "çocuk varsayımda bulundu mu?" sorusuna cevap veremez. Sonucu görür, süreci görmez.

Piyasadaki çoğu eğitim oyunu ise bu boşluğu doldurmuyor, çünkü çoğu aynı kalıbı tekrarlıyor: bir oyun oynarsın, arada soru çıkar, doğru cevaplarsan oynamaya devam edersin. Bu, çocuğa matematiği **oynamaya engel olan şey** olarak öğretir.

## Yaklaşım

Bu proje üç ilke üzerine kurulu:

**1. Matematik, oyunun mekaniğinin kendisidir.**
Çocuk doğru cevap verdiği için puan almaz — dengeyi kurduğu için köprü ayakta kalır. Her mekanik şu testten geçer: *mekaniği çıkarınca matematik kalıyorsa, mekanik bir kabuktur.*

**2. Somuttan soyuta köprü, sıçrama değil.**
Her öğrenme çıktısı aynı üç aşamalı CRA döngüsünden geçer:

```
A1 KEŞFET (Somut)  →  A2 BAĞLA (Yarı-soyut)  →  A3 GERİ ÇAĞIR (Soyut)
manipülatif,           nesne → şema → sembol,     sembol tek başına,
hata risksiz,          destek sürekli azalır      ipucusuz, SÜRESİZ
puan yok
        └──── paralel: fiziksel görev (pergel, cetvel, kâğıt katlama) ────┘
```

**3. Çocuğun her hamlesi bir ölçme verisidir.**
Terazide yaptığı her hareket kaydedilir ve **süreç bileşeni kanıtına** dönüşür. Öğretmen "öğrenci %72" değil, *"MAT.5.2.1-a ve -b kanıtlandı, -ç henüz yok"* görür. Kâğıdın veremediği veri budur.

## Neden bu tasarım?

Modül fikri havadan gelmedi. Resmî TYMM programı, MAT.5.2.1 (eşitliğin korunumu) çıktısının öğretim uygulamasında birebir şunu yazıyor:

> "Bu süreçte öğrencilerin günlük hayatta aşina oldukları durumlardan (**kefeli terazi, tahterevalli** gibi) ya da çeşitli araç ve teknolojilerden (**sanal manipülatifler** gibi) yararlanılır."

Yani "Denge Şehri" modülü bir yaratıcı yorum değil — **MEB'in kendi programının tarif ettiği etkinliğin dijital karşılığı.**

## Kapsam

TYMM 5. sınıf matematik: **7 tema, 23 öğrenme çıktısı, ~174 ders saati.** Tamamı hedefleniyor.

| Bölge | Tema | Kodlar | Faz |
|---|---|---|---|
| Denge Meydanı | İşlemlerle Cebirsel Düşünme | MAT.5.2.x | **F0** / F1 |
| Birim Kare Atölyesi | Geometrik Nicelikler | MAT.5.4.x | **F0** / F1 |
| Pergel Adası + Açı Kulesi | Geometrik Şekiller | MAT.5.3.x | F1 / F2 |
| Sayı Limanı + Kesir Krallığı | Sayılar ve Nicelikler | MAT.5.1.x | F2 |
| Veri Çarşısı | İstatistik + Olasılık | MAT.5.5.x, MAT.5.6.x | F1 / F2 |

## Mimari

Ürünün asıl teslim edilen parçası bir web sitesi değil, **başka bir eğitim platformuna gömülebilen bir öğrenme motoru.**

```
packages/
  curriculum/      TYMM verisi — 23 çıktı, ~100 süreç bileşeni (tek doğruluk kaynağı)
  engine-core/     ⭐ saf TypeScript: CRA aşama makinesi, destek azaltma, kanıt üretimi
                      React yok, DOM yok, ağ yok → taşınabilir ve test edilebilir
  content-schema/  Zod şemaları — pedagojik kırmızı çizgiler CI'da zorlanır
  manipulatives/   Terazi, birim kare ızgarası, pergel, açıölçer, sayı doğrusu
  ui-kit/          Erişilebilir tasarım sistemi (WCAG 2.2 AA hedefi)
  sdk/             Gömme SDK'sı — npm paketi / postMessage köprüsü / LTI 1.3
apps/
  web/             Next.js 15 — öğrenci uygulaması + öğretmen paneli
content/
  mat-5/           Görevler JSON olarak. Yeni görev eklemek kod yazmayı gerektirmez.
```

**Yığın:** TypeScript · Next.js 15 · React 19 · Tailwind 4 · PostgreSQL + Prisma · Vitest/Playwright · pnpm + Turborepo

Stack gerekçesi ve "neden Laravel değil" tartışması: [`agents-notes/05-teknik-mimari.md`](agents-notes/05-teknik-mimari.md)

## Kırmızı çizgiler

Bunlar ürün tercihi değil, pedagojik/etik sınır. Kod incelemesinde reddedilir:

- ❌ Genel lider tablosu ❌ Seri (streak) baskısı ❌ Geri sayım / süreli test
- ❌ Can/enerji sistemi ❌ Şans kutusu ❌ Öğrenme içeriğini kilitleyen premium
- ❌ Çocuğa gösterilen satın alma çağrısı ❌ Reklam ❌ Açık sohbet

Bunların bir kısmı **şema seviyesinde** zorlanıyor: `A3` aşamasındaki bir göreve `timeLimit` alanı tanımlanamaz, şema reddeder.

Gerekçeler: [`agents-notes/03-pedagojik-mimari.md`](agents-notes/03-pedagojik-mimari.md) §5

## Dokümantasyon

Depoyu yeni klonladıysan: [`CLAUDE.md`](CLAUDE.md) projeye giriş noktasıdır — okuma sırası,
değiştirilemez kurallar ve mimari sınırlar orada. Claude Code bu dosyayı otomatik okur.

Tüm analiz, karar ve gerekçeler `agents-notes/` altında:

| Dosya | İçerik |
|---|---|
| [`00-oturum-gunlugu.md`](agents-notes/00-oturum-gunlugu.md) | Kararlar, açık sorular, ilerleme kaydı |
| [`01-kaynak-analizi.md`](agents-notes/01-kaynak-analizi.md) | Araştırmanın hangi bulgusu neden alındı / alınmadı |
| [`02-mufredat-haritasi.md`](agents-notes/02-mufredat-haritasi.md) | 23 çıktı × modül eşlemesi, süreç bileşeni stratejisi |
| [`03-pedagojik-mimari.md`](agents-notes/03-pedagojik-mimari.md) | Çekirdek döngü, destek azaltma, yasaklı desenler |
| [`04-oyun-tasarimi.md`](agents-notes/04-oyun-tasarimi.md) | 12 modülün detaylı mekanikleri, meta-katman, tutundurma |
| [`05-teknik-mimari.md`](agents-notes/05-teknik-mimari.md) | Yığın kararı, ADR'ler, içerik şeması, entegrasyon |
| [`06-yol-haritasi.md`](agents-notes/06-yol-haritasi.md) | Faz 0 → Faz 3, sprintler, kabul kriterleri |
| [`07-ticari-kvkk-entegrasyon.md`](agents-notes/07-ticari-kvkk-entegrasyon.md) | KVKK, çocuk verisi, iş modeli, ürün etiği |
| [`kaynaklar/`](agents-notes/kaynaklar/) | Resmî TYMM çıktıları, kaynak listesi, tasarım öncülleri |

## Durum

Planlama tamamlandı. Sıradaki iş: **Faz 0 — staj demosu (2 modül, 3 hafta).**
Sprint detayı: [`agents-notes/06-yol-haritasi.md`](agents-notes/06-yol-haritasi.md)

---

<div align="center">
<sub>© 2026 — Tüm hakları saklıdır. Ayrıntı: <a href="NOTICE.md">NOTICE.md</a></sub>
</div>
