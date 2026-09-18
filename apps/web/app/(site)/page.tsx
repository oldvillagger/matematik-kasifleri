import Link from "next/link";
import { buildCourseView } from "../lib/course";
import { HomeHero } from "./HomeHero";
import { CourseCards, type UnitCard } from "./CourseCards";
import { QuickAccess } from "./QuickAccess";
import { TOPICS } from "../lib/topics";

export default function HomePage() {
  const course = buildCourseView();

  const units: UnitCard[] = course.units.map((u) => ({
    code: u.code,
    index: u.index,
    title: u.title,
    gradient: u.style.gradient,
    icon: u.style.icon,
    outcomeCodes: u.topics.map((t) => t.outcome.code),
    playableCodes: u.topics.filter((t) => t.playable).map((t) => t.outcome.code),
  }));

  return (
    <main className="w-full pt-20 px-gutter bg-background">
      <div className="flex flex-col w-full">
        <HomeHero />

        {/* Ders kartı — tek gerçek dersimiz */}
        <Link
          href="/matematik"
          className="w-full bg-surface-container-lowest rounded-xl shadow-md overflow-hidden mb-space-lg flex flex-col lg:flex-row transition-all hover:shadow-xl group"
        >
          <div className="lg:w-80 shrink-0 bg-gradient-to-br from-primary to-primary-container p-space-md flex flex-col justify-between relative overflow-hidden min-h-[9rem]">
            <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-surface-container-lowest/15 pointer-events-none" />
            <div className="flex justify-between items-start z-10">
              <span className="w-10 h-10 rounded-full bg-surface-container-lowest/20 backdrop-blur-md flex items-center justify-center text-on-primary">
                <span className="material-symbols-outlined text-[24px]">calculate</span>
              </span>
              <span className="bg-surface-container-lowest/30 px-2 py-0.5 rounded-full text-on-primary font-label-sm text-label-sm">
                Ders 01
              </span>
            </div>
            <div className="z-10">
              <h3 className="font-headline-md text-headline-md text-on-primary leading-snug">{course.subjectTitle}</h3>
              <span className="font-label-sm text-label-sm text-inverse-primary">{course.courseTitle}</span>
            </div>
          </div>

          <div className="flex-1 p-space-md flex flex-col sm:flex-row sm:items-center justify-between gap-space-md">
            <div className="space-y-space-xs">
              <h4 className="font-headline-sm text-headline-sm text-on-surface">
                {course.units.length} ünite • {course.outcomeCount} kazanım • {course.playableCount} interaktif konu
              </h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Sayılardan geometriye, TYMM 5. sınıf matematik programının tamamı. Her konu üç aşamalı:
                önce materyalle keşfet, sonra sayılarla bağla, en son gerçek teste hazırlan.
              </p>
              <div className="flex items-center gap-space-xs flex-wrap pt-1">
                <span className="inline-flex items-center gap-1 px-space-sm py-1 rounded-full bg-surface-container-high text-primary font-label-sm text-label-sm">
                  <span className="material-symbols-outlined text-[16px] icon-filled">verified</span>
                  TYMM Müfredatına Birebir Uyumlu
                </span>
                <span className="inline-flex items-center gap-1 px-space-sm py-1 rounded-full bg-tertiary-fixed/50 text-on-tertiary-fixed font-label-sm text-label-sm">
                  <span className="material-symbols-outlined text-[16px]">timer_off</span>
                  Süre baskısı yok
                </span>
              </div>
            </div>
            <span className="shrink-0 py-3 px-space-lg rounded-full bg-primary group-hover:bg-primary-container text-on-primary font-label-lg text-label-lg shadow-md transition-all flex items-center justify-center gap-1.5">
              Derse Git
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </span>
          </div>
        </Link>

        <div className="flex items-center justify-between mb-space-md">
          <div>
            <h2 className="font-headline-lg text-headline-lg text-on-surface">5. Sınıf Matematik Üniteleri</h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Müfredata tam uyumlu interaktif ders içerikleri ve konu sonu testleri
            </p>
          </div>
          <span className="font-label-md text-label-md bg-secondary-container text-on-secondary-container px-space-sm py-1.5 rounded-full whitespace-nowrap">
            Toplam {course.units.length} Ünite
          </span>
        </div>

        <CourseCards units={units} />

        <QuickAccess topics={TOPICS} totalComponents={course.taskCount} />
      </div>
    </main>
  );
}
