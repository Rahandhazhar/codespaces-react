import React from 'react';
import { useGame } from '../context/EnhancedGameContext';
import './Dashboard.css';

function Dashboard() {
  const { state } = useGame();
  const { player, portfolio, cryptos, transactions } = state;

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

  const getPortfolioHoldings = () => {
    return Object.keys(portfolio).map(cryptoId => {
      const holding = portfolio[cryptoId];
      const crypto = cryptos[cryptoId];
      const currentValue = holding.amount * crypto.price;
      const totalCost = holding.amount * holding.avgBuyPrice;
      const profit = currentValue - totalCost;
      const profitPercent = (profit / totalCost) * 100;

      return {
        cryptoId,
        crypto,
        holding,
        currentValue,
        profit,
        profitPercent
      };
    });
  };

  const portfolioHoldings = getPortfolioHoldings();
  const totalPortfolioValue = portfolioHoldings.reduce((sum, h) => sum + h.currentValue, 0);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Portfolio Overview</h1>
        <div className="total-value">
          <span className="label">Total Value</span>
          <span className="value">{formatCurrency(player.totalValue)}</span>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Portfolio Summary */}
        <div className="card portfolio-summary">
          <h2>Portfolio Summary</h2>
          <div className="summary-stats">
            <div className="stat">
              <span className="label">Cash</span>
              <span className="value">{formatCurrency(player.cash)}</span>
            </div>
            <div className="stat">
              <span className="label">Crypto Holdings</span>
              <span className="value">{formatCurrency(totalPortfolioValue)}</span>
            </div>
            <div className="stat">
              <span className="label">Total Profit/Loss</span>
              <span className={`value ${player.totalProfit >= 0 ? 'positive' : 'negative'}`}>
                {formatCurrency(player.totalProfit)} ({formatPercent(player.totalProfitPercent)})
              </span>
            </div>
            <div className="stat">
              <span className="label">Starting Capital</span>
              <span className="value">{formatCurrency(player.startingCash)}</span>
            </div>
          </div>
        </div>

        {/* Current Holdings */}
        <div className="card current-holdings">
          <h2>Current Holdings</h2>
          {portfolioHoldings.length === 0 ? (
            <p className="no-holdings">No crypto holdings yet. Start trading to build your portfolio!</p>
          ) : (
            <div className="holdings-list">
              {portfolioHoldings.map(({ cryptoId, crypto, holding, currentValue, profit, profitPercent }) => (
                <div key={cryptoId} className="holding-item">
                  <div className="crypto-info">
                    <div className="crypto-name" style={{ color: crypto.color }}>
                      {crypto.symbol}
                    </div>
                    <div className="crypto-amount">
                      {holding.amount.toFixed(8)} {crypto.symbol}
                    </div>
                  </div>
                  <div className="holding-values">
                    <div className="current-value">{formatCurrency(currentValue)}</div>
                    <div className={`profit ${profit >= 0 ? 'positive' : 'negative'}`}>
                      {formatCurrency(profit)} ({formatPercent(profitPercent)})
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Market Overview */}
        <div className="card market-overview">
          <h2>Market Overview</h2>
          <div className="market-list">
            {Object.values(cryptos).slice(0, 4).map(crypto => (
              <div key={crypto.id} className="market-item">
                <div className="crypto-info">
                  <span className="crypto-name" style={{ color: crypto.color }}>
                    {crypto.symbol}
                  </span>
                  <span className="crypto-price">{formatCurrency(crypto.price)}</span>
                </div>
                <div className={`change ${crypto.change24h >= 0 ? 'positive' : 'negative'}`}>
                  {formatPercent(crypto.change24h)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="card recent-transactions">
          <h2>Recent Transactions</h2>
          {transactions.length === 0 ? (
            <p className="no-transactions">No transactions yet.</p>
          ) : (
            <div className="transactions-list">
              {transactions.slice(0, 5).map(transaction => (
                <div key={transaction.id} className="transaction-item">
                  <div className="transaction-info">
                    <span className={`type ${transaction.type}`}>
                      {transaction.type.toUpperCase()}
                    </span>
                    <span className="crypto">{transaction.cryptoId}</span>
                  </div>
                  <div className="transaction-details">
                    <div className="amount">{transaction.amount.toFixed(8)}</div>
                    <div className="total">{formatCurrency(transaction.total)}</div>
                  </div>
                  <div className="timestamp">
                    {new Date(transaction.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;