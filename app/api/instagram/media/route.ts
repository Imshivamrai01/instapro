import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase-server"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get("userId")

    if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 })

    const supabase = await getSupabaseServerClient()

    // 1. Get Access Token and Business Account ID
    const { data: user } = await supabase
      .from("users")
      .select("access_token, business_account_id, page_id")
      .eq("id", userId)
      .single()

    if (!user?.access_token) {
      return NextResponse.json({ error: "Instagram not connected" }, { status: 401 })
    }

    const token = user.access_token
    const targetIds = [
      "me",
      user.business_account_id?.toString(),
      user.page_id?.toString(),
      userId,
    ].filter(Boolean) as string[]

    let rawMedia: any[] = []

    // Try fetching from endpoints
    for (const targetId of targetIds) {
      if (rawMedia.length > 0) break

      const endpoints = [
        `https://graph.instagram.com/v24.0/${targetId}/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&limit=50&access_token=${token}`,
        `https://graph.instagram.com/${targetId}/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&limit=50&access_token=${token}`,
        `https://graph.facebook.com/v24.0/${targetId}/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&limit=50&access_token=${token}`,
      ]

      for (const ep of endpoints) {
        try {
          const res = await fetch(ep, { cache: "no-store" })
          const json = await res.json()
          if (json && Array.isArray(json.data) && json.data.length > 0) {
            rawMedia = json.data
            console.log(`[media] Successfully fetched ${rawMedia.length} posts from ${ep.split("?")[0]}`)
            break
          }
        } catch (e) {
          console.warn(`[media] Failed fetching from ${ep.split("?")[0]}`)
        }
      }
    }

    // Normalize: pick thumbnail_url for videos, media_url for images, never drop items
    const normalized = rawMedia.map((m: any) => ({
      id: m.id,
      caption: m.caption || "Untitled Reel / Post",
      media_type: m.media_type || "VIDEO",
      image_url: m.thumbnail_url || m.media_url || null,
      permalink: m.permalink || `https://instagram.com/p/${m.id}`,
      timestamp: m.timestamp || null,
    }))

    return NextResponse.json({ data: normalized })
  } catch (error) {
    console.error("[media] Server Error:", error)
    return NextResponse.json({ error: "Server Error" }, { status: 500 })
  }
}
