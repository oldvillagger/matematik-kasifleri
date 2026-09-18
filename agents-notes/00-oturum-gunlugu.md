# Oturum Günlüğü — 001

**Tarih:** 2026-09-18
**Ajan:** Claude Opus 5 (Claude Code)
**Proje:** Matematik Kâşifleri — TYMM 5. Sınıf Matematik Öğrenme Modülü
**Bağlam:** Staj yerine sunulacak ilk proje. Daha sonra kurumun mevcut eğitim yazılımına entegre edilecek. Ticari ürün.

---

## Bu oturumda ne yapıldı

1. **Kaynak analizi**
   - Perplexity/Claude araştırma sohbetinin iki rapor sürümü karşılaştırıldı (`Araştırma Raporu.pdf` = v2, `Araştırma Raporu-1.pdf` = v1).
   - Sohbet ekran görüntülerindeki mimari düzeltme tartışması analiz edildi (3 itiraz + düzeltilmiş mimari).
   - 4 resmî TYMM PDF'i metne çevrildi (`pdftotext`), 5. sınıf matematik bölümleri çıkarıldı.
   - **23 öğrenme çıktısının tamamı resmî programdan kod-kod doğrulandı** (MAT.5.1.1 → MAT.5.6.2).

2. **Kritik doğrulama bulgusu**
   Resmî TYMM programı, MAT.5.2.1 öğrenme çıktısının öğrenme-öğretme uygulamasında birebir şunu yazıyor:
   > "...öğrencilerin günlük hayatta aşina oldukları durumlardan (**kefeli terazi, tahterevalli** gibi) ya da çeşitli araç ve teknolojilerden (**sanal manipülatifler** gibi) yararlanılır."

   Yani araştırma raporunun "Denge Şehri" önerisi bizim icadımız değil — **MEB'in kendi programının tarif ettiği etkinliğin dijital karşılığı.** Staj sunumunda en güçlü argüman bu.

3. **Üretilen dokümanlar** (hepsi `agents-notes/` altında)
   | Dosya | İçerik |
   |---|---|
   | `01-kaynak-analizi.md` | İki rapor sürümünün farkı, mimari tartışmanın sonucu, hangi bulguyu neden aldık |
   | `02-mufredat-haritasi.md` | 23 öğrenme çıktısı × modül eşlemesi, ders saati ağırlıkları, dijital/fiziksel ayrımı |
   | `03-pedagojik-mimari.md` | Nihai çekirdek döngü (CRA v3), destek azaltma politikası, uyarlanabilir zorluk, yasaklı desenler |
   | `04-oyun-tasarimi.md` | 12 modülün detaylı oyun mekaniği + meta-katman + tutundurma tasarımı |
   | `05-teknik-mimari.md` | Stack kararı, ADR'ler, entegrasyon yüzeyi, içerik şeması |
   | `06-yol-haritasi.md` | Faz 0 (staj demosu) → Faz 3 (ticari sürüm) |
   | `07-ticari-kvkk-entegrasyon.md` | KVKK, çocuk verisi, iş modeli, entegrasyon senaryoları, IP uyarısı |

---

## Alınan kararlar

| # | Karar | Gerekçe |
|---|---|---|
| K1 | Ürün adı: **Matematik Kâşifleri** | Rapordaki "kâşif günlüğü" kavramıyla tutarlı; 10-11 yaş için "keşif" çerçevesi rekabet çerçevesinden daha güvenli |
| K2 | Çekirdek döngü **3 aşamalı CRA** (5 değil) | v2 raporu + sohbetteki düzeltme; 5 aşamalı model destek azaltmayı ayrı bir basamak sanıyordu, oysa o sürekli bir süreç |
| K3 | Fiziksel görev **paralel katman**, ayrı aşama değil | Sohbetteki 3. itiraz; TYMM zaten pergel/cetvel/açıölçer kullanımını çıktının içine gömmüş |
| K4 | Oyunlaştırma **azınlık katman** | Li, Hew & Du 2024: salt oyunlaştırmanın içsel motivasyona etkisi g≈0,26; DGBL'in başarıya etkisi g≈0,84-0,92 |
| K5 | Stack: **TypeScript monorepo — çerçeveden bağımsız motor + Next.js kabuk** | Ürünün değeri motorda; motor npm paketi olarak staj yerinin platformuna gömülebilir, Laravel uygulaması gömülemez. Detay: `05-teknik-mimari.md` |
| K6 | Demo kapsamı: **2 modül** (Denge Şehri + Birim Kare Atölyesi) | Biri cebir (DGBL etkisi en yüksek, g=1,60), biri geometrik nicelik (etkinin düşük olduğu alanda hibrit tasarımı kanıtlar) |
| K7 | Lider tablosu, seri (streak), süre sınırı **yok** | Ratinho & Martins 2023 + Boaler/Beilock; bunlar ürün kararı değil, pedagojik kırmızı çizgi |

---

## Açık sorular (staj yerine sorulacak)

> Bunlar cevaplanmadan Faz 1'e geçilmemeli. Faz 0 demosu bunlardan bağımsız ilerleyebilir.

1. **Mevcut eğitim yazılımının stack'i ne?** (Laravel mı? .NET mi? Hangi auth?) — Entegrasyon yüzeyini bu belirler. `07` dosyasında üç senaryo da hazır.
2. **Kullanıcı kim?** Okul/sınıf lisansı (B2B) mı, veli aboneliği (B2C) mi? Bu, auth modelini ve KVKK açık rıza akışını değiştirir.
3. **Hedef cihaz?** Okul tableti / Chromebook / veli telefonu? Performans bütçesi buna göre kilitlenecek.
4. **İçerik üretimini kim yapacak?** Öğretmen/editör paneli gerekiyor mu, yoksa içerik geliştirici tarafından mı yazılacak?
5. **Repo gerçekten public olacak mı?** Ticari ürün + public repo kombinasyonu IP riski taşıyor — `07-ticari-kvkk-entegrasyon.md` §5'te not düşüldü. Kullanıcı talebi üzerine public açıldı.

---

## Sonraki adım

`06-yol-haritasi.md` → Faz 0, Sprint 0.1: monorepo iskeleti + `content-schema` + Denge Şehri Aşama 1.
