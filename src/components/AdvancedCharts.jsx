import React, { useState, useEffect } from 'react';
import { useGame } from '../context/UltraGameContext';
import './AdvancedCharts.css';

function AdvancedCharts() {
  const { state } = useGame();
  const { cryptos } = state;
  const [selectedCrypto, setSelectedCrypto] = useState('BTC');
  const [timeframe, setTimeframe] = useState('1h');
  const [chartType, setChartType] = useState('candlestick');
  const [indicators, setIndicators] = useState({
    rsi: true,
    macd: true,
    bb: true,
    ema: true,
    volume: true
  });

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

  const crypto = cryptos[selectedCrypto];
  const candleData = crypto.candleData || [];
  const priceHistory = crypto.history || [];

  // Generate sample candlestick data if not available
  const generateCandleData = () => {
    if (candleData.length > 0) return candleData;
    
    const data = [];
    let price = crypto.price;
    
    for (let i = 0; i < 100; i++) {
      const change = (Math.random() - 0.5) * 0.02;
      const open = price;
      const close = price * (1 + change);
      const high = Math.max(open, close) * (1 + Math.random() * 0.01);
      const low = Math.min(open, close) * (1 - Math.random() * 0.01);
      
      data.push({
        timestamp: Date.now() - (100 - i) * 60000,
        open,
        high,
        low,
        close,
        volume: Math.random() * 1000000
      });
      
      price = close;
    }
    
    return data;
  };

  const chartData = generateCandleData();
  const latestCandle = chartData[chartData.length - 1];

  // Calculate technical indicators
  const calculateRSI = (data, period = 14) => {
    if (data.length < period) return 50;
    
    let gains = 0;
    let losses = 0;
    
    for (let i = 1; i < period + 1; i++) {
      const change = data[data.length - i].close - data[data.length - i - 1].close;
      if (change > 0) gains += change;
      else losses -= change;
    }
    
    const avgGain = gains / period;
    const avgLoss = losses / period;
    const rs = avgGain / avgLoss;
    return 100 - (100 / (1 + rs));
  };

  const calculateMACD = (data) => {
    if (data.length < 26) return { macd: 0, signal: 0, histogram: 0 };
    
    const prices = data.map(d => d.close);
    const ema12 = prices.slice(-12).reduce((a, b) => a + b) / 12;
    const ema26 = prices.slice(-26).reduce((a, b) => a + b) / 26;
    const macd = ema12 - ema26;
    const signal = macd * 0.9; // Simplified signal line
    const histogram = macd - signal;
    
    return { macd, signal, histogram };
  };

  const calculateBollingerBands = (data, period = 20) => {
    if (data.length < period) return { upper: 0, middle: 0, lower: 0 };
    
    const prices = data.slice(-period).map(d => d.close);
    const sma = prices.reduce((a, b) => a + b) / period;
    const variance = prices.reduce((sum, price) => sum + Math.pow(price - sma, 2), 0) / period;
    const stdDev = Math.sqrt(variance);
    
    return {
      upper: sma + (stdDev * 2),
      middle: sma,
      lower: sma - (stdDev * 2)
    };
  };

  const rsi = calculateRSI(chartData);
  const macd = calculateMACD(chartData);
  const bb = calculateBollingerBands(chartData);

  const getRSIColor = (rsi) => {
    if (rsi > 70) return '#ff4757';
    if (rsi < 30) return '#00ff88';
    return '#ffa502';
  };

  const getMAcdColor = (macd) => {
    return macd.histogram > 0 ? '#00ff88' : '#ff4757';
  };

  return (
    <div className="advanced-charts">
      <div className="charts-header">
        <h1>📈 Advanced Charts</h1>
        <div className="chart-controls">
          <div className="crypto-selector">
            <select
              value={selectedCrypto}
              onChange={(e) => setSelectedCrypto(e.target.value)}
              className="crypto-select"
            >
              {Object.values(cryptos).map(crypto => (
                <option key={crypto.id} value={crypto.id}>
                  {crypto.symbol} - {crypto.name}
                </option>
              ))}
            </select>
          </div>

          <div className="timeframe-selector">
            {['1m', '5m', '15m', '1h', '4h', '1d'].map(tf => (
              <button
                key={tf}
                className={`timeframe-btn ${timeframe === tf ? 'active' : ''}`}
                onClick={() => setTimeframe(tf)}
              >
                {tf}
              </button>
            ))}
          </div>

          <div className="chart-type-selector">
            <button
              className={`chart-type-btn ${chartType === 'candlestick' ? 'active' : ''}`}
              onClick={() => setChartType('candlestick')}
            >
              🕯️ Candlestick
            </button>
            <button
              className={`chart-type-btn ${chartType === 'line' ? 'active' : ''}`}
              onClick={() => setChartType('line')}
            >
              📈 Line
            </button>
            <button
              className={`chart-type-btn ${chartType === 'area' ? 'active' : ''}`}
              onClick={() => setChartType('area')}
            >
              📊 Area
            </button>
          </div>
        </div>
      </div>

      <div className="chart-info">
        <div className="crypto-info">
          <span className="crypto-symbol" style={{ color: crypto.color }}>
            {crypto.symbol}
          </span>
          <span className="crypto-name">{crypto.name}</span>
        </div>
        <div className="price-info">
          <span className="current-price">{formatCurrency(crypto.price)}</span>
          <span className={`price-change ${crypto.change24h >= 0 ? 'positive' : 'negative'}`}>
            {formatPercent(crypto.change24h)}
          </span>
        </div>
        <div className="market-info">
          <span className="volume">Vol: {formatCurrency(crypto.volume24h)}</span>
          <span className="market-cap">MCap: {formatCurrency(crypto.marketCap)}</span>
        </div>
      </div>

      <div className="chart-container">
        {/* Main Price Chart */}
        <div className="main-chart">
          <div className="chart-header">
            <h3>Price Chart</h3>
            <div className="indicator-toggles">
              <label className="indicator-toggle">
                <input
                  type="checkbox"
                  checked={indicators.bb}
                  onChange={(e) => setIndicators({...indicators, bb: e.target.checked})}
                />
                Bollinger Bands
              </label>
              <label className="indicator-toggle">
                <input
                  type="checkbox"
                  checked={indicators.ema}
                  onChange={(e) => setIndicators({...indicators, ema: e.target.checked})}
                />
                EMA
              </label>
            </div>
          </div>

          <div className="chart-area">
            <svg width="100%" height="400" viewBox="0 0 800 400" className="price-chart-svg">
              <defs>
                <linearGradient id="priceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style={{ stopColor: crypto.color, stopOpacity: 0.3 }} />
                  <stop offset="100%" style={{ stopColor: crypto.color, stopOpacity: 0 }} />
                </linearGradient>
              </defs>

              {/* Chart Background */}
              <rect width="800" height="400" fill="rgba(255,255,255,0.02)" />

              {/* Grid Lines */}
              {[0, 1, 2, 3, 4].map(i => (
                <g key={i}>
                  <line
                    x1="0"
                    y1={i * 80}
                    x2="800"
                    y2={i * 80}
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="1"
                  />
                  <line
                    x1={i * 160}
                    y1="0"
                    x2={i * 160}
                    y2="400"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="1"
                  />
                </g>
              ))}

              {/* Bollinger Bands */}
              {indicators.bb && (
                <g>
                  <line
                    x1="0"
                    y1={200 - ((bb.upper - crypto.price) / crypto.price) * 2000}
                    x2="800"
                    y2={200 - ((bb.upper - crypto.price) / crypto.price) * 2000}
                    stroke="#667eea"
                    strokeWidth="1"
                    strokeDasharray="5,5"
                    opacity="0.7"
                  />
                  <line
                    x1="0"
                    y1={200 - ((bb.middle - crypto.price) / crypto.price) * 2000}
                    x2="800"
                    y2={200 - ((bb.middle - crypto.price) / crypto.price) * 2000}
                    stroke="#667eea"
                    strokeWidth="2"
                    opacity="0.7"
                  />
                  <line
                    x1="0"
                    y1={200 - ((bb.lower - crypto.price) / crypto.price) * 2000}
                    x2="800"
                    y2={200 - ((bb.lower - crypto.price) / crypto.price) * 2000}
                    stroke="#667eea"
                    strokeWidth="1"
                    strokeDasharray="5,5"
                    opacity="0.7"
                  />
                </g>
              )}

              {/* Candlestick Chart */}
              {chartType === 'candlestick' && chartData.slice(-50).map((candle, index) => {
                const x = (index / 49) * 800;
                const bodyHeight = Math.abs(candle.close - candle.open) / candle.open * 2000;
                const bodyY = 200 - Math.max(candle.close, candle.open) / candle.open * 2000;
                const wickTop = 200 - candle.high / candle.open * 2000;
                const wickBottom = 200 - candle.low / candle.open * 2000;
                const isGreen = candle.close > candle.open;

                return (
                  <g key={index}>
                    {/* Wick */}
                    <line
                      x1={x}
                      y1={wickTop}
                      x2={x}
                      y2={wickBottom}
                      stroke={isGreen ? '#00ff88' : '#ff4757'}
                      strokeWidth="1"
                    />
                    {/* Body */}
                    <rect
                      x={x - 4}
                      y={bodyY}
                      width="8"
                      height={Math.max(bodyHeight, 1)}
                      fill={isGreen ? '#00ff88' : '#ff4757'}
                      opacity="0.8"
                    />
                  </g>
                );
              })}

              {/* Line Chart */}
              {chartType === 'line' && (
                <polyline
                  fill="none"
                  stroke={crypto.color}
                  strokeWidth="3"
                  points={chartData.slice(-50).map((candle, index) => {
                    const x = (index / 49) * 800;
                    const y = 200 - ((candle.close - crypto.price) / crypto.price) * 2000;
                    return `${x},${y}`;
                  }).join(' ')}
                />
              )}

              {/* Area Chart */}
              {chartType === 'area' && (
                <polygon
                  fill="url(#priceGradient)"
                  stroke={crypto.color}
                  strokeWidth="2"
                  points={chartData.slice(-50).map((candle, index) => {
                    const x = (index / 49) * 800;
                    const y = 200 - ((candle.close - crypto.price) / crypto.price) * 2000;
                    return `${x},${y}`;
                  }).join(' ') + ' 800,400 0,400'}
                />
              )}

              {/* Current Price Line */}
              <line
                x1="0"
                y1="200"
                x2="800"
                y2="200"
                stroke={crypto.color}
                strokeWidth="2"
                strokeDasharray="10,5"
                opacity="0.8"
              />

              {/* Price Label */}
              <text
                x="810"
                y="205"
                fill={crypto.color}
                fontSize="14"
                fontWeight="bold"
              >
                {formatCurrency(crypto.price)}
              </text>
            </svg>
          </div>
        </div>

        {/* Volume Chart */}
        {indicators.volume && (
          <div className="volume-chart">
            <div className="chart-header">
              <h3>Volume</h3>
            </div>
            <div className="chart-area">
              <svg width="100%" height="100" viewBox="0 0 800 100" className="volume-chart-svg">
                {chartData.slice(-50).map((candle, index) => {
                  const x = (index / 49) * 800;
                  const height = (candle.volume / Math.max(...chartData.map(c => c.volume))) * 80;
                  const isGreen = candle.close > candle.open;

                  return (
                    <rect
                      key={index}
                      x={x - 6}
                      y={100 - height}
                      width="12"
                      height={height}
                      fill={isGreen ? '#00ff88' : '#ff4757'}
                      opacity="0.6"
                    />
                  );
                })}
              </svg>
            </div>
          </div>
        )}

        {/* Technical Indicators */}
        <div className="indicators-panel">
          {indicators.rsi && (
            <div className="indicator-chart">
              <div className="chart-header">
                <h3>RSI (14)</h3>
                <span className="indicator-value" style={{ color: getRSIColor(rsi) }}>
                  {rsi.toFixed(2)}
                </span>
              </div>
              <div className="rsi-chart">
                <svg width="100%" height="80" viewBox="0 0 800 80">
                  {/* RSI Levels */}
                  <line x1="0" y1="16" x2="800" y2="16" stroke="#ff4757" strokeWidth="1" strokeDasharray="3,3" opacity="0.5" />
                  <line x1="0" y1="40" x2="800" y2="40" stroke="#ffa502" strokeWidth="1" strokeDasharray="3,3" opacity="0.5" />
                  <line x1="0" y1="64" x2="800" y2="64" stroke="#00ff88" strokeWidth="1" strokeDasharray="3,3" opacity="0.5" />
                  
                  {/* RSI Line */}
                  <circle
                    cx="750"
                    cy={80 - (rsi / 100) * 80}
                    r="3"
                    fill={getRSIColor(rsi)}
                  />
                  
                  {/* RSI Labels */}
                  <text x="5" y="20" fill="#ff4757" fontSize="10">70</text>
                  <text x="5" y="44" fill="#ffa502" fontSize="10">50</text>
                  <text x="5" y="68" fill="#00ff88" fontSize="10">30</text>
                </svg>
              </div>
            </div>
          )}

          {indicators.macd && (
            <div className="indicator-chart">
              <div className="chart-header">
                <h3>MACD</h3>
                <span className="indicator-value" style={{ color: getMAcdColor(macd) }}>
                  {macd.macd.toFixed(4)}
                </span>
              </div>
              <div className="macd-chart">
                <svg width="100%" height="80" viewBox="0 0 800 80">
                  {/* Zero Line */}
                  <line x1="0" y1="40" x2="800" y2="40" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                  
                  {/* MACD Histogram */}
                  <rect
                    x="750"
                    y={macd.histogram > 0 ? 40 - Math.abs(macd.histogram) * 1000 : 40}
                    width="20"
                    height={Math.abs(macd.histogram) * 1000}
                    fill={getMAcdColor(macd)}
                    opacity="0.7"
                  />
                  
                  {/* MACD Line */}
                  <circle
                    cx="750"
                    cy={40 - macd.macd * 1000}
                    r="2"
                    fill="#667eea"
                  />
                  
                  {/* Signal Line */}
                  <circle
                    cx="750"
                    cy={40 - macd.signal * 1000}
                    r="2"
                    fill="#ffa502"
                  />
                </svg>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chart Analysis */}
      <div className="chart-analysis">
        <h2>📊 Technical Analysis</h2>
        <div className="analysis-grid">
          <div className="analysis-card">
            <h3>📈 Price Action</h3>
            <div className="analysis-content">
              <div className="metric">
                <span className="label">Current Trend:</span>
                <span className={`value ${crypto.change24h >= 0 ? 'positive' : 'negative'}`}>
                  {crypto.change24h >= 0 ? 'Bullish' : 'Bearish'}
                </span>
              </div>
              <div className="metric">
                <span className="label">Support Level:</span>
                <span className="value">{formatCurrency(bb.lower)}</span>
              </div>
              <div className="metric">
                <span className="label">Resistance Level:</span>
                <span className="value">{formatCurrency(bb.upper)}</span>
              </div>
            </div>
          </div>

          <div className="analysis-card">
            <h3>🎯 Technical Signals</h3>
            <div className="analysis-content">
              <div className="signal">
                <span className="signal-name">RSI Signal:</span>
                <span className={`signal-value ${rsi > 70 ? 'negative' : rsi < 30 ? 'positive' : 'neutral'}`}>
                  {rsi > 70 ? 'Overbought' : rsi < 30 ? 'Oversold' : 'Neutral'}
                </span>
              </div>
              <div className="signal">
                <span className="signal-name">MACD Signal:</span>
                <span className={`signal-value ${macd.histogram > 0 ? 'positive' : 'negative'}`}>
                  {macd.histogram > 0 ? 'Bullish' : 'Bearish'}
                </span>
              </div>
              <div className="signal">
                <span className="signal-name">BB Position:</span>
                <span className="signal-value neutral">
                  {crypto.price > bb.upper ? 'Above Upper' : crypto.price < bb.lower ? 'Below Lower' : 'Within Bands'}
                </span>
              </div>
            </div>
          </div>

          <div className="analysis-card">
            <h3>💡 Trading Suggestions</h3>
            <div className="analysis-content">
              <div className="suggestions">
                {rsi < 30 && (
                  <div className="suggestion positive">
                    💡 RSI indicates oversold conditions - potential buying opportunity
                  </div>
                )}
                {rsi > 70 && (
                  <div className="suggestion negative">
                    ⚠️ RSI indicates overbought conditions - consider taking profits
                  </div>
                )}
                {macd.histogram > 0 && macd.macd > macd.signal && (
                  <div className="suggestion positive">
                    📈 MACD showing bullish momentum - trend may continue
                  </div>
                )}
                {crypto.price < bb.lower && (
                  <div className="suggestion positive">
                    🎯 Price below Bollinger Band lower - potential bounce expected
                  </div>
                )}
                {crypto.price > bb.upper && (
                  <div className="suggestion negative">
                    📉 Price above Bollinger Band upper - potential pullback expected
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdvancedCharts;