/** Pure TypeScript. No React, no DOM, no network — CLAUDE.md architecture rule. */

export type Stage = "A1" | "A2" | "A3" | "ASSESSMENT";

export interface SupportState {
  /** 1.0 (full scaffolding) -> 0.0 (symbol only). Only meaningful in A2. */
  value: number;
  consecutiveCorrect: number;
  consecutiveWrong: number;
}

export interface EvidenceRecord {
  outcomeCode: string;
  componentCode: string;
  taskId: string;
  stage: Stage;
  recordedAt: string;
}

export interface TaskResult {
  outcomeCode: string;
  componentCode: string;
  taskId: string;
  correct: boolean;
  hintUsed: boolean;
}

export interface EngineState {
  stage: Stage;
  support: SupportState;
  evidence: EvidenceRecord[];
}
