"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { loadCourse, saveCourse } from "@matematik-kasifleri/curriculum";

export async function saveOutcome(
  subject: string,
  course: string,
  outcomeCode: string,
  formData: FormData,
): Promise<void> {
  const doc = loadCourse(subject, course);
  const outcome = doc.outcomes.find((o) => o.code === outcomeCode);
  if (!outcome) {
    throw new Error(`Outcome not found: ${outcomeCode}`);
  }

  const title = String(formData.get("title") ?? "").trim();
  if (title.length > 0) {
    outcome.title = title;
  }

  const components: { code: string; description: string }[] = [];
  let index = 0;
  while (formData.has(`component-code-${index}`)) {
    const code = String(formData.get(`component-code-${index}`) ?? "").trim();
    const description = String(formData.get(`component-desc-${index}`) ?? "").trim();
    if (code.length > 0 && description.length > 0) {
      components.push({ code, description });
    }
    index += 1;
  }
  outcome.processComponents = components;
  outcome.componentsSourced = components.length > 0;

  saveCourse(doc);
  revalidatePath(`/admin/${subject}/${course}`);
  revalidatePath(`/admin/${subject}/${course}/${outcomeCode}`);
  redirect(`/admin/${subject}/${course}/${outcomeCode}`);
}
