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
      <p className="top-strip">İçerik Masası</p>
      <h1>Dersler</h1>
      <p>
        Yeni bir ders eklemek için <code>content/&lt;ders-slug&gt;/&lt;kurs-slug&gt;/curriculum.json</code>{" "}
        oluşturmak yeterli — kod değişikliği gerekmez.
      </p>
      <ul className="course-list">
        {courses.map(({ subjectSlug, courseSlug, doc }) => (
          <li key={`${subjectSlug}/${courseSlug}`}>
            <Link href={`/${subjectSlug}/${courseSlug}`}>
              {doc.subject.title} — {doc.course.title}
            </Link>
            <span className="stat">
              {doc.themes.length} tema · {doc.outcomes.length} öğrenme çıktısı
            </span>
          </li>
        ))}
      </ul>
    </main>
  );
}
