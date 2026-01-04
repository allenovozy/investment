"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Layers, ClipboardList, Users, Bell } from "lucide-react"

const mobileNavItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Home" },
  { href: "/investments", icon: Layers, label: "Invest" },
  { href: "/tasks", icon: ClipboardList, label: "Tasks" },
  { href: "/notifications", icon: Bell, label: "Alerts" },
  { href: "/referral", icon: Users, label: "Refer" },
]

export default function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border lg:hidden z-50 safe-area-bottom">
      <div className="flex items-center justify-around py-2 px-2">
        {mobileNavItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors min-w-[60px]
                ${isActive ? "text-primary" : "text-muted hover:text-foreground"}`}
            >
              <Icon size={20} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
