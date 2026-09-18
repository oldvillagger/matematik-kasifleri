import Link from "next/link";
import { notFound } from "next/navigation";
import { listCourses } from "@matematik-kasifleri/curriculum";
import { buildCourseView } from "../../lib/course";
import { CourseHero } from "./CourseHero";
import { UnitAccordion, type AccordionUnit } from "./UnitAccordion";
import { CourseSidebar, type SidebarTopic } from "./CourseSidebar";

export default async function SubjectPage({ params }: { params: Promise<{ subject: string }> }) {
  const { subject } = await params;
  const entry = listCourses().find((c) => c.subjectSlug === subject);
  if (!entry) notFound();

  const course = buildCourseView(entry.subjectSlug, entry.courseSlug);

  const units: AccordionUnit[] = course.units.map((u) => ({
    code: u.code,
    index: u.index,
    title: u.title,
    icon: u.style.icon,
    playableCount: u.playableCount,
    topics: u.topics.map((t) => ({
      outcomeCode: t.outcome.code,
      outcomeTitle: t.outcome.title,
      topicTitle: t.topic?.title,
      componentCount: t.outcome.processComponents.length,
      playable: t.playable,
    })),
  }));

  const playableCodes = course.units.flatMap((u) => u.topics.filter((t) => t.playable).map((t) => t.outcome.code));

  const sidebarTopics: SidebarTopic[] = course.units.flatMap((u) =>
    u.topics
      .filter((t) => t.playable && t.topic)
      .map((t) => ({
        outcomeCode: t.outcome.code,
        title: t.topic?.title ?? t.outcome.code,
        outcomeTitle: t.outcome.title,
      })),
  );

  return (
    <main className="w-full pt-20 px-gutter bg-background">
      <div className="flex flex-col w-full">
        {/* Breadcrumb */}
        <div className="flex items-center justify-between py-space-sm gap-space-sm">
          <div className="flex items-center gap-2 text-on-surface-variant font-label-md text-label-md min-w-0">
            <Link className="inline-flex items-center gap-1 text-primary hover:text-primary-container transition-colors" href="/">
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              <span>Dersler</span>
            </Link>
            <span className="text-outline-variant">/</span>
            <span className="text-on-surface font-label-lg text-label-lg truncate">
              {course.courseTitle} {course.subjectTitle}
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-space-xs bg-surface-container-high px-space-sm py-1.5 rounded-full text-on-secondary-container font-label-sm text-label-sm whitespace-nowrap">
            <span className="material-symbols-outlined text-[16px] text-tertiary-container icon-filled">verified</span>
            <span>TYMM Müfredatına %100 Uyumlu</span>
          </div>
        </div>

        <CourseHero
          subjectTitle={course.subjectTitle}
          courseTitle={course.courseTitle}
          unitCount={course.units.length}
          outcomeCount={course.outcomeCount}
          componentCount={course.taskCount}
          playableCodes={playableCodes}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md mt-space-md mb-space-lg items-start">
          <UnitAccordion units={units} subjectSlug={entry.subjectSlug} />
          <CourseSidebar topics={sidebarTopics} subjectSlug={entry.subjectSlug} />
        </div>
      </div>
    </main>
  );
}
