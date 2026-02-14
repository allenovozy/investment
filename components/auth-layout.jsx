import Link from "next/link"

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="flex items-center justify-between p-4 border-b border-border">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-background font-bold text-sm">
              <img
                 src="/android-chrome-192x192.png"
                 alt="App logo"
                 className="w-6 h-6"
                /></span>
          </div>
          <span className="font-semibold hidden sm:inline">FiatCurrency</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/signup" className="text-sm text-muted hover:text-foreground transition-colors">
            Sign Up
          </Link>
          <Link href="/login" className="text-sm text-muted hover:text-foreground transition-colors">
            Login
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">{children}</main>
    </div>
  )
}
