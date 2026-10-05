import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from './translations';

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [lang, setLangState] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('rani-language');
        if (saved === 'en' || saved === 'ta') return saved;
      } catch (e) {}
    }
    return 'ta'; // Tamil default on first visit
  });

  const setLang = (newLang) => {
    if (newLang !== 'en' && newLang !== 'ta') return;
    setLangState(newLang);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('rani-language', newLang);
        document.documentElement.lang = newLang;
      } catch (e) {}
    }
  };

  const toggleLang = () => {
    setLang(lang === 'ta' ? 'en' : 'ta');
  };

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
    }
  }, [lang]);

  const t = translations[lang] || translations.ta;

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t, isTamil: lang === 'ta' }}>
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

export default LanguageContext;
