"use client"

import { useEffect, useState } from "react"

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Form state
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [targetUser, setTargetUser] = useState("all") // "all" or userId

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [notifRes, usersRes] = await Promise.all([
          fetch("https://faitcurrency.online/server/Api/get_notifications.php", {
            method: "GET",
            credentials: "include",
          }),
          fetch("https://faitcurrency.online/server/Api/Admin/users/list.php", {
            method: "GET",
            credentials: "include",
          }),
        ])

        if (notifRes.status === 401 || usersRes.status === 401) {
          setError("Not authenticated. Please log in.")
          return
        }

        const notifData = await notifRes.json()
        const usersData = await usersRes.json()

        if (!notifData.success) {
          setError(notifData.message || "Failed to load notifications")
          return
        }
        if (!usersData.success) {
          setError(usersData.message || "Failed to load users")
          return
        }

        setNotifications(notifData.notifications || [])
        setUsers(usersData.users || [])
      } catch (err) {
        setError("Error fetching data: " + err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleSendNotification = async () => {
    try {
      const res = await fetch("https://faitcurrency.online/server/Api/Admin/send_notification.php", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          target: targetUser, // "all" or userId
        }),
      })

      const data = await res.json()
      if (!data.success) {
        alert("Failed to send notification: " + data.message)
        return
      }

      alert("Notification sent successfully")
      setTitle("")
      setContent("")
      setTargetUser("all")
    } catch (err) {
      alert("Error sending notification: " + err.message)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Loading admin panel...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-8">
      <h1 className="text-2xl font-bold">Admin Panel</h1>

      {/* Notification Form */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Send Notification</h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
          <textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
          <select
            value={targetUser}
            onChange={(e) => setTargetUser(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="all">All Users</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.fullName} ({u.email})
              </option>
            ))}
          </select>
          <button
            onClick={handleSendNotification}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Send
          </button>
        </div>
      </div>

      {/* Notifications Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <h2 className="text-lg font-semibold p-4">Notifications</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Title</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Content</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Target</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Time</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {notifications.map((n) => (
              <tr key={n.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-sm font-medium text-gray-900">{n.title}</td>
                <td className="px-4 py-2 text-sm text-gray-700">{n.content}</td>
                <td className="px-4 py-2 text-sm text-gray-500">{n.type}</td>
                <td className="px-4 py-2 text-sm text-gray-500">{n.time}</td>
                <td className="px-4 py-2">
                  {n.read ? (
                    <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-700">Read</span>
                  ) : (
                    <span className="px-2 py-1 text-xs rounded bg-yellow-100 text-yellow-700">Unread</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Users Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <h2 className="text-lg font-semibold p-4">Users</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Name</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Email</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Country</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-sm font-medium text-gray-900">{u.fullName}</td>
                <td className="px-4 py-2 text-sm text-gray-700">{u.email}</td>
                <td className="px-4 py-2 text-sm text-gray-500">{u.country}</td>
                <td className="px-4 py-2">
                  <button className="px-3 py-1 text-xs bg-indigo-600 text-white rounded hover:bg-indigo-700">
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}



