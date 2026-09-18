"use client";

import Link from "next/link";
import { BADGES, accuracyPercent, displayedStreak } from "@matematik-kasifleri/progression";
import { useProgress } from "../lib/ProgressProvider";
import type { Topic } from "../lib/topics";

/**
 * Stitch'in "Hızlı Erişim & Günlük Görevler" üçlüsü. Ortadaki kart Stitch'te
 * "Haftalık Liderlik Tablosu"ydu — kullanıcı liderliği erteledi (K14), yerine
 * ürünün asıl farkı olan "Kanıt Panom" (hangi süreç bileşeni kanıtlandı)
 * kondu. Diğer iki kartın yapısı birebir.
 */
export function QuickAccess({ topics, totalComponents }: { topics: readonly Topic[]; totalComponents: number }) {
  const { state, settings, today, hydrated } = useProgress();

  const nextTopic = topics.find((t) => !state.completedOutcomes.includes(t.outcomeCode)) ?? topics[0];
  const openMistakes = state.mistakes.filter((m) => !m.resolved);
  const accuracy = accuracyPercent(state);
  const streak = displayedStreak(state.streak, today);
  const proven = hydrated ? state.provenComponents.length : 0;
  const provenPct = totalComponents === 0 ? 0 : Math.round((proven / totalComponents) * 100);
  const earned = hydrated ? state.badges : [];

  return (
    <div className="w-full mb-space-xl">
      <div className="flex items-center justify-between mb-space-md">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Hızlı Erişim &amp; Günlük Görevler</h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Kaldığın yer, kanıtladığın beceriler ve düzeltmen gereken sorular
          </p>
        </div>
        <Link
          href="/matematik/analiz"
          className="hidden sm:inline-flex items-center gap-1 text-primary font-label-md text-label-md cursor-pointer hover:underline"
        >
          Tüm Raporu İncele <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-md">
        {/* 1 — Kaldığın yer */}
        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-md flex flex-col justify-between transition-all hover:shadow-lg">
          <div>
            <div className="flex items-center justify-between mb-space-sm">
              <div className="w-12 h-12 rounded-xl bg-primary-fixed text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-[26px]">play_lesson</span>
              </div>
              <span className="bg-primary-fixed text-on-primary-fixed px-2.5 py-1 rounded-full font-label-sm text-label-sm">
                {hydrated ? state.completedOutcomes.length : 0} / {topics.length} Konu Bitti
              </span>
            </div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-1">Kaldığın Yer</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
              {nextTopic
                ? `Sıradaki keşfin: ${nextTopic.title}. Önce materyalle oyna, sayılar sonra gelir.`
                : "Açık olan tüm konuları bitirdin — harika iş!"}
            </p>
            <div className="space-y-2">
              {topics.map((t) => {
                const done = hydrated && state.completedOutcomes.includes(t.outcomeCode);
                return (
                  <div key={t.outcomeCode} className="p-2.5 bg-surface-container-low rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${done ? "bg-tertiary" : "bg-outline-variant"}`} />
                      <span className="font-label-sm text-label-sm text-on-surface">{t.title}</span>
                    </div>
                    <span className="font-label-sm text-label-sm text-outline">{done ? "Tamamlandı" : "Bekliyor"}</span>
                  </div>
                );
              })}
            </div>
          </div>
          {nextTopic && (
            <Link
              href={`/matematik/${nextTopic.outcomeCode}`}
              className="mt-space-md w-full py-2.5 bg-primary text-on-primary font-label-md text-label-md rounded-full transition-all text-center hover:bg-primary-container"
            >
              Derse Devam Et
            </Link>
          )}
        </div>

        {/* 2 — Kanıt Panom (Stitch'te liderlik tablosuydu) */}
        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-md flex flex-col justify-between transition-all hover:shadow-lg">
          <div>
            <div className="flex items-center justify-between mb-space-sm">
              <div className="w-12 h-12 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center">
                <span className="material-symbols-outlined text-[26px]">workspace_premium</span>
              </div>
              <span className="bg-secondary-container text-on-secondary-container px-2.5 py-1 rounded-full font-label-sm text-label-sm">
                {earned.length} Rozet 🏅
              </span>
            </div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-1">Kanıt Panom</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
              Puan değil, <strong>kanıt</strong> topluyorsun: her doğru görev bir süreç becerisini kanıtlıyor.
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low">
                <span className="font-label-sm text-label-sm text-on-surface">Kanıtlanan beceri</span>
                <span className="font-label-sm text-label-sm text-primary tabular-nums">
                  {proven} / {totalComponents}
                </span>
              </div>
              <div className="w-full h-2.5 bg-surface-container-high rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all duration-700" style={{ width: `${provenPct}%` }} />
              </div>
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                {earned.length === 0 ? (
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    İlk konunu bitirince ilk rozetin açılacak.
                  </span>
                ) : (
                  earned.map((id) => (
                    <span
                      key={id}
                      title={BADGES[id].description}
                      className="px-2 py-1 bg-surface-container-low rounded-lg font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1"
                    >
                      <span>{BADGES[id].emoji}</span> {BADGES[id].title}
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>
          <Link
            href="/matematik/analiz"
            className="mt-space-md w-full py-2.5 bg-surface-container-high hover:bg-surface-container text-on-surface font-label-md text-label-md rounded-full transition-all text-center"
          >
            Karneme Git
          </Link>
        </div>

        {/* 3 — Son durum + hata kitapçığı özeti */}
        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-md flex flex-col justify-between transition-all hover:shadow-lg">
          <div>
            <div className="flex items-center justify-between mb-space-sm">
              <div className="w-12 h-12 rounded-xl bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center">
                <span className="material-symbols-outlined text-[26px]">task_alt</span>
              </div>
              <span className="bg-tertiary-fixed text-on-tertiary-fixed px-2.5 py-1 rounded-full font-label-sm text-label-sm">
                %{hydrated ? accuracy : 0} Doğruluk
              </span>
            </div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-1">Son Durumun</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
              Çözdüğün görevlerin özeti ve düzeltmeyi bekleyen sorular
            </p>
            <div className="p-space-sm bg-surface-container-low rounded-xl flex items-center justify-around text-center">
              <div>
                <span className="font-headline-md text-headline-md text-tertiary block tabular-nums">
                  {hydrated ? state.totals.correct : 0}
                </span>
                <span className="font-label-sm text-label-sm text-outline">Doğru</span>
              </div>
              <div className="h-8 w-[1px] bg-surface-container-high" />
              <div>
                <span className="font-headline-md text-headline-md text-on-surface-variant block tabular-nums">
                  {hydrated ? state.totals.attempted : 0}
                </span>
                <span className="font-label-sm text-label-sm text-outline">Denenen</span>
              </div>
              {settings.pointsEnabled && (
                <>
                  <div className="h-8 w-[1px] bg-surface-container-high" />
                  <div>
                    <span className="font-headline-md text-headline-md text-primary block tabular-nums">
                      {hydrated ? state.points : 0}
                    </span>
                    <span className="font-label-sm text-label-sm text-outline">Puan</span>
                  </div>
                </>
              )}
            </div>
            <div className="mt-3 p-2 rounded-lg bg-surface-container-lowest flex items-center gap-2">
              <span className="material-symbols-outlined text-tertiary text-[18px]">lightbulb</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                {openMistakes.length === 0
                  ? "Hata kitapçığın şu an boş."
                  : `${openMistakes.length} soru Hata Kitapçığı'nda seni bekliyor.`}
              </span>
            </div>
          </div>
          <Link
            href="/matematik/analiz#hata-kitapcigi"
            className="mt-space-md w-full py-2.5 bg-primary-container text-on-primary hover:bg-primary font-label-md text-label-md rounded-full transition-all text-center"
          >
            Hata Kitapçığını Aç
          </Link>
        </div>
      </div>
    </div>
  );
}
