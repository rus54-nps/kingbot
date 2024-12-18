import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface LanguageContextType {
  language: 'ru' | 'en';
  toggleLanguage: (lang: 'ru' | 'en') => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Загружаем язык из localStorage, если он есть, иначе по умолчанию 'en'
  const savedLanguage = localStorage.getItem('language') as 'ru' | 'en' | null;
  const [language, setLanguage] = useState<'ru' | 'en'>(savedLanguage || 'en');

  const toggleLanguage = (lang: 'ru' | 'en') => {
    setLanguage(lang);
    localStorage.setItem('language', lang);  // Сохраняем выбранный язык в localStorage
  };

  useEffect(() => {
    // При монтировании компонента, если язык сохранен в localStorage, используем его
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, [savedLanguage]);

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
