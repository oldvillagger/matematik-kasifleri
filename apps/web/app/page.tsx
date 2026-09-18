import Link from "next/link";
import { listCourses, loadCourse } from "@matematik-kasifleri/curriculum";

export default function HomePage() {
  const courses = listCourses().map(({ subjectSlug, courseSlug }) => ({
    subjectSlug,
    courseSlug,
    doc: loadCourse(subjectSlug, courseSlug),
  }));

  return (
    <main className="shell">
      <header className="hero">
        <span className="hero__kicker">Kâşif Günlüğü</span>
        <h1>Hangi dersle keşfe çıkıyoruz?</h1>
        <p>Bir ders seç, sonra konuları gör. Her konu kendi oyunuyla başlıyor.</p>
      </header>

      <section className="menu-grid">
        {courses.map(({ subjectSlug, courseSlug, doc }) => (
          <Link key={`${subjectSlug}/${courseSlug}`} href={`/${subjectSlug}`} className="menu-card">
            <span className="menu-card__title">{doc.subject.title}</span>
            <span className="menu-card__sub">{doc.course.title}</span>
            <span className="menu-card__stat">{doc.themes.length} tema · {doc.outcomes.length} konu</span>
          </Link>
        ))}
      </section>
    </main>
  );
}
