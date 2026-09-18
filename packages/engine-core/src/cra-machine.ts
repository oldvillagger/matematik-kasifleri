import { applySupportPolicy } from "./support-policy";
import type { EngineState, EvidenceRecord, Stage, TaskResult } from "./types";

const STAGE_ORDER: readonly Stage[] = ["A1", "A2", "A3", "ASSESSMENT"];

export function createInitialState(startStage: Stage = "A1"): EngineState {
  return {
    stage: startStage,
    support: { value: 1, consecutiveCorrect: 0, consecutiveWrong: 0 },
    evidence: [],
  };
}

/**
 * A correct result records evidence for its process component; support
 * fades (A2 only, per policy). Evidence is append-only — matches
 * agents-notes/05-teknik-mimari.md's event-sourced EventLog design.
 */
export function recordTaskResult(state: EngineState, result: TaskResult): EngineState {
  const evidence: EvidenceRecord[] = result.correct
    ? [
        ...state.evidence,
        {
          outcomeCode: result.outcomeCode,
          componentCode: result.componentCode,
          taskId: result.taskId,
          stage: state.stage,
          recordedAt: new Date().toISOString(),
        },
      ]
    : state.evidence;

  const support = state.stage === "A2" ? applySupportPolicy(state.support, result) : state.support;

  return { ...state, support, evidence };
}

/** Moves to the next stage in A1 -> A2 -> A3 -> ASSESSMENT order. Caller decides when a stage's task list is exhausted. */
export function advanceStage(state: EngineState): EngineState {
  const idx = STAGE_ORDER.indexOf(state.stage);
  const next = STAGE_ORDER[Math.min(idx + 1, STAGE_ORDER.length - 1)] ?? state.stage;
  return {
    ...state,
    stage: next,
    support: next === "A2" ? { value: 1, consecutiveCorrect: 0, consecutiveWrong: 0 } : state.support,
  };
}

export function isLastStage(stage: Stage): boolean {
  return stage === "ASSESSMENT";
}
