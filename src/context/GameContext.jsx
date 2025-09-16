import React, { createContext, useContext, useReducer, useEffect } from 'react';

const GameContext = createContext();

// Initial crypto data with realistic starting prices
const initialCryptos = {
  BTC: {
    id: 'BTC',
    name: 'Bitcoin',
    symbol: 'BTC',
    price: 45000,
    change24h: 0,
    volatility: 0.02, // 2% volatility
    trend: 0,
    history: [],
    color: '#f7931a'
  },
  ETH: {
    id: 'ETH',
    name: 'Ethereum',
    symbol: 'ETH',
    price: 3200,
    change24h: 0,
    volatility: 0.03, // 3% volatility
    trend: 0,
    history: [],
    color: '#627eea'
  },
  DOGE: {
    id: 'DOGE',
    name: 'Dogecoin',
    symbol: 'DOGE',
    price: 0.08,
    change24h: 0,
    volatility: 0.08, // 8% volatility (meme coin)
    trend: 0,
    history: [],
    color: '#c2a633'
  },
  ADA: {
    id: 'ADA',
    name: 'Cardano',
    symbol: 'ADA',
    price: 0.45,
    change24h: 0,
    volatility: 0.04, // 4% volatility
    trend: 0,
    history: [],
    color: '#0033ad'
  },
  SOL: {
    id: 'SOL',
    name: 'Solana',
    symbol: 'SOL',
    price: 95,
    change24h: 0,
    volatility: 0.06, // 6% volatility
    trend: 0,
    history: [],
    color: '#9945ff'
  },
  SHIB: {
    id: 'SHIB',
    name: 'Shiba Inu',
    symbol: 'SHIB',
    price: 0.000025,
    change24h: 0,
    volatility: 0.12, // 12% volatility (extreme)
    trend: 0,
    history: [],
    color: '#ffa409'
  },
  MATIC: {
    id: 'MATIC',
    name: 'Polygon',
    symbol: 'MATIC',
    price: 0.85,
    change24h: 0,
    volatility: 0.05, // 5% volatility
    trend: 0,
    history: [],
    color: '#8247e5'
  },
  LINK: {
    id: 'LINK',
    name: 'Chainlink',
    symbol: 'LINK',
    price: 15.50,
    change24h: 0,
    volatility: 0.04, // 4% volatility
    trend: 0,
    history: [],
    color: '#375bd2'
  }
};

const initialState = {
  player: {
    cash: 10000,
    totalValue: 10000,
    startingCash: 10000,
    totalProfit: 0,
    totalProfitPercent: 0
  },
  portfolio: {},
  cryptos: initialCryptos,
  transactions: [],
  news: [],
  achievements: [
    { id: 'first_trade', name: 'First Trade', description: 'Make your first trade', unlocked: false },
    { id: 'profit_1k', name: 'Profit Maker', description: 'Make $1,000 profit', unlocked: false },
    { id: 'portfolio_25k', name: 'Growing Portfolio', description: 'Reach $25,000 total value', unlocked: false },
    { id: 'hodler', name: 'Diamond Hands', description: 'Hold a position for 5 minutes', unlocked: false },
    { id: 'day_trader', name: 'Day Trader', description: 'Make 10 trades in one session', unlocked: false },
    { id: 'whale', name: 'Crypto Whale', description: 'Reach $100,000 total value', unlocked: false }
  ],
  currentView: 'dashboard',
  gameStarted: false
};

function gameReducer(state, action) {
  switch (action.type) {
    case 'START_GAME':
      return { ...state, gameStarted: true };
    
    case 'SET_VIEW':
      return { ...state, currentView: action.payload };
    
    case 'UPDATE_CRYPTO_PRICES':
      const updatedCryptos = { ...state.cryptos };
      Object.keys(updatedCryptos).forEach(cryptoId => {
        const crypto = updatedCryptos[cryptoId];
        const volatility = crypto.volatility;
        const randomChange = (Math.random() - 0.5) * 2 * volatility;
        const trendInfluence = crypto.trend * 0.001;
        const priceChange = randomChange + trendInfluence;
        
        const newPrice = Math.max(crypto.price * (1 + priceChange), 0.000001);
        const change24h = ((newPrice - crypto.price) / crypto.price) * 100;
        
        updatedCryptos[cryptoId] = {
          ...crypto,
          price: newPrice,
          change24h: change24h,
          history: [...crypto.history.slice(-50), { price: newPrice, timestamp: Date.now() }]
        };
      });
      
      // Calculate new total portfolio value
      let portfolioValue = 0;
      Object.keys(state.portfolio).forEach(cryptoId => {
        const holding = state.portfolio[cryptoId];
        const currentPrice = updatedCryptos[cryptoId].price;
        portfolioValue += holding.amount * currentPrice;
      });
      
      const totalValue = state.player.cash + portfolioValue;
      const totalProfit = totalValue - state.player.startingCash;
      const totalProfitPercent = (totalProfit / state.player.startingCash) * 100;
      
      return {
        ...state,
        cryptos: updatedCryptos,
        player: {
          ...state.player,
          totalValue,
          totalProfit,
          totalProfitPercent
        }
      };
    
    case 'BUY_CRYPTO':
      const { cryptoId, amount, price } = action.payload;
      const cost = amount * price * 1.001; // 0.1% fee
      
      if (cost > state.player.cash) {
        return state; // Not enough cash
      }
      
      const existingHolding = state.portfolio[cryptoId] || { amount: 0, avgBuyPrice: 0 };
      const totalAmount = existingHolding.amount + amount;
      const totalCost = (existingHolding.amount * existingHolding.avgBuyPrice) + (amount * price);
      const avgBuyPrice = totalCost / totalAmount;
      
      const newTransaction = {
        id: Date.now(),
        type: 'buy',
        cryptoId,
        amount,
        price,
        total: cost,
        timestamp: Date.now()
      };
      
      return {
        ...state,
        player: {
          ...state.player,
          cash: state.player.cash - cost
        },
        portfolio: {
          ...state.portfolio,
          [cryptoId]: {
            amount: totalAmount,
            avgBuyPrice
          }
        },
        transactions: [newTransaction, ...state.transactions]
      };
    
    case 'SELL_CRYPTO':
      const { cryptoId: sellCryptoId, amount: sellAmount, price: sellPrice } = action.payload;
      const holding = state.portfolio[sellCryptoId];
      
      if (!holding || sellAmount > holding.amount) {
        return state; // Not enough holdings
      }
      
      const revenue = sellAmount * sellPrice * 0.999; // 0.1% fee
      const remainingAmount = holding.amount - sellAmount;
      
      const sellTransaction = {
        id: Date.now(),
        type: 'sell',
        cryptoId: sellCryptoId,
        amount: sellAmount,
        price: sellPrice,
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
      
      return {
        ...state,
        player: {
          ...state.player,
          cash: state.player.cash + revenue
        },
        portfolio: newPortfolio,
        transactions: [sellTransaction, ...state.transactions]
      };
    
    case 'ADD_NEWS':
      return {
        ...state,
        news: [action.payload, ...state.news.slice(0, 9)] // Keep last 10 news items
      };
    
    case 'UNLOCK_ACHIEVEMENT':
      const updatedAchievements = state.achievements.map(achievement =>
        achievement.id === action.payload
          ? { ...achievement, unlocked: true }
          : achievement
      );
      return {
        ...state,
        achievements: updatedAchievements
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
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, [state.gameStarted]);

  // Market events
  useEffect(() => {
    if (!state.gameStarted) return;
    
    const eventInterval = setInterval(() => {
      const events = [
        { title: "Bitcoin ETF Approved!", impact: "positive", cryptos: ["BTC"] },
        { title: "Major Exchange Hacked", impact: "negative", cryptos: ["BTC", "ETH"] },
        { title: "Elon Musk Tweets About Dogecoin", impact: "positive", cryptos: ["DOGE"] },
        { title: "Ethereum 2.0 Update Released", impact: "positive", cryptos: ["ETH"] },
        { title: "Regulatory Concerns in Asia", impact: "negative", cryptos: ["BTC", "ETH", "ADA"] },
        { title: "Solana Network Congestion", impact: "negative", cryptos: ["SOL"] },
        { title: "Polygon Partners with Major Bank", impact: "positive", cryptos: ["MATIC"] },
        { title: "Chainlink Oracle Adoption Grows", impact: "positive", cryptos: ["LINK"] }
      ];
      
      if (Math.random() < 0.1) { // 10% chance every interval
        const event = events[Math.floor(Math.random() * events.length)];
        dispatch({ type: 'ADD_NEWS', payload: { ...event, timestamp: Date.now() } });
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(eventInterval);
  }, [state.gameStarted]);

  // Achievement checking
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
  }, [state.transactions, state.player.totalProfit, state.player.totalValue, state.achievements]);

  // Save game state to localStorage
  useEffect(() => {
    if (state.gameStarted) {
      localStorage.setItem('cryptoTycoonSave', JSON.stringify(state));
    }
  }, [state]);

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
    buyCrypto: (cryptoId, amount) => {
      const price = state.cryptos[cryptoId].price;
      dispatch({ type: 'BUY_CRYPTO', payload: { cryptoId, amount, price } });
    },
    sellCrypto: (cryptoId, amount) => {
      const price = state.cryptos[cryptoId].price;
      dispatch({ type: 'SELL_CRYPTO', payload: { cryptoId, amount, price } });
    },
    setView: (view) => dispatch({ type: 'SET_VIEW', payload: view }),
    startGame: () => dispatch({ type: 'START_GAME' })
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