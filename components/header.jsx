"use client";

import Link from "next/link";
import { Bell, User, Menu, ChevronDown, LogOut, Settings, Crown, XCircle } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "zh", name: "中文", flag: "🇨🇳" },
  { code: "ar", name: "العربية", flag: "🇸🇦" },
];

export default function Header() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showLanguage, setShowLanguage] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);
  const [notifications, setNotifications] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

  // ✅ Add local user state
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const langRef = useRef(null);

  useEffect(() => {
    fetch("https://faitcurrency.online/server/Api/dashboard.php", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setUser(data.user);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetch("https://faitcurrency.online/server/Api/get_notifications.php", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setNotifications(data.notifications);
      })
      .catch((err) => console.error("Failed to load notifications:", err));
  }, []);

  const unreadCount = notifications.filter((n) => n.unread).length;

  useEffect(() => {
    if (menuOpen) {
      setShowNotifications(false);
      setShowProfile(false);
      setShowLanguage(false);
    }
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-lg border-b border-border">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4">
          {/* Mobile menu toggle (visible below lg) */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="p-2 rounded-lg hover:bg-surface-light transition-colors lg:hidden"
            aria-label="Toggle menu"
          >
            <Menu size={20} />
          </button>

          <div className="flex items-center gap-2 lg:hidden">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Link href="/" className="text-background font-bold text-sm">
                FC
              </Link>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setShowLanguage((v) => !v)}
              className="flex items-center gap-1.5 px-2 sm:px-3 py-2 bg-surface-light rounded-lg hover:bg-border transition-colors"
            >
              <span className="text-base">{selectedLanguage.flag}</span>
              <span className="text-sm hidden sm:inline">{selectedLanguage.name}</span>
              <ChevronDown size={14} className="text-muted" />
            </button>

            {showLanguage && (
              <div className="absolute right-0 top-full mt-2 w-40 bg-surface border border-border rounded-xl shadow-xl overflow-hidden z-50">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setSelectedLanguage(lang);
                      setShowLanguage(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-surface-light transition-colors text-left ${
                      selectedLanguage.code === lang.code ? "bg-primary/10 text-primary" : ""
                    }`}
                  >
                    <span>{lang.flag}</span>
                    <span className="text-sm">{lang.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifications((v) => !v)}
              className="relative p-2 rounded-lg hover:bg-surface-light transition-colors"
              aria-label="Notifications"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary text-background text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-surface border border-border rounded-xl shadow-xl overflow-hidden z-50">
                <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                  <h3 className="font-semibold">Notifications</h3>
                  <Link href="/notifications" className="text-xs text-primary hover:underline">
                    View all
                  </Link>
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`px-4 py-3 border-b border-border last:border-0 hover:bg-surface-light transition-colors ${
                        notif.unread ? "bg-primary/5" : ""
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <div className="flex-1">
                          <p className="text-sm font-medium">{notif.title}</p>
                          <p className="text-xs text-muted mt-0.5">{notif.message}</p>
                          <p className="text-[10px] text-muted mt-1">
                            {new Date(notif.created_at).toLocaleString()}
                          </p>
                        </div>
                        {notif.unread && <div className="w-2 h-2 bg-primary rounded-full mt-1.5" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setShowProfile((v) => !v)}
              className="p-2 rounded-lg hover:bg-surface-light transition-colors"
              aria-label="User profile"
            >
              <User size={20} />
            </button>

            {showProfile && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-surface border border-border rounded-xl shadow-xl overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-border">
                  <p className="font-medium">{user?.fullName || "John Doe"}</p>
                  <p className="text-xs text-muted">{user?.email || "john@example.com"}</p>
                </div>
                <div className="py-1">
                  <Link href="/profile" className="flex items-center gap-3 px-4 py-2.5 hover:bg-surface-light transition-colors">
                    <User size={16} className="text-muted" />
                    <span className="text-sm">My Profile</span>
                  </Link>
                  <Link href="/upgrade" className="flex items-center gap-3 px-4 py-2.5 hover:bg-surface-light transition-colors">
                    <Crown size={16} className="text-primary" />
                    <span className="text-sm">Upgrade VIP</span>
                  </Link>
                  <Link href="/settings" className="flex items-center gap-3 px-4 py-2.5 hover:bg-surface-light transition-colors">
                    <Settings size={16} className="text-muted" />
                    <span className="text-sm">Settings</span>
                  </Link>
                  <hr className="my-1 border-border" />
                  <Link href="/login" className="flex items-center gap-3 px-4 py-2.5 hover:bg-surface-light transition-colors text-red-400">
                    <LogOut size={16} />
                    <span className="text-sm">Sign Out</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

       {/* ✅ Left-side drawer */}
       {menuOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/40 z-30 lg:hidden"
            onClick={() => setMenuOpen(false)}
          />
          {/* Drawer panel */}
          <aside className="fixed inset-y-0 left-0 w-64 bg-surface border-r border-border z-40 lg:hidden transform transition-transform duration-200 ease-out">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <span className="font-bold">Menu</span>
              <button
                onClick={() => setMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-surface-light"
                aria-label="Close menu"
              >
                <XCircle size={20} />
              </button>
            </div>
            <nav className="px-4 py-3 space-y-2">
              <Link href="/deposit-history" className="block py-2 text-sm hover:text-primary">Deposit Historys</Link>
              <Link href="/leaderboard" className="block py-2 text-sm hover:text-primary">Leaderboard</Link>
              <Link href="/payment-methods" className="block py-2 text-sm hover:text-primary">Payment methods</Link>
              <Link href="/support" className="block py-2 text-sm hover:text-primary">Supports</Link>
            </nav>
          </aside>
        </>
      )}
    </header>
  );
}
