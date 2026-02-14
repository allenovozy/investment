"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Gift,
  CheckSquare,
  LogOut,
  Menu,
  X,
  Wallet,
  TrendingUp,
  Settings,
} from "lucide-react"
import "./Layout.css"

const Layout = ({ children, currentPage }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("https://faitcurrency.online/server/Api/Admin/me.php", {
          credentials: "include",
        })
        const data = await res.json()
        if (data.success) {
          setUser(data.user) // ✅ set user object from backend
        }
      } catch (err) {
        console.error("Failed to fetch user:", err)
      }
    }
    fetchUser()
  }, [])

  const navItems = [
    { id: "dashboard", path: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { id: "users", path: "/admin/users", label: "Users", icon: Users },
    { id: "transactions", path: "/admin/transactions", label: "Transactions", icon: CreditCard },
    { id: "withdraw", path: "/admin/withdraw", label: "Withdrawals", icon: Wallet },
    { id: "referrals", path: "/admin/referrals", label: "Referrals", icon: Gift },
    { id: "tasks", path: "/admin/tasks", label: "Tasks", icon: CheckSquare },
    { id: "notifications", path: "/admin/notifications", label: "Notifications", icon:CheckSquare },
    { id: "settings", path: "/admin/settings", label: "Settings", icon: Settings },
  ]

  const handleLogout = () => {
    localStorage.removeItem("adminToken")
    window.location.href = "/login"
  }

  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <TrendingUp size={28} />
            <span>FAIT-CURRENCY</span>
          </div>
          <button
            className="sidebar-toggle-mobile"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = currentPage === item.id
            return (
              <Link
                key={item.id}
                href={item.path}
                className={`nav-item ${isActive ? "active" : ""}`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="topbar">
          <button
            className="menu-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu size={24} />
          </button>
          <div className="topbar-right">
            <div className="user-badge">
              <div className="avatar">Admin</div>
              <div className="user-info">
                <div className="user-name">{user ? user.email : "Admin"}</div>
                <div className="user-role">{user ? user.role : "Administrator"}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="content-area">{children}</div>
      </main>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}

export default Layout
