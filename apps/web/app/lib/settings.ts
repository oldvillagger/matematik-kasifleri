import { readFile } from "node:fs/promises";
import path from "node:path";
import { DEFAULT_SETTINGS, type ProgressionSettings } from "@matematik-kasifleri/progression";

/**
 * Oyunlaştırma ayarları content/settings.json'da durur — admin panelden
 * düzenlenir. Faz 0'da veritabanı yok; içerik gibi ayar da dosyada.
 */
const SETTINGS_PATH = path.join(process.cwd(), "..", "..", "content", "settings.json");

export async function loadSettings(): Promise<ProgressionSettings> {
  try {
    const raw = await readFile(SETTINGS_PATH, "utf8");
    const parsed = JSON.parse(raw) as Partial<ProgressionSettings>;
    return {
      streakEnabled: parsed.streakEnabled ?? DEFAULT_SETTINGS.streakEnabled,
      pointsEnabled: parsed.pointsEnabled ?? DEFAULT_SETTINGS.pointsEnabled,
      dailyGoalTarget: parsed.dailyGoalTarget ?? DEFAULT_SETTINGS.dailyGoalTarget,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export { SETTINGS_PATH };
