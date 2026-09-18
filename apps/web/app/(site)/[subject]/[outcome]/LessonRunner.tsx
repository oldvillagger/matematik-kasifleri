"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { advanceStage, createInitialState, provenComponents, recordTaskResult } from "@matematik-kasifleri/engine-core";
import type { EngineState, Stage } from "@matematik-kasifleri/engine-core";
import { BalanceGame, GridGame, PatternGame } from "@matematik-kasifleri/manipulatives";
import type { GameCompletion } from "@matematik-kasifleri/manipulatives";
import type { LessonFile } from "@matematik-kasifleri/content-schema";
import { useProgress } from "../../../lib/ProgressProvider";
import { TestScreen, type SyllabusStep } from "./TestScreen";

/**
 * Üç FAZ — kullanıcının tarif ettiği akış:
 *   Faz 1 "Keşfet"  (A1)              → sayı yok, sadece görsel/materyal
 *   Faz 2 "Bağla"   (A2)              → sayılar girer, yanlış yok, sistem ipucu verir
 *   Faz 3 "Gerçek Teste Hazırlık" (A3 + ASSESSMENT) → Stitch test ekranı
 *
 * A1 ve A2 ekranlarında puan/seri GÖSTERİLMEZ (kırmızı çizgi korundu);
 * puan yalnızca Faz 3'te soru rozetinde ve üst barda görünür.
 */

const PHASES = [
  { key: 1, label: "Keşfet", icon: "toys", hint: "Sayı yok — elinle dene" },
  { key: 2, label: "Bağla", icon: "link", hint: "Sayılar girer — ipucu var" },
  { key: 3, label: "Gerçek Teste Hazırlık", icon: "quiz", hint: "Test ekranı — süre yok" },
] as const;

const phaseOf = (stage: Stage): 1 | 2 | 3 => (stage === "A1" ? 1 : stage === "A2" ? 2 : 3);
const POINTS: Record<Stage, number> = { A1: 0, A2: 5, A3: 10, ASSESSMENT: 10 };

export function LessonRunner({
  outcomeCode,
  outcomeTitle,
  outcomeStatement,
  allComponentCodes,
  lesson,
  backHref,
}: {
  outcomeCode: string;
  outcomeTitle: string;
  outcomeStatement: string;
  allComponentCodes: string[];
  lesson: LessonFile;
  backHref: string;
}) {
  const { onTask, onLessonComplete, onMistake } = useProgress();
  const [engine, setEngine] = useState<EngineState>(() => createInitialState());
  const [taskIndex, setTaskIndex] = useState(0);
  const [answered, setAnswered] = useState<Record<number, boolean>>({});
  const [done, setDone] = useState(false);

  const stageTasks = useMemo(() => {
    if (engine.stage === "ASSESSMENT") return lesson.assessment.items;
    return lesson[engine.stage.toLowerCase() as "a1" | "a2" | "a3"];
  }, [engine.stage, lesson]);

  const currentTask = stageTasks[taskIndex];
  const phase = phaseOf(engine.stage);

  useEffect(() => {
    if (done) onLessonComplete(outcomeCode);
    // konu bir kez tamamlanır; done true olduğunda tek sefer çalışır
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  function handleComplete(result: GameCompletion) {
    if (!currentTask) return;

    setEngine((s) =>
      recordTaskResult(s, {
        outcomeCode,
        componentCode: currentTask.componentCode,
        taskId: currentTask.id,
        correct: result.correct,
        hintUsed: result.hintUsed,
      }),
    );
    setAnswered((a) => ({ ...a, [taskIndex]: true }));

    onTask({
      stage: engine.stage,
      correct: result.correct,
      outcomeCode,
      componentCode: currentTask.componentCode,
    });

    // Hata kitapçığı yalnızca Faz 3'te dolar: Keşfet ve Bağla'da "hata" kavramı yok.
    if (!result.correct && (engine.stage === "A3" || engine.stage === "ASSESSMENT")) {
      onMistake({
        taskId: currentTask.id,
        outcomeCode,
        componentCode: currentTask.componentCode,
        prompt: currentTask.prompt,
        given: result.given ?? "—",
        expected: result.expected ?? "—",
      });
    }
  }

  function goNextTask() {
    if (taskIndex + 1 < stageTasks.length) {
      setTaskIndex((i) => i + 1);
      return;
    }
    finishStage();
  }

  function finishStage() {
    if (engine.stage === "ASSESSMENT") {
      setDone(true);
      return;
    }
    setEngine((s) => advanceStage(s));
    setTaskIndex(0);
    setAnswered({});
  }

  if (done) {
    return (
      <EvidenceSummary
        engine={engine}
        outcomeCode={outcomeCode}
        outcomeTitle={outcomeTitle}
        allComponentCodes={allComponentCodes}
        backHref={backHref}
      />
    );
  }

  if (!currentTask) {
    return (
      <main className="w-full pt-20 px-gutter">
        <p className="font-body-md text-body-md text-on-surface-variant py-space-xl">
          Bu aşamada içerik bulunamadı.
        </p>
      </main>
    );
  }

  const game = (
    <GameSurface task={currentTask} stage={engine.stage} onComplete={handleComplete} />
  );

  // ——— FAZ 3: Stitch test ekranı ———
  if (phase === 3) {
    const syllabus: SyllabusStep[] = [
      { label: "Keşfet", meta: `${lesson.a1.length} görev • materyal`, state: "done" },
      { label: "Bağla", meta: `${lesson.a2.length} görev • ipuçlu`, state: "done" },
      {
        label: "Alıştırma Turu",
        meta: `${lesson.a3.length} soru`,
        state: engine.stage === "A3" ? "active" : "done",
      },
      {
        label: "Konu Sonu Testi",
        meta: `${lesson.assessment.items.length} soru`,
        state: engine.stage === "ASSESSMENT" ? "active" : "todo",
      },
    ];

    return (
      <TestScreen
        stage={engine.stage}
        title={outcomeTitle}
        outcomeCode={outcomeCode}
        backHref={backHref}
        total={stageTasks.length}
        index={taskIndex}
        answered={answered}
        pointsPerItem={POINTS[engine.stage]}
        syllabus={syllabus}
        onSelect={(i) => setTaskIndex(Math.max(0, Math.min(stageTasks.length - 1, i)))}
        onFinish={finishStage}
      >
        {game}
      </TestScreen>
    );
  }

  // ——— FAZ 1 & 2: temiz keşif tuvali ———
  return (
    <main className="w-full pt-20 px-gutter bg-background pb-space-xl">
      <div className="max-w-4xl mx-auto flex flex-col gap-space-md">
        <div className="flex items-center justify-between py-space-sm gap-space-sm">
          <Link
            className="inline-flex items-center gap-1 text-primary hover:text-primary-container transition-colors font-label-md text-label-md"
            href={backHref}
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span>Üniteler</span>
          </Link>
          <span className="font-label-sm text-label-sm text-on-surface-variant truncate">{outcomeCode}</span>
        </div>

        <PhaseRail current={phase} />

        <div className="bg-surface-container-lowest rounded-3xl shadow-md p-space-md lg:p-space-lg flex flex-col items-center gap-space-md">
          <div className="w-full flex items-center justify-between gap-space-sm">
            <div className="min-w-0">
              <h1 className="font-headline-md text-headline-md text-on-surface truncate">{outcomeTitle}</h1>
              <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">{outcomeStatement}</p>
            </div>
            <span className="shrink-0 px-space-sm py-1.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm tabular-nums">
              {taskIndex + 1} / {stageTasks.length}
            </span>
          </div>

          <div className="w-full h-2 rounded-full bg-surface-container-high overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${((taskIndex + (answered[taskIndex] ? 1 : 0)) / stageTasks.length) * 100}%` }}
            />
          </div>

          <div className="w-full py-space-md" key={currentTask.id}>
            {game}
          </div>

          <button
            type="button"
            onClick={goNextTask}
            disabled={!answered[taskIndex]}
            className="py-3 px-space-lg rounded-full bg-primary text-on-primary font-label-lg text-label-lg shadow-md hover:bg-primary-container transition-all disabled:opacity-40 disabled:shadow-none flex items-center gap-2"
          >
            {taskIndex + 1 < stageTasks.length ? "Sıradaki Görev" : "Sonraki Aşamaya Geç"}
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
          {!answered[taskIndex] && (
            <p className="font-label-sm text-label-sm text-on-surface-variant">
              Görevi denedikten sonra ilerleyebilirsin.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}

function PhaseRail({ current }: { current: 1 | 2 | 3 }) {
  return (
    <ol className="flex flex-col sm:flex-row items-stretch gap-space-xs">
      {PHASES.map((p) => {
        const state = p.key < current ? "done" : p.key === current ? "active" : "todo";
        return (
          <li
            key={p.key}
            aria-current={state === "active" ? "step" : undefined}
            className={`flex-1 flex items-center gap-space-sm p-space-sm rounded-2xl transition-all ${
              state === "active"
                ? "bg-primary text-on-primary shadow-md"
                : state === "done"
                  ? "bg-tertiary-fixed/60 text-on-tertiary-fixed"
                  : "bg-surface-container-low text-on-surface-variant"
            }`}
          >
            <span
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                state === "active" ? "bg-on-primary/20" : "bg-surface-container-lowest/60"
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">
                {state === "done" ? "check" : p.icon}
              </span>
            </span>
            <span className="min-w-0">
              <span className="font-label-md text-label-md block truncate">
                Faz {p.key} — {p.label}
              </span>
              <span className="font-label-sm text-label-sm opacity-80 block truncate">{p.hint}</span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}

function GameSurface({
  task,
  stage,
  onComplete,
}: {
  task: LessonFile["a1"][number] | LessonFile["assessment"]["items"][number];
  stage: Stage;
  onComplete: (r: GameCompletion) => void;
}) {
  const hints = "hints" in task ? task.hints : [];

  if (task.game === "balance") {
    return <BalanceGame task={{ ...task, hints }} stage={stage} onComplete={onComplete} />;
  }
  if (task.game === "grid") {
    return <GridGame task={{ ...task, hints }} stage={stage} onComplete={onComplete} />;
  }
  return <PatternGame task={{ ...task, hints }} stage={stage} onComplete={onComplete} />;
}

function EvidenceSummary({
  engine,
  outcomeCode,
  outcomeTitle,
  allComponentCodes,
  backHref,
}: {
  engine: EngineState;
  outcomeCode: string;
  outcomeTitle: string;
  allComponentCodes: string[];
  backHref: string;
}) {
  const proven = provenComponents(engine.evidence, outcomeCode);
  const pct = Math.round((proven.size / Math.max(1, allComponentCodes.length)) * 100);

  return (
    <main className="w-full pt-20 px-gutter bg-background pb-space-xl">
      <div className="max-w-3xl mx-auto flex flex-col gap-space-md">
        <div className="py-space-sm">
          <Link
            className="inline-flex items-center gap-1 text-primary hover:text-primary-container transition-colors font-label-md text-label-md"
            href={backHref}
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span>Üniteler</span>
          </Link>
        </div>

        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary via-primary-container to-secondary p-space-lg text-on-primary shadow-xl">
          <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-surface-container-lowest/10 blur-2xl pointer-events-none" />
          <div className="relative z-10">
            <span className="inline-flex items-center gap-space-xs bg-surface-container-lowest/20 backdrop-blur-md px-space-sm py-1 rounded-full font-label-sm text-label-sm">
              <span className="material-symbols-outlined text-[16px]">workspace_premium</span>
              {outcomeCode}
            </span>
            <h1 className="font-display-lg text-display-lg-mobile mt-space-xs">Tamamladın — {outcomeTitle} 🎉</h1>
            <p className="font-body-lg text-body-lg text-inverse-on-surface opacity-95">
              Puanın arttı, ama asıl önemlisi şu: aşağıdaki becerileri <strong>kanıtladın</strong>.
            </p>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-md">
          <div className="flex items-center justify-between mb-space-sm">
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Kanıtladığın Süreç Bileşenleri</h2>
            <span className="font-label-md text-label-md text-primary tabular-nums">
              {proven.size} / {allComponentCodes.length} • %{pct}
            </span>
          </div>
          <div className="w-full h-3 rounded-full bg-surface-container-high overflow-hidden mb-space-md">
            <div className="h-full bg-tertiary rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
          </div>

          <ul className="flex flex-col gap-2">
            {allComponentCodes.map((code) => {
              const ok = proven.has(code);
              return (
                <li
                  key={code}
                  className={`flex items-center gap-space-sm p-space-sm rounded-xl ${
                    ok ? "bg-tertiary-fixed/40" : "bg-surface-container-low"
                  }`}
                >
                  <span
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-label-md text-label-md ${
                      ok ? "bg-tertiary-fixed text-on-tertiary-fixed" : "bg-surface-container-high text-on-surface-variant"
                    }`}
                  >
                    {code}
                  </span>
                  <span className="font-label-md text-label-md text-on-surface">
                    {ok ? "Kanıtlandı" : "Henüz kanıtlanmadı"}
                  </span>
                  <span className={`material-symbols-outlined ml-auto ${ok ? "text-tertiary icon-filled" : "text-outline"}`}>
                    {ok ? "verified" : "radio_button_unchecked"}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="flex flex-wrap gap-space-sm">
          <Link
            href={backHref}
            className="py-3 px-space-lg rounded-full bg-primary text-on-primary font-label-lg text-label-lg shadow-md hover:bg-primary-container transition-all"
          >
            Başka Bir Konuya Geç
          </Link>
          <Link
            href="/matematik/analiz"
            className="py-3 px-space-lg rounded-full bg-surface-container-high text-on-surface font-label-lg text-label-lg hover:bg-surface-container transition-all"
          >
            Karneme Bak
          </Link>
        </div>
      </div>
    </main>
  );
}
