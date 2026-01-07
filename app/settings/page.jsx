"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import { Mail, Phone, MapPin, Shield } from "lucide-react"

export default function SettingsPage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({ email: "", phone: "", country: "" })

  useEffect(() => {
    fetch("https://185.27.134.59/server/Api/dashboard.php", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUser(data.user)
          setFormData({
            email: data.user.email || "",
            phone: data.user.phone || "",
            country: data.user.country || "",
          })
        }
      })
      .finally(() => setLoading(false))
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSave = () => {
    fetch("https://185.27.134.59/server/Api/settings.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message)
        if (data.success) setUser({ ...user, ...formData })
      })
      .catch((err) => alert("Error: " + err.message))
  }

  if (loading) return <div className="p-6 text-center">Loading settings...</div>

  return (
    <DashboardLayout user={user}>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Account Settings</h1>

        <div className="bg-surface rounded-xl p-6 flex flex-col gap-4">
          <label className="flex items-center gap-3">
            <Mail size={20} className="text-muted" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="flex-1 border rounded-lg px-3 py-2"
              placeholder="Email"
            />
          </label>

          <label className="flex items-center gap-3">
            <Phone size={20} className="text-muted" />
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="flex-1 border rounded-lg px-3 py-2"
              placeholder="Phone"
            />
          </label>

          <label className="flex items-center gap-3">
            <MapPin size={20} className="text-muted" />
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="flex-1 border rounded-lg px-3 py-2"
              placeholder="Country"
            />
          </label>

          <button
            onClick={handleSave}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
          >
            Save Changes
          </button>
        </div>
      </div>
    </DashboardLayout>
  )
}
