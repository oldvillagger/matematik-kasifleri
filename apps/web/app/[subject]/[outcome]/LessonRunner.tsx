"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { advanceStage, createInitialState, provenComponents, recordTaskResult } from "@matematik-kasifleri/engine-core";
import type { EngineState, Stage } from "@matematik-kasifleri/engine-core";
import { BalanceGame, GridGame, PatternGame } from "@matematik-kasifleri/manipulatives";
import type { LessonFile } from "@matematik-kasifleri/content-schema";

const STAGE_LABEL: Record<Stage, string> = {
  A1: "Keşfet",
  A2: "Bağla",
  A3: "Geri Çağır",
  ASSESSMENT: "Konu Sonu Görevi",
};

export function LessonRunner({
  outcomeCode,
  outcomeTitle,
  allComponentCodes,
  lesson,
  backHref,
}: {
  outcomeCode: string;
  outcomeTitle: string;
  allComponentCodes: string[];
  lesson: LessonFile;
  backHref: string;
}) {
  const [engine, setEngine] = useState<EngineState>(() => createInitialState());
  const [taskIndex, setTaskIndex] = useState(0);
  const [done, setDone] = useState(false);

  const stageTasks = useMemo(() => {
    if (engine.stage === "ASSESSMENT") return lesson.assessment.items;
    return lesson[engine.stage.toLowerCase() as "a1" | "a2" | "a3"];
  }, [engine.stage, lesson]);

  const currentTask = stageTasks[taskIndex];

  function handleComplete(result: { correct: boolean; hintUsed: boolean }) {
    if (!currentTask) return;
    const next = recordTaskResult(engine, {
      outcomeCode,
      componentCode: currentTask.componentCode,
      taskId: currentTask.id,
      correct: result.correct,
      hintUsed: result.hintUsed,
    });
    setEngine(next);
  }

  function goNext() {
    if (taskIndex + 1 < stageTasks.length) {
      setTaskIndex((i) => i + 1);
      return;
    }
    if (engine.stage === "ASSESSMENT") {
      setDone(true);
      return;
    }
    setEngine((s) => advanceStage(s));
    setTaskIndex(0);
  }

  if (done) {
    const proven = provenComponents(engine.evidence, outcomeCode);
    return (
      <main className="shell">
        <Link href={backHref} className="back-link">
          ← Konulara dön
        </Link>
        <header className="hero" style={{ paddingBlockStart: 0 }}>
          <h1>Tamamlandı — {outcomeTitle}</h1>
          <p>İşte kanıtladığın şeyler:</p>
        </header>
        <ul className="evidence-list">
          {allComponentCodes.map((code) => (
            <li key={code} className={proven.has(code) ? "evidence-item evidence-item--proven" : "evidence-item"}>
              <span className="evidence-item__code">{code}</span>
              <span>{proven.has(code) ? "kanıtlandı" : "henüz kanıtlanmadı"}</span>
            </li>
          ))}
        </ul>
      </main>
    );
  }

  if (!currentTask) {
    return (
      <main className="shell">
        <p>Bu aşamada içerik bulunamadı.</p>
      </main>
    );
  }

  return (
    <main className="shell">
      <Link href={backHref} className="back-link">
        ← Konulara dön
      </Link>

      <div className="lesson-progress">
        <span className="lesson-progress__stage">{STAGE_LABEL[engine.stage]}</span>
        <span className="lesson-progress__count">
          {taskIndex + 1} / {stageTasks.length}
        </span>
        {engine.stage === "A2" && (
          <div className="support-meter" title="Destek seviyesi">
            <div className="support-meter__fill" style={{ width: `${engine.support.value * 100}%` }} />
          </div>
        )}
      </div>

      <div className="game-stage" key={currentTask.id}>
        {currentTask.game === "balance" && <BalanceGame task={currentTask} onComplete={handleComplete} />}
        {currentTask.game === "grid" && <GridGame task={currentTask} onComplete={handleComplete} />}
        {currentTask.game === "pattern" && (
          <PatternGame task={currentTask} isExploration={engine.stage === "A1"} onComplete={handleComplete} />
        )}
      </div>

      <div className="lesson-next">
        <button type="button" className="game-primary-btn" onClick={goNext}>
          {taskIndex + 1 < stageTasks.length ? "Sırada" : engine.stage === "ASSESSMENT" ? "Bitir" : "Sonraki aşama"}
        </button>
      </div>
    </main>
  );
}
