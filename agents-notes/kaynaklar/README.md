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

> **2026-09-18 güncellemesi:** Bu makinede `pdftotext`/poppler yok. Aynı işi Node.js
> `pdf-parse` paketiyle yaptık (`~/Downloads/`'daki PDF'ler bu makinede de mevcut çıktı —
> orijinal yerel yol notu hâlâ geçerli). MAT.5.4.1–5.4.4 süreç bileşenleri bu şekilde
> `TYMM 5. Sınıf Matematik Öğrenme Çıktıları ve Süreç Bileşenleri.pdf`'ten çıkarılıp
> `tymm-5-matematik-ciktilari.md`'ye işlendi.
>
> **Önemli bulgu:** Bu PDF **tek başına matematik değil** — Türkçe (5), Matematik (5), Fen
> Bilimleri (5), Sosyal Bilgiler (5), Din Kültürü ve Ahlak Bilgisi (5) ve lise (9. sınıf)
> Matematik/Fizik/Kimya/Biyoloji/Tarih/Coğrafya derslerinin **tamamının** öğrenme çıktıları ve
> süreç bileşenlerini içeren birleşik bir TYMM paketi. **Bu, `08-genisletilmis-platform-mimarisi.md`
> §2'deki çok-derslik karar (K10) için doğrudan veri kaynağı** — yeni ders eklerken sıfırdan
> araştırma gerekmeyecek, aynı PDF'ten çıkarılabilir.
>
> **Not:** Bu belgedeki matematik bölümü MAT.5.1, 5.3, 5.4 temalarını içeriyor; MAT.5.2, 5.5, 5.6
> bu belgede yok (muhtemelen bir seçilmiş-örnekler paketi, tam 133 sayfalık resmî belgenin
> kendisi değil). **Bu boşluk kapatıldı** — bkz. aşağıdaki resmî portal kaynağı.

### Resmî MEB TYMM portalı — `tymm.meb.gov.tr` (2026-09-18 eklendi)

Kullanıcının verdiği kaynak: `https://tymm.meb.gov.tr/ogretim-programlari/ortaokul-matematik-dersi/6`.
Bu, ortaokul matematik 5. sınıfın 6 temasının **tek doğruluk kaynağı web arayüzü** — her tema
kendi alt sayfasında öğrenme çıktısı + süreç bileşenlerini tam metin olarak veriyor. Yukarıdaki
PDF'lerle çapraz doğrulandı, birebir örtüşüyor.

| Tema | URL |
|---|---|
| 1. Sayılar ve Nicelikler (1) | `tymm.meb.gov.tr/ortaokul-matematik-dersi/unite/447` |
| 1. Sayılar ve Nicelikler (2) | `tymm.meb.gov.tr/ortaokul-matematik-dersi/unite/449` |
| 2. İşlemlerle Cebirsel Düşünme | `tymm.meb.gov.tr/ortaokul-matematik-dersi/unite/450` |
| 3. Geometrik Şekiller | `tymm.meb.gov.tr/ortaokul-matematik-dersi/unite/448` |
| 4. Geometrik Nicelikler | `tymm.meb.gov.tr/ortaokul-matematik-dersi/unite/451` |
| 5. İstatistiksel Araştırma Süreci | `tymm.meb.gov.tr/ortaokul-matematik-dersi/unite/452` |
| 6. Veriden Olasılığa | `tymm.meb.gov.tr/ortaokul-matematik-dersi/unite/455` |

Bu portal aynı domain deseniyle **her ders/sınıf için** var (`tymm.meb.gov.tr/ogretim-programlari/<ders-slug>`).
Bu, `08-genisletilmis-platform-mimarisi.md` §2'deki çok-derslik kararının (K10) **en güvenilir
veri kaynağı** — yeni bir ders eklenirken PDF çıkarma yerine doğrudan bu portaldan taranabilir.

**Sonuç (2026-09-18):** 23 öğrenme çıktısının **tamamı** artık tam süreç bileşenleriyle
kaynaklı (`tymm-5-matematik-ciktilari.md` ve `packages/curriculum/src/outcomes.ts`). Önceki
eksik: MAT.5.1.1, MAT.5.1.3-a, MAT.5.3.1–7 (7 çıktı), MAT.5.5.1–2, MAT.5.6.1, MAT.5.6.2-b.
Hepsi bu portaldan kapatıldı.

### Ders kitapları (2026-09-18 eklendi, proje köküne — gitignore korumalı)

Kullanıcı resmî 2026-2027 TYMM 5. sınıf matematik ders kitaplarını proje köküne bıraktı:
`TYMM 5. Sınıf Matematik Ders Kitabı 1.pdf` (171 s.) ve `...Kitabı 2.pdf` (189 s.). `.gitignore`
`*.pdf` kuralı bunları zaten kapsıyor, repoya karışmazlar.

**İçindekiler (kitabın kendi sıralaması, resmî tema numarasıyla aynı değil):**
- Kitap 1: 1.Tema Geometrik Şekiller → 2.Tema Sayılar ve Nicelikler(1)/Doğal Sayılar → 3.Tema
  Geometrik Nicelikler
- Kitap 2: 4.Tema Sayılar ve Nicelikler(2)/Kesirler → 5.Tema İstatistiksel Araştırma Süreci →
  2.Tema (devamı) Eşitliğin Korunumu/İşlem Önceliği/Örüntüler → (6.Tema Olasılık, kitabın
  devamında)

**Kullanım amacı:** İçerik yazarken (S0.2+) gerçek örnek problem, terminoloji ve MEB'in konuyu
sunuş sırası için referans. `agents-notes/kaynaklar/tymm-5-matematik-ciktilari.md`'nin yerini
almaz — o hâlâ tek doğruluk kaynağı (öğrenme çıktısı/süreç bileşeni kodları için). Kitap sadece
örnek/dil kaynağı.

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
