"use client"

import { useEffect, useState } from "react"
import "../css/Referrals.css"
import "../css/Index.css"

const Referrals = () => {
  const [referrals, setReferrals] = useState([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(null)
  const [statusMap, setStatusMap] = useState({})

  useEffect(() => {
    fetchReferrals()
  }, [])

  const fetchReferrals = async () => {
    try {
      const res = await fetch("https://185.27.134.59/server/Api/Admin/referrals/list.php", {
        credentials: "include",
      })
      const data = await res.json()
      setReferrals(data.referrals || [])
    } catch (err) {
      console.error("Error fetching referrals:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (id, status) => {
    setUpdating(id)
    try {
      const res = await fetch("https://185.27.134.59/server/Api/Admin/referrals/update_status.php", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      })
      const data = await res.json()
      if (data.success) {
        fetchReferrals()
        setStatusMap({})
      } else {
        alert(data.message || "Failed to update")
      }
    } catch (err) {
      console.error("Error:", err)
      alert("Error updating referral status")
    } finally {
      setUpdating(null)
    }
  }

  const columns = [
    { key: "id", label: "ID" },
    { key: "referrer_email", label: "Referrer" },
    { key: "new_user_email", label: "New User" },
    {
      key: "bonus_amount",
      label: "Bonus",
      render: (val) => `$${val}`,
    },
    {
      key: "status",
      label: "Status",
      render: (val) => <span className={`status-badge status-${val}`}>{val}</span>,
    },
    {
      key: "created_at",
      label: "Date",
      render: (val) => new Date(val).toLocaleDateString(),
    },
  ]

  return (
    <div className="referrals-page">
      <div className="page-header">
        <h1>Referral Program</h1>
        <p>Manage referral bonuses and status updates</p>
      </div>

      {loading ? (
        <div className="loading">Loading referrals...</div>
      ) : (
        <div className="referrals-list">
          {referrals.length === 0 ? (
            <div className="empty-state">No referrals found</div>
          ) : (
            referrals.map((ref) => (
              <div key={ref.id} className="referral-card">
                <div className="referral-header">
                  <div className="referral-id">#{ref.id}</div>
                  <span className={`status-badge status-${ref.status}`}>{ref.status}</span>
                </div>
                <div className="referral-info">
                  <div className="info-item">
                    <span className="label">Referrer</span>
                    <span className="value">{ref.referrer_email}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">New User</span>
                    <span className="value">{ref.new_user_email}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Bonus</span>
                    <span className="value">${ref.bonus_amount}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Date</span>
                    <span className="value">{new Date(ref.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                {ref.status === "pending" && (
                  <div className="referral-actions">
                    <select
                      value={statusMap[ref.id] || ref.status}
                      onChange={(e) => setStatusMap({ ...statusMap, [ref.id]: e.target.value })}
                    >
                      <option value="pending">Pending</option>
                      <option value="active">Active</option>
                      <option value="revoked">Revoked</option>
                    </select>
                    <button
                      className="btn btn-update"
                      onClick={() => handleStatusChange(ref.id, statusMap[ref.id] || ref.status)}
                      disabled={updating === ref.id}
                    >
                      Update
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default Referrals
