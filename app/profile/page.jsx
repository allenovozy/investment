"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import { User, Mail, Phone, MapPin, Shield, Bell, LogOut } from "lucide-react"

export default function ProfilePage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("http://185.27.134.59/server/Api/dashboard.php", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUser({
            id: data.user.id,
            name: data.user.fullName,
            email: data.user.email,
            phone: data.user.phone,
            country: data.user.country,
            verified: !!data.user.verified,
          })
        }
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="p-6 text-center">Loading profile...</div>
  if (!user) return <div className="p-6 text-center">Profile not found</div>

  return (
    <DashboardLayout user={user}>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Profile</h1>

        <div className="bg-surface rounded-xl p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center">
              <User size={40} className="text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <p className="text-muted">{user.email}</p>
              {user.verified && (
                <span className="inline-flex items-center gap-1 text-xs text-success bg-success/10 px-2 py-1 rounded-full mt-1">
                  <Shield size={12} /> Verified
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 p-4 bg-surface-light rounded-xl">
              <Mail size={20} className="text-muted" />
              <div>
                <p className="text-sm text-muted">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-surface-light rounded-xl">
              <Phone size={20} className="text-muted" />
              <div>
                <p className="text-sm text-muted">Phone</p>
                <p className="font-medium">{user.phone}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-surface-light rounded-xl">
              <MapPin size={20} className="text-muted" />
              <div>
                <p className="text-sm text-muted">Country</p>
                <p className="font-medium">{user.country}</p>
              </div>
            </div>
          </div>
        </div>

        {/* <div className="bg-surface rounded-xl p-6">
          <h3 className="font-semibold mb-4">Quick Actions</h3>
          <div className="flex flex-col gap-3">
            <button className="flex items-center gap-3 p-4 bg-surface-light rounded-xl hover:bg-border transition-colors text-left">
              <Bell size={20} className="text-muted" />
              <span>Notification Settings</span>
            </button>
            <button className="flex items-center gap-3 p-4 bg-surface-light rounded-xl hover:bg-border transition-colors text-left">
              <Shield size={20} className="text-muted" />
              <span>Security Settings</span>
            </button>
            <button className="flex items-center gap-3 p-4 bg-error/10 rounded-xl hover:bg-error/20 transition-colors text-left text-error">
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div> */}
      </div>
    </DashboardLayout>
  )
}
