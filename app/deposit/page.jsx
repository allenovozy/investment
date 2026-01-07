"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import { DollarSign, Bitcoin, CreditCard, Building2 } from "lucide-react"

// ✅ Updated currency list to match backend (NGN, USD, EUR, INR)
const currencies = [
  { id: "NGN", name: "Nigerian Naira", color: "red" ,symbol: "₦", icon: DollarSign },
  { id: "USD", name: "US Dollar", symbol: "$", icon: DollarSign },
  { id: "EUR", name: "Euro", symbol: "€", icon: DollarSign },
  { id: "INR", name: "Indian Rupee", symbol: "₹", icon: DollarSign },
]

export default function DepositPage() {
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0])
  const [amount, setAmount] = useState("")
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState(null)

  // ✅ Fetch real user from backend
useEffect(() => {
  fetch("http://185.27.134.59/server/Api/get_user.php", {
    credentials: "include",
  })
    .then(res => {
      if (res.status === 401) {
        // Session expired → redirect to login
        window.location.href = "/login"
        return null
      }
      return res.json()
    })
    .then(data => {
      if (!data) return // already redirected

      if (data.success) {
        setUser(data.user)
      } else {
        if (data.message === "Session expired due to inactivity") {
          window.location.href = "/login"
          return
        }
        alert(data.message || "Failed to load user")
      }
    })
    .catch(err => {
      console.error("Error fetching user:", err)
      alert("Error fetching user")
    })
}, [])

  const handleDeposit = async () => {
    if (!amount || Number.parseFloat(amount) <= 0) return

    setLoading(true)
    try {
      const res = await fetch("http://185.27.134.59/server/Api/deposit.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          currency: selectedCurrency.id, // ✅ send NGN, USD, EUR, INR
          amount: Number(amount),
        }),
      })

      const data = await res.json()
      if (data.success && data.authorization_url) {
        // ✅ Redirect user to Paystack payment page
        window.location.href = data.authorization_url
      } else {
        alert(data.message)
      }
    } catch (err) {
      alert("Error connecting to server")
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return <div className="p-8 text-center">Loading user...</div>
  }

  return (
    <DashboardLayout user={user}>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Deposit Funds</h1>

        <div className="bg-surface rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Select Payment Method</h2>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {currencies.map((currency) => {
              const Icon = currency.icon
              const isSelected = selectedCurrency.id === currency.id

              return (
                <button
                  key={currency.id}
                  onClick={() => setSelectedCurrency(currency)}
                  className={`flex items-center gap-3 p-4 rounded-xl border transition-all
                    ${isSelected ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"}`}
                >
                  <div className={`p-2 rounded-lg ${isSelected ? "bg-primary text-background" : "bg-surface-light"}`}>
                    <Icon size={20} />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">{currency.name}</p>
                    <p className="text-xs text-muted">{currency.symbol}</p>
                  </div>
                </button>
              )
            })}
          </div>

          <div className="mb-6">
            <label className="block text-sm text-muted mb-2">Amount ({selectedCurrency.symbol})</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">{selectedCurrency.symbol}</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-8 pr-4 py-4 bg-surface-light rounded-xl border border-border focus:border-primary outline-none transition-colors text-xl font-semibold"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {[10, 50, 100, 500, 1000, 5000, 10000].map((preset) => (
              <button
                key={preset}
                onClick={() => setAmount(preset.toString())}
                className="px-4 py-2 bg-surface-light rounded-lg hover:bg-border transition-colors text-sm font-medium"
              >
                {selectedCurrency.symbol}{preset.toLocaleString()}
              </button>
            ))}
          </div>

          <button
            onClick={handleDeposit}
            disabled={!amount || Number.parseFloat(amount) <= 0 || loading}
            className="w-full py-4 bg-primary text-background font-semibold rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {loading ? "Processing..." : "Continue to Deposit"}
          </button>
        </div>
      </div>
    </DashboardLayout>
  )
}
