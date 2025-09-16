import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import './Market.css';

function Market() {
  const { state, buyCrypto, sellCrypto } = useGame();
  const { cryptos, player, portfolio } = state;
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [tradeAmount, setTradeAmount] = useState('');
  const [tradeType, setTradeType] = useState('buy');

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 8
    }).format(amount);
  };

  const formatPercent = (percent) => {
    const sign = percent >= 0 ? '+' : '';
    return `${sign}${percent.toFixed(2)}%`;
  };

  const handleTrade = () => {
    if (!selectedCrypto || !tradeAmount || parseFloat(tradeAmount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    const amount = parseFloat(tradeAmount);
    const crypto = cryptos[selectedCrypto];

    if (tradeType === 'buy') {
      const cost = amount * crypto.price * 1.001; // Include 0.1% fee
      if (cost > player.cash) {
        alert('Insufficient funds');
        return;
      }
      buyCrypto(selectedCrypto, amount);
    } else {
      const holding = portfolio[selectedCrypto];
      if (!holding || amount > holding.amount) {
        alert('Insufficient holdings');
        return;
      }
      sellCrypto(selectedCrypto, amount);
    }

    setTradeAmount('');
  };

  const getMaxBuyAmount = () => {
    if (!selectedCrypto) return 0;
    const crypto = cryptos[selectedCrypto];
    return (player.cash * 0.999) / crypto.price; // Account for 0.1% fee
  };

  const getMaxSellAmount = () => {
    if (!selectedCrypto) return 0;
    const holding = portfolio[selectedCrypto];
    return holding ? holding.amount : 0;
  };

  const calculateTradeValue = () => {
    if (!selectedCrypto || !tradeAmount) return 0;
    const amount = parseFloat(tradeAmount);
    const crypto = cryptos[selectedCrypto];
    const fee = tradeType === 'buy' ? 1.001 : 0.999;
    return amount * crypto.price * fee;
  };

  return (
    <div className="market">
      <div className="market-header">
        <h1>Crypto Market</h1>
        <div className="market-stats">
          <span>Available Cash: {formatCurrency(player.cash)}</span>
        </div>
      </div>

      <div className="market-content">
        {/* Crypto List */}
        <div className="crypto-list">
          <h2>Available Cryptocurrencies</h2>
          <div className="crypto-grid">
            {Object.values(cryptos).map(crypto => {
              const holding = portfolio[crypto.id];
              const isSelected = selectedCrypto === crypto.id;
              
              return (
                <div
                  key={crypto.id}
                  className={`crypto-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => setSelectedCrypto(crypto.id)}
                >
                  <div className="crypto-header">
                    <div className="crypto-name" style={{ color: crypto.color }}>
                      <span className="symbol">{crypto.symbol}</span>
                      <span className="name">{crypto.name}</span>
                    </div>
                    <div className="crypto-price">
                      {formatCurrency(crypto.price)}
                    </div>
                  </div>
                  
                  <div className="crypto-stats">
                    <div className={`change ${crypto.change24h >= 0 ? 'positive' : 'negative'}`}>
                      24h: {formatPercent(crypto.change24h)}
                    </div>
                    {holding && (
                      <div className="holdings">
                        Holdings: {holding.amount.toFixed(8)} {crypto.symbol}
                      </div>
                    )}
                  </div>

                  {/* Simple price chart */}
                  <div className="price-chart">
                    {crypto.history.length > 1 && (
                      <svg width="100%" height="40" viewBox="0 0 100 40">
                        <polyline
                          fill="none"
                          stroke={crypto.color}
                          strokeWidth="2"
                          points={crypto.history.slice(-20).map((point, index) => {
                            const x = (index / 19) * 100;
                            const minPrice = Math.min(...crypto.history.slice(-20).map(p => p.price));
                            const maxPrice = Math.max(...crypto.history.slice(-20).map(p => p.price));
                            const y = 35 - ((point.price - minPrice) / (maxPrice - minPrice)) * 30;
                            return `${x},${y}`;
                          }).join(' ')}
                        />
                      </svg>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Trading Panel */}
        {selectedCrypto && (
          <div className="trading-panel">
            <h2>Trade {cryptos[selectedCrypto].name}</h2>
            
            <div className="trade-controls">
              <div className="trade-type-selector">
                <button
                  className={`trade-type-btn ${tradeType === 'buy' ? 'active' : ''}`}
                  onClick={() => setTradeType('buy')}
                >
                  Buy
                </button>
                <button
                  className={`trade-type-btn ${tradeType === 'sell' ? 'active' : ''}`}
                  onClick={() => setTradeType('sell')}
                >
                  Sell
                </button>
              </div>

              <div className="amount-input">
                <label>Amount ({cryptos[selectedCrypto].symbol})</label>
                <input
                  type="number"
                  value={tradeAmount}
                  onChange={(e) => setTradeAmount(e.target.value)}
                  placeholder="Enter amount"
                  step="0.00000001"
                  min="0"
                />
                <div className="amount-helpers">
                  <button
                    onClick={() => setTradeAmount((tradeType === 'buy' ? getMaxBuyAmount() : getMaxSellAmount()).toString())}
                  >
                    Max
                  </button>
                  <button
                    onClick={() => setTradeAmount(((tradeType === 'buy' ? getMaxBuyAmount() : getMaxSellAmount()) * 0.5).toString())}
                  >
                    50%
                  </button>
                  <button
                    onClick={() => setTradeAmount(((tradeType === 'buy' ? getMaxBuyAmount() : getMaxSellAmount()) * 0.25).toString())}
                  >
                    25%
                  </button>
                </div>
              </div>

              <div className="trade-summary">
                <div className="summary-row">
                  <span>Price per {cryptos[selectedCrypto].symbol}:</span>
                  <span>{formatCurrency(cryptos[selectedCrypto].price)}</span>
                </div>
                <div className="summary-row">
                  <span>Total Value:</span>
                  <span>{formatCurrency(calculateTradeValue())}</span>
                </div>
                <div className="summary-row">
                  <span>Fee (0.1%):</span>
                  <span>{formatCurrency(calculateTradeValue() * 0.001)}</span>
                </div>
                {tradeType === 'buy' && (
                  <div className="summary-row">
                    <span>Cash After Trade:</span>
                    <span>{formatCurrency(player.cash - calculateTradeValue())}</span>
                  </div>
                )}
              </div>

              <button
                className={`trade-btn ${tradeType}`}
                onClick={handleTrade}
                disabled={!tradeAmount || parseFloat(tradeAmount) <= 0}
              >
                {tradeType === 'buy' ? 'Buy' : 'Sell'} {cryptos[selectedCrypto].symbol}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Market;