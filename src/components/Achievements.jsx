import React from 'react';
import { useGame } from '../context/EnhancedGameContext';
import './Achievements.css';

function Achievements() {
  const { state } = useGame();
  const { achievements, player, transactions } = state;

  const getAchievementIcon = (id) => {
    const icons = {
      first_trade: '🎯',
      profit_1k: '💰',
      portfolio_25k: '📈',
      hodler: '💎',
      day_trader: '⚡',
      whale: '🐋'
    };
    return icons[id] || '🏆';
  };

  const getProgressBar = (achievement) => {
    let progress = 0;
    let max = 1;
    
    switch (achievement.id) {
      case 'first_trade':
        progress = Math.min(transactions.length, 1);
        max = 1;
        break;
      case 'profit_1k':
        progress = Math.min(Math.max(player.totalProfit, 0), 1000);
        max = 1000;
        break;
      case 'portfolio_25k':
        progress = Math.min(player.totalValue, 25000);
        max = 25000;
        break;
      case 'hodler':
        // This would need more complex tracking in a real implementation
        progress = achievement.unlocked ? 1 : 0;
        max = 1;
        break;
      case 'day_trader':
        progress = Math.min(transactions.length, 10);
        max = 10;
        break;
      case 'whale':
        progress = Math.min(player.totalValue, 100000);
        max = 100000;
        break;
      default:
        progress = achievement.unlocked ? 1 : 0;
        max = 1;
    }
    
    return (progress / max) * 100;
  };

  const getProgressText = (achievement) => {
    switch (achievement.id) {
      case 'first_trade':
        return `${Math.min(transactions.length, 1)}/1 trades`;
      case 'profit_1k':
        return `$${Math.max(player.totalProfit, 0).toFixed(0)}/$1,000`;
      case 'portfolio_25k':
        return `$${player.totalValue.toFixed(0)}/$25,000`;
      case 'hodler':
        return achievement.unlocked ? 'Completed!' : 'Hold a position for 5 minutes';
      case 'day_trader':
        return `${Math.min(transactions.length, 10)}/10 trades`;
      case 'whale':
        return `$${player.totalValue.toFixed(0)}/$100,000`;
      default:
        return achievement.unlocked ? 'Completed!' : 'In progress...';
    }
  };

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;

  return (
    <div className="achievements">
      <div className="achievements-header">
        <h1>🏆 Achievements</h1>
        <div className="achievements-progress">
          <span className="progress-text">
            {unlockedCount}/{totalCount} Unlocked
          </span>
          <div className="progress-bar-container">
            <div 
              className="progress-bar-fill"
              style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="achievements-grid">
        {achievements.map(achievement => (
          <div 
            key={achievement.id}
            className={`achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}`}
          >
            <div className="achievement-icon">
              {getAchievementIcon(achievement.id)}
            </div>
            
            <div className="achievement-content">
              <h3 className="achievement-name">{achievement.name}</h3>
              <p className="achievement-description">{achievement.description}</p>
              
              <div className="achievement-progress">
                <div className="progress-text">
                  {getProgressText(achievement)}
                </div>
                <div className="progress-bar-container">
                  <div 
                    className="progress-bar-fill"
                    style={{ width: `${getProgressBar(achievement)}%` }}
                  />
                </div>
              </div>
            </div>
            
            {achievement.unlocked && (
              <div className="achievement-badge">
                ✓
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Achievement Stats */}
      <div className="achievement-stats">
        <h2>📊 Your Stats</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{transactions.length}</div>
            <div className="stat-label">Total Trades</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-value">
              ${player.totalProfit >= 0 ? '+' : ''}
              {player.totalProfit.toFixed(2)}
            </div>
            <div className="stat-label">Total Profit/Loss</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-value">${player.totalValue.toFixed(2)}</div>
            <div className="stat-label">Portfolio Value</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-value">
              {player.totalProfitPercent >= 0 ? '+' : ''}
              {player.totalProfitPercent.toFixed(1)}%
            </div>
            <div className="stat-label">Return on Investment</div>
          </div>
        </div>
      </div>

      {/* Tips for unlocking achievements */}
      <div className="achievement-tips">
        <h2>💡 Tips for Unlocking Achievements</h2>
        <div className="tips-list">
          <div className="tip">
            <strong>First Trade:</strong> Make your first buy or sell transaction in the Market section.
          </div>
          <div className="tip">
            <strong>Profit Maker:</strong> Focus on buying low and selling high to reach $1,000 profit.
          </div>
          <div className="tip">
            <strong>Growing Portfolio:</strong> Diversify your investments and let them grow over time.
          </div>
          <div className="tip">
            <strong>Diamond Hands:</strong> Hold onto your positions during market volatility.
          </div>
          <div className="tip">
            <strong>Day Trader:</strong> Make frequent trades to take advantage of price movements.
          </div>
          <div className="tip">
            <strong>Crypto Whale:</strong> Build a massive portfolio worth $100,000 or more.
          </div>
        </div>
      </div>
    </div>
  );
}

export default Achievements;