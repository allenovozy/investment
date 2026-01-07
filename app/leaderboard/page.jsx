"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard-layout"
import { Trophy, Medal, Award, ChevronDown, TrendingUp } from "lucide-react"

const regions = ["All Regions", "North America", "Europe", "Asia", "Africa", "South America"]
const rankStyles = {
  1: { bg: "bg-yellow-500/20", text: "text-yellow-500", icon: Trophy },
  2: { bg: "bg-slate-400/20", text: "text-slate-400", icon: Medal },
  3: { bg: "bg-orange-500/20", text: "text-orange-500", icon: Award },
}

export default function LeaderboardPage() {
  const router = useRouter()
  const [selectedRegion, setSelectedRegion] = useState(regions[0])
  const [showRegionDropdown, setShowRegionDropdown] = useState(true)
  const [leaderboardData, setLeaderboardData] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true)
      try {
        const res = await fetch(
          `http://185.27.134.59/server/Api/get_leaderboard.php?region=${encodeURIComponent(selectedRegion)}`,
          {
            method: "GET",
            credentials: "include",
          }
        )
  
        if (res.status === 401) {
          router.replace("/login")
          return
        }
  
        const data = await res.json()
        if (data.success) {
          setLeaderboardData(data.leaderboard)
        } else {
          alert(data.message)
        }
      } catch (err) {
        alert("Error fetching leaderboard")
      } finally {
        setLoading(false)
      }
    }
    fetchLeaderboard()
  }, [router, selectedRegion])

  return (
    <DashboardLayout user={user}>
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Leaderboard</h1>
            <p className="text-muted">Top investors by profit rate</p>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowRegionDropdown(!showRegionDropdown)}
              className="flex items-center gap-2 bg-surface rounded-xl px-4 py-2.5 border border-border min-w-[160px]"
            >
              <span className="font-medium">{selectedRegion}</span>
              <ChevronDown size={16} className="ml-auto" />
            </button>
            {showRegionDropdown && (
              <div className="absolute right-0 top-full mt-1 w-full bg-surface border border-border rounded-lg shadow-lg z-10">
                {regions.map((region) => (
                  <button
                    key={region}
                    onClick={() => {
                      setSelectedRegion(region)
                      setShowRegionDropdown(false)
                    }}
                    className={`block w-full text-left px-4 py-2.5 hover:bg-surface-light transition-colors text-sm
                      ${selectedRegion === region ? "text-primary bg-primary/5" : ""}`}
                  >
                    {region}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <div className="text-center p-8 text-muted">Loading leaderboard...</div>
        ) : (
          <div className="bg-surface rounded-xl overflow-hidden">
            <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-surface-light border-b border-border text-sm font-medium text-muted">
              <div className="col-span-5 sm:col-span-6">Investors</div>
              <div className="col-span-3 text-center hidden sm:block">Profit Rate</div>
              <div className="col-span-7 sm:col-span-3 text-right">Total Profit</div>
            </div>

            <div className="divide-y divide-border">
              {leaderboardData.map((entry) => {
                const style = rankStyles[entry.rank]
                const Icon = style?.icon

                return (
                  <div
                    key={entry.id}
                    className="grid grid-cols-12 gap-4 px-4 py-4 hover:bg-surface-light/50 transition-colors items-center"
                  >
                    <div className="col-span-5 sm:col-span-6 flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0
                          ${style ? `${style.bg} ${style.text}` : "bg-surface-light text-muted"}`}
                      >
                        {Icon ? <Icon size={18} /> : <span className="font-bold text-sm">{entry.rank}</span>}
                      </div>
                      <span className="text-sm truncate">{entry.email}</span>
                    </div>

                    <div className="col-span-3 hidden sm:flex items-center justify-center gap-1">
                      <TrendingUp size={14} className="text-green-400" />
                      <span className="font-semibold text-green-400">{entry.profit_rate}%</span>
                    </div>

                    <div className="col-span-7 sm:col-span-3 text-right">
                      <span className="font-semibold">${parseFloat(entry.total_profit).toLocaleString()}</span>
                      <span className="sm:hidden text-xs text-green-400 ml-2">{entry.profit_rate}%</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
