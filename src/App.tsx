import { useEffect, useState } from 'react';
import './App.css';
import { bear, coin as coinImage, highVoltage, shp, trophy, notcoin } from './images';
import Arrow from './icons/Arrow';
import loadingGif from './images/loading.gif';
import Shop from './Shop';

function App() {
  const initialMaxEnergy = 500; // Старт энергия
  const energyToReduce = 1; // Энергия за нажатие
  const recoveryInterval = 1000; // Интервал времени 1000 - 1 сек

  const [maxEnergy, setMaxEnergy] = useState(() => {
    const savedMaxEnergy = localStorage.getItem('maxEnergy');
    return savedMaxEnergy ? parseInt(savedMaxEnergy, 10) : initialMaxEnergy;
  });

  const [energyRecoveryRate, setEnergyRecoveryRate] = useState(1); // Кол-во энергии в сек
  const [energy, setEnergy] = useState(() => {
    const savedEnergy = localStorage.getItem('energy');
    return savedEnergy ? parseInt(savedEnergy, 10) : maxEnergy;
  });

  const [lastUpdateTime, setLastUpdateTime] = useState(() => {
    const savedTime = localStorage.getItem('lastUpdateTime');
    return savedTime && !isNaN(parseInt(savedTime, 10)) ? parseInt(savedTime, 10) : Date.now();
  });

  const [isLoading, setIsLoading] = useState(true); // Заставка
  const [points, setPoints] = useState(() => {
    const savedPoints = localStorage.getItem('points');
    return savedPoints ? parseInt(savedPoints, 10) : 0;
  });

  const [coins, setCoins] = useState<{ id: number, x: number, y: number }[]>([]);
  const [currentPage, setCurrentPage] = useState('home');
  const [isShaking, setIsShaking] = useState(false);
  const [pointsToAdd, setPointsToAdd] = useState(1)

  // Рассчитываем восстановленную энергию на основе времени
  const calculateRecoveredEnergy = () => {
    if (isNaN(energy)) {
      return maxEnergy; // Если энергия не определена, возвращаем максимальное значение
    }
    
    const currentTime = Date.now();
    const timeElapsed = currentTime - lastUpdateTime;
    const energyRecovered = Math.floor((timeElapsed / recoveryInterval) * energyRecoveryRate);
    return Math.min(energy + energyRecovered, maxEnergy);
  };

  useEffect(() => {
    // Показать заставку в течение 3 секунд
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // 3 секунды заставка

    return () => clearTimeout(timer); // Очищаем таймер, если компонент размонтируется
  }, []);

  useEffect(() => {
    // Восстанавливаем энергию при загрузке приложения
    const recoveredEnergy = calculateRecoveredEnergy();
    setEnergy(recoveredEnergy);
    setLastUpdateTime(Date.now());
  }, []);

  useEffect(() => {
    // Сохраняем энергию и время в localStorage при изменении энергии
    localStorage.setItem('energy', energy.toString());
    localStorage.setItem('lastUpdateTime', lastUpdateTime.toString());
  }, [energy, lastUpdateTime]);

  useEffect(() => {
    // Восстановление энергии каждые 1000ms
    const interval = setInterval(() => {
      setEnergy((prevEnergy) => {
        const newEnergy = Math.min(prevEnergy + energyRecoveryRate, maxEnergy);
        setLastUpdateTime(Date.now());
        return newEnergy;
      });
    }, recoveryInterval);

    return () => clearInterval(interval);
  }, [energyRecoveryRate, maxEnergy]); // Добавляем зависимость от maxEnergy

  useEffect(() => {
    // Сохраняем максимальную энергию в localStorage при её изменении
    localStorage.setItem('maxEnergy', maxEnergy.toString());
    if (energy > maxEnergy) {
      setEnergy(maxEnergy); // Обновляем энергию, если она превышает новый максимум
    }
  }, [maxEnergy, energy]);

  useEffect(() => {
    const savedPointsToAdd = localStorage.getItem('pointsToAdd');
    if (savedPointsToAdd) {
      setPointsToAdd(parseInt(savedPointsToAdd, 10)); // Восстановление Тапа
    }
  
    const savedEnergyRecoveryRate = localStorage.getItem('energyRecoveryRate');
    if (savedEnergyRecoveryRate) {
      setEnergyRecoveryRate(parseInt(savedEnergyRecoveryRate, 10)); // Восстановление регенерации
    }
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

    // Добавляем новую монету
    setCoins((prevCoins) => [...prevCoins, { id: Date.now() + 1000, x, y }]);
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  };

  const handleCoinAnimationEnd = (id: number) => {
    setCoins((prevCoins) => prevCoins.filter(coin => coin.id !== id));
  };

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
      case 'frend':
        return <h2>Страница "Frend"</h2>;
      case 'earn':
        return <h2>Страница "Earn"</h2>;
      case 'shop':
        return (
          <Shop
            points={points}
            setPoints={setPoints}
            setCurrentPage={setCurrentPage}
            setMaxEnergy={setMaxEnergy} // Передаём setMaxEnergy для изменения максимальной энергии
            setEnergyRecoveryRate={setEnergyRecoveryRate}
            setPointsToAdd={setPointsToAdd}
          />
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    // Показываем заставку
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
              <div className="w-full bg-[#91bfa9] py-4 rounded-2xl flex justify-around">
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
                  <img src={shp} width={24} height={24} alt="Shop" />
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
          <div className="relative -mt-30" onClick={handleClick}>
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
