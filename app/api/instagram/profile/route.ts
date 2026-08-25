import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase-server"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get("userId")

    if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 })

    const supabase = await getSupabaseServerClient()

    const { data: user } = await supabase
      .from("users")
      .select("id, username, access_token, business_account_id, created_at, groq_auto_reply_enabled")
      .eq("id", userId)
      .single()

    if (!user?.access_token) {
      return NextResponse.json({ error: "Instagram account not connected" }, { status: 401 })
    }

    // Try Graph API to get live followers, following, media count, name
    let igProfile: any = null
    try {
      const url = `https://graph.instagram.com/me?fields=id,username,name,account_type,profile_picture_url,followers_count,follows_count,media_count&access_token=${user.access_token}`
      const res = await fetch(url, { cache: "no-store" })
      const data = await res.json()
      if (!data.error) {
        igProfile = data
      } else {
        // Fallback with basic fields if some permissions are not granted
        const basicUrl = `https://graph.instagram.com/me?fields=id,username,name,account_type,media_count&access_token=${user.access_token}`
        const basicRes = await fetch(basicUrl, { cache: "no-store" })
        const basicData = await basicRes.json()
        if (!basicData.error) {
          igProfile = basicData
        }
      }
    } catch (e) {
      console.warn("[Profile API] Error fetching Instagram Graph profile:", e)
    }

    // Also get counts from Supabase
    const { count: automationsCount } = await supabase
      .from("automations")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)

    const { count: conversationsCount } = await supabase
      .from("conversations")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)

    return NextResponse.json({
      success: true,
      profile: {
        id: user.id,
        username: igProfile?.username || user.username,
        name: igProfile?.name || igProfile?.username || user.username,
        account_type: igProfile?.account_type || "BUSINESS",
        followers_count: igProfile?.followers_count ?? null,
        follows_count: igProfile?.follows_count ?? null,
        media_count: igProfile?.media_count ?? 0,
        profile_picture_url: igProfile?.profile_picture_url || null,
        connected_since: user.created_at,
        groq_auto_reply_enabled: user.groq_auto_reply_enabled ?? false,
        total_automations: automationsCount || 0,
        total_conversations: conversationsCount || 0,
      }
    })
  } catch (error) {
    console.error("[Profile API] Server error:", error)
    return NextResponse.json({ error: "Failed to fetch profile details" }, { status: 500 })
  }
}
