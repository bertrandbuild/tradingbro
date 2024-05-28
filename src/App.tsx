import "@covalenthq/goldrush-kit/styles.css";

import { useAccount } from "wagmi";

import { TokenBalancesList } from "@covalenthq/goldrush-kit";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const { address } = useAccount();
  if (address) console.log(address);

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
      </div>
      <h1>Trading bro</h1>
      {!address && (
        <p className="read-the-docs">
          Connect your wallet to see your token balances.
        </p>
      )}
      <w3m-button />
      {address && (
        <TokenBalancesList
          chain_names={[
            "eth-mainnet",
            "matic-mainnet",
            "bsc-mainnet",
            "avalanche-mainnet",
            "optimism-mainnet",
            "arbitrum-mainnet",
            "fantom-mainnet",
            "base-mainnet",
            "mantle-mainnet",
          ]}
          hide_small_balances
          address={address}
        />
      )}
    </>
  );
}

export default App;
