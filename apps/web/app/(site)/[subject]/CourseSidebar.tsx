"use client";

import { useState } from "react";
import Link from "next/link";
import { displayedStreak } from "@matematik-kasifleri/progression";
import { useProgress } from "../../lib/ProgressProvider";

export interface SidebarTopic {
  outcomeCode: string;
  title: string;
  outcomeTitle: string;
}

/**
 * Stitch ünite sayfasının sağ paneli (4 kolon), birebir sıra ve kart yapısı:
 * büyük test kartı → günün görevi → dikkat noktası → canlı soru-cevap odası
 * → mini seri rozeti.
 *
 * "Canlı Soru-Cevap Odası" kartı kullanıcı kararıyla GÖRSEL olarak duruyor
 * ama pasif: arkasında öğretmen altyapısı yok ve CLAUDE.md'nin "açık sohbet
 * yok" kuralı gereği çocuk-çocuk sohbeti hiçbir zaman açılmayacak.
 */
export function CourseSidebar({ topics, subjectSlug }: { topics: SidebarTopic[]; subjectSlug: string }) {
  const { state, settings, today, hydrated } = useProgress();
  const [roomNotice, setRoomNotice] = useState(false);

  const next = topics.find((t) => !state.completedOutcomes.includes(t.outcomeCode)) ?? topics[0];
  const streak = displayedStreak(state.streak, today);
  const openMistakes = state.mistakes.filter((m) => !m.resolved);
  const topMistake = openMistakes[0];

  return (
    <div className="lg:col-span-4 flex flex-col gap-space-md">
      {/* Büyük eylem kartı */}
      <div id="testler" className="bg-gradient-to-br from-primary-container to-primary rounded-xl p-space-md text-on-primary shadow-xl relative overflow-hidden scroll-mt-24">
        <div className="absolute -right-10 -bottom-10 w-36 h-36 rounded-full bg-on-primary/10 pointer-events-none" />
        <div className="flex items-center justify-between">
          <span className="px-2.5 py-1 rounded-full bg-on-primary/20 text-on-primary font-label-sm text-label-sm backdrop-blur-sm">
            Konu Sonu Testi
          </span>
          <span className="flex items-center gap-1 font-label-sm text-label-sm text-tertiary-fixed">
            <span className="material-symbols-outlined text-[16px]">timer_off</span> Süre sınırı yok
          </span>
        </div>
        <h2 className="font-headline-md text-headline-md text-on-primary mt-space-xs">
          {next ? next.title : "Gerçek Teste Hazırlık"}
        </h2>
        <p className="font-body-sm text-body-sm text-on-primary/80 mt-1">
          Önce materyalle keşfet, sonra sayılarla bağla; test aşamasına hazır olduğunda motor seni oraya taşır.
        </p>
        <div className="mt-space-md flex flex-col gap-space-xs">
          {next && (
            <Link
              href={`/${subjectSlug}/${next.outcomeCode}`}
              className="w-full py-space-sm rounded-full bg-on-primary text-primary hover:bg-surface-container-low transition-all font-label-lg text-label-lg shadow-lg flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-[22px] icon-filled">play_arrow</span> Konuya Başla
            </Link>
          )}
          <span className="text-center font-label-sm text-label-sm text-on-primary/70">
            3 aşama • En az 8 soruluk konu sonu testi • +10 Puan / doğru
          </span>
        </div>
      </div>

      {/* Bugünün keşfi */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-md flex flex-col gap-space-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-xs">
            <div className="w-8 h-8 rounded-lg bg-secondary-fixed flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-[18px]">psychology</span>
            </div>
            <h3 className="font-label-lg text-label-lg text-on-surface">Bugünün Keşfi</h3>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-secondary-fixed/50 text-on-secondary-fixed font-label-sm text-label-sm">
            +20 Puan
          </span>
        </div>
        <div className="p-space-sm rounded-lg bg-surface-container-low mt-1">
          <p className="font-body-md text-body-md text-on-surface font-medium">
            {next ? next.outcomeTitle : "Açık olan tüm konuları bitirdin. Hata kitapçığındaki soruları tazelemeye ne dersin?"}
          </p>
        </div>
        <Link
          href={next ? `/${subjectSlug}/${next.outcomeCode}` : "/matematik/analiz#hata-kitapcigi"}
          className="w-full mt-1 py-1.5 rounded-full bg-surface-container-high text-primary hover:bg-surface-container font-label-sm text-label-sm transition-colors text-center"
        >
          {next ? "Keşfetmeye Başla" : "Hata Kitapçığını Aç"}
        </Link>
      </div>

      {/* Dikkat Noktası — gerçek hata kitapçığından beslenir */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-md flex flex-col gap-space-xs">
        <div className="flex items-center gap-space-xs">
          <div className="w-8 h-8 rounded-lg bg-error-container flex items-center justify-center text-error">
            <span className="material-symbols-outlined text-[18px]">warning</span>
          </div>
          <div>
            <h3 className="font-label-lg text-label-lg text-on-surface">Dikkat Noktası</h3>
            <span className="font-label-sm text-label-sm text-error">Senin takıldığın yerler</span>
          </div>
        </div>
        <div className="mt-1 p-space-sm rounded-lg bg-error-container/30">
          {hydrated && topMistake ? (
            <>
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-error text-[20px] shrink-0 mt-0.5">report_problem</span>
                <div>
                  <span className="font-label-md text-label-md text-on-surface block">
                    {topMistake.outcomeCode} • süreç bileşeni {topMistake.componentCode}
                  </span>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">{topMistake.prompt}</p>
                </div>
              </div>
              <Link
                className="inline-flex items-center gap-1 font-label-sm text-label-sm text-primary hover:underline mt-2"
                href="/matematik/analiz#hata-kitapcigi"
              >
                <span className="material-symbols-outlined text-[16px]">replay</span> Tekrar Çöz
              </Link>
            </>
          ) : (
            <div className="flex items-start gap-2">
              <span className="material-symbols-outlined text-tertiary text-[20px] shrink-0 mt-0.5">check_circle</span>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Şu an düzeltilmeyi bekleyen bir sorun yok. Takıldığın bir görev olursa buraya düşecek.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Canlı Soru-Cevap Odası — görsel, pasif */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-md flex flex-col gap-space-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-xs">
            <div className="w-8 h-8 rounded-lg bg-tertiary-fixed flex items-center justify-center text-tertiary">
              <span className="material-symbols-outlined text-[18px]">support_agent</span>
            </div>
            <div>
              <h3 className="font-label-lg text-label-lg text-on-surface">Canlı Soru-Cevap Odası</h3>
              <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-outline-variant" /> Öğretmen bağlantısı henüz açılmadı
              </span>
            </div>
          </div>
        </div>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
          Takıldığın problemi nöbetçi öğretmene iletebileceğin oda planlandı. Yalnızca öğretmenle konuşulur —
          öğrenciler arası açık sohbet olmayacak.
        </p>
        <button
          type="button"
          onClick={() => setRoomNotice(true)}
          className="w-full mt-2 py-2 rounded-full bg-surface-container-high text-on-surface-variant font-label-md text-label-md flex items-center justify-center gap-1.5 transition-all hover:bg-surface-container"
        >
          <span className="material-symbols-outlined text-[18px]">mic</span> Soru Odasına Bağlan
        </button>
        {roomNotice && (
          <p className="font-body-sm text-body-sm text-on-surface-variant text-center">
            Öğretmen bağlantısı bu sürümde henüz açık değil.
          </p>
        )}
      </div>

      {/* Mini seri rozeti */}
      {settings.streakEnabled && (
        <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-md flex items-center justify-between">
          <div className="flex items-center gap-space-xs">
            <span className="text-2xl">🔥</span>
            <div>
              <span className="font-label-md text-label-md text-on-surface block">
                {hydrated && streak > 0 ? `${streak} Günlük Seri!` : "Serini bugün başlat"}
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                {hydrated && state.streak.best > 0 ? `Rekorun: ${state.streak.best} gün` : "Bir konu bitirmen yeterli."}
              </span>
            </div>
          </div>
          {settings.pointsEnabled && (
            <div className="px-space-sm py-1 rounded-full bg-secondary-fixed/40 text-on-secondary-fixed font-label-sm text-label-sm font-bold tabular-nums">
              {hydrated ? state.points : 0} P
            </div>
          )}
        </div>
      )}
    </div>
  );
}
