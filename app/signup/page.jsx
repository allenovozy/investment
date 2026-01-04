"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { User, Mail, Lock, UserPlus, Phone, Globe } from "lucide-react"
import AuthLayout from "@/components/auth-layout"

export default function SignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    password: "",
    confirmPassword: "",
    inviteCode: "",
    country: "",
    phone: "",       // ✅ added
    agreeTerms: false,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    if (!formData.agreeTerms) {
      setError("Please agree to the terms and conditions")
      setLoading(false)
      return
    }

    try {
      const res = await fetch("http://192.168.1.150/server/Api/signup.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          inviteCode: formData.inviteCode,
          country: formData.country,
          phone: formData.phone,  // ✅ send country
        }),
      })

      const data = await res.json()
      if (data.status === "success") {
        router.push("/login")
      } else {
        setError(data.message || "Signup failed")
      }
    } catch (err) {
      setError("Network error, please try again")
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
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Create Account</h1>
          <p className="text-muted">Join our investment platform</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {error && (
            <div className="p-3 bg-error/10 border border-error/30 rounded-lg text-error text-sm">
              {error}
            </div>
          )}

          {/* Full Name */}
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-sm text-muted">
              <User size={16} /> Full Name
            </label>
            <input
              type="text"
              placeholder="Please enter your full name"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full px-4 py-3 bg-transparent border-b border-border focus:border-primary outline-none transition-colors"
              required
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-sm text-muted">
              <Mail size={16} /> Login Email
            </label>
            <input
              type="email"
              placeholder="Please enter your email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 bg-transparent border-b border-border focus:border-primary outline-none transition-colors"
              required
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-sm text-muted">
              <Lock size={16} /> Login Password
            </label>
            <input
              type="password"
              placeholder="Please enter your password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 bg-transparent border-b border-border focus:border-primary outline-none transition-colors"
              required
            />
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-sm text-muted">
              <Lock size={16} /> Confirm Password
            </label>
            <input
              type="password"
              placeholder="Please enter password again"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="w-full px-4 py-3 bg-transparent border-b border-border focus:border-primary outline-none transition-colors"
              required
            />
          </div>

          
          {/* {phone number} */}
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-sm text-muted">
              <Phone size={11} /> Phone number
            </label>
            <input
              type="tel"
              placeholder="please enter phone number"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="w-full px-4 py-3 bg-transparent border-b border-border focus:border-primary outline-none transition-colors"
              required
            />
          </div>


          {/* Invitation Code */}
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-sm text-muted">
              <UserPlus size={16} /> Invitation Code
            </label>
            <input
              type="text"
              placeholder="c1X7tLgO"
              value={formData.inviteCode}
              onChange={(e) => setFormData({ ...formData, inviteCode: e.target.value })}
              className="w-full px-4 py-3 bg-transparent border-b border-border focus:border-primary outline-none transition-colors"
            />
          </div>

          {/* Country Dropdown */}
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-sm text-muted">
              <Globe size={16} /> Country
            </label>
            <select
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              className="w-full px-4 py-3 bg-transparent border-b border-border focus:border-primary outline-none transition-colors"
              required
            >
              <option value="">Select Country</option>
              <option value="Nigeria">Nigeria</option>
              <option value="United States">United States</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="European Union">European Union</option>
              <option value="Indian Union">Indian Union</option>
            </select>
          </div>

          {/* Terms */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.agreeTerms}
              onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
              className="w-4 h-4 accent-primary"
            />
            <span className="text-sm text-muted">
              I have read and agree to the{" "}
              <Link href="/terms" className="text-primary hover:underline">
                User Agreement
              </Link>
            </span>
          </label>

          <Link
            href="/login"
            className="text-center text-sm text-muted hover:text-foreground transition-colors"
          >
            Already have an account? Login here...
          </Link>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-primary text-background font-semibold rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>
      </div>
    </AuthLayout>
  )
}