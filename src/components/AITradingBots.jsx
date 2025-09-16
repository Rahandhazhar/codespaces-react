import React, { useState } from 'react';
import { useGame } from '../context/UltraGameContext';
import './AITradingBots.css';

function AITradingBots() {
  const { state, deployTradingBot, stopTradingBot } = useGame();
  const { tradingBots, player } = state;
  const [selectedBot, setSelectedBot] = useState(null);
  const [investmentAmount, setInvestmentAmount] = useState('');

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercent = (percent) => {
    const sign = percent >= 0 ? '+' : '';
    return `${sign}${(percent * 100).toFixed(2)}%`;
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'low': return '#00ff88';
      case 'medium': return '#ffa502';
      case 'high': return '#ff4757';
      default: return '#667eea';
    }
  };

  const getPerformanceColor = (performance) => {
    if (performance > 0.05) return '#00ff88';
    if (performance > 0) return '#00d4aa';
    if (performance > -0.05) return '#ffa502';
    return '#ff4757';
  };

  const handleDeployBot = () => {
    if (!selectedBot || !investmentAmount) {
      alert('Please select a bot and enter investment amount');
      return;
    }

    const amount = parseFloat(investmentAmount);
    const bot = tradingBots.find(b => b.id === selectedBot);

    if (amount < bot.minInvestment) {
      alert(`Minimum investment for this bot is ${formatCurrency(bot.minInvestment)}`);
      return;
    }

    if (amount > player.cash) {
      alert('Insufficient funds');
      return;
    }

    deployTradingBot(selectedBot, amount);
    setInvestmentAmount('');
    setSelectedBot(null);
  };

  const handleStopBot = (botId) => {
    if (window.confirm('Are you sure you want to stop this trading bot?')) {
      stopTradingBot(botId);
    }
  };

  const activeBots = tradingBots.filter(bot => bot.active);
  const inactiveBots = tradingBots.filter(bot => !bot.active);
  const totalInvested = activeBots.reduce((sum, bot) => sum + (bot.investment || 0), 0);
  const totalReturns = activeBots.reduce((sum, bot) => sum + ((bot.investment || 0) * bot.performance), 0);

  return (
    <div className="ai-trading-bots">
      <div className="bots-header">
        <h1>🤖 AI Trading Bots</h1>
        <div className="bots-stats">
          <div className="stat">
            <span className="label">Active Bots:</span>
            <span className="value">{activeBots.length}</span>
          </div>
          <div className="stat">
            <span className="label">Total Invested:</span>
            <span className="value">{formatCurrency(totalInvested)}</span>
          </div>
          <div className="stat">
            <span className="label">Total Returns:</span>
            <span className={`value ${totalReturns >= 0 ? 'positive' : 'negative'}`}>
              {formatCurrency(totalReturns)}
            </span>
          </div>
        </div>
      </div>

      <div className="bots-content">
        {/* Active Bots */}
        {activeBots.length > 0 && (
          <div className="active-bots-section">
            <h2>⚡ Active Trading Bots</h2>
            <div className="bots-grid">
              {activeBots.map(bot => (
                <div key={bot.id} className="bot-card active">
                  <div className="bot-header">
                    <div className="bot-icon">{bot.icon}</div>
                    <div className="bot-info">
                      <h3 className="bot-name">{bot.name}</h3>
                      <p className="bot-strategy">{bot.strategy.toUpperCase()}</p>
                    </div>
                    <div className="bot-status">
                      <span className="status-indicator active">ACTIVE</span>
                    </div>
                  </div>

                  <div className="bot-performance">
                    <div className="performance-metric">
                      <span className="metric-label">Investment:</span>
                      <span className="metric-value">{formatCurrency(bot.investment)}</span>
                    </div>
                    <div className="performance-metric">
                      <span className="metric-label">Performance:</span>
                      <span 
                        className="metric-value"
                        style={{ color: getPerformanceColor(bot.performance) }}
                      >
                        {formatPercent(bot.performance)}
                      </span>
                    </div>
                    <div className="performance-metric">
                      <span className="metric-label">Current Value:</span>
                      <span className="metric-value">
                        {formatCurrency(bot.investment * (1 + bot.performance))}
                      </span>
                    </div>
                    <div className="performance-metric">
                      <span className="metric-label">Trades:</span>
                      <span className="metric-value">{bot.trades}</span>
                    </div>
                  </div>

                  <div className="bot-chart">
                    <div className="performance-line">
                      <div 
                        className="performance-fill"
                        style={{ 
                          width: `${Math.max(0, Math.min(100, (bot.performance + 0.1) * 500))}%`,
                          backgroundColor: getPerformanceColor(bot.performance)
                        }}
                      />
                    </div>
                  </div>

                  <div className="bot-actions">
                    <button 
                      className="stop-bot-btn"
                      onClick={() => handleStopBot(bot.id)}
                    >
                      🛑 Stop Bot
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Available Bots */}
        <div className="available-bots-section">
          <h2>🚀 Available Trading Bots</h2>
          <div className="bots-grid">
            {inactiveBots.map(bot => (
              <div 
                key={bot.id} 
                className={`bot-card ${selectedBot === bot.id ? 'selected' : ''}`}
                onClick={() => setSelectedBot(bot.id)}
              >
                <div className="bot-header">
                  <div className="bot-icon">{bot.icon}</div>
                  <div className="bot-info">
                    <h3 className="bot-name">{bot.name}</h3>
                    <p className="bot-description">{bot.description}</p>
                  </div>
                  <div className="bot-risk">
                    <span 
                      className="risk-badge"
                      style={{ backgroundColor: getRiskColor(bot.riskLevel) }}
                    >
                      {bot.riskLevel.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="bot-details">
                  <div className="detail-row">
                    <span className="detail-label">Strategy:</span>
                    <span className="detail-value">{bot.strategy}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Min Investment:</span>
                    <span className="detail-value">{formatCurrency(bot.minInvestment)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Expected Return:</span>
                    <span className="detail-value positive">
                      {formatPercent(bot.expectedReturn)}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Risk Level:</span>
                    <span 
                      className="detail-value"
                      style={{ color: getRiskColor(bot.riskLevel) }}
                    >
                      {bot.riskLevel}
                    </span>
                  </div>
                </div>

                <div className="bot-features">
                  <div className="feature">
                    <span className="feature-icon">⚡</span>
                    <span>Automated Trading</span>
                  </div>
                  <div className="feature">
                    <span className="feature-icon">📊</span>
                    <span>Real-time Analysis</span>
                  </div>
                  <div className="feature">
                    <span className="feature-icon">🛡️</span>
                    <span>Risk Management</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bot Deployment Panel */}
        {selectedBot && (
          <div className="deployment-panel">
            <h2>🚀 Deploy Trading Bot</h2>
            <div className="deployment-content">
              <div className="selected-bot-info">
                <div className="bot-summary">
                  <span className="bot-icon-large">
                    {inactiveBots.find(b => b.id === selectedBot)?.icon}
                  </span>
                  <div className="bot-details-summary">
                    <h3>{inactiveBots.find(b => b.id === selectedBot)?.name}</h3>
                    <p>{inactiveBots.find(b => b.id === selectedBot)?.description}</p>
                  </div>
                </div>
              </div>

              <div className="investment-controls">
                <div className="investment-input">
                  <label>Investment Amount</label>
                  <input
                    type="number"
                    value={investmentAmount}
                    onChange={(e) => setInvestmentAmount(e.target.value)}
                    placeholder={`Min: ${formatCurrency(inactiveBots.find(b => b.id === selectedBot)?.minInvestment || 0)}`}
                    min={inactiveBots.find(b => b.id === selectedBot)?.minInvestment || 0}
                    max={player.cash}
                  />
                  <div className="investment-helpers">
                    <button
                      onClick={() => setInvestmentAmount(player.cash.toString())}
                    >
                      Max
                    </button>
                    <button
                      onClick={() => setInvestmentAmount((player.cash * 0.5).toString())}
                    >
                      50%
                    </button>
                    <button
                      onClick={() => setInvestmentAmount((player.cash * 0.25).toString())}
                    >
                      25%
                    </button>
                  </div>
                </div>

                <div className="deployment-summary">
                  <div className="summary-row">
                    <span>Investment:</span>
                    <span>{formatCurrency(parseFloat(investmentAmount) || 0)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Expected Daily Return:</span>
                    <span className="positive">
                      {formatCurrency((parseFloat(investmentAmount) || 0) * (inactiveBots.find(b => b.id === selectedBot)?.expectedReturn || 0) / 365)}
                    </span>
                  </div>
                  <div className="summary-row">
                    <span>Risk Level:</span>
                    <span style={{ color: getRiskColor(inactiveBots.find(b => b.id === selectedBot)?.riskLevel) }}>
                      {inactiveBots.find(b => b.id === selectedBot)?.riskLevel}
                    </span>
                  </div>
                </div>

                <button
                  className="deploy-btn"
                  onClick={handleDeployBot}
                  disabled={!investmentAmount || parseFloat(investmentAmount) < (inactiveBots.find(b => b.id === selectedBot)?.minInvestment || 0)}
                >
                  🚀 Deploy Bot
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bot Education */}
        <div className="bot-education">
          <h2>📚 AI Trading Bot Guide</h2>
          <div className="education-grid">
            <div className="education-card">
              <h3>⚡ Lightning Scalper</h3>
              <p>
                High-frequency trading bot that makes rapid trades to capture small price movements. 
                Best for volatile markets with high trading volume.
              </p>
              <div className="pros-cons">
                <div className="pros">
                  <h4>Pros:</h4>
                  <ul>
                    <li>Quick profits</li>
                    <li>High trade frequency</li>
                    <li>Works in any market</li>
                  </ul>
                </div>
                <div className="cons">
                  <h4>Cons:</h4>
                  <ul>
                    <li>High risk</li>
                    <li>Requires active monitoring</li>
                    <li>Sensitive to fees</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="education-card">
              <h3>💎 Diamond Hands</h3>
              <p>
                Long-term holding strategy that buys and holds quality cryptocurrencies. 
                Perfect for building wealth over time with minimal risk.
              </p>
              <div className="pros-cons">
                <div className="pros">
                  <h4>Pros:</h4>
                  <ul>
                    <li>Low risk</li>
                    <li>Passive income</li>
                    <li>Tax efficient</li>
                  </ul>
                </div>
                <div className="cons">
                  <h4>Cons:</h4>
                  <ul>
                    <li>Slow returns</li>
                    <li>Market dependent</li>
                    <li>Requires patience</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="education-card">
              <h3>🔄 Arbitrage Master</h3>
              <p>
                Exploits price differences between different markets or exchanges. 
                Low-risk strategy with consistent but modest returns.
              </p>
              <div className="pros-cons">
                <div className="pros">
                  <h4>Pros:</h4>
                  <ul>
                    <li>Low risk</li>
                    <li>Consistent returns</li>
                    <li>Market neutral</li>
                  </ul>
                </div>
                <div className="cons">
                  <h4>Cons:</h4>
                  <ul>
                    <li>Requires capital</li>
                    <li>Limited opportunities</li>
                    <li>Technical complexity</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="education-card">
              <h3>🚀 Momentum Rider</h3>
              <p>
                Follows market trends and momentum indicators to ride price waves. 
                Balanced approach between risk and reward.
              </p>
              <div className="pros-cons">
                <div className="pros">
                  <h4>Pros:</h4>
                  <ul>
                    <li>Trend following</li>
                    <li>Good risk/reward</li>
                    <li>Adaptable</li>
                  </ul>
                </div>
                <div className="cons">
                  <h4>Cons:</h4>
                  <ul>
                    <li>Trend dependent</li>
                    <li>Can miss reversals</li>
                    <li>Moderate complexity</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AITradingBots;