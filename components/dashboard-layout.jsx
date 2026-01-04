"use client"

import { useState } from "react"
import Sidebar from "./sidebar"
import MobileNav from "./mobile-nav"
import Header from "./header"

export default function DashboardLayout({ children, user }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <div className={`transition-all duration-300 ${sidebarOpen ? "lg:ml-64" : "lg:ml-20"}`}>
        <Header user={user} onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <main className="p-4 md:p-6 pb-24 lg:pb-6">{children}</main>
      </div>

      <MobileNav />
    </div>
  )
}
