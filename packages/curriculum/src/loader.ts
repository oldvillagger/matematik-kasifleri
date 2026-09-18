import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { CurriculumDocument } from "./types";

const here = dirname(fileURLToPath(import.meta.url));
// this file lives at packages/curriculum/src — repo root's content/ is three levels up
const CONTENT_ROOT = join(here, "..", "..", "..", "content");

function listDirs(path: string): string[] {
  return readdirSync(path, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
}

/** Every (subjectSlug, courseSlug) pair that has a curriculum.json under content/. */
export function listCourses(): { subjectSlug: string; courseSlug: string }[] {
  const pairs: { subjectSlug: string; courseSlug: string }[] = [];
  for (const subjectSlug of listDirs(CONTENT_ROOT)) {
    for (const courseSlug of listDirs(join(CONTENT_ROOT, subjectSlug))) {
      pairs.push({ subjectSlug, courseSlug });
    }
  }
  return pairs;
}

export function loadCourse(subjectSlug: string, courseSlug: string): CurriculumDocument {
  const path = join(CONTENT_ROOT, subjectSlug, courseSlug, "curriculum.json");
  const raw = readFileSync(path, "utf-8");
  return JSON.parse(raw) as CurriculumDocument;
}

export function loadAllCourses(): CurriculumDocument[] {
  return listCourses().map(({ subjectSlug, courseSlug }) => loadCourse(subjectSlug, courseSlug));
}

/**
 * Overwrites content/<subject>/<course>/curriculum.json in place.
 * Local-filesystem write — works from the admin panel in dev/local use
 * (Faz 0 scope), not from a read-only production deployment.
 */
export function saveCourse(doc: CurriculumDocument): void {
  const path = join(CONTENT_ROOT, doc.subject.slug, doc.course.slug, "curriculum.json");
  writeFileSync(path, JSON.stringify(doc, null, 2) + "\n", "utf-8");
}
