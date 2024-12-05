import { useState, useEffect } from 'react';
import './Frend.css'; // Подключение CSS

const FriendPage = () => {
  const [referralLink, setReferralLink] = useState('');
  const [referralsCount, setReferralsCount] = useState(0);

  useEffect(() => {
    // Получение уникального идентификатора пользователя
    const userId = localStorage.getItem('userId') || 'defaultUser';
    setReferralLink(`https://t.me/KingCoinClick_bot/KingCoin?ref=${userId}`);

    // Проверка, если текущий пользователь пришел по реферальной ссылке
    const urlParams = new URLSearchParams(window.location.search);
    const referrer = urlParams.get('ref');
    if (referrer) {
      // Увеличиваем счётчик переходов и даем монеты тому, кто перешел
      let currentCount: number = localStorage.getItem(`referrals-${referrer}`) ? parseInt(localStorage.getItem(`referrals-${referrer}`)!, 10) : 0;
      currentCount++;
      localStorage.setItem(`referrals-${referrer}`, currentCount.toString()); // Сохраняем как строку

      // Добавляем монеты владельцу ссылки
      let referrerCoins: number = parseInt(localStorage.getItem(`coins-${referrer}`) || '0', 10);
      referrerCoins += 1000; // Добавляем 1000 монет владельцу ссылки
      localStorage.setItem(`coins-${referrer}`, referrerCoins.toString());

      // Добавляем монеты тому, кто перешел по ссылке
      let currentUserCoins: number = parseInt(localStorage.getItem(`coins-${userId}`) || '0', 10);
      currentUserCoins += 1000; // Добавляем 1000 монет новому пользователю
      localStorage.setItem(`coins-${userId}`, currentUserCoins.toString());
    }

    // Загружаем количество рефералов для текущего пользователя
    const referralCount = localStorage.getItem(`referrals-${userId}`);
    setReferralsCount(referralCount ? parseInt(referralCount, 10) : 0);
  }, []);

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink).then(() => {
      alert('Ссылка скопирована!');
    });
  };

  return (
    <div className="friend-page-container">
      <h1>Пригласить друзей</h1>
      <p>Поделитесь своей реферальной ссылкой:</p>
      <input 
        type="text" 
        value={referralLink} 
        readOnly 
      />
      <button onClick={copyReferralLink}>Скопировать ссылку</button>
      
      <div className="referrals-count">
        <h2>Количество людей, перешедших по вашей ссылке: {referralsCount}</h2>
      </div>
    </div>
  );
};

export default FriendPage;
