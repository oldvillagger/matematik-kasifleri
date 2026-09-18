"use client";

import { useState } from "react";
import Link from "next/link";
import type { Stage } from "@matematik-kasifleri/engine-core";

export interface SyllabusStep {
  label: string;
  meta: string;
  state: "done" | "active" | "todo";
}

/**
 * Stitch "Etkileşimli Test ve Soru Çözüm Ekranı"nın birebir kabuğu:
 * sol 3 kolon soru matrisi + çizim araçları + kaydet, orta 6 kolon soru
 * paneli, sağ 3 kolon "Ders İçeriği".
 *
 * Tek bilinçli fark: Stitch'in 14:25 geri sayım sayacı KONMADI — CLAUDE.md
 * "A3 ve ASSESSMENT aşamalarında süre sınırı olamaz" kırmızı çizgisi
 * (kullanıcı kararı, oturum 003). Yerine sayaçsız "n / m Soru" göstergesi var.
 * Ayrıca şıklar uydurulmadı: cevap widget'ı görevin kendi tipinden gelir.
 */
export function TestScreen({
  stage,
  title,
  outcomeCode,
  backHref,
  total,
  index,
  answered,
  pointsPerItem,
  syllabus,
  onSelect,
  onFinish,
  children,
}: {
  stage: Stage;
  title: string;
  outcomeCode: string;
  backHref: string;
  total: number;
  index: number;
  answered: Record<number, boolean>;
  pointsPerItem: number;
  syllabus: SyllabusStep[];
  onSelect: (i: number) => void;
  onFinish: () => void;
  children: React.ReactNode;
}) {
  const [showSyllabus, setShowSyllabus] = useState(false);
  const [board, setBoard] = useState(false);
  const answeredCount = Object.values(answered).filter(Boolean).length;
  const stageLabel = stage === "ASSESSMENT" ? "Konu Sonu Testi" : "Alıştırma Turu";
  const done = syllabus.filter((s) => s.state === "done").length;
  const pct = Math.round((done / syllabus.length) * 100);

  return (
    <main className="w-full pt-20 px-gutter bg-background">
      {/* Üst bilgi & navigasyon çubuğu */}
      <div className="w-full bg-surface-container-lowest rounded-2xl shadow-sm p-space-sm mb-space-md mt-space-sm flex flex-wrap items-center justify-between gap-space-sm">
        <div className="flex items-center gap-space-sm min-w-0">
          <Link
            href={backHref}
            className="flex items-center gap-1.5 px-space-sm py-2 rounded-full bg-surface-container text-on-surface-variant hover:text-primary transition-all font-label-md text-label-md"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span>Geri</span>
          </Link>
          <div className="h-5 w-0.5 bg-outline-variant hidden sm:block" />
          <nav className="flex items-center gap-1.5 text-body-sm font-body-sm overflow-x-auto whitespace-nowrap no-scrollbar">
            <span className="font-headline-sm text-headline-sm text-primary">{title}</span>
            <span className="text-outline">›</span>
            <span className="text-on-surface-variant">{outcomeCode}</span>
            <span className="text-outline">›</span>
            <span className="px-space-xs py-0.5 rounded bg-primary-fixed text-primary font-label-sm text-label-sm">
              {stageLabel}
            </span>
          </nav>
        </div>
        <div className="flex items-center gap-space-sm">
          <div className="flex items-center gap-2 bg-tertiary-fixed/50 text-on-tertiary-fixed px-3 py-1.5 rounded-full font-label-md text-label-md">
            <span className="material-symbols-outlined text-[18px]">timer_off</span>
            <span>Süre sınırı yok</span>
          </div>
          <button
            type="button"
            onClick={() => setShowSyllabus((v) => !v)}
            className="lg:hidden flex items-center justify-center w-9 h-9 rounded-full bg-surface-container text-primary"
            aria-label="Ders içeriğini aç"
          >
            <span className="material-symbols-outlined text-[20px]">menu_book</span>
          </button>
        </div>
      </div>

      {/* 3 sütunlu ana gövde */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-space-md items-start pb-space-xl">
        {/* SOL: soru matrisi + araçlar + kaydet */}
        <div className="lg:col-span-3 flex flex-col gap-space-md order-2 lg:order-1">
          <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm">
            <div className="flex items-center justify-between mb-space-sm">
              <span className="font-headline-sm text-headline-sm text-on-surface">Sorular</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant tabular-nums">
                {index + 1} / {total} Soru
              </span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: total }).map((_, i) => {
                const isActive = i === index;
                const isAnswered = answered[i] === true;
                const cls = isActive
                  ? "bg-primary text-on-primary shadow-md shadow-primary/20"
                  : isAnswered
                    ? "bg-tertiary-fixed text-on-tertiary-fixed"
                    : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high";
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => onSelect(i)}
                    aria-current={isActive ? "true" : undefined}
                    className={`matrix-btn w-10 h-10 rounded-xl font-label-md text-label-md flex items-center justify-center transition-colors relative ${cls}`}
                  >
                    {i + 1}
                    {isAnswered && !isActive && (
                      <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-tertiary" />
                    )}
                  </button>
                );
              })}
            </div>
            <div className="mt-space-sm pt-space-xs flex items-center justify-around text-label-sm font-label-sm text-on-surface-variant">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-primary" />
                <span>Aktif</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-tertiary-fixed" />
                <span>Dolu</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-surface-container" />
                <span>Boş</span>
              </div>
            </div>
          </div>

          {/* Karalama tahtası */}
          <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm">
            <div className="flex items-center justify-between mb-space-sm">
              <div className="flex items-center gap-1.5 text-on-surface">
                <span className="material-symbols-outlined text-primary text-[20px]">draw</span>
                <span className="font-headline-sm text-headline-sm">Karalama Tahtası</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input className="sr-only peer" type="checkbox" checked={board} onChange={(e) => setBoard(e.target.checked)} />
                <div className="w-9 h-5 bg-surface-container-high rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface-container-lowest after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary" />
              </label>
            </div>
            {board ? (
              <Scratchpad />
            ) : (
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                İşlemini yazmak istersen tahtayı aç. Yazdıkların kimseye gitmez, sadece senin için.
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onFinish}
            className="w-full py-3.5 px-4 rounded-full bg-primary-container hover:bg-primary text-on-primary font-headline-sm text-headline-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 btn-tactile"
          >
            <span className="material-symbols-outlined text-[20px]">assignment_turned_in</span>
            <span>{stage === "ASSESSMENT" ? "Testi Kaydet & Bitir" : "Turu Bitir"}</span>
          </button>
          {answeredCount < total && (
            <p className="font-label-sm text-label-sm text-on-surface-variant text-center">
              {total - answeredCount} soru boş. İstersen boş bırakabilirsin.
            </p>
          )}
        </div>

        {/* ORTA: soru paneli */}
        <div className="lg:col-span-6 flex flex-col gap-space-md order-1 lg:order-2">
          <div className="bg-surface-container-lowest rounded-3xl p-space-md lg:p-space-lg shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-space-md pb-space-sm">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-headline-sm text-headline-sm">
                  {index + 1}
                </div>
                <div>
                  <span className="font-headline-sm text-headline-sm text-on-surface block leading-tight">
                    Soru {index + 1}
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">{title}</span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">bolt</span>+{pointsPerItem} Puan
              </span>
            </div>

            <div className="flex flex-col items-center gap-space-md">{children}</div>

            {/* Soru altı gezinme */}
            <div className="flex flex-wrap items-center justify-between gap-space-sm pt-space-md mt-space-md">
              <button
                type="button"
                disabled={index === 0}
                onClick={() => onSelect(index - 1)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-all disabled:opacity-40"
              >
                <span className="material-symbols-outlined text-[18px]">navigate_before</span>
                <span>Önceki Soru</span>
              </button>
              <button
                type="button"
                disabled={index + 1 >= total}
                onClick={() => onSelect(index + 1)}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-primary text-on-primary font-headline-sm text-headline-sm shadow-md shadow-primary/25 hover:bg-primary-container transition-all disabled:opacity-40"
              >
                <span>Sonraki Soru</span>
                <span className="material-symbols-outlined text-[18px]">navigate_next</span>
              </button>
            </div>
          </div>
        </div>

        {/* SAĞ: Ders İçeriği */}
        <div
          className={`lg:col-span-3 flex-col gap-space-md order-3 bg-surface-container-lowest rounded-2xl p-space-md shadow-sm ${
            showSyllabus ? "flex" : "hidden lg:flex"
          }`}
        >
          <div className="flex items-center justify-between pb-space-xs">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[22px]">auto_stories</span>
              <span className="font-headline-sm text-headline-sm text-on-surface">Ders İçeriği</span>
            </div>
            <button
              type="button"
              onClick={() => setShowSyllabus(false)}
              className="lg:hidden w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant"
              aria-label="Kapat"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          <div className="bg-surface-container-low p-space-sm rounded-xl">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-label-md text-label-md text-on-surface">{title}</span>
              <span className="font-label-sm text-label-sm text-primary font-bold tabular-nums">%{pct}</span>
            </div>
            <div className="w-full h-2 rounded-full bg-surface-container-high overflow-hidden">
              <div className="h-full bg-tertiary rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
            </div>
            <div className="mt-2 text-label-sm font-label-sm text-on-surface-variant flex items-center justify-between">
              <span>{outcomeCode}</span>
              <span>
                {done}/{syllabus.length} Aşama
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {syllabus.map((step) => (
              <div
                key={step.label}
                className={`p-2.5 rounded-xl flex items-center justify-between ${
                  step.state === "active" ? "bg-primary-fixed/40" : "bg-surface-container-low"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={`material-symbols-outlined text-[20px] ${
                      step.state === "done"
                        ? "text-tertiary icon-filled"
                        : step.state === "active"
                          ? "text-primary"
                          : "text-outline"
                    }`}
                  >
                    {step.state === "done" ? "check_circle" : step.state === "active" ? "timelapse" : "radio_button_unchecked"}
                  </span>
                  <div className="truncate">
                    <span
                      className={`font-label-md text-label-md block truncate ${
                        step.state === "active" ? "text-primary font-bold" : "text-on-surface"
                      }`}
                    >
                      {step.label}
                    </span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">{step.meta}</span>
                  </div>
                </div>
                {step.state === "active" && <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />}
              </div>
            ))}
          </div>

          <div className="mt-space-xs p-3 rounded-xl bg-tertiary-fixed/30 flex items-center gap-2">
            <span className="text-xl">🏆</span>
            <span className="font-label-sm text-label-sm text-on-tertiary-fixed">
              Bu konuyu bitirince hangi süreç becerilerini <strong>kanıtladığını</strong> göreceksin.
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}

/** Basit karalama tahtası — veri kaydedilmez, sadece ekranda kalır. */
function Scratchpad() {
  const [marks, setMarks] = useState<string[]>([]);
  const [current, setCurrent] = useState("");

  return (
    <div className="flex flex-col gap-2">
      <textarea
        value={current}
        onChange={(e) => setCurrent(e.target.value)}
        rows={4}
        placeholder="İşlemini buraya yazabilirsin…"
        className="w-full p-space-sm rounded-xl bg-surface-container-low font-mono text-body-sm outline-none focus:ring-[3px] focus:ring-primary/20 resize-none"
      />
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => {
            if (current.trim()) setMarks((m) => [current.trim(), ...m].slice(0, 4));
            setCurrent("");
          }}
          className="px-3 py-1.5 rounded-full bg-primary-fixed text-primary font-label-sm text-label-sm"
        >
          Kenara Not Al
        </button>
        <button
          type="button"
          onClick={() => {
            setMarks([]);
            setCurrent("");
          }}
          className="px-3 py-1.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm"
        >
          Temizle
        </button>
      </div>
      {marks.map((m, i) => (
        <p key={i} className="font-body-sm text-body-sm text-on-surface-variant whitespace-pre-wrap px-2">
          {m}
        </p>
      ))}
    </div>
  );
}
