import React from "react";
import ReactDOM from "react-dom/client";
import { GoldRushProvider } from "@covalenthq/goldrush-kit";
import { createWeb3Modal } from "@web3modal/wagmi/react";
import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { arbitrum, mainnet } from "wagmi/chains";

import App from "./App.tsx";
import "./index.css";

const queryClient = new QueryClient();
const walletConnectProjectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID;
const wagmiMetadata = {
  name: "Web3Modal",
  description: "Web3Modal Example",
  url: "http://localhost:5173/", // origin must match your domain & subdomain
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

const chains = [mainnet, arbitrum] as const;
const config = defaultWagmiConfig({
  chains,
  projectId: walletConnectProjectId,
  metadata: wagmiMetadata,
});

createWeb3Modal({
  wagmiConfig: config,
  projectId: walletConnectProjectId,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
  enableOnramp: true, // Optional - false as default
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GoldRushProvider apikey={import.meta.env.VITE_COVALENT_API_KEY}>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </WagmiProvider>
    </GoldRushProvider>
  </React.StrictMode>
);
