# Kaynaklar

## Birincil (resmî MEB)

Bu PDF'ler repoya **eklenmedi** (boyut: toplam ~230 MB). Yerel konumları:

| Belge | Boyut | Yerel yol |
|---|---|---|
| TYMM Ortaokul Matematik Dersi Öğretim Programı (5-8. Sınıf) | 3.3 MB, 212 s. | `~/Downloads/` |
| TYMM 5. Sınıf Matematik Öğrenme Çıktıları ve Süreç Bileşenleri | 13 MB, 133 s. | `~/Downloads/` |
| TYMM 5. Sınıf Matematik Ders Planı | 6.3 MB, 44 s. | `~/Downloads/` |
| MEB 5. Sınıf Matematik Ders Kitabı 1 (2026-2027) | 79 MB | `~/Downloads/` |
| MEB 5. Sınıf Matematik Ders Kitabı 2 (2026-2027) | 129 MB | `~/Downloads/` |

Kaynak: MEB / TTKB — `mufredat.meb.gov.tr`

**Çıkarılan içerik:** `tymm-5-matematik-ciktilari.md` (23 çıktı + süreç bileşenleri + doğrulayıcı alıntılar).
Bu dosya `packages/curriculum` paketinin girdisidir.

### Metin çıkarma komutu (tekrar üretilebilirlik)

```bash
pdftotext -enc UTF-8 "TYMM Ortaokul Matematik Dersi Öğretim Programı (5-8. Sınıf).pdf" program.txt
grep -oE "MAT\.5\.[0-9]+\.[0-9]+\." program.txt | sort -u -V   # 23 kod
```

---

## İkincil — araştırma raporu

| Belge | Sürüm | Not |
|---|---|---|
| `5. Sınıf Matematik Oyun Uygulaması Araştırma Raporu.pdf` | **v2** | 3 aşamalı CRA döngüsü, Denge Şehri örneği — **esas alınan** |
| `5. Sınıf Matematik Oyun Uygulaması Araştırma Raporu-1.pdf` | v1 | 5 aşamalı model, Kesir Krallığı örneği — kısmen alındı |

Karşılaştırma ve hangi bulgunun neden alındığı: `../01-kaynak-analizi.md`

---

## Raporun atıf verdiği akademik kaynaklar

> **Uyarı:** Bu atıflar rapor üzerinden aktarıldı, **birincil kaynaktan doğrulanmadı.** Tasarım kararlarında yön göstergesi olarak kullanıldılar. Ürün pazarlamasında sayısal etki büyüklüğü iddiası olarak kullanılmamalı — kullanılacaksa önce birincil kaynak okunmalı.

**Oyun tabanlı öğrenme / oyunlaştırma**
- Li, Hew & Du (2024) — Gamification Enhances Student Intrinsic Motivation (meta-analiz, 35 çalışma / ~2500 katılımcı)
- Ratinho & Martins (2023) — The role of gamified learning strategies in student's motivation, *Heliyon*
- Digital Game-Based Learning Effectiveness Meta-Analysis (K-12 Math, 2018-2025)
- Effects of game-based learning on students' mathematics achievement — Wiley meta-analizi
- Gamified scaffolding in formal education: A scoping review

**Bilişsel psikoloji / öğretim tasarımı**
- Kalyuga ve ark. (2003), Kalyuga (2007) — Expertise Reversal Effect
- ERIC — Mathematics Learning from Concrete to Abstract (1968-2021), sistematik inceleme
- ERIC — Using Concrete Manipulatives in Mathematical Instruction (CRA)
- IES/WWC Practice Guide — Visual Representations / CRA Instruction
- Witzel — CRA öğretim kılavuzu
- The effect of retrieval practice on multiplication fact fluency — Wiley
- Edutopia — Assessment: Lower Stakes, Raise Retention (Roediger'in düşük riskli değerlendirme ilkeleri)

**Gelişim ve kaygı**
- Simply Psychology — Concrete Operational Stage (Piaget)
- Piaget's Theory in Mathematics Education in Elementary School
- Jo Boaler (Stanford) — Timed Tests and the Development of Math Anxiety
- Ramirez, Gunderson, Levine & Beilock (2013) — Math Anxiety, Working Memory, and Math Achievement in Early Elementary School

**Ürün incelemeleri**
- Trophy — Prodigy Math Game's Gamification Strategy: A Case Study
- New Literacies — Prodigy Math Developmental Score
- Common Sense Media — Prodigy incelemesi
- ASU — DragonBox tasarım araştırması
- Khan Academy topluluk tartışması — "aşırı oyunlaştırmama" ilkesi

**TYMM ikincil analizler**
- çözümebak — Maarif Modeli Matematik Müfredatında Ne Değişti?
- Uludağ Üniversitesi — TYMM Ortaokul Matematik Dersi akademik incelemesi (5. sınıf 23 öğrenme çıktısı)
- İLKE Vakfı — TYMM İzleme Raporu (100 öğrenme çıktısı, 7 tema)

---

## Tasarım öncülleri (oyun tarafı)

`../04-oyun-tasarimi.md` içinde referans verilen ticari oyunlar. Bunlar ilham kaynağı olarak incelendi; kod veya varlık kopyalanmadı.

| Oyun | Ne için bakıldı |
|---|---|
| DragonBox Algebra 5+ | Denklemin manipülasyonla öğretilmesi — Denge Şehri'nin öncülü |
| Slice Fractions | Kesmenin fiziksel eylem olarak kesir olması — Kesir Krallığı |
| Euclidea | Pergel-cetvel inşa bulmacası türü — Pergel Adası |
| Mathigon Polypad | Sanal manipülatif kütüphanesi tasarımı |
| Human Resource Machine | Küçük makine kurma hissi — Algoritma Atölyesi |
| Baba Is You | Oyuncunun kurala hükmetmesi — "Çift El" mekaniği |
| Scratch | Blok tabanlı kural kurma |
| Stardew Valley / Animal Crossing | Onarım ve inşa döngüsü — Kâşif Karargâhı |
| Prodigy Math | **Ne yapmamak gerektiği** için: oyun kabuğu + premium baskısı |
