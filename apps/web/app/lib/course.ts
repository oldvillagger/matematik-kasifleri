import { loadCourse } from "@matematik-kasifleri/curriculum";
import type { LearningOutcome } from "@matematik-kasifleri/curriculum";
import { TOPICS, findTopic, type Topic } from "./topics";

/**
 * Müfredat verisini (tema → kazanım) Stitch'in ünite akordiyonuna uygun
 * görünüm modeline çevirir. Renk/ikon burada, müfredat verisinde değil —
 * curriculum.json resmî veri, sunum kararı ürün katmanının işi.
 */

export interface UnitStyle {
  /** Stitch ders kartı gradienti. */
  gradient: string;
  icon: string;
  /** Tema kısaltması (analiz ekranındaki MAT/FEN rozetleri gibi). */
  short: string;
}

const UNIT_STYLE: Record<string, UnitStyle> = {
  "MAT.5.1": { gradient: "from-primary to-primary-container", icon: "tag", short: "SAY" },
  "MAT.5.2": { gradient: "from-tertiary to-tertiary-container", icon: "balance", short: "CEB" },
  "MAT.5.3": { gradient: "from-secondary to-on-secondary-container", icon: "category", short: "ŞEK" },
  "MAT.5.4": { gradient: "from-on-secondary-fixed-variant to-secondary", icon: "square_foot", short: "NİC" },
  "MAT.5.5": { gradient: "from-primary-container to-inverse-primary", icon: "bar_chart", short: "İST" },
  "MAT.5.6": { gradient: "from-tertiary-container to-tertiary-fixed-dim", icon: "casino", short: "OLA" },
};

const FALLBACK_STYLE: UnitStyle = { gradient: "from-primary to-primary-container", icon: "school", short: "DER" };

export interface UnitTopic {
  outcome: LearningOutcome;
  /** Oynanabilir bir dersi var mı? */
  topic: Topic | undefined;
  /** Bu kazanım şu an açık mı (içeriği var mı)? */
  playable: boolean;
}

export interface Unit {
  code: string;
  title: string;
  /** Kaçıncı ünite (1'den başlar) — "Ünite 2: ..." başlığı için. */
  index: number;
  style: UnitStyle;
  topics: UnitTopic[];
  playableCount: number;
}

export interface CourseView {
  subjectSlug: string;
  courseSlug: string;
  subjectTitle: string;
  courseTitle: string;
  units: Unit[];
  outcomeCount: number;
  playableCount: number;
  /** Tüm konuların toplam görev sayısı — istatistik şeridi için. */
  taskCount: number;
}

export function buildCourseView(subjectSlug = "matematik", courseSlug = "tymm-5"): CourseView {
  const doc = loadCourse(subjectSlug, courseSlug);

  const units: Unit[] = doc.themes.map((theme, i) => {
    const topics: UnitTopic[] = doc.outcomes
      .filter((o) => o.themeCode === theme.code)
      .map((outcome) => {
        const topic = findTopic(outcome.code);
        return { outcome, topic, playable: topic !== undefined };
      });

    return {
      code: theme.code,
      title: theme.title,
      index: i + 1,
      style: UNIT_STYLE[theme.code] ?? FALLBACK_STYLE,
      topics,
      playableCount: topics.filter((t) => t.playable).length,
    };
  });

  return {
    subjectSlug,
    courseSlug,
    subjectTitle: doc.subject.title,
    courseTitle: doc.course.title,
    units,
    outcomeCount: doc.outcomes.length,
    playableCount: TOPICS.length,
    taskCount: doc.outcomes.reduce((sum, o) => sum + o.processComponents.length, 0),
  };
}
