import { useQuery } from '@tanstack/react-query';
import { Chain, CovalentClient } from "@covalenthq/client-sdk";
import TokenTable from './Components/TokenTable'; // Import the TokenTable component
import { useAccount } from 'wagmi';
// import Loading from './Loading'; // Import the Loading component

const networks = ["eth-mainnet", "matic-mainnet", "arbitrum-mainnet", "base-mainnet"];

const fetchTokenBalances = async (address: string) => {
  const client = new CovalentClient(import.meta.env.VITE_COVALENT_API_KEY);
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

const App = () => {
  const { address } = useAccount();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["tokenBalances"],
    queryFn: () => (address ? fetchTokenBalances(address) : undefined),
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div className="text-red-500">Error fetching data</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Trading Bro</h1>
      {!address && (
        <p className="read-the-docs">
          Connect your wallet to see your token balances.
        </p>
      )}
      <w3m-button />
      {data && data.length > 0 && (
        <TokenTable
          data={data.map((item) => ({
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
      )}
    </div>
  );
};

export default App;
