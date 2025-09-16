import React, { useState } from 'react';
import { useGame } from '../context/EnhancedGameContext';
import './AdvancedTrading.css';

function AdvancedTrading() {
  const { state, buyCrypto, sellCrypto } = useGame();
  const { cryptos, player, portfolio } = state;
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [tradeAmount, setTradeAmount] = useState('');
  const [tradeType, setTradeType] = useState('buy');
  const [orderType, setOrderType] = useState('market'); // market, limit, stop-loss
  const [leverage, setLeverage] = useState(1);
  const [limitPrice, setLimitPrice] = useState('');
  const [stopLossPrice, setStopLossPrice] = useState('');
  const [takeProfitPrice, setTakeProfitPrice] = useState('');

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

  const getTechnicalIndicator = (crypto) => {
    const { rsi, macd, sentiment } = crypto;
    let signal = 'NEUTRAL';
    let color = '#ffa502';
    
    if (rsi < 30 && macd > 0) {
      signal = 'STRONG BUY';
      color = '#00ff88';
    } else if (rsi < 40 && sentiment === 'bullish') {
      signal = 'BUY';
      color = '#00d4aa';
    } else if (rsi > 70 && macd < 0) {
      signal = 'STRONG SELL';
      color = '#ff4757';
    } else if (rsi > 60 && sentiment === 'bearish') {
      signal = 'SELL';
      color = '#ff6b7a';
    }
    
    return { signal, color };
  };

  const handleAdvancedTrade = () => {
    if (!selectedCrypto || !tradeAmount || parseFloat(tradeAmount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    const amount = parseFloat(tradeAmount);
    const crypto = cryptos[selectedCrypto];

    if (orderType === 'market') {
      if (tradeType === 'buy') {
        const cost = amount * crypto.price * leverage * 1.001;
        if (cost > player.cash) {
          alert('Insufficient funds');
          return;
        }
        buyCrypto(selectedCrypto, amount, leverage);
      } else {
        const holding = portfolio[selectedCrypto];
        if (!holding || amount > holding.amount) {
          alert('Insufficient holdings');
          return;
        }
        sellCrypto(selectedCrypto, amount);
      }
    } else {
      // For limit and stop-loss orders, we would add them to pending orders
      // This is a simplified implementation
      alert(`${orderType} order placed! (Feature coming soon)`);
    }

    setTradeAmount('');
  };

  const getMaxBuyAmount = () => {
    if (!selectedCrypto) return 0;
    const crypto = cryptos[selectedCrypto];
    return (player.cash * 0.999) / (crypto.price * leverage);
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
    const price = orderType === 'limit' && limitPrice ? parseFloat(limitPrice) : crypto.price;
    const fee = tradeType === 'buy' ? 1.001 : 0.999;
    return amount * price * leverage * fee;
  };

  const getLeverageRisk = () => {
    if (leverage <= 1) return { level: 'Low', color: '#00ff88' };
    if (leverage <= 2) return { level: 'Medium', color: '#ffa502' };
    if (leverage <= 3) return { level: 'High', color: '#ff6b7a' };
    return { level: 'Extreme', color: '#ff4757' };
  };

  return (
    <div className="advanced-trading">
      <div className="trading-header">
        <h1>🚀 Advanced Trading</h1>
        <div className="market-sentiment">
          <span className="label">Market Sentiment:</span>
          <span className={`sentiment ${state.marketSentiment}`}>
            {state.marketSentiment.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="trading-content">
        {/* Crypto Selection with Technical Analysis */}
        <div className="crypto-analysis-grid">
          {Object.values(cryptos).map(crypto => {
            const holding = portfolio[crypto.id];
            const isSelected = selectedCrypto === crypto.id;
            const technical = getTechnicalIndicator(crypto);
            
            return (
              <div
                key={crypto.id}
                className={`crypto-analysis-card ${isSelected ? 'selected' : ''}`}
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
                
                <div className="technical-indicators">
                  <div className="indicator">
                    <span className="label">RSI:</span>
                    <span className={`value ${crypto.rsi < 30 ? 'oversold' : crypto.rsi > 70 ? 'overbought' : 'neutral'}`}>
                      {crypto.rsi.toFixed(1)}
                    </span>
                  </div>
                  <div className="indicator">
                    <span className="label">MACD:</span>
                    <span className={`value ${crypto.macd > 0 ? 'positive' : 'negative'}`}>
                      {crypto.macd.toFixed(3)}
                    </span>
                  </div>
                  <div className="signal" style={{ color: technical.color }}>
                    {technical.signal}
                  </div>
                </div>

                <div className="crypto-stats">
                  <div className={`change ${crypto.change24h >= 0 ? 'positive' : 'negative'}`}>
                    24h: {formatPercent(crypto.change24h)}
                  </div>
                  <div className="volume">
                    Vol: {formatCurrency(crypto.volume24h)}
                  </div>
                  {holding && (
                    <div className="holdings">
                      Holdings: {holding.amount.toFixed(8)} {crypto.symbol}
                    </div>
                  )}
                  {crypto.canStake && (
                    <div className="staking-reward">
                      Staking: {(crypto.stakingReward * 100).toFixed(1)}% APY
                    </div>
                  )}
                </div>

                {/* Enhanced price chart */}
                <div className="price-chart">
                  {crypto.history.length > 1 && (
                    <svg width="100%" height="60" viewBox="0 0 100 60">
                      <defs>
                        <linearGradient id={`gradient-${crypto.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" style={{ stopColor: crypto.color, stopOpacity: 0.3 }} />
                          <stop offset="100%" style={{ stopColor: crypto.color, stopOpacity: 0 }} />
                        </linearGradient>
                      </defs>
                      <polyline
                        fill={`url(#gradient-${crypto.id})`}
                        stroke={crypto.color}
                        strokeWidth="2"
                        points={crypto.history.slice(-30).map((point, index) => {
                          const x = (index / 29) * 100;
                          const minPrice = Math.min(...crypto.history.slice(-30).map(p => p.price));
                          const maxPrice = Math.max(...crypto.history.slice(-30).map(p => p.price));
                          const y = 50 - ((point.price - minPrice) / (maxPrice - minPrice)) * 40;
                          return `${x},${y}`;
                        }).join(' ') + ' 100,50 0,50'}
                      />
                      <polyline
                        fill="none"
                        stroke={crypto.color}
                        strokeWidth="2"
                        points={crypto.history.slice(-30).map((point, index) => {
                          const x = (index / 29) * 100;
                          const minPrice = Math.min(...crypto.history.slice(-30).map(p => p.price));
                          const maxPrice = Math.max(...crypto.history.slice(-30).map(p => p.price));
                          const y = 50 - ((point.price - minPrice) / (maxPrice - minPrice)) * 40;
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

        {/* Advanced Trading Panel */}
        {selectedCrypto && (
          <div className="advanced-trading-panel">
            <h2>🎯 Trade {cryptos[selectedCrypto].name}</h2>
            
            <div className="trading-controls">
              {/* Order Type Selection */}
              <div className="order-type-selector">
                <label>Order Type</label>
                <div className="order-type-buttons">
                  <button
                    className={`order-type-btn ${orderType === 'market' ? 'active' : ''}`}
                    onClick={() => setOrderType('market')}
                  >
                    Market
                  </button>
                  <button
                    className={`order-type-btn ${orderType === 'limit' ? 'active' : ''}`}
                    onClick={() => setOrderType('limit')}
                  >
                    Limit
                  </button>
                  <button
                    className={`order-type-btn ${orderType === 'stop-loss' ? 'active' : ''}`}
                    onClick={() => setOrderType('stop-loss')}
                  >
                    Stop Loss
                  </button>
                </div>
              </div>

              {/* Trade Type Selection */}
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

              {/* Leverage Selector */}
              <div className="leverage-selector">
                <label>Leverage: {leverage}x</label>
                <input
                  type="range"
                  min="1"
                  max={player.maxLeverage}
                  step="0.1"
                  value={leverage}
                  onChange={(e) => setLeverage(parseFloat(e.target.value))}
                  className="leverage-slider"
                />
                <div className="leverage-info">
                  <span className="risk-level" style={{ color: getLeverageRisk().color }}>
                    Risk: {getLeverageRisk().level}
                  </span>
                  <span className="max-leverage">Max: {player.maxLeverage}x</span>
                </div>
              </div>

              {/* Amount Input */}
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
                    onClick={() => setTradeAmount(((tradeType === 'buy' ? getMaxBuyAmount() : getMaxSellAmount()) * 0.75).toString())}
                  >
                    75%
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

              {/* Advanced Order Inputs */}
              {orderType === 'limit' && (
                <div className="limit-price-input">
                  <label>Limit Price</label>
                  <input
                    type="number"
                    value={limitPrice}
                    onChange={(e) => setLimitPrice(e.target.value)}
                    placeholder={`Current: ${formatCurrency(cryptos[selectedCrypto].price)}`}
                    step="0.01"
                  />
                </div>
              )}

              {/* Stop Loss and Take Profit */}
              <div className="risk-management">
                <div className="stop-loss-input">
                  <label>Stop Loss (Optional)</label>
                  <input
                    type="number"
                    value={stopLossPrice}
                    onChange={(e) => setStopLossPrice(e.target.value)}
                    placeholder="Stop loss price"
                    step="0.01"
                  />
                </div>
                <div className="take-profit-input">
                  <label>Take Profit (Optional)</label>
                  <input
                    type="number"
                    value={takeProfitPrice}
                    onChange={(e) => setTakeProfitPrice(e.target.value)}
                    placeholder="Take profit price"
                    step="0.01"
                  />
                </div>
              </div>

              {/* Trade Summary */}
              <div className="trade-summary">
                <div className="summary-row">
                  <span>Price per {cryptos[selectedCrypto].symbol}:</span>
                  <span>{formatCurrency(cryptos[selectedCrypto].price)}</span>
                </div>
                <div className="summary-row">
                  <span>Leverage:</span>
                  <span>{leverage}x</span>
                </div>
                <div className="summary-row">
                  <span>Total Value:</span>
                  <span>{formatCurrency(calculateTradeValue())}</span>
                </div>
                <div className="summary-row">
                  <span>Fee (0.1%):</span>
                  <span>{formatCurrency(calculateTradeValue() * 0.001)}</span>
                </div>
                {leverage > 1 && (
                  <div className="summary-row warning">
                    <span>⚠️ Liquidation Risk:</span>
                    <span>High leverage increases risk</span>
                  </div>
                )}
              </div>

              <button
                className={`advanced-trade-btn ${tradeType}`}
                onClick={handleAdvancedTrade}
                disabled={!tradeAmount || parseFloat(tradeAmount) <= 0}
              >
                {orderType === 'market' ? 'Execute' : 'Place'} {tradeType.toUpperCase()} Order
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdvancedTrading;