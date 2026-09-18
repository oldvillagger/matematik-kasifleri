"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { displayedStreak } from "@matematik-kasifleri/progression";
import { useProgress } from "./ProgressProvider";

/**
 * Stitch "Vibrant Junior Learn" üst barı — 4 ekranın hepsinde birebir aynı
 * markup. Farklar: (1) logo görseli yerine ikon, (2) çocuk fotoğrafı/tam adı
 * yerine takma ad rozeti (KVKK: çocuktan tam ad/foto toplanmaz),
 * (3) Ödevler/Videolu Anlatım sekmeleri yok — arkasında sistem yok, boş
 * sekme koymuyoruz.
 */

const NAV = [
  { label: "Dersler", href: "/" },
  { label: "Test Çöz", href: "/matematik#testler" },
  { label: "Eksikler & Analiz", href: "/matematik/analiz" },
  { label: "Hata Kitapçığı", href: "/matematik/analiz#hata-kitapcigi" },
] as const;

export function SiteHeader() {
  const { state, settings, today, hydrated } = useProgress();
  const pathname = usePathname();
  const streak = displayedStreak(state.streak, today);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface-container-lowest/95 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-20 w-full px-gutter flex items-center justify-between gap-space-sm">
        <div className="flex items-center gap-space-md">
          <Link className="flex items-center gap-space-xs" href="/">
            <span className="w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px]">explore</span>
            </span>
            <span className="font-headline-sm text-headline-sm text-primary tracking-tight whitespace-nowrap">
              Matematik Kâşifleri
            </span>
          </Link>
          <div className="hidden sm:flex items-center px-space-sm py-1 bg-surface-container-high text-primary font-label-sm text-label-sm rounded-full">
            5. Sınıf
          </div>
        </div>

        <nav className="hidden lg:flex items-center gap-1 bg-surface-container-low p-1.5 rounded-full">
          {NAV.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href.split("#")[0] ?? "");
            return (
              <Link
                key={item.label}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={
                  active
                    ? "px-space-sm py-2 transition-all bg-primary-container text-on-primary font-label-md text-label-md rounded-full shadow-[0_2px_4px_rgba(124,58,237,0.2)]"
                    : "px-space-sm py-2 rounded-full font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-all"
                }
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-space-sm">
          {settings.pointsEnabled && (
            <div className="flex items-center gap-1 bg-secondary-container/40 px-space-sm py-1.5 rounded-full">
              <span className="font-label-md text-label-md text-on-secondary-container tabular-nums">
                {hydrated ? state.points.toLocaleString("tr-TR") : "0"} Puan ⚡
              </span>
            </div>
          )}
          {settings.streakEnabled && (
            <div
              className="hidden sm:flex items-center gap-1 bg-error-container/70 px-space-sm py-1.5 rounded-full"
              title={`En uzun serin: ${state.streak.best} gün`}
            >
              <span className="font-label-md text-label-md text-on-error-container tabular-nums">
                🔥 {hydrated ? streak : 0} Gün
              </span>
            </div>
          )}
          <Link
            href="/matematik/analiz"
            className="w-10 h-10 rounded-full flex items-center justify-center bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all"
            title="Başarı ve Gelişim Karnem"
          >
            <span className="material-symbols-outlined text-[20px]">insights</span>
          </Link>
          <div className="flex items-center gap-space-xs pl-space-xs">
            <span className="w-8 h-8 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center font-label-sm text-label-sm">
              KÂ
            </span>
            <span className="hidden md:block font-label-md text-label-md text-on-surface">Kâşif</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="w-full bg-surface-container-lowest mt-space-xl">
      <div className="w-full px-gutter py-space-lg flex flex-col md:flex-row items-center justify-between gap-space-md">
        <div className="flex items-center gap-space-xs">
          <span className="font-headline-sm text-headline-sm text-primary">Matematik Kâşifleri</span>
          <span className="font-body-sm text-body-sm text-on-surface-variant">
            • TYMM 5. Sınıf Matematik Öğrenme Motoru
          </span>
        </div>
        <div className="flex items-center gap-space-md">
          <Link className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors" href="/matematik">
            Üniteler
          </Link>
          <Link className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors" href="/matematik/analiz">
            Karnem
          </Link>
          <Link className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors" href="/admin">
            İçerik Masası
          </Link>
        </div>
        <div className="font-label-sm text-label-sm text-on-surface-variant">
          Müfredat kaynağı: TYMM (tymm.meb.gov.tr)
        </div>
      </div>
    </footer>
  );
}
