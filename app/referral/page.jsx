"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import { Copy, Users, DollarSign, Gift, Check } from "lucide-react"

export default function ReferralPage() {
  const [copied, setCopied] = useState(false)
  const [user, setUser] = useState(null)
  const [referralStats, setReferralStats] = useState(null)

  useEffect(() => {
    // Fetch user info
    const fetchUser = async () => {
      const res = await fetch("https://72.60.93.14/server/Api/get_user.php", {
        method: "GET",
        credentials: "include",
      })
      const data = await res.json()
      if (data.success) setUser(data.user)
    }

    // Fetch referral stats
    const fetchStats = async () => {
      const res = await fetch("https://72.60.93.14/server/Api/get_referrals_stats.php", {
        method: "GET",
        credentials: "include",
      })
      const data = await res.json()
      if (data.success) setReferralStats(data.stats)
    }

    fetchUser()
    fetchStats()
  }, [])

  if (!user || !referralStats) return <div>Loading...</div>

  const referralLink = `https://faitcurrency.online/signup?ref=${user.invite_code}`

  const copyToClipboard = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(referralLink)
        .then(() => {
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        })
        .catch(err => {
          console.error("Clipboard copy failed:", err)
        })
    } else {
      // Fallback for older browsers
      const textArea = document.createElement("textarea")
      textArea.value = referralLink
      document.body.appendChild(textArea)
      textArea.select()
      try {
        document.execCommand("copy")
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        console.error("Fallback copy failed:", err)
      }
      document.body.removeChild(textArea)
    }
  }

  return (
    <DashboardLayout user={user}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Invite Friends & Earn</h1>

        <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-xl p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-shrink-0">
              <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center">
                <Gift size={40} className="text-background" />
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-xl font-semibold mb-2">Share & Earn Rewards</h2>
              <p className="text-muted mb-4">
                Invite your friends to join FiatCurrency and earn up to 10% commission on their investments!
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 flex items-center gap-2 px-4 py-3 bg-surface rounded-lg">
                  <span className="text-sm text-muted truncate">{referralLink}</span>
                </div>
                <button
                  onClick={copyToClipboard}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-background font-semibold rounded-lg hover:bg-primary-dark transition-colors"
                >
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                  {copied ? "Copied!" : "Copy Link"}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-surface rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Users size={18} className="text-blue-500" />
              </div>
            </div>
            <p className="text-2xl font-bold">{referralStats.totalReferrals}</p>
            <p className="text-sm text-muted">Total Referrals</p>
          </div>

          <div className="bg-surface rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Users size={18} className="text-green-500" />
              </div>
            </div>
            <p className="text-2xl font-bold">{referralStats.activeReferrals}</p>
            <p className="text-sm text-muted">Active Referrals</p>
          </div>

          <div className="bg-surface rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-primary/20 rounded-lg">
                <DollarSign size={18} className="text-primary" />
              </div>
            </div>
            <p className="text-2xl font-bold">${Number(referralStats.totalEarnings).toLocaleString()}</p>
            <p className="text-sm text-muted">Total Earnings</p>
          </div>

          <div className="bg-surface rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <DollarSign size={18} className="text-orange-500" />
              </div>
            </div>
            <p className="text-2xl font-bold">${Number(referralStats.pendingEarnings).toLocaleString()}</p>
            <p className="text-sm text-muted">Pending Earnings</p>
          </div>
        </div>
        <div className="bg-surface rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-primary font-bold">1</span>
              </div>
              <h4 className="font-medium mb-2">Share Your Link</h4>
              <p className="text-sm text-muted">Share your unique referral link with friends and family</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-primary font-bold">2</span>
              </div>
              <h4 className="font-medium mb-2">Friends Sign Up</h4>
              <p className="text-sm text-muted">Your friends create an account using your referral link</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-primary font-bold">3</span>
              </div>
              <h4 className="font-medium mb-2">Earn Rewards</h4>
              <p className="text-sm text-muted">Earn up to 10% commission on their investments</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
