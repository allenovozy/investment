"use client"

import DashboardLayout from "@/components/dashboard-layout"
import { Shield, TrendingUp, Users, Award } from "lucide-react"

export default function AboutPage() {
  const user = {
    name: "John Doe",
    email: "john@example.com",
  }

  const features = [
    {
      icon: Shield,
      title: "Secure Platform",
      description: "Your investments are protected with bank-grade security and encryption.",
    },
    {
      icon: TrendingUp,
      title: "High Returns",
      description: "Earn competitive returns on your investments with our proven strategies.",
    },
    {
      icon: Users,
      title: "Growing Community",
      description: "Join thousands of investors who trust FiatCurrency for their investments.",
    },
    {
      icon: Award,
      title: "Licensed & Regulated",
      description: "We operate under strict regulatory guidelines to ensure your safety.",
    },
  ]

  return (
    <DashboardLayout user={user}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">About FiatCurrency</h1>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            We are a leading investment platform dedicated to helping you grow your wealth through secure and profitable
            investment opportunities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div key={index} className="bg-surface rounded-xl p-6">
                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-4">
                  <Icon size={24} className="text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted">{feature.description}</p>
              </div>
            )
          })}
        </div>

        <div className="bg-surface rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Our Mission</h2>
          <p className="text-muted mb-4">
            At FiatCurrency, we believe that everyone deserves access to high-quality investment opportunities. Our
            mission is to democratize investing by providing a secure, transparent, and user-friendly platform that
            empowers individuals to take control of their financial future.
          </p>
          <p className="text-muted">
            Founded by a team of financial experts and technology enthusiasts, we combine cutting-edge technology with
            proven investment strategies to deliver consistent returns for our investors. We are committed to
            maintaining the highest standards of security, transparency, and customer service.
          </p>
        </div>
      </div>
    </DashboardLayout>
  )
}
