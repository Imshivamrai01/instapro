"use client"

import type React from "react"
import { cn } from "@/lib/utils"
import {
  Zap, LayoutDashboard, LogOut, User, BarChart3,
  MessageSquare, Bot, Send, MessageCircle
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import Image from "next/image"

const NAV = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
  { href: "/dashboard/automations", icon: Zap, label: "Automations" },
  { href: "/dashboard/inbox", icon: MessageSquare, label: "Inbox" },
  { href: "/dashboard/ice-breakers", icon: Bot, label: "Bot Messages" },
  { href: "/dashboard/analytics", icon: BarChart3, label: "Reports" },
]

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  username?: string
  profilePic?: string | null
  className?: string
  onLogout?: () => void
  onNavigate?: () => void
}

export function Sidebar({ className, username = "creator", profilePic, onLogout, onNavigate, ...props }: SidebarProps) {
  const pathname = usePathname()

  const handleWhatsAppHelp = (e: React.MouseEvent) => {
    e.preventDefault()
    const igUserId = typeof window !== "undefined" ? localStorage.getItem("ig_user_id") || "N/A" : "N/A"
    const whatsappHelpUrl = `https://wa.me/919118016507?text=${encodeURIComponent(`Hello ShinePro Support, I need help with my account.\nAccount ID: ${igUserId}\nUsername: @${username}`)}`
    window.open(whatsappHelpUrl, "_blank", "noopener,noreferrer")
  }

  return (
    <aside className={cn("flex flex-col bg-sidebar text-sidebar-foreground", className)} {...props}>
      {/* Brand + Theme Toggle */}
      <div className="px-5 pt-5 pb-4 flex items-center justify-between gap-3">
        <Link href="/dashboard" onClick={onNavigate} className="flex items-center gap-2.5 group">
          <div className="relative w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-amber-500/30 bg-background/80 shadow-sm flex items-center justify-center p-0.5">
            <Image src="/logo.png" alt="Shine Pro" width={32} height={32} className="object-contain" priority />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-sidebar-foreground flex items-center gap-1.5">
              <span>Shine</span>
              <span className="text-amber-500 dark:text-amber-400 font-extrabold">Pro</span>
            </span>
            <span className="text-[9px] font-mono-ui uppercase tracking-wider text-muted-foreground">Automation</span>
          </div>
        </Link>
        <ThemeToggle />
      </div>

      <div className="mx-5 h-px bg-sidebar-border" />

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-[13px] transition-colors relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
                active
                  ? "text-sidebar-foreground bg-sidebar-accent font-medium"
                  : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/60",
              )}
            >
              {active && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-full bg-amber-500" />}
              <Icon className={cn("w-4 h-4 shrink-0", active ? "text-amber-500 dark:text-amber-400" : "")} strokeWidth={active ? 2.2 : 1.8} />
              <span>{label}</span>
            </Link>
          )
        })}

        <div className="pt-5 pb-1 px-3">
          <div className="h-px bg-sidebar-border" />
        </div>

        <Link
          href="/dashboard/settings"
          onClick={onNavigate}
          aria-current={pathname === "/dashboard/settings" ? "page" : undefined}
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-md text-[13px] transition-colors relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
            pathname === "/dashboard/settings"
              ? "text-sidebar-foreground bg-sidebar-accent font-medium"
              : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/60",
          )}
        >
          {pathname === "/dashboard/settings" && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-full bg-amber-500" />}
          <User className={cn("w-4 h-4 shrink-0", pathname === "/dashboard/settings" ? "text-amber-500 dark:text-amber-400" : "")} strokeWidth={1.8} />
          <span>Profile</span>
        </Link>

        <button
          type="button"
          onClick={handleWhatsAppHelp}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-[13px] text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring font-medium text-left cursor-pointer"
        >
          <MessageCircle className="w-4 h-4 shrink-0 text-emerald-500" strokeWidth={1.8} />
          <span>Get help</span>
        </button>
      </nav>

      {/* Account */}
      <div className="px-3 pb-4">
        <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg border border-sidebar-border group">
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-500 p-[1.5px] shrink-0">
            <div className="w-full h-full rounded-full bg-sidebar flex items-center justify-center overflow-hidden">
              {profilePic ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profilePic} alt={username} className="w-full h-full rounded-full object-cover" />
              ) : (
                <span className="text-[10px] font-bold text-sidebar-foreground">{username.charAt(0).toUpperCase()}</span>
              )}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-sidebar-foreground truncate">@{username}</p>
            <p className="font-mono-ui text-[9px] uppercase tracking-wider text-sidebar-foreground/60">connected</p>
          </div>
          <button
            onClick={onLogout}
            title="Log out"
            aria-label="Log out"
            className="p-1.5 rounded-md text-sidebar-foreground/60 hover:text-destructive hover:bg-destructive/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  )
}