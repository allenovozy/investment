"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Layers,
  ArrowDownToLine,
  ArrowUpFromLine,
  Trophy,
  CreditCard,
  User,
  Info,
  ChevronLeft,
  ChevronRight,
  Bell,
  Crown,
  History,
  HeadphonesIcon,
  Pickaxe,
} from "lucide-react"

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/investments", icon: Layers, label: "Investments" },
  { href: "/deposit", icon: ArrowDownToLine, label: "Deposit" },
  { href: "/withdraw", icon: ArrowUpFromLine, label: "Withdraw" },
  { href: "/deposit-history", icon: History, label: "History" },
  { href: "/leaderboard", icon: Trophy, label: "Leaderboard" },
  { href: "/upgrade", icon: Crown, label: "Upgrade" },
  { href: "/tasks",   icon: Pickaxe, label: "Tasks"},
  { href: "/payment-methods", icon: CreditCard, label: "Payment" },
  { href: "/notifications", icon: Bell, label: "Notifications" },
  { href: "/support", icon: HeadphonesIcon, label: "Support" },
  { href: "/profile", icon: User, label: "Profile" },
  { href: "/about", icon: Info, label: "About Us" },
]

export default function Sidebar({ isOpen, onToggle }) {
  const pathname = usePathname()

  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-surface z-40 transition-all duration-300 hidden lg:flex flex-col
        ${isOpen ? "w-64" : "w-20"}`}
    >
      <div className="flex items-center justify-between p-4 border-b border-border">
        {isOpen && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-background font-bold text-sm">
              <img
                 src="/android-chrome-192x192.png"
                 alt="App logo"
                 className="w-6 h-6"
                /></span>
            </div>
            <span className="font-semibold text-lg">FiatCurrency</span>
          </div>
        )}
        <button
          onClick={onToggle}
          className="p-2 rounded-lg hover:bg-surface-light transition-colors"
          aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all
                    ${
                      isActive
                        ? "bg-primary text-background"
                        : "text-muted hover:bg-surface-light hover:text-foreground"
                    }`}
                >
                  <Icon size={20} />
                  {isOpen && <span className="text-sm font-medium">{item.label}</span>}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}
