import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LanguageContextType {
  language: 'ru' | 'en';
  toggleLanguage: (lang: 'ru' | 'en') => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<'ru' | 'en'>('en');

  const toggleLanguage = (lang: 'ru' | 'en') => {
    setLanguage(lang);
    localStorage.setItem('language', lang);  // сохраняем в localStorage, если нужно
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
