import { useEffect, useState } from 'react';
import './App.css';
import { coin as coinImage, highVoltage, shp, trophy, notcoin, sett, hom, top, frnd, medal, autfr, gam, task, zvuk, fon2, loadingGif } from './images';
import Shop from './Shop';
import Setting from './Setting';
import Achiv from './Ach';
import Autfrm from './Autfrm';

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
  const [taps, setTaps] = useState<number>(0);
  const [items, setItems] = useState([
    { id: 1, name: 'Золотые Руки', price: 3000, incomePerHour: 0, level: 1 },
    { id: 2, name: 'Счастливая Монета', price: 2500, incomePerHour: 330, level: 1 },
    { id: 3, name: 'Счастливая Монета', price: 2500, incomePerHour: 500, level: 1 },
  ]);

  const handleTap = () => {
    setTaps(prevTaps => prevTaps + 1);
  };

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

  const [showSettings, setShowSettings] = useState(false); // для управления отображением настроек

  // Функция для обработки клика по кнопке "Setting"
  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  //*АВТОФАРМ ЗАКРЫТ ДО 10МОНЕТ ЗА КЛИК (10ЛВЛ ТАБ)*//
  const isAutoFarmUnlocked = pointsToAdd >= 0;
  const [showLockedMessage, setShowLockedMessage] = useState(false);
  const openAutoFarm = () => {
    if (isAutoFarmUnlocked) {
      setCurrentPage('autfrm');
    } else {
      setShowLockedMessage(true); // Показать сообщение
      setTimeout(() => setShowLockedMessage(false), 2000); // Скрыть сообщение через 2 секунды
    }
  };
  // Загружаем начальные значения из localStorage
  useEffect(() => {
    const savedPoints = localStorage.getItem('points');
    if (savedPoints) setPoints(Number(savedPoints));

    const savedItems = localStorage.getItem('autoFarmItems');
    if (savedItems) setItems(JSON.parse(savedItems));

    const lastIncomeTime = localStorage.getItem('lastIncomeTime');
    if (lastIncomeTime) {
      const timePassed = (Date.now() - Number(lastIncomeTime)) / 1000; // В секундах
      const passiveIncome = items.reduce(
        (total, item) => total + (item.incomePerHour * (timePassed / 3600)),
        0
      );
      setPoints(prevPoints => prevPoints + Math.floor(passiveIncome));
    }
  }, []);

  const [showGameModal, setShowGameModal] = useState(false);
  const handleGameClick = () => {
    setShowGameModal(true);
    setTimeout(() => setShowGameModal(false), 2000); // Скрываем окно через 2 секунды
  };

  // Таймер для начисления дохода от автофарма
  useEffect(() => {
    const interval = setInterval(() => {
      const totalIncome = items.reduce((total, item) => total + item.incomePerHour * (1 / 3600), 0); // Доход в секунду
      setPoints(prevPoints => prevPoints + Math.floor(totalIncome));
      localStorage.setItem('points', (points + Math.floor(totalIncome)).toString());
    }, 1000);

    return () => {
      clearInterval(interval);
      localStorage.setItem('lastIncomeTime', Date.now().toString());
    };
  }, [items, points]);

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

  const [isMusicOn, setIsMusicOn] = useState(() => {
    const savedMusicSetting = localStorage.getItem('isMusicOn');
    return savedMusicSetting ? JSON.parse(savedMusicSetting) : false; // Звук выключен по умолчанию
  });

  useEffect(() => {
    const backgroundAudio = new Audio(fon2);
    backgroundAudio.loop = true; // Зацикливание музыки

    // Восстанавливаем положение музыки, если оно сохранено в localStorage
    const savedTime = localStorage.getItem('audioCurrentTime');
    if (savedTime) {
      backgroundAudio.currentTime = parseFloat(savedTime);
    }

    const manageMusic = async () => {
      if (isMusicOn) {
        try {
          await backgroundAudio.play();
        } catch (error) {
          console.error("Ошибка при воспроизведении музыки:", error);
        }
      } else {
        backgroundAudio.pause();
      }
    };

    manageMusic();

    // Сохраняем текущее время музыки перед выгрузкой страницы
    const saveAudioPosition = () => {
      localStorage.setItem('audioCurrentTime', backgroundAudio.currentTime.toString());
    };

    window.addEventListener('beforeunload', saveAudioPosition);

    return () => {
      saveAudioPosition();
      backgroundAudio.pause();
      backgroundAudio.currentTime = 0;
      window.removeEventListener('beforeunload', saveAudioPosition);
    };
  }, [isMusicOn]);

  const toggleMusic = () => {
    setIsMusicOn((prev: boolean) => {
      const newState = !prev;
      localStorage.setItem('isMusicOn', JSON.stringify(newState)); // Сохраняем состояние звука
      return newState;
    });
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (energy - energyToReduce < 0) {
      return;
    }

    const audio = new Audio(zvuk);
    audio.play();

    handleTap();

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
    console.log("Текущая страница:", currentPage); // Отладочная информация
    switch (currentPage) {
      case 'home':
        return (
          <>
            <div style={{ position: 'relative' }}>
              <div
                className="absolute text-5xl font-bold flex items-center"
                style={{ top: '70px', left: '50%', transform: 'translateX(-70% )' }}
              >
                <img src={coinImage} width={44} height={44} alt="Static Coin" />
                <span className="ml-2">{Math.floor(points).toLocaleString()}</span>
              </div>
              <div
                className="absolute text-base flex items-center"
                style={{ top: 'calc(85px + 44px)', left: '50%', transform: 'translateX(-70%)' }}
              >
                <img src={trophy} width={24} height={24} />
                <span className="ml-1">Gold</span>
              </div>
            </div>
          </>
        );
        /*Нижний блок*/
      case 'shop':
        return (
          <Shop
          points={points}
          setPoints={setPoints}
          setCurrentPage={setCurrentPage}
          setMaxEnergy={setMaxEnergy}
          setEnergyRecoveryRate={setEnergyRecoveryRate}
          setPointsToAdd={setPointsToAdd}
          />
        );
      case 'autfrm':
        return (
          <Autfrm
          points={points}
          setPoints={setPoints}
          setCurrentPage={setCurrentPage}
          />
        );

      case 'tasks':
        return <h2>Страница "Tasks"</h2>;
        /*Верхний блок*/
      case 'top':
        return <h2>Страница "Top"</h2>
      case 'friend':
        return <h2>Страница "Friend"</h2>;
      case 'achiv':
        return (
          <Achiv
          setCurrentPage={setCurrentPage}
          points={points}
          maxEnergy={maxEnergy}
          taps={taps}
           />
         );
      default:
        return <h2>Неизвестная страница</h2>;
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
    <div className="App min-h-screen px-4 flex flex-col items-center text-white font-medium">
      <div className="absolute inset-0 h-1/2 bg-gradient-overlay z-0"></div>
      <div className="absolute inset-0 flex items-center justify-center z-0">
        <div className="radial-gradient-overlay"></div>
      </div>
  
      <div className="w-full z-10 min-h-screen flex flex-col items-center text-white">
  
        {/* Верхний блок с кнопками*/}
        <div className="fixed top-4 left-0 w-full px-4 flex justify-center z-10">
          <div className="w-full max-w-md py-4 rounded-2xl flex justify-around">
            <button className="flex flex-col items-center gap-1" onClick={() => setCurrentPage('home')}>
              <img src={hom} width={24} height={24} alt="Home" />
              <span>Home</span>
            </button>
            <div className="h-[48px] w-[2px] bg-[#bf1515]"></div>
            <button className="flex flex-col items-center gap-1" onClick={() => setCurrentPage('top')}>
              <img src={top} width={24} height={24} alt="Top" />
              <span>Top</span>
            </button>
            <div className="h-[48px] w-[2px] bg-[#bf1515]"></div>
            <button className="flex flex-col items-center gap-1" onClick={() => setCurrentPage('friend')}>
              <img src={frnd} width={24} height={24} alt="Friend" />
              <span>Friend</span>
            </button>
            <div className="h-[48px] w-[2px] bg-[#bf1515]"></div>
            <button className="flex flex-col items-center gap-1" onClick={() => setCurrentPage('achiv')}>
              <img src={medal} width={24} height={24} alt="Achiv" />
              <span>Medals</span>
            </button>
          </div>
        </div>

        {/*Кнопка настрек*/}
        <button className="setting-button fixed top-20 right-4" style={{ marginTop: '30px' }} onClick={toggleSettings}>
          <img src={sett} alt="Setting" width={24} height={24} />
        </button>
          {showSettings && (
        <Setting
          onClose={toggleSettings}
          isMusicOn={isMusicOn}
          toggleMusic={toggleMusic}
        />
          )}
  
        {/* Отображение содержимого с использованием renderContent */}
        <div className="fixed top-20 left-0 w-full px-4 pt-2 z-20 flex flex-col items-center text-white">
          {renderContent()}
        </div>
  
        <div className="relative flex-grow flex flex-col items-center justify-center relative" style={{ marginTop: '80px'}}>
          <div className="relative mb-4" onClick={handleClick}>
            <img src={notcoin} width={250} height={200} className={isShaking ? 'shake' : ''} style={{ transform: 'translateX(-20px)' }} alt="notcoin"/>
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

          {/* Энергия под монетой */}
          <div className="flex flex-col items-center mt-2">
            <div className="flex items-center justify-center">
             <img src={highVoltage} width={24} height={24} alt="HighVoltage" className="mr-2" />
              <span className="text-white text-xl font-bold">{energy}</span>
            </div>
            <span className="text-white opacity-75 text-sm">/ {maxEnergy}</span>
    
            {/* Увеличенная полоска энергии */}
            <div className="bg-[#f9c035] rounded-full mt-2" style={{ width: '300px' }}>
              <div className="bg-gradient-to-r from-[#f3c45a] to-[#fffad0] h-4 rounded-full" style={{ width: `${(energy /  maxEnergy) * 100}%` }}>
              </div>
            </div>
          </div>
        </div>
  
        {/* Нижний блок с кнопками (frend, earn, shop, achiv) */}
        <div className="fixed bottom-4 left-0 w-full px-4 flex justify-center z-10">
          <div className="w-full max-w-md  py-4 rounded-2xl flex justify-around">
            <button className="flex flex-col items-center gap-1" onClick={() => setCurrentPage('shop')}>
              <img src={shp} width={24} height={24} alt="Shop" />
              <span>Shop</span>
            </button>
            <div className="h-[48px] w-[2px] bg-[#bf1515]"></div>
            <button className="flex flex-col items-center gap-1" onClick={openAutoFarm}>
              <img src={autfr} width={24} height={24} alt="Autofarm" style={{ opacity: isAutoFarmUnlocked ? 1 : 0.5 }} />
              <span>Autofarm</span>
            </button>
            <div className="h-[48px] w-[2px] bg-[#bf1515]"></div>
            <button className="flex flex-col items-center gap-1" onClick={handleGameClick}>
              <img src={gam} width={24} height={24} alt="Game" />
              <span>Game</span>
            </button>
            <div className="h-[48px] w-[2px] bg-[#bf1515]"></div>
            <button className="flex flex-col items-center gap-1" onClick={() => setCurrentPage('tasks')}>
              <img src={task} width={24} height={24} alt="Tasks" />
              <span>Tasks</span>
            </button>
          </div>
        </div>
        {showLockedMessage && (
          <div className="locked-message">
            <span>Разблокировка будет доступна после улучшение тапа на 10lvl</span>
          </div>
        )}
        {showGameModal && (
          <div className="locked-message">
          <span>Скоро появится</span>
        </div>
        )}
      </div>
    </div>
  );
  
  

  
}

export default App;