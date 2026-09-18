import type { DayStamp } from "./types";

/** "2026-09-18" biçiminde gün damgası. Saat ve zaman dilimi tutmuyoruz. */
export function toDayStamp(date: Date): DayStamp {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** İki gün damgası arasındaki tam gün farkı (b - a). Geçersiz girdide NaN. */
export function daysBetween(a: DayStamp, b: DayStamp): number {
  const pa = parseDay(a);
  const pb = parseDay(b);
  if (pa === null || pb === null) return Number.NaN;
  return Math.round((pb - pa) / 86_400_000);
}

function parseDay(stamp: DayStamp): number | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(stamp);
  if (!m) return null;
  const [, y, mo, d] = m;
  return Date.UTC(Number(y), Number(mo) - 1, Number(d));
}
