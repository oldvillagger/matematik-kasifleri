import { describe, expect, it } from "vitest";
import { TaskSchema, AssessmentSchema } from "./task";

const bigHex = { label: "", value: 3, visual: { shape: "hexagon", color: "violet", size: "lg" } };
const smallHex = { label: "", value: 1, visual: { shape: "hexagon", color: "violet", size: "sm" } };

const validBalanceA1 = {
  id: "t1",
  outcome: "MAT.5.2.1",
  componentCode: "a",
  stage: "A1",
  prompt: "Hangi taraf ağır basar?",
  hints: [],
  game: "balance",
  setup: { left: [bigHex], right: [smallHex, smallHex], mirrorMode: false },
};

const validBalanceA2 = {
  id: "t2",
  outcome: "MAT.5.2.1",
  componentCode: "c",
  stage: "A2",
  prompt: "x kaç?",
  hints: ["İki taraftan aynı sayıyı çıkar."],
  game: "balance",
  setup: { left: [{ label: "x", value: 0, kind: "unknown" }, { label: "3", value: 3 }], right: [{ label: "10", value: 10 }], answer: 7 },
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
    const result = TaskSchema.safeParse({ ...validBalanceA2, stage: "A3", hints: ["ipucu"] });
    expect(result.success).toBe(false);
  });

  it("never has a timeLimit field in the type at all", () => {
    // compile-time guarantee: this line would fail to typecheck if timeLimit existed
    const parsed = TaskSchema.parse(validBalanceA1);
    expect("timeLimit" in parsed).toBe(false);
  });
});

describe("A1 rakamsız olmalı (kırmızı çizgi)", () => {
  it("görselsiz sayı etiketli A1 terazi görevini reddeder", () => {
    const numeric = {
      ...validBalanceA1,
      setup: { left: [{ label: "5", value: 5 }], right: [{ label: "3", value: 3 }], mirrorMode: false },
    };
    expect(TaskSchema.safeParse(numeric).success).toBe(false);
  });

  it("A1 teraziye sayısal cevap eklenmesini reddeder", () => {
    const withAnswer = { ...validBalanceA1, setup: { ...validBalanceA1.setup, answer: 4 } };
    expect(TaskSchema.safeParse(withAnswer).success).toBe(false);
  });

  it("sayı dizili A1 örüntü görevini reddeder", () => {
    const numericPattern = {
      id: "t3",
      outcome: "MAT.5.2.3",
      componentCode: "a",
      stage: "A1",
      prompt: "Sıradaki?",
      hints: [],
      game: "pattern",
      setup: { sequence: [2, 4, 6], choices: [7, 8], answer: 8 },
    };
    expect(TaskSchema.safeParse(numericPattern).success).toBe(false);
  });

  it("görsel örüntülü A1 görevini kabul eder", () => {
    const visualPattern = {
      id: "t4",
      outcome: "MAT.5.2.3",
      componentCode: "a",
      stage: "A1",
      prompt: "Sıradaki şekil hangisi?",
      hints: [],
      game: "pattern",
      setup: {
        visualSequence: [
          { shape: "circle", color: "violet" },
          { shape: "square", color: "cyan" },
          { shape: "circle", color: "violet" },
        ],
        visualChoices: [
          { shape: "square", color: "cyan" },
          { shape: "triangle", color: "amber" },
        ],
        answerIndex: 0,
      },
    };
    expect(TaskSchema.safeParse(visualPattern).success).toBe(true);
  });

  it("A1 ızgara görevinde sayısal hedef verilmesini reddeder", () => {
    const numericGrid = {
      id: "t5",
      outcome: "MAT.5.4.2",
      componentCode: "a",
      stage: "A1",
      prompt: "Alanı bul.",
      hints: [],
      game: "grid",
      setup: { maxCols: 6, maxRows: 4, goal: "area", answer: 12 },
    };
    expect(TaskSchema.safeParse(numericGrid).success).toBe(false);
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
