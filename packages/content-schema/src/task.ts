import { z } from "zod";

/**
 * Görev şeması. Kırmızı çizgiler burada zorlanıyor (CLAUDE.md):
 *  - A1/A3/ASSESSMENT'te hints boş olmalı.
 *  - timeLimit alanı hiçbir stage için şemada YOK — bu, alanın "tanımlı
 *    olmaması" kuralının kod karşılığı (alanı hiç eklemedik).
 *  - **A1'de rakam yoktur.** Keşfet aşamasındaki her görev yalnızca görsel
 *    (şekil/renk/boyut) ile çalışır; şema bunu zorlar, içerik yazarı
 *    yanlışlıkla sayı koyamaz. Kullanıcı talimatı, oturum 002 devam 5.
 * Üç manipülatif tipi (balance/grid/pattern) ayrı setup şemalarına sahip;
 * her biri ilgili React bileşeninin ihtiyacı olanı birebir tanımlar.
 */

export const StageSchema = z.enum(["A1", "A2", "A3", "ASSESSMENT"]);
export type Stage = z.infer<typeof StageSchema>;

/** A1'in görsel dili: rakam yerine şekil + renk + boyut. */
export const VisualSchema = z.object({
  shape: z.enum(["circle", "square", "triangle", "star", "hexagon", "diamond"]),
  color: z.enum(["violet", "cyan", "emerald", "amber", "rose", "slate"]),
  size: z.enum(["sm", "md", "lg"]).default("md"),
});
export type Visual = z.infer<typeof VisualSchema>;

const baseFields = {
  id: z.string().min(1),
  outcome: z.string().regex(/^MAT\.5\.\d\.\d$/),
  componentCode: z.string().min(1),
  stage: StageSchema,
  prompt: z.string().min(1),
  hints: z.array(z.string()),
};

const TokenSchema = z.object({
  label: z.string(),
  value: z.number(),
  kind: z.enum(["known", "unknown"]).default("known"),
  /** A1'de zorunlu: taşın görünüşü. A2+ için isteğe bağlı. */
  visual: VisualSchema.optional(),
});

const BalanceTaskObject = z.object({
  ...baseFields,
  game: z.literal("balance"),
  setup: z.object({
    left: z.array(TokenSchema).min(1),
    right: z.array(TokenSchema).min(1),
    mirrorMode: z.boolean().default(false),
    answer: z.number().optional(),
  }),
});

const GridTaskObject = z.object({
  ...baseFields,
  game: z.literal("grid"),
  setup: z.object({
    maxCols: z.number().int().positive(),
    maxRows: z.number().int().positive(),
    goal: z.enum(["area", "perimeter", "explore"]),
    givenArea: z.number().optional(),
    givenPerimeter: z.number().optional(),
    answer: z.number().optional(),
    /** A1: döşenecek hedef şeklin ölçüleri. Çocuğa sayı olarak DEĞİL, çerçeve olarak gösterilir. */
    targetCols: z.number().int().positive().optional(),
    targetRows: z.number().int().positive().optional(),
  }),
});

const PatternTaskObject = z.object({
  ...baseFields,
  game: z.literal("pattern"),
  setup: z.object({
    sequence: z.array(z.number()).min(3).optional(),
    choices: z.array(z.number()).min(2).optional(),
    answer: z.number().optional(),
    /** A1: sayı dizisi yerine şekil/renk örüntüsü. */
    visualSequence: z.array(VisualSchema).min(3).optional(),
    visualChoices: z.array(VisualSchema).min(2).optional(),
    answerIndex: z.number().int().nonnegative().optional(),
  }),
});

type AnyTask = z.infer<typeof BalanceTaskObject> | z.infer<typeof GridTaskObject> | z.infer<typeof PatternTaskObject>;

function noHintsOutsideA2(task: { stage: Stage; hints: string[] }): boolean {
  if (task.stage === "A1" || task.stage === "A3" || task.stage === "ASSESSMENT") {
    return task.hints.length === 0;
  }
  return true;
}
const hintRuleMessage = { message: "A1/A3/ASSESSMENT aşamalarında hints boş olmalı (kırmızı çizgi, CLAUDE.md)" };

/** A1 = rakamsız. Her oyun tipi için ayrı ayrı zorlanır. */
function a1IsNumberless(task: AnyTask): boolean {
  if (task.stage !== "A1") return true;

  if (task.game === "balance") {
    const tokens = [...task.setup.left, ...task.setup.right];
    return tokens.every((t) => t.visual !== undefined) && task.setup.answer === undefined;
  }

  if (task.game === "grid") {
    return (
      task.setup.goal === "explore" &&
      task.setup.givenArea === undefined &&
      task.setup.givenPerimeter === undefined &&
      task.setup.answer === undefined
    );
  }

  return (
    task.setup.visualSequence !== undefined &&
    task.setup.visualChoices !== undefined &&
    task.setup.answerIndex !== undefined &&
    task.setup.sequence === undefined
  );
}
const a1RuleMessage = {
  message: "A1 (Keşfet) görevlerinde rakam olamaz: balance/pattern görselleri zorunlu, sayısal cevap yasak",
};

/** A2/A3/ASSESSMENT örüntü görevleri sayısal çalışır. */
function numericStagesAreNumeric(task: AnyTask): boolean {
  if (task.stage === "A1" || task.game !== "pattern") return true;
  return task.setup.sequence !== undefined && task.setup.choices !== undefined && task.setup.answer !== undefined;
}
const numericRuleMessage = { message: "A2/A3/ASSESSMENT örüntü görevlerinde sequence/choices/answer zorunlu" };

export const TaskSchema = z
  .discriminatedUnion("game", [BalanceTaskObject, GridTaskObject, PatternTaskObject])
  .refine(noHintsOutsideA2, hintRuleMessage)
  .refine(a1IsNumberless, a1RuleMessage)
  .refine(numericStagesAreNumeric, numericRuleMessage);
export type Task = z.infer<typeof TaskSchema>;

const assessmentItemUnion = z.discriminatedUnion("game", [
  BalanceTaskObject.omit({ stage: true, hints: true }),
  GridTaskObject.omit({ stage: true, hints: true }),
  PatternTaskObject.omit({ stage: true, hints: true }),
]);

export const AssessmentItemSchema = assessmentItemUnion.refine(
  (item) => item.game !== "pattern" || (item.setup.sequence !== undefined && item.setup.answer !== undefined),
  numericRuleMessage,
);
export type AssessmentItem = z.infer<typeof AssessmentItemSchema>;

export const AssessmentSchema = z.object({
  id: z.string(),
  outcome: z.string().regex(/^MAT\.5\.\d\.\d$/),
  items: z.array(AssessmentItemSchema).min(8, "Konu Sonu Testi en az 8 soru içermeli (K12)"),
});
export type Assessment = z.infer<typeof AssessmentSchema>;
