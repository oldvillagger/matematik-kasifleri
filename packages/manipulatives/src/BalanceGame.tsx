"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Visual, visualWeight } from "./Visual";
import { AnswerPad, HintCard, Prompt, SoftResult } from "./shell";
import type { BalanceTaskLike, GameProps } from "./types";

const sum = (tokens: BalanceTaskLike["setup"]["left"]) => tokens.reduce((total, t) => total + t.value, 0);
const visualSum = (tokens: BalanceTaskLike["setup"]["left"]) =>
  tokens.reduce((total, t) => total + (t.visual ? visualWeight(t.visual) : 0), 0);

/**
 * "Yankı Kapısı" — iki kefe dengede kalmalı.
 *
 * A1 (Keşfet): EKRANDA HİÇ RAKAM YOK. Çocuk şekilleri görür, "hangi taraf
 * ağır?" diye tahmin eder, kefeler gerçekten eğilir. Doğru/yanlış yok —
 * karşılaştırma bir hüküm değil, bir keşif. (CLAUDE.md kırmızı çizgi + K14.)
 *
 * A2 (Bağla): sayılar girer. Yanlış cevapta kırmızı uyarı YOK — sistem
 * otomatik olarak ipucunu açar ("burda hata yoktur, tip verir sistem").
 *
 * A3/ASSESSMENT: sayılarla, ipucusuz, ama yine kaygı dili olmadan.
 */
export function BalanceGame({ task, stage, onComplete }: GameProps<BalanceTaskLike>) {
  const { left, right, mirrorMode, answer } = task.setup;
  const [guess, setGuess] = useState("");
  const [phase, setPhase] = useState<"idle" | "revealed" | "retry">("idle");
  const [hintUsed, setHintUsed] = useState(false);
  const [hintShown, setHintShown] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const isA1 = stage === "A1";
  const heavierLeft = isA1 ? visualSum(left) > visualSum(right) : sum(left) > sum(right);
  const balanced = isA1 ? visualSum(left) === visualSum(right) : sum(left) === sum(right);
  const tilt = phase === "revealed" ? (balanced ? 0 : heavierLeft ? 6 : -6) : 0;

  function compare() {
    setPhase("revealed");
    onComplete({ correct: true, hintUsed: false });
  }

  function submitGuess() {
    const n = Number(guess.trim());
    const correct = guess.trim() !== "" && !Number.isNaN(n) && n === answer;
    setAttempts((a) => a + 1);
    if (correct) {
      setPhase("revealed");
    } else {
      setPhase("retry");
      // A2: hata değil, yönlendirme — ipucu kendiliğinden açılır.
      if (stage === "A2" && task.hints && task.hints.length > 0) {
        setHintShown(true);
        setHintUsed(true);
      }
    }
    onComplete({ correct, hintUsed, given: guess.trim(), expected: String(answer ?? "") });
  }

  function requestHint() {
    setHintShown(true);
    setHintUsed(true);
  }

  return (
    <div className="flex flex-col items-center gap-space-md w-full">
      <Prompt text={task.prompt} />

      <motion.div
        animate={{ rotateZ: tilt * 0.35 }}
        transition={{ type: "spring", stiffness: 90, damping: 11 }}
        className="flex items-center gap-space-md"
        style={{ perspective: 700 }}
      >
        <Chamber tokens={left} tilt={tilt} isA1={isA1} side="Sol" />
        <motion.div
          animate={phase === "revealed" ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 0.5 }}
          className="font-headline-lg text-headline-lg text-primary select-none"
        >
          {mirrorMode ? "⇄" : "="}
        </motion.div>
        <Chamber tokens={right} tilt={-tilt} isA1={isA1} side="Sağ" />
      </motion.div>

      {mirrorMode && phase === "idle" && (
        <p className="font-body-sm text-body-sm text-on-secondary-fixed bg-secondary-fixed/40 px-space-sm py-1.5 rounded-full">
          Yankı Eldiveni takılı — bir tarafa yaptığın her şey diğerine de uygulanıyor.
        </p>
      )}

      {isA1 ? (
        phase === "idle" ? (
          <button
            type="button"
            onClick={compare}
            className="py-3 px-space-lg rounded-full bg-primary text-on-primary font-label-lg text-label-lg shadow-md hover:bg-primary-container transition-all btn-tactile"
          >
            Kefeleri Karşılaştır
          </button>
        ) : (
          <SoftResult
            tone="neutral"
            icon={balanced ? "balance" : "swap_vert"}
            text={
              balanced
                ? "İki taraf da aynı ağırlıkta — kapı dengede kaldı."
                : `${heavierLeft ? "Sol" : "Sağ"} taraf daha ağır bastı, kapı o yana eğildi.`
            }
          />
        )
      ) : phase === "revealed" ? (
        <SoftResult tone="success" icon="check_circle" text={`Dengede! x = ${answer}.`} />
      ) : (
        <div className="flex flex-col items-center gap-space-sm w-full max-w-md">
          {phase === "retry" && (
            <SoftResult
              tone="neutral"
              icon="visibility"
              text={
                stage === "A2"
                  ? "Bu sefer olmadı — birlikte bakalım."
                  : `Bu sefer olmadı. ${attempts >= 2 ? "İstersen kefelere bir daha bak." : "Tekrar dene."}`
              }
            />
          )}
          {hintShown && task.hints?.[0] && <HintCard text={task.hints[0]} />}
          <AnswerPad
            label="x ="
            value={guess}
            onChange={setGuess}
            onSubmit={submitGuess}
            onHint={stage === "A2" && !hintShown && (task.hints?.length ?? 0) > 0 ? requestHint : undefined}
          />
        </div>
      )}
    </div>
  );
}

function Chamber({
  tokens,
  tilt,
  isA1,
  side,
}: {
  tokens: BalanceTaskLike["setup"]["left"];
  tilt: number;
  isA1: boolean;
  side: string;
}) {
  return (
    <motion.div
      animate={{ rotateZ: tilt, y: tilt * 1.5 }}
      transition={{ type: "spring", stiffness: 120, damping: 10 }}
      aria-label={`${side} kefe`}
      className="flex items-center justify-center gap-space-xs p-space-sm min-w-[8rem] min-h-[6rem] rounded-xl bg-surface-container-low shadow-inner"
      style={{ transformStyle: "preserve-3d" }}
    >
      {tokens.map((t, i) =>
        isA1 && t.visual ? (
          <Visual key={i} spec={t.visual} />
        ) : (
          <span
            key={i}
            className={`inline-flex items-center justify-center w-11 h-11 rounded-xl font-headline-md text-headline-md shadow-sm ${
              t.kind === "unknown" ? "bg-secondary-container text-on-secondary-container" : "bg-primary text-on-primary"
            }`}
          >
            {t.kind === "unknown" ? "x" : t.label}
          </span>
        ),
      )}
    </motion.div>
  );
}
