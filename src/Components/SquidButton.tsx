import { Squid } from "@0xsquid/sdk";
import { ethers } from "ethers";
import { useState } from "react";
import { useAccount } from "wagmi";

const SquidButton = ({ squidConfig }: { squidConfig: object }) => {
  const integratorId = import.meta.env.VITE_SQUID_API_KEY;
  const [isLoading, setIsLoading] = useState(false)
  const { address } = useAccount();

  return (
    <div
      className="btn btn-secondary"
      onClick={async () => {
        setIsLoading(true);
        const squid = new Squid({
          baseUrl: "https://v2.api.squidrouter.com",
          integratorId,
        });
      
        await squid.init();

        const provider = new ethers.BrowserProvider(window.ethereum)
        await provider.send("eth_requestAccounts", []);
        const signer = new ethers.JsonRpcSigner(provider, address)
        
        if (!signer) return;
        console.log(squidConfig);
        try {
          const { route, isError } = await squid.getRoute(squidConfig);
          if (isError) console.error(isError);
          console.log(route);
          const result = await squid.executeRoute({ route, signer });
          console.log(result);
          setIsLoading(false);
        } catch (error) {
          console.error(error);
          console.error(error.response.data.errors[0].errorType, error.response.data.errors[0].message);
          setIsLoading(false);
        }
      }}
    >
      {isLoading && <span className="loading loading-spinner loading-xs"></span>}
      Execute Tx
    </div>
  );
};

export default SquidButton;
