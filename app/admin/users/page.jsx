"use client"
import { useEffect, useState } from "react"
import { Save, Trash2, Edit, Eye } from "lucide-react"
import DataTable from "../components/DataTable"
import "../css/Users.css"
import "../css/Index.css"

const Users = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ userId: "", currency: "USD", amount: "" })
  const [selectedUser, setSelectedUser] = useState(null) // for view/edit modal

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://185.27.134.59/server/Api/Admin/users/list.php", {
        credentials: "include",
      })
      const data = await res.json()
      if (data.success) setUsers(data.users || [])
    } catch (err) {
      console.error("Error fetching users:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleAdjustBalance = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch("http://185.27.134.59/server/Api/Admin/users/update_balance.php", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: Number(form.userId),
          currency: form.currency,
          amount: Number(form.amount),
        }),
      })
      const data = await res.json()
      if (data.success) {
        setForm({ userId: "", currency: "USD", amount: "" })
        fetchUsers()
      } else {
        alert(data.message || "Failed to adjust balance")
      }
    } catch (err) {
      console.error("Error:", err)
      alert("Error adjusting balance")
    }
  }

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return
    try {
      const res = await fetch("http://185.27.134.59/server/Api/Admin/users/delete.php", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      const data = await res.json()
      if (data.success) {
        fetchUsers()
      } else {
        alert(data.message || "Failed to delete user")
      }
    } catch (err) {
      console.error("Error deleting user:", err)
    }
  }

  const handleViewUser = async (user) => {
    try {
      const res = await fetch(`http://185.27.134.59/server/Api/Admin/users/activity.php?id=${user.id}`, {
        credentials: "include",
      })
      const data = await res.json()
      if (data.success) {
        setSelectedUser(data.user)
      } else {
        alert(data.message || "Failed to fetch user activity")
      }
    } catch (err) {
      console.error("Error fetching user activity:", err)
    }
  }
// 1. Open modal with user data
const openEditModal = (user) => {
  setSelectedUser(user)
}

// 2. Submit edit form
const handleEditSubmit = async (e) => {
  e.preventDefault()
  try {
    const res = await fetch("http://185.27.134.59/server/Api/Admin/users/edit.php", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: selectedUser.id,
        fullName: selectedUser.fullName,
        email: selectedUser.email,
        vip_level: selectedUser.vip_level,
      }),
    })
    const data = await res.json()
    if (data.success) {
      alert("User updated successfully")
      fetchUsers()
      setSelectedUser(null) // close modal
    } else {
      alert(data.message || "Failed to update user")
    }
  } catch (err) {
    console.error("Error updating user:", err)
    alert("Error updating user")
  }
}
const columns = [
  { key: "fullName", label: "Name" },
  { key: "email", label: "Email" },
  { key: "usd_balance", label: "USD Balance", render: (val) => `$${val}` },
  { key: "ngn_balance", label: "NGN Balance", render: (val) => `₦${val}` },
  { key: "eur_balance", label: "EUR Balance", render: (val) => `€${val}` },
  { key: "gbp_balance", label: "GBP Balance", render: (val) => `£${val}` },
  { key: "inr_balance", label: "INR Balance", render: (val) => `₹${val}` },
  { key: "points_balance", label: "Points Balance", render: (val) => `${val}` },
  { key: "investments", label: "Investments", render: (val) => `${val}` },
  { key: "invite_code", label: "Invite Code", render: (val) => `${val}` },
  { key: "earnings", label: "Total Earnings", render: (val) => `$${val}` },
  { key: "vip_level", label: "VIP Level" },
  { key: "created_at", label: "Joined", render: (val) => new Date(val).toLocaleDateString() },
  {
    key: "actions",
    label: "Actions",
    render: (_, row) => (
      <div className="actions">
       <button className="btn-action view" onClick={() => handleViewUser(row)}>
        <Eye size={16} /> View
      </button>
      <button className="btn-action edit" onClick={() => openEditModal(row)}>
        <Edit size={16} /> Edit
      </button>
      <button className="btn-action delete" onClick={() => handleDeleteUser(row.id)}>
        <Trash2 size={16} /> Delete
      </button>
      </div>
    ),
  },
]
  return (
    <div className="users-page">
      <div className="page-header">
        <h1>Users Management</h1>
        <p>Manage user accounts, adjust balances, edit, view, or delete users</p>
      </div>

      <div className="adjustment-form">
        <h2>Adjust User Balance</h2>
        <form onSubmit={handleAdjustBalance}>
          <div className="form-group">
            <label>Select User</label>
            <select
              value={form.userId}
              onChange={(e) => setForm({ ...form, userId: e.target.value })}
              required
            >
              <option value="">Choose a user...</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.fullName} ({u.email})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Currency</label>
            <select
              value={form.currency}
              onChange={(e) => setForm({ ...form, currency: e.target.value })}
            >
              <option>USD</option>
              <option>NGN</option>
              <option>GBP</option>
              <option>EUR</option>
              <option>INR</option>
            </select>
          </div>

          <div className="form-group">
            <label>Amount</label>
            <input
              type="number"
              placeholder="Enter amount"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary">
            <Save size={18} /> Adjust Balance
          </button>
        </form>
      </div>

      <div className="users-table">
        <h2>All Users</h2>
        {loading ? (
          <div className="loading">Loading users...</div>
        ) : (
          <DataTable columns={columns} data={users} />
        )}
      </div>

      {selectedUser && (
  <div className="user-modal">
    <div className="modal-content">
      <h2>Edit User</h2>
      <form onSubmit={handleEditSubmit}>
        <label>Name</label>
        <input
          type="text"
          value={selectedUser.fullName}
          onChange={(e) => setSelectedUser({ ...selectedUser, fullName: e.target.value })}
        />
        <label>Email</label>
        <input
          type="email"
          value={selectedUser.email}
          onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
        />
        <label>VIP Level</label>
        <input
          type="number"
          value={selectedUser.vip_level}
          onChange={(e) => setSelectedUser({ ...selectedUser, vip_level: e.target.value })}
        />
        <button type="submit" className="save-btn">Save Changes</button>
        <button type="button" className="cancel-btn" onClick={() => setSelectedUser(null)}>Cancel</button>
        </form>
    </div>
  </div>
)}
    </div>
  )
}

export default Users
