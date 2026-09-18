"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  completeLesson,
  createInitialProgress,
  recordMistake,
  recordTask,
  resolveMistake,
  toDayStamp,
  type MistakeEntry,
  type ProgressState,
  type ProgressionSettings,
  type TaskOutcome,
} from "@matematik-kasifleri/progression";

const STORAGE_KEY = "mk.progress.v1";

interface ProgressContextValue {
  state: ProgressState;
  settings: ProgressionSettings;
  today: string;
  /** İlk render'da localStorage okunmamış olur; hidrasyon farkını önlemek için. */
  hydrated: boolean;
  onTask: (outcome: TaskOutcome) => void;
  onLessonComplete: (outcomeCode: string) => void;
  onMistake: (entry: Omit<MistakeEntry, "resolved" | "day">) => void;
  onMistakeResolved: (taskId: string) => void;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({
  settings,
  children,
}: {
  settings: ProgressionSettings;
  children: React.ReactNode;
}) {
  const [state, setState] = useState<ProgressState>(() => createInitialProgress(settings.dailyGoalTarget));
  const [hydrated, setHydrated] = useState(false);
  const [today, setToday] = useState(() => toDayStamp(new Date()));

  useEffect(() => {
    setToday(toDayStamp(new Date()));
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as ProgressState;
        setState({ ...createInitialProgress(settings.dailyGoalTarget), ...parsed });
      }
    } catch {
      /* özel sekme / kapalı depolama: varsayılanla devam et */
    }
    setHydrated(true);
  }, [settings.dailyGoalTarget]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* yazılamıyorsa oturum içi çalışmaya devam eder */
    }
  }, [state, hydrated]);

  const onTask = useCallback((outcome: TaskOutcome) => setState((s) => recordTask(s, outcome)), []);

  const onLessonComplete = useCallback(
    (outcomeCode: string) => setState((s) => completeLesson(s, outcomeCode, toDayStamp(new Date()))),
    [],
  );

  const onMistake = useCallback(
    (entry: Omit<MistakeEntry, "resolved" | "day">) =>
      setState((s) => recordMistake(s, { ...entry, day: toDayStamp(new Date()) })),
    [],
  );

  const onMistakeResolved = useCallback((taskId: string) => setState((s) => resolveMistake(s, taskId)), []);

  const value = useMemo<ProgressContextValue>(
    () => ({ state, settings, today, hydrated, onTask, onLessonComplete, onMistake, onMistakeResolved }),
    [state, settings, today, hydrated, onTask, onLessonComplete, onMistake, onMistakeResolved],
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress, ProgressProvider içinde kullanılmalı.");
  return ctx;
}
