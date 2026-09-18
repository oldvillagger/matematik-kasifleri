import { daysBetween } from "./day";
import type { DayStamp, StreakState } from "./types";

/**
 * Seriyi bugüne göre ilerletir. K14: seri VAR ama cezalandırıcı değil —
 * seri kırılınca hiçbir şey kaybedilmez, sadece sayaç 1'e döner. Kayıp
 * dili ("serini kaybettin") arayüzde kullanılmaz.
 *
 * - Aynı gün tekrar çalışılırsa seri değişmez (gün başına bir kez sayar).
 * - Ardışık gün → +1.
 * - Arada boşluk varsa → 1'den başlar.
 */
export function touchStreak(streak: StreakState, today: DayStamp): StreakState {
  if (streak.lastDay === today) return streak;

  const gap = streak.lastDay === null ? Number.NaN : daysBetween(streak.lastDay, today);
  const current = gap === 1 ? streak.current + 1 : 1;

  return {
    current,
    best: Math.max(streak.best, current),
    lastDay: today,
  };
}

/**
 * Sayaç gösterilmeden önce çağrılır: bugün henüz çalışılmadıysa ve araya
 * bir günden fazla girmişse, gösterilen seri artık geçerli değildir.
 * Durumu değiştirmez — sadece "şu an kaç görünmeli" sorusunu yanıtlar.
 */
export function displayedStreak(streak: StreakState, today: DayStamp): number {
  if (streak.lastDay === null) return 0;
  const gap = daysBetween(streak.lastDay, today);
  if (Number.isNaN(gap) || gap < 0) return 0;
  return gap <= 1 ? streak.current : 0;
}
