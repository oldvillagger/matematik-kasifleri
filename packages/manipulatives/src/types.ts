export interface GameCompletion {
  correct: boolean;
  hintUsed: boolean;
  /** Çocuğun verdiği cevap — hata kitapçığı kaydı için. Keşif görevlerinde yok. */
  given?: string | undefined;
  /** Beklenen cevap — hata kitapçığı kaydı için. */
  expected?: string | undefined;
}

/** Hangi aşamada oynandığı — görsel dili tamamen bu belirler. */
export type GameStage = "A1" | "A2" | "A3" | "ASSESSMENT";

/** A1'in görsel dili: rakam yerine şekil + renk + boyut (content-schema ile aynı şekil). */
export interface VisualSpec {
  shape: "circle" | "square" | "triangle" | "star" | "hexagon" | "diamond";
  color: "violet" | "cyan" | "emerald" | "amber" | "rose" | "slate";
  size?: "sm" | "md" | "lg" | undefined;
}

/** Structural, not imported from content-schema — keeps this package decoupled from the exact Zod union. */
export interface BalanceToken {
  label: string;
  value: number;
  kind?: "known" | "unknown" | undefined;
  visual?: VisualSpec | undefined;
}

export interface BalanceTaskLike {
  prompt: string;
  hints?: string[] | undefined;
  setup: {
    left: BalanceToken[];
    right: BalanceToken[];
    mirrorMode?: boolean | undefined;
    answer?: number | undefined;
  };
}

export interface GridTaskLike {
  prompt: string;
  hints?: string[] | undefined;
  setup: {
    maxCols: number;
    maxRows: number;
    goal: "area" | "perimeter" | "explore";
    givenArea?: number | undefined;
    givenPerimeter?: number | undefined;
    answer?: number | undefined;
    targetCols?: number | undefined;
    targetRows?: number | undefined;
  };
}

export interface PatternTaskLike {
  prompt: string;
  hints?: string[] | undefined;
  setup: {
    sequence?: number[] | undefined;
    choices?: number[] | undefined;
    answer?: number | undefined;
    visualSequence?: VisualSpec[] | undefined;
    visualChoices?: VisualSpec[] | undefined;
    answerIndex?: number | undefined;
  };
}

export interface GameProps<T> {
  task: T;
  stage: GameStage;
  onComplete: (result: GameCompletion) => void;
}
