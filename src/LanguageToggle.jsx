import React from 'react';
import { useLanguage } from './LanguageContext';

export const LanguageToggle = ({ className = '' }) => {
  const { lang, setLang } = useLanguage();

  return (
    <div 
      className={`inline-flex items-center p-0.5 rounded-lg border border-[#D6CAB8] bg-[#FAF5ED] shadow-xs select-none ${className}`}
      role="group"
      aria-label="Select website language"
    >
      <button
        type="button"
        onClick={() => setLang('ta')}
        aria-pressed={lang === 'ta'}
        aria-label="Change language to Tamil"
        className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#214A38] focus:ring-offset-1 cursor-pointer ${
          lang === 'ta'
            ? 'bg-[#214A38] text-white shadow-xs font-tamil'
            : 'text-[#1D2921] hover:text-[#214A38] hover:bg-white/80 font-tamil'
        }`}
      >
        தமிழ்
      </button>

      <span className="text-[#D6CAB8] text-xs px-0.5 select-none" aria-hidden="true">|</span>

      <button
        type="button"
        onClick={() => setLang('en')}
        aria-pressed={lang === 'en'}
        aria-label="Change language to English"
        className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#214A38] focus:ring-offset-1 cursor-pointer ${
          lang === 'en'
            ? 'bg-[#214A38] text-white shadow-xs'
            : 'text-[#1D2921] hover:text-[#214A38] hover:bg-white/80'
        }`}
      >
        English
      </button>
    </div>
  );
};

export default LanguageToggle;
