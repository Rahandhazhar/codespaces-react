import React, { useState, useEffect } from 'react';
import { useGame } from '../context/UltraGameContext';
import './UltraDashboard.css';

function UltraDashboard() {
  const { state } = useGame();
  const { player, portfolio, stakedPortfolio, cryptos, transactions, achievements, dailyChallenges, tradingBots, liquidityPools, miningRigs, nftPortfolio } = state;
  const [activeMetric, setActiveMetric] = useState('portfolio');
  const [timeframe, setTimeframe] = useState('24h');

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatPercent = (percent) => {
    const sign = percent >= 0 ? '+' : '';
    return `${sign}${percent.toFixed(2)}%`;
  };

  const formatLargeNumber = (num) => {
    if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
    return num.toFixed(0);
  };

  // Calculate portfolio metrics
  const getPortfolioValue = () => {
    return Object.keys(portfolio).reduce((total, cryptoId) => {
      const holding = portfolio[cryptoId];
      const crypto = cryptos[cryptoId];
      return total + (holding.amount * crypto.price * holding.leverage);
    }, 0);
  };

  const getStakedValue = () => {
    return Object.keys(stakedPortfolio).reduce((total, cryptoId) => {
      const staked = stakedPortfolio[cryptoId];
      const crypto = cryptos[cryptoId];
      return total + (staked.amount * crypto.price);
    }, 0);
  };

  const getDeFiValue = () => {
    return Object.values(liquidityPools).reduce((total, pool) => total + pool.value, 0);
  };

  const getMiningValue = () => {
    return miningRigs.reduce((total, rig) => total + (rig.cost * rig.owned), 0);
  };

  const getNFTValue = () => {
    return Object.values(nftPortfolio).reduce((total, nft) => total + nft.currentValue, 0);
  };

  const getTotalAssets = () => {
    return player.cash + getPortfolioValue() + getStakedValue() + getDeFiValue() + getMiningValue() + getNFTValue();
  };

  const getAssetAllocation = () => {
    const total = getTotalAssets();
    return {
      cash: (player.cash / total) * 100,
      portfolio: (getPortfolioValue() / total) * 100,
      staking: (getStakedValue() / total) * 100,
      defi: (getDeFiValue() / total) * 100,
      mining: (getMiningValue() / total) * 100,
      nft: (getNFTValue() / total) * 100
    };
  };

  const getTopHoldings = () => {
    return Object.keys(portfolio)
      .map(cryptoId => {
        const holding = portfolio[cryptoId];
        const crypto = cryptos[cryptoId];
        const value = holding.amount * crypto.price * holding.leverage;
        const profit = value - (holding.amount * holding.avgBuyPrice * holding.leverage);
        const profitPercent = (profit / (holding.amount * holding.avgBuyPrice * holding.leverage)) * 100;
        
        return {
          cryptoId,
          crypto,
          holding,
          value,
          profit,
          profitPercent
        };
      })
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  };

  const getRecentTransactions = () => {
    return transactions.slice(0, 5);
  };

  const getActiveStrategies = () => {
    const strategies = [];
    
    // Trading bots
    const activeBots = tradingBots.filter(bot => bot.active);
    strategies.push(...activeBots.map(bot => ({
      type: 'bot',
      name: bot.name,
      performance: bot.performance,
      icon: bot.icon
    })));
    
    // Staking
    if (Object.keys(stakedPortfolio).length > 0) {
      strategies.push({
        type: 'staking',
        name: 'Crypto Staking',
        performance: 0.05, // Average staking return
        icon: '💎'
      });
    }
    
    // DeFi
    if (Object.keys(liquidityPools).length > 0) {
      strategies.push({
        type: 'defi',
        name: 'Liquidity Pools',
        performance: 0.08, // Average DeFi return
        icon: '🏦'
      });
    }
    
    // Mining
    const ownedRigs = miningRigs.filter(rig => rig.owned > 0);
    if (ownedRigs.length > 0) {
      strategies.push({
        type: 'mining',
        name: 'Crypto Mining',
        performance: 0.12, // Average mining return
        icon: '⛏️'
      });
    }
    
    return strategies;
  };

  const getMarketOverview = () => {
    const cryptoList = Object.values(cryptos);
    const gainers = cryptoList.filter(c => c.change24h > 0).length;
    const losers = cryptoList.filter(c => c.change24h < 0).length;
    const avgChange = cryptoList.reduce((sum, c) => sum + c.change24h, 0) / cryptoList.length;
    
    return { gainers, losers, avgChange, total: cryptoList.length };
  };

  const getAchievementProgress = () => {
    const total = achievements.length;
    const unlocked = achievements.filter(a => a.unlocked).length;
    return { unlocked, total, percentage: (unlocked / total) * 100 };
  };

  const getChallengeProgress = () => {
    const total = dailyChallenges.length;
    const completed = dailyChallenges.filter(c => c.completed).length;
    return { completed, total, percentage: (completed / total) * 100 };
  };

  const allocation = getAssetAllocation();
  const topHoldings = getTopHoldings();
  const recentTransactions = getRecentTransactions();
  const activeStrategies = getActiveStrategies();
  const marketOverview = getMarketOverview();
  const achievementProgress = getAchievementProgress();
  const challengeProgress = getChallengeProgress();

  return (
    <div className="ultra-dashboard">
      {/* Hero Section */}
      <div className="dashboard-hero">
        <div className="hero-content">
          <div className="welcome-section">
            <h1 className="hero-title">
              Welcome back, <span className="player-name">Crypto Tycoon</span>
            </h1>
            <p className="hero-subtitle">
              Level {player.level} • {formatCurrency(player.experience)} XP
            </p>
          </div>
          
          <div className="hero-stats">
            <div className="hero-stat-card primary">
              <div className="stat-icon">💰</div>
              <div className="stat-content">
                <div className="stat-value">{formatCurrency(getTotalAssets())}</div>
                <div className="stat-label">Total Portfolio</div>
                <div className={`stat-change ${player.totalProfitPercent >= 0 ? 'positive' : 'negative'}`}>
                  {formatPercent(player.totalProfitPercent)}
                </div>
              </div>
            </div>
            
            <div className="hero-stat-card">
              <div className="stat-icon">📈</div>
              <div className="stat-content">
                <div className="stat-value">{formatCurrency(player.totalProfit)}</div>
                <div className="stat-label">Total P&L</div>
                <div className="stat-change positive">24h</div>
              </div>
            </div>
            
            <div className="hero-stat-card">
              <div className="stat-icon">⚡</div>
              <div className="stat-content">
                <div className="stat-value">{player.tradesCount}</div>
                <div className="stat-label">Total Trades</div>
                <div className="stat-change neutral">All time</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="hero-background">
          <div className="floating-particles">
            {[...Array(20)].map((_, i) => (
              <div key={i} className={`particle particle-${i % 4}`} />
            ))}
          </div>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="dashboard-grid">
        {/* Portfolio Overview */}
        <div className="dashboard-card portfolio-overview">
          <div className="card-header">
            <h2>🎯 Portfolio Overview</h2>
            <div className="timeframe-selector">
              {['1h', '24h', '7d', '30d'].map(tf => (
                <button
                  key={tf}
                  className={`timeframe-btn ${timeframe === tf ? 'active' : ''}`}
                  onClick={() => setTimeframe(tf)}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>
          
          <div className="portfolio-content">
            <div className="allocation-chart">
              <svg width="200" height="200" viewBox="0 0 200 200" className="donut-chart">
                <defs>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge> 
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                
                {/* Cash */}
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke="#667eea"
                  strokeWidth="20"
                  strokeDasharray={`${allocation.cash * 5.03} 503`}
                  strokeDashoffset="0"
                  filter="url(#glow)"
                  className="chart-segment"
                />
                
                {/* Portfolio */}
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke="#00ff88"
                  strokeWidth="20"
                  strokeDasharray={`${allocation.portfolio * 5.03} 503`}
                  strokeDashoffset={`-${allocation.cash * 5.03}`}
                  filter="url(#glow)"
                  className="chart-segment"
                />
                
                {/* Staking */}
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke="#ffa502"
                  strokeWidth="20"
                  strokeDasharray={`${allocation.staking * 5.03} 503`}
                  strokeDashoffset={`-${(allocation.cash + allocation.portfolio) * 5.03}`}
                  filter="url(#glow)"
                  className="chart-segment"
                />
                
                {/* Center text */}
                <text x="100" y="95" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
                  Total Assets
                </text>
                <text x="100" y="115" textAnchor="middle" fill="white" fontSize="12">
                  {formatLargeNumber(getTotalAssets())}
                </text>
              </svg>
            </div>
            
            <div className="allocation-legend">
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: '#667eea' }}></div>
                <span className="legend-label">Cash</span>
                <span className="legend-value">{allocation.cash.toFixed(1)}%</span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: '#00ff88' }}></div>
                <span className="legend-label">Portfolio</span>
                <span className="legend-value">{allocation.portfolio.toFixed(1)}%</span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: '#ffa502' }}></div>
                <span className="legend-label">Staking</span>
                <span className="legend-value">{allocation.staking.toFixed(1)}%</span>
              </div>
              {allocation.defi > 0 && (
                <div className="legend-item">
                  <div className="legend-color" style={{ backgroundColor: '#ff4757' }}></div>
                  <span className="legend-label">DeFi</span>
                  <span className="legend-value">{allocation.defi.toFixed(1)}%</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Top Holdings */}
        <div className="dashboard-card top-holdings">
          <div className="card-header">
            <h2>🏆 Top Holdings</h2>
            <span className="card-subtitle">{topHoldings.length} positions</span>
          </div>
          
          <div className="holdings-list">
            {topHoldings.map(holding => (
              <div key={holding.cryptoId} className="holding-item">
                <div className="holding-info">
                  <div className="crypto-icon" style={{ color: holding.crypto.color }}>
                    {holding.crypto.symbol}
                  </div>
                  <div className="holding-details">
                    <div className="crypto-name">{holding.crypto.name}</div>
                    <div className="holding-amount">
                      {holding.holding.amount.toFixed(4)} {holding.crypto.symbol}
                    </div>
                  </div>
                </div>
                
                <div className="holding-value">
                  <div className="value-amount">{formatCurrency(holding.value)}</div>
                  <div className={`value-change ${holding.profitPercent >= 0 ? 'positive' : 'negative'}`}>
                    {formatPercent(holding.profitPercent)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Market Overview */}
        <div className="dashboard-card market-overview">
          <div className="card-header">
            <h2>🌍 Market Overview</h2>
            <div className={`market-sentiment ${state.marketSentiment}`}>
              {state.marketSentiment.toUpperCase()}
            </div>
          </div>
          
          <div className="market-stats">
            <div className="market-stat">
              <div className="stat-icon positive">📈</div>
              <div className="stat-content">
                <div className="stat-value">{marketOverview.gainers}</div>
                <div className="stat-label">Gainers</div>
              </div>
            </div>
            
            <div className="market-stat">
              <div className="stat-icon negative">📉</div>
              <div className="stat-content">
                <div className="stat-value">{marketOverview.losers}</div>
                <div className="stat-label">Losers</div>
              </div>
            </div>
            
            <div className="market-stat">
              <div className="stat-icon neutral">📊</div>
              <div className="stat-content">
                <div className="stat-value">{formatPercent(marketOverview.avgChange)}</div>
                <div className="stat-label">Avg Change</div>
              </div>
            </div>
          </div>
          
          <div className="crypto-grid">
            {Object.values(cryptos).slice(0, 4).map(crypto => (
              <div key={crypto.id} className="crypto-mini-card">
                <div className="crypto-header">
                  <span className="crypto-symbol" style={{ color: crypto.color }}>
                    {crypto.symbol}
                  </span>
                  <span className={`crypto-change ${crypto.change24h >= 0 ? 'positive' : 'negative'}`}>
                    {formatPercent(crypto.change24h)}
                  </span>
                </div>
                <div className="crypto-price">{formatCurrency(crypto.price)}</div>
                <div className="crypto-chart">
                  <svg width="100%" height="30" viewBox="0 0 100 30">
                    <polyline
                      fill="none"
                      stroke={crypto.color}
                      strokeWidth="2"
                      points={crypto.history.slice(-10).map((point, index) => {
                        const x = (index / 9) * 100;
                        const y = 15 + (Math.sin(index) * 5);
                        return `${x},${y}`;
                      }).join(' ')}
                    />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Strategies */}
        <div className="dashboard-card active-strategies">
          <div className="card-header">
            <h2>🚀 Active Strategies</h2>
            <span className="card-subtitle">{activeStrategies.length} active</span>
          </div>
          
          <div className="strategies-list">
            {activeStrategies.map((strategy, index) => (
              <div key={index} className="strategy-item">
                <div className="strategy-icon">{strategy.icon}</div>
                <div className="strategy-info">
                  <div className="strategy-name">{strategy.name}</div>
                  <div className="strategy-type">{strategy.type.toUpperCase()}</div>
                </div>
                <div className="strategy-performance">
                  <div className={`performance-value ${strategy.performance >= 0 ? 'positive' : 'negative'}`}>
                    {formatPercent(strategy.performance * 100)}
                  </div>
                  <div className="performance-label">Performance</div>
                </div>
              </div>
            ))}
            
            {activeStrategies.length === 0 && (
              <div className="no-strategies">
                <div className="empty-icon">🎯</div>
                <div className="empty-text">No active strategies</div>
                <div className="empty-subtitle">Deploy bots or start staking to see them here</div>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="dashboard-card recent-activity">
          <div className="card-header">
            <h2>📋 Recent Activity</h2>
            <span className="card-subtitle">Last {recentTransactions.length} transactions</span>
          </div>
          
          <div className="activity-list">
            {recentTransactions.map(transaction => (
              <div key={transaction.id} className="activity-item">
                <div className={`activity-icon ${transaction.type}`}>
                  {transaction.type === 'buy' ? '📈' : '📉'}
                </div>
                <div className="activity-info">
                  <div className="activity-description">
                    {transaction.type.toUpperCase()} {transaction.amount.toFixed(4)} {transaction.cryptoId}
                  </div>
                  <div className="activity-time">
                    {new Date(transaction.timestamp).toLocaleTimeString()}
                  </div>
                </div>
                <div className="activity-value">
                  <div className={`value-amount ${transaction.type === 'buy' ? 'negative' : 'positive'}`}>
                    {transaction.type === 'buy' ? '-' : '+'}{formatCurrency(transaction.total)}
                  </div>
                </div>
              </div>
            ))}
            
            {recentTransactions.length === 0 && (
              <div className="no-activity">
                <div className="empty-icon">📊</div>
                <div className="empty-text">No recent activity</div>
                <div className="empty-subtitle">Start trading to see transactions here</div>
              </div>
            )}
          </div>
        </div>

        {/* Progress Tracking */}
        <div className="dashboard-card progress-tracking">
          <div className="card-header">
            <h2>🎯 Progress Tracking</h2>
          </div>
          
          <div className="progress-content">
            <div className="progress-item">
              <div className="progress-header">
                <span className="progress-label">🏆 Achievements</span>
                <span className="progress-value">
                  {achievementProgress.unlocked}/{achievementProgress.total}
                </span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill achievements"
                  style={{ width: `${achievementProgress.percentage}%` }}
                />
              </div>
              <div className="progress-percentage">{achievementProgress.percentage.toFixed(0)}%</div>
            </div>
            
            <div className="progress-item">
              <div className="progress-header">
                <span className="progress-label">🎯 Daily Challenges</span>
                <span className="progress-value">
                  {challengeProgress.completed}/{challengeProgress.total}
                </span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill challenges"
                  style={{ width: `${challengeProgress.percentage}%` }}
                />
              </div>
              <div className="progress-percentage">{challengeProgress.percentage.toFixed(0)}%</div>
            </div>
            
            <div className="progress-item">
              <div className="progress-header">
                <span className="progress-label">📊 Portfolio Diversity</span>
                <span className="progress-value">
                  {Object.keys(portfolio).length}/8
                </span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill diversity"
                  style={{ width: `${(Object.keys(portfolio).length / 8) * 100}%` }}
                />
              </div>
              <div className="progress-percentage">{((Object.keys(portfolio).length / 8) * 100).toFixed(0)}%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UltraDashboard;