
import React, { createContext, useState, useContext, useEffect } from 'react';
import { appTranslations } from '../utils/translations';

export type Language = 'sq' | 'en';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
  translations: typeof appTranslations['sq'];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    // Check localStorage if available, default to 'sq'
    if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('appLanguage');
        return (saved === 'en' || saved === 'sq') ? saved : 'sq';
    }
    return 'sq';
  });

  useEffect(() => {
    localStorage.setItem('appLanguage', language);
    document.documentElement.lang = language;
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'sq' ? 'en' : 'sq');
  };

  // Helper to get nested translation values
  const t = (path: string): string => {
    const keys = path.split('.');
    let current: any = appTranslations[language];
    for (const key of keys) {
      if (current[key] === undefined) {
         return path; // Return key if translation missing
      }
      current = current[key];
    }
    return typeof current === 'string' ? current : path;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t, translations: appTranslations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
