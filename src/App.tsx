import { useEffect, useState } from 'react';
import './App.css';
import { bear, coin, highVoltage, rocket, trophy, notcoin } from './images';
import Arrow from './icons/Arrow';
import loadingGif from './images/loading.gif'; 
import fallingCoin from './images/coin.png'; // Картинка выпадающей монеты

function App() {
  const [isLoading, setIsLoading] = useState(true); 
  const [points, setPoints] = useState(() => {
    const savedPoints = localStorage.getItem('points');
    return savedPoints ? parseInt(savedPoints, 10) : 0;
  });

  // Загружаем сохраненную энергию или устанавливаем по умолчанию
  const [energy, setEnergy] = useState(() => {
    const savedEnergy = localStorage.getItem('energy');
    return savedEnergy ? parseInt(savedEnergy, 10) : 6000;
  });

  const [clicks, setClicks] = useState<{ id: number, x: number, y: number }[]>([]);
  const [fallingCoins, setFallingCoins] = useState<{ id: number, x: number, y: number }[]>([]);
  const [currentPage, setCurrentPage] = useState('home');
  const [isShaking, setIsShaking] = useState(false); // Для анимации дрожания
  const pointsToAdd = 1;
  const energyToReduce = 15;

  // Скрываем загрузочный экран через 3 секунды
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); 

    return () => clearTimeout(timer);
  }, []);

  // Сохраняем энергию в localStorage при каждом ее изменении
  useEffect(() => {
    localStorage.setItem('energy', energy.toString());
  }, [energy]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (energy - energyToReduce < 0) {
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);

    setPoints((prevPoints) => {
      const newPoints = prevPoints + pointsToAdd;
      localStorage.setItem('points', newPoints.toString());
      return newPoints;
    });

    setEnergy(energy - energyToReduce < 0 ? 0 : energy - energyToReduce);
    setFallingCoins([...fallingCoins, { id: Date.now(), x, y }]);
    setClicks([...clicks, { id: Date.now(), x, y }]);
  };

  const handleAnimationEnd = (id: number) => {
    setClicks((prevClicks) => prevClicks.filter(click => click.id !== id));
    setFallingCoins((prevCoins) => prevCoins.filter(coin => coin.id !== id));
  };

  // Восстанавливаем энергию каждую секунду
  useEffect(() => {
    const interval = setInterval(() => {
      setEnergy((prevEnergy) => Math.min(prevEnergy + 3, 6000));
    }, 1000); // Восстанавливаем 3 единицы энергии каждую секунду

    return () => clearInterval(interval);
  }, []);

  const renderContent = () => {
    switch (currentPage) {
      case 'home':
        return (
          <>
            <div className="mt-12 text-5xl font-bold flex items-center">
              <img src={coin} width={44} height={44} />
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
      case 'boost':
        return <h2>Страница "Boost"</h2>;
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
                  <span className="text-white text-large opacity-75">/ 6000</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-grow flex items-center justify-center">
          <div className={`relative mt-4 ${isShaking ? 'shaking' : ''}`} onClick={handleClick}>
            <img src={notcoin} width={256} height={256} alt="notcoin" />

            {fallingCoins.map((coin) => (
              <img
                key={coin.id}
                src={fallingCoin}
                alt="falling coin"
                className="falling-coin"
                style={{ left: `${coin.x - 16}px`, top: `${coin.y - 16}px` }}
                onAnimationEnd={() => handleAnimationEnd(coin.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;