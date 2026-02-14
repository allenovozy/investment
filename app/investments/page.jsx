"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import { ChevronDown, X } from "lucide-react"

export default function InvestmentsPage() {
  const [activeTab, setActiveTab] = useState("ruby")
  const [selectedCurrency, setSelectedCurrency] = useState("NGN")
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [amount, setAmount] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [user, setUser] = useState(null)
  const [investmentCategories, setInvestmentCategories] = useState({})
  const [loading, setLoading] = useState(true)

  // ✅ Track current active investment
  const [currentInvestment, setCurrentInvestment] = useState(null)
  const [countdown, setCountdown] = useState("")

      // Fetch user + plans once
      useEffect(() => {
        const fetchData = async () => {
          try {
            const resUser = await fetch("https://faitcurrency.online/server/Api/dashboard.php", {
              credentials: "include"
            })
            if (resUser.status === 401) {
              window.location.href = "/login"
              return
            }
            const dataUser = await resUser.json()
            if (!dataUser.success) throw new Error(dataUser.message)
            setUser(dataUser.user)

            const resPlans = await fetch("https://faitcurrency.online/server/Api/get_investments.php", {
              credentials: "include"
            })
            if (resPlans.status === 401) {
              window.location.href = "/login"
              return
            }
            const dataPlans = await resPlans.json()
            if (!dataPlans.success) throw new Error(dataPlans.message)
            setInvestmentCategories(dataPlans.plans)
          } catch (err) {
            alert("Error: " + err.message)
          } finally {
            setLoading(false)
          }
        }
        fetchData()
      }, [])

  // Countdown effect for current investment
  useEffect(() => {
    if (!currentInvestment) {
      // Try to restore from localStorage
      const savedCurr = localStorage.getItem("currentInvestmentCurrency")
      const savedEnd = localStorage.getItem("currentInvestmentEnd")
      if (savedCurr && savedEnd) {
        setCurrentInvestment({ currency: savedCurr, endTime: parseInt(savedEnd) })
      }
      return
    }

    const interval = setInterval(() => {
      const now = Date.now()
      const diff = Math.floor((currentInvestment.endTime - now) / 1000)
      if (diff <= 0) {
        setCountdown("00:00:00")
        clearInterval(interval)
      } else {
        const hours = Math.floor(diff / 3600)
        const minutes = Math.floor((diff % 3600) / 60)
        const seconds = diff % 60
        setCountdown(
          `${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
        )
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [currentInvestment])

  const handleInvest = (plan) => {
    setSelectedPlan(plan)
    setShowModal(true)
  }

  const confirmInvestment = async () => {
    if (!amount || Number(amount) < selectedPlan.price) {
      alert("Amount must be at least the plan price")
      return
    }

    try {
      const res = await fetch("http://faitcurrency.online/server/Api/create_investment.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          plan_id: selectedPlan.id,
          amount: Number(amount),
          currency: selectedCurrency
        })
      })

      const data = await res.json()
      if (!data.success) throw new Error(data.message)

      alert(data.message)

      // Update local balance
      setUser(prev => ({
        ...prev,
        [`${selectedCurrency.toLowerCase()}_balance`]:
          prev[`${selectedCurrency.toLowerCase()}_balance`] - Number(amount)
      }))

      // ✅ Start countdown based on plan duration (days)
      const durationDays = parseInt(selectedPlan.duration_days || selectedPlan.duration || "0")
      const end = Date.now() + durationDays * 24 * 60 * 60 * 1000

      setCurrentInvestment({ currency: selectedCurrency, endTime: end })
      localStorage.setItem("currentInvestmentCurrency", selectedCurrency)
      localStorage.setItem("currentInvestmentEnd", end.toString())

      setShowModal(false)
      setAmount("")
      setSelectedPlan(null)
    } catch (err) {
      alert(err.message)
    }
  }

  if (loading || !user) {
    return <div className="text-center p-8">Loading...</div>
  }

  return (
    <DashboardLayout user={user}>
      <div className="max-w-4xl mx-auto p-6">
        {/* ✅ Current Investment Countdown at the top */}
        {currentInvestment && (
            <div className="frame-711 mb-6">
              <div className="duration-countdown">
                <span className="duration">
                  Current {currentInvestment.currency} Investment Countdown
                </span>
                <p style={{ color: "black", fontSize: "20px", fontWeight: "bold" }}>
                  {countdown || "No active countdown"}
                </p>    
              </div>
            </div>
          )}

        <h1 className="text-2xl font-bold mb-4">Investment Plans</h1>


        {/* Show user’s investment and earnings */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-surface rounded-xl p-5">
            <p className="text-sm text-muted">Total Investment</p>
            <p className="text-2xl font-bold">
              ₦{Number(user.investments).toLocaleString()}
            </p>
          </div>

          <div className="bg-surface rounded-xl p-5">
            <p className="text-sm text-muted">Total Earnings</p>
            <p className="text-2xl font-bold">
              ₦{Number(user.earnings).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Tabs */}
       {/* Categories displayed as buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {Object.keys(investmentCategories).map(category => (
            <div key={category} className="flex flex-col gap-4">
              <h2 className="text-lg font-bold capitalize">{category}</h2>
              {investmentCategories[category]?.map(plan => (
                <div
                  key={plan.id}
                  className="border border-border rounded-xl p-4 flex flex-col justify-between"
                >
                  <div>
                    <h3 className="text-base font-semibold">{plan.name}</h3>
                    <p className="text-sm text-muted">Price: ₦{plan.price.toLocaleString()}</p>
                    <p className="text-sm text-muted">ROI: {plan.roi}</p>
                    <p className="text-sm text-muted">
                      Duration: {plan.duration_days || plan.duration} days
                    </p>
                  </div>
                  <button
                    onClick={() => handleInvest(plan)}
                    className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
                  >
                    Invest
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>
    
        {/* Investment Modal */}
        {showModal && selectedPlan && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Invest in {selectedPlan.name}</h2>
                <button onClick={() => setShowModal(false)}>
                  <X size={20} />
                </button>
              </div>
              <p className="text-sm text-muted mb-4">
                Minimum amount: ₦{selectedPlan.price.toLocaleString()}
              </p>

              {/* Currency Selector */}
              <div className="mb-4 relative">
                <button
                  onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
                  className="w-full border border-border rounded-lg px-3 py-2 flex justify-between items-center"
                >
                  {selectedCurrency}
                  <ChevronDown size={16} />
                </button>
                {showCurrencyDropdown && (
                  <div className="absolute mt-1 w-full bg-white border border-border rounded-lg shadow-lg z-10">
                    {["NGN", "USD", "EUR", "GBP", "INR"].map(curr => (
                      <div
                        key={curr}
                        onClick={() => {
                          setSelectedCurrency(curr)
                          setShowCurrencyDropdown(false)
                        }}
                        className="px-3 py-2 hover:bg-surface cursor-pointer"
                      >
                        {curr}
                      </div>
                    ))}
                  </div>
                )}
              </div> {/* <-- closes Currency Selector wrapper */}

              {/* Amount Input */}
              <div className="mb-4">
                <label
                  htmlFor="investment-amount"
                  className="block text-sm font-medium text-muted mb-1"
                >
                  Enter Investment Amount
                </label>
                <input
                  id="investment-amount"
                  type="number"
                  min={selectedPlan?.price || 0}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder={`Minimum ₦${selectedPlan?.price?.toLocaleString() || 0}`}
                  className="w-full border border-border rounded-lg px-3 py-2"
                />
                {amount && Number(amount) < (selectedPlan?.price || 0) && (
                  <p className="text-xs text-red-500 mt-1">
                    Amount must be at least ₦{selectedPlan?.price?.toLocaleString()}
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-surface-light rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmInvestment}
                  disabled={!amount || Number(amount) < (selectedPlan?.price || 0)}
                  className={`px-4 py-2 rounded-lg ${
                    !amount || Number(amount) < (selectedPlan?.price || 0)
                      ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                      : "bg-primary text-white"
                  }`}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>  
        )}        
      </div>       
    </DashboardLayout> 
  )              
}                
