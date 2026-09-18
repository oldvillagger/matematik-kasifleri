import { describe, expect, it } from "vitest";
import { displayedStreak, touchStreak } from "./streak";
import { completeLesson, dailyGoalProgress, recordMistake, recordTask, resolveMistake } from "./progress";
import { createInitialProgress } from "./types";
import { daysBetween, toDayStamp } from "./day";

describe("gün damgası", () => {
  it("yerel tarihi YYYY-MM-DD olarak yazar", () => {
    expect(toDayStamp(new Date(2026, 8, 18))).toBe("2026-09-18");
  });

  it("ay sınırını doğru sayar", () => {
    expect(daysBetween("2026-08-31", "2026-09-01")).toBe(1);
    expect(daysBetween("2026-09-01", "2026-09-08")).toBe(7);
  });
});

describe("seri (streak)", () => {
  it("ilk gün 1'den başlar", () => {
    const s = touchStreak({ current: 0, best: 0, lastDay: null }, "2026-09-18");
    expect(s.current).toBe(1);
    expect(s.best).toBe(1);
  });

  it("ardışık günde artar", () => {
    const s = touchStreak({ current: 3, best: 3, lastDay: "2026-09-17" }, "2026-09-18");
    expect(s.current).toBe(4);
    expect(s.best).toBe(4);
  });

  it("aynı gün ikinci kez çalışmak seriyi değiştirmez", () => {
    const before = { current: 4, best: 9, lastDay: "2026-09-18" };
    expect(touchStreak(before, "2026-09-18")).toBe(before);
  });

  it("gün atlanınca 1'e döner ama rekor korunur", () => {
    const s = touchStreak({ current: 6, best: 6, lastDay: "2026-09-15" }, "2026-09-18");
    expect(s.current).toBe(1);
    expect(s.best).toBe(6);
  });

  it("dün çalışıldıysa seri hâlâ görünür, daha eskiyse görünmez", () => {
    const s = { current: 5, best: 5, lastDay: "2026-09-17" };
    expect(displayedStreak(s, "2026-09-18")).toBe(5);
    expect(displayedStreak(s, "2026-09-20")).toBe(0);
  });
});

describe("puan", () => {
  it("A1 aşaması puan vermez (kırmızı çizgi: keşif puanlanmaz)", () => {
    const s = recordTask(createInitialProgress(), {
      stage: "A1",
      correct: true,
      outcomeCode: "MAT.5.2.1",
      componentCode: "a",
    });
    expect(s.points).toBe(0);
  });

  it("A3 doğru cevap puan verir, yanlış vermez", () => {
    const base = createInitialProgress();
    const ok = recordTask(base, { stage: "A3", correct: true, outcomeCode: "MAT.5.2.1", componentCode: "ç" });
    const no = recordTask(base, { stage: "A3", correct: false, outcomeCode: "MAT.5.2.1", componentCode: "ç" });
    expect(ok.points).toBe(10);
    expect(no.points).toBe(0);
  });

  it("aynı bileşen iki kez kanıtlanmış sayılmaz", () => {
    let s = createInitialProgress();
    s = recordTask(s, { stage: "A2", correct: true, outcomeCode: "MAT.5.2.1", componentCode: "c" });
    s = recordTask(s, { stage: "A2", correct: true, outcomeCode: "MAT.5.2.1", componentCode: "c" });
    expect(s.provenComponents).toEqual(["MAT.5.2.1:c"]);
  });
});

describe("konu tamamlama", () => {
  it("bonus verir, günlük hedefi ilerletir, seriyi işler", () => {
    const s = completeLesson(createInitialProgress(5), "MAT.5.2.1", "2026-09-18");
    expect(s.points).toBe(20);
    expect(dailyGoalProgress(s, "2026-09-18")).toEqual({ completed: 1, target: 5 });
    expect(s.streak.current).toBe(1);
    expect(s.badges).toContain("ilk-adim");
  });

  it("günlük hedef ertesi gün sıfırdan sayılır", () => {
    const s = completeLesson(createInitialProgress(5), "MAT.5.2.1", "2026-09-18");
    expect(dailyGoalProgress(s, "2026-09-19").completed).toBe(0);
  });

  it("alan ve çevre birlikte bitince Harita Kâşifi rozeti açılır", () => {
    let s = completeLesson(createInitialProgress(), "MAT.5.4.1", "2026-09-18");
    expect(s.badges).not.toContain("harita-kasifi");
    s = completeLesson(s, "MAT.5.4.2", "2026-09-18");
    expect(s.badges).toContain("harita-kasifi");
  });
});

describe("hata kitapçığı", () => {
  const entry = {
    taskId: "5.2.1-a3-1",
    outcomeCode: "MAT.5.2.1",
    componentCode: "ç",
    prompt: "x + 12 = 20. x kaç?",
    given: "9",
    expected: "8",
    day: "2026-09-18",
  };

  it("kayıt ekler ve aynı görevi çoğaltmaz", () => {
    let s = recordMistake(createInitialProgress(), entry);
    s = recordMistake(s, { ...entry, given: "7" });
    expect(s.mistakes).toHaveLength(1);
    expect(s.mistakes[0]?.given).toBe("7");
  });

  it("tekrar çözülünce kayıt silinmez, kapanır ve rozet açılır", () => {
    let s = recordMistake(createInitialProgress(), entry);
    s = resolveMistake(s, entry.taskId);
    expect(s.mistakes).toHaveLength(1);
    expect(s.mistakes[0]?.resolved).toBe(true);
    expect(s.badges).toContain("hatasini-duzelten");
  });
});
