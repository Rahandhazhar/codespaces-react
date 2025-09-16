import React, { useState } from 'react';
import { useGame } from '../context/EnhancedGameContext';
import './PortfolioAnalytics.css';

function PortfolioAnalytics() {
  const { state } = useGame();
  const { portfolio, stakedPortfolio, cryptos, transactions, player } = state;
  const [timeframe, setTimeframe] = useState('7d');
  const [analyticsView, setAnalyticsView] = useState('overview');

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
    }).format(amount);
  };

  const formatPercent = (percent) => {
    const sign = percent >= 0 ? '+' : '';
    return `${sign}${percent.toFixed(2)}%`;
  };

  const getPortfolioData = () => {
    const holdings = Object.keys(portfolio).map(cryptoId => {
      const holding = portfolio[cryptoId];
      const crypto = cryptos[cryptoId];
      const currentValue = holding.amount * crypto.price * holding.leverage;
      const totalCost = holding.amount * holding.avgBuyPrice * holding.leverage;
      const profit = currentValue - totalCost;
      const profitPercent = (profit / totalCost) * 100;

      return {
        cryptoId,
        crypto,
        holding,
        currentValue,
        totalCost,
        profit,
        profitPercent,
        allocation: 0 // Will be calculated below
      };
    });

    const totalValue = holdings.reduce((sum, h) => sum + h.currentValue, 0);
    holdings.forEach(h => {
      h.allocation = totalValue > 0 ? (h.currentValue / totalValue) * 100 : 0;
    });

    return { holdings, totalValue };
  };

  const getStakedData = () => {
    return Object.keys(stakedPortfolio).map(cryptoId => {
      const staked = stakedPortfolio[cryptoId];
      const crypto = cryptos[cryptoId];
      const currentValue = staked.amount * crypto.price;
      const timeStaked = (Date.now() - staked.startTime) / (1000 * 60 * 60 * 24 * 365);
      const rewards = staked.amount * crypto.price * crypto.stakingReward * timeStaked;

      return {
        cryptoId,
        crypto,
        staked,
        currentValue,
        rewards,
        timeStaked: timeStaked * 365 // in days
      };
    });
  };

  const getPerformanceMetrics = () => {
    const { totalValue } = getPortfolioData();
    const stakedValue = getStakedData().reduce((sum, s) => sum + s.currentValue, 0);
    const totalPortfolioValue = totalValue + stakedValue;
    
    const totalReturn = ((totalPortfolioValue + player.cash - player.startingCash) / player.startingCash) * 100;
    const portfolioReturn = totalPortfolioValue > 0 ? ((totalPortfolioValue - (player.startingCash - player.cash)) / (player.startingCash - player.cash)) * 100 : 0;
    
    // Calculate Sharpe ratio (simplified)
    const avgReturn = totalReturn / 30; // Assuming 30 days
    const volatility = 15; // Simplified volatility
    const sharpeRatio = avgReturn / volatility;

    // Calculate max drawdown (simplified)
    const maxDrawdown = -5; // Placeholder

    return {
      totalReturn,
      portfolioReturn,
      sharpeRatio,
      maxDrawdown,
      totalPortfolioValue,
      cashAllocation: (player.cash / player.totalValue) * 100
    };
  };

  const getRiskMetrics = () => {
    const { holdings } = getPortfolioData();
    
    // Diversification score (0-100)
    const numHoldings = holdings.length;
    const maxAllocation = Math.max(...holdings.map(h => h.allocation));
    const diversificationScore = Math.min(100, (numHoldings * 20) - (maxAllocation - 20));

    // Risk score based on volatility and leverage
    const avgVolatility = holdings.reduce((sum, h) => sum + (cryptos[h.cryptoId].volatility * h.allocation / 100), 0);
    const avgLeverage = holdings.reduce((sum, h) => sum + (h.holding.leverage * h.allocation / 100), 0);
    const riskScore = Math.min(100, (avgVolatility * 1000) + ((avgLeverage - 1) * 20));

    return {
      diversificationScore,
      riskScore,
      avgVolatility: avgVolatility * 100,
      avgLeverage,
      numHoldings
    };
  };

  const getTopPerformers = () => {
    const { holdings } = getPortfolioData();
    return holdings
      .sort((a, b) => b.profitPercent - a.profitPercent)
      .slice(0, 3);
  };

  const getWorstPerformers = () => {
    const { holdings } = getPortfolioData();
    return holdings
      .sort((a, b) => a.profitPercent - b.profitPercent)
      .slice(0, 3);
  };

  const getTradingStats = () => {
    const buyTrades = transactions.filter(t => t.type === 'buy');
    const sellTrades = transactions.filter(t => t.type === 'sell');
    const totalVolume = transactions.reduce((sum, t) => sum + t.total, 0);
    const avgTradeSize = totalVolume / transactions.length || 0;
    const winRate = sellTrades.length > 0 ? (sellTrades.filter(t => {
      const buyPrice = buyTrades.find(b => b.cryptoId === t.cryptoId)?.price || t.price;
      return t.price > buyPrice;
    }).length / sellTrades.length) * 100 : 0;

    return {
      totalTrades: transactions.length,
      buyTrades: buyTrades.length,
      sellTrades: sellTrades.length,
      totalVolume,
      avgTradeSize,
      winRate
    };
  };

  const { holdings, totalValue } = getPortfolioData();
  const stakedData = getStakedData();
  const performanceMetrics = getPerformanceMetrics();
  const riskMetrics = getRiskMetrics();
  const tradingStats = getTradingStats();

  return (
    <div className="portfolio-analytics">
      <div className="analytics-header">
        <h1>📊 Portfolio Analytics</h1>
        <div className="analytics-controls">
          <div className="timeframe-selector">
            <button
              className={`timeframe-btn ${timeframe === '1d' ? 'active' : ''}`}
              onClick={() => setTimeframe('1d')}
            >
              1D
            </button>
            <button
              className={`timeframe-btn ${timeframe === '7d' ? 'active' : ''}`}
              onClick={() => setTimeframe('7d')}
            >
              7D
            </button>
            <button
              className={`timeframe-btn ${timeframe === '30d' ? 'active' : ''}`}
              onClick={() => setTimeframe('30d')}
            >
              30D
            </button>
            <button
              className={`timeframe-btn ${timeframe === '90d' ? 'active' : ''}`}
              onClick={() => setTimeframe('90d')}
            >
              90D
            </button>
          </div>
          
          <div className="view-selector">
            <button
              className={`view-btn ${analyticsView === 'overview' ? 'active' : ''}`}
              onClick={() => setAnalyticsView('overview')}
            >
              Overview
            </button>
            <button
              className={`view-btn ${analyticsView === 'performance' ? 'active' : ''}`}
              onClick={() => setAnalyticsView('performance')}
            >
              Performance
            </button>
            <button
              className={`view-btn ${analyticsView === 'risk' ? 'active' : ''}`}
              onClick={() => setAnalyticsView('risk')}
            >
              Risk
            </button>
            <button
              className={`view-btn ${analyticsView === 'trading' ? 'active' : ''}`}
              onClick={() => setAnalyticsView('trading')}
            >
              Trading
            </button>
          </div>
        </div>
      </div>

      <div className="analytics-content">
        {analyticsView === 'overview' && (
          <>
            {/* Portfolio Overview */}
            <div className="overview-grid">
              <div className="metric-card">
                <h3>💰 Total Portfolio Value</h3>
                <div className="metric-value">{formatCurrency(performanceMetrics.totalPortfolioValue)}</div>
                <div className={`metric-change ${performanceMetrics.totalReturn >= 0 ? 'positive' : 'negative'}`}>
                  {formatPercent(performanceMetrics.totalReturn)}
                </div>
              </div>

              <div className="metric-card">
                <h3>📈 Portfolio Return</h3>
                <div className="metric-value">{formatPercent(performanceMetrics.portfolioReturn)}</div>
                <div className="metric-subtitle">Excluding cash</div>
              </div>

              <div className="metric-card">
                <h3>🎯 Diversification Score</h3>
                <div className="metric-value">{riskMetrics.diversificationScore.toFixed(0)}/100</div>
                <div className={`metric-subtitle ${riskMetrics.diversificationScore >= 70 ? 'positive' : riskMetrics.diversificationScore >= 40 ? 'neutral' : 'negative'}`}>
                  {riskMetrics.diversificationScore >= 70 ? 'Well Diversified' : riskMetrics.diversificationScore >= 40 ? 'Moderately Diversified' : 'Concentrated'}
                </div>
              </div>

              <div className="metric-card">
                <h3>⚠️ Risk Score</h3>
                <div className="metric-value">{riskMetrics.riskScore.toFixed(0)}/100</div>
                <div className={`metric-subtitle ${riskMetrics.riskScore <= 30 ? 'positive' : riskMetrics.riskScore <= 60 ? 'neutral' : 'negative'}`}>
                  {riskMetrics.riskScore <= 30 ? 'Low Risk' : riskMetrics.riskScore <= 60 ? 'Medium Risk' : 'High Risk'}
                </div>
              </div>
            </div>

            {/* Portfolio Allocation */}
            <div className="allocation-section">
              <h2>🥧 Portfolio Allocation</h2>
              <div className="allocation-grid">
                <div className="allocation-chart">
                  <svg width="300" height="300" viewBox="0 0 300 300">
                    {holdings.map((holding, index) => {
                      const startAngle = holdings.slice(0, index).reduce((sum, h) => sum + (h.allocation * 3.6), 0);
                      const endAngle = startAngle + (holding.allocation * 3.6);
                      const largeArcFlag = holding.allocation > 50 ? 1 : 0;
                      
                      const x1 = 150 + 100 * Math.cos((startAngle - 90) * Math.PI / 180);
                      const y1 = 150 + 100 * Math.sin((startAngle - 90) * Math.PI / 180);
                      const x2 = 150 + 100 * Math.cos((endAngle - 90) * Math.PI / 180);
                      const y2 = 150 + 100 * Math.sin((endAngle - 90) * Math.PI / 180);
                      
                      return (
                        <path
                          key={holding.cryptoId}
                          d={`M 150 150 L ${x1} ${y1} A 100 100 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                          fill={holding.crypto.color}
                          opacity="0.8"
                        />
                      );
                    })}
                    {/* Cash allocation */}
                    {performanceMetrics.cashAllocation > 0 && (
                      <path
                        d={`M 150 150 L ${150 + 100 * Math.cos((holdings.reduce((sum, h) => sum + (h.allocation * 3.6), 0) - 90) * Math.PI / 180)} ${150 + 100 * Math.sin((holdings.reduce((sum, h) => sum + (h.allocation * 3.6), 0) - 90) * Math.PI / 180)} A 100 100 0 0 1 ${150 + 100 * Math.cos((-90) * Math.PI / 180)} ${150 + 100 * Math.sin((-90) * Math.PI / 180)} Z`}
                        fill="#666"
                        opacity="0.8"
                      />
                    )}
                  </svg>
                </div>
                
                <div className="allocation-legend">
                  {holdings.map(holding => (
                    <div key={holding.cryptoId} className="legend-item">
                      <div className="legend-color" style={{ backgroundColor: holding.crypto.color }}></div>
                      <div className="legend-info">
                        <span className="legend-symbol">{holding.crypto.symbol}</span>
                        <span className="legend-percentage">{holding.allocation.toFixed(1)}%</span>
                        <span className="legend-value">{formatCurrency(holding.currentValue)}</span>
                      </div>
                    </div>
                  ))}
                  {performanceMetrics.cashAllocation > 0 && (
                    <div className="legend-item">
                      <div className="legend-color" style={{ backgroundColor: '#666' }}></div>
                      <div className="legend-info">
                        <span className="legend-symbol">CASH</span>
                        <span className="legend-percentage">{performanceMetrics.cashAllocation.toFixed(1)}%</span>
                        <span className="legend-value">{formatCurrency(player.cash)}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Top Holdings */}
            <div className="holdings-section">
              <h2>🏆 Top Holdings</h2>
              <div className="holdings-table">
                <div className="table-header">
                  <span>Asset</span>
                  <span>Amount</span>
                  <span>Value</span>
                  <span>P&L</span>
                  <span>Allocation</span>
                </div>
                {holdings.slice(0, 5).map(holding => (
                  <div key={holding.cryptoId} className="table-row">
                    <div className="asset-info">
                      <span className="asset-symbol" style={{ color: holding.crypto.color }}>
                        {holding.crypto.symbol}
                      </span>
                      <span className="asset-name">{holding.crypto.name}</span>
                    </div>
                    <span className="amount">{holding.holding.amount.toFixed(8)}</span>
                    <span className="value">{formatCurrency(holding.currentValue)}</span>
                    <span className={`pnl ${holding.profit >= 0 ? 'positive' : 'negative'}`}>
                      {formatCurrency(holding.profit)} ({formatPercent(holding.profitPercent)})
                    </span>
                    <span className="allocation">{holding.allocation.toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {analyticsView === 'performance' && (
          <>
            {/* Performance Metrics */}
            <div className="performance-grid">
              <div className="metric-card">
                <h3>📊 Sharpe Ratio</h3>
                <div className="metric-value">{performanceMetrics.sharpeRatio.toFixed(2)}</div>
                <div className="metric-subtitle">Risk-adjusted return</div>
              </div>

              <div className="metric-card">
                <h3>📉 Max Drawdown</h3>
                <div className="metric-value negative">{performanceMetrics.maxDrawdown.toFixed(2)}%</div>
                <div className="metric-subtitle">Largest peak-to-trough decline</div>
              </div>

              <div className="metric-card">
                <h3>🎯 Win Rate</h3>
                <div className="metric-value">{tradingStats.winRate.toFixed(1)}%</div>
                <div className="metric-subtitle">Profitable trades</div>
              </div>

              <div className="metric-card">
                <h3>💎 Staking Rewards</h3>
                <div className="metric-value positive">{formatCurrency(player.stakingRewards)}</div>
                <div className="metric-subtitle">Total earned</div>
              </div>
            </div>

            {/* Top & Worst Performers */}
            <div className="performers-section">
              <div className="performers-card">
                <h3>🚀 Top Performers</h3>
                {getTopPerformers().map(holding => (
                  <div key={holding.cryptoId} className="performer-item">
                    <span className="performer-symbol" style={{ color: holding.crypto.color }}>
                      {holding.crypto.symbol}
                    </span>
                    <span className="performer-return positive">
                      {formatPercent(holding.profitPercent)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="performers-card">
                <h3>📉 Worst Performers</h3>
                {getWorstPerformers().map(holding => (
                  <div key={holding.cryptoId} className="performer-item">
                    <span className="performer-symbol" style={{ color: holding.crypto.color }}>
                      {holding.crypto.symbol}
                    </span>
                    <span className="performer-return negative">
                      {formatPercent(holding.profitPercent)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {analyticsView === 'risk' && (
          <>
            {/* Risk Metrics */}
            <div className="risk-grid">
              <div className="metric-card">
                <h3>🎯 Diversification</h3>
                <div className="metric-value">{riskMetrics.diversificationScore.toFixed(0)}/100</div>
                <div className="metric-subtitle">{riskMetrics.numHoldings} different assets</div>
              </div>

              <div className="metric-card">
                <h3>📊 Average Volatility</h3>
                <div className="metric-value">{riskMetrics.avgVolatility.toFixed(1)}%</div>
                <div className="metric-subtitle">Portfolio volatility</div>
              </div>

              <div className="metric-card">
                <h3>⚡ Average Leverage</h3>
                <div className="metric-value">{riskMetrics.avgLeverage.toFixed(1)}x</div>
                <div className="metric-subtitle">Risk multiplier</div>
              </div>

              <div className="metric-card">
                <h3>💰 Cash Buffer</h3>
                <div className="metric-value">{performanceMetrics.cashAllocation.toFixed(1)}%</div>
                <div className="metric-subtitle">Available liquidity</div>
              </div>
            </div>

            {/* Risk Recommendations */}
            <div className="recommendations-section">
              <h2>💡 Risk Management Recommendations</h2>
              <div className="recommendations-list">
                {riskMetrics.diversificationScore < 50 && (
                  <div className="recommendation warning">
                    <span className="rec-icon">⚠️</span>
                    <div className="rec-content">
                      <h4>Improve Diversification</h4>
                      <p>Consider spreading your investments across more cryptocurrencies to reduce concentration risk.</p>
                    </div>
                  </div>
                )}
                
                {riskMetrics.avgLeverage > 2 && (
                  <div className="recommendation danger">
                    <span className="rec-icon">🚨</span>
                    <div className="rec-content">
                      <h4>High Leverage Risk</h4>
                      <p>Your average leverage is high. Consider reducing leverage to minimize liquidation risk.</p>
                    </div>
                  </div>
                )}
                
                {performanceMetrics.cashAllocation < 10 && (
                  <div className="recommendation info">
                    <span className="rec-icon">💡</span>
                    <div className="rec-content">
                      <h4>Low Cash Reserves</h4>
                      <p>Consider keeping some cash available for opportunities and emergency situations.</p>
                    </div>
                  </div>
                )}
                
                {riskMetrics.diversificationScore >= 70 && riskMetrics.avgLeverage <= 2 && (
                  <div className="recommendation success">
                    <span className="rec-icon">✅</span>
                    <div className="rec-content">
                      <h4>Well-Balanced Portfolio</h4>
                      <p>Your portfolio shows good diversification and reasonable risk levels. Keep it up!</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {analyticsView === 'trading' && (
          <>
            {/* Trading Statistics */}
            <div className="trading-grid">
              <div className="metric-card">
                <h3>📊 Total Trades</h3>
                <div className="metric-value">{tradingStats.totalTrades}</div>
                <div className="metric-subtitle">
                  {tradingStats.buyTrades} buys, {tradingStats.sellTrades} sells
                </div>
              </div>

              <div className="metric-card">
                <h3>💰 Total Volume</h3>
                <div className="metric-value">{formatCurrency(tradingStats.totalVolume)}</div>
                <div className="metric-subtitle">All-time trading volume</div>
              </div>

              <div className="metric-card">
                <h3>📈 Average Trade Size</h3>
                <div className="metric-value">{formatCurrency(tradingStats.avgTradeSize)}</div>
                <div className="metric-subtitle">Per transaction</div>
              </div>

              <div className="metric-card">
                <h3>🎯 Win Rate</h3>
                <div className="metric-value">{tradingStats.winRate.toFixed(1)}%</div>
                <div className="metric-subtitle">Profitable trades</div>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="transactions-section">
              <h2>📋 Recent Transactions</h2>
              <div className="transactions-table">
                <div className="table-header">
                  <span>Type</span>
                  <span>Asset</span>
                  <span>Amount</span>
                  <span>Price</span>
                  <span>Total</span>
                  <span>Time</span>
                </div>
                {transactions.slice(0, 10).map(transaction => (
                  <div key={transaction.id} className="table-row">
                    <span className={`transaction-type ${transaction.type}`}>
                      {transaction.type.toUpperCase()}
                    </span>
                    <span className="asset">{transaction.cryptoId}</span>
                    <span className="amount">{transaction.amount.toFixed(8)}</span>
                    <span className="price">{formatCurrency(transaction.price)}</span>
                    <span className="total">{formatCurrency(transaction.total)}</span>
                    <span className="time">
                      {new Date(transaction.timestamp).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default PortfolioAnalytics;