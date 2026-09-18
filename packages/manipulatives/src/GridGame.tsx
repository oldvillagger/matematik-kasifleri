"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AnswerPad, HintCard, Prompt, SoftResult } from "./shell";
import type { GameProps, GridTaskLike } from "./types";

const CELL = 26;

/**
 * "Harita Kâşifi" — dikdörtgen bir arsa kur.
 *
 * A1 (Keşfet): EKRANDA HİÇ SAYI YOK. Ne "Alan: 6 birim kare" yazısı, ne
 * genişlik/yükseklik sayacı. Çocuk + / − düğmeleriyle arsayı büyütüp
 * küçültür ve hedef çerçeveyi doldurmaya çalışır; geri bildirim tamamen
 * görsel (çerçeve dolunca yeşile döner).
 *
 * A2/A3/ASSESSMENT: ölçüler ve alan/çevre okumaları görünür, cevap sayıyla
 * verilir. A2'de yanlışta kırmızı uyarı yerine ipucu açılır.
 */
export function GridGame({ task, stage, onComplete }: GameProps<GridTaskLike>) {
  const { maxCols, maxRows, goal, givenPerimeter, answer, targetCols, targetRows } = task.setup;
  const [cols, setCols] = useState(1);
  const [rows, setRows] = useState(1);
  const [guess, setGuess] = useState("");
  const [phase, setPhase] = useState<"idle" | "correct" | "retry">("idle");
  const [hintUsed, setHintUsed] = useState(false);
  const [hintShown, setHintShown] = useState(false);

  const isA1 = stage === "A1";
  const area = cols * rows;
  const perimeter = 2 * (cols + rows);
  const fits = targetCols !== undefined && targetRows !== undefined && cols === targetCols && rows === targetRows;

  function finishExploration() {
    setPhase("correct");
    onComplete({ correct: true, hintUsed: false });
  }

  function submit() {
    const target = goal === "area" ? answer : goal === "perimeter" ? givenPerimeter : undefined;
    const n = Number(guess.trim());
    const correct = guess.trim() !== "" && !Number.isNaN(n) && n === target;
    if (correct) {
      setPhase("correct");
    } else {
      setPhase("retry");
      if (stage === "A2" && task.hints && task.hints.length > 0) {
        setHintShown(true);
        setHintUsed(true);
      }
    }
    onComplete({ correct, hintUsed, given: guess.trim(), expected: String(target ?? "") });
  }

  return (
    <div className="flex flex-col items-center gap-space-md w-full">
      <Prompt text={task.prompt} />

      <div className="flex items-end gap-space-lg">
        <Stepper label={isA1 ? "Daha geniş" : "Genişlik"} value={cols} min={1} max={maxCols} showValue={!isA1} onChange={setCols} />
        <Stepper label={isA1 ? "Daha uzun" : "Yükseklik"} value={rows} min={1} max={maxRows} showValue={!isA1} onChange={setRows} />
      </div>

      <svg
        width={maxCols * CELL + 6}
        height={maxRows * CELL + 6}
        className="rounded-xl bg-surface-container-low shadow-inner"
        role="img"
        aria-label={isA1 ? "Arsa çizimi" : `${cols} sütun ${rows} satır arsa`}
      >
        {/* Hedef çerçeve — A1'de sayı yerine bunu doldurmaya çalışır */}
        {targetCols !== undefined && targetRows !== undefined && (
          <rect
            x={3}
            y={3}
            width={targetCols * CELL}
            height={targetRows * CELL}
            rx={6}
            fill="none"
            stroke={fits ? "#005b3d" : "#7b7487"}
            strokeWidth={3}
            strokeDasharray="7 5"
          />
        )}
        {Array.from({ length: rows }).map((_, r) =>
          Array.from({ length: cols }).map((_, c) => (
            <motion.rect
              key={`${r}-${c}`}
              x={c * CELL + 5}
              y={r * CELL + 5}
              width={CELL - 4}
              height={CELL - 4}
              rx={4}
              fill={fits ? "#4edea3" : "#7c3aed"}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.15, delay: (r * cols + c) * 0.012 }}
            />
          )),
        )}
      </svg>

      {!isA1 && (
        <p className="font-label-md text-label-md text-on-surface-variant tabular-nums">
          Alan: {area} birim kare · Çevre: {perimeter} birim
        </p>
      )}

      {isA1 ? (
        phase === "idle" ? (
          <div className="flex flex-col items-center gap-space-xs">
            {fits && (
              <SoftResult tone="success" icon="check_circle" text="Arsa çerçeveyi tam doldurdu!" />
            )}
            <button
              type="button"
              onClick={finishExploration}
              className="py-3 px-space-lg rounded-full bg-primary text-on-primary font-label-lg text-label-lg shadow-md hover:bg-primary-container transition-all btn-tactile"
            >
              Keşfim Tamam
            </button>
          </div>
        ) : (
          <SoftResult tone="neutral" icon="explore" text="Arsanı kurdun. Aynı alanı başka ölçülerle de kurabilirdin." />
        )
      ) : phase === "correct" ? (
        <SoftResult
          tone="success"
          icon="check_circle"
          text={`Doğru — ${goal === "area" ? `alan ${answer} birim kare` : `çevre ${givenPerimeter} birim`}.`}
        />
      ) : (
        <div className="flex flex-col items-center gap-space-sm w-full max-w-md">
          {phase === "retry" && (
            <SoftResult tone="neutral" icon="visibility" text="Bu sefer olmadı — ölçüleri değiştirip bir daha bak." />
          )}
          {hintShown && task.hints?.[0] && <HintCard text={task.hints[0]} />}
          <AnswerPad
            label={goal === "area" ? "Alan =" : "Çevre ="}
            value={guess}
            onChange={setGuess}
            onSubmit={submit}
            onHint={stage === "A2" && !hintShown && (task.hints?.length ?? 0) > 0 ? () => {
              setHintShown(true);
              setHintUsed(true);
            } : undefined}
          />
        </div>
      )}
    </div>
  );
}

function Stepper({
  label,
  value,
  min,
  max,
  showValue,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  showValue: boolean;
  onChange: (n: number) => void;
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="font-label-sm text-label-sm text-on-surface-variant">{label}</span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label={`${label} azalt`}
          onClick={() => onChange(Math.max(min, value - 1))}
          className="w-11 h-11 rounded-xl bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors flex items-center justify-center"
        >
          <span className="material-symbols-outlined text-[22px]">remove</span>
        </button>
        {showValue && (
          <span className="min-w-[2ch] text-center font-headline-sm text-headline-sm text-on-surface tabular-nums">
            {value}
          </span>
        )}
        <button
          type="button"
          aria-label={`${label} artır`}
          onClick={() => onChange(Math.min(max, value + 1))}
          className="w-11 h-11 rounded-xl bg-primary-fixed text-primary hover:bg-primary-fixed-dim transition-colors flex items-center justify-center"
        >
          <span className="material-symbols-outlined text-[22px]">add</span>
        </button>
      </div>
    </div>
  );
}
