import Link from "next/link";
import { notFound } from "next/navigation";
import { loadCourse } from "@matematik-kasifleri/curriculum";
import { saveOutcome } from "./actions";

const EXTRA_COMPONENT_SLOTS = 3;

export default async function OutcomePage({
  params,
}: {
  params: Promise<{ subject: string; course: string; outcome: string }>;
}) {
  const { subject, course, outcome: outcomeCode } = await params;

  let doc;
  try {
    doc = loadCourse(subject, course);
  } catch {
    notFound();
  }

  const outcome = doc.outcomes.find((o) => o.code === outcomeCode);
  if (!outcome) {
    notFound();
  }

  const theme = doc.themes.find((t) => t.code === outcome.themeCode);
  const boundSave = saveOutcome.bind(null, subject, course, outcome.code);
  const emptySlots = Array.from({ length: EXTRA_COMPONENT_SLOTS });

  return (
    <main className="shell">
      <Link href={`/${subject}/${course}`} className="back-link">
        ← {doc.subject.title} — {doc.course.title}
      </Link>
      <p className="top-strip mono">{theme ? `${theme.code} — ${theme.title}` : outcome.themeCode}</p>
      <h1 className="mono" style={{ fontFamily: "var(--font-mono)", fontSize: "1.4rem" }}>
        {outcome.code}
      </h1>

      <form action={boundSave}>
        <fieldset className="field-group">
          <legend>Öğrenme çıktısı</legend>
          <label htmlFor="title">Başlık</label>
          <textarea id="title" name="title" defaultValue={outcome.title} rows={2} />
        </fieldset>

        <fieldset className="field-group">
          <legend>Süreç bileşenleri</legend>
          <p>Bir bileşeni silmek için açıklamasını boşalt ve kaydet.</p>
          {outcome.processComponents.map((component, index) => (
            <div className="component-row" key={component.code}>
              <div>
                <label htmlFor={`component-code-${index}`}>Harf</label>
                <input id={`component-code-${index}`} name={`component-code-${index}`} defaultValue={component.code} />
              </div>
              <div>
                <label htmlFor={`component-desc-${index}`}>Açıklama</label>
                <textarea
                  id={`component-desc-${index}`}
                  name={`component-desc-${index}`}
                  defaultValue={component.description}
                  rows={2}
                />
              </div>
            </div>
          ))}

          <p style={{ marginTop: "var(--space-3)" }}>Yeni bileşen ekle:</p>
          {emptySlots.map((_, offset) => {
            const index = outcome.processComponents.length + offset;
            return (
              <div className="component-row" key={`new-${index}`}>
                <div>
                  <label htmlFor={`component-code-${index}`}>Harf</label>
                  <input id={`component-code-${index}`} name={`component-code-${index}`} />
                </div>
                <div>
                  <label htmlFor={`component-desc-${index}`}>Açıklama</label>
                  <textarea id={`component-desc-${index}`} name={`component-desc-${index}`} rows={2} />
                </div>
              </div>
            );
          })}
        </fieldset>

        <button type="submit">Kaydet</button>
      </form>

      <section style={{ marginTop: "var(--space-4)" }}>
        <h2>İçerik (görevler)</h2>
        <p className="content-note">
          Bu öğrenme çıktısı için henüz görev içeriği yok. Görev JSON şeması (<code>content-schema</code>{" "}
          paketi, A1/A2/A3/Assessment aşamaları) kurulunca bu bölümde görevler listelenip
          düzenlenebilecek.
        </p>
      </section>
    </main>
  );
}
