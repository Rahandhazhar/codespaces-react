import React from 'react';
import { GameProvider, useGame } from './context/GameContext';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import Market from './components/Market';
import News from './components/News';
import Achievements from './components/Achievements';
import WelcomeScreen from './components/WelcomeScreen';
import './App.css';

function GameContent() {
  const { state } = useGame();
  const { currentView, gameStarted } = state;

  if (!gameStarted) {
    return <WelcomeScreen />;
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'market':
        return <Market />;
      case 'news':
        return <News />;
      case 'achievements':
        return <Achievements />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app">
      <Navigation />
      <main className="main-content">
        {renderCurrentView()}
      </main>
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