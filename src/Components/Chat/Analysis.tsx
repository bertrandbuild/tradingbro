"use client";

import { ChatMessage } from "./interface";
import { Markdown } from "../Markdown";

export interface MessageProps {
  message: ChatMessage;
}

const Analysis = (props: MessageProps) => {
  const { role, content, transactionHash } = props.message;
  const isUser = role === "user";

  return (
    <div className="message flex gap-4 mb-5">
      {transactionHash && (
        <div className="flex gap-4 items-center pt-2 pb-8 text-sm">
          <div>
            Transaction hash:
            <a
              className="underline pl-2"
              href={`https://explorer.galadriel.com/tx/${transactionHash}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {transactionHash}
            </a>
          </div>
        </div>
      )}
      <div className="flex-1 pt-1 break-all">
        {!isUser && (
          <div className="flex flex-col gap-4">
            <Markdown>{content}</Markdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analysis;
