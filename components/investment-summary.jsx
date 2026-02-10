import { useEffect, useState } from "react"

function Countdown({ startDate, durationDays, onExpire }) {
  const [timeLeft, setTimeLeft] = useState("")

  useEffect(() => {
    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + Number(durationDays))

    const updateCountdown = () => {
      const now = new Date()
      const diff = endDate - now

      if (diff <= 0) {
        setTimeLeft("Expired")
        if (onExpire) onExpire()   // notify parent to remove investment
        return
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
      const minutes = Math.floor((diff / (1000 * 60)) % 60)
      const seconds = Math.floor((diff / 1000) % 60)

      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`)
    }

    updateCountdown()
    const timer = setInterval(updateCountdown, 1000)

    return () => clearInterval(timer)
  }, [startDate, durationDays, onExpire])

  return <p className="text-xs text-warning">{timeLeft}</p>
}

export default function InvestmentSummary({ userId }) {
  const [investments, setInvestments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) {
      console.log("No userId provided")
      setLoading(false)
      return
    }

    fetch("https://faitcurrency.online/server/Api/investments.php", {
      method: "GET",
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => {
        console.log("Investment API response:", data)
        if (data.success) setInvestments(data.investments)
      })
      .catch(err => {
        console.error("Failed to load investments:", err)
        alert("Failed to load investments")
      })
      .finally(() => setLoading(false))
  }, [userId])

  const removeInvestment = (index) => {
    setInvestments(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="bg-surface rounded-xl p-5">
      <h3 className="text-lg font-semibold mb-4">Active Investments</h3>
      <div className="flex flex-col gap-3">
        {investments.map((inv, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-surface-light rounded-lg"
          >
            <div>
              <p className="font-medium">{inv.plan_name}</p>
              <p className="text-xs text-muted">{inv.plan_duration_days} days</p>
              {/* Countdown with auto-remove */}
              <Countdown
                startDate={inv.start_date}
                durationDays={inv.plan_duration_days}
                onExpire={() => removeInvestment(index)}
              />
            </div>
            <div className="text-right">
              <p className="font-semibold">
                ₦{Number(inv.amount).toLocaleString()}
              </p>
              <p className="text-xs text-success">
                +{Number(inv.returns)}% ROI
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
