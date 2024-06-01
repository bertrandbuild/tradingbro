import { Squid } from "@0xsquid/sdk";
import { ethers } from "ethers";
import { useAccount } from "wagmi";

const SquidButton = ({ squidConfig }: { squidConfig: object }) => {
  const integratorId = import.meta.env.VITE_SQUID_API_KEY;
  const { address } = useAccount();

  return (
    <div
      className="btn btn-primary"
      onClick={async () => {

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
        } catch (error) {
          console.error(error);
          console.error(error.response.data.errors[0].errorType, error.response.data.errors[0].message);
        }
      }}
    >
      Execute Tx
    </div>
  );
};

export default SquidButton;
