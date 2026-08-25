import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase-server"

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId")
    if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 })

    const supabase = await getSupabaseServerClient()

    // 1. Fetch automations for user
    const { data: automations } = await supabase
      .from("automations")
      .select("id, name, trigger_source, trigger_type, trigger_value, is_active, created_at")
      .eq("user_id", userId)

    // 2. Fetch total unique conversations
    const { count: conversationsCount } = await supabase
      .from("conversations")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)

    // 3. Fetch incoming vs outgoing messages
    const { data: messages } = await supabase
      .from("messages")
      .select("id, created_at, is_from_instagram, content")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1000)

    const allMessages = messages || []
    const incomingMessages = allMessages.filter((m) => m.is_from_instagram)
    const outgoingMessages = allMessages.filter((m) => !m.is_from_instagram)
    const aiMessages = outgoingMessages.filter((m) => m.id?.startsWith("mid_ai_"))
    const followGateUnlocks = outgoingMessages.filter(
      (m) => m.content?.includes("Unlocked") || m.content?.includes("✅") || m.id?.includes("unlock"),
    )

    // 4. Calculate daily activity for last 14 days
    const dailyMap: Record<string, { incoming: number; outgoing: number; date: string }> = {}
    const now = new Date()

    for (let i = 13; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(d.getDate() - i)
      const key = d.toISOString().split("T")[0]
      const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
      dailyMap[key] = { incoming: 0, outgoing: 0, date: label }
    }

    allMessages.forEach((msg) => {
      const msgDate = msg.created_at ? msg.created_at.split("T")[0] : null
      if (msgDate && dailyMap[msgDate]) {
        if (msg.is_from_instagram) {
          dailyMap[msgDate].incoming++
        } else {
          dailyMap[msgDate].outgoing++
        }
      }
    })

    const dailyActivity = Object.values(dailyMap)

    // 5. Trigger source distribution
    const autoList = automations || []
    const commentRules = autoList.filter((a) => a.trigger_source === "comment").length
    const dmRules = autoList.filter((a) => a.trigger_source === "dm" || !a.trigger_source).length
    const storyRules = autoList.filter((a) => a.trigger_source === "story").length

    // 6. Conversion Rate calculation
    const totalSent = outgoingMessages.length
    const totalUnlocks = Math.max(followGateUnlocks.length, 0)
    const conversionRate = totalSent > 0 ? Math.min(100, Math.round((totalUnlocks / totalSent) * 100)) : 0

    return NextResponse.json({
      metrics: {
        totalIncomingDMs: incomingMessages.length,
        totalRepliesSent: outgoingMessages.length,
        totalAudience: conversationsCount || 0,
        followersConverted: totalUnlocks,
        aiRepliesCount: aiMessages.length,
        conversionRate,
        activeAutomations: autoList.filter((a) => a.is_active).length,
      },
      distribution: {
        commentRules,
        dmRules,
        storyRules,
      },
      dailyActivity,
      automations: autoList.slice(0, 8),
    })
  } catch (error) {
    console.error("[analytics] API Error:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}
