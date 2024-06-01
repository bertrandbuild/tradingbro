import { Chain, CovalentClient } from "@covalenthq/client-sdk";
import { useQuery } from "@tanstack/react-query";
import Fuse from "fuse.js";

// const isDevMode = import.meta.env.DEV;
const isDevMode = true;
export const networks = isDevMode
  ? ["eth-mainnet"]
  : ["eth-mainnet", "matic-mainnet", "arbitrum-mainnet", "base-mainnet"];
const client = new CovalentClient(import.meta.env.VITE_COVALENT_API_KEY);

export const fetchTodayTokenBalances = async (address: string) => {
  const allData = [];

  for (const network of networks) {
    try {
      const resp = await client.BalanceService.getTokenBalancesForWalletAddress(
        network as Chain,
        address,
        { "nft": false, "noSpam": true }
      );
      allData.push({ ...resp.data, chain_name: network });
    } catch (error) {
      console.error(`Failed to fetch data for network ${network}:`, error);
    }
  }

  return allData;
};

export const fetchPortfolioHistory = async (address: string) => {
  const allData = [];

  for (const network of networks) {
    try {
      const resp = await client.BalanceService.getHistoricalPortfolioForWalletAddress(
        network as Chain,
        address
      );
      allData.push({ ...resp.data, chain_name: network });
    } catch (error) {
      console.error(`Failed to fetch data for network ${network}:`, error);
    }
  }

  return allData;
};

export const fetchChainList = async (): Promise<Fuse<unknown>> => {
  try {
    const response = await fetch('https://api.0xsquid.com/v1/chains');
    const allChains = (await response.json()).chains;

    const fuseOptions = {
      keys: [
        { name: 'tags', weight: 1 },
        { name: 'chainName', weight: 0.5 },
        { name: 'networkName', weight: 0.5 },
      ],
    };
    const fusedChains = new Fuse(allChains, fuseOptions);
    console.log(fusedChains);
    return fusedChains;
  } catch (error) {
    console.error('Error fetching chain data:', error);
    throw error;
  }
};

export const fetchTokenList = async (chainId?: string | number) => {
  try {
    const response = await fetch(
      chainId ? `https://api.0xsquid.com/v1/tokens?chainId=${chainId}` : 'https://api.0xsquid.com/v1/tokens'
    );
    const allTokens = (await response.json()).tokens;
    const fuseOptions = {
      keys: [
        { name: 'symbol', weight: 1 },
        { name: 'name', weight: 0.8 },
        { name: 'coingecko-id', weight: 0.5 },
        { name: 'chainId', weight: 0.2 },
      ],
    };
    const fusedTokens = new Fuse(allTokens, fuseOptions);
    return fusedTokens;
  } catch (error) {
    console.error('Error fetching token data:', error);
    throw error;
  }
};

// Query hooks

export const useTokenBalances = (address: string) => {
  return useQuery({
    queryKey: ["tokenBalances", address],
    queryFn: () => fetchTodayTokenBalances(address),
    enabled: !!address,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

export const usePortfolioHistory = (address: string) => {
  return useQuery({
    queryKey: ["portfolioHistory", address],
    queryFn: () => fetchPortfolioHistory(address),
    enabled: !!address,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

export const useChainList = () => {
  return useQuery({
    queryKey: ["chainList"],
    queryFn: fetchChainList,
    staleTime: 1000 * 60 * 60 * 24 * 60, // 60 days
  });
};

export const useTokenList = (chainId?: string | number) => {
  return useQuery({
    queryKey: ["tokenList", chainId],
    queryFn: () => fetchTokenList(chainId),
    staleTime: 1000 * 60 * 60 * 24 * 60, // 60 days
  });
};
