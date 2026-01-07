"use client"

import { useState } from "react"
import Link from "next/link"
import { Mail, Lock } from "lucide-react"
import AuthLayout from "@/components/auth-layout"

export default function ForgotPasswordPage() {
  const [formData, setFormData] = useState({ email: "", oldPassword: "", newPassword: "" })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")
    setError("")

    try {
      const res = await fetch("https://185.27.134.59/server/Api/forgot_password.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await res.json()
      if (data.success) {
        setMessage(data.message)
        setFormData({ email: "", oldPassword: "", newPassword: "" })
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError("Error connecting to server")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-background font-bold text-2xl">FC</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Reset Password</h1>
          <p className="text-muted">Enter your email, old password, and new password</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {error && (
            <div className="p-3 bg-error/10 border border-error/30 rounded-lg text-error text-sm">
              {error}
            </div>
          )}
          {message && (
            <div className="p-3 bg-success/10 border border-success/30 rounded-lg text-success text-sm">
              {message}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-sm text-muted">
              <Mail size={16} /> Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your registered email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-transparent border-b border-border focus:border-primary outline-none transition-colors"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-sm text-muted">
              <Lock size={16} /> Old Password
            </label>
            <input
              type="password"
              name="oldPassword"
              placeholder="Enter your old password"
              value={formData.oldPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-transparent border-b border-border focus:border-primary outline-none transition-colors"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-sm text-muted">
              <Lock size={16} /> New Password
            </label>
            <input
              type="password"
              name="newPassword"
              placeholder="Enter your new password"
              value={formData.newPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-transparent border-b border-border focus:border-primary outline-none transition-colors"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-primary text-background font-semibold rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>

        <div className="text-center mt-6">
          <Link href="/login" className="text-sm text-muted hover:text-primary transition-colors">
            Back to Login
          </Link>
        </div>
      </div>
    </AuthLayout>
  )
}
