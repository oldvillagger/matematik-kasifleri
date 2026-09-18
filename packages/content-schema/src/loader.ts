import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";
import { AssessmentSchema, TaskSchema } from "./task";

const here = dirname(fileURLToPath(import.meta.url));
const CONTENT_ROOT = join(here, "..", "..", "..", "content");

const LessonFileSchema = z.object({
  a1: z.array(TaskSchema),
  a2: z.array(TaskSchema),
  a3: z.array(TaskSchema),
  assessment: AssessmentSchema,
});
export type LessonFile = z.infer<typeof LessonFileSchema>;

/** Reads + validates content/<subject>/<course>/tasks/<outcomeCode>.json. Throws on schema violation — a red-line breach fails loudly, not silently. */
export function loadLesson(subjectSlug: string, courseSlug: string, outcomeCode: string): LessonFile {
  const path = join(CONTENT_ROOT, subjectSlug, courseSlug, "tasks", `${outcomeCode}.json`);
  const raw = JSON.parse(readFileSync(path, "utf-8"));
  return LessonFileSchema.parse(raw);
}

export function hasLesson(subjectSlug: string, courseSlug: string, outcomeCode: string): boolean {
  try {
    loadLesson(subjectSlug, courseSlug, outcomeCode);
    return true;
  } catch {
    return false;
  }
}
