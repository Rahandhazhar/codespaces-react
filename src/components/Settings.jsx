import React from 'react';
import { useGame } from '../context/EnhancedGameContext';
import './Settings.css';

function Settings() {
  const { state, updateSettings, dispatch } = useGame();
  const { settings, player } = state;

  const handleSettingChange = (key, value) => {
    updateSettings({ [key]: value });
  };

  const resetGame = () => {
    if (window.confirm('Are you sure you want to reset your game? This action cannot be undone!')) {
      localStorage.removeItem('cryptoTycoonSave');
      window.location.reload();
    }
  };

  const exportSave = () => {
    const saveData = JSON.stringify(state);
    const blob = new Blob([saveData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `crypto-tycoon-save-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importSave = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const saveData = JSON.parse(e.target.result);
        dispatch({ type: 'LOAD_GAME', payload: saveData });
        alert('Game loaded successfully!');
      } catch (error) {
        alert('Invalid save file!');
      }
    };
    reader.readAsText(file);
  };

  const getDifficultyDescription = (difficulty) => {
    switch (difficulty) {
      case 'easy':
        return 'Lower volatility, higher starting cash, reduced fees';
      case 'normal':
        return 'Balanced gameplay experience';
      case 'hard':
        return 'Higher volatility, lower starting cash, increased fees';
      default:
        return 'Balanced gameplay experience';
    }
  };

  return (
    <div className="settings">
      <div className="settings-header">
        <h1>⚙️ Settings</h1>
        <p>Customize your crypto tycoon experience</p>
      </div>

      <div className="settings-content">
        {/* Appearance Settings */}
        <div className="settings-section">
          <h2>🎨 Appearance</h2>
          <div className="settings-grid">
            <div className="setting-item">
              <div className="setting-info">
                <h3>Theme</h3>
                <p>Choose your preferred color scheme</p>
              </div>
              <div className="setting-control">
                <select
                  value={settings.theme}
                  onChange={(e) => handleSettingChange('theme', e.target.value)}
                  className="setting-select"
                >
                  <option value="dark">🌙 Dark</option>
                  <option value="light">☀️ Light</option>
                  <option value="auto">🔄 Auto</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Audio Settings */}
        <div className="settings-section">
          <h2>🔊 Audio & Notifications</h2>
          <div className="settings-grid">
            <div className="setting-item">
              <div className="setting-info">
                <h3>Sound Effects</h3>
                <p>Enable sound effects for trades and notifications</p>
              </div>
              <div className="setting-control">
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.soundEnabled}
                    onChange={(e) => handleSettingChange('soundEnabled', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <h3>Push Notifications</h3>
                <p>Get notified about important market events</p>
              </div>
              <div className="setting-control">
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.notifications}
                    onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Gameplay Settings */}
        <div className="settings-section">
          <h2>🎮 Gameplay</h2>
          <div className="settings-grid">
            <div className="setting-item">
              <div className="setting-info">
                <h3>Difficulty</h3>
                <p>{getDifficultyDescription(settings.difficulty)}</p>
              </div>
              <div className="setting-control">
                <select
                  value={settings.difficulty}
                  onChange={(e) => handleSettingChange('difficulty', e.target.value)}
                  className="setting-select"
                >
                  <option value="easy">🟢 Easy</option>
                  <option value="normal">🟡 Normal</option>
                  <option value="hard">🔴 Hard</option>
                </select>
              </div>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <h3>Auto-Save</h3>
                <p>Automatically save your progress</p>
              </div>
              <div className="setting-control">
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.autoSave}
                    onChange={(e) => handleSettingChange('autoSave', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div className="settings-section">
          <h2>👤 Account Information</h2>
          <div className="account-stats">
            <div className="stat-card">
              <div className="stat-icon">💰</div>
              <div className="stat-info">
                <div className="stat-value">${player.totalValue.toFixed(2)}</div>
                <div className="stat-label">Portfolio Value</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">📈</div>
              <div className="stat-info">
                <div className="stat-value">{player.totalProfitPercent.toFixed(1)}%</div>
                <div className="stat-label">Total Return</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">⚡</div>
              <div className="stat-info">
                <div className="stat-value">{player.tradesCount}</div>
                <div className="stat-label">Total Trades</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">🏆</div>
              <div className="stat-info">
                <div className="stat-value">{player.level}</div>
                <div className="stat-label">Level</div>
              </div>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="settings-section">
          <h2>💾 Data Management</h2>
          <div className="data-management">
            <div className="data-action">
              <div className="action-info">
                <h3>Export Save Data</h3>
                <p>Download your game progress as a backup file</p>
              </div>
              <button className="action-btn export-btn" onClick={exportSave}>
                📥 Export Save
              </button>
            </div>

            <div className="data-action">
              <div className="action-info">
                <h3>Import Save Data</h3>
                <p>Load a previously exported save file</p>
              </div>
              <label className="action-btn import-btn">
                📤 Import Save
                <input
                  type="file"
                  accept=".json"
                  onChange={importSave}
                  style={{ display: 'none' }}
                />
              </label>
            </div>

            <div className="data-action danger">
              <div className="action-info">
                <h3>Reset Game</h3>
                <p>⚠️ This will permanently delete all your progress</p>
              </div>
              <button className="action-btn reset-btn" onClick={resetGame}>
                🗑️ Reset Game
              </button>
            </div>
          </div>
        </div>

        {/* About */}
        <div className="settings-section">
          <h2>ℹ️ About</h2>
          <div className="about-info">
            <div className="about-card">
              <h3>🚀 Crypto Tycoon</h3>
              <p>Version 2.0.0</p>
              <p>
                A comprehensive cryptocurrency trading simulation game. 
                Build your crypto empire through strategic trading, staking, and portfolio management.
              </p>
            </div>

            <div className="about-card">
              <h3>🎮 Features</h3>
              <ul>
                <li>Real-time crypto trading simulation</li>
                <li>Advanced trading with leverage</li>
                <li>Staking for passive income</li>
                <li>Daily challenges and achievements</li>
                <li>Technical analysis tools</li>
                <li>Market news and events</li>
              </ul>
            </div>

            <div className="about-card">
              <h3>⚠️ Disclaimer</h3>
              <p>
                This is a simulation game for entertainment purposes only. 
                Not financial advice. Real cryptocurrency trading involves significant risk.
              </p>
            </div>
          </div>
        </div>

        {/* Keyboard Shortcuts */}
        <div className="settings-section">
          <h2>⌨️ Keyboard Shortcuts</h2>
          <div className="shortcuts-grid">
            <div className="shortcut-item">
              <span className="shortcut-key">D</span>
              <span className="shortcut-action">Dashboard</span>
            </div>
            <div className="shortcut-item">
              <span className="shortcut-key">M</span>
              <span className="shortcut-action">Market</span>
            </div>
            <div className="shortcut-item">
              <span className="shortcut-key">T</span>
              <span className="shortcut-action">Advanced Trading</span>
            </div>
            <div className="shortcut-item">
              <span className="shortcut-key">S</span>
              <span className="shortcut-action">Staking</span>
            </div>
            <div className="shortcut-item">
              <span className="shortcut-key">C</span>
              <span className="shortcut-action">Challenges</span>
            </div>
            <div className="shortcut-item">
              <span className="shortcut-key">N</span>
              <span className="shortcut-action">News</span>
            </div>
            <div className="shortcut-item">
              <span className="shortcut-key">A</span>
              <span className="shortcut-action">Achievements</span>
            </div>
            <div className="shortcut-item">
              <span className="shortcut-key">ESC</span>
              <span className="shortcut-action">Settings</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;