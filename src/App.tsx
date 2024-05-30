import { useQuery } from "@tanstack/react-query";
import { Chain, CovalentClient } from "@covalenthq/client-sdk";
import TokenTable from "./Components/TokenTable"; // Import the TokenTable component
import { useAccount } from "wagmi";
import Loading from "./Components/Loading";
import Chat from "./Components/Chat/Chat";
import { useChatHook } from "./Components/Chat";
import { useEffect } from "react";

const isDevMode = import.meta.env.DEV;
const networks = isDevMode
  ? ["eth-mainnet"]
  : ["eth-mainnet", "matic-mainnet", "arbitrum-mainnet", "base-mainnet"];
const client = new CovalentClient(import.meta.env.VITE_COVALENT_API_KEY);

const fetchTodayTokenBalances = async (address: string) => {
  const allData = [];

  for (const network of networks) {
    try {
      const resp = await client.BalanceService.getTokenBalancesForWalletAddress(
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

const fetchPortfolioHistory = async (address: string) => {
  const allData = [];

  for (const network of networks) {
    try {
      const resp =
        await client.BalanceService.getHistoricalPortfolioForWalletAddress(
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

function bigIntReplacer(key, value) {
  if (typeof value === 'bigint') {
    return value.toString();
  }
  return value;
}

const App = () => {
  const { address } = useAccount();
  const chatProvider = useChatHook();
  const {
    data: tokenBalances,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["tokenBalances", address],
    queryFn: () => fetchTodayTokenBalances(address as string),
    enabled: !!address,
    staleTime: 1000 * 60 * 60,
  });
  const { data: portfolioHistory } = useQuery({
    queryKey: ["portfolioHistory", address],
    queryFn: () => fetchPortfolioHistory(address as string),
    enabled: !!address,
    staleTime: 1000 * 60 * 60,
  });
  if (portfolioHistory) console.log(portfolioHistory);

  useEffect(() => {
    chatProvider.onCreateChat?.(chatProvider.DefaultPersonas[0]) // TODO : set personas
    if (!tokenBalances) return;
    chatProvider.sendMessage(`Here is my portfolio details, do a wallet analysis and suggest some trades : ${JSON.stringify(
          tokenBalances,
          bigIntReplacer)}`);
  }, [tokenBalances]);

  if (isLoading) return <Loading />;
  if (isError) return <div className="text-red-500">Error fetching data</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Trading Bro</h1>
      {!address && (
        <p className="read-the-docs mb-4">
          Connect your wallet to see your token balances.
        </p>
      )}
      <w3m-button />
      {tokenBalances && address && tokenBalances.length > 0 && (
        <>
          <Chat ref={chatProvider.chatRef} />
          <TokenTable
            data={tokenBalances.map((item) => ({
              ...item,
              items: item.items.map((balanceItem) => ({
                ...balanceItem,
                balance:
                  balanceItem.balance !== null
                    ? BigInt(balanceItem.balance)
                    : BigInt(0),
              })),
            }))}
          />
        </>
      )}
    </div>
  );
};

export default App;
