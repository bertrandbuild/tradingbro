import { BalancesResponse } from "@covalenthq/client-sdk";

const TokenTable = ({ data }: { data: BalancesResponse[] }) => {
  return (
    <div className="p-4">
      <div className="mb-4">
        <h2 className="text-lg font-bold">Portfolio holdings</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Icon</th>
              <th>Contract Name</th>
              <th>Symbol</th>
              <th>Quote Rate</th>
              <th>Balance</th>
              <th>Quote</th>
              <th>24h Delta</th>
            </tr>
          </thead>
          <tbody>
            {data.flatMap((networkData) => networkData.items.map((item, index) => {
              const delta = (item.quote - item.quote_24h).toFixed(4);
              let deltaPercentage = (((item.quote - item.quote_24h) / item.quote_24h) * 100).toFixed(2);
              if (!isFinite(Number(deltaPercentage))) {
                deltaPercentage = item.quote_24h === 0 ? 'N/A' : '∞';
              }
              const deltaIcon = Number(delta) > 0 ? '▲' : '▼';
              const formattedQuoteRate = item.quote_rate ? `$${item.quote_rate.toFixed(2)}` : null;
              const formattedBalance = (Number(item.balance) / Math.pow(10, item.contract_decimals)).toFixed(2);

              if (item.is_spam || formattedBalance === '0.00' || item.quote == null || item.quote == 0 || item.type === "dust") {
                return null;
              }

              return (
                <tr key={`${networkData.chain_name}-${index}`}>
                  <td>
                    <img src={item.logo_url} alt={item.contract_name} className="w-8 h-8 rounded-full border border-gray-300" />
                  </td>
                  <td>
                    <span className="text-sm text-gray-500 block">{networkData.chain_name}</span>
                    <span>{item.contract_name}</span>
                  </td>
                  <td>{item.contract_ticker_symbol}</td>
                  <td>{formattedQuoteRate}</td>
                  <td>{formattedBalance} {item.contract_ticker_symbol}</td>
                  <td>{item.pretty_quote}</td>
                  <td>
                    {deltaIcon} {deltaPercentage}%
                  </td>
                </tr>
              );
            }))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TokenTable;
