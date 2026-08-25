"use client"

import { useEffect, useState } from "react"
import { useInstagramSession } from "@/lib/session"
import {
  Activity,
  ArrowUpRight,
  BarChart3,
  Bot,
  CheckCircle2,
  Lock,
  MessageCircle,
  MessageSquare,
  RefreshCw,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import Link from "next/link"

interface AnalyticsData {
  metrics: {
    totalIncomingDMs: number
    totalRepliesSent: number
    totalAudience: number
    followersConverted: number
    aiRepliesCount: number
    conversionRate: number
    activeAutomations: number
  }
  distribution: {
    commentRules: number
    dmRules: number
    storyRules: number
  }
  dailyActivity: Array<{ incoming: number; outgoing: number; date: string }>
  automations: Array<{
    id: string
    name: string
    trigger_source: string
    trigger_type: string
    trigger_value: string
    is_active: boolean
    created_at: string
  }>
}

export default function AnalyticsPage() {
  const { username, userId, isLoading: isSessionLoading } = useInstagramSession()
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [timeRange, setTimeRange] = useState<"7d" | "14d">("14d")

  const fetchAnalytics = async () => {
    if (!userId) return
    try {
      setRefreshing(true)
      const res = await fetch(`/api/dashboard/analytics?userId=${userId}`)
      const json = await res.json()
      if (json && !json.error) {
        setData(json)
      }
    } catch (err) {
      console.error("Failed to load analytics", err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [userId])

  if (isSessionLoading || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-10 h-10 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
        <p className="text-xs font-mono-ui text-muted-foreground uppercase tracking-widest">Aggregating live data...</p>
      </div>
    )
  }

  const m = data?.metrics || {
    totalIncomingDMs: 0,
    totalRepliesSent: 0,
    totalAudience: 0,
    followersConverted: 0,
    aiRepliesCount: 0,
    conversionRate: 0,
    activeAutomations: 0,
  }

  const displayUser = username && !username.startsWith("user_") ? `@${username}` : username || "@creator"

  const maxDailyValue = Math.max(
    ...((data?.dailyActivity || []).map((d) => Math.max(d.incoming, d.outgoing))),
    10,
  )

  return (
    <div className="p-6 md:p-8 space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="font-mono-ui text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Performance Suite</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono-ui font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <Sparkles className="w-3 h-3 text-amber-500" /> Real-time Telemetry
            </span>
          </div>
          <h1 className="font-serif-display text-4xl text-foreground">Deep Analytics</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Tracking engagement, automated replies, and follower conversions for <span className="text-foreground font-medium">{displayUser}</span>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-card border border-border rounded-xl p-1 shadow-sm">
            <button
              onClick={() => setTimeRange("7d")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                timeRange === "7d"
                  ? "bg-amber-500 text-slate-950 font-bold shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setTimeRange("14d")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                timeRange === "14d"
                  ? "bg-amber-500 text-slate-950 font-bold shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              14 Days
            </button>
          </div>

          <button
            onClick={fetchAnalytics}
            disabled={refreshing}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-card border border-border text-xs font-medium text-foreground hover:bg-muted transition-all shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-amber-500" : "text-muted-foreground"}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard
          title="Incoming DMs & Triggers"
          value={m.totalIncomingDMs.toLocaleString()}
          sub="Customer messages"
          icon={<MessageCircle className="w-5 h-5 text-blue-500" />}
          badge="100% Monitored"
        />
        <MetricCard
          title="Auto-Replies Sent"
          value={m.totalRepliesSent.toLocaleString()}
          sub="DMs & Comments"
          icon={<Zap className="w-5 h-5 text-amber-500" />}
          badge="Lightning Fast"
        />
        <MetricCard
          title="Follower Conversions"
          value={m.followersConverted.toLocaleString()}
          sub="Unlocked via Follow Gate"
          icon={<Lock className="w-5 h-5 text-emerald-500" />}
          badge={`${m.conversionRate}% Rate`}
          highlight
        />
        <MetricCard
          title="AI Assistant Replies"
          value={m.aiRepliesCount.toLocaleString()}
          sub="Groq Llama-3.1"
          icon={<Bot className="w-5 h-5 text-purple-500" />}
          badge="Autonomous"
        />
        <MetricCard
          title="Total Audience Reach"
          value={m.totalAudience.toLocaleString()}
          sub="Unique conversations"
          icon={<Users className="w-5 h-5 text-rose-500" />}
          badge="Total Reach"
        />
      </div>

      {/* Main Charts & Funnel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Activity Timeline Chart */}
        <Card className="lg:col-span-8 p-6 bg-card border-border shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif-display text-2xl text-foreground flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-amber-500" /> Activity Timeline
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">Daily incoming messages vs automated responses delivered.</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono-ui">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500/80" /> Incoming
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Auto-Replies
              </span>
            </div>
          </div>

          {/* Visual Bar Graph */}
          <div className="pt-4 pb-2">
            <div className="h-48 flex items-end gap-2 sm:gap-3 justify-between border-b border-border pb-2">
              {(data?.dailyActivity || []).slice(timeRange === "7d" ? 7 : 0).map((day, idx) => {
                const incHeight = Math.max(8, Math.round((day.incoming / maxDailyValue) * 160))
                const outHeight = Math.max(8, Math.round((day.outgoing / maxDailyValue) * 160))

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative">
                    {/* Tooltip on hover */}
                    <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] px-2 py-1 rounded shadow-lg pointer-events-none whitespace-nowrap z-20 font-mono-ui border border-slate-700">
                      <div>{day.date}</div>
                      <div className="text-amber-400">Sent: {day.outgoing}</div>
                      <div className="text-blue-400">Recv: {day.incoming}</div>
                    </div>

                    <div className="w-full flex items-end justify-center gap-1">
                      {/* Incoming Bar */}
                      <div
                        style={{ height: `${incHeight}px` }}
                        className="w-1/2 rounded-t bg-blue-500/60 group-hover:bg-blue-500 transition-all cursor-pointer"
                      />
                      {/* Outgoing Bar */}
                      <div
                        style={{ height: `${outHeight}px` }}
                        className="w-1/2 rounded-t bg-amber-500/80 group-hover:bg-amber-400 transition-all cursor-pointer"
                      />
                    </div>
                    <span className="text-[10px] font-mono-ui text-muted-foreground truncate w-full text-center mt-1">
                      {day.date.split(" ")[1] || day.date}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Quick Stat Highlights */}
          <div className="grid grid-cols-3 gap-4 pt-2 border-t border-border/50 text-center">
            <div className="p-3 rounded-xl bg-muted/20">
              <p className="text-[11px] text-muted-foreground">Active Automations</p>
              <p className="text-lg font-bold text-foreground mt-0.5">{m.activeAutomations} Running</p>
            </div>
            <div className="p-3 rounded-xl bg-muted/20">
              <p className="text-[11px] text-muted-foreground">Avg Response Speed</p>
              <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">&lt; 2.5s</p>
            </div>
            <div className="p-3 rounded-xl bg-muted/20">
              <p className="text-[11px] text-muted-foreground">Follower Conversion Rate</p>
              <p className="text-lg font-bold text-amber-600 dark:text-amber-400 mt-0.5">{m.conversionRate}%</p>
            </div>
          </div>
        </Card>

        {/* Funnel & Trigger Breakdown */}
        <div className="lg:col-span-4 space-y-6">
          {/* Conversion Funnel */}
          <Card className="p-6 bg-card border-border shadow-sm space-y-4">
            <h3 className="font-serif-display text-xl text-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" /> Conversion Funnel
            </h3>
            <p className="text-xs text-muted-foreground">How followers flow through your automated gates.</p>

            <div className="space-y-3 pt-2">
              <FunnelStep
                label="1. Triggers Received"
                count={m.totalIncomingDMs}
                pct="100%"
                color="bg-blue-500"
              />
              <FunnelStep
                label="2. Auto-Replies Sent"
                count={m.totalRepliesSent}
                pct={m.totalIncomingDMs > 0 ? `${Math.min(100, Math.round((m.totalRepliesSent / m.totalIncomingDMs) * 100))}%` : "100%"}
                color="bg-amber-500"
              />
              <FunnelStep
                label="3. Follow Gates Unlocked"
                count={m.followersConverted}
                pct={`${m.conversionRate}%`}
                color="bg-emerald-500"
                isFinal
              />
            </div>
          </Card>

          {/* Trigger Types Breakdown */}
          <Card className="p-6 bg-card border-border shadow-sm space-y-4">
            <h3 className="font-serif-display text-xl text-foreground">Rule Distribution</h3>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/50">
                <span className="flex items-center gap-2 text-xs font-semibold text-foreground">
                  <MessageSquare className="w-4 h-4 text-pink-500" /> Post Comments
                </span>
                <span className="font-mono-ui text-xs font-bold text-foreground">
                  {data?.distribution.commentRules || 0} Rules
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/50">
                <span className="flex items-center gap-2 text-xs font-semibold text-foreground">
                  <MessageCircle className="w-4 h-4 text-blue-500" /> Direct Messages
                </span>
                <span className="font-mono-ui text-xs font-bold text-foreground">
                  {data?.distribution.dmRules || 0} Rules
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/50">
                <span className="flex items-center gap-2 text-xs font-semibold text-foreground">
                  <Sparkles className="w-4 h-4 text-amber-500" /> Story Mentions & Replies
                </span>
                <span className="font-mono-ui text-xs font-bold text-foreground">
                  {data?.distribution.storyRules || 0} Rules
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Top Active Automations Table */}
      <Card className="p-6 bg-card border-border shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif-display text-2xl text-foreground">Active Automation Engine</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Rules configured and listening on live Instagram events.</p>
          </div>
          <Link
            href="/dashboard/automations"
            className="flex items-center gap-1.5 text-xs font-mono-ui text-amber-600 dark:text-amber-400 hover:underline"
          >
            Manage Rules <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border text-muted-foreground uppercase font-mono-ui text-[10px] tracking-wider">
                <th className="pb-3">Rule Name</th>
                <th className="pb-3">Source</th>
                <th className="pb-3">Trigger Keyword / Condition</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {data?.automations && data.automations.length > 0 ? (
                data.automations.map((a) => (
                  <tr key={a.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3.5 font-semibold text-foreground">{a.name}</td>
                    <td className="py-3.5 capitalize text-muted-foreground">
                      <span className="px-2 py-0.5 rounded-full bg-muted border border-border text-[10px] font-mono-ui">
                        {a.trigger_source || "DM"}
                      </span>
                    </td>
                    <td className="py-3.5 text-foreground font-mono-ui">{a.trigger_value || "ALL"}</td>
                    <td className="py-3.5">
                      {a.is_active ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-[11px] font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Active
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-[11px]">Paused</span>
                      )}
                    </td>
                    <td className="py-3.5 text-right">
                      <Link
                        href="/dashboard/automations"
                        className="text-amber-600 dark:text-amber-400 hover:underline font-mono-ui text-[11px]"
                      >
                        Edit →
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-muted-foreground">
                    No automations created yet.{" "}
                    <Link href="/dashboard/automations" className="text-amber-500 underline font-medium">
                      Create your first rule now
                    </Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

function MetricCard({
  title,
  value,
  sub,
  icon,
  badge,
  highlight,
}: {
  title: string
  value: string
  sub: string
  icon: React.ReactNode
  badge: string
  highlight?: boolean
}) {
  return (
    <div
      className={`p-5 rounded-2xl border transition-all shadow-sm ${
        highlight
          ? "border-amber-500/40 bg-gradient-to-b from-amber-500/10 to-amber-500/5"
          : "border-border bg-card hover:border-border/80"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center border border-border">
          {icon}
        </div>
        <span className="font-mono-ui text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-muted/60 text-muted-foreground font-semibold border border-border/50">
          {badge}
        </span>
      </div>
      <div className="mt-4">
        <p className="font-serif-display text-3xl md:text-4xl text-foreground leading-none">{value}</p>
        <p className="text-xs font-semibold text-foreground mt-2">{title}</p>
        <p className="text-[11px] text-muted-foreground mt-0.5">{sub}</p>
      </div>
    </div>
  )
}

function FunnelStep({
  label,
  count,
  pct,
  color,
  isFinal,
}: {
  label: string
  count: number
  pct: string
  color: string
  isFinal?: boolean
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs font-medium">
        <span className="text-foreground">{label}</span>
        <span className="font-mono-ui text-muted-foreground font-bold">
          {count} ({pct})
        </span>
      </div>
      <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: pct === "0%" ? "4%" : pct }} />
      </div>
    </div>
  )
}