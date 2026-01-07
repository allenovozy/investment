"use client"

import { useEffect, useState } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import { DollarSign, Euro, IndianRupee, CheckCircle, Clock, XCircle } from "lucide-react"

export default function DepositHistoryPage() {
  const [filter, setFilter] = useState("all")
  const [deposits, setDeposits] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)

  useEffect(() => {
    const fetchUserAndDeposits = async () => {
      setLoading(true)
      try {
        // ✅ Fetch authenticated user
        const resUser = await fetch("https://185.27.134.59/server/Api/get_user.php", {
          credentials: "include"
        })
  
        if (resUser.status === 401) {
          // Session expired → redirect to login
          window.location.href = "/login"
          return
        }
  
        const dataUser = await resUser.json()
        if (!dataUser.success) {
          if (dataUser.message === "Session expired due to inactivity") {
            window.location.href = "/login"
            return
          }
          throw new Error(dataUser.message)
        }
        setUser(dataUser.user)

        // Fetch deposits with pagination
        const resDeposits = await fetch(`https://185.27.134.59/server/Api/get_deposits.php?page=${page}`, {
          credentials: "include"
        })
        const dataDeposits = await resDeposits.json()
        if (dataDeposits.success) {
          setDeposits(dataDeposits.deposits)
          setPages(dataDeposits.pages)
        } else {
          alert(dataDeposits.message)
        }
      } catch (err) {
        alert("Error fetching user or deposits")
      } finally {
        setLoading(false)
      }
    }

    fetchUserAndDeposits()
  }, [page])

  const filteredDeposits = filter === "all" ? deposits : deposits.filter(d => d.status === filter)

  const totalDeposits = deposits
    .filter(d => d.status === "completed") // ✅ use completed
    .reduce((sum, d) => sum + parseFloat(d.amount), 0)

  // ✅ Define helper functions here
  const getCurrencyIcon = (currency) => {
    switch (currency) {
      case "EUR": return Euro
      case "INR": return IndianRupee
      default: return DollarSign
    }
  }

  
  const getStatusIcon = (status) => {
    switch (status) {
      case "completed": return CheckCircle
      case "pending": return Clock
      case "failed": return XCircle
      default: return Clock
    }
  }
  
  const getStatusColor = (status) => {
    switch (status) {
      case "completed": return "text-green-400"
      case "pending": return "text-yellow-400"
      case "failed": return "text-red-400"
      default: return "text-muted"
    }
  }
  
  if (!user) return <div className="text-center p-8 text-muted">Loading user...</div>

  return (
    <DashboardLayout user={user}>
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Deposit History</h1>
            <p className="text-muted">View all your past deposits</p>
          </div>
          <div className="bg-surface rounded-xl px-4 py-3">
            <span className="text-sm text-muted">Total Deposits: </span>
            <span className="font-semibold text-primary">${totalDeposits.toLocaleString()}</span>
          </div>
        </div>

        {loading ? (
          <div className="text-center p-8 text-muted">Loading deposits...</div>
        ) : (
          <div className="bg-surface rounded-xl overflow-hidden">
            <div className="flex border-b border-border overflow-x-auto">
              {["all", "completed", "pending", "failed"].map(tab => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`flex-1 min-w-[80px] py-3 text-sm font-medium capitalize transition-colors whitespace-nowrap px-4
                    ${filter === tab ? "text-primary border-b-2 border-primary" : "text-muted hover:text-foreground"}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="divide-y divide-border">
              {filteredDeposits.length === 0 ? (
                <div className="p-8 text-center text-muted">No deposits found</div>
              ) : (
                filteredDeposits.map(deposit => {
                  const CurrencyIcon = getCurrencyIcon(deposit.currency)
                  const StatusIcon = getStatusIcon(deposit.status)
                  return (
                    <div key={deposit.id} className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                          <CurrencyIcon className="text-primary" size={24} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{deposit.currency}</span>
                            <span className="text-sm text-muted">({deposit.currency})</span>
                          </div>
                          <div className={`flex items-center gap-1 text-sm ${getStatusColor(deposit.status)}`}>
                            <StatusIcon size={14} />
                            <span className="capitalize">{deposit.status}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{deposit.symbol}{parseFloat(deposit.amount).toLocaleString()}</p>
                        <p className="text-xs text-muted">{deposit.date}</p>
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center p-4 border-t border-border">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="px-4 py-2 bg-surface-light rounded-lg hover:bg-border disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-muted">Page {page} of {pages}</span>
              <button
                disabled={page >= pages}
                onClick={() => setPage(page + 1)}
                className="px-4 py-2 bg-surface-light rounded-lg hover:bg-border disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
