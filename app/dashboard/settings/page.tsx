"use client"

import { useState, useEffect } from "react"
import { useInstagramSession } from "@/hooks/use-instagram-session"
import {
  User, ShieldCheck, Instagram, ExternalLink, RefreshCw,
  Users, UserCheck, Film, Zap, MessageCircle, Sparkles, Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export default function ProfilePage() {
  const { userId, username, isLoading: sessionLoading } = useInstagramSession()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchProfileData = async (showToast = false) => {
    if (!userId) return
    try {
      if (showToast) setRefreshing(true)
      const res = await fetch(`/api/instagram/profile?userId=${userId}`)
      const data = await res.json()
      if (data.profile) {
        setProfile(data.profile)
        if (showToast) toast.success("Profile statistics updated!")
      }
    } catch (e) {
      console.error("Error fetching profile", e)
      if (showToast) toast.error("Could not refresh profile data")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    if (userId) {
      fetchProfileData()
    } else if (!sessionLoading) {
      setLoading(false)
    }
  }, [userId, sessionLoading])

  if (sessionLoading || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin mb-3" />
        <p className="text-xs text-muted-foreground">Loading Instagram Profile details...</p>
      </div>
    )
  }

  const currentUsername = profile?.username || username || "creator"
  const displayName = profile?.name || currentUsername
  const whatsappUrl = `https://wa.me/919118016507?text=${encodeURIComponent(`Hello ShinePro Support, I need help with my account.\nAccount ID: ${userId || "N/A"}\nUsername: @${currentUsername}`)}`

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Header Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-amber-500/20 bg-gradient-to-br from-amber-500/10 via-card to-background p-6 md:p-8 shadow-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            {/* Avatar */}
            <div className="relative group">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-[2.5px] shadow-lg shadow-amber-500/10">
                <div className="w-full h-full rounded-[14px] bg-background flex items-center justify-center overflow-hidden">
                  {profile?.profile_picture_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={profile.profile_picture_url}
                      alt={currentUsername}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl md:text-3xl font-extrabold text-foreground">
                      {currentUsername.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full border-2 border-background shadow-sm" title="Connected">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* User details */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl md:text-2xl font-bold text-foreground tracking-tight">{displayName}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Active
                </span>
              </div>
              <p className="text-sm font-medium text-amber-500 dark:text-amber-400">@{currentUsername}</p>
              <p className="text-xs text-muted-foreground">Instagram ID: <span className="font-mono">{userId || "N/A"}</span></p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2.5 w-full md:w-auto">
            <Button
              onClick={() => fetchProfileData(true)}
              disabled={refreshing}
              variant="outline"
              size="sm"
              className="h-10 px-4 rounded-xl border-border hover:bg-card text-foreground"
            >
              <RefreshCw className={`w-3.5 h-3.5 mr-2 ${refreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <a
              href={`https://instagram.com/${currentUsername}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center h-10 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 text-slate-950 hover:opacity-90 active:scale-95 transition-all shadow-sm"
            >
              <Instagram className="w-3.5 h-3.5 mr-2" />
              View Profile
              <ExternalLink className="w-3 h-3 ml-1.5 opacity-70" />
            </a>
          </div>
        </div>
      </div>

      {/* Profile Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold">Followers</span>
            <Users className="w-4 h-4 text-amber-500 dark:text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-foreground">
            {profile?.followers_count !== null && profile?.followers_count !== undefined
              ? Number(profile.followers_count).toLocaleString()
              : "Live"}
          </p>
          <p className="text-[11px] text-muted-foreground">Audience Base</p>
        </div>

        <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold">Following</span>
            <UserCheck className="w-4 h-4 text-amber-500 dark:text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-foreground">
            {profile?.follows_count !== null && profile?.follows_count !== undefined
              ? Number(profile.follows_count).toLocaleString()
              : "Connected"}
          </p>
          <p className="text-[11px] text-muted-foreground">Accounts Followed</p>
        </div>

        <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold">Media & Reels</span>
            <Film className="w-4 h-4 text-amber-500 dark:text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-foreground">
            {Number(profile?.media_count || 0).toLocaleString()}
          </p>
          <p className="text-[11px] text-muted-foreground">Total Published Posts</p>
        </div>

        <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold">Active Automations</span>
            <Zap className="w-4 h-4 text-amber-500 dark:text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-foreground">
            {profile?.total_automations || 0}
          </p>
          <p className="text-[11px] text-muted-foreground">Live Funnels</p>
        </div>
      </div>

      {/* Account Details & Support Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl border border-border bg-card space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-border">
            <User className="w-4.5 h-4.5 text-amber-500 dark:text-amber-400" />
            <h3 className="font-semibold text-foreground text-sm">Account Specification</h3>
          </div>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1.5 border-b border-border/50">
              <span className="text-muted-foreground">Account Type</span>
              <span className="font-semibold text-foreground">{profile?.account_type || "Professional / Business"}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-border/50">
              <span className="text-muted-foreground">Instagram User ID</span>
              <span className="font-mono text-foreground">{userId || "N/A"}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-border/50">
              <span className="text-muted-foreground">AI Auto-Reply Engine</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                {profile?.groq_auto_reply_enabled ? "Enabled (Groq AI)" : "Ready"}
              </span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-muted-foreground">Webhook Verification</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">Verified & Active</span>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl border border-border bg-card flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 pb-3 border-b border-border">
              <MessageCircle className="w-4.5 h-4.5 text-emerald-500" />
              <h3 className="font-semibold text-foreground text-sm">Direct Support & Help</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Need assistance with your automations, webhook setup, or custom funnels? Connect directly with our priority support team on WhatsApp.
            </p>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 active:scale-98 transition-all"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            Contact WhatsApp Support (9118016507)
          </a>
        </div>
      </div>
    </div>
  )
}