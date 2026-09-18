"use client";

import Link from "next/link";
import { BADGES, accuracyPercent, displayedStreak } from "@matematik-kasifleri/progression";
import type { BadgeId } from "@matematik-kasifleri/progression";
import { useProgress } from "../../../lib/ProgressProvider";

export interface OutcomeRow {
  code: string;
  title: string;
  short: string;
  /** Ürün adı ("Yankı Kapısı") — oynanabilirse. */
  topicTitle: string | undefined;
  componentCodes: string[];
  tone: "primary" | "secondary" | "tertiary";
}

const TONE = {
  primary: { chip: "bg-primary-fixed text-primary", bar: "bg-primary", text: "text-primary" },
  secondary: { chip: "bg-secondary-fixed text-secondary", bar: "bg-secondary-container", text: "text-secondary" },
  tertiary: { chip: "bg-tertiary-fixed text-tertiary", bar: "bg-tertiary-container", text: "text-tertiary" },
} as const;

/**
 * Stitch "Başarı Takip ve Hata Kitapçığı Analizi" ekranı, birebir düzen.
 * Tek içerik farkı: Stitch'in "ders bazlı başarı grafiği" bizde
 * **kazanım/süreç bileşeni bazlı kanıt grafiği** — ürünün asıl ölçtüğü şey
 * yüzde değil, hangi alt becerinin kanıtlandığı.
 */
export function AnalyticsBoard({ rows, backHref }: { rows: OutcomeRow[]; backHref: string }) {
  const { state, settings, today, hydrated } = useProgress();

  const accuracy = accuracyPercent(state);
  const streak = displayedStreak(state.streak, today);
  const openMistakes = state.mistakes.filter((m) => !m.resolved);
  const resolved = state.mistakes.filter((m) => m.resolved);
  const totalComponents = rows.reduce((s, r) => s + r.componentCodes.length, 0);
  const proven = hydrated ? state.provenComponents.length : 0;
  const provenPct = totalComponents === 0 ? 0 : Math.round((proven / totalComponents) * 100);
  const earned: BadgeId[] = hydrated ? state.badges : [];

  return (
    <main className="w-full pt-20 px-gutter bg-background pb-space-xl">
      <div className="flex flex-col w-full">
        <div className="flex items-center gap-2 py-space-sm text-on-surface-variant font-label-md text-label-md">
          <Link className="inline-flex items-center gap-1 text-primary hover:text-primary-container transition-colors" href={backHref}>
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span>Üniteler</span>
          </Link>
          <span className="text-outline-variant">/</span>
          <span className="text-on-surface font-label-lg text-label-lg">Başarı ve Gelişim Karnem</span>
        </div>

        {/* Gamification şeridi */}
        <div className="w-full bg-gradient-to-r from-primary via-primary-container to-secondary rounded-xl p-space-sm sm:p-space-md shadow-md text-on-primary mb-space-md flex flex-col md:flex-row items-center justify-between gap-space-sm relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 w-44 h-44 rounded-full bg-on-primary/10 blur-2xl pointer-events-none" />
          <div className="flex items-center gap-space-sm z-10">
            <div className="w-12 h-12 rounded-full bg-surface-container-lowest/20 flex items-center justify-center text-secondary-fixed shadow-inner">
              <span className="material-symbols-outlined text-[28px] icon-filled">workspace_premium</span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-headline-sm text-headline-sm tracking-tight text-surface-container-lowest">
                  {provenPct >= 50 ? "Kanıt panon dolmaya başladı! 🚀" : "Kanıt toplamaya devam! 🚀"}
                </span>
                {settings.pointsEnabled && (
                  <span className="bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm px-2 py-0.5 rounded-full tabular-nums">
                    {hydrated ? state.points : 0} Puan
                  </span>
                )}
              </div>
              <p className="font-body-sm text-body-sm text-on-primary-container opacity-90">
                {totalComponents - proven > 0
                  ? `${totalComponents - proven} süreç becerisi daha kanıtlanmayı bekliyor.`
                  : "Açık olan tüm becerileri kanıtladın."}
              </p>
            </div>
          </div>
          <Link
            href={backHref}
            className="px-space-md py-2.5 bg-surface-container-lowest text-primary font-label-md text-label-md rounded-full shadow-sm hover:scale-105 active:scale-95 transition-all z-10"
          >
            Çalışmaya Devam Et
          </Link>
        </div>

        {/* Başlık */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-space-sm mb-space-lg">
          <div>
            <div className="flex items-center gap-space-xs mb-1">
              <span className="font-label-sm text-label-sm px-2.5 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-bold tracking-wide">
                5. SINIF
              </span>
              <span className="font-label-sm text-label-sm px-2.5 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-bold">
                TYMM MÜFREDATI
              </span>
            </div>
            <h1 className="font-display-lg text-display-lg-mobile lg:text-display-lg text-on-surface tracking-tight flex items-center gap-space-xs">
              Başarı ve Gelişim Karnem <span className="text-secondary">📊</span>
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Burada puan değil, <strong>kanıt</strong> ölçülür: hangi süreç becerisini gerçekten gösterdin?
            </p>
          </div>
        </div>

        {/* 4 metrik */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-md mb-space-lg">
          <Metric
            label="Toplam Görev"
            icon="quiz"
            wrap="bg-primary-fixed"
            color="text-primary"
            value={hydrated ? String(state.totals.attempted) : "0"}
            chip={`%${hydrated ? accuracy : 0} Doğruluk`}
            chipCls="text-tertiary-container bg-tertiary-fixed/30"
            bar="bg-primary"
            pct={hydrated ? accuracy : 0}
            foot={`${hydrated ? state.totals.correct : 0} doğru`}
          />
          <Metric
            label="Kanıtlanan Beceri"
            icon="verified"
            wrap="bg-secondary-fixed"
            color="text-secondary"
            value={`${proven}`}
            chip={`/ ${totalComponents}`}
            chipCls="text-secondary bg-secondary-fixed/40"
            bar="bg-secondary"
            pct={provenPct}
            foot="Süreç bileşeni bazında"
          />
          <Metric
            label="Kazanılan Rozetler"
            icon="military_tech"
            wrap="bg-tertiary-fixed"
            color="text-tertiary"
            value={`${earned.length} Rozet`}
            chip={`${hydrated ? state.completedOutcomes.length : 0} konu bitti`}
            chipCls="text-tertiary bg-tertiary-fixed/40"
            bar="bg-tertiary"
            pct={Math.round((earned.length / Object.keys(BADGES).length) * 100)}
            foot="Aşağıda hepsini görebilirsin"
          />
          {settings.streakEnabled ? (
            <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm">
              <div className="flex items-center justify-between mb-space-xs">
                <span className="font-label-md text-label-md text-on-surface-variant">Öğrenme Serisi</span>
                <div className="w-10 h-10 rounded-full bg-error-container flex items-center justify-center text-error">
                  <span className="material-symbols-outlined text-[22px]">local_fire_department</span>
                </div>
              </div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="font-headline-lg text-headline-lg text-on-surface font-bold tabular-nums">
                  {hydrated ? streak : 0} Gün
                </span>
                {streak > 0 && (
                  <span className="font-label-sm text-label-sm text-error font-bold bg-error-container/60 px-2 py-0.5 rounded-full">
                    Devam! 🔥
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 mt-2.5">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div key={i} className={`h-2 flex-1 rounded-full ${i < streak ? "bg-error" : "bg-surface-container-high"}`} />
                ))}
              </div>
              <span className="block mt-2 font-body-sm text-body-sm text-on-surface-variant">
                Rekorun: {hydrated ? state.streak.best : 0} gün
              </span>
            </div>
          ) : (
            <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col justify-center">
              <span className="font-label-md text-label-md text-on-surface-variant">Öğrenme Serisi</span>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-2">
                Seri sistemi içerik masasından kapatılmış durumda.
              </p>
            </div>
          )}
        </div>

        {/* Bento: kanıt grafiği + hata kitapçığı */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md mb-space-lg items-start">
          <div className="lg:col-span-7 flex flex-col gap-space-md">
            <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm">
              <div className="flex items-center justify-between mb-space-md">
                <div className="flex items-center gap-space-xs">
                  <div className="w-9 h-9 rounded-full bg-primary-fixed flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[20px]">bar_chart</span>
                  </div>
                  <div>
                    <h2 className="font-headline-sm text-headline-sm text-on-surface">Kazanım Bazlı Kanıt Grafiği</h2>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      TYMM süreç bileşenlerine göre kanıtlanma oranı
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-space-md">
                {rows.map((row) => {
                  const done = hydrated
                    ? row.componentCodes.filter((c) => state.provenComponents.includes(`${row.code}:${c}`)).length
                    : 0;
                  const pct = Math.round((done / Math.max(1, row.componentCodes.length)) * 100);
                  const tone = TONE[row.tone];
                  return (
                    <div key={row.code}>
                      <div className="flex justify-between items-center mb-1.5 gap-space-sm">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className={`w-7 h-7 rounded-lg ${tone.chip} flex items-center justify-center font-bold text-xs shrink-0`}>
                            {row.short}
                          </span>
                          <span className="font-label-md text-label-md text-on-surface truncate">
                            {row.topicTitle ?? row.code} — {row.title}
                          </span>
                        </div>
                        <span className={`font-headline-sm text-headline-sm ${tone.text} font-bold tabular-nums shrink-0`}>
                          %{pct}
                        </span>
                      </div>
                      <div className="w-full bg-surface-container h-3.5 rounded-full overflow-hidden p-0.5">
                        <div
                          className={`${tone.bar} h-full rounded-full transition-all duration-1000 shadow-sm`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <div className="flex justify-between mt-1 text-[11px] text-on-surface-variant font-medium">
                        <span>
                          {done} / {row.componentCodes.length} süreç bileşeni
                        </span>
                        <span className={pct === 100 ? "text-tertiary-container" : "text-on-surface-variant"}>
                          {pct === 100 ? "Tamamen kanıtlandı 🌟" : pct === 0 ? "Henüz başlanmadı" : "Devam ediyor"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Hata Kitapçığı */}
          <div className="lg:col-span-5 flex flex-col gap-space-md">
            <div id="hata-kitapcigi" className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm scroll-mt-24">
              <div className="flex items-center justify-between pb-space-sm">
                <div className="flex items-center gap-space-xs">
                  <div className="w-10 h-10 rounded-full bg-error-container flex items-center justify-center text-on-error-container">
                    <span className="material-symbols-outlined text-[22px]">auto_stories</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h2 className="font-headline-sm text-headline-sm text-on-surface">Hata Kitapçığı</h2>
                      <span className="bg-error text-on-error font-label-sm text-label-sm px-2 py-0.5 rounded-full tabular-nums">
                        {openMistakes.length} Soru
                      </span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">Eksiklerini akıllıca kapat</p>
                  </div>
                </div>
              </div>

              <div className="p-space-sm bg-surface-container-low rounded-xl my-space-sm flex items-start gap-space-xs">
                <span className="material-symbols-outlined text-primary text-[20px] mt-0.5">psychology_alt</span>
                <div className="font-body-sm text-body-sm text-on-surface">
                  {openMistakes.length === 0 ? (
                    <>
                      Şu an kitapçığında bekleyen soru yok. Test aşamasında takıldığın sorular buraya{" "}
                      <strong>süreç bileşeni etiketiyle</strong> düşer.
                    </>
                  ) : (
                    <>
                      Takıldığın <strong>{openMistakes.length} soru</strong> hangi süreç bileşeninde olduğuyla birlikte
                      kaydedildi. Konuyu tekrar oynayınca bunlar kapanır.
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-space-sm mt-space-sm">
                {openMistakes.slice(0, 6).map((m) => (
                  <div key={m.taskId} className="p-space-sm rounded-xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-start justify-between gap-space-xs mb-space-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-7 h-6 rounded bg-primary text-on-primary flex items-center justify-center font-bold text-xs shrink-0">
                          {m.componentCode}
                        </span>
                        <span className="font-label-md text-label-md text-on-surface truncate">{m.outcomeCode}</span>
                      </div>
                      <span className="font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-error-container text-on-error-container shrink-0">
                        {m.day}
                      </span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-sm">
                      “{m.prompt}” (Verdiğin: {m.given} • Doğrusu: {m.expected})
                    </p>
                    <div className="flex items-center justify-end pt-space-xs">
                      <Link
                        href={`${backHref}/${m.outcomeCode}`}
                        className="px-space-sm py-1.5 bg-primary-container text-on-primary font-label-sm text-label-sm rounded-full shadow-sm hover:bg-primary transition-all active:scale-95 flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[16px]">replay</span> Tekrar Çöz
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {resolved.length > 0 && (
                <div className="mt-space-md p-space-sm rounded-xl bg-tertiary-fixed/30 flex items-center gap-2">
                  <span className="material-symbols-outlined text-tertiary text-[20px] icon-filled">check_circle</span>
                  <span className="font-label-sm text-label-sm text-on-tertiary-fixed">
                    {resolved.length} soruyu tekrar çözüp düzelttin.
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Rozet vitrini */}
        <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm">
          <div className="flex items-center justify-between mb-space-sm">
            <div className="flex items-center gap-space-xs">
              <div className="w-9 h-9 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-[20px] icon-filled">military_tech</span>
              </div>
              <h2 className="font-headline-sm text-headline-sm text-on-surface">Kazanılan Başarı Nişanları</h2>
            </div>
            <span className="font-label-md text-label-md text-on-surface-variant tabular-nums">
              {earned.length} / {Object.keys(BADGES).length}
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-space-xs">
            {Object.values(BADGES).map((badge) => {
              const has = earned.includes(badge.id);
              return (
                <div
                  key={badge.id}
                  title={badge.description}
                  className={`p-space-sm rounded-xl flex flex-col items-center text-center gap-1 transition-all ${
                    has ? "bg-tertiary-fixed/40" : "bg-surface-container-low opacity-60"
                  }`}
                >
                  <span className={`text-2xl ${has ? "" : "grayscale"}`}>{badge.emoji}</span>
                  <span className="font-label-sm text-label-sm text-on-surface">{badge.title}</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    {has ? "Kazanıldı" : "Kilitli"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}

function Metric({
  label,
  icon,
  wrap,
  color,
  value,
  chip,
  chipCls,
  bar,
  pct,
  foot,
}: {
  label: string;
  icon: string;
  wrap: string;
  color: string;
  value: string;
  chip: string;
  chipCls: string;
  bar: string;
  pct: number;
  foot: string;
}) {
  return (
    <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
      <div className="flex items-center justify-between mb-space-xs">
        <span className="font-label-md text-label-md text-on-surface-variant">{label}</span>
        <div className={`w-10 h-10 rounded-full ${wrap} flex items-center justify-center ${color}`}>
          <span className="material-symbols-outlined text-[22px]">{icon}</span>
        </div>
      </div>
      <div className="flex items-baseline gap-2 mb-1">
        <span className="font-headline-lg text-headline-lg text-on-surface font-bold tabular-nums">{value}</span>
        <span className={`font-label-sm text-label-sm font-bold px-2 py-0.5 rounded-full ${chipCls}`}>{chip}</span>
      </div>
      <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden mt-space-xs">
        <div className={`${bar} h-full rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
      </div>
      <span className="block mt-2 font-body-sm text-body-sm text-on-surface-variant">{foot}</span>
    </div>
  );
}
