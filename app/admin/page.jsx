"use client"

import { useEffect, useState } from "react"
import { Users, TrendingUp, Wallet, Activity } from "lucide-react"
import StatCard from "../../components/StatCard"
import "./css/Dashboard.css"
import "./css/Index.css"

const Dashboard = () => {
  const [dashData, setDashData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("https://185.27.134.59/server/Api/Admin/dashboard.php", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        })
        if (res.status === 401) {
          router.replace("/login")
          return
        }
        const json = await res.json()
        if (json.success) {
          setDashData(json.summary)
        }
      } catch (err) {
        console.error("Error fetching dashboard:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return <div className="loading">Loading dashboard...</div>
  }

  const { totalUsers = 0, totalInvestments = 0, currencyTotals = {}, transactions = [], leaders = [] } = dashData || {}

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Welcome back! Here's your business overview.</p>
      </div>

      <div className="stats-grid">
        <StatCard icon={Users} label="Total Users" value={totalUsers} trend={12} color="primary" />
        <StatCard
          icon={TrendingUp}
          label="Total Investments"
          value={`$${totalInvestments}`}
          trend={8}
          color="success"
        />
        <StatCard icon={Wallet} label="USD Balance" value={`$${currencyTotals.usd || 0}`} trend={-2} color="warning" />
        <StatCard icon={Activity} label="Active Status" value="Healthy" color="success" />
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-panel">
          <div className="panel-header">
            <h2>Currency Totals</h2>
          </div>
          <div className="currency-list">
            {Object.entries(currencyTotals).map(([currency, amount]) => (
              <div key={currency} className="currency-item">
                <div className="currency-code">{currency.toUpperCase()}</div>
                <div className="currency-amount">${amount}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-panel">
          <div className="panel-header">
            <h2>Recent Transactions</h2>
          </div>
          <div className="transaction-list">
            {transactions.slice(0, 5).map((tx, idx) => (
              <div key={idx} className="transaction-item">
                <div className="transaction-status">
                  <span className={`status-badge status-${tx.status}`}>{tx.status}</span>
                </div>
                <div className="transaction-details">
                  <div className="transaction-type">{tx.status}</div>
                  <div className="transaction-amount">${tx.amount}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-panel">
          <div className="panel-header">
            <h2>Top Earners</h2>
          </div>
          <div className="leaders-list">
            {leaders.slice(0, 5).map((leader, idx) => (
              <div key={idx} className="leader-item">
                <div className="leader-rank">#{idx + 1}</div>
                <div className="leader-info">
                  <div className="leader-name">{leader.fullName}</div>
                  <div className="leader-earnings">${leader.earnings}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
