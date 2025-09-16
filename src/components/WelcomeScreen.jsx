import React from 'react';
import { useGame } from '../context/UltraGameContext';
import './WelcomeScreen.css';

function WelcomeScreen() {
  const { startGame } = useGame();

  return (
    <div className="welcome-screen">
      <div className="welcome-container">
        <div className="welcome-header">
          <h1 className="game-title">
            <span className="title-icon">₿</span>
            Crypto Tycoon
          </h1>
          <p className="game-subtitle">Build Your Crypto Empire</p>
        </div>

        <div className="welcome-content">
          <div className="game-description">
            <h2>🚀 Welcome to the Ultimate Crypto Trading Game!</h2>
            <p>
              Start with $10,000 and build your cryptocurrency empire. Trade Bitcoin, Ethereum, 
              Dogecoin, and other popular cryptocurrencies in a dynamic market with real-time 
              price movements and market events.
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Real-time Trading</h3>
              <p>Experience dynamic price movements and market volatility</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3>Portfolio Management</h3>
              <p>Track your investments and monitor profit/loss in real-time</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📰</div>
              <h3>Market News</h3>
              <p>Stay informed with market events that affect crypto prices</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🏆</div>
              <h3>Achievements</h3>
              <p>Unlock achievements as you progress from novice to crypto whale</p>
            </div>
          </div>

          <div className="game-rules">
            <h3>🎯 How to Play</h3>
            <ul>
              <li><strong>Start Trading:</strong> Use your $10,000 starting capital to buy cryptocurrencies</li>
              <li><strong>Buy Low, Sell High:</strong> Watch market trends and make profitable trades</li>
              <li><strong>Diversify:</strong> Spread your investments across different cryptocurrencies</li>
              <li><strong>Stay Informed:</strong> Read market news to anticipate price movements</li>
              <li><strong>Manage Risk:</strong> Don't put all your money in one crypto</li>
              <li><strong>Unlock Achievements:</strong> Reach milestones to become a crypto tycoon</li>
            </ul>
          </div>

          <div className="crypto-showcase">
            <h3>💎 Available Cryptocurrencies</h3>
            <div className="crypto-list">
              <span className="crypto-item" style={{ color: '#f7931a' }}>Bitcoin (BTC)</span>
              <span className="crypto-item" style={{ color: '#627eea' }}>Ethereum (ETH)</span>
              <span className="crypto-item" style={{ color: '#c2a633' }}>Dogecoin (DOGE)</span>
              <span className="crypto-item" style={{ color: '#0033ad' }}>Cardano (ADA)</span>
              <span className="crypto-item" style={{ color: '#9945ff' }}>Solana (SOL)</span>
              <span className="crypto-item" style={{ color: '#ffa409' }}>Shiba Inu (SHIB)</span>
              <span className="crypto-item" style={{ color: '#8247e5' }}>Polygon (MATIC)</span>
              <span className="crypto-item" style={{ color: '#375bd2' }}>Chainlink (LINK)</span>
            </div>
          </div>

          <button className="start-game-btn" onClick={startGame}>
            <span className="btn-icon">🚀</span>
            Start Your Crypto Journey
          </button>

          <div className="disclaimer">
            <p>
              <strong>Disclaimer:</strong> This is a simulation game for entertainment purposes only. 
              Not financial advice. Real cryptocurrency trading involves significant risk.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WelcomeScreen;