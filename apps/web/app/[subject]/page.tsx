import Link from "next/link";
import { notFound } from "next/navigation";
import { listCourses, loadCourse } from "@matematik-kasifleri/curriculum";
import { findTopic } from "../topics";
import { TopicIcon } from "../TopicIcon";

export default async function SubjectPage({ params }: { params: Promise<{ subject: string }> }) {
  const { subject } = await params;
  const course = listCourses().find((c) => c.subjectSlug === subject);
  if (!course) notFound();
  const doc = loadCourse(course.subjectSlug, course.courseSlug);

  return (
    <main className="shell">
      <Link href="/" className="back-link">
        ← Ana menü
      </Link>
      <header className="hero" style={{ paddingBlockStart: 0 }}>
        <span className="hero__kicker">{doc.subject.title}</span>
        <h1>Bir konu seç.</h1>
        <p>Renkli olanlar oynanabilir. Diğerleri hazırlanıyor.</p>
      </header>

      {doc.themes.map((theme) => {
        const outcomes = doc.outcomes.filter((o) => o.themeCode === theme.code);
        return (
          <section key={theme.code} className="theme-block">
            <h2>{theme.title}</h2>
            <div className="mesh">
              {outcomes.map((outcome) => {
                const topic = findTopic(outcome.code);
                if (!topic) {
                  return (
                    <div key={outcome.code} className="mesh-card mesh-card--locked">
                      <span className="mesh-card__title">{outcome.title}</span>
                      <span className="mesh-card__badge">Yakında</span>
                    </div>
                  );
                }
                return (
                  <Link
                    key={outcome.code}
                    href={`/${course.subjectSlug}/${outcome.code}`}
                    className="mesh-card"
                    style={{ ["--accent" as string]: topic.accent }}
                  >
                    <TopicIcon icon={topic.icon} accent={topic.accent} />
                    <span className="mesh-card__title">{topic.title}</span>
                    <span className="mesh-card__sub">{outcome.code}</span>
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}
    </main>
  );
}
