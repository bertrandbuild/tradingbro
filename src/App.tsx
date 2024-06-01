import TokenTable from "./Components/TokenTable"; // Import the TokenTable component
import { useAccount } from "wagmi";
import Loading from "./Components/Loading";
import Chat from "./Components/Chat/Chat";
import { useChatHook } from "./Components/Chat";
import { useEffect } from "react";
import { useTokenBalances } from "./hooks/api";
import "./app.scss";

function bigIntReplacer(key, value) {
  if (typeof value === "bigint") {
    return value.toString();
  }
  return value;
}

const App = () => {
  const { address } = useAccount();
  const chatProvider = useChatHook();
  const {
    data: tokenBalances,
    isError,
    isLoading,
  } = useTokenBalances(address || "");

  useEffect(() => {
    chatProvider.onCreateChat?.(chatProvider.DefaultPersonas[0]); // TODO : set personas
    if (!tokenBalances) return;
    chatProvider.sendMessage(`Here is my portfolio details, do a very short wallet analysis and suggest me at least two or three trades to optimize my portfolio.
    Use the following syntax to suggest a trade : [SQUID: fromChain: "<the chain name>", fromAmount: "<suggested amount in gwei or similar>", fromToken: "<the 'from' token symbol>", toChain: "<the chain name>", toToken: "<the 'to' token symbol>"]
    
    Important rules to follow:
      - If there is no balance in the portfolio, suggest this hypothetical tx : [...] as an example, you could buy some Eth : [SQUID: fromChain: "ethereum", fromAmount: "10000000000000000", fromToken: "USDC", toChain: "ethereum", toToken: "eth"].
      - Prefer trades that stay on the same chain to save on cross-chain fees, unless there's a significant advantage to moving across chains.
      - Always return the [SQUID:...] syntax with an explanation a suggestion in your message.
      - Always return the [SQUID:...] syntax as a new line but NEVER inside a code block.

    Portfolio details : ${JSON.stringify(tokenBalances, bigIntReplacer)}`);
  }, [tokenBalances]);

  if (isLoading) return <Loading />;
  if (isError) return <div className="text-red-500">Error fetching data</div>;

  return (
    <div className="container mx-auto p-4">
      <header className="flex justify-between items-center my-4">
        <h1 className="text-2xl font-bold">The Analyst</h1>
        <label className="swap swap-rotate">
          <input type="checkbox" className="theme-controller" value="retro" />
          <svg className="swap-off fill-current w-10 h-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"/></svg>
          <svg className="swap-on fill-current w-10 h-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z"/></svg>
        </label>
      </header>
      {!address && (
        <section>
          <div className="avatar">
            <div className="rounded-full w-96">
              <img src="https://i.ibb.co/S7nPFkJ/3beeec2e-2069-4ad1-8de4-2671a9c9c8f5.jpg" />
            </div>
          </div>
          <div className="text-center mt-8">
            <p className="prose mb-4 m-auto lg:prose-xl">Meet <strong>Archie "Ace" Thompson</strong>, a legendary trader from the 1920s, <br />known for his bold market moves and sharp instincts.
            <br /><br />Connect to receive a custom analysis of your portfolio.</p>
            <div className="connect-button">
            <w3m-button/>
            </div>
          </div>
        </section>
      )}
      {tokenBalances && address && tokenBalances.length > 0 && (
        <>
          <w3m-button />
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
      <footer className="flex justify-between items-center mt-8">
        <p className="prose-sm text-gray-500">
          <a href="https://x.com/bertrandbuild" target="_blank" rel="noreferrer">
          By <span className="hover:underline">Bertrand</span>
          </a>
          {' '}- With {' '}
          <a href="https://www.galadriel.com/" target="_blank" rel="noreferrer">
            <span className="hover:underline">Galadriel AI</span>
          </a>
          {' '}and{' '}
          <a href="https://www.squidrouter.com/" target="_blank" rel="noreferrer">
            <span className="hover:underline">SquidRouter</span>
          </a>
        </p>
      </footer>
    </div>
  );
};

export default App;
