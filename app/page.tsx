"use client"

import { Suspense, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { LandingPage } from "@/components/layout/landing-page"

function HomeContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const code = searchParams?.get("code")
    const savedId = typeof window !== "undefined" ? localStorage.getItem("ig_user_id") : null

    if (code) {
      router.replace("/dashboard?code=" + code)
    } else if (savedId) {
      router.replace("/dashboard")
    }
  }, [searchParams, router])

  return <LandingPage />
}

export default function Home() {
  return (
    <Suspense fallback={<LandingPage />}>
      <HomeContent />
    </Suspense>
  )
}
