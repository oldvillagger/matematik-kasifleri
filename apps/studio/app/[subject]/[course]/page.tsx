import Link from "next/link";
import { notFound } from "next/navigation";
import { loadCourse } from "@matematik-kasifleri/curriculum";

export default async function CoursePage({
  params,
}: {
  params: Promise<{ subject: string; course: string }>;
}) {
  const { subject, course } = await params;

  let doc;
  try {
    doc = loadCourse(subject, course);
  } catch {
    notFound();
  }

  return (
    <main className="shell">
      <Link href="/" className="back-link">
        ← Dersler
      </Link>
      <p className="top-strip">{doc.course.curriculumVersion}</p>
      <h1>
        {doc.subject.title} — {doc.course.title}
      </h1>

      {doc.themes.map((theme) => {
        const themeOutcomes = doc.outcomes.filter((o) => o.themeCode === theme.code);
        return (
          <section key={theme.code} className="theme-group">
            <h2>
              {theme.code} — {theme.title}
            </h2>
            <table className="outcome-table">
              <tbody>
                {themeOutcomes.map((outcome) => (
                  <tr key={outcome.code}>
                    <td className="code">{outcome.code}</td>
                    <td className="title">
                      <Link href={`/${subject}/${course}/${outcome.code}`}>{outcome.title}</Link>
                    </td>
                    <td className="meta">
                      {outcome.processComponents.length} bileşen
                      {!outcome.componentsSourced && <span className="flag"> · kaynaksız</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        );
      })}
    </main>
  );
}
