declare namespace Telegram {
    interface User {
      id: number;
      first_name: string;
      last_name?: string;
      username?: string;
      language_code?: string;
      photo_url?: string;
    }
  
    interface WebApp {
      initData: string;
      initDataUnsafe: {
        user?: User;
      };
      ready: () => void;
      setBackgroundColor: (color: string) => void;
      setHeaderColor: (color: string) => void;
      MainButton: {
        text: string;
        isVisible: boolean;
        isActive: boolean;
        setText: (text: string) => MainButton;
        show: () => void;
        hide: () => void;
        onClick: (callback: () => void) => void;
        offClick: () => void;
      };
    }
  }
  declare global {
    interface Window {
      Telegram: {
        WebApp: Telegram.WebApp;
      };
    }
  }
  
  export {};
  