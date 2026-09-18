import { describe, expect, it } from "vitest";
import { loadLesson } from "./loader";

const outcomes = ["MAT.5.2.1", "MAT.5.2.3", "MAT.5.4.2", "MAT.5.4.1"];

describe("loadLesson", () => {
  for (const outcome of outcomes) {
    it(`loads and validates ${outcome} without throwing`, () => {
      const lesson = loadLesson("matematik", "tymm-5", outcome);
      expect(lesson.a1.length).toBeGreaterThan(0);
      expect(lesson.a2.length).toBeGreaterThan(0);
      expect(lesson.a3.length).toBeGreaterThan(0);
      expect(lesson.assessment.items.length).toBeGreaterThanOrEqual(8);
    });
  }
});
