"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { BalanceTaskLike, GameCompletion } from "./types";

const sum = (tokens: BalanceTaskLike["setup"]["left"]) => tokens.reduce((total, t) => total + t.value, 0);

/**
 * "Yankı Kapısı" — two chambers that must stay in sync. In A1 (no `answer`)
 * comparing is always a safe reveal, never a verdict (CLAUDE.md: A1 hata
 * risksiz). In A2/A3/Assessment (`answer` set) the child solves for the
 * unknown token.
 */
export function BalanceGame({ task, onComplete }: { task: BalanceTaskLike; onComplete: (r: GameCompletion) => void }) {
  const { left, right, mirrorMode, answer } = task.setup;
  const [guess, setGuess] = useState("");
  const [phase, setPhase] = useState<"idle" | "revealed" | "wrong">("idle");
  const [hintUsed, setHintUsed] = useState(false);
  const [hintShown, setHintShown] = useState(false);

  const isExploration = answer === undefined;
  const balanced = sum(left) === sum(right);

  function compare() {
    setPhase("revealed");
    onComplete({ correct: true, hintUsed: false });
  }

  function submitGuess() {
    const n = Number(guess);
    const correct = !Number.isNaN(n) && n === answer;
    setPhase(correct ? "revealed" : "wrong");
    onComplete({ correct, hintUsed });
  }

  function requestHint() {
    setHintShown(true);
    setHintUsed(true);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, alignItems: "center" }}>
      <p style={{ maxWidth: "48ch", textAlign: "center", fontSize: "1.05rem" }}>{task.prompt}</p>

      <motion.div
        style={{
          display: "flex",
          gap: 28,
          alignItems: "center",
          perspective: 700,
        }}
      >
        <Chamber tokens={left} tilt={phase === "revealed" && !isExploration ? (balanced ? 0 : -6) : 0} />
        <motion.div
          animate={phase === "revealed" ? { scale: [1, 1.15, 1] } : {}}
          transition={{ duration: 0.5 }}
          style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "1.4rem", color: "var(--primary, #7c3aed)" }}
        >
          {mirrorMode ? "⇄" : "="}
        </motion.div>
        <Chamber tokens={right} tilt={phase === "revealed" && !isExploration ? (balanced ? 0 : 6) : 0} />
      </motion.div>

      {mirrorMode && phase === "idle" && (
        <p style={{ fontSize: "0.85rem", color: "var(--accent, #f97316)" }}>Yankı Eldiveni takılı — bir tarafa yaptığın her şey diğerine de uygulanıyor.</p>
      )}

      {isExploration ? (
        phase === "idle" ? (
          <button type="button" onClick={compare} className="game-primary-btn">
            Kefeleri Karşılaştır
          </button>
        ) : (
          <p style={{ fontWeight: 600 }}>{balanced ? "Dengede! İki taraf da eşit." : "Şu an dengede değil — fark bu yüzden."}</p>
        )
      ) : phase === "idle" || phase === "wrong" ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "center" }}>
          {phase === "wrong" && <p style={{ color: "var(--danger, #ef4444)" }}>Henüz dengede değil, tekrar dene.</p>}
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <label htmlFor="balance-guess">x =</label>
            <input
              id="balance-guess"
              inputMode="numeric"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              style={{ width: "5ch", fontSize: "1.1rem", padding: "4px 8px" }}
            />
            <button type="button" onClick={submitGuess} className="game-primary-btn">
              Kontrol Et
            </button>
          </div>
          {task.hints && task.hints.length > 0 && !hintShown && (
            <button type="button" onClick={requestHint} className="game-hint-btn">
              İpucu iste
            </button>
          )}
          {hintShown && <p style={{ fontSize: "0.9rem", fontStyle: "italic" }}>{task.hints?.[0]}</p>}
        </div>
      ) : (
        <p style={{ fontWeight: 600, color: "var(--primary, #7c3aed)" }}>Doğru — x = {answer}. Dengede!</p>
      )}
    </div>
  );
}

function Chamber({ tokens, tilt }: { tokens: BalanceTaskLike["setup"]["left"]; tilt: number }) {
  return (
    <motion.div
      animate={{ rotateZ: tilt }}
      transition={{ type: "spring", stiffness: 120, damping: 10 }}
      style={{
        display: "flex",
        gap: 8,
        padding: "16px 20px",
        borderRadius: 10,
        border: "1px solid var(--border, rgba(43,42,31,0.18))",
        background: "var(--paper-raised, #f5eeda)",
        minWidth: 110,
        justifyContent: "center",
        transformStyle: "preserve-3d",
      }}
    >
      {tokens.map((t, i) => (
        <span
          key={i}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 36,
            height: 36,
            borderRadius: 8,
            fontFamily: "var(--font-mono, monospace)",
            fontWeight: 700,
            background: t.kind === "unknown" ? "var(--accent, #f97316)" : "var(--primary, #7c3aed)",
            color: "var(--paper, #ece3cc)",
          }}
        >
          {t.kind === "unknown" ? "?" : t.label}
        </span>
      ))}
    </motion.div>
  );
}
