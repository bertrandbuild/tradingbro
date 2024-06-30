// Signature.tsx
import React, { useState } from 'react';
import { useAccount, useSignMessage } from 'wagmi';
import { SiweMessage } from 'siwe';

const Signature: React.FC = () => {
  const [signature, setSignature] = useState<string | null>(null);

  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();

  const handleSignInWithEthereum = async () => {
    if (!address) {
      console.error('No address found');
      return;
    }

    const domain = window.location.host;
    const origin = window.location.origin;
    const statement = 'Sign in with Ethereum to the app.';

    const siweMessage = new SiweMessage({
      domain,
      address,
      statement,
      uri: origin,
      version: '1',
      chainId: 1,
    });

    try {
      const message = siweMessage.prepareMessage();
      const signature = await signMessageAsync({ message });
      setSignature(signature);
      console.log('Signature:', signature);
    } catch (error) {
      console.error('Error signing message:', error);
    }
  };

  return (
    <div>
      {isConnected ? (
        <div>
          <button onClick={handleSignInWithEthereum}>Sign In with Ethereum</button>
          {signature && (
            <div>
              <p>Signature:</p>
              <pre>{signature}</pre>
            </div>
          )}
        </div>
      ) : (
        <w3m-button label="Connect to add a new strategy"/>
      )}
    </div>
  );
};

export default Signature;
