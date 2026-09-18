import type { SupportState, TaskResult } from "./types";

const STEP = 0.25;

/**
 * agents-notes/03-pedagojik-mimari.md §2 — the fading policy, as a pure
 * function so it stays testable and overridable from content, not a magic
 * number buried in a component.
 *
 * Any hint use, or two consecutive wrong (no-hint) attempts, raises support
 * by one step. Three consecutive correct first-attempt no-hint results
 * lower it by one step. Support is two-way on purpose (expertise-reversal).
 */
export function applySupportPolicy(current: SupportState, result: Pick<TaskResult, "correct" | "hintUsed">): SupportState {
  if (result.hintUsed) {
    return { value: clamp(current.value + STEP), consecutiveCorrect: 0, consecutiveWrong: 0 };
  }

  if (!result.correct) {
    const consecutiveWrong = current.consecutiveWrong + 1;
    if (consecutiveWrong >= 2) {
      return { value: clamp(current.value + STEP), consecutiveCorrect: 0, consecutiveWrong: 0 };
    }
    return { value: current.value, consecutiveCorrect: 0, consecutiveWrong };
  }

  const consecutiveCorrect = current.consecutiveCorrect + 1;
  if (consecutiveCorrect >= 3) {
    return { value: clamp(current.value - STEP), consecutiveCorrect: 0, consecutiveWrong: 0 };
  }
  return { value: current.value, consecutiveCorrect, consecutiveWrong: 0 };
}

function clamp(n: number): number {
  return Math.min(1, Math.max(0, Math.round(n * 100) / 100));
}
