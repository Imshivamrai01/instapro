"use client"

import { useState, useEffect } from "react"
import { useInstagramSession } from "@/hooks/use-instagram-session"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Plus, Trash2, Save, RefreshCw } from "lucide-react"
import { toast } from "sonner"

type IceBreakerRow = { id?: string; question: string; response: string }

export function IceBreakersManager() {
    const { userId, isLoading } = useInstagramSession()
    const [breakers, setBreakers] = useState<IceBreakerRow[]>([])
    const [saving, setSaving] = useState(false)
    const [fetching, setFetching] = useState(true)

    useEffect(() => {
        if (!userId) return
        fetch(`/api/ice-breakers?userId=${userId}`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setBreakers(data)
                setFetching(false)
            })
            .catch(err => {
                console.error(err)
                setFetching(false)
            })
    }, [userId])

    const handleAdd = () => {
        if (breakers.length >= 4) {
            toast.error("Maximum 4 Ice Breakers allowed by Instagram")
            return
        }
        setBreakers([...breakers, { question: "", response: "" }])
    }

    const handleChange = (index: number, field: "question" | "response", value: string) => {
        const newBreakers = [...breakers]
        newBreakers[index] = { ...newBreakers[index], [field]: value }
        setBreakers(newBreakers)
    }

    const handleRemove = (index: number) => {
        setBreakers(breakers.filter((_, i) => i !== index))
    }

    const handleSave = async () => {
        if (!userId) return

        // Validation
        if (breakers.some(b => !b.question?.trim() || !b.response?.trim())) {
            toast.error("Please fill in all fields")
            return
        }

        setSaving(true)
        try {
            const res = await fetch("/api/ice-breakers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, iceBreakers: breakers })
            })
            const data = await res.json()
            if (data.success) {
                toast.success("Ice Breakers saved & synced usually!")
            } else {
                toast.error("Failed to save")
            }
        } catch (e) {
            toast.error("Error saving")
        } finally {
            setSaving(false)
        }
    }

    if (isLoading) {
            return (
                <div className="p-10 flex justify-center">
                    <Loader2 className="animate-spin text-accent-yellow-foreground dark:text-accent-yellow" />
                </div>
            )
        }

        if (!userId) {
            return (
                <div className="space-y-6 max-w-2xl mx-auto">
                    <div className="text-center py-10 border border-dashed border-border rounded-xl text-muted-foreground bg-card/40">
                        <p className="text-sm font-medium">Not connected</p>
                        <p className="text-xs mt-1">Connect your Instagram account to manage Ice Breakers.</p>
                    </div>
                </div>
            )
        }

        if (fetching && !breakers.length) {
            return (
                <div className="p-10 flex justify-center">
                    <Loader2 className="animate-spin text-accent-yellow-foreground dark:text-accent-yellow" />
                </div>
            )
        }

    return (
        <div className="space-y-6 max-w-3xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
                <div>
                    <div className="flex items-center gap-2">
                        <h2 className="font-serif-display text-3xl md:text-4xl text-foreground">Bot Messages (Q&A)</h2>
                    </div>
                    <p className="text-muted-foreground text-xs sm:text-sm mt-1">
                        Feed custom Questions & Answers here. When a user asks or taps a question in Instagram DMs, the bot instantly sends your set reply.
                    </p>
                </div>
                <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 text-slate-950 font-bold hover:shadow-lg hover:shadow-amber-500/20 active:scale-95 transition-all shadow-sm shrink-0"
                >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2 fill-slate-950" />}
                    Save & Sync Bot Q&A
                </Button>
            </div>

            <div className="space-y-4">
                {breakers.map((item, idx) => (
                    <div key={idx} className="bg-card border border-border p-5 rounded-2xl space-y-4 relative shadow-sm hover:border-amber-500/30 transition-all">
                        <div className="flex justify-between items-start gap-4">
                            <div className="flex-1 space-y-3.5">
                                <div className="flex items-center gap-2">
                                    <span className="w-5 h-5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-300 font-mono text-[11px] font-bold flex items-center justify-center">
                                        {idx + 1}
                                    </span>
                                    <label className="text-xs text-foreground font-semibold">User Question (Prompt)</label>
                                </div>
                                <Input
                                    value={item.question}
                                    onChange={e => handleChange(idx, "question", e.target.value)}
                                    placeholder="e.g., What are your service prices / package details?"
                                    className="bg-background border-border text-foreground text-sm focus-visible:ring-1 focus-visible:ring-amber-500/50"
                                    maxLength={80}
                                />
                                <div className="space-y-1">
                                    <label className="text-xs text-foreground font-semibold">Bot Auto-Reply (Instant Message)</label>
                                    <Textarea
                                        value={item.response}
                                        onChange={e => handleChange(idx, "response", e.target.value)}
                                        placeholder="e.g., Hey! Our standard package starts at ₹999. You can check the complete list at our website..."
                                        className="bg-background border-border text-foreground text-sm resize-none focus-visible:ring-1 focus-visible:ring-amber-500/50"
                                        rows={3}
                                    />
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemove(idx)}
                                aria-label="Remove question"
                                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0"
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                ))}

                {breakers.length === 0 && (
                    <div className="text-center py-12 border border-dashed border-border rounded-2xl text-muted-foreground bg-card/40 space-y-2">
                        <p className="font-semibold text-foreground text-sm">No Bot Q&A created yet</p>
                        <p className="text-xs max-w-sm mx-auto">Add your frequently asked questions so the bot can answer incoming queries on autopilot.</p>
                    </div>
                )}

                {breakers.length < 4 && (
                    <Button
                        variant="outline"
                        onClick={handleAdd}
                        className="w-full h-12 rounded-xl border-dashed border-border hover:bg-amber-500/5 hover:border-amber-500/40 text-muted-foreground hover:text-foreground font-medium transition-all"
                    >
                        <Plus className="w-4 h-4 mr-2 text-amber-500" /> Add Q&A Pair ({breakers.length}/4)
                    </Button>
                )}
            </div>

            <div className="bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl flex gap-3 text-xs text-foreground/90">
                <RefreshCw className="w-5 h-5 shrink-0 text-amber-500" />
                <p className="leading-relaxed">
                    <strong>Auto-Sync Active:</strong> Questions saved here appear as interactive chat starters in Instagram DMs. When a follower taps any question, your paired answer is instantly sent.
                </p>
            </div>
        </div>
    )
}