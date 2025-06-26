"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        console.error("Auth callback error:", error)
        router.push("/?error=auth_failed")
        return
      }

      if (data.session) {
        router.push("/?auth=success")
      } else {
        router.push("/")
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full mx-auto mb-4" />
        <p className="text-gray-600">Completing authentication...</p>
      </div>
    </div>
  )
}
