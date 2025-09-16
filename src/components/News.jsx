import React from 'react';
import { useGame } from '../context/GameContext';
import './News.css';

function News() {
  const { state } = useGame();
  const { news, cryptos } = state;

  const formatTime = (timestamp) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  const getImpactIcon = (impact) => {
    switch (impact) {
      case 'positive':
        return '📈';
      case 'negative':
        return '📉';
      default:
        return '📊';
    }
  };

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'positive':
        return '#00ff88';
      case 'negative':
        return '#ff4757';
      default:
        return '#ffa502';
    }
  };

  return (
    <div className="news">
      <div className="news-header">
        <h1>Market News & Events</h1>
        <p>Stay updated with the latest crypto market developments</p>
      </div>

      <div className="news-content">
        {news.length === 0 ? (
          <div className="no-news">
            <h2>📰 No recent news</h2>
            <p>Market events will appear here as they happen. Keep trading to see how news affects crypto prices!</p>
          </div>
        ) : (
          <div className="news-list">
            {news.map((item, index) => (
              <div key={index} className={`news-item ${item.impact}`}>
                <div className="news-header-item">
                  <div className="news-impact">
                    <span className="impact-icon">{getImpactIcon(item.impact)}</span>
                    <span 
                      className="impact-label"
                      style={{ color: getImpactColor(item.impact) }}
                    >
                      {item.impact.toUpperCase()}
                    </span>
                  </div>
                  <div className="news-time">{formatTime(item.timestamp)}</div>
                </div>
                
                <h3 className="news-title">{item.title}</h3>
                
                {item.cryptos && (
                  <div className="affected-cryptos">
                    <span className="label">Affected:</span>
                    <div className="crypto-tags">
                      {item.cryptos.map(cryptoId => (
                        <span 
                          key={cryptoId}
                          className="crypto-tag"
                          style={{ 
                            backgroundColor: cryptos[cryptoId]?.color + '20',
                            color: cryptos[cryptoId]?.color 
                          }}
                        >
                          {cryptoId}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Market Insights */}
        <div className="market-insights">
          <h2>💡 Market Insights</h2>
          <div className="insights-grid">
            <div className="insight-card">
              <h3>🎯 Trading Tips</h3>
              <ul>
                <li>Buy low, sell high - watch for price dips</li>
                <li>Diversify your portfolio across multiple cryptos</li>
                <li>Don't panic sell during market downturns</li>
                <li>Keep some cash for opportunities</li>
              </ul>
            </div>
            
            <div className="insight-card">
              <h3>📊 Market Patterns</h3>
              <ul>
                <li>Bitcoin often leads market trends</li>
                <li>Meme coins like DOGE are highly volatile</li>
                <li>News events can cause sudden price movements</li>
                <li>Technical analysis helps predict trends</li>
              </ul>
            </div>
            
            <div className="insight-card">
              <h3>⚠️ Risk Management</h3>
              <ul>
                <li>Never invest more than you can afford to lose</li>
                <li>Set stop-loss levels for your positions</li>
                <li>Take profits when you're ahead</li>
                <li>Stay informed about market developments</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default News;