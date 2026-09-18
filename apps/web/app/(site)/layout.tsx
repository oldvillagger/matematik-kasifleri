import { loadSettings } from "../lib/settings";
import { ProgressProvider } from "../lib/ProgressProvider";
import { SiteFooter, SiteHeader } from "../lib/SiteChrome";

/**
 * Öğrenci tarafının kabuğu. /admin bu grubun dışında kalır — içerik masası
 * öğrenci üst barını, puanı, seriyi göstermez.
 */
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await loadSettings();

  return (
    <ProgressProvider settings={settings}>
      <SiteHeader />
      {children}
      <SiteFooter />
    </ProgressProvider>
  );
}
