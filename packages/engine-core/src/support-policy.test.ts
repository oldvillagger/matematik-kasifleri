import { describe, expect, it } from "vitest";
import { applySupportPolicy } from "./support-policy";

const fresh = { value: 1, consecutiveCorrect: 0, consecutiveWrong: 0 };

describe("applySupportPolicy", () => {
  it("does not change support before 3 consecutive correct results", () => {
    let s = fresh;
    s = applySupportPolicy(s, { correct: true, hintUsed: false });
    s = applySupportPolicy(s, { correct: true, hintUsed: false });
    expect(s.value).toBe(1);
    expect(s.consecutiveCorrect).toBe(2);
  });

  it("lowers support by 0.25 on the 3rd consecutive correct, no-hint result", () => {
    let s = fresh;
    s = applySupportPolicy(s, { correct: true, hintUsed: false });
    s = applySupportPolicy(s, { correct: true, hintUsed: false });
    s = applySupportPolicy(s, { correct: true, hintUsed: false });
    expect(s.value).toBe(0.75);
    expect(s.consecutiveCorrect).toBe(0);
  });

  it("raises support by 0.25 on the 2nd consecutive wrong result", () => {
    let s = { value: 0.5, consecutiveCorrect: 0, consecutiveWrong: 0 };
    s = applySupportPolicy(s, { correct: false, hintUsed: false });
    expect(s.value).toBe(0.5);
    s = applySupportPolicy(s, { correct: false, hintUsed: false });
    expect(s.value).toBe(0.75);
    expect(s.consecutiveWrong).toBe(0);
  });

  it("raises support immediately on a single hint use", () => {
    const s = applySupportPolicy({ value: 0.5, consecutiveCorrect: 2, consecutiveWrong: 0 }, { correct: true, hintUsed: true });
    expect(s.value).toBe(0.75);
    expect(s.consecutiveCorrect).toBe(0);
  });

  it("never exceeds 1.0 or drops below 0.0", () => {
    const raised = applySupportPolicy({ value: 1, consecutiveCorrect: 0, consecutiveWrong: 0 }, { correct: false, hintUsed: true });
    expect(raised.value).toBe(1);

    let lowered = { value: 0, consecutiveCorrect: 0, consecutiveWrong: 0 };
    for (let i = 0; i < 3; i++) {
      lowered = applySupportPolicy(lowered, { correct: true, hintUsed: false });
    }
    expect(lowered.value).toBe(0);
  });
});
