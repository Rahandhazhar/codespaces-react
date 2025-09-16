import React from 'react';
import { useGame } from '../context/EnhancedGameContext';
import './Challenges.css';

function Challenges() {
  const { state, dispatch } = useGame();
  const { dailyChallenges, player, challengesCompleted } = state;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getProgressPercent = (challenge) => {
    return Math.min((challenge.progress / challenge.target) * 100, 100);
  };

  const getChallengeIcon = (challengeId) => {
    const icons = {
      daily_trader: '⚡',
      profit_target: '💰',
      diversify: '🌈',
      hodler: '💎',
      volume_trader: '📊'
    };
    return icons[challengeId] || '🎯';
  };

  const getChallengeColor = (challenge) => {
    if (challenge.completed) return '#00ff88';
    if (challenge.progress > 0) return '#ffa502';
    return '#667eea';
  };

  const getTimeUntilReset = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const diff = tomorrow.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  const completedToday = dailyChallenges.filter(c => c.completed).length;
  const totalChallenges = dailyChallenges.length;

  return (
    <div className="challenges">
      <div className="challenges-header">
        <h1>🎯 Daily Challenges</h1>
        <div className="challenges-stats">
          <div className="stat">
            <span className="label">Completed Today:</span>
            <span className="value">{completedToday}/{totalChallenges}</span>
          </div>
          <div className="stat">
            <span className="label">Total Completed:</span>
            <span className="value">{challengesCompleted}</span>
          </div>
          <div className="stat">
            <span className="label">Resets in:</span>
            <span className="value">{getTimeUntilReset()}</span>
          </div>
        </div>
      </div>

      <div className="challenges-content">
        {/* Daily Progress */}
        <div className="daily-progress">
          <h2>📈 Today's Progress</h2>
          <div className="progress-overview">
            <div className="progress-circle">
              <svg width="120" height="120" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.1)"
                  strokeWidth="8"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="#00ff88"
                  strokeWidth="8"
                  strokeDasharray={`${(completedToday / totalChallenges) * 314} 314`}
                  strokeDashoffset="78.5"
                  transform="rotate(-90 60 60)"
                  style={{ transition: 'stroke-dasharray 0.6s ease' }}
                />
                <text
                  x="60"
                  y="65"
                  textAnchor="middle"
                  fill="white"
                  fontSize="20"
                  fontWeight="bold"
                >
                  {Math.round((completedToday / totalChallenges) * 100)}%
                </text>
              </svg>
            </div>
            <div className="progress-info">
              <h3>Daily Completion</h3>
              <p>{completedToday} out of {totalChallenges} challenges completed</p>
              {completedToday === totalChallenges && (
                <div className="all-complete">
                  🎉 All challenges completed! Great job!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Challenge List */}
        <div className="challenges-list">
          <h2>🏆 Today's Challenges</h2>
          <div className="challenges-grid">
            {dailyChallenges.map(challenge => (
              <div
                key={challenge.id}
                className={`challenge-card ${challenge.completed ? 'completed' : ''}`}
              >
                <div className="challenge-header">
                  <div className="challenge-icon" style={{ color: getChallengeColor(challenge) }}>
                    {getChallengeIcon(challenge.id)}
                  </div>
                  <div className="challenge-info">
                    <h3 className="challenge-name">{challenge.name}</h3>
                    <p className="challenge-description">{challenge.description}</p>
                  </div>
                  <div className="challenge-reward">
                    <span className="reward-amount">{formatCurrency(challenge.reward)}</span>
                    <span className="reward-label">Reward</span>
                  </div>
                </div>

                <div className="challenge-progress">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${getProgressPercent(challenge)}%`,
                        backgroundColor: getChallengeColor(challenge)
                      }}
                    />
                  </div>
                  <div className="progress-text">
                    <span className="current">{challenge.progress.toFixed(challenge.id === 'volume_trader' ? 0 : 2)}</span>
                    <span className="separator">/</span>
                    <span className="target">{challenge.target}</span>
                    {challenge.id === 'profit_target' || challenge.id === 'volume_trader' ? (
                      <span className="unit">$</span>
                    ) : (
                      <span className="unit">{challenge.id === 'hodler' ? 's' : ''}</span>
                    )}
                  </div>
                </div>

                {challenge.completed && (
                  <div className="completion-badge">
                    ✅ Completed!
                  </div>
                )}

                {!challenge.completed && challenge.progress > 0 && (
                  <div className="progress-indicator">
                    🔥 In Progress
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Challenge Tips */}
        <div className="challenge-tips">
          <h2>💡 Challenge Tips</h2>
          <div className="tips-grid">
            <div className="tip-card">
              <h3>⚡ Daily Trader</h3>
              <p>Make quick trades to take advantage of price movements. Even small trades count towards your goal!</p>
            </div>
            
            <div className="tip-card">
              <h3>💰 Profit Target</h3>
              <p>Focus on buying low and selling high. Use technical indicators to time your trades better.</p>
            </div>
            
            <div className="tip-card">
              <h3>🌈 Diversify</h3>
              <p>Spread your investments across different cryptocurrencies to reduce risk and complete this challenge.</p>
            </div>
            
            <div className="tip-card">
              <h3>💎 HODL Strong</h3>
              <p>Sometimes the best strategy is to hold your positions. Resist the urge to sell during volatility.</p>
            </div>
            
            <div className="tip-card">
              <h3>📊 Volume Trader</h3>
              <p>Trade larger amounts or use leverage to reach the volume target. Be careful with risk management!</p>
            </div>
          </div>
        </div>

        {/* Challenge History */}
        <div className="challenge-history">
          <h2>📊 Your Challenge Stats</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">🏆</div>
              <div className="stat-value">{challengesCompleted}</div>
              <div className="stat-label">Total Completed</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">🔥</div>
              <div className="stat-value">{completedToday}</div>
              <div className="stat-label">Completed Today</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">💰</div>
              <div className="stat-value">
                {formatCurrency(dailyChallenges.filter(c => c.completed).reduce((sum, c) => sum + c.reward, 0))}
              </div>
              <div className="stat-label">Earned Today</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">⭐</div>
              <div className="stat-value">
                {challengesCompleted > 0 ? Math.round((challengesCompleted / (challengesCompleted + (totalChallenges - completedToday))) * 100) : 0}%
              </div>
              <div className="stat-label">Success Rate</div>
            </div>
          </div>
        </div>

        {/* Bonus Challenges */}
        <div className="bonus-challenges">
          <h2>🌟 Bonus Objectives</h2>
          <div className="bonus-grid">
            <div className="bonus-card">
              <h3>🎯 Perfect Day</h3>
              <p>Complete all daily challenges in one day</p>
              <div className="bonus-reward">Bonus: +$500</div>
              {completedToday === totalChallenges && (
                <div className="bonus-achieved">🎉 Achieved!</div>
              )}
            </div>
            
            <div className="bonus-card">
              <h3>🔥 Streak Master</h3>
              <p>Complete challenges for 7 consecutive days</p>
              <div className="bonus-reward">Bonus: +$2000</div>
              <div className="bonus-progress">Coming Soon!</div>
            </div>
            
            <div className="bonus-card">
              <h3>👑 Challenge King</h3>
              <p>Complete 50 total challenges</p>
              <div className="bonus-reward">Bonus: +$5000</div>
              <div className="bonus-progress">{challengesCompleted}/50</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Challenges;