"use client";

import { ChatMessage } from "./interface";
import { useTokenList } from "../../hooks/api";
import { useAccount } from "wagmi";
import SquidButton from "../SquidButton";
import { useEffect, useState } from "react";

export interface MessageProps {
  message: ChatMessage;
}

interface swapInfo {
  fromChain: string; // the original chain name
  fromAmount: string; // suggested amount in wei
  fromToken: string; // the original token symbol
  toChain: string; // the target chain name
  toToken: string; // the target token symbol
}

function isValidJSON(str: string) {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
}

const Analysis = (props: MessageProps) => {
  const { role, content: strContent } = props.message;
  const [img, setImg] = useState('https://assets.zootools.co/users/PiL0Turm2GbFgCcZ1NYn/assets/zfiCjupkCEd20jc');
  // const { data: searchableChains } = useChainList();
  const { data: searchableTokens } = useTokenList(1);
  const { address } = useAccount();
  
  const isUser = role === "user";
  let content = strContent.replace(/\/\/.*$/gm, "");
  content = content.replace(/\/\*[\s\S]*?\*\//gm, "");
  content = content.replace(/```json|```/g, "");
  content = content.trim();
  if (!isValidJSON(content)) return;
  const json = JSON.parse(content);

  // TODO: move into context
  // Load the config file if a hash is passed in params
  useEffect(() => {
    const urlQuery = new URLSearchParams(window.location.search);
    const hash = urlQuery.get('hash') || ''; // 'param' is the name of the query parameter
    fetch(`https://gateway.lighthouse.storage/ipfs/${hash}`)
      .then(response => {
        if (response.ok) return response.json();
        throw new Error('Network response was not ok.');
      })
      .then(content => {
        setImg(content.image);
      })
      .catch(error => {
        console.error('Failed to save the file:', error);
      });
  }, []);

  const getSquidConfig = (swapInfo: swapInfo) => {
    const { fromAmount, fromToken, toToken } = swapInfo || {};
    if (!fromAmount || !fromToken || !toToken) return;

    console.log("swapInfo", swapInfo);

    try {
      // TODO: add multichain
      // const formattedFromChain = searchableChains?.search(fromChain)[0].item.chainId || 1;
      // const formattedToChain = searchableChains?.search(toChain)[0].item.chainId || 1;
      // const formattedFromToken = searchableTokens?.search({
        //   $and: [{symbol: fromToken}, { chainId: String(formattedFromChain) }]
        // })[0].item.address || fromToken;
        // const formattedToToken = searchableTokens?.search({
        //   $and: [{symbol: toToken}, { chainId: String(formattedToChain) }]
        // })[0].item.address || toToken;
      const formattedFromChain = 1;
      const formattedToChain = 1;
      // @ts-expect-error type alert from hackathon project
      const formattedFromToken = searchableTokens?.search(fromToken)[0].item.address || fromToken;
      // @ts-expect-error type alert from hackathon project
      const formattedToToken = searchableTokens?.search(toToken)[0].item.address || toToken;
  
      return {
        fromChain: formattedFromChain,
        fromAmount,
        fromToken: formattedFromToken,
        toChain: formattedToChain,
        toToken: formattedToToken,
        fromAddress: address,
        toAddress: address,
        bypassGuardRails: true,
        slippageConfig: {
          autoMode: 1,
        },
      };
    } catch (e) {
      console.error(e);
      return;
    }
  };

  return (
    <div className="message flex gap-4 mb-5 w-3/4 m-auto">
      <div className="flex-1 pt-1 break-all">
        {!isUser && (
          <div className="flex flex-col gap-4">
            <div className="chat chat-start">
              <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                  <img
                    alt="avatar satoshi"
                    src={img}
                  />
                </div>
              </div>
              <div className="chat-header mt-8">
                Satoshi
                {/* <time className="text-xs opacity-50">12:45</time> */}
              </div>
              <div className="chat-bubble prose break-normal">{json.globalRecommandation}</div>
              <div className="chat-footer opacity-50">Analysis delivered</div>
            </div>
            <div>
              {/* @ts-expect-error TODO: add recommendation type  */}
              {json.recommendations.map((recommendation, index: number) => (
                <div
                  key={index}
                  className="card card-side bg-base-200 shadow-xl mb-8"
                >
                  <figure>
                    {/* <img
                      src="https://i.ibb.co/S7nPFkJ/3beeec2e-2069-4ad1-8de4-2671a9c9c8f5.jpg"
                      alt="coin image"
                    /> */}
                  </figure>
                  <div className="card-body">
                    <h2 className="card-title">{recommendation.title}</h2>
                    <p className="prose break-normal">{recommendation.explanation}</p>
                    <div className="card-actions justify-end">
                      {/* @ts-expect-error TODO: fix type alert  */}
                      <p><SquidButton squidConfig={getSquidConfig(recommendation.swapInfo)} /></p>
                      {/* <Markdown>{`[SQUID: fromChain: "${recommendation.swapInfo.fromChain}", fromAmount: "${recommendation.swapInfo.fromAmount}", fromToken: "${recommendation.swapInfo.fromToken}", toChain: "${recommendation.swapInfo.toChain}", toToken: "${recommendation.swapInfo.toToken}"]`}</Markdown> */}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analysis;
