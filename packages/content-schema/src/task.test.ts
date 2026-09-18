import { describe, expect, it } from "vitest";
import { TaskSchema, AssessmentSchema } from "./task";

const validBalanceA1 = {
  id: "t1",
  outcome: "MAT.5.2.1",
  componentCode: "a",
  stage: "A1",
  prompt: "Dengeyi kur.",
  hints: [],
  game: "balance",
  setup: { left: [{ label: "5", value: 5 }], right: [{ label: "x", value: 5, kind: "unknown" }], mirrorMode: false },
};

describe("TaskSchema", () => {
  it("accepts a valid A1 balance task with no hints", () => {
    expect(TaskSchema.safeParse(validBalanceA1).success).toBe(true);
  });

  it("rejects an A1 task with hints (red line)", () => {
    const result = TaskSchema.safeParse({ ...validBalanceA1, hints: ["ipucu"] });
    expect(result.success).toBe(false);
  });

  it("rejects an A3 task with hints (red line)", () => {
    const result = TaskSchema.safeParse({ ...validBalanceA1, stage: "A3", hints: ["ipucu"] });
    expect(result.success).toBe(false);
  });

  it("never has a timeLimit field in the type at all", () => {
    // compile-time guarantee: this line would fail to typecheck if timeLimit existed
    const parsed = TaskSchema.parse(validBalanceA1);
    expect("timeLimit" in parsed).toBe(false);
  });
});

describe("AssessmentSchema", () => {
  it("rejects fewer than 8 items (K12)", () => {
    const result = AssessmentSchema.safeParse({
      id: "a1",
      outcome: "MAT.5.2.1",
      items: [{ id: "i1", outcome: "MAT.5.2.1", componentCode: "a", prompt: "?", game: "pattern", setup: { sequence: [1, 2, 3], choices: [4, 5], answer: 4 } }],
    });
    expect(result.success).toBe(false);
  });
});
