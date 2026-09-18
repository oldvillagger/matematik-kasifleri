import { earnedBadges } from "./badges";
import { touchStreak } from "./streak";
import type { DayStamp, MistakeEntry, ProgressState } from "./types";

/**
 * Aşama başına puan. A1 = 0: "A1 aşamasında puan, skor yoktur" kırmızı
 * çizgisi K14'te DEĞİŞMEDİ — keşif aşaması puanlanmaz, üst barda da
 * hiçbir şey artmaz.
 */
const STAGE_POINTS = { A1: 0, A2: 5, A3: 10, ASSESSMENT: 10 } as const;
export type PointStage = keyof typeof STAGE_POINTS;

/** Bir konuyu (kazanımı) uçtan uca bitirme bonusu. */
export const LESSON_BONUS = 20;

export interface TaskOutcome {
  stage: PointStage;
  correct: boolean;
  outcomeCode: string;
  componentCode: string;
}

/** Bir görev sonucunu işler: sayaçlar, puan ve kanıtlanan bileşen. */
export function recordTask(state: ProgressState, outcome: TaskOutcome): ProgressState {
  const key = `${outcome.outcomeCode}:${outcome.componentCode}`;
  const proven =
    outcome.correct && !state.provenComponents.includes(key)
      ? [...state.provenComponents, key]
      : state.provenComponents;

  const next: ProgressState = {
    ...state,
    points: state.points + (outcome.correct ? STAGE_POINTS[outcome.stage] : 0),
    provenComponents: proven,
    totals: {
      attempted: state.totals.attempted + 1,
      correct: state.totals.correct + (outcome.correct ? 1 : 0),
    },
  };

  return { ...next, badges: earnedBadges(next) };
}

/**
 * Bir konu tamamlandı: bonus puan, günlük hedef +1, seri bugüne işlenir.
 * Seri burada ilerler (görev başına değil) — böylece "gün içinde 40 soru
 * çöz" baskısı oluşmaz, bir konu bitirmek yeter.
 */
export function completeLesson(state: ProgressState, outcomeCode: string, today: DayStamp): ProgressState {
  const completedOutcomes = state.completedOutcomes.includes(outcomeCode)
    ? state.completedOutcomes
    : [...state.completedOutcomes, outcomeCode];

  const sameDay = state.dailyGoal.day === today;

  const next: ProgressState = {
    ...state,
    points: state.points + LESSON_BONUS,
    completedOutcomes,
    streak: touchStreak(state.streak, today),
    dailyGoal: {
      target: state.dailyGoal.target,
      completed: sameDay ? state.dailyGoal.completed + 1 : 1,
      day: today,
    },
  };

  return { ...next, badges: earnedBadges(next) };
}

/** Hata kitapçığına ekler. Aynı görev tekrar yanlışsa kayıt çoğaltılmaz, tazelenir. */
export function recordMistake(state: ProgressState, entry: Omit<MistakeEntry, "resolved">): ProgressState {
  const rest = state.mistakes.filter((m) => m.taskId !== entry.taskId);
  const next: ProgressState = { ...state, mistakes: [{ ...entry, resolved: false }, ...rest] };
  return { ...next, badges: earnedBadges(next) };
}

/** "Tekrar Çöz" başarılı: kayıt silinmez, kapanır — gelişim görünür kalsın diye. */
export function resolveMistake(state: ProgressState, taskId: string): ProgressState {
  const next: ProgressState = {
    ...state,
    mistakes: state.mistakes.map((m) => (m.taskId === taskId ? { ...m, resolved: true } : m)),
  };
  return { ...next, badges: earnedBadges(next) };
}

/** Günlük hedef sayacı dünden kalmışsa 0 göster. */
export function dailyGoalProgress(state: ProgressState, today: DayStamp): { completed: number; target: number } {
  const completed = state.dailyGoal.day === today ? state.dailyGoal.completed : 0;
  return { completed, target: state.dailyGoal.target };
}

/** Doğruluk yüzdesi (0–100), hiç görev yoksa 0. */
export function accuracyPercent(state: ProgressState): number {
  if (state.totals.attempted === 0) return 0;
  return Math.round((state.totals.correct / state.totals.attempted) * 100);
}
