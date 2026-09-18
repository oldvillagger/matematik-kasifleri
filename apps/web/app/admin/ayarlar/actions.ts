"use server";

import { writeFile } from "node:fs/promises";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { ProgressionSettings } from "@matematik-kasifleri/progression";
import { SETTINGS_PATH, loadSettings } from "../../lib/settings";

/**
 * Oyunlaştırma anahtarlarını content/settings.json'a yazar.
 * K14: seri (streak) sistemi buradan kapatılabilir olmalı — kullanıcı
 * davranış verisi toplanınca kararı gözden geçirecek.
 */
export async function saveProgressionSettings(formData: FormData): Promise<void> {
  const current = await loadSettings();

  const parsedTarget = Number(formData.get("dailyGoalTarget"));
  const dailyGoalTarget =
    Number.isFinite(parsedTarget) && parsedTarget >= 1 && parsedTarget <= 20
      ? Math.round(parsedTarget)
      : current.dailyGoalTarget;

  const next: ProgressionSettings = {
    streakEnabled: formData.get("streakEnabled") === "on",
    pointsEnabled: formData.get("pointsEnabled") === "on",
    dailyGoalTarget,
  };

  await writeFile(SETTINGS_PATH, JSON.stringify(next, null, 2) + "\n", "utf8");

  revalidatePath("/", "layout");
  redirect("/admin/ayarlar?kaydedildi=1");
}
