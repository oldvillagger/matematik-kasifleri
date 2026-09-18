"use client";

import { dailyGoalProgress, displayedStreak } from "@matematik-kasifleri/progression";
import { useProgress } from "../lib/ProgressProvider";

/** Stitch ana sayfa hero'su — gradient banner + "Günlük Hedefin" kartı, birebir. */
export function HomeHero() {
  const { state, settings, today, hydrated } = useProgress();
  const goal = dailyGoalProgress(state, today);
  const pct = goal.target === 0 ? 0 : Math.min(100, Math.round((goal.completed / goal.target) * 100));
  const remaining = Math.max(0, goal.target - goal.completed);
  const streak = displayedStreak(state.streak, today);

  return (
    <div className="w-full relative overflow-hidden rounded-xl bg-gradient-to-r from-primary via-primary-container to-secondary p-space-lg text-on-primary shadow-xl mt-space-xs mb-space-lg">
      <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-surface-container-lowest/10 blur-2xl pointer-events-none" />
      <div className="absolute right-1/4 -top-8 w-40 h-40 rounded-full bg-secondary-fixed/20 blur-xl pointer-events-none" />
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md">
        <div className="space-y-space-xs max-w-2xl">
          <div className="inline-flex items-center gap-space-xs bg-surface-container-lowest/20 backdrop-blur-md px-space-sm py-1 rounded-full text-on-primary font-label-sm text-label-sm">
            <span className="material-symbols-outlined text-[16px]">stars</span>
            5. Sınıf Seviyesi • TYMM Müfredatı
          </div>
          <h1 className="font-display-lg text-display-lg-mobile lg:text-display-lg tracking-tight">
            Hoş geldin Kâşif! 🌟
          </h1>
          <p className="font-body-lg text-body-lg text-inverse-on-surface opacity-95">
            Bugün neyi keşfedelim? Önce elinle dene, sonra sayılarla bağla, en son gerçek teste hazırlan.
          </p>
        </div>

        <div className="w-full md:w-80 bg-surface-container-lowest/15 backdrop-blur-xl p-space-md rounded-xl shadow-md">
          <div className="flex items-center justify-between font-label-md text-label-md mb-2">
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px]">verified</span> Günlük Hedefin
            </span>
            <span className="font-label-lg text-label-lg tabular-nums">
              {hydrated ? goal.completed : 0} / {goal.target} Konu
            </span>
          </div>
          <div className="w-full h-3.5 bg-surface-container-lowest/30 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-tertiary-fixed rounded-full shadow-[0_0_12px_rgba(111,251,190,0.8)] transition-all duration-500"
              style={{ width: `${hydrated ? pct : 0}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-2 font-label-sm text-label-sm text-inverse-on-surface opacity-90">
            <span>%{hydrated ? pct : 0} Tamamlandı</span>
            <span>
              {remaining === 0 ? "Hedefi tamamladın! 🎉" : `Hedefe ${remaining} Konu Kaldı`}
              {settings.streakEnabled && streak > 0 ? ` • 🔥 ${streak} gün` : ""}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
