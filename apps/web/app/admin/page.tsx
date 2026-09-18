import Link from "next/link";
import { listCourses, loadCourse } from "@matematik-kasifleri/curriculum";

export default function AdminHomePage() {
  const courses = listCourses().map(({ subjectSlug, courseSlug }) => ({
    subjectSlug,
    courseSlug,
    doc: loadCourse(subjectSlug, courseSlug),
  }));

  return (
    <main className="admin-shell">
      <p className="admin-top-strip">İçerik Masası</p>
      <h1>Dersler</h1>
      <p>
        Yeni bir ders eklemek için <code>content/&lt;ders-slug&gt;/&lt;kurs-slug&gt;/curriculum.json</code>{" "}
        oluşturmak yeterli — kod değişikliği gerekmez.
      </p>
      <ul className="admin-course-list">
        {courses.map(({ subjectSlug, courseSlug, doc }) => (
          <li key={`${subjectSlug}/${courseSlug}`}>
            <Link href={`/admin/${subjectSlug}/${courseSlug}`}>
              {doc.subject.title} — {doc.course.title}
            </Link>
            <span className="admin-stat">
              {doc.themes.length} tema · {doc.outcomes.length} öğrenme çıktısı
            </span>
          </li>
        ))}
      </ul>

      <h2>Ayarlar</h2>
      <ul className="admin-course-list">
        <li>
          <Link href="/admin/ayarlar">Oyunlaştırma Ayarları</Link>
          <span className="admin-stat">Seri (streak) aç/kapa · puan sayacı · günlük hedef</span>
        </li>
      </ul>
    </main>
  );
}
