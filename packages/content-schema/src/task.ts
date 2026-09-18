import { z } from "zod";

/**
 * Görev şeması. Kırmızı çizgiler burada zorlanıyor (CLAUDE.md):
 *  - A1/A3/ASSESSMENT'te hints boş olmalı.
 *  - timeLimit alanı hiçbir stage için şemada YOK — bu, alanın "tanımlı
 *    olmaması" kuralının kod karşılığı (alanı hiç eklemedik).
 * Üç manipülatif tipi (balance/grid/pattern) ayrı setup şemalarına sahip;
 * her biri ilgili React bileşeninin ihtiyacı olanı birebir tanımlar.
 */

export const StageSchema = z.enum(["A1", "A2", "A3", "ASSESSMENT"]);
export type Stage = z.infer<typeof StageSchema>;

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
  }),
});

const PatternTaskObject = z.object({
  ...baseFields,
  game: z.literal("pattern"),
  setup: z.object({
    sequence: z.array(z.number()).min(3),
    choices: z.array(z.number()).min(2),
    answer: z.number(),
  }),
});

function noHintsOutsideA2(task: { stage: Stage; hints: string[] }): boolean {
  if (task.stage === "A1" || task.stage === "A3" || task.stage === "ASSESSMENT") {
    return task.hints.length === 0;
  }
  return true;
}
const hintRuleMessage = { message: "A1/A3/ASSESSMENT aşamalarında hints boş olmalı (kırmızı çizgi, CLAUDE.md)" };

export const TaskSchema = z
  .discriminatedUnion("game", [BalanceTaskObject, GridTaskObject, PatternTaskObject])
  .refine(noHintsOutsideA2, hintRuleMessage);
export type Task = z.infer<typeof TaskSchema>;

export const AssessmentItemSchema = z.discriminatedUnion("game", [
  BalanceTaskObject.omit({ stage: true, hints: true }),
  GridTaskObject.omit({ stage: true, hints: true }),
  PatternTaskObject.omit({ stage: true, hints: true }),
]);
export type AssessmentItem = z.infer<typeof AssessmentItemSchema>;

export const AssessmentSchema = z.object({
  id: z.string(),
  outcome: z.string().regex(/^MAT\.5\.\d\.\d$/),
  items: z.array(AssessmentItemSchema).min(8, "Konu Sonu Testi en az 8 soru içermeli (K12)"),
});
export type Assessment = z.infer<typeof AssessmentSchema>;
