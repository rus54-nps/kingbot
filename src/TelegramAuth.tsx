import React, { useEffect } from 'react';

// Расширение глобального интерфейса Window
declare global {
  interface Window {
    TelegramLoginWidget?: {
      callback: (user: { id: number; first_name: string; username: string; photo_url: string }) => void;
    };
  }
}

interface TelegramAuthProps {
  setUser: (user: { id: number; first_name: string; username: string; photo_url: string }) => void;
}

const TelegramAuth: React.FC<TelegramAuthProps> = ({ setUser }) => {
  useEffect(() => {
    const widgetContainer = document.getElementById('telegram-login-widget');
    if (widgetContainer && !widgetContainer.childElementCount) {
      // Инициализация TelegramLoginWidget
      window.TelegramLoginWidget = {
        callback: (user: { id: number; first_name: string; username: string; photo_url: string }) => {
          setUser(user);
          localStorage.setItem('telegramUser', JSON.stringify(user)); // Сохраняем данные в localStorage
        },
      };
      
      // Добавление виджета Telegram
      const script = document.createElement('script');
      script.src = 'https://telegram.org/js/telegram-widget.js?19';
      script.async = true;
      script.setAttribute('data-telegram-login', 'King-Koin'); // Укажите username вашего бота
      script.setAttribute('data-size', 'large');
      script.setAttribute('data-radius', '10');
      script.setAttribute('data-auth-url', 'https://t.me/KingCoinClick_bot/KingCoin');
      script.setAttribute('data-request-access', 'write');
      widgetContainer.appendChild(script);
    }
  }, [setUser]);

  return <div id="telegram-login-widget"></div>;
};

export default TelegramAuth;
