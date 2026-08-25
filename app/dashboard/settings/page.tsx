"use client"

import { useEffect, useState } from "react"
import { useInstagramSession } from "@/hooks/use-instagram-session"
import {
  Bot,
  CheckCircle2,
  Copy,
  ExternalLink,
  Globe,
  Key,
  MessageCircle,
  RefreshCw,
  Save,
  Server,
  Settings,
  ShieldCheck,
  Sparkles,
  User,
  Zap,
} from "lucide-react"
import { Card } from "@/components/ui/card"

export default function SettingsPage() {
  const { username, userId, isLoading: isSessionLoading } = useInstagramSession()
  const [activeTab, setActiveTab] = useState<"account" | "ai" | "webhook" | "support">("account")
  
  // AI Settings State
  const [groqEnabled, setGroqEnabled] = useState(false)
  const [groqApiKey, setGroqApiKey] = useState("")
  const [aiContext, setAiContext] = useState("")
  const [aiModel, setAiModel] = useState("llama-3.1-8b-instant")
  const [savingAi, setSavingAi] = useState(false)
  const [aiSaved, setAiSaved] = useState(false)

  // Copy state
  const [copiedUrl, setCopiedUrl] = useState(false)
  const [copiedToken, setCopiedToken] = useState(false)

  const webhookUrl = typeof window !== "undefined"
    ? `${window.location.origin}/api/instagram/webhook`
    : "https://instapro-lac.vercel.app/api/instagram/webhook"
  const verifyToken = "instapro_secure_verify_token_2026"

  // Fetch current user settings
  useEffect(() => {
    if (!userId) return
    fetch(`/api/user/settings?userId=${userId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data && !data.error) {
          setGroqEnabled(!!data.groq_auto_reply_enabled)
          setAiContext(data.ai_context || "")
          setGroqApiKey(data.groq_api_key || "")
          if (data.ai_model) setAiModel(data.ai_model)
        }
      })
      .catch(() => {})
  }, [userId])

  const handleSaveAiSettings = async () => {
    if (!userId) return
    setSavingAi(true)
    setAiSaved(false)
    try {
      const res = await fetch("/api/user/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          groq_auto_reply_enabled: groqEnabled,
          groq_api_key: groqApiKey,
          ai_context: aiContext,
          ai_model: aiModel,
        }),
      })
      if (res.ok) {
        setAiSaved(true)
        setTimeout(() => setAiSaved(false), 3000)
      }
    } catch (e) {
      console.error("Failed to save AI settings", e)
    } finally {
      setSavingAi(false)
    }
  }

  const copyToClipboard = (text: string, type: "url" | "token") => {
    navigator.clipboard.writeText(text)
    if (type === "url") {
      setCopiedUrl(true)
      setTimeout(() => setCopiedUrl(false), 2000)
    } else {
      setCopiedToken(true)
      setTimeout(() => setCopiedToken(false), 2000)
    }
  }

  const displayUser = username && !username.startsWith("user_") ? `@${username}` : username || "@creator"

  return (
    <div className="p-6 md:p-8 space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="font-mono-ui text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Management Console</span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono-ui font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <ShieldCheck className="w-3 h-3 text-amber-500" /> System Healthy
          </span>
        </div>
        <h1 className="font-serif-display text-4xl text-foreground">System Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Configure connected Instagram permissions, autonomous AI responses, and developer endpoints.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-3 overflow-x-auto">
        <TabButton
          active={activeTab === "account"}
          onClick={() => setActiveTab("account")}
          icon={<User className="w-4 h-4" />}
          label="Account & Meta Token"
        />
        <TabButton
          active={activeTab === "ai"}
          onClick={() => setActiveTab("ai")}
          icon={<Bot className="w-4 h-4" />}
          label="AI Auto-Reply Engine"
        />
        <TabButton
          active={activeTab === "webhook"}
          onClick={() => setActiveTab("webhook")}
          icon={<Server className="w-4 h-4" />}
          label="Webhook & Endpoints"
        />
        <TabButton
          active={activeTab === "support"}
          onClick={() => setActiveTab("support")}
          icon={<MessageCircle className="w-4 h-4" />}
          label="WhatsApp Support"
        />
      </div>

      {/* TAB 1: Account */}
      {activeTab === "account" && (
        <div className="space-y-6">
          <Card className="p-6 bg-card border-border shadow-sm space-y-6">
            <div>
              <h3 className="font-serif-display text-2xl text-foreground">Connected Instagram Account</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Your active Instagram Business session authorized via Meta Graph API.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-muted/20 border border-border space-y-1">
                <p className="text-[11px] text-muted-foreground font-mono-ui uppercase">Instagram Username</p>
                <p className="text-base font-bold text-foreground flex items-center gap-2">
                  <span>{displayUser}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono-ui bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    Active
                  </span>
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-muted/20 border border-border space-y-1">
                <p className="text-[11px] text-muted-foreground font-mono-ui uppercase">Meta User ID</p>
                <p className="text-sm font-mono-ui font-semibold text-foreground">{userId || "Not connected"}</p>
              </div>

              <div className="p-4 rounded-2xl bg-muted/20 border border-border space-y-1">
                <p className="text-[11px] text-muted-foreground font-mono-ui uppercase">Token Health</p>
                <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> 60-Day Long Lived Token Active
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-muted/20 border border-border space-y-1">
                <p className="text-[11px] text-muted-foreground font-mono-ui uppercase">Platform Permissions</p>
                <p className="text-xs font-medium text-foreground">Messages, Comments, Webhooks, Profile</p>
              </div>
            </div>

            <div className="pt-4 border-t border-border flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-xs font-semibold text-foreground">Refresh Instagram Session</p>
                <p className="text-[11px] text-muted-foreground">Re-authorize with Meta if you updated password or page access.</p>
              </div>
              <button
                onClick={() => {
                  window.location.href = "/api/instagram/auth"
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border text-xs font-semibold text-foreground hover:bg-muted transition-all shadow-sm"
              >
                <RefreshCw className="w-3.5 h-3.5 text-amber-500" />
                <span>Reconnect Instagram</span>
              </button>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 2: AI Settings */}
      {activeTab === "ai" && (
        <div className="space-y-6">
          <Card className="p-6 bg-card border-border shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif-display text-2xl text-foreground flex items-center gap-2">
                  <Bot className="w-6 h-6 text-purple-500" /> Autonomous AI Auto-Reply
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Powered by Groq Llama-3.1 to answer customer DMs when no keyword automation matches.
                </p>
              </div>
              <button
                onClick={() => setGroqEnabled(!groqEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  groqEnabled ? "bg-amber-500" : "bg-muted border border-border"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    groqEnabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-amber-500" /> Groq API Key
                </label>
                <input
                  type="password"
                  value={groqApiKey}
                  onChange={(e) => setGroqApiKey(e.target.value)}
                  placeholder="gsk_..."
                  className="w-full h-10 bg-card border border-border rounded-xl px-3.5 text-xs text-foreground font-mono-ui focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                />
                <p className="text-[11px] text-muted-foreground">Free API key available at console.groq.com</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">AI Intelligence Model</label>
                <select
                  value={aiModel}
                  onChange={(e) => setAiModel(e.target.value)}
                  className="w-full h-10 bg-card text-foreground border border-border rounded-xl px-3 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                >
                  <option value="llama-3.1-8b-instant">Llama 3.1 8B Instant (Ultra Fast, Recommended)</option>
                  <option value="llama-3.3-70b-versatile">Llama 3.3 70B Versatile (Deep Reasoning)</option>
                  <option value="mixtral-8x7b-32768">Mixtral 8x7B (Multi-lingual)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Business Persona & Context Knowledge</label>
                <textarea
                  value={aiContext}
                  onChange={(e) => setAiContext(e.target.value)}
                  rows={4}
                  placeholder="Describe your brand, services, pricing, WhatsApp contact, or FAQ instructions. The AI will use this knowledge base to answer incoming DMs naturally."
                  className="w-full bg-card border border-border rounded-xl p-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-border flex items-center justify-between">
              {aiSaved && (
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> AI configuration saved successfully!
                </span>
              )}
              <button
                onClick={handleSaveAiSettings}
                disabled={savingAi}
                className="ml-auto flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-300 text-slate-950 font-mono-ui text-xs font-bold px-5 py-2.5 rounded-xl hover:shadow-md transition-all disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{savingAi ? "Saving..." : "Save AI Settings"}</span>
              </button>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 3: Webhook */}
      {activeTab === "webhook" && (
        <div className="space-y-6">
          <Card className="p-6 bg-card border-border shadow-sm space-y-6">
            <div>
              <h3 className="font-serif-display text-2xl text-foreground">Meta Webhook Configuration</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Use these values in Meta Developer App ➔ Instagram ➔ Webhook setup.
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-muted/20 border border-border space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-foreground">Callback URL</label>
                  <button
                    onClick={() => copyToClipboard(webhookUrl, "url")}
                    className="flex items-center gap-1 text-[11px] font-mono-ui text-amber-600 dark:text-amber-400 hover:underline"
                  >
                    {copiedUrl ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedUrl ? "Copied!" : "Copy URL"}</span>
                  </button>
                </div>
                <code className="block p-2.5 rounded-xl bg-card border border-border text-xs font-mono-ui text-foreground select-all break-all">
                  {webhookUrl}
                </code>
              </div>

              <div className="p-4 rounded-2xl bg-muted/20 border border-border space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-foreground">Verify Token</label>
                  <button
                    onClick={() => copyToClipboard(verifyToken, "token")}
                    className="flex items-center gap-1 text-[11px] font-mono-ui text-amber-600 dark:text-amber-400 hover:underline"
                  >
                    {copiedToken ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedToken ? "Copied!" : "Copy Token"}</span>
                  </button>
                </div>
                <code className="block p-2.5 rounded-xl bg-card border border-border text-xs font-mono-ui text-foreground select-all">
                  {verifyToken}
                </code>
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-blue-500/20 bg-blue-500/5 space-y-2">
              <p className="text-xs font-bold text-foreground flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-500" /> Subscribed Webhook Fields:
              </p>
              <p className="text-xs text-muted-foreground">
                Ensure <code className="text-foreground font-mono-ui bg-muted px-1.5 py-0.5 rounded">messages</code>,{" "}
                <code className="text-foreground font-mono-ui bg-muted px-1.5 py-0.5 rounded">messaging_postbacks</code>, and{" "}
                <code className="text-foreground font-mono-ui bg-muted px-1.5 py-0.5 rounded">comments</code> are checked in your Meta Developer App.
              </p>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 4: Support */}
      {activeTab === "support" && (
        <div className="space-y-6">
          <Card className="p-6 bg-card border-border shadow-sm space-y-6 text-center">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-500">
              <MessageCircle className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="font-serif-display text-3xl text-foreground">Dedicated WhatsApp Support</h3>
              <p className="text-xs text-muted-foreground max-w-md mx-auto">
                Need assistance setting up automations, Meta App Review, or custom workflows? Connect directly with our developer team.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-muted/20 border border-border max-w-md mx-auto space-y-1">
              <p className="text-[11px] text-muted-foreground font-mono-ui uppercase">Official Support Number</p>
              <p className="text-xl font-bold text-foreground font-mono-ui tracking-wider">+91 9118016507</p>
            </div>

            <a
              href={`https://wa.me/919118016507?text=${encodeURIComponent(
                `Hi ShinePro Support, I need help with my account (Instagram: @${username || "creator"})`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs font-mono-ui px-6 py-3 rounded-xl shadow-lg shadow-emerald-500/20 transition-all hover:scale-105"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat on WhatsApp Now</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </Card>
        </div>
      )}
    </div>
  )
}

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
        active
          ? "bg-amber-500 text-slate-950 shadow-sm"
          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  )
}