"use client";

/** Üç oyunun ortak arayüz parçaları — Stitch token'larıyla, tek yerde. */

export function Prompt({ text }: { text: string }) {
  return (
    <p className="font-body-lg text-body-lg text-on-surface text-center max-w-[52ch] leading-relaxed">{text}</p>
  );
}

/**
 * Sonuç şeridi. "danger"/kırmızı ton bilerek YOK: A1'de hata kavramı yok,
 * A2'de sistem ipucu verir, A3'te bile kaygı dili kullanılmaz.
 */
export function SoftResult({
  tone,
  icon,
  text,
}: {
  tone: "neutral" | "success";
  icon: string;
  text: string;
}) {
  const cls =
    tone === "success"
      ? "bg-tertiary-fixed/50 text-on-tertiary-fixed"
      : "bg-surface-container-low text-on-surface";

  return (
    <div className={`flex items-center gap-2 px-space-md py-space-sm rounded-2xl ${cls}`}>
      <span className="material-symbols-outlined text-[20px]">{icon}</span>
      <span className="font-label-md text-label-md">{text}</span>
    </div>
  );
}

/** Stitch test ekranındaki "Pratik İpucu" kutusu, birebir. */
export function HintCard({ text }: { text: string }) {
  return (
    <div className="w-full p-space-sm rounded-2xl bg-secondary-fixed/40 text-on-secondary-fixed">
      <div className="flex items-start gap-2">
        <span className="material-symbols-outlined text-secondary text-[22px]">lightbulb</span>
        <div className="font-body-sm text-body-sm">
          <span className="font-bold block">Pratik İpucu:</span>
          {text}
        </div>
      </div>
    </div>
  );
}

export function AnswerPad({
  label,
  value,
  onChange,
  onSubmit,
  onHint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  onHint?: (() => void) | undefined;
}) {
  return (
    <form
      className="flex items-center gap-space-xs flex-wrap justify-center"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <label className="font-headline-sm text-headline-sm text-on-surface" htmlFor="answer-input">
        {label}
      </label>
      <input
        id="answer-input"
        inputMode="numeric"
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-24 h-12 px-3 text-center rounded-xl bg-surface-container-low font-headline-md text-headline-md text-on-surface outline-none focus:ring-[3px] focus:ring-primary/20 focus:bg-surface-container transition-all"
      />
      <button
        type="submit"
        className="h-12 px-space-md rounded-full bg-primary text-on-primary font-label-lg text-label-lg shadow-md hover:bg-primary-container transition-all btn-tactile"
      >
        Kontrol Et
      </button>
      {onHint && (
        <button
          type="button"
          onClick={onHint}
          className="h-12 px-space-sm rounded-full bg-secondary-container/40 text-on-secondary-container hover:bg-secondary-container font-label-md text-label-md transition-all flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-[18px]">lightbulb</span> İpucu Al
        </button>
      )}
    </form>
  );
}

export function ChoiceRow({
  children,
  selected,
  onClick,
  letter,
}: {
  children: React.ReactNode;
  selected: boolean;
  onClick: () => void;
  letter: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`choice-item w-full p-3.5 rounded-2xl flex items-center justify-between text-left transition-all group ${
        selected ? "bg-primary-fixed/40 shadow-sm" : "bg-surface-container-low hover:bg-surface-container"
      }`}
    >
      <div className="flex items-center gap-3">
        <span
          className={`w-9 h-9 rounded-xl flex items-center justify-center font-label-lg text-label-lg transition-colors ${
            selected
              ? "bg-primary text-on-primary"
              : "bg-surface-container-lowest text-on-surface group-hover:bg-primary group-hover:text-on-primary"
          }`}
        >
          {letter}
        </span>
        {children}
      </div>
      <span
        className={`material-symbols-outlined transition-colors ${selected ? "text-primary icon-filled" : "text-outline group-hover:text-primary"}`}
      >
        check_circle
      </span>
    </button>
  );
}
