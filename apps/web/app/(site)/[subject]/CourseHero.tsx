"use client";

import { useProgress } from "../../lib/ProgressProvider";

/** Stitch ünite sayfasının hero banner'ı: modül başlığı + SVG halka ilerleme + 4'lü istatistik şeridi. */
export function CourseHero({
  subjectTitle,
  courseTitle,
  unitCount,
  outcomeCount,
  componentCount,
  playableCodes,
}: {
  subjectTitle: string;
  courseTitle: string;
  unitCount: number;
  outcomeCount: number;
  componentCount: number;
  playableCodes: string[];
}) {
  const { state, hydrated } = useProgress();

  const done = hydrated ? playableCodes.filter((c) => state.completedOutcomes.includes(c)).length : 0;
  const pct = playableCodes.length === 0 ? 0 : Math.round((done / playableCodes.length) * 100);
  const proven = hydrated ? state.provenComponents.length : 0;

  const circumference = 2 * Math.PI * 26;
  const dashOffset = circumference * (1 - pct / 100);

  return (
    <div className="relative overflow-hidden rounded-xl bg-surface-container-lowest shadow-md p-space-md lg:p-space-lg mt-space-xs">
      <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-primary-fixed/30 blur-3xl pointer-events-none" />
      <div className="absolute -left-12 -bottom-12 w-64 h-64 rounded-full bg-secondary-fixed/40 blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-space-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-space-md max-w-3xl">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-lg shadow-primary/20 shrink-0">
            <span className="material-symbols-outlined text-[36px] sm:text-[44px]">calculate</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-space-xs flex-wrap">
              <span className="px-space-xs py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm uppercase tracking-wider">
                5. Sınıf Temel Modül
              </span>
              <span className="inline-flex items-center text-tertiary font-label-sm text-label-sm gap-1">
                <span className="w-2 h-2 rounded-full bg-tertiary-container animate-pulse" />
                Aktif Seviye
              </span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface mt-1">{courseTitle} {subjectTitle} Modülü</h1>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
              Sayılar, işlemler, geometri ve veri dünyasını interaktif görevlerle adım adım keşfet.
            </p>
          </div>
        </div>

        <div className="w-full lg:w-auto flex items-center gap-space-md bg-surface-container-low p-space-sm sm:px-space-md sm:py-space-sm rounded-xl">
          <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
            <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
              <circle className="text-surface-container-high fill-none" cx="32" cy="32" r="26" stroke="currentColor" strokeWidth="6" />
              <circle
                className="text-primary fill-none transition-all duration-700"
                cx="32"
                cy="32"
                r="26"
                stroke="currentColor"
                strokeDasharray={circumference.toFixed(2)}
                strokeDashoffset={dashOffset.toFixed(2)}
                strokeLinecap="round"
                strokeWidth="6"
              />
            </svg>
            <span className="absolute font-headline-sm text-headline-sm text-on-surface tabular-nums">%{pct}</span>
          </div>
          <div className="flex flex-col">
            <span className="font-label-md text-label-md text-on-surface">Genel İlerleme</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              {playableCodes.length} konunun {done}'i tamamlandı
            </span>
            <div className="flex items-center gap-2 mt-1 font-label-sm text-label-sm text-tertiary">
              <span className="material-symbols-outlined text-[16px]">trending_up</span>
              <span>{proven} süreç bileşeni kanıtlandı</span>
            </div>
          </div>
        </div>
      </div>

      {/* İstatistik şeridi */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-xs mt-space-md pt-space-md bg-surface-container-lowest">
        <Stat icon="auto_stories" wrap="bg-primary-fixed" color="text-primary" value={unitCount} label="Toplam Ünite" />
        <Stat icon="play_lesson" wrap="bg-secondary-fixed" color="text-secondary" value={outcomeCount} label="Kazanım" />
        <Stat icon="quiz" wrap="bg-tertiary-fixed" color="text-tertiary" value={playableCodes.length} label="İnteraktif Konu" />
        <Stat icon="task_alt" wrap="bg-surface-container-high" color="text-on-surface" value={componentCount} label="Süreç Bileşeni" />
      </div>
    </div>
  );
}

function Stat({
  icon,
  wrap,
  color,
  value,
  label,
}: {
  icon: string;
  wrap: string;
  color: string;
  value: number;
  label: string;
}) {
  return (
    <div className="flex items-center gap-space-xs p-space-xs rounded-lg bg-surface-container-low">
      <div className={`w-10 h-10 rounded-lg ${wrap} flex items-center justify-center ${color}`}>
        <span className="material-symbols-outlined text-[22px]">{icon}</span>
      </div>
      <div>
        <span className="font-headline-sm text-headline-sm text-on-surface tabular-nums">{value}</span>
        <p className="font-label-sm text-label-sm text-on-surface-variant">{label}</p>
      </div>
    </div>
  );
}
