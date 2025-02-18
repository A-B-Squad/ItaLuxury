export function getLanguage(): string {
  if (typeof window !== 'undefined') {
    // Check localStorage first
    const storedLang = localStorage.getItem('lang');
    if (storedLang) return storedLang;

    // Then check browser language
    const browserLang = navigator.language.split('-')[0];
    if (['fr', 'ar','en'].includes(browserLang)) return browserLang;

    // Then check system language
    const systemLang = Intl.DateTimeFormat().resolvedOptions().locale.split('-')[0];
    if (['fr', 'ar','en'].includes(systemLang)) return systemLang;
  }

  // Default fallback
  return 'fr';
}