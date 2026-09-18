/**
 * Oyunlaştırma durumu. K14 kararı (agents-notes/09-arayuz-yeniden-tasarim-v2.md §2):
 * puan, günlük hedef, seri, rozet ve hata kitapçığı VAR; lider tablosu YOK.
 *
 * engine-core gibi bu paket de saf TypeScript — React yok, DOM yok, ağ yok.
 * Kalıcılık (localStorage) uygulama katmanının işi.
 */

/** ISO tarih, sadece gün: "2026-09-18". Saat/dilim tutmuyoruz (KVKK: minimum veri). */
export type DayStamp = string;

export interface StreakState {
  /** Kesintisiz gün sayısı. */
  current: number;
  /** En uzun seri (rekor). */
  best: number;
  /** Serinin en son işlendiği gün; null ise hiç çalışılmamış. */
  lastDay: DayStamp | null;
}

export interface DailyGoalState {
  /** Hedeflenen günlük görev sayısı (admin panelden ayarlanır). */
  target: number;
  /** Bugün tamamlanan görev sayısı. */
  completed: number;
  /** Sayacın ait olduğu gün; gün değişince sıfırlanır. */
  day: DayStamp | null;
}

/** Hata kitapçığı kaydı — süreç bileşeni etiketli, "hangi alt beceride takıldı" bilgisini taşır. */
export interface MistakeEntry {
  taskId: string;
  outcomeCode: string;
  componentCode: string;
  prompt: string;
  /** Çocuğun verdiği cevap (görsel görevlerde etiket metni olabilir). */
  given: string;
  /** Beklenen cevap. */
  expected: string;
  day: DayStamp;
  /** Tekrar çözülüp düzeltildiyse true — kayıt silinmez, kapanır. */
  resolved: boolean;
}

export type BadgeId =
  | "ilk-adim"
  | "denge-ustasi"
  | "oruntu-avcisi"
  | "harita-kasifi"
  | "kanit-toplayici"
  | "seri-5"
  | "hatasini-duzelten";

export interface Badge {
  id: BadgeId;
  title: string;
  emoji: string;
  description: string;
}

export interface ProgressState {
  points: number;
  streak: StreakState;
  dailyGoal: DailyGoalState;
  badges: BadgeId[];
  mistakes: MistakeEntry[];
  /** Tamamlanan konular (outcome kodu). */
  completedOutcomes: string[];
  /** Kanıtlanan süreç bileşenleri: "MAT.5.2.1:a" biçiminde. */
  provenComponents: string[];
  /** Toplam çözülen görev ve doğru sayısı — analiz ekranı için. */
  totals: { attempted: number; correct: number };
}

/** Admin panelden yönetilen açma/kapama anahtarları (K14: seri kapatılabilir olmalı). */
export interface ProgressionSettings {
  /** Seri (streak) sistemi görünür mü? Varsayılan açık — kullanıcı kararı K14. */
  streakEnabled: boolean;
  /** Puan sayacı görünür mü? */
  pointsEnabled: boolean;
  /** Günlük hedef kaç görev? */
  dailyGoalTarget: number;
}

export const DEFAULT_SETTINGS: ProgressionSettings = {
  streakEnabled: true,
  pointsEnabled: true,
  dailyGoalTarget: 5,
};

export function createInitialProgress(target = DEFAULT_SETTINGS.dailyGoalTarget): ProgressState {
  return {
    points: 0,
    streak: { current: 0, best: 0, lastDay: null },
    dailyGoal: { target, completed: 0, day: null },
    badges: [],
    mistakes: [],
    completedOutcomes: [],
    provenComponents: [],
    totals: { attempted: 0, correct: 0 },
  };
}
