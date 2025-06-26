"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Download, X } from "lucide-react"

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowPrompt(true)
    }

    window.addEventListener("beforeinstallprompt", handler)
    return () => window.removeEventListener("beforeinstallprompt", handler)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === "accepted") {
      setShowPrompt(false)
    }
    setDeferredPrompt(null)
  }

  if (!showPrompt) return null

  return (
    <div className="fixed top-4 left-4 right-4 z-50 max-w-sm mx-auto">
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Download className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-blue-800 mb-1">Install App</h3>
              <p className="text-xs text-blue-700 mb-3">
                Add Kantan Japanese to your home screen for a better experience!
              </p>
              <div className="flex space-x-2">
                <Button onClick={handleInstall} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white text-xs">
                  Install
                </Button>
                <Button
                  onClick={() => setShowPrompt(false)}
                  size="sm"
                  variant="ghost"
                  className="text-blue-600 text-xs"
                >
                  Later
                </Button>
              </div>
            </div>
            <Button
              onClick={() => setShowPrompt(false)}
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0 text-blue-600"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
