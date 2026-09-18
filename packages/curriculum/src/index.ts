export * from "./types";
export * from "./loader";

import { loadCourse } from "./loader";

/**
 * Faz 0/1 convenience: the one course that exists today. Once a second
 * course is added under content/, stop reaching for this constant and use
 * loadCourse/loadAllCourses so new subjects don't require code changes
 * (agents-notes/08-genisletilmis-platform-mimarisi.md §2).
 */
export const TYMM_5_MATEMATIK = loadCourse("matematik", "tymm-5");
