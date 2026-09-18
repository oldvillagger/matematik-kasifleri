export interface GameCompletion {
  correct: boolean;
  hintUsed: boolean;
}

/** Structural, not imported from content-schema — keeps this package decoupled from the exact Zod union. */
export interface BalanceToken {
  label: string;
  value: number;
  kind?: "known" | "unknown";
}
export interface BalanceTaskLike {
  prompt: string;
  hints?: string[];
  setup: {
    left: BalanceToken[];
    right: BalanceToken[];
    mirrorMode?: boolean | undefined;
    answer?: number | undefined;
  };
}

export interface GridTaskLike {
  prompt: string;
  hints?: string[];
  setup: {
    maxCols: number;
    maxRows: number;
    goal: "area" | "perimeter" | "explore";
    givenArea?: number | undefined;
    givenPerimeter?: number | undefined;
    answer?: number | undefined;
  };
}

export interface PatternTaskLike {
  prompt: string;
  hints?: string[];
  setup: {
    sequence: number[];
    choices: number[];
    answer: number;
  };
}
