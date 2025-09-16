import React from 'react';
import { useGame } from '../context/GameContext';
import './Navigation.css';

function Navigation() {
  const { state, setView } = useGame();
  const { currentView, player, achievements } = state;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const unlockedAchievements = achievements.filter(a => a.unlocked).length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'market', label: 'Market', icon: '💹' },
    { id: 'news', label: 'News', icon: '📰' },
    { id: 'achievements', label: 'Achievements', icon: '🏆' }
  ];

  return (
    <nav className="navigation">
      <div className="nav-header">
        <h1 className="game-title">
          <span className="title-icon">₿</span>
          Crypto Tycoon
        </h1>
        <div className="player-stats">
          <div className="cash-display">
            <span className="cash-label">Cash:</span>
            <span className="cash-value">{formatCurrency(player.cash)}</span>
          </div>
          <div className="portfolio-display">
            <span className="portfolio-label">Total:</span>
            <span className={`portfolio-value ${player.totalProfit >= 0 ? 'positive' : 'negative'}`}>
              {formatCurrency(player.totalValue)}
            </span>
          </div>
        </div>
      </div>

      <div className="nav-menu">
        {navItems.map(item => (
          <button
            key={item.id}
            className={`nav-item ${currentView === item.id ? 'active' : ''}`}
            onClick={() => setView(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
            {item.id === 'achievements' && unlockedAchievements > 0 && (
              <span className="achievement-badge">{unlockedAchievements}</span>
            )}
          </button>
        ))}
      </div>

      <div className="nav-footer">
        <div className="profit-display">
          <span className="profit-label">P&L:</span>
          <span className={`profit-value ${player.totalProfit >= 0 ? 'positive' : 'negative'}`}>
            {player.totalProfit >= 0 ? '+' : ''}
            {formatCurrency(player.totalProfit)}
          </span>
          <span className={`profit-percent ${player.totalProfitPercent >= 0 ? 'positive' : 'negative'}`}>
            ({player.totalProfitPercent >= 0 ? '+' : ''}{player.totalProfitPercent.toFixed(1)}%)
          </span>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;