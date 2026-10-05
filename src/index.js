import React from 'react';
import ReactDOM from 'react-dom/client';
import { LanguageProvider } from './LanguageContext';
import LandingPage from './LandingPage';

export { LanguageProvider, useLanguage } from './LanguageContext';
export { LanguageToggle } from './LanguageToggle';
export { HeroSection } from './HeroSection';
export { useScrollAnimations } from './ScrollAnimations';
export { translations } from './translations';
export { LandingPage } from './LandingPage';

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <LanguageProvider>
        <LandingPage />
      </LanguageProvider>
    </React.StrictMode>
  );
}
