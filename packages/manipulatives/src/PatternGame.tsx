"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Visual } from "./Visual";
import { ChoiceRow, HintCard, Prompt, SoftResult } from "./shell";
import type { GameProps, PatternTaskLike, VisualSpec } from "./types";

const LETTERS = ["A", "B", "C", "D", "E"];

/**
 * "Örüntü Anahtarı" — dizinin kuralını bul, sıradakini seç.
 *
 * A1 (Keşfet): SAYI YOK. Dizi şekil/renk örüntüsüdür (🔷🔶🔷🔶?) ve seçim
 * bir hüküm değil bir keşiftir — hangi şekli seçerse seçsin kural ortaya
 * çıkar, "yanlış" diye bir şey yoktur.
 *
 * A2: sayı dizisi; yanlışta ipucu kendiliğinden açılır.
 * A3/ASSESSMENT: sayı dizisi, ipucusuz.
 */
export function PatternGame({ task, stage, onComplete }: GameProps<PatternTaskLike>) {
  const { sequence, choices, answer, visualSequence, visualChoices, answerIndex } = task.setup;
  const [picked, setPicked] = useState<number | null>(null);
  const [hintUsed, setHintUsed] = useState(false);
  const [hintShown, setHintShown] = useState(false);

  const isA1 = stage === "A1";

  function pickVisual(index: number) {
    if (picked !== null) return;
    setPicked(index);
    // A1'de her seçim keşiftir; motor için "doğru" sayılır (hata riski yok).
    onComplete({ correct: true, hintUsed: false });
  }

  function pickNumber(value: number) {
    if (picked !== null) return;
    setPicked(value);
    const correct = value === answer;
    if (!correct && stage === "A2" && task.hints && task.hints.length > 0) {
      setHintShown(true);
      setHintUsed(true);
    }
    onComplete({ correct, hintUsed, given: String(value), expected: String(answer ?? "") });
  }

  if (isA1) {
    const seq = visualSequence ?? [];
    const opts = visualChoices ?? [];
    const rightOne = answerIndex ?? 0;

    return (
      <div className="flex flex-col items-center gap-space-md w-full">
        <Prompt text={task.prompt} />

        <div className="flex items-center gap-space-sm flex-wrap justify-center p-space-md rounded-2xl bg-surface-container-low">
          {seq.map((spec, i) => (
            <VisualTile key={i} spec={spec} />
          ))}
          <span className="w-[50px] h-[50px] rounded-xl border-[3px] border-dashed border-outline flex items-center justify-center font-headline-md text-headline-md text-outline">
            ?
          </span>
          {picked !== null && opts[picked] && (
            <motion.span initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }}>
              <VisualTile spec={opts[picked]} />
            </motion.span>
          )}
        </div>

        <div className="flex items-center gap-space-sm flex-wrap justify-center">
          {opts.map((spec, i) => (
            <motion.button
              key={i}
              type="button"
              onClick={() => pickVisual(i)}
              whileTap={{ scale: 0.92 }}
              disabled={picked !== null}
              aria-label={`${i + 1}. seçenek`}
              className={`p-space-sm rounded-2xl transition-all ${
                picked === i
                  ? "bg-primary-fixed ring-2 ring-primary"
                  : "bg-surface-container-lowest shadow-sm hover:bg-surface-container-high"
              }`}
            >
              <Visual spec={spec} />
            </motion.button>
          ))}
        </div>

        {picked !== null && (
          <SoftResult
            tone="neutral"
            icon="lightbulb"
            text={
              picked === rightOne
                ? "Örüntüyü yakaladın — dizi böyle devam ediyor."
                : "İlginç bir seçim. Diziye bir daha bak: hangi şekil hangi sırayla tekrar ediyor?"
            }
          />
        )}
      </div>
    );
  }

  const seq = sequence ?? [];
  const opts = choices ?? [];

  return (
    <div className="flex flex-col items-center gap-space-md w-full">
      <Prompt text={task.prompt} />

      <div className="flex items-center gap-space-xs flex-wrap justify-center p-space-md rounded-2xl bg-surface-container-low">
        {seq.map((n, i) => (
          <span
            key={i}
            className="w-14 h-14 rounded-xl bg-surface-container-lowest shadow-inner flex items-center justify-center font-headline-lg text-headline-lg text-primary font-bold tabular-nums"
          >
            {n}
          </span>
        ))}
        <span className="w-14 h-14 rounded-xl bg-primary-fixed text-on-primary-fixed flex items-center justify-center font-headline-lg text-headline-lg font-bold">
          ?
        </span>
      </div>

      <div className="flex flex-col gap-2.5 w-full max-w-md">
        {opts.map((c, i) => (
          <ChoiceRow key={c} letter={LETTERS[i] ?? String(i + 1)} selected={picked === c} onClick={() => pickNumber(c)}>
            <span className="font-headline-sm text-headline-sm text-on-surface tabular-nums">{c}</span>
          </ChoiceRow>
        ))}
      </div>

      {hintShown && task.hints?.[0] && <HintCard text={task.hints[0]} />}

      {picked === null && stage === "A2" && (task.hints?.length ?? 0) > 0 && !hintShown && (
        <button
          type="button"
          onClick={() => {
            setHintShown(true);
            setHintUsed(true);
          }}
          className="px-space-sm py-2 rounded-full bg-secondary-container/40 text-on-secondary-container hover:bg-secondary-container font-label-md text-label-md transition-all flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-[18px]">lightbulb</span> İpucu Al
        </button>
      )}

      {picked !== null && (
        <SoftResult
          tone={picked === answer ? "success" : "neutral"}
          icon={picked === answer ? "check_circle" : "visibility"}
          text={picked === answer ? "Doğru — kuralı buldun!" : `Bu sefer olmadı. Kuralın devamı ${answer}.`}
        />
      )}
    </div>
  );
}

function VisualTile({ spec }: { spec: VisualSpec }) {
  return (
    <motion.span whileHover={{ rotate: 4 }} className="inline-flex items-center justify-center">
      <Visual spec={spec} />
    </motion.span>
  );
}
