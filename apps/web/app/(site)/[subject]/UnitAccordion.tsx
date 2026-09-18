"use client";

import { useState } from "react";
import Link from "next/link";
import { useProgress } from "../../lib/ProgressProvider";

export interface AccordionTopic {
  outcomeCode: string;
  outcomeTitle: string;
  /** Oynanabilir konunun ürün adı ("Yankı Kapısı"); yoksa undefined. */
  topicTitle: string | undefined;
  componentCount: number;
  playable: boolean;
}

export interface AccordionUnit {
  code: string;
  index: number;
  title: string;
  icon: string;
  topics: AccordionTopic[];
  playableCount: number;
}

type Filter = "tum" | "devam" | "tamam";

/**
 * Stitch "5. Sınıf Matematik Ünite/Konu Listesi" ekranının akordiyonu, birebir:
 * filtre pill'leri, tamamlandı/şu-an-buradasın/kilitli üç durum, ünite gövdesinde
 * konu satırları ve konu sonu testi satırı.
 *
 * Fark: içeriği henüz hazırlanmamış üniteler Stitch'in KİLİT desenini kullanır
 * ("Sıradaki Ünite"), "Yakında" ibaresi hiçbir yerde geçmez (kullanıcı talebi).
 */
export function UnitAccordion({ units, subjectSlug }: { units: AccordionUnit[]; subjectSlug: string }) {
  const { state, hydrated } = useProgress();
  const [filter, setFilter] = useState<Filter>("tum");

  const completedOf = (u: AccordionUnit) =>
    hydrated ? u.topics.filter((t) => t.playable && state.completedOutcomes.includes(t.outcomeCode)).length : 0;

  const statusOf = (u: AccordionUnit): "tamam" | "aktif" | "kilit" => {
    if (u.playableCount === 0) return "kilit";
    return completedOf(u) === u.playableCount ? "tamam" : "aktif";
  };

  const firstActive = units.find((u) => statusOf(u) === "aktif")?.code ?? null;
  const [openUnit, setOpenUnit] = useState<string | null>(null);
  const isOpen = (code: string) => (openUnit === null ? code === firstActive : openUnit === code);

  const visible = units.filter((u) => {
    if (filter === "tum") return true;
    const s = statusOf(u);
    return filter === "devam" ? s === "aktif" : s === "tamam";
  });

  const counts = {
    tum: units.length,
    devam: units.filter((u) => statusOf(u) === "aktif").length,
    tamam: units.filter((u) => statusOf(u) === "tamam").length,
  };

  return (
    <div className="lg:col-span-8 flex flex-col gap-space-md">
      {/* Filtre & sıralama şeridi */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-space-xs bg-surface-container-lowest p-space-xs rounded-xl shadow-sm">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
          {([
            ["tum", `Tüm Üniteler (${counts.tum})`],
            ["devam", `Devam Edenler (${counts.devam})`],
            ["tamam", `Tamamlananlar (${counts.tamam})`],
          ] as const).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className={
                filter === key
                  ? "px-space-sm py-1.5 rounded-full bg-primary-container text-on-primary font-label-sm text-label-sm whitespace-nowrap shadow-sm"
                  : "px-space-sm py-1.5 rounded-full bg-surface-container text-on-surface-variant hover:text-on-surface font-label-sm text-label-sm whitespace-nowrap"
              }
            >
              {label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1 bg-surface-container-low px-3 py-1.5 rounded-full">
          <span className="material-symbols-outlined text-outline text-[18px]">tune</span>
          <span className="font-label-sm text-label-sm text-on-surface-variant">Sıralama: Müfredat Sırası</span>
        </div>
      </div>

      {visible.map((unit) => {
        const status = statusOf(unit);
        const done = completedOf(unit);
        const pct = unit.playableCount === 0 ? 0 : Math.round((done / unit.playableCount) * 100);
        const open = isOpen(unit.code);

        return (
          <div
            id={`unite-${unit.index}`}
            key={unit.code}
            className={
              status === "aktif"
                ? "bg-surface-container-lowest rounded-xl shadow-md overflow-hidden ring-2 ring-primary scroll-mt-24"
                : status === "kilit"
                  ? "bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden opacity-85 scroll-mt-24"
                  : "bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden transition-all scroll-mt-24"
            }
          >
            <button
              type="button"
              aria-expanded={open}
              onClick={() => setOpenUnit(open ? "" : unit.code)}
              className={
                status === "aktif"
                  ? "w-full text-left p-space-md flex items-center justify-between gap-space-sm bg-primary-fixed/20 hover:bg-primary-fixed/30 transition-colors"
                  : "w-full text-left p-space-md flex items-center justify-between gap-space-sm hover:bg-surface-container-low/50 transition-colors"
              }
            >
              <div className="flex items-center gap-space-sm min-w-0">
                <div
                  className={
                    status === "tamam"
                      ? "w-12 h-12 rounded-xl bg-tertiary-fixed flex items-center justify-center text-tertiary shrink-0 shadow-sm"
                      : status === "aktif"
                        ? "w-12 h-12 rounded-xl bg-primary-container flex items-center justify-center text-on-primary shrink-0 shadow-md"
                        : "w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-outline shrink-0"
                  }
                >
                  <span className={`material-symbols-outlined text-[28px] ${status === "tamam" ? "icon-filled" : ""}`}>
                    {status === "tamam" ? "check_circle" : status === "aktif" ? "play_circle" : "lock"}
                  </span>
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-space-xs flex-wrap">
                    {status === "tamam" && (
                      <span className="font-label-sm text-label-sm text-tertiary bg-tertiary-fixed/50 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">done_all</span> Tamamlandı (%100)
                      </span>
                    )}
                    {status === "aktif" && (
                      <>
                        <span className="font-label-sm text-label-sm bg-primary text-on-primary px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-tertiary-fixed animate-ping" /> Şu An Buradasın
                        </span>
                        <span className="font-label-sm text-label-sm text-primary font-semibold">%{pct} Tamamlandı</span>
                      </>
                    )}
                    {status === "kilit" && (
                      <span className="font-label-sm text-label-sm bg-surface-container-high text-on-surface-variant px-2 py-0.5 rounded-full">
                        Sıradaki Ünite
                      </span>
                    )}
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      • {unit.topics.length} kazanım
                      {unit.playableCount > 0 ? ` • ${unit.playableCount} interaktif konu` : ""}
                    </span>
                  </div>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface truncate mt-0.5">
                    Ünite {unit.index}: {unit.title}
                  </h2>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {status === "kilit" && (
                  <span className="font-label-sm text-label-sm text-outline hidden sm:inline-block">
                    Görevleri içerik masasında hazırlanıyor
                  </span>
                )}
                <span
                  className={`material-symbols-outlined text-[24px] ${status === "aktif" ? "text-primary" : "text-on-surface-variant"}`}
                >
                  {status === "kilit" ? "lock_clock" : open ? "expand_less" : "expand_more"}
                </span>
              </div>
            </button>

            {open && (
              <div className="p-space-md flex flex-col gap-space-sm bg-surface-container-lowest">
                {unit.playableCount === 0 ? (
                  <div className="p-space-sm rounded-lg bg-surface-container-low flex items-start gap-space-xs">
                    <span className="material-symbols-outlined text-outline">info</span>
                    <div className="font-body-sm text-body-sm text-on-surface-variant">
                      Bu ünitenin {unit.topics.length} kazanımı müfredatta tanımlı; interaktif görevleri henüz
                      yazılmadı. Kazanımlar:
                      <ul className="mt-2 space-y-1">
                        {unit.topics.map((t) => (
                          <li key={t.outcomeCode} className="flex items-start gap-2">
                            <span className="font-label-sm text-label-sm text-primary shrink-0 mt-0.5">
                              {t.outcomeCode}
                            </span>
                            <span className="text-on-surface">{t.outcomeTitle}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Her konu üç aşamalı ilerler: <strong>Keşfet</strong> (sayı yok, sadece materyal) →{" "}
                      <strong>Bağla</strong> (sayılar girer, yanlış yok, ipucu var) →{" "}
                      <strong>Gerçek Teste Hazırlık</strong>.
                    </p>
                    <div className="flex flex-col gap-space-xs mt-1">
                      {unit.topics.map((t, i) => {
                        const completed = hydrated && state.completedOutcomes.includes(t.outcomeCode);
                        if (!t.playable) {
                          return (
                            <div
                              key={t.outcomeCode}
                              className="flex items-center justify-between p-space-sm rounded-xl bg-surface-container-low/60 gap-space-xs"
                            >
                              <div className="flex items-start gap-space-xs min-w-0">
                                <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-outline mt-0.5 shrink-0">
                                  <span className="material-symbols-outlined text-[18px]">lock</span>
                                </div>
                                <div className="min-w-0">
                                  <span className="font-label-sm text-label-sm text-outline uppercase tracking-wide">
                                    Kazanım {i + 1} • {t.outcomeCode}
                                  </span>
                                  <h3 className="font-headline-sm text-headline-sm text-on-surface-variant text-[16px] leading-tight">
                                    {t.outcomeTitle}
                                  </h3>
                                </div>
                              </div>
                            </div>
                          );
                        }

                        return (
                          <div
                            key={t.outcomeCode}
                            className={
                              completed
                                ? "flex flex-col sm:flex-row sm:items-center justify-between p-space-sm rounded-xl bg-surface-container-low hover:bg-surface-container transition-all gap-space-xs"
                                : "flex flex-col sm:flex-row sm:items-center justify-between p-space-sm rounded-xl bg-primary-fixed/15 hover:bg-primary-fixed/25 transition-all gap-space-xs shadow-sm"
                            }
                          >
                            <div className="flex items-start gap-space-xs min-w-0">
                              <div
                                className={
                                  completed
                                    ? "w-8 h-8 rounded-full bg-tertiary-fixed flex items-center justify-center text-tertiary mt-0.5 shrink-0"
                                    : "w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-on-primary mt-0.5 shrink-0"
                                }
                              >
                                <span className="material-symbols-outlined text-[18px]">
                                  {completed ? "done" : "play_arrow"}
                                </span>
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-label-sm text-label-sm text-primary uppercase tracking-wide">
                                    Konu {i + 1} • {t.outcomeCode}
                                  </span>
                                  {completed ? (
                                    <span className="px-2 py-0.5 bg-tertiary-fixed/60 text-on-tertiary-fixed rounded-full font-label-sm text-label-sm">
                                      Tamamlandı
                                    </span>
                                  ) : (
                                    <span className="px-2 py-0.5 bg-secondary-fixed text-on-secondary-fixed rounded-full font-label-sm text-label-sm font-semibold">
                                      3 Aşama • {t.componentCount} süreç bileşeni
                                    </span>
                                  )}
                                </div>
                                <h3 className="font-headline-sm text-headline-sm text-on-surface text-[16px] leading-tight mt-0.5">
                                  {t.topicTitle}
                                </h3>
                                <span className="font-body-sm text-body-sm text-on-surface-variant">
                                  {t.outcomeTitle}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-space-xs self-end sm:self-auto shrink-0">
                              <Link
                                href={`/${subjectSlug}/${t.outcomeCode}`}
                                className={
                                  completed
                                    ? "px-space-sm py-2 rounded-full bg-surface-container-lowest text-on-surface font-label-md text-label-md hover:bg-surface-variant transition-colors shadow-sm flex items-center gap-1"
                                    : "px-space-md py-2 rounded-full bg-primary-container text-on-primary font-label-md text-label-md hover:bg-primary transition-all shadow-md flex items-center gap-1.5 active:translate-y-0.5"
                                }
                              >
                                <span className="material-symbols-outlined text-[18px] icon-filled">
                                  {completed ? "replay" : "play_arrow"}
                                </span>
                                {completed ? "Tekrar Oyna" : "Derse Başla"}
                              </Link>
                            </div>
                          </div>
                        );
                      })}

                      {/* Konu sonu testi satırı — Stitch'teki "Test 1 / Hemen Çöz" deseni */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-space-sm rounded-xl bg-secondary-fixed/25 hover:bg-secondary-fixed/40 transition-all gap-space-xs shadow-sm">
                        <div className="flex items-start gap-space-xs">
                          <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container mt-0.5 shrink-0">
                            <span className="material-symbols-outlined text-[18px]">bolt</span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wide">
                                Konu Sonu Testi
                              </span>
                              <span className="px-2 py-0.5 bg-surface-container-lowest text-on-secondary-container font-label-sm text-label-sm rounded-full">
                                +10 Puan / soru
                              </span>
                            </div>
                            <h3 className="font-headline-sm text-headline-sm text-on-surface text-[16px] leading-tight">
                              Gerçek Teste Hazırlık
                            </h3>
                            <span className="font-body-sm text-body-sm text-on-surface-variant">
                              En az 8 soru • Süre sınırı yok • İstediğin kadar düşün
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-space-xs self-end sm:self-auto shrink-0">
                          <Link
                            href={`/${subjectSlug}/${unit.topics.find((t) => t.playable)?.outcomeCode ?? ""}`}
                            className="px-space-md py-2 rounded-full bg-secondary-container text-on-secondary-container font-label-md text-label-md hover:bg-secondary-fixed transition-all shadow-md flex items-center gap-1.5 active:translate-y-0.5"
                          >
                            <span className="material-symbols-outlined text-[18px]">edit_note</span> Konudan Başla
                          </Link>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
