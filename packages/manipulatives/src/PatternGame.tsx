"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { GameCompletion, PatternTaskLike } from "./types";

/**
 * "Örüntü Anahtarı" — shown terms + a choice row. In A1, picking any choice
 * always resolves to a gentle reveal (never a wrong buzzer); A2/A3/Assessment
 * check the pick against `answer`. `isExploration` is set by the caller
 * (stage === "A1"), not inferred here, since pattern tasks always carry an
 * answer for internal bookkeeping even during exploration.
 */
export function PatternGame({
  task,
  isExploration,
  onComplete,
}: {
  task: PatternTaskLike;
  isExploration: boolean;
  onComplete: (r: GameCompletion) => void;
}) {
  const { sequence, choices, answer } = task.setup;
  const [picked, setPicked] = useState<number | null>(null);
  const [hintUsed, setHintUsed] = useState(false);
  const [hintShown, setHintShown] = useState(false);

  function pick(value: number) {
    if (picked !== null) return;
    setPicked(value);
    const correct = isExploration || value === answer;
    onComplete({ correct, hintUsed });
  }

  function requestHint() {
    setHintShown(true);
    setHintUsed(true);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, alignItems: "center" }}>
      <p style={{ maxWidth: "48ch", textAlign: "center", fontSize: "1.05rem" }}>{task.prompt}</p>

      <div style={{ display: "flex", gap: 10, alignItems: "center", perspective: 600 }}>
        {sequence.map((n, i) => (
          <Tile key={i} value={n} accent="pine" />
        ))}
        <span style={{ fontSize: "1.4rem", color: "var(--accent, #f97316)" }}>?</span>
      </div>

      <div style={{ display: "flex", gap: 12 }}>
        {choices.map((c) => (
          <motion.button
            key={c}
            type="button"
            onClick={() => pick(c)}
            whileTap={{ scale: 0.92, rotateX: 10 }}
            style={{
              width: 56,
              height: 56,
              borderRadius: 10,
              fontFamily: "var(--font-mono, monospace)",
              fontSize: "1.1rem",
              fontWeight: 700,
              border: picked === c ? "2px solid var(--primary, #7c3aed)" : "1px solid var(--border-strong, rgba(43,42,31,0.32))",
              background: picked === c ? "var(--primary, #7c3aed)" : "var(--paper-raised, #f5eeda)",
              color: picked === c ? "var(--paper, #ece3cc)" : "inherit",
              cursor: picked === null ? "pointer" : "default",
            }}
            disabled={picked !== null}
          >
            {c}
          </motion.button>
        ))}
      </div>

      {picked !== null && (
        <AnimatePresence>
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ fontWeight: 600, color: isExploration || picked === answer ? "var(--primary, #7c3aed)" : "var(--danger, #ef4444)" }}
          >
            {isExploration ? `Kuralın devamı: ${answer}` : picked === answer ? "Doğru!" : `Bu sefer olmadı — doğrusu ${answer}.`}
          </motion.p>
        </AnimatePresence>
      )}

      {picked === null && !isExploration && task.hints && task.hints.length > 0 && !hintShown && (
        <button type="button" onClick={requestHint} className="game-hint-btn">
          İpucu iste
        </button>
      )}
      {hintShown && <p style={{ fontSize: "0.9rem", fontStyle: "italic" }}>{task.hints?.[0]}</p>}
    </div>
  );
}

function Tile({ value }: { value: number; accent: "pine" | "brass" }) {
  return (
    <motion.div
      whileHover={{ rotateY: 8 }}
      style={{
        width: 48,
        height: 48,
        borderRadius: 8,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-mono, monospace)",
        fontWeight: 700,
        background: "var(--primary, #7c3aed)",
        color: "var(--paper, #ece3cc)",
      }}
    >
      {value}
    </motion.div>
  );
}
