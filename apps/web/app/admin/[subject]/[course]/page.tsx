import Link from "next/link";
import { notFound } from "next/navigation";
import { loadCourse } from "@matematik-kasifleri/curriculum";
import { findTopic } from "../../../topics";

export default async function AdminCoursePage({
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
    <main className="admin-shell">
      <Link href="/admin" className="admin-back-link">
        ← Dersler
      </Link>
      <p className="admin-top-strip">{doc.course.curriculumVersion}</p>
      <h1>
        {doc.subject.title} — {doc.course.title}
      </h1>

      {doc.themes.map((theme) => {
        const themeOutcomes = doc.outcomes.filter((o) => o.themeCode === theme.code);
        return (
          <section key={theme.code} className="admin-theme-group">
            <h2>
              {theme.code} — {theme.title}
            </h2>
            <table className="admin-outcome-table">
              <tbody>
                {themeOutcomes.map((outcome) => (
                  <tr key={outcome.code}>
                    <td className="admin-code">{outcome.code}</td>
                    <td className="admin-title">
                      <Link href={`/admin/${subject}/${course}/${outcome.code}`}>{outcome.title}</Link>
                    </td>
                    <td className="admin-meta">
                      {outcome.processComponents.length} bileşen
                      {!outcome.componentsSourced && <span className="admin-flag"> · kaynaksız</span>}
                      {findTopic(outcome.code) && <span style={{ color: "var(--success)" }}> · oynanabilir</span>}
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
