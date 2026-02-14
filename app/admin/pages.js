"use client"

import { useEffect, useState } from "react"

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch("https://faitcurrency.online/server/Api/notifications.php", {
          method: "GET",
          credentials: "include",
        })

        if (res.status === 401) {
          setError("Not authenticated. Please log in.")
          return
        }

        const data = await res.json()
        if (!data.success) {
          setError(data.message || "Failed to load notifications")
          return
        }

        setNotifications(data.notifications || [])
      } catch (err) {
        setError("Error fetching notifications: " + err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Loading notifications...</p>
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
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Notifications</h1>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Title</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Content</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Type</th>
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
    </div>
  )
}
