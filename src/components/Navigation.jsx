import React from 'react';
import { useGame } from '../context/UltraGameContext';
import './Navigation.css';

function Navigation() {
  const { state, setView } = useGame();
  const { currentView, player, achievements, dailyChallenges, settings } = state;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const unlockedAchievements = achievements.filter(a => a.unlocked).length;
  const completedChallenges = dailyChallenges.filter(c => c.completed).length;
  const totalChallenges = dailyChallenges.length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', shortcut: 'D' },
    { id: 'market', label: 'Market', icon: '💹', shortcut: 'M' },
    { id: 'advanced-trading', label: 'Advanced Trading', icon: '🚀', shortcut: 'T' },
    { id: 'charts', label: 'Advanced Charts', icon: '📈', shortcut: 'H' },
    { id: 'ai-bots', label: 'AI Trading Bots', icon: '🤖', shortcut: 'B' },
    { id: 'defi', label: 'DeFi Hub', icon: '🏦', shortcut: 'F' },
    { id: 'mining', label: 'Mining Center', icon: '⛏️', shortcut: 'I' },
    { id: 'staking', label: 'Staking', icon: '💎', shortcut: 'S' },
    { id: 'challenges', label: 'Challenges', icon: '🎯', shortcut: 'C', badge: `${completedChallenges}/${totalChallenges}` },
    { id: 'analytics', label: 'Analytics', icon: '📊', shortcut: 'P' },
    { id: 'news', label: 'News', icon: '📰', shortcut: 'N' },
    { id: 'achievements', label: 'Achievements', icon: '🏆', shortcut: 'A', badge: unlockedAchievements > 0 ? unlockedAchievements : null },
    { id: 'settings', label: 'Settings', icon: '⚙️', shortcut: 'ESC' }
  ];

  const getPlayerLevel = () => {
    return Math.floor(player.experience / 1000) + 1;
  };

  const getExperienceProgress = () => {
    const currentLevelExp = (getPlayerLevel() - 1) * 1000;
    const nextLevelExp = getPlayerLevel() * 1000;
    const progress = ((player.experience - currentLevelExp) / (nextLevelExp - currentLevelExp)) * 100;
    return Math.min(progress, 100);
  };

  return (
    <nav className={`navigation ${settings.theme}`}>
      <div className="nav-header">
        <h1 className="game-title">
          <span className="title-icon">₿</span>
          Crypto Tycoon
          <span className="version">v2.0</span>
        </h1>
        
        <div className="player-info">
          <div className="player-level">
            <span className="level-label">Level {getPlayerLevel()}</span>
            <div className="exp-bar">
              <div 
                className="exp-fill" 
                style={{ width: `${getExperienceProgress()}%` }}
              />
            </div>
            <span className="exp-text">{player.experience} XP</span>
          </div>
        </div>

        <div className="player-stats">
          <div className="cash-display">
            <span className="cash-label">💰 Cash:</span>
            <span className="cash-value">{formatCurrency(player.cash)}</span>
          </div>
          <div className="portfolio-display">
            <span className="portfolio-label">📊 Total:</span>
            <span className={`portfolio-value ${player.totalProfit >= 0 ? 'positive' : 'negative'}`}>
              {formatCurrency(player.totalValue)}
            </span>
          </div>
          {player.leverage > 1 && (
            <div className="leverage-display">
              <span className="leverage-label">⚡ Leverage:</span>
              <span className="leverage-value">{player.leverage.toFixed(1)}x</span>
            </div>
          )}
        </div>
      </div>

      <div className="nav-menu">
        {navItems.map(item => (
          <button
            key={item.id}
            className={`nav-item ${currentView === item.id ? 'active' : ''}`}
            onClick={() => setView(item.id)}
            title={`${item.label} (${item.shortcut})`}
          >
            <span className="nav-icon">{item.icon}</span>
            <div className="nav-content">
              <span className="nav-label">{item.label}</span>
              <span className="nav-shortcut">{item.shortcut}</span>
            </div>
            {item.badge && (
              <span className="nav-badge">{item.badge}</span>
            )}
          </button>
        ))}
      </div>

      <div className="nav-footer">
        <div className="profit-display">
          <span className="profit-label">💹 P&L:</span>
          <span className={`profit-value ${player.totalProfit >= 0 ? 'positive' : 'negative'}`}>
            {player.totalProfit >= 0 ? '+' : ''}
            {formatCurrency(player.totalProfit)}
          </span>
          <span className={`profit-percent ${player.totalProfitPercent >= 0 ? 'positive' : 'negative'}`}>
            ({player.totalProfitPercent >= 0 ? '+' : ''}{player.totalProfitPercent.toFixed(1)}%)
          </span>
        </div>

        {Object.keys(state.stakedPortfolio).length > 0 && (
          <div className="staking-display">
            <span className="staking-label">💎 Staking:</span>
            <span className="staking-value positive">
              {formatCurrency(player.stakingRewards)}
            </span>
          </div>
        )}

        <div className="market-sentiment-display">
          <span className="sentiment-label">📊 Market:</span>
          <span className={`sentiment-value ${state.marketSentiment}`}>
            {state.marketSentiment.toUpperCase()}
          </span>
        </div>

        {completedChallenges === totalChallenges && totalChallenges > 0 && (
          <div className="perfect-day">
            🎉 Perfect Day!
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navigation;