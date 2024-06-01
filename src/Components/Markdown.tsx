import React, { ClassAttributes, Fragment, HTMLAttributes, useCallback, useState } from 'react'
import cs from 'classnames'
import { RxClipboardCopy } from 'react-icons/rx'
import ReactMarkdown, { ExtraProps } from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import rehypeKatex from 'rehype-katex'
import rehypeRaw from 'rehype-raw'
import rehypeStringify from 'rehype-stringify'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { useCopyToClipboard } from '../hooks/useCopyToClipboard'
import { useChainList, useTokenList } from '../hooks/api'
import SquidButton from './SquidButton'
import { useAccount } from 'wagmi'

export interface MarkdownProps {
  className?: string
  children: string
}

const HighlightCode = (
  props: ClassAttributes<HTMLElement> & HTMLAttributes<HTMLElement> & ExtraProps
) => {
  const { children, className, ref, ...rest } = props
  const match = /language-(\w+)/.exec(className || '')
  const copy = useCopyToClipboard()
  const [tooltipOpen, setTooltipOpen] = useState<boolean>(false)

  const code = match ? String(children).replace(/\n$/, '') : ''

  const onCopy = useCallback(() => {
    copy(code, (isSuccess) => {
      if (isSuccess) {
        setTooltipOpen(true)
      }
    })
  }, [code, copy])

  return match ? (
    <Fragment>
      <div className="tooltip" data-tip="Copied!">
        <div
          className="absolute right-4 top-4 cursor-pointer"
          // variant="solid"
          onClick={onCopy}
          onMouseLeave={() => setTooltipOpen(false)}
        >
          <RxClipboardCopy />
        </div>
      </div>
      <SyntaxHighlighter {...rest} style={vscDarkPlus} language={match[1]} PreTag="div">
        {code}
      </SyntaxHighlighter>
    </Fragment>
  ) : (
    <code ref={ref} {...rest} className={cs('highlight', className)}>
      {children}
    </code>
  )
}

/**
 * generateSquidConfigObject - This function generates the squid config object from the squid query string.
 * The input has to follow this syntax : [SQUID: fromChain: "<the chain name>", fromAmount: "<suggested amount in gwei or similar>", fromToken: "<the 'from' token symbol>", toChain: "<the chain name>", toToken: "<the 'to' token symbol>"]
 * Examples : 
 * [SQUID: fromChain: "ethereum", fromAmount: "10000000000000000", fromToken: "USDC", toChain: "ethereum", toToken: "eth"]
 * [SQUID: fromChain: "avalanche", fromAmount: "500000000000000000", fromToken: "AVAX", toChain: "polygon", toToken: "MATIC"]
 * [SQUID: fromChain: "binance-smart-chain", fromAmount: "15000000000000000000", fromToken: "BNB", toChain: "cosmos", toToken: "Pyth"]
 */
const generateSquidConfigObject = (
  squidQuery: string,
  address: string
) => {
  if (!squidQuery.includes("[SQUID:")) {
    throw new Error("Invalid Squid query");
  }

  const squidParams = squidQuery
    .replace(/[\[\]]/g, '') // Remove the square brackets
    .split("SQUID:")[1] // Split and take the part after "SQUID:"
    .trim() // Remove leading/trailing whitespace
    .split(",") // Split by comma to get individual parameters
    .map((param) =>
      param
        .trim() // Remove leading/trailing whitespace from each parameter
        .split(":") // Split by colon to separate key and value
        .map((s) => s.trim().replace(/"/g, "")) // Remove quotes from each part
    );

  const squidObject = Object.fromEntries(
    squidParams.map(([key, value]) => [key, value])
  );
  const { fromChain, fromAmount, fromToken, toChain, toToken } = squidObject;

  const { data: searchableChains } = useChainList();
  console.log(searchableChains);
  const formattedFromChain = searchableChains?.search(fromChain)[0].item.chainId || fromChain;
  const formattedToChain = searchableChains?.search(toChain)[0].item.chainId || toChain;
  const { data: searchableFromTokens } = useTokenList(formattedFromChain);
  const { data: searchableToTokens } = useTokenList(formattedToChain);
  const formattedFromToken = searchableFromTokens?.search(fromToken)[0].item.address || fromToken;
  const formattedToToken = searchableToTokens?.search(toToken)[0].item.address || toToken;

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
    }
  };
};

const AddSquidButton = (
  props: ClassAttributes<HTMLElement> & HTMLAttributes<HTMLElement> & ExtraProps
) => {
  const { children, className, ref, ...rest } = props
  const match = /[\s\S]+SQUID:[\s\S]+/.exec(children || '')
  const { address } = useAccount();

  const squidButtonElement = React.Children.map(children, child => {
    if (typeof child === 'string' && child.includes('SQUID:')) {
      const squidObject = generateSquidConfigObject(child, address);
      console.log('Generated squidConfig for SquidButton:', squidObject);

      return <SquidButton squidConfig={squidObject} />;
    }
    return child;
  });

  return match ? (
    <span ref={ref} {...rest} className={cs('squid-button-wrapper', className)}>
      {squidButtonElement}
    </span>
  ):(
    <span ref={ref} {...rest} className={className}>
      {children}
    </span>
  );
}

export const Markdown = ({ className, children }: MarkdownProps) => {
  return (
    <ReactMarkdown
      className={cs('prose dark:prose-invert max-w-none', className)}
      remarkPlugins={[remarkParse, remarkMath, remarkRehype, remarkGfm]}
      rehypePlugins={[rehypeRaw, rehypeKatex, rehypeStringify]}
      components={{
        code(props) {
          // return <HighlightCode {...props} />
          return <AddSquidButton {...props} />
        },
        p(props) {
          return <AddSquidButton {...props} />
        },
        span(props) {
          return <AddSquidButton {...props} />
        }
      }}
    >
      {children}
    </ReactMarkdown>
  )
}
