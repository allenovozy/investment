"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import { Crown } from "lucide-react"

export default function UpgradePage() {
  const [currentVip, setCurrentVip] = useState(1)
  const [pointsBalance, setPointsBalance] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [modalType, setModalType] = useState("")
  const [user, setUser] = useState(null)
  const [selectedCurrency, setSelectedCurrency] = useState("USD")

  // Fetch user VIP & points
  useEffect(() => {
    fetch("http://192.168.1.150/server/Api/vip.php", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setUser(data.user)
          setCurrentVip(data.user.vip_level)
          setPointsBalance(data.user.points_balance)
        }
      })
  }, [])

  const handleUpgrade = (tier) => {
    setSelectedItem(tier)
    setModalType("vip")
    setShowModal(true)
  }

  const handleBuyPoints = (pack) => {
    setSelectedItem(pack)
    setModalType("points")
    setShowModal(true)
  }

  const confirmAction = () => {
    const payload = {}
    if (modalType === "vip") {
      payload.upgradeVip = true
      payload.vipLevel = selectedItem.id
      payload.currency = selectedCurrency // ✅ send chosen currency
    } else {
      payload.buyPoints = true
      payload.points = selectedItem.points
      payload.currency = selectedCurrency
    }

    fetch("http://192.168.1.150/server/Api/vip.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message)
        if (data.status === "success") {
          if (modalType === "vip") setCurrentVip(selectedItem.id)
          else setPointsBalance((prev) => prev + selectedItem.points)
        }
      })
      .finally(() => setShowModal(false))
  }

  const vipTiers = [
    { id: 1, price: 1, requirement: 1, reward: "0%", label: "Free" },
    { id: 2, price: 20, requirement: 20, reward: "10%", label: "Upgrade" },
    { id: 3, price: 30, requirement: 60, reward: "15%", label: "Upgrade" },
    { id: 4, price: 50, requirement: 100, reward: "25%", label: "Upgrade" },
  ]

  const pointPacks = [
    { id: "p1", points: 10, price: 5, requirement: 20, reward: "5% + $1 Cashback", label: "Buy" },
  ]

  return (
    <DashboardLayout user={{ ...user, vipLevel: currentVip }}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Crown className="text-primary" /> Upgrade VIP Level
        </h1>
        <p className="text-muted mb-2">Points Balance: {pointsBalance}</p>
        <p className="text-muted mb-6">Current VIP Level: {currentVip}</p>

        {/* VIP Tiers */}
        <div className="space-y-6">
          {vipTiers.map((tier) => (
            <div key={tier.id} className="border rounded-xl p-4 flex flex-col gap-3 bg-surface-light">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-lg">VIP {tier.id}</h2>
                  <p className="text-sm text-muted">Requirement: Current Balance ${tier.requirement.toFixed(2)}</p>
                </div>
                <span className="text-primary font-semibold">${tier.price.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm">Reward: {tier.reward} from Subordinates</p>
                <button
                  onClick={() => handleUpgrade(tier)}
                  className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-dark"
                >
                  {tier.label}
                </button>
              </div>
            </div>
          ))}
        </div>

        <hr className="my-8 border-border" />

        {/* Points Packs */}
        <h2 className="text-xl font-semibold mb-4">Points Packages</h2>
        <div className="space-y-6">
          {pointPacks.map((pack) => (
            <div key={pack.id} className="border rounded-xl p-4 flex flex-col gap-3 bg-surface-light">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-lg">{pack.points} Points</h2>
                  <p className="text-sm text-muted">Requirement: Current Balance ${pack.requirement.toFixed(2)}</p>
                </div>
                <span className="text-primary font-semibold">${pack.price.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm">Reward: {pack.reward}</p>
                <button
                  onClick={() => handleBuyPoints(pack)}
                  className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-dark"
                >
                  {pack.label}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal with currency selection */}
        {showModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-sm w-full">
              <h3 className="font-bold mb-4">Confirm Action</h3>
              <p className="mb-4">
                {modalType === "vip"
                  ? `Upgrade to VIP ${selectedItem.id} for $${selectedItem.price}?`
                  : `Buy ${selectedItem.points} points for $${selectedItem.price}?`}
              </p>

              {/* Currency selector */}
              <label className="block mb-4">
                <span className="text-sm font-medium">Select Currency</span>
                <select
                  value={selectedCurrency}
                  onChange={(e) => setSelectedCurrency(e.target.value)}
                  className="w-full mt-2 border rounded-lg px-3 py-2"
                >
                  <option value="USD">USD</option>
                  <option value="NGN">NGN</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
              </label>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg border border-border"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmAction}
                  className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-dark"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}