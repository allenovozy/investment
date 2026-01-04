import { Lexend, Inter } from "next/font/google"
import "./globals.css"

const lexend = Lexend({ subsets: ["latin"] })
const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Fiat Currency - Investment Platform",
  description: "Secure investment platform for modern investors",
}

export const viewport = {
  themeColor: "#0a0e17",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={lexend.className}>{children}</body>
    </html>
  )
}
