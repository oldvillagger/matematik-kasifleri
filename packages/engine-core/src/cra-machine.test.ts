import { describe, expect, it } from "vitest";
import { advanceStage, createInitialState, recordTaskResult } from "./cra-machine";

describe("cra-machine", () => {
  it("starts at A1 with full support and no evidence", () => {
    const s = createInitialState();
    expect(s.stage).toBe("A1");
    expect(s.support.value).toBe(1);
    expect(s.evidence).toHaveLength(0);
  });

  it("records evidence only for correct results", () => {
    let s = createInitialState();
    s = recordTaskResult(s, { outcomeCode: "MAT.5.2.1", componentCode: "a", taskId: "t1", correct: true, hintUsed: false });
    s = recordTaskResult(s, { outcomeCode: "MAT.5.2.1", componentCode: "b", taskId: "t2", correct: false, hintUsed: false });
    expect(s.evidence).toHaveLength(1);
    expect(s.evidence[0]?.componentCode).toBe("a");
  });

  it("only applies the support policy while in A2", () => {
    let s = createInitialState("A1");
    for (let i = 0; i < 3; i++) {
      s = recordTaskResult(s, { outcomeCode: "MAT.5.2.1", componentCode: "a", taskId: `t${i}`, correct: true, hintUsed: false });
    }
    expect(s.support.value).toBe(1); // A1 — untouched

    s = advanceStage(s); // -> A2
    for (let i = 0; i < 3; i++) {
      s = recordTaskResult(s, { outcomeCode: "MAT.5.2.1", componentCode: "a", taskId: `t${i}`, correct: true, hintUsed: false });
    }
    expect(s.support.value).toBe(0.75);
  });

  it("advances A1 -> A2 -> A3 -> ASSESSMENT and stays there", () => {
    let s = createInitialState();
    s = advanceStage(s);
    expect(s.stage).toBe("A2");
    s = advanceStage(s);
    expect(s.stage).toBe("A3");
    s = advanceStage(s);
    expect(s.stage).toBe("ASSESSMENT");
    s = advanceStage(s);
    expect(s.stage).toBe("ASSESSMENT");
  });
});
