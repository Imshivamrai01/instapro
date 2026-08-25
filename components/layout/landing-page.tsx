"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import {
  Zap, MessageCircle, Sparkles, ArrowUpRight, Github, Star,
  Send, AtSign, Brain, Inbox, Lock, Terminal, ShieldCheck, CheckCircle2,
  Bot, Clock, Flame
} from "lucide-react"

const TELEGRAM_URL = "https://t.me/instagramautomationp8"
const GITHUB_URL = "https://github.com/Imshivamrai01/instapro"

export function LandingPage() {
  const [stars, setStars] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState<"comment" | "dm" | "ai">("comment")
  const router = useRouter()

  useEffect(() => {
    fetch("https://api.github.com/repos/Imshivamrai01/instapro")
      .then(r => r.json())
      .then(d => { if (typeof d?.stargazers_count === "number") setStars(d.stargazers_count) })
      .catch(() => {})
  }, [])

  const handleLogin = () => {
    window.location.href = `https://www.instagram.com/oauth/authorize?enable_fb_login=0&force_authentication=1&client_id=${process.env.NEXT_PUBLIC_INSTAGRAM_APP_ID}&redirect_uri=${process.env.NEXT_PUBLIC_INSTAGRAM_REDIRECT_URI}&response_type=code&scope=instagram_business_basic%2Cinstagram_business_manage_messages%2Cinstagram_business_manage_comments`
  }

  const handleTestLogin = () => {
    localStorage.setItem("ig_user_id", "9999999999")
    localStorage.setItem("ig_username", "shinepro_creator")
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-[#070B19] text-[#F8FAFC] selection:bg-[#F59E0B] selection:text-[#070B19] overflow-x-hidden antialiased">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap');
        .font-serif-display { font-family: 'Instrument Serif', Georgia, serif; }
        .font-sans-ui { font-family: 'Plus Jakarta Sans', sans-serif; }
        .font-mono-ui { font-family: 'JetBrains Mono', ui-monospace, monospace; }
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .marquee-track { animation: marquee 28s linear infinite; }
        @keyframes pulse-glow { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.8; } }
        .glow-gold { animation: pulse-glow 4s ease-in-out infinite; }
      `}</style>

      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-b from-amber-500/15 via-blue-600/10 to-transparent blur-[120px] rounded-full" />
        <div className="absolute top-1/3 -left-40 w-[450px] h-[450px] bg-amber-500/10 blur-[140px] rounded-full" />
        <div className="absolute top-2/3 -right-40 w-[450px] h-[450px] bg-blue-500/10 blur-[140px] rounded-full" />
      </div>

      {/* Navigation Header */}
      <nav className="relative z-50 flex items-center justify-between px-5 md:px-12 h-20 border-b border-white/[0.08] backdrop-blur-xl bg-[#070B19]/70">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-amber-500/40 bg-[#0B132B] shadow-lg shadow-amber-500/10 flex items-center justify-center p-1">
            <Image src="/logo.png" alt="SP Shine Pro" width={38} height={38} className="object-contain" priority />
          </div>
          <div className="flex flex-col">
            <span className="text-base md:text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
              <span>Shine</span>
              <span className="bg-gradient-to-r from-amber-400 to-amber-200 bg-clip-text text-transparent font-extrabold">Pro</span>
            </span>
            <span className="text-[10px] font-mono-ui uppercase tracking-wider text-amber-400/80 font-medium">Instagram AI Suite</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={GITHUB_URL} target="_blank" rel="noreferrer"
            className="hidden sm:flex items-center gap-1.5 font-mono-ui text-xs text-slate-300 hover:text-white border border-white/10 hover:border-amber-400/40 bg-white/[0.02] rounded-full px-4 py-2 transition-all shadow-sm"
          >
            <Github className="w-3.5 h-3.5" />
            <span>GitHub</span>
            {stars !== null && <span className="text-amber-400 font-bold ml-1">★ {stars}</span>}
          </a>

          {process.env.NODE_ENV === "development" && (
            <button
              onClick={handleTestLogin}
              className="font-mono-ui text-xs font-bold text-amber-300 border border-amber-400/30 rounded-full px-4 py-2 hover:bg-amber-400/10 transition-colors"
            >
              Dev Login
            </button>
          )}

          <button
            onClick={handleLogin}
            className="flex items-center gap-2 font-mono-ui text-xs font-bold bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 text-slate-950 rounded-full px-5 py-2.5 hover:shadow-lg hover:shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all font-semibold"
          >
            <span>Connect Instagram</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 font-sans-ui">
        <section className="px-5 md:px-12 pt-16 md:pt-24 pb-16 max-w-7xl mx-auto">
          {/* Badge */}
          <div className="flex items-center gap-2 mb-6">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono-ui font-semibold bg-amber-500/10 border border-amber-400/30 text-amber-300 backdrop-blur-md shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Next-Gen Instagram Automation & AI DM Assistant</span>
            </span>
          </div>

          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Headlines & CTA */}
            <div className="lg:col-span-7 space-y-6">
              <h1 className="font-serif-display text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] leading-[1.02] tracking-tight text-white">
                Turn Comments & DMs into{" "}
                <span className="italic bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-200 bg-clip-text text-transparent font-normal">
                  Instant Revenue.
                </span>
              </h1>

              <p className="text-slate-300 text-base sm:text-lg md:text-xl max-w-2xl leading-relaxed font-normal">
                Automate comment-to-DM funnels, keyword triggers, instant AI auto-replies, and story reactions. Experience the power of enterprise automation with complete control.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-3">
                <button
                  onClick={handleLogin}
                  className="group flex items-center gap-3 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 text-slate-950 font-mono-ui text-sm font-bold px-8 py-4 rounded-full hover:shadow-xl hover:shadow-amber-500/25 hover:scale-[1.03] active:scale-[0.98] transition-all"
                >
                  <Zap className="w-4 h-4 fill-slate-950" />
                  <span>Start Free with Instagram</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>

                <a
                  href={TELEGRAM_URL} target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 font-mono-ui text-sm font-medium text-slate-200 border border-white/15 bg-white/[0.04] px-6 py-4 rounded-full hover:border-amber-400/40 hover:text-amber-300 transition-all"
                >
                  <Send className="w-4 h-4 text-[#2AABEE]" />
                  <span>Telegram Community</span>
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-400 font-mono-ui">
                <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-400" /> Meta Graph API Approved</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-amber-400" /> 100% Data Privacy (Supabase)</span>
                <span className="flex items-center gap-1.5"><Bot className="w-4 h-4 text-blue-400" /> Powered by Groq Llama-3.1</span>
              </div>
            </div>

            {/* Right Column: Live Automation Simulator Preview */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl p-1 bg-gradient-to-b from-amber-400/30 via-white/10 to-transparent shadow-2xl shadow-amber-500/10">
                <div className="bg-[#0B132B] rounded-[22px] border border-white/[0.08] p-5 sm:p-6 overflow-hidden">
                  {/* Simulator Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                    <div className="flex items-center gap-2.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/80" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                      <div className="w-3 h-3 rounded-full bg-green-500/80" />
                      <span className="text-xs font-mono-ui text-slate-400 ml-2">Live Funnel Preview</span>
                    </div>
                    <span className="text-[10px] font-mono-ui px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Active
                    </span>
                  </div>

                  {/* Simulator Tabs */}
                  <div className="flex gap-2 my-4 p-1 bg-[#070B19] rounded-xl border border-white/[0.06]">
                    <button
                      onClick={() => setActiveTab("comment")}
                      className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${activeTab === "comment" ? "bg-amber-400 text-slate-950 font-bold shadow" : "text-slate-400 hover:text-white"}`}
                    >
                      Comment → DM
                    </button>
                    <button
                      onClick={() => setActiveTab("dm")}
                      className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${activeTab === "dm" ? "bg-amber-400 text-slate-950 font-bold shadow" : "text-slate-400 hover:text-white"}`}
                    >
                      Keyword DM
                    </button>
                    <button
                      onClick={() => setActiveTab("ai")}
                      className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${activeTab === "ai" ? "bg-amber-400 text-slate-950 font-bold shadow" : "text-slate-400 hover:text-white"}`}
                    >
                      AI Auto-Reply
                    </button>
                  </div>

                  {/* Simulator Screen */}
                  <div className="space-y-3 font-sans-ui text-xs">
                    {activeTab === "comment" && (
                      <>
                        <div className="p-3 rounded-xl bg-slate-900/90 border border-white/10 space-y-1.5">
                          <div className="flex items-center justify-between text-slate-400 text-[11px]">
                            <span className="font-semibold text-slate-200">@customer_pro</span>
                            <span>Commented on Reel</span>
                          </div>
                          <p className="text-white font-medium">"Price please! 🚀"</p>
                        </div>

                        <div className="flex items-center justify-center gap-2 py-0.5">
                          <span className="h-4 w-px bg-amber-400/40" />
                          <span className="text-[10px] font-mono-ui text-amber-400 uppercase tracking-wider">Trigger: instant auto-dm</span>
                          <span className="h-4 w-px bg-amber-400/40" />
                        </div>

                        <div className="p-3.5 rounded-xl bg-gradient-to-br from-[#101A36] to-[#0A1224] border border-amber-500/30 space-y-2">
                          <div className="flex items-center gap-2 text-amber-300 font-semibold text-[11px]">
                            <Sparkles className="w-3.5 h-3.5" /> SP Shine Pro Automation
                          </div>
                          <p className="text-slate-200">"Hey! Here is our full pricing brochure & 20% discount link:"</p>
                          <div className="p-2.5 rounded-lg bg-amber-400/10 border border-amber-400/30 text-amber-300 font-semibold flex items-center justify-between">
                            <span>📦 View Product Catalog</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      </>
                    )}

                    {activeTab === "dm" && (
                      <>
                        <div className="p-3 rounded-xl bg-slate-900/90 border border-white/10 space-y-1">
                          <div className="text-[11px] text-slate-400 font-semibold">User DM:</div>
                          <p className="text-white font-medium">"LINK"</p>
                        </div>
                        <div className="p-3.5 rounded-xl bg-[#101A36] border border-amber-500/30 space-y-2">
                          <p className="text-slate-200">"Thanks for reaching out! Here's your exclusive VIP access link 💎"</p>
                          <div className="flex gap-2">
                            <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[11px] font-medium">✨ Open VIP Portal</span>
                          </div>
                        </div>
                      </>
                    )}

                    {activeTab === "ai" && (
                      <>
                        <div className="p-3 rounded-xl bg-slate-900/90 border border-white/10 space-y-1">
                          <div className="text-[11px] text-slate-400 font-semibold">Random Unmatched DM:</div>
                          <p className="text-white font-medium">"Do you deliver to Mumbai within 2 days?"</p>
                        </div>
                        <div className="p-3.5 rounded-xl bg-gradient-to-br from-blue-950/60 to-[#101A36] border border-blue-400/30 space-y-1.5">
                          <div className="flex items-center gap-1.5 text-blue-300 font-semibold text-[11px]">
                            <Brain className="w-3.5 h-3.5" /> Groq Llama-3.1 AI Response
                          </div>
                          <p className="text-slate-200">"Yes! We offer express delivery to Mumbai within 24-48 hours. Would you like to place an order now?"</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Marquee Banner */}
        <div className="border-y border-white/[0.08] bg-[#070B19]/80 py-4 overflow-hidden backdrop-blur-md">
          <div className="marquee-track flex whitespace-nowrap font-mono-ui text-xs uppercase tracking-[0.25em] text-slate-400 gap-10 w-max">
            {Array.from({ length: 2 }).map((_, copy) => (
              <div key={copy} className="flex gap-10">
                {[
                  "Comment → DM Funnels",
                  "AI Auto-Reply (Groq / Llama-3.1)",
                  "Keyword Triggers",
                  "Unified Live Inbox",
                  "Story Mentions & Reactions",
                  "Follow Gate & Lockers",
                  "Rich Card Buttons & Quick Replies",
                  "Private & Public Comments",
                ].map((t) => (
                  <span key={t} className="flex items-center gap-10">
                    <span className="text-slate-300 font-semibold">{t}</span>
                    <span className="text-amber-400">✦</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Feature Grid */}
        <section className="px-5 md:px-12 py-24 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
            <div>
              <p className="font-mono-ui text-xs uppercase tracking-[0.25em] text-amber-400 mb-2 font-semibold">Features & Capabilities</p>
              <h2 className="font-serif-display text-4xl sm:text-5xl md:text-6xl text-white">Built for Maximum Conversion.</h2>
            </div>
            <p className="text-slate-400 text-sm md:text-base max-w-md font-sans-ui">
              Automate your entire Instagram sales & engagement funnel with precision and zero latency.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<MessageCircle className="w-5 h-5 text-amber-400" />}
              title="Comment → DM Funnels"
              desc="Trigger automated DMs from any keyword in comments. Send public thread replies and private DMs simultaneously."
            />
            <FeatureCard
              icon={<Brain className="w-5 h-5 text-amber-400" />}
              title="Groq AI Auto-Reply"
              desc="Intelligent AI responds to unmatched DMs with full context of your products, tone, and pricing."
            />
            <FeatureCard
              icon={<Send className="w-5 h-5 text-amber-400" />}
              title="Keyword DM Triggers"
              desc="Set instant replies for keywords like PRICE, LINK, DEMO. Support for cards, carousel buttons, and media."
            />
            <FeatureCard
              icon={<Inbox className="w-5 h-5 text-amber-400" />}
              title="Unified Live Inbox"
              desc="Manage all conversations in one clean dashboard. Intervene manually anytime with quick response shortcuts."
            />
            <FeatureCard
              icon={<Lock className="w-5 h-5 text-amber-400" />}
              title="Follower Gate"
              desc="Require users to follow your account to unlock private resource links and exclusive files automatically."
            />
            <FeatureCard
              icon={<Sparkles className="w-5 h-5 text-amber-400" />}
              title="Humanized Delays & Typing"
              desc="Configurable natural delays and typing indicators so automated replies appear completely authentic."
            />
          </div>
        </section>

        {/* Community & Support */}
        <section className="px-5 md:px-12 pb-24 max-w-7xl mx-auto">
          <div className="border border-amber-500/20 rounded-3xl p-8 md:p-14 bg-gradient-to-br from-[#0B132B] via-[#070B19] to-[#0B132B] shadow-2xl relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
              <div className="space-y-3 max-w-xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono-ui bg-amber-400/10 text-amber-300 border border-amber-400/30">
                  <Flame className="w-3.5 h-3.5 text-amber-400" /> Community & Support
                </div>
                <h3 className="font-serif-display text-3xl sm:text-4xl md:text-5xl text-white">Join the Creator Network.</h3>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  Get updates, discuss new automation tactics, report bugs, and request features directly with the development team on Telegram.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <a
                  href={TELEGRAM_URL} target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 bg-[#2AABEE] hover:bg-[#229ED9] text-white font-mono-ui text-sm font-bold px-6 py-3.5 rounded-full shadow-lg shadow-[#2AABEE]/20 hover:scale-[1.02] transition-all"
                >
                  <Send className="w-4 h-4" /> Join Telegram
                </a>
                <a
                  href={GITHUB_URL} target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 border border-white/15 bg-white/[0.04] text-white font-mono-ui text-sm font-bold px-6 py-3.5 rounded-full hover:border-amber-400/40 transition-colors"
                >
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" /> Star Repository
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.08] px-5 md:px-12 py-10 bg-[#070B19] flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono-ui text-slate-400">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-lg overflow-hidden border border-amber-400/30 flex items-center justify-center bg-[#0B132B]">
            <Image src="/logo.png" alt="SP Shine Pro" width={24} height={24} className="object-contain" />
          </div>
          <span>© 2026 SP Shine Pro — Enterprise Instagram Automation.</span>
        </div>
        <div className="flex items-center gap-6 text-slate-400">
          <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="hover:text-amber-300 transition-colors">GitHub</a>
          <a href={TELEGRAM_URL} target="_blank" rel="noreferrer" className="hover:text-[#2AABEE] transition-colors">Telegram</a>
          <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="bg-[#0B132B]/80 border border-white/[0.08] hover:border-amber-500/40 p-8 rounded-2xl group transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/5 hover:-translate-y-1">
      <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-400/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-amber-500/20 transition-all">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-white mb-2.5 font-sans-ui">{title}</h3>
      <p className="text-sm text-slate-300 leading-relaxed font-sans-ui">{desc}</p>
    </div>
  )
}
