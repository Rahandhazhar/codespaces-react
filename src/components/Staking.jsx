import React, { useState } from 'react';
import { useGame } from '../context/EnhancedGameContext';
import './Staking.css';

function Staking() {
  const { state, stakeCrypto, unstakeCrypto, dispatch } = useGame();
  const { cryptos, portfolio, stakedPortfolio, player } = state;
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [stakeAmount, setStakeAmount] = useState('');
  const [actionType, setActionType] = useState('stake');

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 8
    }).format(amount);
  };

  const formatPercent = (percent) => {
    return `${percent.toFixed(2)}%`;
  };

  const getStakableAmount = (cryptoId) => {
    const holding = portfolio[cryptoId];
    return holding ? holding.amount : 0;
  };

  const getStakedAmount = (cryptoId) => {
    const staked = stakedPortfolio[cryptoId];
    return staked ? staked.amount : 0;
  };

  const calculateStakingRewards = (cryptoId) => {
    const staked = stakedPortfolio[cryptoId];
    if (!staked) return 0;
    
    const crypto = cryptos[cryptoId];
    const timeStaked = (Date.now() - staked.startTime) / (1000 * 60 * 60 * 24 * 365); // years
    const reward = staked.amount * crypto.price * crypto.stakingReward * timeStaked;
    return reward;
  };

  const getTotalStakingRewards = () => {
    return Object.keys(stakedPortfolio).reduce((total, cryptoId) => {
      return total + calculateStakingRewards(cryptoId);
    }, 0);
  };

  const getTotalStakedValue = () => {
    return Object.keys(stakedPortfolio).reduce((total, cryptoId) => {
      const staked = stakedPortfolio[cryptoId];
      const crypto = cryptos[cryptoId];
      return total + (staked.amount * crypto.price);
    }, 0);
  };

  const handleStakeAction = () => {
    if (!selectedCrypto || !stakeAmount || parseFloat(stakeAmount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    const amount = parseFloat(stakeAmount);

    if (actionType === 'stake') {
      const available = getStakableAmount(selectedCrypto);
      if (amount > available) {
        alert('Insufficient holdings to stake');
        return;
      }
      stakeCrypto(selectedCrypto, amount);
    } else {
      const staked = getStakedAmount(selectedCrypto);
      if (amount > staked) {
        alert('Insufficient staked amount');
        return;
      }
      unstakeCrypto(selectedCrypto, amount);
    }

    setStakeAmount('');
  };

  const claimAllRewards = () => {
    dispatch({ type: 'CLAIM_STAKING_REWARDS' });
  };

  const getStakingDuration = (cryptoId) => {
    const staked = stakedPortfolio[cryptoId];
    if (!staked) return 0;
    
    const duration = Date.now() - staked.startTime;
    const days = Math.floor(duration / (1000 * 60 * 60 * 24));
    const hours = Math.floor((duration % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const stakableCryptos = Object.values(cryptos).filter(crypto => crypto.canStake);

  return (
    <div className="staking">
      <div className="staking-header">
        <h1>💎 Crypto Staking</h1>
        <div className="staking-stats">
          <div className="stat">
            <span className="label">Total Staked:</span>
            <span className="value">{formatCurrency(getTotalStakedValue())}</span>
          </div>
          <div className="stat">
            <span className="label">Pending Rewards:</span>
            <span className="value positive">{formatCurrency(getTotalStakingRewards())}</span>
          </div>
          <div className="stat">
            <span className="label">Total Earned:</span>
            <span className="value positive">{formatCurrency(player.stakingRewards)}</span>
          </div>
        </div>
        {getTotalStakingRewards() > 0 && (
          <button className="claim-all-btn" onClick={claimAllRewards}>
            🎁 Claim All Rewards ({formatCurrency(getTotalStakingRewards())})
          </button>
        )}
      </div>

      <div className="staking-content">
        {/* Staking Pools */}
        <div className="staking-pools">
          <h2>🏊 Staking Pools</h2>
          <div className="pools-grid">
            {stakableCryptos.map(crypto => {
              const stakableAmount = getStakableAmount(crypto.id);
              const stakedAmount = getStakedAmount(crypto.id);
              const pendingRewards = calculateStakingRewards(crypto.id);
              const isSelected = selectedCrypto === crypto.id;
              
              return (
                <div
                  key={crypto.id}
                  className={`staking-pool-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => setSelectedCrypto(crypto.id)}
                >
                  <div className="pool-header">
                    <div className="crypto-info">
                      <span className="symbol" style={{ color: crypto.color }}>
                        {crypto.symbol}
                      </span>
                      <span className="name">{crypto.name}</span>
                    </div>
                    <div className="apy">
                      <span className="apy-value">{formatPercent(crypto.stakingReward * 100)}</span>
                      <span className="apy-label">APY</span>
                    </div>
                  </div>

                  <div className="pool-stats">
                    <div className="stat-row">
                      <span className="label">Available to Stake:</span>
                      <span className="value">
                        {stakableAmount.toFixed(8)} {crypto.symbol}
                      </span>
                    </div>
                    <div className="stat-row">
                      <span className="label">Currently Staked:</span>
                      <span className="value">
                        {stakedAmount.toFixed(8)} {crypto.symbol}
                      </span>
                    </div>
                    {stakedAmount > 0 && (
                      <>
                        <div className="stat-row">
                          <span className="label">Staking Duration:</span>
                          <span className="value">{getStakingDuration(crypto.id)}</span>
                        </div>
                        <div className="stat-row">
                          <span className="label">Pending Rewards:</span>
                          <span className="value positive">
                            {formatCurrency(pendingRewards)}
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="pool-value">
                    <div className="staked-value">
                      Staked Value: {formatCurrency(stakedAmount * crypto.price)}
                    </div>
                  </div>

                  {/* Staking benefits */}
                  <div className="staking-benefits">
                    <div className="benefit">
                      <span className="icon">🔒</span>
                      <span>Secure & Safe</span>
                    </div>
                    <div className="benefit">
                      <span className="icon">💰</span>
                      <span>Passive Income</span>
                    </div>
                    <div className="benefit">
                      <span className="icon">📈</span>
                      <span>Compound Growth</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Staking Actions */}
        {selectedCrypto && (
          <div className="staking-actions">
            <h2>⚡ Stake {cryptos[selectedCrypto].name}</h2>
            
            <div className="action-controls">
              {/* Action Type Selection */}
              <div className="action-type-selector">
                <button
                  className={`action-type-btn ${actionType === 'stake' ? 'active' : ''}`}
                  onClick={() => setActionType('stake')}
                >
                  Stake
                </button>
                <button
                  className={`action-type-btn ${actionType === 'unstake' ? 'active' : ''}`}
                  onClick={() => setActionType('unstake')}
                >
                  Unstake
                </button>
              </div>

              {/* Amount Input */}
              <div className="amount-input">
                <label>
                  Amount ({cryptos[selectedCrypto].symbol})
                </label>
                <input
                  type="number"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  placeholder={`Max: ${actionType === 'stake' ? getStakableAmount(selectedCrypto) : getStakedAmount(selectedCrypto)}`}
                  step="0.00000001"
                  min="0"
                />
                <div className="amount-helpers">
                  <button
                    onClick={() => setStakeAmount((actionType === 'stake' ? getStakableAmount(selectedCrypto) : getStakedAmount(selectedCrypto)).toString())}
                  >
                    Max
                  </button>
                  <button
                    onClick={() => setStakeAmount(((actionType === 'stake' ? getStakableAmount(selectedCrypto) : getStakedAmount(selectedCrypto)) * 0.75).toString())}
                  >
                    75%
                  </button>
                  <button
                    onClick={() => setStakeAmount(((actionType === 'stake' ? getStakableAmount(selectedCrypto) : getStakedAmount(selectedCrypto)) * 0.5).toString())}
                  >
                    50%
                  </button>
                  <button
                    onClick={() => setStakeAmount(((actionType === 'stake' ? getStakableAmount(selectedCrypto) : getStakedAmount(selectedCrypto)) * 0.25).toString())}
                  >
                    25%
                  </button>
                </div>
              </div>

              {/* Staking Summary */}
              <div className="staking-summary">
                <div className="summary-row">
                  <span>Action:</span>
                  <span className={actionType}>{actionType.toUpperCase()}</span>
                </div>
                <div className="summary-row">
                  <span>Amount:</span>
                  <span>{stakeAmount || '0'} {cryptos[selectedCrypto].symbol}</span>
                </div>
                <div className="summary-row">
                  <span>Value:</span>
                  <span>{formatCurrency((parseFloat(stakeAmount) || 0) * cryptos[selectedCrypto].price)}</span>
                </div>
                <div className="summary-row">
                  <span>APY:</span>
                  <span className="positive">{formatPercent(cryptos[selectedCrypto].stakingReward * 100)}</span>
                </div>
                {actionType === 'stake' && stakeAmount && (
                  <div className="summary-row">
                    <span>Est. Daily Rewards:</span>
                    <span className="positive">
                      {formatCurrency((parseFloat(stakeAmount) * cryptos[selectedCrypto].price * cryptos[selectedCrypto].stakingReward) / 365)}
                    </span>
                  </div>
                )}
              </div>

              <button
                className={`staking-action-btn ${actionType}`}
                onClick={handleStakeAction}
                disabled={!stakeAmount || parseFloat(stakeAmount) <= 0}
              >
                {actionType === 'stake' ? '🔒 Stake' : '🔓 Unstake'} {cryptos[selectedCrypto].symbol}
              </button>
            </div>
          </div>
        )}

        {/* Staking Education */}
        <div className="staking-education">
          <h2>📚 Staking Guide</h2>
          <div className="education-grid">
            <div className="education-card">
              <h3>🎯 What is Staking?</h3>
              <p>
                Staking involves locking up your cryptocurrency to support network operations 
                and earn rewards. It's like earning interest on your crypto holdings.
              </p>
            </div>
            
            <div className="education-card">
              <h3>💰 How Rewards Work</h3>
              <p>
                Rewards are calculated based on the amount staked, the APY (Annual Percentage Yield), 
                and the duration of staking. Rewards compound over time.
              </p>
            </div>
            
            <div className="education-card">
              <h3>⚠️ Risks & Considerations</h3>
              <p>
                While staking is generally safe, consider that staked tokens may be locked 
                for a period and crypto prices can be volatile.
              </p>
            </div>
            
            <div className="education-card">
              <h3>🚀 Maximizing Returns</h3>
              <p>
                Diversify across multiple staking pools, compound your rewards regularly, 
                and consider the long-term potential of each cryptocurrency.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Staking;