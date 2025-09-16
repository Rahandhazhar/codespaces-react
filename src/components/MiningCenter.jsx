import React, { useState } from 'react';
import { useGame } from '../context/UltraGameContext';
import './MiningCenter.css';

function MiningCenter() {
  const { state, buyMiningHardware } = useGame();
  const { miningRigs, cryptos, player } = state;
  const [selectedHardware, setSelectedHardware] = useState(null);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getTotalHashRate = () => {
    return miningRigs.reduce((total, rig) => total + (rig.hashRate * rig.owned), 0);
  };

  const getTotalPowerConsumption = () => {
    return miningRigs.reduce((total, rig) => total + (rig.powerConsumption * rig.owned), 0);
  };

  const getDailyMiningRewards = () => {
    const totalHashRate = getTotalHashRate();
    let dailyRewards = 0;

    Object.values(cryptos).forEach(crypto => {
      if (crypto.canMine) {
        const reward = (totalHashRate * crypto.efficiency * crypto.price * 24) / crypto.miningDifficulty;
        dailyRewards += reward;
      }
    });

    const powerCost = getTotalPowerConsumption() * 24 * 0.1; // $0.1 per kWh
    return Math.max(0, dailyRewards - powerCost);
  };

  const getROI = (hardware) => {
    if (hardware.cost === 0) return Infinity;
    const dailyProfit = (hardware.hashRate * 0.1 * 24) - (hardware.powerConsumption * 24 * 0.1);
    return hardware.cost / Math.max(dailyProfit, 0.01);
  };

  const getEfficiencyRating = (hardware) => {
    const efficiency = hardware.hashRate / hardware.powerConsumption;
    if (efficiency > 0.1) return 'Excellent';
    if (efficiency > 0.05) return 'Good';
    if (efficiency > 0.02) return 'Average';
    return 'Poor';
  };

  const getEfficiencyColor = (rating) => {
    switch (rating) {
      case 'Excellent': return '#00ff88';
      case 'Good': return '#00d4aa';
      case 'Average': return '#ffa502';
      case 'Poor': return '#ff4757';
      default: return '#667eea';
    }
  };

  const handleBuyHardware = (hardwareId) => {
    const hardware = miningRigs.find(h => h.id === hardwareId);
    if (hardware.cost > player.cash) {
      alert('Insufficient funds');
      return;
    }
    buyMiningHardware(hardwareId);
  };

  const mineableCryptos = Object.values(cryptos).filter(crypto => crypto.canMine);

  return (
    <div className="mining-center">
      <div className="mining-header">
        <h1>⛏️ Mining Center</h1>
        <div className="mining-stats">
          <div className="stat">
            <span className="label">Total Hash Rate:</span>
            <span className="value">{getTotalHashRate().toFixed(1)} TH/s</span>
          </div>
          <div className="stat">
            <span className="label">Power Consumption:</span>
            <span className="value">{getTotalPowerConsumption().toFixed(0)} W</span>
          </div>
          <div className="stat">
            <span className="label">Daily Profit:</span>
            <span className="value positive">{formatCurrency(getDailyMiningRewards())}</span>
          </div>
          <div className="stat">
            <span className="label">Mining Rewards:</span>
            <span className="value positive">{formatCurrency(player.miningRewards)}</span>
          </div>
        </div>
      </div>

      <div className="mining-content">
        {/* Mining Overview */}
        <div className="mining-overview">
          <h2>📊 Mining Overview</h2>
          <div className="overview-grid">
            <div className="overview-card">
              <h3>⚡ Hash Rate Distribution</h3>
              <div className="hash-rate-chart">
                {miningRigs.filter(rig => rig.owned > 0).map(rig => {
                  const percentage = ((rig.hashRate * rig.owned) / getTotalHashRate()) * 100;
                  return (
                    <div key={rig.id} className="hash-rate-bar">
                      <div className="bar-info">
                        <span className="rig-name">{rig.name}</span>
                        <span className="rig-percentage">{percentage.toFixed(1)}%</span>
                      </div>
                      <div className="bar-container">
                        <div 
                          className="bar-fill"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="overview-card">
              <h3>💰 Mineable Cryptocurrencies</h3>
              <div className="mineable-cryptos">
                {mineableCryptos.map(crypto => {
                  const dailyReward = (getTotalHashRate() * crypto.efficiency * crypto.price * 24) / crypto.miningDifficulty;
                  return (
                    <div key={crypto.id} className="crypto-mining-info">
                      <div className="crypto-header">
                        <span className="crypto-symbol" style={{ color: crypto.color }}>
                          {crypto.symbol}
                        </span>
                        <span className="crypto-difficulty">
                          Difficulty: {(crypto.miningDifficulty * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="crypto-rewards">
                        <span className="daily-reward">
                          Daily: {formatCurrency(dailyReward)}
                        </span>
                        <span className="efficiency">
                          Efficiency: {(crypto.efficiency * 100).toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Current Mining Rigs */}
        <div className="current-rigs-section">
          <h2>🖥️ Your Mining Rigs</h2>
          <div className="rigs-grid">
            {miningRigs.filter(rig => rig.owned > 0).map(rig => (
              <div key={rig.id} className="rig-card owned">
                <div className="rig-header">
                  <div className="rig-icon">{rig.icon}</div>
                  <div className="rig-info">
                    <h3 className="rig-name">{rig.name}</h3>
                    <p className="rig-owned">Owned: {rig.owned}</p>
                  </div>
                  <div className="rig-status">
                    <span className="status-mining">MINING</span>
                  </div>
                </div>

                <div className="rig-performance">
                  <div className="performance-metric">
                    <span className="metric-label">Hash Rate:</span>
                    <span className="metric-value">{(rig.hashRate * rig.owned).toFixed(1)} TH/s</span>
                  </div>
                  <div className="performance-metric">
                    <span className="metric-label">Power Usage:</span>
                    <span className="metric-value">{(rig.powerConsumption * rig.owned).toFixed(0)} W</span>
                  </div>
                  <div className="performance-metric">
                    <span className="metric-label">Efficiency:</span>
                    <span 
                      className="metric-value"
                      style={{ color: getEfficiencyColor(getEfficiencyRating(rig)) }}
                    >
                      {getEfficiencyRating(rig)}
                    </span>
                  </div>
                  <div className="performance-metric">
                    <span className="metric-label">Daily Profit:</span>
                    <span className="metric-value positive">
                      {formatCurrency((rig.hashRate * rig.owned * 0.1 * 24) - (rig.powerConsumption * rig.owned * 24 * 0.1))}
                    </span>
                  </div>
                </div>

                <div className="rig-actions">
                  <button
                    className="buy-more-btn"
                    onClick={() => handleBuyHardware(rig.id)}
                    disabled={rig.cost > player.cash}
                  >
                    💰 Buy Another ({formatCurrency(rig.cost)})
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Available Hardware */}
        <div className="available-hardware-section">
          <h2>🛒 Available Mining Hardware</h2>
          <div className="hardware-grid">
            {miningRigs.map(hardware => (
              <div 
                key={hardware.id} 
                className={`hardware-card ${selectedHardware === hardware.id ? 'selected' : ''} ${hardware.cost > player.cash ? 'unaffordable' : ''}`}
                onClick={() => setSelectedHardware(hardware.id)}
              >
                <div className="hardware-header">
                  <div className="hardware-icon">{hardware.icon}</div>
                  <div className="hardware-info">
                    <h3 className="hardware-name">{hardware.name}</h3>
                    <p className="hardware-price">{formatCurrency(hardware.cost)}</p>
                  </div>
                  <div className="hardware-efficiency">
                    <span 
                      className="efficiency-badge"
                      style={{ backgroundColor: getEfficiencyColor(getEfficiencyRating(hardware)) }}
                    >
                      {getEfficiencyRating(hardware)}
                    </span>
                  </div>
                </div>

                <div className="hardware-specs">
                  <div className="spec-row">
                    <span className="spec-label">Hash Rate:</span>
                    <span className="spec-value">{hardware.hashRate} TH/s</span>
                  </div>
                  <div className="spec-row">
                    <span className="spec-label">Power:</span>
                    <span className="spec-value">{hardware.powerConsumption} W</span>
                  </div>
                  <div className="spec-row">
                    <span className="spec-label">Efficiency:</span>
                    <span className="spec-value">{(hardware.efficiency * 100).toFixed(2)}%</span>
                  </div>
                  <div className="spec-row">
                    <span className="spec-label">ROI:</span>
                    <span className="spec-value">
                      {getROI(hardware) === Infinity ? 'Free' : `${getROI(hardware).toFixed(0)} days`}
                    </span>
                  </div>
                </div>

                <div className="hardware-projections">
                  <div className="projection">
                    <span className="projection-label">Daily Profit:</span>
                    <span className="projection-value positive">
                      {formatCurrency((hardware.hashRate * 0.1 * 24) - (hardware.powerConsumption * 24 * 0.1))}
                    </span>
                  </div>
                  <div className="projection">
                    <span className="projection-label">Monthly Profit:</span>
                    <span className="projection-value positive">
                      {formatCurrency(((hardware.hashRate * 0.1 * 24) - (hardware.powerConsumption * 24 * 0.1)) * 30)}
                    </span>
                  </div>
                </div>

                <div className="hardware-features">
                  <div className="feature">
                    <span className="feature-icon">⚡</span>
                    <span>High Performance</span>
                  </div>
                  <div className="feature">
                    <span className="feature-icon">🔧</span>
                    <span>Easy Setup</span>
                  </div>
                  <div className="feature">
                    <span className="feature-icon">💰</span>
                    <span>Profitable</span>
                  </div>
                </div>

                <button
                  className="buy-hardware-btn"
                  onClick={() => handleBuyHardware(hardware.id)}
                  disabled={hardware.cost > player.cash}
                >
                  {hardware.cost === 0 ? '🎁 Free' : `💰 Buy (${formatCurrency(hardware.cost)})`}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Mining Education */}
        <div className="mining-education">
          <h2>📚 Mining Guide</h2>
          <div className="education-grid">
            <div className="education-card">
              <h3>⛏️ What is Crypto Mining?</h3>
              <p>
                Cryptocurrency mining is the process of validating transactions and adding them to the blockchain. 
                Miners use computational power to solve complex mathematical problems and are rewarded with cryptocurrency.
              </p>
            </div>

            <div className="education-card">
              <h3>🔧 Hardware Types</h3>
              <ul>
                <li><strong>CPU:</strong> Basic mining, low power, minimal rewards</li>
                <li><strong>GPU:</strong> Good for most cryptocurrencies, balanced performance</li>
                <li><strong>ASIC:</strong> Specialized hardware, high efficiency, expensive</li>
                <li><strong>Quantum:</strong> Future technology, extremely powerful</li>
              </ul>
            </div>

            <div className="education-card">
              <h3>💡 Mining Tips</h3>
              <ul>
                <li>Consider electricity costs in your calculations</li>
                <li>Higher hash rate = more mining rewards</li>
                <li>Efficiency matters for long-term profitability</li>
                <li>Diversify across multiple cryptocurrencies</li>
                <li>Upgrade hardware as you earn more</li>
              </ul>
            </div>

            <div className="education-card">
              <h3>📊 Profitability Factors</h3>
              <ul>
                <li><strong>Hash Rate:</strong> Your mining power</li>
                <li><strong>Difficulty:</strong> Network mining difficulty</li>
                <li><strong>Electricity:</strong> Power consumption costs</li>
                <li><strong>Crypto Price:</strong> Market value of mined coins</li>
                <li><strong>Hardware Cost:</strong> Initial investment</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MiningCenter;