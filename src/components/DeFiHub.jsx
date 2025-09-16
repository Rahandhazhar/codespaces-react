import React, { useState } from 'react';
import { useGame } from '../context/UltraGameContext';
import './DeFiHub.css';

function DeFiHub() {
  const { state, provideLiquidity, removeLiquidity } = useGame();
  const { cryptos, liquidityPools, player } = state;
  const [activeTab, setActiveTab] = useState('pools');
  const [selectedCrypto, setSelectedCrypto] = useState('');
  const [liquidityAmount, setLiquidityAmount] = useState('');
  const [removePoolId, setRemovePoolId] = useState('');
  const [removePercentage, setRemovePercentage] = useState(100);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
    }).format(amount);
  };

  const formatPercent = (percent) => {
    return `${percent.toFixed(2)}%`;
  };

  const getPoolAPY = (cryptoId) => {
    const crypto = cryptos[cryptoId];
    const baseAPY = 5; // Base 5% APY
    const volatilityBonus = crypto.volatility * 100; // Higher volatility = higher rewards
    const liquidityBonus = crypto.liquidityPool > 500000 ? 2 : 0; // Bonus for high liquidity
    return baseAPY + volatilityBonus + liquidityBonus;
  };

  const getTotalLiquidityValue = () => {
    return Object.values(liquidityPools).reduce((total, pool) => total + pool.value, 0);
  };

  const getTotalRewards = () => {
    return Object.values(liquidityPools).reduce((total, pool) => total + (pool.rewards || 0), 0);
  };

  const handleProvideLiquidity = () => {
    if (!selectedCrypto || !liquidityAmount) {
      alert('Please select a crypto and enter amount');
      return;
    }

    const amount = parseFloat(liquidityAmount);
    const crypto = cryptos[selectedCrypto];
    const value = amount * crypto.price;

    if (value > player.cash) {
      alert('Insufficient funds');
      return;
    }

    provideLiquidity(selectedCrypto, amount);
    setLiquidityAmount('');
    setSelectedCrypto('');
  };

  const handleRemoveLiquidity = () => {
    if (!removePoolId) {
      alert('Please select a pool');
      return;
    }

    removeLiquidity(removePoolId, removePercentage);
    setRemovePoolId('');
    setRemovePercentage(100);
  };

  const availableCryptos = Object.values(cryptos).filter(crypto => crypto.liquidityPool > 0);
  const userPools = Object.entries(liquidityPools);

  return (
    <div className="defi-hub">
      <div className="defi-header">
        <h1>🏦 DeFi Hub</h1>
        <div className="defi-stats">
          <div className="stat">
            <span className="label">Total Liquidity:</span>
            <span className="value">{formatCurrency(getTotalLiquidityValue())}</span>
          </div>
          <div className="stat">
            <span className="label">Total Rewards:</span>
            <span className="value positive">{formatCurrency(getTotalRewards())}</span>
          </div>
          <div className="stat">
            <span className="label">Active Pools:</span>
            <span className="value">{userPools.length}</span>
          </div>
        </div>
      </div>

      <div className="defi-tabs">
        <button
          className={`tab-btn ${activeTab === 'pools' ? 'active' : ''}`}
          onClick={() => setActiveTab('pools')}
        >
          💧 Liquidity Pools
        </button>
        <button
          className={`tab-btn ${activeTab === 'lending' ? 'active' : ''}`}
          onClick={() => setActiveTab('lending')}
        >
          🏦 Lending & Borrowing
        </button>
        <button
          className={`tab-btn ${activeTab === 'yield' ? 'active' : ''}`}
          onClick={() => setActiveTab('yield')}
        >
          🌾 Yield Farming
        </button>
        <button
          className={`tab-btn ${activeTab === 'governance' ? 'active' : ''}`}
          onClick={() => setActiveTab('governance')}
        >
          🗳️ Governance
        </button>
      </div>

      <div className="defi-content">
        {activeTab === 'pools' && (
          <>
            {/* User's Liquidity Positions */}
            {userPools.length > 0 && (
              <div className="user-pools-section">
                <h2>💧 Your Liquidity Positions</h2>
                <div className="pools-grid">
                  {userPools.map(([poolId, pool]) => {
                    const crypto = cryptos[pool.cryptoId];
                    const currentValue = pool.amount * crypto.price;
                    const profit = currentValue - pool.value + (pool.rewards || 0);
                    const profitPercent = (profit / pool.value) * 100;
                    const apy = getPoolAPY(pool.cryptoId);

                    return (
                      <div key={poolId} className="pool-card user-pool">
                        <div className="pool-header">
                          <div className="pool-info">
                            <span className="pool-name" style={{ color: crypto.color }}>
                              {crypto.symbol} Pool
                            </span>
                            <span className="pool-apy">{formatPercent(apy)} APY</span>
                          </div>
                          <div className="pool-status">
                            <span className="status-active">ACTIVE</span>
                          </div>
                        </div>

                        <div className="pool-stats">
                          <div className="stat-row">
                            <span className="label">Your Liquidity:</span>
                            <span className="value">{pool.amount.toFixed(8)} {crypto.symbol}</span>
                          </div>
                          <div className="stat-row">
                            <span className="label">Current Value:</span>
                            <span className="value">{formatCurrency(currentValue)}</span>
                          </div>
                          <div className="stat-row">
                            <span className="label">Rewards Earned:</span>
                            <span className="value positive">{formatCurrency(pool.rewards || 0)}</span>
                          </div>
                          <div className="stat-row">
                            <span className="label">Total P&L:</span>
                            <span className={`value ${profit >= 0 ? 'positive' : 'negative'}`}>
                              {formatCurrency(profit)} ({formatPercent(profitPercent)})
                            </span>
                          </div>
                        </div>

                        <div className="pool-actions">
                          <button
                            className="remove-liquidity-btn"
                            onClick={() => setRemovePoolId(poolId)}
                          >
                            💧 Remove Liquidity
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Available Pools */}
            <div className="available-pools-section">
              <h2>🌊 Available Liquidity Pools</h2>
              <div className="pools-grid">
                {availableCryptos.map(crypto => {
                  const apy = getPoolAPY(crypto.id);
                  const tvl = crypto.liquidityPool;

                  return (
                    <div key={crypto.id} className="pool-card available-pool">
                      <div className="pool-header">
                        <div className="pool-info">
                          <span className="pool-name" style={{ color: crypto.color }}>
                            {crypto.symbol} Pool
                          </span>
                          <span className="pool-apy">{formatPercent(apy)} APY</span>
                        </div>
                        <div className="pool-icon" style={{ color: crypto.color }}>
                          💧
                        </div>
                      </div>

                      <div className="pool-details">
                        <div className="detail-row">
                          <span className="label">Total Value Locked:</span>
                          <span className="value">{formatCurrency(tvl)}</span>
                        </div>
                        <div className="detail-row">
                          <span className="label">24h Volume:</span>
                          <span className="value">{formatCurrency(crypto.volume24h)}</span>
                        </div>
                        <div className="detail-row">
                          <span className="label">Pool Share:</span>
                          <span className="value">
                            {liquidityPools[`${crypto.id}_POOL`] 
                              ? ((liquidityPools[`${crypto.id}_POOL`].value / tvl) * 100).toFixed(4)
                              : '0.0000'
                            }%
                          </span>
                        </div>
                      </div>

                      <div className="pool-features">
                        <div className="feature">
                          <span className="feature-icon">💰</span>
                          <span>Earn Trading Fees</span>
                        </div>
                        <div className="feature">
                          <span className="feature-icon">🎁</span>
                          <span>Liquidity Rewards</span>
                        </div>
                        <div className="feature">
                          <span className="feature-icon">🔄</span>
                          <span>Auto-Compound</span>
                        </div>
                      </div>

                      <button
                        className="add-liquidity-btn"
                        onClick={() => setSelectedCrypto(crypto.id)}
                      >
                        💧 Add Liquidity
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Add Liquidity Panel */}
            {selectedCrypto && (
              <div className="liquidity-panel">
                <h2>💧 Add Liquidity to {cryptos[selectedCrypto].name}</h2>
                <div className="panel-content">
                  <div className="crypto-info">
                    <div className="crypto-details">
                      <span className="crypto-symbol" style={{ color: cryptos[selectedCrypto].color }}>
                        {cryptos[selectedCrypto].symbol}
                      </span>
                      <span className="crypto-price">
                        {formatCurrency(cryptos[selectedCrypto].price)}
                      </span>
                    </div>
                    <div className="apy-display">
                      <span className="apy-label">Current APY:</span>
                      <span className="apy-value">{formatPercent(getPoolAPY(selectedCrypto))}</span>
                    </div>
                  </div>

                  <div className="amount-input">
                    <label>Amount ({cryptos[selectedCrypto].symbol})</label>
                    <input
                      type="number"
                      value={liquidityAmount}
                      onChange={(e) => setLiquidityAmount(e.target.value)}
                      placeholder="Enter amount"
                      step="0.00000001"
                      min="0"
                    />
                    <div className="amount-helpers">
                      <button
                        onClick={() => {
                          const maxAmount = player.cash / cryptos[selectedCrypto].price;
                          setLiquidityAmount(maxAmount.toString());
                        }}
                      >
                        Max
                      </button>
                      <button
                        onClick={() => {
                          const amount = (player.cash * 0.5) / cryptos[selectedCrypto].price;
                          setLiquidityAmount(amount.toString());
                        }}
                      >
                        50%
                      </button>
                      <button
                        onClick={() => {
                          const amount = (player.cash * 0.25) / cryptos[selectedCrypto].price;
                          setLiquidityAmount(amount.toString());
                        }}
                      >
                        25%
                      </button>
                    </div>
                  </div>

                  <div className="liquidity-summary">
                    <div className="summary-row">
                      <span>Amount:</span>
                      <span>{liquidityAmount || '0'} {cryptos[selectedCrypto].symbol}</span>
                    </div>
                    <div className="summary-row">
                      <span>Value:</span>
                      <span>{formatCurrency((parseFloat(liquidityAmount) || 0) * cryptos[selectedCrypto].price)}</span>
                    </div>
                    <div className="summary-row">
                      <span>Expected Daily Rewards:</span>
                      <span className="positive">
                        {formatCurrency(((parseFloat(liquidityAmount) || 0) * cryptos[selectedCrypto].price * getPoolAPY(selectedCrypto)) / 36500)}
                      </span>
                    </div>
                  </div>

                  <div className="panel-actions">
                    <button
                      className="provide-liquidity-btn"
                      onClick={handleProvideLiquidity}
                      disabled={!liquidityAmount || parseFloat(liquidityAmount) <= 0}
                    >
                      💧 Provide Liquidity
                    </button>
                    <button
                      className="cancel-btn"
                      onClick={() => {
                        setSelectedCrypto('');
                        setLiquidityAmount('');
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Remove Liquidity Panel */}
            {removePoolId && (
              <div className="liquidity-panel">
                <h2>💧 Remove Liquidity</h2>
                <div className="panel-content">
                  <div className="pool-summary">
                    <div className="pool-details">
                      <span className="pool-name">
                        {cryptos[liquidityPools[removePoolId].cryptoId].symbol} Pool
                      </span>
                      <span className="pool-value">
                        {formatCurrency(liquidityPools[removePoolId].value)}
                      </span>
                    </div>
                  </div>

                  <div className="percentage-selector">
                    <label>Percentage to Remove: {removePercentage}%</label>
                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={removePercentage}
                      onChange={(e) => setRemovePercentage(parseInt(e.target.value))}
                      className="percentage-slider"
                    />
                    <div className="percentage-buttons">
                      <button onClick={() => setRemovePercentage(25)}>25%</button>
                      <button onClick={() => setRemovePercentage(50)}>50%</button>
                      <button onClick={() => setRemovePercentage(75)}>75%</button>
                      <button onClick={() => setRemovePercentage(100)}>100%</button>
                    </div>
                  </div>

                  <div className="removal-summary">
                    <div className="summary-row">
                      <span>Amount to Remove:</span>
                      <span>
                        {((liquidityPools[removePoolId].amount * removePercentage) / 100).toFixed(8)} {cryptos[liquidityPools[removePoolId].cryptoId].symbol}
                      </span>
                    </div>
                    <div className="summary-row">
                      <span>Value to Receive:</span>
                      <span>
                        {formatCurrency((liquidityPools[removePoolId].value * removePercentage) / 100)}
                      </span>
                    </div>
                    <div className="summary-row">
                      <span>Rewards to Claim:</span>
                      <span className="positive">
                        {formatCurrency(((liquidityPools[removePoolId].rewards || 0) * removePercentage) / 100)}
                      </span>
                    </div>
                  </div>

                  <div className="panel-actions">
                    <button
                      className="remove-liquidity-btn"
                      onClick={handleRemoveLiquidity}
                    >
                      💧 Remove Liquidity
                    </button>
                    <button
                      className="cancel-btn"
                      onClick={() => {
                        setRemovePoolId('');
                        setRemovePercentage(100);
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'lending' && (
          <div className="lending-section">
            <h2>🏦 Lending & Borrowing (Coming Soon)</h2>
            <div className="coming-soon">
              <div className="feature-preview">
                <h3>🚀 Upcoming Features</h3>
                <ul>
                  <li>💰 Lend your crypto and earn interest</li>
                  <li>📈 Borrow against your collateral</li>
                  <li>🔄 Flash loans for arbitrage</li>
                  <li>📊 Dynamic interest rates</li>
                  <li>🛡️ Liquidation protection</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'yield' && (
          <div className="yield-section">
            <h2>🌾 Yield Farming (Coming Soon)</h2>
            <div className="coming-soon">
              <div className="feature-preview">
                <h3>🚀 Upcoming Features</h3>
                <ul>
                  <li>🌾 Farm governance tokens</li>
                  <li>🎁 Liquidity mining rewards</li>
                  <li>🔄 Auto-compounding strategies</li>
                  <li>📈 Yield optimization</li>
                  <li>🏆 Bonus multipliers</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'governance' && (
          <div className="governance-section">
            <h2>🗳️ Governance (Coming Soon)</h2>
            <div className="coming-soon">
              <div className="feature-preview">
                <h3>🚀 Upcoming Features</h3>
                <ul>
                  <li>🗳️ Vote on protocol changes</li>
                  <li>💎 Governance token rewards</li>
                  <li>📊 Proposal creation</li>
                  <li>🏛️ DAO participation</li>
                  <li>🎯 Voting power delegation</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DeFiHub;