"use client";

import Link from "next/link";
import { useProgress } from "../lib/ProgressProvider";

export interface UnitCard {
  code: string;
  index: number;
  title: string;
  gradient: string;
  icon: string;
  outcomeCodes: string[];
  playableCodes: string[];
}

/**
 * Stitch ana sayfasındaki ders kartı ızgarası, birebir markup. Stitch'te 5
 * ders vardı; bizde gerçek içeriği olan tek ders Matematik olduğu için
 * kartlar matematiğin 6 ünitesini gösteriyor (boş ders kartı koymuyoruz).
 */
export function CourseCards({ units }: { units: UnitCard[] }) {
  const { state, hydrated } = useProgress();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-md mb-space-xl">
      {units.map((unit) => {
        const done = hydrated ? unit.playableCodes.filter((c) => state.completedOutcomes.includes(c)).length : 0;
        const total = unit.playableCodes.length;
        const pct = total === 0 ? 0 : Math.round((done / total) * 100);
        const open = total > 0;

        return (
          <div
            key={unit.code}
            className="course-card flex flex-col bg-surface-container-lowest rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl group"
          >
            <div className={`h-36 bg-gradient-to-br ${unit.gradient} p-space-md flex flex-col justify-between relative overflow-hidden`}>
              <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-surface-container-lowest/15 pointer-events-none" />
              <div className="flex justify-between items-start z-10">
                <span className="w-10 h-10 rounded-full bg-surface-container-lowest/20 backdrop-blur-md flex items-center justify-center text-on-primary">
                  <span className="material-symbols-outlined text-[24px]">{unit.icon}</span>
                </span>
                <span className="bg-surface-container-lowest/30 px-2 py-0.5 rounded-full text-on-primary font-label-sm text-label-sm">
                  Ünite {String(unit.index).padStart(2, "0")}
                </span>
              </div>
              <div className="z-10">
                <h3 className="font-headline-md text-headline-md text-on-primary leading-snug">{unit.title}</h3>
                <span className="font-label-sm text-label-sm text-inverse-on-surface/90">
                  {unit.outcomeCodes.length} kazanım
                </span>
              </div>
            </div>

            <div className="p-space-md flex-1 flex flex-col justify-between space-y-space-md">
              <div className="space-y-space-xs">
                <h4 className="font-headline-sm text-headline-sm text-on-surface line-clamp-2">
                  {open ? `${total} interaktif konu hazır` : "Bu ünitenin görevleri içerik masasında hazırlanıyor"}
                </h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Keşfet → Bağla → Gerçek Teste Hazırlık üçlüsüyle adım adım
                </p>
              </div>

              <div className="space-y-space-xs">
                <div className="flex items-center justify-between font-label-sm text-label-sm">
                  <span className="text-on-surface-variant">İlerleme</span>
                  <span className="text-primary font-label-md text-label-md">%{pct} Tamamlandı</span>
                </div>
                <div className="w-full h-2.5 bg-surface-container-high rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
                </div>
              </div>

              <Link
                href={open ? `/matematik#unite-${unit.index}` : "/matematik"}
                className={
                  open
                    ? "w-full py-3 px-space-md rounded-full bg-primary hover:bg-primary-container text-on-primary font-label-lg text-label-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 active:scale-95"
                    : "w-full py-3 px-space-md rounded-full bg-surface-container-high text-on-surface-variant font-label-lg text-label-lg transition-all flex items-center justify-center gap-1.5"
                }
              >
                <span>{open ? "Üniteyi Aç" : "Kazanımları Gör"}</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
