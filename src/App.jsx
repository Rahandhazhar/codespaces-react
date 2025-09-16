import React, { useEffect } from 'react';
import { GameProvider, useGame } from './context/UltraGameContext';
import Navigation from './components/Navigation';
import UltraDashboard from './components/UltraDashboard';
import Market from './components/Market';
import AdvancedTrading from './components/AdvancedTrading';
import AdvancedCharts from './components/AdvancedCharts';
import AITradingBots from './components/AITradingBots';
import DeFiHub from './components/DeFiHub';
import MiningCenter from './components/MiningCenter';
import Staking from './components/Staking';
import Challenges from './components/Challenges';
import News from './components/News';
import Achievements from './components/Achievements';
import PortfolioAnalytics from './components/PortfolioAnalytics';
import Settings from './components/Settings';
import WelcomeScreen from './components/WelcomeScreen';
import './App.css';

function GameContent() {
  const { state, setView } = useGame();
  const { currentView, gameStarted, settings } = state;

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
        return; // Don't trigger shortcuts when typing in inputs
      }

      switch (event.key.toLowerCase()) {
        case 'd':
          setView('dashboard');
          break;
        case 'm':
          setView('market');
          break;
        case 't':
          setView('advanced-trading');
          break;
        case 'h':
          setView('charts');
          break;
        case 'b':
          setView('ai-bots');
          break;
        case 'f':
          setView('defi');
          break;
        case 'i':
          setView('mining');
          break;
        case 's':
          setView('staking');
          break;
        case 'c':
          setView('challenges');
          break;
        case 'n':
          setView('news');
          break;
        case 'a':
          setView('achievements');
          break;
        case 'p':
          setView('analytics');
          break;
        case 'escape':
          setView('settings');
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [setView]);

  // Apply theme
  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'light') {
      root.classList.add('light-theme');
    } else {
      root.classList.remove('light-theme');
    }
  }, [settings.theme]);

  if (!gameStarted) {
    return <WelcomeScreen />;
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <UltraDashboard />;
      case 'market':
        return <Market />;
      case 'advanced-trading':
        return <AdvancedTrading />;
      case 'charts':
        return <AdvancedCharts />;
      case 'ai-bots':
        return <AITradingBots />;
      case 'defi':
        return <DeFiHub />;
      case 'mining':
        return <MiningCenter />;
      case 'staking':
        return <Staking />;
      case 'challenges':
        return <Challenges />;
      case 'news':
        return <News />;
      case 'achievements':
        return <Achievements />;
      case 'analytics':
        return <PortfolioAnalytics />;
      case 'settings':
        return <Settings />;
      default:
        return <UltraDashboard />;
    }
  };

  return (
    <div className={`app ${settings.theme}`}>
      <Navigation />
      <main className="main-content">
        {renderCurrentView()}
      </main>
      
      {/* Achievement Notification */}
      {state.achievements.some(a => a.unlocked && !a.notified) && (
        <div className="achievement-notification">
          🏆 Achievement Unlocked!
        </div>
      )}
      
      {/* Sound Effects */}
      {settings.soundEnabled && (
        <audio id="trade-sound" preload="auto">
          <source src="/sounds/trade.mp3" type="audio/mpeg" />
        </audio>
      )}
    </div>
  );
}

function App() {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  );
}

export default App;