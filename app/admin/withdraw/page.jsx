"use client"

import { useEffect, useState } from "react"
import { Check, X, Clock, DollarSign } from "lucide-react"
import "../css/withdraw.css"

const Withdraw = () => {
  const [withdrawals, setWithdrawals] = useState([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(null)

  useEffect(() => {
    fetchWithdrawals()
  }, [])

  const fetchWithdrawals = async () => {
    try {
      const res = await fetch("http://185.27.134.59/server/Api/Admin/withdrawals/list.php", {
        credentials: "include",
      })
      const data = await res.json()
      setWithdrawals(data.withdrawals || [])
    } catch (err) {
      console.error("Error fetching withdrawals:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (id, status) => {
    setProcessing(id)
    try {
      const res = await fetch("http://185.27.134.59/server/Api/Admin/withdrawals/update_status.php", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      })
      const data = await res.json()
      if (data.success) {
        fetchWithdrawals()
      } else {
        alert(data.message || "Failed to update status")
      }
    } catch (err) {
      console.error("Error:", err)
      alert("Error updating status")
    } finally {
      setProcessing(null)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <Check size={16} />
      case "rejected":
        return <X size={16} />
      case "pending":
        return <Clock size={16} />
      default:
        return <DollarSign size={16} />
    }
  }

  const columns = [
    { key: "id", label: "ID" },
    { key: "user_id", label: "User ID" },
    { key: "fullName", label: "FullName"},
    {
      key: "amount",
      label: "Amount",
      render: (val, row) => `${val} ${row.currency}`,
    },
    {
      key: "method",
      label: "Method",
      render: (val) => (val ? val : "N/A"),
    },
    { key: "details", label: "Details"},
    {
      key: "status",
      label: "Status",
      render: (val) => (
        <span className={`status-badge status-${val}`}>
          {getStatusIcon(val)} {val}
        </span>
      ),
    },
    {
      key: "date",
      label: "Date",
      render: (val) => new Date(val).toLocaleDateString(),
    },
  ]

  return (
    <div className="withdraw-page">
      <div className="page-header">
        <h1>Withdrawal Requests</h1>
        <p>Manage and process user withdrawal requests</p>
      </div>

      {loading ? (
        <div className="loading">Loading withdrawals...</div>
      ) : (
        <div className="withdrawals-container">
          <div className="withdrawals-table">
            {withdrawals.length === 0 ? (
              <div className="empty-state">No withdrawal requests found</div>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>User</th>
                    <th>FullName</th>
                    <th>Amount</th>
                    <th>Method</th>
                    <th>Details</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {withdrawals.map((wd) => (
                    <tr key={wd.id}>
                      <td>#{wd.id}</td>
                      <td>{wd.user_id}</td>
                      <td>{wd.fullName}</td>
                      <td className="amount">
                        {wd.amount} {wd.currency}
                      </td>
                      <td>{wd.method ? wd.method : "N/A"}</td>
                      <td>{wd.details ? wd.details : "N/A"}</td>
                      <td>
                        <span className={`status-badge status-${wd.status}`}>
                          {getStatusIcon(wd.status)} {wd.status}
                        </span>
                      </td>
                      <td>{new Date(wd.date).toLocaleDateString()}</td>
                      <td className="actions">
                        {wd.status === "pending" && (
                          <>
                            <button
                              className="btn-action approve"
                              onClick={() => handleStatusUpdate(wd.id, "approved")}
                              disabled={processing === wd.id}
                            >
                              Approve
                            </button>
                            <button
                              className="btn-action reject"
                              onClick={() => handleStatusUpdate(wd.id, "rejected")}
                              disabled={processing === wd.id}
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Withdraw
