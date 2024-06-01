"use client";

import { ChatMessage } from "./interface";
import { Markdown } from "../Markdown";
import { useChainList, useTokenList } from "../../hooks/api";
import { useAccount } from "wagmi";
import SquidButton from "../SquidButton";

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

function isValidJSON(str) {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
}

const Analysis = (props: MessageProps) => {
  const { role, content: strContent, transactionHash } = props.message;
  const { data: searchableChains } = useChainList();
  const { data: searchableTokens } = useTokenList(1);
  const { address } = useAccount();
  
  const isUser = role === "user";
  let content = strContent.replace(/\/\/.*$/gm, "");
  content = content.replace(/\/\*[\s\S]*?\*\//gm, "");
  content = content.replace(/```json|```/g, "");
  content = content.trim();
  if (!isValidJSON(content)) return;
  const json = JSON.parse(content);

  const getSquidConfig = (swapInfo: swapInfo) => {
    const { fromChain, fromAmount, fromToken, toChain, toToken } = swapInfo;

    console.log("swapInfo", swapInfo);

    try {
      // FIXME: add multichain
      // const formattedFromChain = searchableChains?.search(fromChain)[0].item.chainId || fromChain;
      // const formattedToChain = searchableChains?.search(toChain)[0].item.chainId || toChain;
      // const formattedFromToken = searchableTokens?.search({
        //   $and: [{symbol: fromToken}, { chainId: String(formattedFromChain) }]
        // })[0].item.address || fromToken;
        // const formattedToToken = searchableTokens?.search({
        //   $and: [{symbol: toToken}, { chainId: String(formattedToChain) }]
        // })[0].item.address || toToken;
      const formattedFromChain = 1;
      const formattedToChain = 1;
      const formattedFromToken = searchableTokens?.search(fromToken)[0].item.address || fromToken;
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
                    alt="avatar ace"
                    src="https://i.ibb.co/HPMG2k4/Screenshot-2024-06-01-at-19-42-45.png"
                  />
                </div>
              </div>
              <div className="chat-header mt-8">
                Ace The Analyst
                {/* <time className="text-xs opacity-50">12:45</time> */}
              </div>
              <div className="chat-bubble prose break-normal">{json.globalRecommandation}</div>
              <div className="chat-footer opacity-50">Analysis delivered</div>
            </div>
            <div>
              {json.recommendations.map((recommendation, index) => (
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
                      <p><SquidButton squidConfig={getSquidConfig(recommendation.swapInfo)} /></p>
                      {/* <button className="btn btn-secondary">Execute Tx</button> */}
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
