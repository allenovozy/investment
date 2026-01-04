"use client"

import { useRef } from "react"
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react"

export default function BalanceDisplay({ balances = [] }) {
  const scrollRef = useRef(null)

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 280
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-surface/80 backdrop-blur-sm rounded-full flex items-center justify-center border border-border hover:bg-surface-light transition-colors hidden md:flex"
        aria-label="Scroll left"
      >
        <ChevronLeft size={20} />
      </button>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide px-0 md:px-12 pb-2 snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {balances.map((currency) => (
          <div
            key={currency.id}
            className={`flex-shrink-0 w-[260px] sm:w-[280px] bg-gradient-to-br ${currency.color} border border-border rounded-xl p-5 snap-start`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="font-medium">{currency.name}</span>
                <ExternalLink size={14} className="text-muted" />
              </div>
              <span className="text-sm text-muted">{currency.symbol}</span>
            </div>

            <p className="text-2xl font-bold mb-3">
              {currency.icon}
              {Number(currency.balance || 0).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>

            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted">Max Profit:</span>
              <span className="font-medium text-primary">
                {currency.icon}
                {Number(currency.maxProfit || 0).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-surface/80 backdrop-blur-sm rounded-full flex items-center justify-center border border-border hover:bg-surface-light transition-colors hidden md:flex"
        aria-label="Scroll right"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  )
}
