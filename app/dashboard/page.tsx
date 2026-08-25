"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { useInstagramSession } from "@/hooks/use-instagram-session"
import { Activity, Users, MessageCircle, Zap, Loader2 } from "lucide-react"

interface DashboardStats {
    metrics: {
        totalAutomations: number
        activeTriggers: number
        audienceReached: number
        messagesSent: number
    }
    recentActivity: Array<{
        id: string
        content: string
        created_at: string
        recipient?: {
            recipient_username: string
        }
    }>
}

import Link from "next/link"

export default function DashboardPage() {
    const { username, userId, isLoading: isSessionLoading } = useInstagramSession()
    const [stats, setStats] = useState<DashboardStats | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!userId) return

        const fetchStats = async () => {
            try {
                const res = await fetch(`/api/dashboard/stats?userId=${userId}`)
                const data = await res.json()
                if (data && !data.error) {
                    setStats(data)
                }
            } catch (err) {
                console.error("Failed to load dashboard stats", err)
            } finally {
                setLoading(false)
            }
        }

        fetchStats()
    }, [userId])

    if (isSessionLoading || loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
            </div>
        )
    }

    const displayUsername = username && !username.startsWith("user_") ? `@${username}` : username || "@creator"

    return (
        <div className="p-6 md:p-8 space-y-8 animate-in fade-in duration-700">
            {/* Welcome Section */}
            <div className="flex items-start md:items-center justify-between flex-col md:flex-row gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="font-mono-ui text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Overview Dashboard</span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono-ui font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live & Connected
                        </span>
                    </div>
                    <h1 className="font-serif-display text-4xl md:text-5xl text-foreground leading-tight flex items-center gap-2 flex-wrap">
                        <span>Hey,</span>
                        <span className="bg-gradient-to-r from-amber-500 to-amber-300 bg-clip-text text-transparent font-normal">{displayUsername}</span>
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1.5">Here's your live Instagram automation performance & activity.</p>
                </div>

                <div className="flex items-center gap-3">
                    <Link
                        href="/dashboard/automations"
                        className="flex items-center gap-2 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 text-slate-950 font-mono-ui text-xs font-bold px-5 py-2.5 rounded-full hover:shadow-lg hover:shadow-amber-500/20 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                        <Zap className="w-3.5 h-3.5 fill-slate-950" />
                        <span>Create Rule</span>
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                <StatCard
                    title="Total Automations"
                    value={stats?.metrics.totalAutomations.toString() || "0"}
                    trend="Active Rules"
                    icon={<Zap className="w-5 h-5 text-amber-500 dark:text-amber-400" />}
                />
                <StatCard
                    title="Messages Sent"
                    value={stats?.metrics.messagesSent.toString() || "0"}
                    trend="Auto-Replies"
                    icon={<MessageCircle className="w-5 h-5 text-blue-500 dark:text-blue-400" />}
                />
                <StatCard
                    title="Active Triggers"
                    value={stats?.metrics.activeTriggers.toString() || "0"}
                    trend="Running Now"
                    icon={<Activity className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />}
                />
                <StatCard
                    title="Audience Reached"
                    value={stats?.metrics.audienceReached.toString() || "0"}
                    trend="Conversations"
                    icon={<Users className="w-5 h-5 text-purple-500 dark:text-purple-400" />}
                />
            </div>

            {/* Recent Activity & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Recent Activity */}
                <Card className="lg:col-span-7 p-6 bg-card border-border shadow-sm">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="font-serif-display text-2xl text-foreground">Recent activity</h3>
                        <Link href="/dashboard/inbox" className="text-xs font-mono-ui text-amber-600 dark:text-amber-400 hover:underline">View Inbox →</Link>
                    </div>
                    <div className="space-y-3">
                        {stats?.recentActivity && stats.recentActivity.length > 0 ? (
                            stats.recentActivity.map((msg) => (
                                <div key={msg.id} className="flex items-center gap-3.5 p-3 rounded-xl bg-muted/30 border border-border/50 hover:bg-muted/60 transition-colors">
                                    <div className="w-9 h-9 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0">
                                        <MessageCircle className="w-4 h-4" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs text-foreground font-semibold truncate">
                                            Auto-reply to @{msg.recipient?.recipient_username || "customer"}
                                        </p>
                                        <p className="text-[11px] text-muted-foreground truncate w-full max-w-[280px]">{msg.content}</p>
                                    </div>
                                    <div className="ml-auto text-[10px] text-muted-foreground whitespace-nowrap font-mono-ui">
                                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-10 text-center text-muted-foreground text-xs space-y-1">
                                <p className="font-medium text-foreground">No recent messages yet.</p>
                                <p>When an automation triggers, activity will stream here in real-time.</p>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Quick Actions */}
                <Card className="lg:col-span-5 p-6 bg-card border-border shadow-sm">
                    <h3 className="font-serif-display text-2xl text-foreground mb-5">Quick navigation</h3>
                    <div className="grid grid-cols-2 gap-3.5">
                        <Link
                            href="/dashboard/automations"
                            className="p-4 rounded-xl border border-border bg-muted/20 hover:bg-amber-500/10 hover:border-amber-500/40 cursor-pointer transition-all group flex flex-col items-center justify-center text-center"
                        >
                            <Zap className="w-5 h-5 text-muted-foreground group-hover:text-amber-500 mb-2 transition-colors" />
                            <span className="text-xs font-semibold text-foreground">Automations</span>
                            <span className="text-[10px] text-muted-foreground">Manage rules</span>
                        </Link>
                        <Link
                            href="/dashboard/analytics"
                            className="p-4 rounded-xl border border-border bg-muted/20 hover:bg-amber-500/10 hover:border-amber-500/40 cursor-pointer transition-all group flex flex-col items-center justify-center text-center"
                        >
                            <Activity className="w-5 h-5 text-muted-foreground group-hover:text-amber-500 mb-2 transition-colors" />
                            <span className="text-xs font-semibold text-foreground">Analytics</span>
                            <span className="text-[10px] text-muted-foreground">Deep metrics</span>
                        </Link>
                        <Link
                            href="/dashboard/inbox"
                            className="p-4 rounded-xl border border-border bg-muted/20 hover:bg-amber-500/10 hover:border-amber-500/40 cursor-pointer transition-all group flex flex-col items-center justify-center text-center"
                        >
                            <MessageCircle className="w-5 h-5 text-muted-foreground group-hover:text-amber-500 mb-2 transition-colors" />
                            <span className="text-xs font-semibold text-foreground">Live Inbox</span>
                            <span className="text-[10px] text-muted-foreground">Direct chat</span>
                        </Link>
                        <Link
                            href="/dashboard/ice-breakers"
                            className="p-4 rounded-xl border border-border bg-muted/20 hover:bg-amber-500/10 hover:border-amber-500/40 cursor-pointer transition-all group flex flex-col items-center justify-center text-center"
                        >
                            <Users className="w-5 h-5 text-muted-foreground group-hover:text-amber-500 mb-2 transition-colors" />
                            <span className="text-xs font-semibold text-foreground">Ice Breakers</span>
                            <span className="text-[10px] text-muted-foreground">Starter FAQs</span>
                        </Link>
                    </div>
                </Card>
            </div>
        </div>
    )
}

function StatCard({ title, value, trend, icon }: { title: string, value: string, trend: string, icon: React.ReactNode }) {
    return (
        <div className="p-5 md:p-6 rounded-2xl border border-border bg-card hover:border-amber-500/30 transition-all shadow-sm group">
            <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center border border-border group-hover:scale-105 transition-transform">
                    {icon}
                </div>
                <span className="font-mono-ui text-[10px] uppercase tracking-widest text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">{trend}</span>
            </div>
            <div className="mt-5">
                <p className="font-serif-display text-4xl md:text-5xl text-foreground leading-none">{value}</p>
                <p className="font-mono-ui text-[10px] text-muted-foreground uppercase tracking-[0.2em] mt-2.5 font-medium">{title}</p>
            </div>
        </div>
    )
}