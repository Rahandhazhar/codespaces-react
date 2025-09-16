import React, { createContext, useContext, useReducer, useEffect } from 'react';

const GameContext = createContext();

// Enhanced crypto data with more properties
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
    color: '#f7931a',
    stakingReward: 0.05, // 5% annual
    canStake: true,
    marketCap: 850000000000,
    volume24h: 25000000000,
    rsi: 50,
    macd: 0,
    sentiment: 'neutral'
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
    color: '#627eea',
    stakingReward: 0.04,
    canStake: true,
    marketCap: 380000000000,
    volume24h: 15000000000,
    rsi: 50,
    macd: 0,
    sentiment: 'neutral'
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
    color: '#c2a633',
    stakingReward: 0,
    canStake: false,
    marketCap: 11000000000,
    volume24h: 800000000,
    rsi: 50,
    macd: 0,
    sentiment: 'neutral'
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
    color: '#0033ad',
    stakingReward: 0.045,
    canStake: true,
    marketCap: 15000000000,
    volume24h: 500000000,
    rsi: 50,
    macd: 0,
    sentiment: 'neutral'
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
    color: '#9945ff',
    stakingReward: 0.07,
    canStake: true,
    marketCap: 40000000000,
    volume24h: 2000000000,
    rsi: 50,
    macd: 0,
    sentiment: 'neutral'
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
    color: '#ffa409',
    stakingReward: 0,
    canStake: false,
    marketCap: 14000000000,
    volume24h: 600000000,
    rsi: 50,
    macd: 0,
    sentiment: 'neutral'
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
    color: '#8247e5',
    stakingReward: 0.08,
    canStake: true,
    marketCap: 8000000000,
    volume24h: 400000000,
    rsi: 50,
    macd: 0,
    sentiment: 'neutral'
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
    color: '#375bd2',
    stakingReward: 0.05,
    canStake: true,
    marketCap: 8500000000,
    volume24h: 350000000,
    rsi: 50,
    macd: 0,
    sentiment: 'neutral'
  }
};

const dailyChallenges = [
  { id: 'daily_trader', name: 'Daily Trader', description: 'Make 3 trades today', reward: 100, progress: 0, target: 3, completed: false },
  { id: 'profit_target', name: 'Profit Target', description: 'Make $500 profit today', reward: 200, progress: 0, target: 500, completed: false },
  { id: 'diversify', name: 'Diversify', description: 'Hold 4 different cryptos', reward: 150, progress: 0, target: 4, completed: false },
  { id: 'hodler', name: 'HODL Strong', description: 'Don\'t sell anything for 2 minutes', reward: 75, progress: 0, target: 120, completed: false },
  { id: 'volume_trader', name: 'Volume Trader', description: 'Trade $5000 worth today', reward: 300, progress: 0, target: 5000, completed: false }
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
    dailyProfitToday: 0,
    tradesCount: 0,
    lastLoginDate: new Date().toDateString()
  },
  portfolio: {},
  stakedPortfolio: {},
  cryptos: initialCryptos,
  transactions: [],
  pendingOrders: [],
  news: [],
  achievements: [
    { id: 'first_trade', name: 'First Trade', description: 'Make your first trade', unlocked: false, reward: 50 },
    { id: 'profit_1k', name: 'Profit Maker', description: 'Make $1,000 profit', unlocked: false, reward: 100 },
    { id: 'portfolio_25k', name: 'Growing Portfolio', description: 'Reach $25,000 total value', unlocked: false, reward: 250 },
    { id: 'hodler', name: 'Diamond Hands', description: 'Hold a position for 5 minutes', unlocked: false, reward: 75 },
    { id: 'day_trader', name: 'Day Trader', description: 'Make 10 trades in one session', unlocked: false, reward: 150 },
    { id: 'whale', name: 'Crypto Whale', description: 'Reach $100,000 total value', unlocked: false, reward: 500 },
    { id: 'leverage_master', name: 'Leverage Master', description: 'Use 5x leverage successfully', unlocked: false, reward: 200 },
    { id: 'staking_pro', name: 'Staking Pro', description: 'Earn $100 from staking', unlocked: false, reward: 100 },
    { id: 'challenge_master', name: 'Challenge Master', description: 'Complete 10 daily challenges', unlocked: false, reward: 300 }
  ],
  dailyChallenges: dailyChallenges,
  challengesCompleted: 0,
  currentView: 'dashboard',
  gameStarted: false,
  settings: {
    theme: 'dark',
    soundEnabled: true,
    notifications: true,
    autoSave: true,
    difficulty: 'normal'
  },
  marketSentiment: 'neutral', // bullish, bearish, neutral
  aiAssistant: {
    enabled: true,
    suggestions: [],
    lastUpdate: Date.now()
  }
};

// Technical indicators calculations
const calculateRSI = (prices, period = 14) => {
  if (prices.length < period) return 50;
  
  let gains = 0;
  let losses = 0;
  
  for (let i = 1; i < period + 1; i++) {
    const change = prices[i] - prices[i - 1];
    if (change > 0) gains += change;
    else losses -= change;
  }
  
  const avgGain = gains / period;
  const avgLoss = losses / period;
  const rs = avgGain / avgLoss;
  return 100 - (100 / (1 + rs));
};

const calculateMACD = (prices) => {
  if (prices.length < 26) return 0;
  
  const ema12 = prices.slice(-12).reduce((a, b) => a + b) / 12;
  const ema26 = prices.slice(-26).reduce((a, b) => a + b) / 26;
  return ema12 - ema26;
};

function gameReducer(state, action) {
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
      
      // Update market sentiment occasionally
      if (Math.random() < 0.05) {
        const sentiments = ['bullish', 'bearish', 'neutral'];
        newMarketSentiment = sentiments[Math.floor(Math.random() * sentiments.length)];
      }
      
      Object.keys(updatedCryptos).forEach(cryptoId => {
        const crypto = updatedCryptos[cryptoId];
        const volatility = crypto.volatility;
        
        // Market sentiment influence
        let sentimentInfluence = 0;
        if (newMarketSentiment === 'bullish') sentimentInfluence = 0.001;
        else if (newMarketSentiment === 'bearish') sentimentInfluence = -0.001;
        
        const randomChange = (Math.random() - 0.5) * 2 * volatility;
        const trendInfluence = crypto.trend * 0.001;
        const priceChange = randomChange + trendInfluence + sentimentInfluence;
        
        const newPrice = Math.max(crypto.price * (1 + priceChange), 0.000001);
        const change24h = ((newPrice - crypto.price) / crypto.price) * 100;
        
        const newHistory = [...crypto.history.slice(-50), { price: newPrice, timestamp: Date.now() }];
        const prices = newHistory.map(h => h.price);
        
        updatedCryptos[cryptoId] = {
          ...crypto,
          price: newPrice,
          change24h: change24h,
          history: newHistory,
          rsi: calculateRSI(prices),
          macd: calculateMACD(prices),
          sentiment: change24h > 2 ? 'bullish' : change24h < -2 ? 'bearish' : 'neutral'
        };
      });
      
      // Calculate new total portfolio value
      let portfolioValue = 0;
      Object.keys(state.portfolio).forEach(cryptoId => {
        const holding = state.portfolio[cryptoId];
        const currentPrice = updatedCryptos[cryptoId].price;
        portfolioValue += holding.amount * currentPrice * holding.leverage;
      });
      
      // Add staked portfolio value
      let stakedValue = 0;
      Object.keys(state.stakedPortfolio).forEach(cryptoId => {
        const staked = state.stakedPortfolio[cryptoId];
        const currentPrice = updatedCryptos[cryptoId].price;
        stakedValue += staked.amount * currentPrice;
      });
      
      const totalValue = state.player.cash + portfolioValue + stakedValue;
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
    
    case 'BUY_CRYPTO':
      const { cryptoId, amount, price, leverage = 1 } = action.payload;
      const cost = amount * price * leverage * 1.001; // 0.1% fee
      
      if (cost > state.player.cash) {
        return state; // Not enough cash
      }
      
      const existingHolding = state.portfolio[cryptoId] || { amount: 0, avgBuyPrice: 0, leverage: 1 };
      const totalAmount = existingHolding.amount + amount;
      const totalCost = (existingHolding.amount * existingHolding.avgBuyPrice * existingHolding.leverage) + (amount * price * leverage);
      const avgBuyPrice = totalCost / (totalAmount * leverage);
      
      const newTransaction = {
        id: Date.now(),
        type: 'buy',
        cryptoId,
        amount,
        price,
        leverage,
        total: cost,
        timestamp: Date.now()
      };
      
      // Update daily challenge progress
      const updatedChallenges = state.dailyChallenges.map(challenge => {
        if (challenge.id === 'daily_trader' && !challenge.completed) {
          const newProgress = challenge.progress + 1;
          return { ...challenge, progress: newProgress, completed: newProgress >= challenge.target };
        }
        if (challenge.id === 'volume_trader' && !challenge.completed) {
          const newProgress = challenge.progress + cost;
          return { ...challenge, progress: newProgress, completed: newProgress >= challenge.target };
        }
        return challenge;
      });
      
      return {
        ...state,
        player: {
          ...state.player,
          cash: state.player.cash - cost,
          tradesCount: state.player.tradesCount + 1
        },
        portfolio: {
          ...state.portfolio,
          [cryptoId]: {
            amount: totalAmount,
            avgBuyPrice,
            leverage
          }
        },
        transactions: [newTransaction, ...state.transactions],
        dailyChallenges: updatedChallenges
      };
    
    case 'SELL_CRYPTO':
      const { cryptoId: sellCryptoId, amount: sellAmount, price: sellPrice } = action.payload;
      const holding = state.portfolio[sellCryptoId];
      
      if (!holding || sellAmount > holding.amount) {
        return state; // Not enough holdings
      }
      
      const revenue = sellAmount * sellPrice * holding.leverage * 0.999; // 0.1% fee
      const remainingAmount = holding.amount - sellAmount;
      
      const sellTransaction = {
        id: Date.now(),
        type: 'sell',
        cryptoId: sellCryptoId,
        amount: sellAmount,
        price: sellPrice,
        leverage: holding.leverage,
        total: revenue,
        timestamp: Date.now()
      };
      
      const newPortfolio = { ...state.portfolio };
      if (remainingAmount === 0) {
        delete newPortfolio[sellCryptoId];
      } else {
        newPortfolio[sellCryptoId] = {
          ...holding,
          amount: remainingAmount
        };
      }
      
      // Update daily challenge progress
      const updatedChallenges = state.dailyChallenges.map(challenge => {
        if (challenge.id === 'daily_trader' && !challenge.completed) {
          const newProgress = challenge.progress + 1;
          return { ...challenge, progress: newProgress, completed: newProgress >= challenge.target };
        }
        if (challenge.id === 'volume_trader' && !challenge.completed) {
          const newProgress = challenge.progress + revenue;
          return { ...challenge, progress: newProgress, completed: newProgress >= challenge.target };
        }
        return challenge;
      });
      
      return {
        ...state,
        player: {
          ...state.player,
          cash: state.player.cash + revenue,
          tradesCount: state.player.tradesCount + 1
        },
        portfolio: newPortfolio,
        transactions: [sellTransaction, ...state.transactions],
        dailyChallenges: updatedChallenges
      };
    
    case 'STAKE_CRYPTO':
      const { cryptoId: stakeCryptoId, amount: stakeAmount } = action.payload;
      const stakeHolding = state.portfolio[stakeCryptoId];
      
      if (!stakeHolding || stakeAmount > stakeHolding.amount) {
        return state;
      }
      
      const remainingHolding = stakeHolding.amount - stakeAmount;
      const newPortfolio = { ...state.portfolio };
      
      if (remainingHolding === 0) {
        delete newPortfolio[stakeCryptoId];
      } else {
        newPortfolio[stakeCryptoId] = {
          ...stakeHolding,
          amount: remainingHolding
        };
      }
      
      const existingStaked = state.stakedPortfolio[stakeCryptoId] || { amount: 0, startTime: Date.now() };
      
      return {
        ...state,
        portfolio: newPortfolio,
        stakedPortfolio: {
          ...state.stakedPortfolio,
          [stakeCryptoId]: {
            amount: existingStaked.amount + stakeAmount,
            startTime: existingStaked.startTime || Date.now()
          }
        }
      };
    
    case 'UNSTAKE_CRYPTO':
      const { cryptoId: unstakeCryptoId, amount: unstakeAmount } = action.payload;
      const stakedHolding = state.stakedPortfolio[unstakeCryptoId];
      
      if (!stakedHolding || unstakeAmount > stakedHolding.amount) {
        return state;
      }
      
      const remainingStaked = stakedHolding.amount - unstakeAmount;
      const newStakedPortfolio = { ...state.stakedPortfolio };
      
      if (remainingStaked === 0) {
        delete newStakedPortfolio[unstakeCryptoId];
      } else {
        newStakedPortfolio[unstakeCryptoId] = {
          ...stakedHolding,
          amount: remainingStaked
        };
      }
      
      const existingPortfolio = state.portfolio[unstakeCryptoId] || { amount: 0, avgBuyPrice: 0, leverage: 1 };
      
      return {
        ...state,
        stakedPortfolio: newStakedPortfolio,
        portfolio: {
          ...state.portfolio,
          [unstakeCryptoId]: {
            ...existingPortfolio,
            amount: existingPortfolio.amount + unstakeAmount
          }
        }
      };
    
    case 'CLAIM_STAKING_REWARDS':
      let totalRewards = 0;
      Object.keys(state.stakedPortfolio).forEach(cryptoId => {
        const staked = state.stakedPortfolio[cryptoId];
        const crypto = state.cryptos[cryptoId];
        const timeStaked = (Date.now() - staked.startTime) / (1000 * 60 * 60 * 24 * 365); // years
        const reward = staked.amount * crypto.price * crypto.stakingReward * timeStaked;
        totalRewards += reward;
      });
      
      return {
        ...state,
        player: {
          ...state.player,
          cash: state.player.cash + totalRewards,
          stakingRewards: state.player.stakingRewards + totalRewards
        },
        stakedPortfolio: Object.keys(state.stakedPortfolio).reduce((acc, cryptoId) => {
          acc[cryptoId] = {
            ...state.stakedPortfolio[cryptoId],
            startTime: Date.now()
          };
          return acc;
        }, {})
      };
    
    case 'ADD_NEWS':
      return {
        ...state,
        news: [action.payload, ...state.news.slice(0, 9)]
      };
    
    case 'UNLOCK_ACHIEVEMENT':
      const updatedAchievements = state.achievements.map(achievement =>
        achievement.id === action.payload
          ? { ...achievement, unlocked: true }
          : achievement
      );
      
      const unlockedAchievement = state.achievements.find(a => a.id === action.payload);
      const reward = unlockedAchievement ? unlockedAchievement.reward : 0;
      
      return {
        ...state,
        achievements: updatedAchievements,
        player: {
          ...state.player,
          cash: state.player.cash + reward,
          experience: state.player.experience + reward
        }
      };
    
    case 'COMPLETE_CHALLENGE':
      const completedChallenge = state.dailyChallenges.find(c => c.id === action.payload);
      if (!completedChallenge || completedChallenge.completed) return state;
      
      const updatedDailyChallenges = state.dailyChallenges.map(challenge =>
        challenge.id === action.payload
          ? { ...challenge, completed: true }
          : challenge
      );
      
      return {
        ...state,
        dailyChallenges: updatedDailyChallenges,
        challengesCompleted: state.challengesCompleted + 1,
        player: {
          ...state.player,
          cash: state.player.cash + completedChallenge.reward,
          experience: state.player.experience + completedChallenge.reward
        }
      };
    
    case 'RESET_DAILY_CHALLENGES':
      const resetChallenges = dailyChallenges.map(challenge => ({
        ...challenge,
        progress: 0,
        completed: false
      }));
      
      return {
        ...state,
        dailyChallenges: resetChallenges,
        player: {
          ...state.player,
          lastLoginDate: new Date().toDateString(),
          dailyProfitToday: 0
        }
      };
    
    case 'LOAD_GAME':
      return { ...action.payload, gameStarted: true };
    
    default:
      return state;
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Price update interval
  useEffect(() => {
    if (!state.gameStarted) return;
    
    const interval = setInterval(() => {
      dispatch({ type: 'UPDATE_CRYPTO_PRICES' });
    }, 2000); // Update every 2 seconds for more dynamic feel

    return () => clearInterval(interval);
  }, [state.gameStarted]);

  // Staking rewards calculation
  useEffect(() => {
    if (!state.gameStarted) return;
    
    const stakingInterval = setInterval(() => {
      if (Object.keys(state.stakedPortfolio).length > 0) {
        dispatch({ type: 'CLAIM_STAKING_REWARDS' });
      }
    }, 60000); // Every minute

    return () => clearInterval(stakingInterval);
  }, [state.gameStarted, state.stakedPortfolio]);

  // Daily challenge reset
  useEffect(() => {
    const today = new Date().toDateString();
    if (state.player.lastLoginDate !== today) {
      dispatch({ type: 'RESET_DAILY_CHALLENGES' });
    }
  }, [state.player.lastLoginDate]);

  // Enhanced market events
  useEffect(() => {
    if (!state.gameStarted) return;
    
    const eventInterval = setInterval(() => {
      const events = [
        { title: "🚀 Bitcoin ETF Approved by SEC!", impact: "positive", cryptos: ["BTC"], sentiment: "bullish" },
        { title: "⚠️ Major Exchange Security Breach", impact: "negative", cryptos: ["BTC", "ETH"], sentiment: "bearish" },
        { title: "🐕 Elon Musk Tweets Doge Meme", impact: "positive", cryptos: ["DOGE"], sentiment: "bullish" },
        { title: "🔥 Ethereum 2.0 Staking Rewards Increased", impact: "positive", cryptos: ["ETH"], sentiment: "bullish" },
        { title: "📉 China Bans Crypto Mining Again", impact: "negative", cryptos: ["BTC", "ETH", "ADA"], sentiment: "bearish" },
        { title: "🌐 Solana Network Upgrade Complete", impact: "positive", cryptos: ["SOL"], sentiment: "bullish" },
        { title: "🏦 JPMorgan Adopts Polygon for Payments", impact: "positive", cryptos: ["MATIC"], sentiment: "bullish" },
        { title: "🔗 Chainlink Partners with Google Cloud", impact: "positive", cryptos: ["LINK"], sentiment: "bullish" },
        { title: "💎 Institutional Investors Buy the Dip", impact: "positive", cryptos: ["BTC", "ETH"], sentiment: "bullish" },
        { title: "📊 Crypto Market Cap Hits New ATH", impact: "positive", cryptos: ["BTC", "ETH", "ADA", "SOL"], sentiment: "bullish" }
      ];
      
      if (Math.random() < 0.08) { // 8% chance every interval
        const event = events[Math.floor(Math.random() * events.length)];
        dispatch({ type: 'ADD_NEWS', payload: { ...event, timestamp: Date.now() } });
      }
    }, 8000); // Check every 8 seconds

    return () => clearInterval(eventInterval);
  }, [state.gameStarted]);

  // Achievement checking with enhanced logic
  useEffect(() => {
    // Check for first trade
    if (state.transactions.length > 0 && !state.achievements.find(a => a.id === 'first_trade').unlocked) {
      dispatch({ type: 'UNLOCK_ACHIEVEMENT', payload: 'first_trade' });
    }
    
    // Check for profit achievements
    if (state.player.totalProfit >= 1000 && !state.achievements.find(a => a.id === 'profit_1k').unlocked) {
      dispatch({ type: 'UNLOCK_ACHIEVEMENT', payload: 'profit_1k' });
    }
    
    // Check for portfolio value achievements
    if (state.player.totalValue >= 25000 && !state.achievements.find(a => a.id === 'portfolio_25k').unlocked) {
      dispatch({ type: 'UNLOCK_ACHIEVEMENT', payload: 'portfolio_25k' });
    }
    
    if (state.player.totalValue >= 100000 && !state.achievements.find(a => a.id === 'whale').unlocked) {
      dispatch({ type: 'UNLOCK_ACHIEVEMENT', payload: 'whale' });
    }
    
    // Check for day trader achievement
    if (state.transactions.length >= 10 && !state.achievements.find(a => a.id === 'day_trader').unlocked) {
      dispatch({ type: 'UNLOCK_ACHIEVEMENT', payload: 'day_trader' });
    }
    
    // Check for leverage achievement
    const leverageTrades = state.transactions.filter(t => t.leverage > 1);
    if (leverageTrades.length > 0 && !state.achievements.find(a => a.id === 'leverage_master').unlocked) {
      dispatch({ type: 'UNLOCK_ACHIEVEMENT', payload: 'leverage_master' });
    }
    
    // Check for staking achievement
    if (state.player.stakingRewards >= 100 && !state.achievements.find(a => a.id === 'staking_pro').unlocked) {
      dispatch({ type: 'UNLOCK_ACHIEVEMENT', payload: 'staking_pro' });
    }
    
    // Check for challenge master achievement
    if (state.challengesCompleted >= 10 && !state.achievements.find(a => a.id === 'challenge_master').unlocked) {
      dispatch({ type: 'UNLOCK_ACHIEVEMENT', payload: 'challenge_master' });
    }
  }, [state.transactions, state.player.totalProfit, state.player.totalValue, state.achievements, state.player.stakingRewards, state.challengesCompleted]);

  // Auto-complete daily challenges
  useEffect(() => {
    state.dailyChallenges.forEach(challenge => {
      if (!challenge.completed && challenge.progress >= challenge.target) {
        dispatch({ type: 'COMPLETE_CHALLENGE', payload: challenge.id });
      }
    });
  }, [state.dailyChallenges]);

  // Save game state to localStorage
  useEffect(() => {
    if (state.gameStarted && state.settings.autoSave) {
      localStorage.setItem('cryptoTycoonSave', JSON.stringify(state));
    }
  }, [state, state.settings.autoSave]);

  // Load game state from localStorage
  useEffect(() => {
    const savedGame = localStorage.getItem('cryptoTycoonSave');
    if (savedGame) {
      try {
        const parsedGame = JSON.parse(savedGame);
        dispatch({ type: 'LOAD_GAME', payload: parsedGame });
      } catch (error) {
        console.error('Failed to load saved game:', error);
      }
    }
  }, []);

  const value = {
    state,
    dispatch,
    buyCrypto: (cryptoId, amount, leverage = 1) => {
      const price = state.cryptos[cryptoId].price;
      dispatch({ type: 'BUY_CRYPTO', payload: { cryptoId, amount, price, leverage } });
    },
    sellCrypto: (cryptoId, amount) => {
      const price = state.cryptos[cryptoId].price;
      dispatch({ type: 'SELL_CRYPTO', payload: { cryptoId, amount, price } });
    },
    stakeCrypto: (cryptoId, amount) => {
      dispatch({ type: 'STAKE_CRYPTO', payload: { cryptoId, amount } });
    },
    unstakeCrypto: (cryptoId, amount) => {
      dispatch({ type: 'UNSTAKE_CRYPTO', payload: { cryptoId, amount } });
    },
    setView: (view) => dispatch({ type: 'SET_VIEW', payload: view }),
    startGame: () => dispatch({ type: 'START_GAME' }),
    updateSettings: (settings) => dispatch({ type: 'UPDATE_SETTINGS', payload: settings })
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