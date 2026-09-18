import { notFound } from "next/navigation";
import { listCourses } from "@matematik-kasifleri/curriculum";
import { buildCourseView } from "../../../lib/course";
import { AnalyticsBoard, type OutcomeRow } from "./AnalyticsBoard";

const TONES = ["primary", "secondary", "tertiary"] as const;

export default async function AnalyticsPage({ params }: { params: Promise<{ subject: string }> }) {
  const { subject } = await params;
  const entry = listCourses().find((c) => c.subjectSlug === subject);
  if (!entry) notFound();

  const course = buildCourseView(entry.subjectSlug, entry.courseSlug);

  // Grafikte yalnızca gerçekten oynanabilir konular var — boş çubuk göstermiyoruz.
  const rows: OutcomeRow[] = course.units
    .flatMap((u) => u.topics.filter((t) => t.playable).map((t) => ({ unit: u, t })))
    .map(({ unit, t }, i) => ({
      code: t.outcome.code,
      title: t.outcome.title,
      short: unit.style.short,
      topicTitle: t.topic?.title,
      componentCodes: t.outcome.processComponents.map((c) => c.code),
      tone: TONES[i % TONES.length] ?? "primary",
    }));

  return <AnalyticsBoard rows={rows} backHref={`/${entry.subjectSlug}`} />;
}
