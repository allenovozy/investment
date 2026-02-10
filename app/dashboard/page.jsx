"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard-layout"
import BalanceDisplay from "@/components/balance-display"
import QuickActions from "@/components/quick-actions"
import TransactionList from "@/components/transaction-list"
import InvestmentSummary from "@/components/investment-summary"

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, txRes] = await Promise.all([
          fetch("https://faitcurrency.online/server/Api/dashboard.php", {
            method: "GET",
            credentials: "include",
          }),
          fetch(`https://faitcurrency.online/server/Api/transactions.php?page=${page}`, {
            method: "GET",
            credentials: "include",
          }),
        ])

        // ✅ Check both responses for session expiry
        if (userRes.status === 401 || txRes.status === 401) {
          router.replace("/login")
          return
        }

        const userData = await userRes.json()
        const txData = await txRes.json()

        if (!userData.success) {
          if (userData.message === "Session expired due to inactivity") {
            router.replace("/login")
            return
          }
          throw new Error(userData.message)
        }

        if (!txData.status) {
          if (txData.message === "Session expired due to inactivity") {
            router.replace("/login")
            return
          }
          throw new Error(txData.message)
        }

        // ✅ Normalize backend fields into frontend shape
        const u = userData.user
        setUser({
          id: u.id,
          name: u.fullName,
          email: u.email,
          phone: u.phone,
          country: u.country,
          inviteCode: u.inviteCode,
          vipLevel: u.vip_level ?? 1,
          points: u.points_balance ?? 0,
          balances: {
            usd: u.usd_balance,
            ngn: u.ngn_balance,
            eur: u.eur_balance,
            gbp: u.gbp_balance,
            inr: u.inr_balance,
          },
          maxProfit: {
            usd: u.usd_max_profit,
            ngn: u.ngn_max_profit,
            eur: u.eur_max_profit,
            gbp: u.gbp_max_profit,
            inr: u.inr_max_profit,
          },
          investments: u.investments,
          earnings: u.earnings,
        })

        setTransactions(txData.transactions ?? [])
        setPages(txData.pages ?? 1)
      } catch (err) {
        alert("Failed to load dashboard data: " + err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router, page])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted">Loading dashboard...</p>
      </div>
    )
  }

  if (!user) return null

  // Construct balances array from normalized user data
  const balances = [
    {
      id: "usd",
      name: "US Dollar",
      symbol: "USD",
      icon: "$",
      balance: user.balances.usd,
      maxProfit: user.maxProfit.usd,
      color: "from-green-500/20 to-green-500/5",
    },
    {
      id: "eur",
      name: "Euro",
      symbol: "EUR",
      icon: "€",
      balance: user.balances.eur,
      maxProfit: user.maxProfit.eur,
      color: "from-blue-500/20 to-blue-500/5",
    },
    {
      id: "gbp",
      name: "British Pound",
      symbol: "GBP",
      icon: "£",
      balance: user.balances.gbp,
      maxProfit: user.maxProfit.gbp,
      color: "from-purple-500/20 to-purple-500/5",
    },
    {
      id: "ngn",
      name: "Naira",
      symbol: "NGN",
      icon: "₦",
      balance: user.balances.ngn,
      maxProfit: user.maxProfit.ngn,
      color: "from-primary/20 to-primary/5",
    },
    {
      id: "inr",
      name: "Indian Rupee",
      symbol: "INR",
      icon: "₹",
      balance: user.balances.inr,
      maxProfit: user.maxProfit.inr,
      color: "from-orange-500/20 to-orange-500/5",
    },
  ]

  return (
    <DashboardLayout user={user}>
      <div className="flex flex-col gap-6">
        <h2 className="text-xl font-bold">Dashboard</h2>

        <BalanceDisplay balances={balances} />

        <QuickActions />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <TransactionList
              transactions={transactions}
              title="Recent Transactions"
            />

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-4">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="px-4 py-2 bg-surface-light rounded-lg hover:bg-border disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-muted">
                Page {page} of {pages}
              </span>
              <button
                disabled={page >= pages}
                onClick={() => setPage(page + 1)}
                className="px-4 py-2 bg-surface-light rounded-lg hover:bg-border disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>

          <InvestmentSummary userId={user.id} />
        </div>
      </div>
    </DashboardLayout>
  )
}
