"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import { useRouter } from "next/navigation"
import { Bell, MessageCircle, AlertCircle, CheckCircle, Clock, X } from "lucide-react"

const getIcon = (type) => {
  switch (type) {
    case "message": return MessageCircle
    case "success": return CheckCircle
    case "alert": return AlertCircle
    default: return Bell
  }
}

const getIconColor = (type) => {
  switch (type) {
    case "message": return "bg-blue-500/20 text-blue-400"
    case "success": return "bg-green-500/20 text-green-400"
    case "alert": return "bg-primary/20 text-primary"
    default: return "bg-muted/20 text-muted"
  }
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([])
  const [filter, setFilter] = useState("all")
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [selectedNotification, setSelectedNotification] = useState(null) // ✅ modal state
  const router = useRouter()

  useEffect(() => {
    const loadData = async () => {
      try {
        const userRes = await fetch("https://185.27.134.59/server/Api/get_user.php", {
          credentials: "include",
        })
        if (userRes.status === 401) {
          router.replace("/login")
          return
        }
        const userData = await userRes.json()
        if (!userData.success) {
          alert(userData.message || "Not authenticated")
          return
        }
        setUser(userData.user)

        const notifRes = await fetch("https://185.27.134.59/server/Api/get_notifications.php", {
          credentials: "include",
        })
        if (notifRes.status === 401) {
          router.replace("/login")
          return
        }
        const notifData = await notifRes.json()
        if (notifData.success) {
          setNotifications(notifData.notifications)
        } else {
          alert(notifData.message || "Failed to load notifications")
        }
      } catch (err) {
        console.error("Error loading notifications:", err)
        alert("Error loading notifications")
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [router])

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  const markAsRead = (id) => {
    setNotifications(notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    ))
    setSelectedNotification(null) // close modal
    // optionally: call API to update backend
  }

  const filteredNotifications =
    filter === "all"
      ? notifications
      : notifications.filter((n) => (filter === "unread" ? !n.read : n.read))

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <DashboardLayout user={user}>
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Notifications</h1>
            <p className="text-muted">{unreadCount} unread notifications</p>
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="text-primary text-sm font-medium hover:underline">
              Mark all as read
            </button>
          )}
        </div>

        {loading ? (
          <div className="p-8 text-center text-muted">Loading notifications...</div>
        ) : (
          <div className="bg-surface rounded-xl overflow-hidden">
            <div className="flex border-b border-border">
              {["all", "unread", "read"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`flex-1 py-3 text-sm font-medium capitalize transition-colors
                    ${filter === tab ? "text-primary border-b-2 border-primary" : "text-muted hover:text-foreground"}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="divide-y divide-border">
              {filteredNotifications.length === 0 ? (
                <div className="p-8 text-center text-muted">No notifications found</div>
              ) : (
                filteredNotifications.map((notification) => {
                  const Icon = getIcon(notification.type)
                  return (
                    <div
                      key={notification.id}
                      onClick={() => setSelectedNotification(notification)} // ✅ open modal
                      className={`p-4 flex gap-4 cursor-pointer transition-colors ${!notification.read ? "bg-primary/5" : ""}`}
                    >
                      <div className={`p-3 rounded-full ${getIconColor(notification.type)} shrink-0`}>
                        <Icon size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className={`font-medium ${!notification.read ? "text-foreground" : "text-muted"}`}>
                            {notification.title}
                          </h3>
                          {!notification.read && <div className="w-2 h-2 bg-primary rounded-full shrink-0 mt-2" />}
                        </div>
                        <p className="text-sm text-muted mt-1 line-clamp-2">{notification.content}</p>
                        <div className="flex items-center gap-1 mt-2 text-xs text-muted">
                          <Clock size={12} />
                          <span>{notification.time}</span>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        )}

        {/* ✅ Popup Modal */}
        {selectedNotification && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">{selectedNotification.title}</h2>
                <button onClick={() => setSelectedNotification(null)} className="text-muted hover:text-foreground">
                  <X size={20} />
                </button>
              </div>
              <p className="text-sm text-muted mb-4">{selectedNotification.content}</p>
              <div className="flex justify-end gap-2">
                {!selectedNotification.read && (
                  <button
                    onClick={() => markAsRead(selectedNotification.id)}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
                  >
                    Mark as Read
                  </button>
                )}
                <button
                  onClick={() => setSelectedNotification(null)}
                  className="px-4 py-2 bg-muted text-white rounded-lg hover:bg-muted-dark"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
