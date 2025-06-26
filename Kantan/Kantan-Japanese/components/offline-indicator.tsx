"use client"

import { useState, useEffect } from "react"
import { WifiOff } from "lucide-react"

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  if (isOnline) return null

  return (
    <div className="fixed top-0 left-0 right-0 bg-red-500 text-white p-2 text-center text-sm z-50">
      <WifiOff className="w-4 h-4 inline mr-2" />
      You're offline - progress will sync when reconnected
    </div>
  )
}
