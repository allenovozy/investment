"use client"
import Link from "next/link"
import { ArrowRight, Shield, TrendingUp, Users, Zap } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"


const slides = [
  {
    src: "/images/investor1.jpg",
    title: "Real People. Real Profits.",
    desc: "Thousands of users get paid daily from smart investments",
  },
  {
    src: "/images/investor2.jpg",
    title: "Secure & Transparent",
    desc: "Withdraw earnings instantly to your wallet",
  },
  {
    src: "/images/investor3.jpg",
    title: "Grow Wealth Faster",
    desc: "Earn consistent returns with FiatCurrency",
  },
  {
    src:"/images/image-2.jpeg",
    title:"We provide the best services..",
    desc:"Maximize your usage and earn more",
  },
]

function HeroSlideshow() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative w-full h-[420px] md:h-[520px] rounded-3xl overflow-hidden shadow-lg mb-16">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={slide.src}
            alt={slide.title}
            fill
            className="object-cover"
            priority={index === 0}
          />
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="text-center px-6">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                {slide.title}
              </h2>
              <p className="text-white/90 max-w-xl mx-auto text-lg">
                {slide.desc}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <span className="text-background font-bold">
               <img
                 src="/android-chrome-192x192.png"
                 alt="App logo"
                 className="w-6 h-6"
                />
              </span>
            </div>
            <span className="font-semibold text-lg text-orange-light-400">FiatCurrency</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-muted hover:text-foreground transition-colors">
              Login
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 bg-primary text-background font-medium rounded-lg hover:bg-primary-dark transition-colors text-sm"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
<section className="pt-32 pb-20 px-4">
  <div className="max-w-6xl mx-auto text-center">

    {/* Slideshow */}
    <HeroSlideshow />

    <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
      Invest Smarter with <span className="text-primary">FiatCurrency</span>
    </h1>

    <p className="text-lg md:text-xl text-muted mb-8 max-w-2xl mx-auto">
      Join thousands of investors earning consistent returns through our secure and transparent investment platform.
    </p>

    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <Link
        href="/signup"
        className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-background font-semibold rounded-xl hover:bg-primary-dark transition-colors"
      >
        Start Investing <ArrowRight size={20} />
      </Link>
      <Link
        href="/about"
        className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-surface border border-border font-semibold rounded-xl hover:bg-surface-light transition-colors"
      >
        Learn More
      </Link>
    </div>
  </div>
</section>


      {/* Features */}
      <section className="py-20 px-4 bg-surface">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose FiatCurrency?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Shield,
                title: "Bank-Grade Security",
                desc: "Your funds are protected with enterprise-level security",
              },
              { icon: TrendingUp, title: "High Returns", desc: "Earn up to 25% returns on your investments" },
              { icon: Users, title: "Referral Program", desc: "Earn commissions by inviting friends" },
              { icon: Zap, title: "Instant Withdrawals", desc: "Access your funds anytime, anywhere" },
            ].map((feature, i) => (
              <div key={i} className="bg-background rounded-xl p-6">
                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon size={24} className="text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: "$50M+", label: "Total Invested" },
            { value: "25K+", label: "Active Users" },
            { value: "99.9%", label: "Uptime" },
            { value: "24/7", label: "Support" },
          ].map((stat, i) => (
            <div key={i}>
              <p className="text-3xl md:text-4xl font-bold text-primary">{stat.value}</p>
              <p className="text-muted">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

          {/* Proof of Payout */}
<section className="py-20 px-4 bg-surface">
  <div className="max-w-6xl mx-auto">
    <h2 className="text-3xl font-bold text-center mb-12">
      Investors Getting Paid
    </h2>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {["investor1.jpg", "investor2.jpg", "investor3.jpg"].map((img, i) => (
        <div
          key={i}
          className="relative h-64 rounded-2xl overflow-hidden shadow-md"
        >
          <Image
            src={`/images/${img}`}
            alt="Investment payout proof"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex items-end p-4">
            <p className="text-white font-semibold">
              Withdrawal Successful ✔
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/20 to-primary/5">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Investing?</h2>
          <p className="text-muted mb-8">Join FiatCurrency today and start growing your wealth.</p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-background font-semibold rounded-xl hover:bg-primary-dark transition-colors"
          >
            Create Free Account <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-background font-bold text-sm">FC</span>
            </div>
            <span className="font-semibold">FiatCurrency</span>
          </div>
          <p className="text-sm text-muted">2024 FiatCurrency. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
