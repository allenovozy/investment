import Link from "next/link"
import { ArrowDownToLine, ArrowUpFromLine, Layers, Users } from "lucide-react"

const actions = [
  { href: "/deposit", icon: ArrowDownToLine, label: "Deposit", color: "bg-primary hover:bg-primary-dark" },
  { href: "/withdraw", icon: ArrowUpFromLine, label: "Withdraw", color: "bg-blue-600 hover:bg-blue-700" },
  { href: "/investments", icon: Layers, label: "Invest", color: "bg-purple-600 hover:bg-purple-700" },
  { href: "/referral", icon: Users, label: "Refer", color: "bg-orange-600 hover:bg-orange-700" },
]

export default function QuickActions() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {actions.map((action) => {
        const Icon = action.icon
        return (
          <Link
            key={action.href}
            href={action.href}
            className={`${action.color} flex flex-col items-center gap-2 p-4 rounded-xl transition-colors text-white`}
          >
            <Icon size={24} />
            <span className="text-sm font-medium">{action.label}</span>
          </Link>
        )
      })}
    </div>
  )
}
