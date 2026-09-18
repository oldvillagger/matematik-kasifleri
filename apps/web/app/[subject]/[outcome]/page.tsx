import { notFound } from "next/navigation";
import { listCourses, loadCourse } from "@matematik-kasifleri/curriculum";
import { loadLesson } from "@matematik-kasifleri/content-schema";
import { findTopic } from "../../topics";
import { LessonRunner } from "./LessonRunner";

export default async function LessonPage({ params }: { params: Promise<{ subject: string; outcome: string }> }) {
  const { subject, outcome: outcomeCode } = await params;

  const topic = findTopic(outcomeCode);
  const course = listCourses().find((c) => c.subjectSlug === subject);
  if (!topic || !course) notFound();

  const doc = loadCourse(course.subjectSlug, course.courseSlug);
  const outcome = doc.outcomes.find((o) => o.code === outcomeCode);
  if (!outcome) notFound();

  let lesson;
  try {
    lesson = loadLesson(course.subjectSlug, course.courseSlug, outcomeCode);
  } catch {
    notFound();
  }

  return (
    <LessonRunner
      outcomeCode={outcome.code}
      outcomeTitle={topic.title}
      allComponentCodes={outcome.processComponents.map((c) => c.code)}
      lesson={lesson}
      backHref={`/${subject}`}
    />
  );
}
