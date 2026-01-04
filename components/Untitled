import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Layers,
  DollarSign
} from "lucide-react"

const typeIcons = {
  deposit: ArrowDownToLine,
  withdraw: ArrowUpFromLine,
  investment: Layers,
  earning: DollarSign,
}

const statusColors = {
  successful: "text-success bg-success/10",
  pending: "text-warning bg-warning/10",
  failed: "text-error bg-error/10",
}

export default function TransactionList({ transactions, title }) {
  /**
   * Supports:
   * - API response { success, transactions }
   * - Direct array []
   */
  const txList = Array.isArray(transactions)
    ? transactions
    : Array.isArray(transactions?.transactions)
    ? transactions.transactions
    : []

  if (!txList.length) {
    return (
      <div className="bg-surface rounded-xl p-5 text-center text-muted">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <p>No transactions found</p>
      </div>
    )
  }

  return (
    <div className="bg-surface rounded-xl p-5">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>

      <div className="flex flex-col gap-3">
        {txList.map((tx) => {
          const Icon = typeIcons[tx.type] || DollarSign
          const statusClass =
            statusColors[tx.status] || statusColors.pending

          return (
            <div
              key={tx.id}
              className="flex items-center justify-between p-3 bg-surface-light rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-background rounded-lg">
                  <Icon size={18} className="text-primary" />
                </div>

                <div>
                  <p className="font-medium capitalize">{tx.type}</p>
                  <p className="text-xs text-muted">
                    {new Date(tx.date).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="font-semibold">
                  {tx.type === "withdraw" ? "-" : "+"}
                  ${Number(tx.amount).toLocaleString()}
                </p>

                <span
                  className={`text-xs px-2 py-0.5 rounded-full capitalize ${statusClass}`}
                >
                  {tx.status}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
