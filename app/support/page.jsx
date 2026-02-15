"use client"

import DashboardLayout from "@/components/dashboard-layout"
import { MessageSquare, Send } from "lucide-react"

export default function SupportPage() {
  const user = {
    name: "John Doe",
    email: "john@example.com",
  }

  return (
    <DashboardLayout user={user}>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Customer Support</h1>

        <div className="bg-surface rounded-xl p-6">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare size={40} className="text-primary" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Contact Us</h2>
            <p className="text-muted">We are here to help you 24/7</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a
              href="https://direct.lc.chat/19507746/"
              className="flex items-center gap-4 p-4 bg-surface-light rounded-xl hover:bg-border transition-colors"
            >
              <div className="p-3 bg-primary/20 rounded-xl">
                <MessageSquare size={24} className="text-primary" />
              </div>
              <div>
                <p className="font-medium">Chat with Us</p>
                <p className="text-sm text-muted">Live chat support</p>
              </div>
            </a>

            <a
              href="https://t.me/faitcurrency"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 bg-surface-light rounded-xl hover:bg-border transition-colors"
            >
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <Send size={24} className="text-blue-500" />
              </div>
              <div>
                <p className="font-medium">Telegram</p>
                <p className="text-sm text-muted">@faitcurrency</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
