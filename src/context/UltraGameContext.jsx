import React, { createContext, useContext, useReducer, useEffect } from 'react';

const GameContext = createContext();

// Ultra-enhanced crypto data with advanced features
const initialCryptos = {
  BTC: {
    id: 'BTC',
    name: 'Bitcoin',
    symbol: 'BTC',
    price: 45000,
    change24h: 0,
    volatility: 0.02,
    trend: 0,
    history: [],
    candleData: [],
    color: '#f7931a',
    stakingReward: 0.05,
    canStake: true,
    canMine: true,
    miningDifficulty: 0.8,
    marketCap: 850000000000,
    volume24h: 25000000000,
    rsi: 50,
    macd: 0,
    sentiment: 'neutral',
    liquidityPool: 1000000,
    borrowRate: 0.08,
    lendRate: 0.06,
    correlation: {},
    technicalScore: 50,
    socialScore: 75,
    fundamentalScore: 85
  },
  ETH: {
    id: 'ETH',
    name: 'Ethereum',
    symbol: 'ETH',
    price: 3200,
    change24h: 0,
    volatility: 0.03,
    trend: 0,
    history: [],
    candleData: [],
    color: '#627eea',
    stakingReward: 0.04,
    canStake: true,
    canMine: false,
    miningDifficulty: 0,
    marketCap: 380000000000,
    volume24h: 15000000000,
    rsi: 50,
    macd: 0,
    sentiment: 'neutral',
    liquidityPool: 800000,
    borrowRate: 0.07,
    lendRate: 0.05,
    correlation: {},
    technicalScore: 60,
    socialScore: 80,
    fundamentalScore: 90
  },
  DOGE: {
    id: 'DOGE',
    name: 'Dogecoin',
    symbol: 'DOGE',
    price: 0.08,
    change24h: 0,
    volatility: 0.08,
    trend: 0,
    history: [],
    candleData: [],
    color: '#c2a633',
    stakingReward: 0,
    canStake: false,
    canMine: true,
    miningDifficulty: 0.3,
    marketCap: 11000000000,
    volume24h: 800000000,
    rsi: 50,
    macd: 0,
    sentiment: 'neutral',
    liquidityPool: 200000,
    borrowRate: 0.12,
    lendRate: 0.08,
    correlation: {},
    technicalScore: 30,
    socialScore: 95,
    fundamentalScore: 40
  },
  ADA: {
    id: 'ADA',
    name: 'Cardano',
    symbol: 'ADA',
    price: 0.45,
    change24h: 0,
    volatility: 0.04,
    trend: 0,
    history: [],
    candleData: [],
    color: '#0033ad',
    stakingReward: 0.045,
    canStake: true,
    canMine: false,
    miningDifficulty: 0,
    marketCap: 15000000000,
    volume24h: 500000000,
    rsi: 50,
    macd: 0,
    sentiment: 'neutral',
    liquidityPool: 300000,
    borrowRate: 0.09,
    lendRate: 0.06,
    correlation: {},
    technicalScore: 70,
    socialScore: 65,
    fundamentalScore: 80
  },
  SOL: {
    id: 'SOL',
    name: 'Solana',
    symbol: 'SOL',
    price: 95,
    change24h: 0,
    volatility: 0.06,
    trend: 0,
    history: [],
    candleData: [],
    color: '#9945ff',
    stakingReward: 0.07,
    canStake: true,
    canMine: false,
    miningDifficulty: 0,
    marketCap: 40000000000,
    volume24h: 2000000000,
    rsi: 50,
    macd: 0,
    sentiment: 'neutral',
    liquidityPool: 500000,
    borrowRate: 0.10,
    lendRate: 0.07,
    correlation: {},
    technicalScore: 65,
    socialScore: 70,
    fundamentalScore: 75
  },
  SHIB: {
    id: 'SHIB',
    name: 'Shiba Inu',
    symbol: 'SHIB',
    price: 0.000025,
    change24h: 0,
    volatility: 0.12,
    trend: 0,
    history: [],
    candleData: [],
    color: '#ffa409',
    stakingReward: 0,
    canStake: false,
    canMine: true,
    miningDifficulty: 0.2,
    marketCap: 14000000000,
    volume24h: 600000000,
    rsi: 50,
    macd: 0,
    sentiment: 'neutral',
    liquidityPool: 150000,
    borrowRate: 0.15,
    lendRate: 0.10,
    correlation: {},
    technicalScore: 25,
    socialScore: 90,
    fundamentalScore: 30
  },
  MATIC: {
    id: 'MATIC',
    name: 'Polygon',
    symbol: 'MATIC',
    price: 0.85,
    change24h: 0,
    volatility: 0.05,
    trend: 0,
    history: [],
    candleData: [],
    color: '#8247e5',
    stakingReward: 0.08,
    canStake: true,
    canMine: false,
    miningDifficulty: 0,
    marketCap: 8000000000,
    volume24h: 400000000,
    rsi: 50,
    macd: 0,
    sentiment: 'neutral',
    liquidityPool: 250000,
    borrowRate: 0.11,
    lendRate: 0.08,
    correlation: {},
    technicalScore: 55,
    socialScore: 60,
    fundamentalScore: 70
  },
  LINK: {
    id: 'LINK',
    name: 'Chainlink',
    symbol: 'LINK',
    price: 15.50,
    change24h: 0,
    volatility: 0.04,
    trend: 0,
    history: [],
    candleData: [],
    color: '#375bd2',
    stakingReward: 0.05,
    canStake: true,
    canMine: false,
    miningDifficulty: 0,
    marketCap: 8500000000,
    volume24h: 350000000,
    rsi: 50,
    macd: 0,
    sentiment: 'neutral',
    liquidityPool: 200000,
    borrowRate: 0.09,
    lendRate: 0.06,
    correlation: {},
    technicalScore: 60,
    socialScore: 55,
    fundamentalScore: 85
  }
};

// AI Trading Bots
const initialTradingBots = [
  {
    id: 'scalper',
    name: 'Lightning Scalper',
    description: 'High-frequency trading for quick profits',
    strategy: 'scalping',
    riskLevel: 'high',
    minInvestment: 1000,
    expectedReturn: 0.15,
    active: false,
    performance: 0,
    trades: 0,
    icon: '⚡'
  },
  {
    id: 'hodler',
    name: 'Diamond Hands',
    description: 'Long-term holding strategy',
    strategy: 'hodl',
    riskLevel: 'low',
    minInvestment: 500,
    expectedReturn: 0.08,
    active: false,
    performance: 0,
    trades: 0,
    icon: '💎'
  },
  {
    id: 'arbitrage',
    name: 'Arbitrage Master',
    description: 'Exploits price differences across markets',
    strategy: 'arbitrage',
    riskLevel: 'medium',
    minInvestment: 2000,
    expectedReturn: 0.12,
    active: false,
    performance: 0,
    trades: 0,
    icon: '🔄'
  },
  {
    id: 'momentum',
    name: 'Momentum Rider',
    description: 'Follows market trends and momentum',
    strategy: 'momentum',
    riskLevel: 'medium',
    minInvestment: 1500,
    expectedReturn: 0.10,
    active: false,
    performance: 0,
    trades: 0,
    icon: '🚀'
  }
];

// Mining Hardware
const miningHardware = [
  {
    id: 'cpu',
    name: 'CPU Miner',
    hashRate: 1,
    powerConsumption: 100,
    cost: 0,
    owned: 1,
    efficiency: 0.01,
    icon: '🖥️'
  },
  {
    id: 'gpu_basic',
    name: 'Basic GPU',
    hashRate: 10,
    powerConsumption: 200,
    cost: 500,
    owned: 0,
    efficiency: 0.05,
    icon: '🎮'
  },
  {
    id: 'gpu_advanced',
    name: 'Advanced GPU',
    hashRate: 25,
    powerConsumption: 300,
    cost: 1200,
    owned: 0,
    efficiency: 0.08,
    icon: '🔥'
  },
  {
    id: 'asic',
    name: 'ASIC Miner',
    hashRate: 100,
    powerConsumption: 1500,
    cost: 5000,
    owned: 0,
    efficiency: 0.15,
    icon: '⚡'
  },
  {
    id: 'quantum',
    name: 'Quantum Miner',
    hashRate: 1000,
    powerConsumption: 5000,
    cost: 50000,
    owned: 0,
    efficiency: 0.30,
    icon: '🌌'
  }
];

// NFT Collections
const nftCollections = [
  {
    id: 'crypto_punks',
    name: 'Crypto Punks',
    floorPrice: 50,
    volume24h: 1000,
    items: 100,
    rarity: 'legendary',
    category: 'pfp',
    icon: '👾'
  },
  {
    id: 'bored_apes',
    name: 'Bored Apes',
    floorPrice: 30,
    volume24h: 800,
    items: 150,
    rarity: 'epic',
    category: 'pfp',
    icon: '🐵'
  },
  {
    id: 'art_blocks',
    name: 'Art Blocks',
    floorPrice: 5,
    volume24h: 200,
    items: 500,
    rarity: 'rare',
    category: 'art',
    icon: '🎨'
  },
  {
    id: 'gaming_items',
    name: 'Gaming Items',
    floorPrice: 1,
    volume24h: 100,
    items: 1000,
    rarity: 'common',
    category: 'gaming',
    icon: '🎮'
  }
];

// Enhanced daily challenges
const enhancedDailyChallenges = [
  { id: 'daily_trader', name: 'Daily Trader', description: 'Make 3 trades today', reward: 100, progress: 0, target: 3, completed: false, type: 'trading' },
  { id: 'profit_target', name: 'Profit Target', description: 'Make $500 profit today', reward: 200, progress: 0, target: 500, completed: false, type: 'profit' },
  { id: 'diversify', name: 'Diversify', description: 'Hold 4 different cryptos', reward: 150, progress: 0, target: 4, completed: false, type: 'portfolio' },
  { id: 'hodler', name: 'HODL Strong', description: 'Don\'t sell anything for 2 minutes', reward: 75, progress: 0, target: 120, completed: false, type: 'patience' },
  { id: 'volume_trader', name: 'Volume Trader', description: 'Trade $5000 worth today', reward: 300, progress: 0, target: 5000, completed: false, type: 'volume' },
  { id: 'staking_master', name: 'Staking Master', description: 'Stake $1000 worth of crypto', reward: 200, progress: 0, target: 1000, completed: false, type: 'staking' },
  { id: 'mining_mogul', name: 'Mining Mogul', description: 'Mine $100 worth of crypto', reward: 150, progress: 0, target: 100, completed: false, type: 'mining' },
  { id: 'defi_explorer', name: 'DeFi Explorer', description: 'Provide liquidity to 2 pools', reward: 250, progress: 0, target: 2, completed: false, type: 'defi' },
  { id: 'nft_collector', name: 'NFT Collector', description: 'Buy 1 NFT', reward: 300, progress: 0, target: 1, completed: false, type: 'nft' },
  { id: 'bot_master', name: 'Bot Master', description: 'Deploy an AI trading bot', reward: 400, progress: 0, target: 1, completed: false, type: 'ai' }
];

const initialState = {
  player: {
    cash: 10000,
    totalValue: 10000,
    startingCash: 10000,
    totalProfit: 0,
    totalProfitPercent: 0,
    level: 1,
    experience: 0,
    leverage: 1,
    maxLeverage: 5,
    stakingRewards: 0,
    miningRewards: 0,
    defiRewards: 0,
    nftValue: 0,
    botRewards: 0,
    dailyProfitToday: 0,
    tradesCount: 0,
    lastLoginDate: new Date().toDateString(),
    reputation: 100,
    socialRank: 'Novice',
    achievements: [],
    badges: []
  },
  portfolio: {},
  stakedPortfolio: {},
  liquidityPools: {},
  lendingPositions: {},
  borrowingPositions: {},
  nftPortfolio: {},
  miningRigs: miningHardware,
  tradingBots: initialTradingBots,
  cryptos: initialCryptos,
  transactions: [],
  pendingOrders: [],
  news: [],
  achievements: [
    { id: 'first_trade', name: 'First Trade', description: 'Make your first trade', unlocked: false, reward: 50, category: 'trading' },
    { id: 'profit_1k', name: 'Profit Maker', description: 'Make $1,000 profit', unlocked: false, reward: 100, category: 'profit' },
    { id: 'portfolio_25k', name: 'Growing Portfolio', description: 'Reach $25,000 total value', unlocked: false, reward: 250, category: 'wealth' },
    { id: 'hodler', name: 'Diamond Hands', description: 'Hold a position for 5 minutes', unlocked: false, reward: 75, category: 'patience' },
    { id: 'day_trader', name: 'Day Trader', description: 'Make 10 trades in one session', unlocked: false, reward: 150, category: 'trading' },
    { id: 'whale', name: 'Crypto Whale', description: 'Reach $100,000 total value', unlocked: false, reward: 500, category: 'wealth' },
    { id: 'leverage_master', name: 'Leverage Master', description: 'Use 5x leverage successfully', unlocked: false, reward: 200, category: 'risk' },
    { id: 'staking_pro', name: 'Staking Pro', description: 'Earn $100 from staking', unlocked: false, reward: 100, category: 'passive' },
    { id: 'challenge_master', name: 'Challenge Master', description: 'Complete 10 daily challenges', unlocked: false, reward: 300, category: 'dedication' },
    { id: 'mining_tycoon', name: 'Mining Tycoon', description: 'Earn $1000 from mining', unlocked: false, reward: 400, category: 'mining' },
    { id: 'defi_pioneer', name: 'DeFi Pioneer', description: 'Earn $500 from DeFi', unlocked: false, reward: 300, category: 'defi' },
    { id: 'nft_mogul', name: 'NFT Mogul', description: 'Own $5000 worth of NFTs', unlocked: false, reward: 600, category: 'nft' },
    { id: 'ai_overlord', name: 'AI Overlord', description: 'Earn $2000 from trading bots', unlocked: false, reward: 800, category: 'ai' },
    { id: 'social_influencer', name: 'Social Influencer', description: 'Reach top 10 on leaderboard', unlocked: false, reward: 1000, category: 'social' },
    { id: 'crypto_god', name: 'Crypto God', description: 'Reach $1,000,000 total value', unlocked: false, reward: 5000, category: 'legendary' }
  ],
  dailyChallenges: enhancedDailyChallenges,
  challengesCompleted: 0,
  currentView: 'dashboard',
  gameStarted: false,
  settings: {
    theme: 'dark',
    soundEnabled: true,
    notifications: true,
    autoSave: true,
    difficulty: 'normal',
    chartType: 'candlestick',
    animationsEnabled: true,
    particlesEnabled: true,
    glassEffect: true,
    autoTrading: false
  },
  marketSentiment: 'neutral',
  aiAssistant: {
    enabled: true,
    suggestions: [],
    lastUpdate: Date.now(),
    personality: 'professional'
  },
  socialTrading: {
    followers: 0,
    following: 0,
    copiedTrades: 0,
    copyTraders: []
  },
  leaderboard: [],
  marketData: {
    totalMarketCap: 2000000000000,
    totalVolume24h: 100000000000,
    btcDominance: 42.5,
    fearGreedIndex: 50,
    activeTraders: 125000
  },
  defiProtocols: {
    totalValueLocked: 50000000000,
    topProtocols: ['Uniswap', 'Aave', 'Compound', 'MakerDAO']
  }
};

// Advanced technical analysis
const calculateAdvancedIndicators = (prices) => {
  if (prices.length < 50) return { rsi: 50, macd: 0, bb: { upper: 0, middle: 0, lower: 0 }, ema: 0 };
  
  // RSI calculation
  let gains = 0, losses = 0;
  for (let i = 1; i < 15; i++) {
    const change = prices[i] - prices[i - 1];
    if (change > 0) gains += change;
    else losses -= change;
  }
  const rsi = 100 - (100 / (1 + (gains / 14) / (losses / 14)));
  
  // MACD calculation
  const ema12 = prices.slice(-12).reduce((a, b) => a + b) / 12;
  const ema26 = prices.slice(-26).reduce((a, b) => a + b) / 26;
  const macd = ema12 - ema26;
  
  // Bollinger Bands
  const sma20 = prices.slice(-20).reduce((a, b) => a + b) / 20;
  const variance = prices.slice(-20).reduce((sum, price) => sum + Math.pow(price - sma20, 2), 0) / 20;
  const stdDev = Math.sqrt(variance);
  const bb = {
    upper: sma20 + (stdDev * 2),
    middle: sma20,
    lower: sma20 - (stdDev * 2)
  };
  
  // EMA
  const ema = prices.slice(-20).reduce((a, b) => a + b) / 20;
  
  return { rsi, macd, bb, ema };
};

// Generate candlestick data
const generateCandleData = (currentPrice, previousCandle) => {
  const volatility = 0.02;
  const change = (Math.random() - 0.5) * volatility;
  
  const open = previousCandle ? previousCandle.close : currentPrice;
  const close = open * (1 + change);
  const high = Math.max(open, close) * (1 + Math.random() * 0.01);
  const low = Math.min(open, close) * (1 - Math.random() * 0.01);
  
  return {
    open,
    high,
    low,
    close,
    volume: Math.random() * 1000000,
    timestamp: Date.now()
  };
};

function ultraGameReducer(state, action) {
  switch (action.type) {
    case 'START_GAME':
      return { ...state, gameStarted: true };
    
    case 'SET_VIEW':
      return { ...state, currentView: action.payload };
    
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload }
      };
    
    case 'UPDATE_CRYPTO_PRICES':
      const updatedCryptos = { ...state.cryptos };
      let newMarketSentiment = state.marketSentiment;
      
      // Update market sentiment
      if (Math.random() < 0.03) {
        const sentiments = ['bullish', 'bearish', 'neutral'];
        newMarketSentiment = sentiments[Math.floor(Math.random() * sentiments.length)];
      }
      
      Object.keys(updatedCryptos).forEach(cryptoId => {
        const crypto = updatedCryptos[cryptoId];
        const volatility = crypto.volatility;
        
        // Market sentiment influence
        let sentimentInfluence = 0;
        if (newMarketSentiment === 'bullish') sentimentInfluence = 0.002;
        else if (newMarketSentiment === 'bearish') sentimentInfluence = -0.002;
        
        const randomChange = (Math.random() - 0.5) * 2 * volatility;
        const trendInfluence = crypto.trend * 0.001;
        const priceChange = randomChange + trendInfluence + sentimentInfluence;
        
        const newPrice = Math.max(crypto.price * (1 + priceChange), 0.000001);
        const change24h = ((newPrice - crypto.price) / crypto.price) * 100;
        
        const newHistory = [...crypto.history.slice(-100), { price: newPrice, timestamp: Date.now() }];
        const prices = newHistory.map(h => h.price);
        const indicators = calculateAdvancedIndicators(prices);
        
        // Generate candlestick data
        const lastCandle = crypto.candleData[crypto.candleData.length - 1];
        const newCandle = generateCandleData(newPrice, lastCandle);
        const newCandleData = [...crypto.candleData.slice(-100), newCandle];
        
        // Calculate correlation with BTC
        if (cryptoId !== 'BTC' && state.cryptos.BTC) {
          const btcPrices = state.cryptos.BTC.history.slice(-20).map(h => h.price);
          const cryptoPrices = newHistory.slice(-20).map(h => h.price);
          const correlation = calculateCorrelation(btcPrices, cryptoPrices);
          crypto.correlation.BTC = correlation;
        }
        
        updatedCryptos[cryptoId] = {
          ...crypto,
          price: newPrice,
          change24h: change24h,
          history: newHistory,
          candleData: newCandleData,
          rsi: indicators.rsi,
          macd: indicators.macd,
          bollingerBands: indicators.bb,
          ema: indicators.ema,
          sentiment: change24h > 3 ? 'bullish' : change24h < -3 ? 'bearish' : 'neutral',
          technicalScore: Math.max(0, Math.min(100, indicators.rsi + (indicators.macd > 0 ? 10 : -10))),
          volume24h: crypto.volume24h * (1 + (Math.random() - 0.5) * 0.1)
        };
      });
      
      // Calculate total portfolio value including all assets
      let portfolioValue = 0;
      Object.keys(state.portfolio).forEach(cryptoId => {
        const holding = state.portfolio[cryptoId];
        const currentPrice = updatedCryptos[cryptoId].price;
        portfolioValue += holding.amount * currentPrice * holding.leverage;
      });
      
      // Add staked value
      let stakedValue = 0;
      Object.keys(state.stakedPortfolio).forEach(cryptoId => {
        const staked = state.stakedPortfolio[cryptoId];
        const currentPrice = updatedCryptos[cryptoId].price;
        stakedValue += staked.amount * currentPrice;
      });
      
      // Add DeFi value
      let defiValue = 0;
      Object.keys(state.liquidityPools).forEach(poolId => {
        const pool = state.liquidityPools[poolId];
        defiValue += pool.value;
      });
      
      const totalValue = state.player.cash + portfolioValue + stakedValue + defiValue + state.player.nftValue;
      const totalProfit = totalValue - state.player.startingCash;
      const totalProfitPercent = (totalProfit / state.player.startingCash) * 100;
      
      return {
        ...state,
        cryptos: updatedCryptos,
        marketSentiment: newMarketSentiment,
        player: {
          ...state.player,
          totalValue,
          totalProfit,
          totalProfitPercent
        }
      };
    
    case 'DEPLOY_TRADING_BOT':
      const { botId, investment } = action.payload;
      const bot = state.tradingBots.find(b => b.id === botId);
      
      if (!bot || investment < bot.minInvestment || investment > state.player.cash) {
        return state;
      }
      
      const updatedBots = state.tradingBots.map(b =>
        b.id === botId
          ? { ...b, active: true, investment, startTime: Date.now() }
          : b
      );
      
      return {
        ...state,
        tradingBots: updatedBots,
        player: {
          ...state.player,
          cash: state.player.cash - investment
        }
      };
    
    case 'STOP_TRADING_BOT':
      const { botId: stopBotId } = action.payload;
      const stopBot = state.tradingBots.find(b => b.id === stopBotId);
      
      if (!stopBot || !stopBot.active) return state;
      
      const returns = stopBot.investment * (1 + stopBot.performance);
      const updatedStopBots = state.tradingBots.map(b =>
        b.id === stopBotId
          ? { ...b, active: false, investment: 0, performance: 0 }
          : b
      );
      
      return {
        ...state,
        tradingBots: updatedStopBots,
        player: {
          ...state.player,
          cash: state.player.cash + returns,
          botRewards: state.player.botRewards + (returns - stopBot.investment)
        }
      };
    
    case 'PROVIDE_LIQUIDITY':
      const { cryptoId: liquidityCrypto, amount: liquidityAmount } = action.payload;
      const crypto = state.cryptos[liquidityCrypto];
      const value = liquidityAmount * crypto.price;
      
      if (value > state.player.cash) return state;
      
      const poolId = `${liquidityCrypto}_POOL`;
      const existingPool = state.liquidityPools[poolId] || { amount: 0, value: 0, rewards: 0 };
      
      return {
        ...state,
        liquidityPools: {
          ...state.liquidityPools,
          [poolId]: {
            cryptoId: liquidityCrypto,
            amount: existingPool.amount + liquidityAmount,
            value: existingPool.value + value,
            rewards: existingPool.rewards,
            startTime: Date.now()
          }
        },
        player: {
          ...state.player,
          cash: state.player.cash - value
        }
      };
    
    case 'REMOVE_LIQUIDITY':
      const { poolId: removePoolId, percentage } = action.payload;
      const pool = state.liquidityPools[removePoolId];
      
      if (!pool) return state;
      
      const removeValue = pool.value * (percentage / 100);
      const removeAmount = pool.amount * (percentage / 100);
      const rewards = pool.rewards * (percentage / 100);
      
      const updatedPools = { ...state.liquidityPools };
      if (percentage === 100) {
        delete updatedPools[removePoolId];
      } else {
        updatedPools[removePoolId] = {
          ...pool,
          amount: pool.amount - removeAmount,
          value: pool.value - removeValue,
          rewards: pool.rewards - rewards
        };
      }
      
      return {
        ...state,
        liquidityPools: updatedPools,
        player: {
          ...state.player,
          cash: state.player.cash + removeValue + rewards,
          defiRewards: state.player.defiRewards + rewards
        }
      };
    
    case 'BUY_MINING_HARDWARE':
      const { hardwareId } = action.payload;
      const hardware = state.miningRigs.find(h => h.id === hardwareId);
      
      if (!hardware || hardware.cost > state.player.cash) return state;
      
      const updatedRigs = state.miningRigs.map(rig =>
        rig.id === hardwareId
          ? { ...rig, owned: rig.owned + 1 }
          : rig
      );
      
      return {
        ...state,
        miningRigs: updatedRigs,
        player: {
          ...state.player,
          cash: state.player.cash - hardware.cost
        }
      };
    
    case 'MINE_CRYPTO':
      const totalHashRate = state.miningRigs.reduce((total, rig) => total + (rig.hashRate * rig.owned), 0);
      const totalPowerCost = state.miningRigs.reduce((total, rig) => total + (rig.powerConsumption * rig.owned * 0.1), 0);
      
      let miningRewards = 0;
      Object.keys(state.cryptos).forEach(cryptoId => {
        const crypto = state.cryptos[cryptoId];
        if (crypto.canMine) {
          const reward = (totalHashRate * crypto.efficiency * crypto.price) / crypto.miningDifficulty;
          miningRewards += reward;
        }
      });
      
      const netRewards = Math.max(0, miningRewards - totalPowerCost);
      
      return {
        ...state,
        player: {
          ...state.player,
          cash: state.player.cash + netRewards,
          miningRewards: state.player.miningRewards + netRewards
        }
      };
    
    case 'BUY_NFT':
      const { collectionId, nftId, price: nftPrice } = action.payload;
      
      if (nftPrice > state.player.cash) return state;
      
      const nftKey = `${collectionId}_${nftId}`;
      
      return {
        ...state,
        nftPortfolio: {
          ...state.nftPortfolio,
          [nftKey]: {
            collectionId,
            nftId,
            purchasePrice: nftPrice,
            currentValue: nftPrice,
            purchaseDate: Date.now()
          }
        },
        player: {
          ...state.player,
          cash: state.player.cash - nftPrice,
          nftValue: state.player.nftValue + nftPrice
        }
      };
    
    case 'SELL_NFT':
      const { nftKey: sellNftKey, sellPrice } = action.payload;
      const nft = state.nftPortfolio[sellNftKey];
      
      if (!nft) return state;
      
      const updatedNftPortfolio = { ...state.nftPortfolio };
      delete updatedNftPortfolio[sellNftKey];
      
      return {
        ...state,
        nftPortfolio: updatedNftPortfolio,
        player: {
          ...state.player,
          cash: state.player.cash + sellPrice,
          nftValue: state.player.nftValue - nft.currentValue
        }
      };
    
    case 'BUY_CRYPTO':
      const { cryptoId: buyCryptoId, amount: buyAmount, leverage: buyLeverage = 1 } = action.payload;
      const buyCrypto = state.cryptos[buyCryptoId];
      const totalCost = buyAmount * buyCrypto.price;
      
      if (totalCost > state.player.cash) return state;
      
      const existingHolding = state.portfolio[buyCryptoId] || { amount: 0, avgBuyPrice: 0, leverage: 1 };
      const newTotalAmount = existingHolding.amount + buyAmount;
      const newAvgPrice = ((existingHolding.amount * existingHolding.avgBuyPrice) + (buyAmount * buyCrypto.price)) / newTotalAmount;
      
      const transaction = {
        id: Date.now(),
        type: 'buy',
        cryptoId: buyCryptoId,
        amount: buyAmount,
        price: buyCrypto.price,
        total: totalCost,
        timestamp: Date.now(),
        leverage: buyLeverage
      };
      
      return {
        ...state,
        portfolio: {
          ...state.portfolio,
          [buyCryptoId]: {
            amount: newTotalAmount,
            avgBuyPrice: newAvgPrice,
            leverage: buyLeverage
          }
        },
        player: {
          ...state.player,
          cash: state.player.cash - totalCost,
          tradesCount: state.player.tradesCount + 1
        },
        transactions: [transaction, ...state.transactions.slice(0, 99)]
      };
    
    case 'SELL_CRYPTO':
      const { cryptoId: sellCryptoId, amount: sellAmount } = action.payload;
      const sellCrypto = state.cryptos[sellCryptoId];
      const holding = state.portfolio[sellCryptoId];
      
      if (!holding || sellAmount > holding.amount) return state;
      
      const sellValue = sellAmount * sellCrypto.price * holding.leverage;
      const fee = sellValue * 0.001; // 0.1% trading fee
      const netValue = sellValue - fee;
      
      const sellTransaction = {
        id: Date.now(),
        type: 'sell',
        cryptoId: sellCryptoId,
        amount: sellAmount,
        price: sellCrypto.price,
        total: netValue,
        timestamp: Date.now(),
        leverage: holding.leverage
      };
      
      const updatedPortfolio = { ...state.portfolio };
      if (sellAmount === holding.amount) {
        delete updatedPortfolio[sellCryptoId];
      } else {
        updatedPortfolio[sellCryptoId] = {
          ...holding,
          amount: holding.amount - sellAmount
        };
      }
      
      return {
        ...state,
        portfolio: updatedPortfolio,
        player: {
          ...state.player,
          cash: state.player.cash + netValue,
          tradesCount: state.player.tradesCount + 1
        },
        transactions: [sellTransaction, ...state.transactions.slice(0, 99)]
      };
    
    case 'STAKE_CRYPTO':
      const { cryptoId: stakeCryptoId, amount: stakeAmount } = action.payload;
      const stakeCrypto = state.cryptos[stakeCryptoId];
      
      if (!stakeCrypto.canStake) return state;
      
      const stakeHolding = state.portfolio[stakeCryptoId];
      if (!stakeHolding || stakeAmount > stakeHolding.amount) return state;
      
      const existingStake = state.stakedPortfolio[stakeCryptoId] || { amount: 0, startTime: Date.now(), rewards: 0 };
      
      const updatedStakePortfolio = {
        ...state.stakedPortfolio,
        [stakeCryptoId]: {
          amount: existingStake.amount + stakeAmount,
          startTime: existingStake.startTime || Date.now(),
          rewards: existingStake.rewards
        }
      };
      
      const updatedPortfolioForStake = { ...state.portfolio };
      if (stakeAmount === stakeHolding.amount) {
        delete updatedPortfolioForStake[stakeCryptoId];
      } else {
        updatedPortfolioForStake[stakeCryptoId] = {
          ...stakeHolding,
          amount: stakeHolding.amount - stakeAmount
        };
      }
      
      return {
        ...state,
        portfolio: updatedPortfolioForStake,
        stakedPortfolio: updatedStakePortfolio
      };
    
    case 'UNSTAKE_CRYPTO':
      const { cryptoId: unstakeCryptoId, amount: unstakeAmount } = action.payload;
      const unstakeStake = state.stakedPortfolio[unstakeCryptoId];
      
      if (!unstakeStake || unstakeAmount > unstakeStake.amount) return state;
      
      const unstakeHolding = state.portfolio[unstakeCryptoId] || { amount: 0, avgBuyPrice: state.cryptos[unstakeCryptoId].price, leverage: 1 };
      
      const updatedUnstakePortfolio = {
        ...state.portfolio,
        [unstakeCryptoId]: {
          ...unstakeHolding,
          amount: unstakeHolding.amount + unstakeAmount
        }
      };
      
      const updatedUnstakeStaked = { ...state.stakedPortfolio };
      if (unstakeAmount === unstakeStake.amount) {
        delete updatedUnstakeStaked[unstakeCryptoId];
      } else {
        updatedUnstakeStaked[unstakeCryptoId] = {
          ...unstakeStake,
          amount: unstakeStake.amount - unstakeAmount
        };
      }
      
      return {
        ...state,
        portfolio: updatedUnstakePortfolio,
        stakedPortfolio: updatedUnstakeStaked
      };
    
    default:
      return state;
  }
}

// Helper function to calculate correlation
const calculateCorrelation = (x, y) => {
  if (x.length !== y.length || x.length === 0) return 0;
  
  const n = x.length;
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
  const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
  const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);
  
  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
  
  return denominator === 0 ? 0 : numerator / denominator;
};

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(ultraGameReducer, initialState);

  // Enhanced price updates with more features
  useEffect(() => {
    if (!state.gameStarted) return;
    
    const interval = setInterval(() => {
      dispatch({ type: 'UPDATE_CRYPTO_PRICES' });
    }, 1500); // Faster updates for more dynamic feel

    return () => clearInterval(interval);
  }, [state.gameStarted]);

  // AI Trading Bot performance updates
  useEffect(() => {
    if (!state.gameStarted) return;
    
    const botInterval = setInterval(() => {
      state.tradingBots.forEach(bot => {
        if (bot.active) {
          const performance = (Math.random() - 0.5) * 0.02; // ±1% per update
          const updatedBots = state.tradingBots.map(b =>
            b.id === bot.id
              ? { ...b, performance: b.performance + performance, trades: b.trades + 1 }
              : b
          );
          // Update bot performance
        }
      });
    }, 5000);

    return () => clearInterval(botInterval);
  }, [state.gameStarted, state.tradingBots]);

  // Mining rewards
  useEffect(() => {
    if (!state.gameStarted) return;
    
    const miningInterval = setInterval(() => {
      dispatch({ type: 'MINE_CRYPTO' });
    }, 10000); // Mine every 10 seconds

    return () => clearInterval(miningInterval);
  }, [state.gameStarted]);

  // DeFi rewards
  useEffect(() => {
    if (!state.gameStarted) return;
    
    const defiInterval = setInterval(() => {
      Object.keys(state.liquidityPools).forEach(poolId => {
        const pool = state.liquidityPools[poolId];
        const crypto = state.cryptos[pool.cryptoId];
        const reward = pool.value * 0.0001; // 0.01% per update
        
        // Update pool rewards
        dispatch({
          type: 'UPDATE_POOL_REWARDS',
          payload: { poolId, reward }
        });
      });
    }, 30000); // Update every 30 seconds

    return () => clearInterval(defiInterval);
  }, [state.gameStarted, state.liquidityPools]);

  const value = {
    state,
    dispatch,
    startGame: () => {
      dispatch({ type: 'START_GAME' });
    },
    setView: (view) => {
      dispatch({ type: 'SET_VIEW', payload: view });
    },
    updateSettings: (settings) => {
      dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
    },
    deployTradingBot: (botId, investment) => {
      dispatch({ type: 'DEPLOY_TRADING_BOT', payload: { botId, investment } });
    },
    stopTradingBot: (botId) => {
      dispatch({ type: 'STOP_TRADING_BOT', payload: { botId } });
    },
    provideLiquidity: (cryptoId, amount) => {
      dispatch({ type: 'PROVIDE_LIQUIDITY', payload: { cryptoId, amount } });
    },
    removeLiquidity: (poolId, percentage) => {
      dispatch({ type: 'REMOVE_LIQUIDITY', payload: { poolId, percentage } });
    },
    buyMiningHardware: (hardwareId) => {
      dispatch({ type: 'BUY_MINING_HARDWARE', payload: { hardwareId } });
    },
    buyNFT: (collectionId, nftId, price) => {
      dispatch({ type: 'BUY_NFT', payload: { collectionId, nftId, price } });
    },
    sellNFT: (nftKey, sellPrice) => {
      dispatch({ type: 'SELL_NFT', payload: { nftKey, sellPrice } });
    },
    buyCrypto: (cryptoId, amount, leverage = 1) => {
      dispatch({ type: 'BUY_CRYPTO', payload: { cryptoId, amount, leverage } });
    },
    sellCrypto: (cryptoId, amount) => {
      dispatch({ type: 'SELL_CRYPTO', payload: { cryptoId, amount } });
    },
    stakeCrypto: (cryptoId, amount) => {
      dispatch({ type: 'STAKE_CRYPTO', payload: { cryptoId, amount } });
    },
    unstakeCrypto: (cryptoId, amount) => {
      dispatch({ type: 'UNSTAKE_CRYPTO', payload: { cryptoId, amount } });
    }
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}