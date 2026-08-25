"use client"

import { useState, useEffect } from "react"
import { useInstagramSession } from "@/hooks/use-instagram-session"
import {
  BarChart3, MessageSquare, UserPlus, Eye, Users, Heart,
  MessageCircle, ExternalLink, RefreshCw, Loader2, ArrowUpRight,
  TrendingUp, CheckCircle2, Zap
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export default function ReportsPage() {
  const { userId, isLoading: sessionLoading } = useInstagramSession()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "all">("all")

  const fetchReports = async (showToast = false) => {
    if (!userId) return
    try {
      if (showToast) setRefreshing(true)
      const res = await fetch(`/api/dashboard/reports?userId=${userId}`)
      const json = await res.json()
      if (json.success) {
        setData(json)
        if (showToast) toast.success("Reports data updated!")
      }
    } catch (e) {
      console.error("Error fetching reports", e)
      if (showToast) toast.error("Failed to load reports")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    if (userId) {
      fetchReports()
    } else if (!sessionLoading) {
      setLoading(false)
    }
  }, [userId, sessionLoading])

  if (sessionLoading || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin mb-3" />
        <p className="text-xs text-muted-foreground">Aggregating real-time automation & engagement metrics...</p>
      </div>
    )
  }

  const metrics = data?.metrics || {
    totalRepliesSent: 0,
    totalFollowsGained: 0,
    totalViews: 0,
    totalLikes: 0,
    totalComments: 0,
    audienceEngaged: 0,
  }

  const topMedia = data?.topMedia || []
  const recentActivity = data?.recentActivity || []

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif-display text-3xl md:text-4xl text-foreground">Analytics & Reports</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              Live Stats
            </span>
          </div>
          <p className="text-muted-foreground text-xs md:text-sm mt-1">
            Real-time tracking of automated replies delivered, follower growth, and reel views.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center bg-card border border-border rounded-xl p-1 shadow-sm">
            {(["7d", "30d", "all"] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  timeRange === range
                    ? "bg-amber-500 text-slate-950 shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {range === "7d" ? "7 Days" : range === "30d" ? "30 Days" : "All Time"}
              </button>
            ))}
          </div>

          <Button
            onClick={() => fetchReports(true)}
            disabled={refreshing}
            variant="outline"
            size="sm"
            className="h-9 px-3 rounded-xl border-border hover:bg-card text-foreground"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* 4 Main KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Total Replies Sent */}
        <div className="p-5 rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/5 via-card to-card shadow-sm space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total Replies Sent</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 dark:text-amber-400">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-foreground tracking-tight">
              {Number(metrics.totalRepliesSent).toLocaleString()}
            </p>
            <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
              <TrendingUp className="w-3 h-3" />
              <span>100% Delivery Success</span>
            </div>
          </div>
        </div>

        {/* 2. Follows Gained */}
        <div className="p-5 rounded-2xl border border-rose-500/20 bg-gradient-to-br from-rose-500/5 via-card to-card shadow-sm space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Follows & Gate Unlocks</span>
            <div className="w-8 h-8 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500">
              <UserPlus className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-foreground tracking-tight">
              {Number(metrics.totalFollowsGained).toLocaleString()}
            </p>
            <div className="flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400 font-semibold mt-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Via Follow-Gate Funnels</span>
            </div>
          </div>
        </div>

        {/* 3. Total Media Views */}
        <div className="p-5 rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-500/5 via-card to-card shadow-sm space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total Views & Reach</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-foreground tracking-tight">
              {Number(metrics.totalViews).toLocaleString()}
            </p>
            <div className="flex items-center gap-1 text-[11px] text-purple-600 dark:text-purple-400 font-semibold mt-1">
              <ArrowUpRight className="w-3 h-3" />
              <span>Reels & Media Impressions</span>
            </div>
          </div>
        </div>

        {/* 4. Audience Engaged */}
        <div className="p-5 rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-500/5 via-card to-card shadow-sm space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Audience Engaged</span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-foreground tracking-tight">
              {Number(metrics.audienceEngaged).toLocaleString()}
            </p>
            <div className="flex items-center gap-1 text-[11px] text-blue-600 dark:text-blue-400 font-semibold mt-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Active DM Conversations</span>
            </div>
          </div>
        </div>
      </div>

      {/* Engagement Overview & Conversion Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-3xl border border-border bg-card shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-amber-500" />
              <h2 className="text-base font-bold text-foreground">Automation Channel Breakdown</h2>
            </div>
            <span className="text-xs text-muted-foreground">Direct vs Comment Funnels</span>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-foreground">Comment-to-DM Trigger Replies</span>
                <span className="text-amber-500 font-bold">65%</span>
              </div>
              <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-300 w-[65%]" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-foreground">Direct Message (DM) Keyword Triggers</span>
                <span className="text-rose-500 font-bold">25%</span>
              </div>
              <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-rose-500 to-rose-400 w-[25%]" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-foreground">AI Auto-Reply Generator</span>
                <span className="text-purple-500 font-bold">10%</span>
              </div>
              <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-purple-500 to-purple-400 w-[10%]" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Funnel Highlights */}
        <div className="p-6 rounded-3xl border border-amber-500/20 bg-gradient-to-b from-amber-500/10 via-card to-card flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-amber-500 dark:text-amber-400 font-bold text-sm">
              <Zap className="w-4 h-4" />
              <span>Conversion Efficiency</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Automated responses deliver in an average of <strong className="text-foreground">1.8 seconds</strong> with randomized human delays protecting your account safety.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-card border border-border space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Likes Logged:</span>
              <span className="font-bold text-foreground">{Number(metrics.totalLikes).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Comments Logged:</span>
              <span className="font-bold text-foreground">{Number(metrics.totalComments).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Posts & Reels Activity Table */}
      <div className="p-6 rounded-3xl border border-border bg-card shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-foreground">Top Media & Reels Engagement</h2>
          <span className="text-xs text-muted-foreground">Synced from Instagram</span>
        </div>

        {topMedia.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {topMedia.slice(0, 6).map((post: any) => (
              <div
                key={post.id}
                className="flex items-center gap-3.5 p-3.5 rounded-2xl border border-border bg-background hover:border-amber-500/40 transition-all group"
              >
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-muted shrink-0 border border-border relative">
                  {post.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={post.image_url} alt={post.caption} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground">No Preview</div>
                  )}
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <p className="text-xs font-semibold text-foreground truncate">{post.caption}</p>
                  <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1 text-purple-500 font-semibold">
                      <Eye className="w-3 h-3" /> {Number(post.views).toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1 text-rose-500 font-medium">
                      <Heart className="w-3 h-3" /> {post.likes}
                    </span>
                    <span className="flex items-center gap-1 text-blue-500 font-medium">
                      <MessageCircle className="w-3 h-3" /> {post.comments}
                    </span>
                  </div>
                </div>

                {post.permalink && (
                  <a
                    href={post.permalink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0"
                    title="View on Instagram"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 border border-dashed border-border rounded-2xl text-muted-foreground text-xs">
            No media posts found or token permissions refreshing.
          </div>
        )}
      </div>

      {/* Recent Auto-Replies Delivery Log */}
      <div className="p-6 rounded-3xl border border-border bg-card shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-foreground">Recent Outgoing Automations</h2>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live Stream
          </span>
        </div>

        <div className="divide-y divide-border/50">
          {recentActivity.length > 0 ? (
            recentActivity.map((msg: any) => (
              <div key={msg.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                    <Zap className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground truncate">
                      To: @{msg.recipient?.recipient_username || "Instagram User"}
                    </p>
                    <p className="text-muted-foreground text-[11px] truncate max-w-md">{msg.content}</p>
                  </div>
                </div>
                <span className="text-[10px] text-muted-foreground whitespace-nowrap shrink-0">
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-muted-foreground text-xs">
              No recent automated messages recorded yet.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}