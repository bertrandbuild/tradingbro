import TokenTable from "./Components/TokenTable"; // Import the TokenTable component
import { useAccount } from "wagmi";
import Loading from "./Components/Loading";
import Chat from "./Components/Chat/Chat";
import { useChatHook } from "./Components/Chat";
import { useEffect } from "react";
import { useTokenBalances } from "./hooks/api";
import { Markdown } from "./Components/Markdown";

function bigIntReplacer(key, value) {
  if (typeof value === 'bigint') {
    return value.toString();
  }
  return value;
}

const App = () => {
  const { address } = useAccount();
  const chatProvider = useChatHook();
  const { data: tokenBalances, isError, isLoading } = useTokenBalances(address || "");

  useEffect(() => {
    chatProvider.onCreateChat?.(chatProvider.DefaultPersonas[0]) // TODO : set personas
    if (!tokenBalances) return;
    chatProvider.sendMessage(`Here is my portfolio details, do a very short wallet analysis and suggest me at least two or three trades to optimize my portfolio.
    Use the following syntax to suggest a trade : [SQUID: fromChain: "<the chain name>", fromAmount: "<suggested amount in gwei or similar>", fromToken: "<the 'from' token symbol>", toChain: "<the chain name>", toToken: "<the 'to' token symbol>"]
    
    Important rules to follow:
      - If there is no balance in the portfolio, suggest this hypothetical tx : [...] as an example, you could buy some Eth : [SQUID: fromChain: "ethereum", fromAmount: "10000000000000000", fromToken: "USDC", toChain: "ethereum", toToken: "eth"].
      - Prefer trades that stay on the same chain to save on cross-chain fees, unless there's a significant advantage to moving across chains.
      - Always return the [SQUID:...] syntax with an explanation a suggestion in your message.
      - Always return the [SQUID:...] syntax as a new line but NEVER inside a code block.

    Portfolio details : ${JSON.stringify(
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
