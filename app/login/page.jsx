"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Mail, Lock, Globe } from "lucide-react"
import AuthLayout from "@/components/auth-layout"

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
  
    try {
      const res = await fetch("https://faitcurrency.online/server/Api/login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      })
  
      const data = await res.json()
      if (data.success) {
        // Save user info in localStorage
        localStorage.setItem("user", JSON.stringify(data.user))
  
        // ✅ Redirect based on role
        if (data.user.role === "admin") {
          router.push("/admin")
        } else {
          router.push("/dashboard")
        }
      } else {
        setError(data.message || "Login failed")
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
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-background font-bold text-2xl">FC</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Welcome Back</h1>
          <p className="text-muted">Sign in to your account</p>
        </div>

        {/* Language button */}
        <button className="flex items-center justify-center gap-2 w-full px-4 py-2 mb-6 bg-surface-light rounded-lg hover:bg-border transition-colors">
          <Globe size={16} />
          <span className="text-sm">English</span>
        </button>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {error && (
            <div className="p-3 bg-error/10 border border-error/30 rounded-lg text-error text-sm">
              {error}
            </div>
          )}

          {/* Email input */}
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-sm text-muted">
              <Mail size={16} /> Login Email
            </label>
            <input
              type="email"
              placeholder="Please enter your email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-4 py-3 bg-transparent border-b border-border focus:border-primary outline-none transition-colors"
              required
            />
          </div>

          {/* Password input */}
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-sm text-muted">
              <Lock size={16} /> Login Password
            </label>
            <input
              type="password"
              placeholder="Please enter your password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full px-4 py-3 bg-transparent border-b border-border focus:border-primary outline-none transition-colors"
              required
            />
          </div>

          {/* Forgotten password */}
          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-sm text-muted hover:text-primary transition-colors"
            >
              Forgotten password?
            </Link>
          </div>

          {/* Signup link */}
          <Link
            href="/signup"
            className="text-center text-sm text-muted hover:text-foreground transition-colors"
          >
            Create an Account. Click to Register.
          </Link>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-primary text-background font-semibold rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
      </div>
    </AuthLayout>
  )
}
