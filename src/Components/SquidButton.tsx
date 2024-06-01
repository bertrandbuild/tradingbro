import { Squid } from "@0xsquid/sdk";
import { RouteRequest } from "@0xsquid/squid-types";
import { ethers } from "ethers";
import { useState } from "react";
import { useAccount } from "wagmi";

const SquidButton = ({ squidConfig }: { squidConfig: RouteRequest }) => {
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

        // @ts-expect-error only working with eth
        const provider = new ethers.BrowserProvider(window.ethereum)
        await provider.send("eth_requestAccounts", []);
        if (!address) throw new Error('Please connect wallet')
        const signer = new ethers.JsonRpcSigner(provider, address)
        
        if (!signer) return;
        console.log(squidConfig);
        try {
          // @ts-expect-error (isError is not defined but it actually works right now)
          const { route, isError } = await squid.getRoute(squidConfig);
          if (isError) console.error(isError);
          console.log(route);
          // @ts-expect-error signer type is different but it's working (maybe due to old types / package version)
          const result = await squid.executeRoute({ route, signer });
          console.log(result);
          setIsLoading(false);
        } catch (error) {
          console.error(error);
          // @ts-expect-error useful to get this error but ok if it fails
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
