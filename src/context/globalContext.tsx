import { createContext } from "react";

const defaultContext = {
  assetManagers: [
    {
      assetManagerName: "TradeWithSatoshi",
      assetManagerDescription: "Meet Satoshi, known as 'The cutting edge', a legendary Shinobi trader from Japan, famous for his spying techniques and bold market moves.",
      image: "https://assets.zootools.co/users/PiL0Turm2GbFgCcZ1NYn/assets/zfiCjupkCEd20jc",
      favoriteTokens: "btc, eth, aave, matic, link",
      notRecommendedTokens: "doge and other meme coins",
      strategies: [
        {
          name: "Conservative Allocation",
          risk_profile: "Low",
          strategyDetails: "Conservative approach to cryptocurrencies, mostly composed of bitcoin with a small exposition to ethereum and a portion in stablecoin to reduce volatility.",
          portfolio: {
            assets: [
              {
                symbol: "BTC",
                name: "Bitcoin",
                allocation_percentage: 70,
              },
              {
                symbol: "ETH",
                name: "Ethereum",
                allocation_percentage: 20,
              },
              {
                symbol: "USDC",
                name: "USD Coin",
                allocation_percentage: 10,
              },
            ],
          },
        },
        {
          name: "Balanced Allocation",
          risk_profile: "Moderate",
          strategyDetails: "Balances exposure between Bitcoin's stability, Ethereum's growth potential in DeFi, and specialized technology risk with Chainlink's role in decentralized oracles.",
          portfolio: {
            assets: [
              {
                symbol: "BTC",
                name: "Bitcoin",
                allocation_percentage: 50,
              },
              { symbol: "ETH", name: "Ethereum", allocation_percentage: 30 },
              {
                symbol: "LINK",
                name: "Chainlink",
                allocation_percentage: 20,
              },
            ],
          },
        },
        {
          name: "Aggressive Allocation",
          risk_profile: "High",
          strategyDetails: "Focuses on high-growth cryptocurrencies with innovative technology and strong ecosystem support. Emphasizes potential for rapid growth but acknowledges increased volatility and project-specific risks.",
          portfolio: {
            assets: [
              {
                symbol: "ETH",
                name: "Ethereum",
                allocation_percentage: 50,
              },
              {
                symbol: "SOL",
                name: "Solana",
                allocation_percentage: 30,
              },
              {
                symbol: "MATIC",
                name: "Polygon",
                allocation_percentage: 20,
              },
            ],
          },
        },
      ],
    },
  ],
};

export const GlobalContext = createContext(defaultContext);
