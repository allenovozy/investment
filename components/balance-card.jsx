import { Wallet, TrendingUp, DollarSign } from "lucide-react"

const icons = {
  wallet: Wallet,
  trending: TrendingUp,
  dollar: DollarSign,
}

const colors = {
  primary: "from-primary/20 to-primary/5 border-primary/30",
  blue: "from-blue-500/20 to-blue-500/5 border-blue-500/30",
  green: "from-green-500/20 to-green-500/5 border-green-500/30",
}

export default function BalanceCard({ title, amount, icon, color }) {
  const Icon = icons[icon] || Wallet
  const colorClass = colors[color] || colors.primary

  return (
    <div className={`bg-gradient-to-br ${colorClass} border rounded-xl p-5`}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-muted text-sm font-medium">{title}</span>
        <div className="p-2 bg-surface-light rounded-lg">
          <Icon
            size={18}
            className={color === "primary" ? "text-primary" : color === "blue" ? "text-blue-500" : "text-green-500"}
          />
        </div>
      </div>
      <p className="text-2xl md:text-3xl font-bold">${amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
    </div>
  )
}
