import { useEffect, useState } from 'react';
import './App.css';
import { bear, coin as coinImage, highVoltage, rocket, trophy, notcoin } from './images';
import Arrow from './icons/Arrow';
import loadingGif from './images/loading.gif';

function App() {
  const initialMaxEnergy = 6000;
  const energyToReduce = 15;
  const energyRecoveryRate = 3;
  const recoveryInterval = 100;

  const [isLoading, setIsLoading] = useState(true); // Заставка
  const [points, setPoints] = useState(() => {
    const savedPoints = localStorage.getItem('points');
    return savedPoints ? parseInt(savedPoints, 10) : 0;
  });
  
  const [energy, setEnergy] = useState(() => {
    const savedEnergy = localStorage.getItem('energy');
    return savedEnergy ? parseInt(savedEnergy, 10) : initialMaxEnergy;
  });

  const [maxEnergy, setMaxEnergy] = useState(initialMaxEnergy); // Максимальная энергия
  const [lastUpdateTime, setLastUpdateTime] = useState(() => {
    const savedTime = localStorage.getItem('lastUpdateTime');
    return savedTime ? parseInt(savedTime, 10) : Date.now();
  });

  const [coins, setCoins] = useState<{ id: number, x: number, y: number }[]>([]);
  const [currentPage, setCurrentPage] = useState('home'); // Управляем навигацией
  const [isShaking, setIsShaking] = useState(false);
  const [coinsPerClick, setCoinsPerClick] = useState(1); // Количество монет за клик

  const pointsToAdd = coinsPerClick;

  const calculateRecoveredEnergy = () => {
    const currentTime = Date.now();
    const timeElapsed = currentTime - lastUpdateTime;
    const energyRecovered = Math.floor((timeElapsed / recoveryInterval) * energyRecoveryRate);
    return Math.min(energy + energyRecovered, maxEnergy);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // 3 секунды заставка

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const recoveredEnergy = calculateRecoveredEnergy();
    setEnergy(recoveredEnergy);
    setLastUpdateTime(Date.now());
  }, []);

  useEffect(() => {
    localStorage.setItem('energy', energy.toString());
    localStorage.setItem('lastUpdateTime', lastUpdateTime.toString());
  }, [energy, lastUpdateTime]);

  useEffect(() => {
    const interval = setInterval(() => {
      setEnergy((prevEnergy) => Math.min(prevEnergy + energyRecoveryRate, maxEnergy));
      setLastUpdateTime(Date.now());
    }, recoveryInterval);

    return () => clearInterval(interval);
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (energy - energyToReduce < 0) {
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setPoints((prevPoints) => {
      const newPoints = prevPoints + pointsToAdd;
      localStorage.setItem('points', newPoints.toString());
      return newPoints;
    });

    setEnergy(energy - energyToReduce < 0 ? 0 : energy - energyToReduce);
    
    setCoins((prevCoins) => [...prevCoins, { id: Date.now() + 1000, x, y }]);

    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  };

  const handleCoinAnimationEnd = (id: number) => {
    setCoins((prevCoins) => prevCoins.filter(coin => coin.id !== id));
  };

  const handlePurchase = (purchaseType: string) => {
    if (points < 100) {
      alert('Недостаточно монет для покупки!');
      return;
    }

    setPoints((prevPoints) => {
      const newPoints = prevPoints - 100;
      localStorage.setItem('points', newPoints.toString());
      return newPoints;
    });

    if (purchaseType === 'increaseCoins') {
      setCoinsPerClick(2); // Удваиваем монеты за клик
    }

    if (purchaseType === 'increaseEnergy') {
      setMaxEnergy((prevMaxEnergy) => prevMaxEnergy + 200); // Увеличиваем максимальную энергию
    }
  };

  const renderShop = () => (
    <div className="shop-overlay">
      <h2>Магазин</h2>
      <ul>
        <li>
          Покупка 1: Удвоение монет за клик (100 монет)
          <button onClick={() => handlePurchase('increaseCoins')}>Купить</button>
        </li>
        <li>
          Покупка 2: Увеличение энергии на 200 единиц (100 монет)
          <button onClick={() => handlePurchase('increaseEnergy')}>Купить</button>
        </li>
      </ul>
      <button onClick={() => setCurrentPage('home')}>Назад</button>
    </div>
  );

  const renderContent = () => {
    switch (currentPage) {
      case 'home':
        return (
          <>
            <div className="mt-12 text-5xl font-bold flex items-center">              
              <img src={coinImage} width={44} height={44} alt="Static Coin" />
              <span className="ml-2">{points.toLocaleString()}</span>
            </div>
            <div className="text-base mt-2 flex items-center">              
              <img src={trophy} width={24} height={24} />
              <span className="ml-1">Gold <Arrow size={18} className="ml-0 mb-1 inline-block" /></span>
            </div>
          </>
        );
      case 'shop':
        return renderShop(); // Показываем магазин
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="loading-screen">
        <img src={loadingGif} alt="Loading..." />
      </div>
    );
  }

  return (
    <div className="bg-gradient-main min-h-screen px-4 flex flex-col items-center text-white font-medium">
      <div className="absolute inset-0 h-1/2 bg-gradient-overlay z-0"></div>
      <div className="absolute inset-0 flex items-center justify-center z-0">
        <div className="radial-gradient-overlay"></div>
      </div>

      <div className="w-full z-10 min-h-screen flex flex-col items-center text-white">
        <div className="fixed top-0 left-0 w-full px-4 pt-8 z-10 flex flex-col items-center text-white">
          <div className="w-full cursor-pointer" onClick={() => setCurrentPage('home')}>
            <div className="bg-[#1f1f1f] text-center py-2 rounded-xl">
              <p className="text-lg">Join Kingdom <Arrow size={18} className="ml-0 mb-1 inline-block" /></p>
            </div>
          </div>
          {renderContent()}
        </div>

        <div className="fixed bottom-0 left-0 w-full px-4 pb-4 z-10">
          <div className="w-full flex justify-between gap-2">
            <div className="w-1/3 flex items-center justify-start max-w-32">
              <div className="flex items-center justify-center">
                <img src={highVoltage} width={44} height={44} alt="HighVoltage" />
                <div className="ml-2 text-left">
                  <span className="text-white text-2xl font-bold block">{energy}</span>
                  <span className="text-white text-large opacity-75">/ {maxEnergy}</span>
                </div>
              </div>
            </div>
            <div className="flex-grow flex items-center max-w-60 text-sm">
              <div className="w-full bg-[#fad256] py-4 rounded-2xl flex justify-around">
                <button className="flex flex-col items-center gap-1" onClick={() => setCurrentPage('frend')}>
                  <img src={bear} width={24} height={24} alt="Frend" />
                  <span>Frend</span>
                </button>
                <div className="h-[48px] w-[2px] bg-[#fddb6d]"></div>
                <button className="flex flex-col items-center gap-1" onClick={() => setCurrentPage('earn')}>
                  <img src={coinImage} width={24} height={24} alt="Earn" />
                  <span>Earn</span>
                </button>
                <div className="h-[48px] w-[2px] bg-[#fddb6d]"></div>
                <button className="flex flex-col items-center gap-1" onClick={() => setCurrentPage('shop')}>
                  <img src={rocket} width={24} height={24} alt="Shop" />
                  <span>Shop</span>
                </button>
              </div>
            </div>
          </div>
          <div className="w-fill bg-[#f9c035] rounded-full mt-4">
            <div className="bg-gradient-to-r from-[#f3c45a] to-[#fffad0] h-4 rounded-full" style={{ width: `${(energy / maxEnergy) * 100}%` }}></div>
          </div>
        </div>

        <div className="flex-grow flex items-center justify-center">
          <div className="relative mt-4" onClick={handleClick}>
            <img src={notcoin} width={256} height={256} className={isShaking ? 'shake' : ''} alt="notcoin" />
            {coins.map((coin) => (
              <div
                key={coin.id}
                className="absolute opacity-100 coin"
                style={{
                  top: `${coin.y}px`,
                  left: `${coin.x}px`,
                  animation: `fall 1s ease forwards`
                }}
                onAnimationEnd={() => handleCoinAnimationEnd(coin.id)}
              >
                <img src={coinImage} alt="Coin" width={30} height={30} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;