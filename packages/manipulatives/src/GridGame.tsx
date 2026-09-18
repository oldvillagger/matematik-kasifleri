"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { GameCompletion, GridTaskLike } from "./types";

const CELL = 22;

/**
 * "Harita Kâşifi" — build a rectangular plot with width/height steppers
 * (click/tap only, no drag required). Area and perimeter update live.
 * goal="explore" (A1) always completes on "Bitti" — risk-free. goal="area"
 * checks area===answer; goal="perimeter" checks 2*(w+h)===givenPerimeter.
 */
export function GridGame({ task, onComplete }: { task: GridTaskLike; onComplete: (r: GameCompletion) => void }) {
  const { maxCols, maxRows, goal, givenPerimeter, answer } = task.setup;
  const [cols, setCols] = useState(Math.min(3, maxCols));
  const [rows, setRows] = useState(Math.min(2, maxRows));
  const [phase, setPhase] = useState<"idle" | "correct" | "wrong">("idle");
  const [hintUsed, setHintUsed] = useState(false);
  const [hintShown, setHintShown] = useState(false);

  const area = cols * rows;
  const perimeter = 2 * (cols + rows);

  function submit() {
    if (goal === "explore") {
      onComplete({ correct: true, hintUsed: false });
      setPhase("correct");
      return;
    }
    const correct = goal === "area" ? area === answer : perimeter === givenPerimeter;
    setPhase(correct ? "correct" : "wrong");
    onComplete({ correct, hintUsed });
  }

  function requestHint() {
    setHintShown(true);
    setHintUsed(true);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "center" }}>
      <p style={{ maxWidth: "48ch", textAlign: "center", fontSize: "1.05rem" }}>{task.prompt}</p>

      <div style={{ display: "flex", gap: 24, alignItems: "flex-end" }}>
        <Stepper label="Genişlik" value={cols} min={1} max={maxCols} onChange={setCols} />
        <Stepper label="Yükseklik" value={rows} min={1} max={maxRows} onChange={setRows} />
      </div>

      <motion.svg
        width={maxCols * CELL + 4}
        height={maxRows * CELL + 4}
        style={{ background: "var(--paper-raised, #f5eeda)", borderRadius: 8, border: "1px solid var(--border, rgba(43,42,31,0.18))" }}
      >
        {Array.from({ length: rows }).map((_, r) =>
          Array.from({ length: cols }).map((_, c) => (
            <motion.rect
              key={`${r}-${c}`}
              x={c * CELL + 2}
              y={r * CELL + 2}
              width={CELL - 2}
              height={CELL - 2}
              rx={3}
              fill="var(--primary, #7c3aed)"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.15, delay: (r * cols + c) * 0.01 }}
            />
          )),
        )}
      </motion.svg>

      <p style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.92rem" }}>
        Alan: {area} birim kare &nbsp;·&nbsp; Çevre: {perimeter} birim
        {goal === "perimeter" && givenPerimeter !== undefined && <> &nbsp;·&nbsp; hedef çevre: {givenPerimeter}</>}
        {goal === "area" && answer !== undefined && <> &nbsp;·&nbsp; hedef alan: {answer}</>}
      </p>

      {phase === "idle" || phase === "wrong" ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}>
          {phase === "wrong" && <p style={{ color: "var(--danger, #ef4444)" }}>Henüz olmadı, ölçüleri değiştirip tekrar dene.</p>}
          <button type="button" onClick={submit} className="game-primary-btn">
            {goal === "explore" ? "Bitti" : "Kontrol Et"}
          </button>
          {goal !== "explore" && task.hints && task.hints.length > 0 && !hintShown && (
            <button type="button" onClick={requestHint} className="game-hint-btn">
              İpucu iste
            </button>
          )}
          {hintShown && <p style={{ fontSize: "0.9rem", fontStyle: "italic" }}>{task.hints?.[0]}</p>}
        </div>
      ) : (
        <p style={{ fontWeight: 600, color: "var(--primary, #7c3aed)" }}>
          {goal === "explore" ? "Keşif tamam." : "Doğru!"}
        </p>
      )}
    </div>
  );
}

function Stepper({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (n: number) => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      <span style={{ fontSize: "0.8rem", color: "var(--ink-muted, #4a4455)" }}>{label}</span>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <button type="button" aria-label={`${label} azalt`} className="game-step-btn" onClick={() => onChange(Math.max(min, value - 1))}>
          −
        </button>
        <span style={{ minWidth: "2ch", textAlign: "center", fontFamily: "var(--font-mono, monospace)" }}>{value}</span>
        <button type="button" aria-label={`${label} artır`} className="game-step-btn" onClick={() => onChange(Math.min(max, value + 1))}>
          +
        </button>
      </div>
    </div>
  );
}
