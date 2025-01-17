import { useEffect, useState } from 'react';
import './App.css';
import { coin as coinImage, highVoltage, shp, notcoin, sett, hom, top, frnd, medal, autfr, gam, task, zvuk, fon2, loadingGif, ava1 } from './images';
import Shop from './Shop';
import Setting from './Setting';
import Achiv from './Ach';
import Autfrm from './Autfrm';
import Game from './Game';
import Top from './Top';
import Profil from './Profil';
import FriendPage from './Frend';
import New from './New';
import Task from './Task';
import Den from './Denn';
import { LanguageProvider } from './LanguageContext';


function App() {
  const initialMaxEnergy = 500; // Старт энергия
  const energyToReduce = 1; // Энергия за нажатие
  const recoveryInterval = 60 * 1000; // Интервал времени 1000 - 1 сек
  

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
  const [isBuffActive, setIsBuffActive] = useState<boolean>(false);
  const [isBuffActiveSap, setIsBuffActiveSap] = useState<boolean>(false); // Статус активации баффа
  const [buffTime, setBuffTime] = useState<number | null>(null); // Время оставшегося действия баффа
  const [buffTimeSap] = useState<number>(0);
  

  const activateBuff = () => {
    setIsBuffActive(true);
    setBuffTime(600); // Устанавливаем 1 минуту для действия баффа
  };

  useEffect(() => {
    if (isBuffActive && buffTime !== null && buffTime > 0) {
      const timer = setInterval(() => {
        setBuffTime((prev) => (prev ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    } else {
      setIsBuffActive(false); // Деактивируем бафф по истечении времени
    }
  }, [isBuffActive, buffTime]);

  useEffect(() => {
    if (isBuffActiveSap && buffTime !== null && buffTime > 0) {
      const timer = setInterval(() => {
        setBuffTime((prev) => (prev ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    } else {
      setIsBuffActiveSap(false); // Деактивируем бафф по истечении времени
    }
  }, [isBuffActiveSap, buffTime]);

  useEffect(() => {
    if (isBuffActive) {
      setPointsToAdd((prev) => prev * 2); // Удваиваем добавляемые очки
    } else {
      setPointsToAdd((prev) => Math.max(1, prev / 2)); // Возвращаем к исходному значению
    }
  }, [isBuffActive]);

  const handleTap = () => {
    let coins = 1; // Базовое количество монет за тап
    if (isBuffActive) {
      coins *= 2; // Удваиваем количество монет, если бафф активен
    }
    setTaps((prevTaps) => prevTaps + coins); // Обновляем счетчик монет
  };

  // Рассчитываем восстановленную энергию на основе времени
  const calculateRecoveredEnergy = () => {
    if (isNaN(energy)) {
      return maxEnergy; // Если энергия не определена, возвращаем максимальное значение
    }
    const currentTime = Date.now();
    const timeElapsed = currentTime - lastUpdateTime;
    let energyRecovered = Math.floor((timeElapsed / recoveryInterval) * energyRecoveryRate);

    if (isBuffActiveSap && buffTimeSap > 0) {
      const missEnergy = maxEnergy - energy; // Рассчитываем недостающую энергию
      const energyToRestore = Math.floor(missEnergy * 0.5);
      energyRecovered += energyToRestore; // Увеличиваем восстановление энергии
    }

    return Math.min(energy + energyRecovered, maxEnergy);
  };

  

  const [showSettings, setShowSettings] = useState(false); // для управления отображением настроек

  // Функция для обработки клика по кнопке "Setting"
  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  //*АВТОФАРМ ЗАКРЫТ ДО 10МОНЕТ ЗА КЛИК (10ЛВ
  // Л ТАБ)*//
  const isAutoFarmUnlocked = pointsToAdd >= 10;
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

  // Таймер для начисления дохода от автофарма
  useEffect(() => {
    const interval = setInterval(() => {
      const totalIncome = items.reduce((total, item) => total + (item.incomePerHour / 3600), 0); // Доход в секунду
      const reducedIncome = totalIncome / 2.5; // Уменьшаем доход в 2.5 раза
      setPoints(prevPoints => {
        const newPoints = prevPoints + Math.floor(reducedIncome); // Обновляем на основе текущих очков
        localStorage.setItem('points', newPoints.toString());
        return newPoints;
      });
    }, 1000); // 1000 ms = 1 секунда

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


  //-------------------------------------------
  useEffect(() => {
    if (!isBuffActiveSap) {
      // Обычное восстановление энергии, если баф не активен
      const interval = setInterval(() => {
        setEnergy((prevEnergy) => {
          const nextEnergy = prevEnergy + energyRecoveryRate; // Добавляем прирост энергии
          if (nextEnergy !== prevEnergy) {
            setLastUpdateTime(Date.now()); // Обновляем время последнего изменения энергии
          }
          return nextEnergy >= maxEnergy ? maxEnergy : nextEnergy; // Ограничиваем значение maxEnergy
        });
      }, recoveryInterval);
  
      return () => clearInterval(interval);
    }
  }, [energyRecoveryRate, maxEnergy, isBuffActiveSap]); // Учитываем активность бафа
  
  useEffect(() => {
    if (isBuffActiveSap) {
      // Если баф активен, восстанавливаем 35% недостающей энергии за 20 секунд
      const missingEnergy = maxEnergy - energy;
      const energyPerTick = Math.floor((missingEnergy * 0.3) / 20); // Распределяем восстановление на 20 секунд
  
      const interval = setInterval(() => {
        setEnergy((prevEnergy) => {
          const nextEnergy = prevEnergy + energyPerTick;
          return nextEnergy >= maxEnergy ? maxEnergy : nextEnergy; // Ограничиваем значение maxEnergy
        });
      }, 1000); // Восстанавливаем по 1/20 энергии каждую секунду
  
      // Останавливаем баф через 20 секунд
      const timeout = setTimeout(() => {
        setIsBuffActiveSap(false); // Деактивируем баф
      }, 20000);
  
      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [isBuffActiveSap, energy, maxEnergy]);
  
  const activateBuffSap = () => {
    if (isBuffActiveSap) return; // Если баф уже активен, ничего не делаем
  
    setIsBuffActiveSap(true); // Активируем баф
    setBuffTime(20); // Устанавливаем длительность бафа
  
    const missingEnergy = maxEnergy - energy; // Рассчитываем недостающую энергию
    const energyIncrement = Math.floor((missingEnergy * 0.6) / 20); // Делим 50% на 20 секунд
  
    // Плавное восстановление энергии за 20 секунд
    const interval = setInterval(() => {
      setEnergy((prevEnergy) => {
        const newEnergy = prevEnergy + energyIncrement;
        return newEnergy >= maxEnergy ? maxEnergy : newEnergy;
      });
    }, 1000); // Восстановление каждую секунду
  
    // Деактивация бафа через 20 секунд
    setTimeout(() => {
      clearInterval(interval);
      setIsBuffActiveSap(false); // Деактивируем баф
      setBuffTime(null); // Сбрасываем время бафа
    }, 20000);
  };
  
  
//---------------------------------------------------


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

  const [isMusicOn, setIsMusicOn] = useState(false);

  useEffect(() => {
    const backgroundAudio = new Audio(fon2);
    backgroundAudio.loop = true; // Включаем зацикливание
  
    // Восстановление позиции из localStorage
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
  
    manageMusic(); // Запускаем музыку на старте
  
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
      localStorage.setItem('isMusicOn', JSON.stringify(newState));
      return newState;
    });
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (energy - energyToReduce < 10) {
      return;
    }
  
    if (isCoinSoundOn) {
      const audio = new Audio(zvuk);
      audio.play();
    }
  
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
  
    setCoins((prevCoins) => [...prevCoins, { id: Date.now() + 1000, x, y }]);
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 300);
  };
  

  const handleCoinAnimationEnd = (id: number) => {
    setCoins((prevCoins) => prevCoins.filter(coin => coin.id !== id));
  };

  const [isCoinSoundOn, setIsCoinSoundOn] = useState<boolean>(() => {
    const savedCoinSoundSetting = localStorage.getItem('isCoinSoundOn');
    return savedCoinSoundSetting ? JSON.parse(savedCoinSoundSetting) : true; // По умолчанию включен
  });
  
  const toggleCoinSound = () => {
    setIsCoinSoundOn((prev) => {
      const newState = !prev;
      localStorage.setItem('isCoinSoundOn', JSON.stringify(newState));
      return newState;
    });
  };

  const [username, setUsername] = useState<string | null>(() => {
    return localStorage.getItem('username');
  });
  const [isNicknameModalVisible, setNicknameModalVisible] = useState(false);

  useEffect(() => {
    if (!username) {
      setNicknameModalVisible(true); // Показываем окно, если ник не задан
    }
  }, [username]);

  const handleSaveUsername = (newUsername: string) => {
    const trimmedUsername = newUsername.trim();
    
    // Проверка на английские буквы
    const isValidUsername = /^[A-Za-z]+$/.test(trimmedUsername);
    
    if (!isValidUsername) {
      alert("Никнейм должен содержать только английские буквы!");
      return;
    }
  
    if (trimmedUsername.length > 16) {
      alert("Никнейм не должен превышать 16 символов!");
      return;
    }
  
    setUsername(trimmedUsername);
    localStorage.setItem('username', trimmedUsername);
    setNicknameModalVisible(false);
  };

  const [selectedIcon, setSelectedIcon] = useState<string>(() => {
    return localStorage.getItem('selectedIcon') || ava1; // Устанавливаем иконку по умолчанию
  });
  
  // Сохраняем выбор в localStorage при изменении
  useEffect(() => {
    localStorage.setItem('selectedIcon', selectedIcon);
  }, [selectedIcon]);

  const [playerCoins] = useState<number>(points); // Количество монет у игрока


  /* */
  const [showWelcome, setShowWelcome] = useState<boolean>(false);
  useEffect(() => {
    const isFirstVisit = localStorage.getItem('firstVisit') === null;
    if (isFirstVisit) {
      setShowWelcome(true); // Показываем приветствие
      localStorage.setItem('firstVisit', 'true'); // Помечаем, что игрок уже заходил
    } else {
      const savedPoints = localStorage.getItem('points');
      if (savedPoints) setPoints(Number(savedPoints)); // Восстанавливаем количество очков
    }
  }, []);

  // Обработка получения бонуса
  const handleBonusReceived = () => {
    setPoints((prev) => {
      const newPoints = prev + 2500;
      localStorage.setItem('points', newPoints.toString()); // Сохраняем количество очков
      return newPoints;
    });
    setShowWelcome(false); // Закрываем приветствие
  };

  const handleRewardClaimed = () => {
    setPoints((prev) => {
      const newPoints = prev + 2500;
      localStorage.setItem('points', newPoints.toString()); // Сохраняем количество очков
      return newPoints;
    });
  };
  
  
  const [showDen, setShowDen] = useState<boolean>(true); // Видимость вкладки награды

  // Функция для обновления баланса
  const handleCollectReward = (rewardAmount: number) => {
    setPoints((prev) => prev + rewardAmount); // Увеличиваем points
  };

  const [isFriendPageVisible, setIsFriendPageVisible] = useState(false);
  const openFriendPage = () => setIsFriendPageVisible(true);
  const closeFriendPage = () => setIsFriendPageVisible(false);

  const [isTaskVisible, setIsTaskVisible] = useState<boolean>(false);

  const openTask = () => setIsTaskVisible(true);
  const closeTask = () => setIsTaskVisible(false);
  
  
  const renderContent = () => {
    console.log("Текущая страница:", currentPage); // Отладочная информация
    switch (currentPage) {
      case 'home':
        return (
          <>
            <div style={{ position: 'relative' }}>
               
            </div>
          </>
        );
        case 'profil':
          return (
            <Profil
              username={username || 'Player'} // Передаём имя пользователя
              selectedIcon={selectedIcon} // Передаём текущую аватарку
              setSelectedIcon={setSelectedIcon} // Функция для смены аватарки
              onBack={() => setCurrentPage('home')} // Возврат на домашнюю страницу
            />
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
      case 'game':
        return (
          <Game
          setCurrentPage={setCurrentPage} 
          activateBuffSap={activateBuffSap}
          activateBuff={activateBuff}
          isBuffActive={isBuffActive}
          isBuffActiveSap={isBuffActiveSap}
          buffTime={buffTime}
          />
        );
      case 'task':
        return (
          <Task
          onRewardClaimed={handleRewardClaimed}
          onClose={closeTask}
          />
        );
        /*Верхний блок*/
      case 'top':
        return (
          <Top
          setCurrentPage={setCurrentPage}
          playerCoins={playerCoins}
          selectedIcon={selectedIcon}
        />);
      case 'friend':
        return (
          <FriendPage
          onClose={closeFriendPage}
          />);
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
    <LanguageProvider>
    <div className="App min-h-screen px-4 flex flex-col items-center text-white font-medium">
      <div className="absolute inset-0 h-1/2 bg-gradient-overlay z-0"></div>
      <div className="absolute inset-0 flex items-center justify-center z-0">
        <div className="radial-gradient-overlay"></div>
      </div>
  
      <div className="w-full z-10 min-h-screen flex flex-col items-center text-white">

        {/* Верхний блок с кнопками*/}
        <div className="fixed top-4 left-0 w-full px-4 flex justify-center z-3">
          <div className="w-full max-w-md py-4 rounded-2xl flex justify-around">
            <button className="flex flex-col items-center gap-1" onClick={() => setCurrentPage('profil')}>
              <img src={hom} width={24} height={24} alt="Home" />
              <span>Profile</span>
            </button>
            <div className="h-[48px] w-[2px] bg-[#bf1515]"></div>
            <button className="flex flex-col items-center gap-1" onClick={() => setCurrentPage('top')}>
              <img src={top} width={24} height={24} alt="Top" />
              <span>Top</span>
              
            </button>
            <div className="h-[48px] w-[2px] bg-[#bf1515]"></div>
            <button className="flex flex-col items-center gap-1" onClick={openAutoFarm}>
              <img src={autfr} width={24} height={24} alt="Autofarm" style={{ opacity: isAutoFarmUnlocked ? 1 : 0.5 }} />
              <span>Farm</span>
              
            </button>
            <div className="h-[48px] w-[2px] bg-[#bf1515]"></div>
            <button className="flex flex-col items-center gap-1" onClick={() => setCurrentPage('achiv')}>
              <img src={medal} width={24} height={24} alt="Achiv" />
              <span>Medal</span>
            </button>
          </div>
        </div>
  
        {/*Кнопка настроек*/}
        <button className="setting-button fixed top-20 right-4" style={{ marginTop: '30px' }} onClick={toggleSettings}>
          <img src={sett} alt="Setting" width={24} height={24} />
        </button>
        {showSettings && (
          <Setting
            onClose={toggleSettings}
            isMusicOn={isMusicOn}
            toggleMusic={toggleMusic}
            isCoinSoundOn={isCoinSoundOn}
            toggleCoinSound={toggleCoinSound}
          />
        )}
  
        {/* Отображение содержимого с использованием renderContent */}
        <div className="fixed top-20 left-0 w-full px-4 pt-2 z-20 flex flex-col items-center text-white">
          {renderContent()}
        </div>
  
        <div className="relative flex-grow flex flex-col items-center justify-center relative" style={{ marginTop: '80px'}}>
          <div className="relative mb-4" onClick={handleClick}>
            <img src={notcoin} width={230} height={200} className={isShaking ? 'shake' : ''} style={{ transform: 'translateX(-20px) translateY(15px)' }} alt="notcoin"/>
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
          <div className="flex flex-col items-center mt-2"style={{ marginTop: '-5px' }}>
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
        <div className="fixed bottom-4 left-0 w-full px-4 flex justify-center z-10" style={{ marginTop: '5px' }}>
          <div className="w-full max-w-md  py-4 rounded-2xl flex justify-around">
            <button className="flex flex-col items-center gap-1" onClick={() => setCurrentPage('shop')}>
              <img src={shp} width={24} height={24} alt="Shop" />
              <span>Shop</span>
              
            </button>
            <div className="h-[48px] w-[2px] bg-[#bf1515]"></div>
            <button className="flex flex-col items-center gap-1" onClick={openFriendPage}>
              <img src={frnd} width={24} height={24} alt="Friend" />
              <span>Friend</span>
              
            </button>
            {isFriendPageVisible && <FriendPage onClose={closeFriendPage} />}
            <div className="h-[48px] w-[2px] bg-[#bf1515]"></div>
            <button className="flex flex-col items-center gap-1" onClick={() => setCurrentPage('game')}>
              <img src={gam} width={24} height={24} alt="Game" />
              <span>Game</span>
              
            </button>
            <div className="h-[48px] w-[2px] bg-[#bf1515]"></div>
            <button className="flex flex-col items-center gap-1" onClick={openTask}>
              <img src={task} width={24} height={24} alt="Task" />
              <span>Task</span>
              
            </button>
            {isTaskVisible && (
              <Task onRewardClaimed={handleRewardClaimed} onClose={closeTask} />
            )}
          </div>
        </div>
        
        {showLockedMessage && (
          <div className="locked-message">
            <span>Разблокировка будет доступна после улучшение тапа на 10lvl</span>
          </div>
        )}
  
        {showDen && (
          <Den
            onClose={() => setShowDen(false)} // Закрываем вкладку
            onCollectReward={handleCollectReward} // Передаем функцию для обновления баланса
          />
        )}

  
              {/* Отображение очков */}
              <button
                className="absolute text-5xl font-bold flex items-center z-1"
                style={{
                  top: '135px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  marginTop: '-5px',
                }}
              >
                <img src={coinImage} width={44} height={44} alt="Static Coin" />
                <span className="ml-2">{Math.floor(points).toLocaleString()}</span>
              </button>

              {showWelcome && <New onBonusReceived={handleBonusReceived} />}
              {isNicknameModalVisible && (
                <div className="modal-overlay">
                  <div className="modal">
                    <h2>Придумайте никнейм</h2>
                    <input
                      type="text"
                      placeholder="Введите ник..."
                      maxLength={16}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                          handleSaveUsername(e.currentTarget.value.trim());
                        }
                      }}
                    />
              <button
                onClick={() => {
                  const input = document.querySelector<HTMLInputElement>('input');
                  if (input && input.value.trim()) {
                    handleSaveUsername(input.value.trim());
                  }
                }}
              >
                Сохранить
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
    </LanguageProvider>
  );
  
  
  

  
}

export default App;