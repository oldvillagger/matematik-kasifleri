/**
 * A single lettered process component of a learning outcome (a, b, c, ç, d…),
 * transcribed verbatim from the official TYMM programme text.
 */
export interface ProcessComponent {
  code: string;
  description: string;
}

export interface LearningOutcome {
  code: string;
  themeCode: string;
  title: string;
  /**
   * Empty when the official programme text for this outcome's process
   * components has not been transcribed into agents-notes/kaynaklar yet.
   * content-schema must refuse any task content authored against an
   * outcome with no sourced components — there is nothing to validate
   * evidence against.
   */
  processComponents: ProcessComponent[];
  componentsSourced: boolean;
}

export interface Theme {
  code: string;
  title: string;
}

export interface Subject {
  slug: string;
  title: string;
}

export interface Course {
  slug: string;
  title: string;
  curriculumVersion: string;
}

/** The shape of content/<subject-slug>/<course-slug>/curriculum.json. */
export interface CurriculumDocument {
  subject: Subject;
  course: Course;
  themes: Theme[];
  outcomes: LearningOutcome[];
}
