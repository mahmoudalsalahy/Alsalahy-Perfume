import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { translations } from '../utils/translations';

const I18nContext = createContext();

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('alsalahy_lang') || 'ar');

  useEffect(() => {
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    localStorage.setItem('alsalahy_lang', lang);
  }, [lang]);

  const t = useCallback((key) => translations[lang]?.[key] || key, [lang]);

  const toggleLanguage = useCallback(() => {
    setLang(prev => prev === 'ar' ? 'en' : 'ar');
  }, []);

  const isRTL = lang === 'ar';

  return (
    <I18nContext.Provider value={{ lang, t, toggleLanguage, isRTL }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
