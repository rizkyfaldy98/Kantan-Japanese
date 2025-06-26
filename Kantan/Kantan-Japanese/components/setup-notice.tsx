"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, X, Copy, Check } from "lucide-react"

export function SetupNotice() {
  const [isVisible, setIsVisible] = useState(true)
  const [copied, setCopied] = useState(false)

  const envTemplate = `NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(envTemplate)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!isVisible) return null

  return (
    <div className="fixed top-4 left-4 right-4 z-50 max-w-md mx-auto">
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-orange-800 mb-2">Demo Mode - Database Not Connected</h3>
              <p className="text-xs text-orange-700 mb-3">
                The app is running in demo mode. To enable user accounts and progress saving:
              </p>

              <div className="space-y-2 text-xs">
                <p className="font-medium text-orange-800">Quick Setup:</p>
                <ol className="list-decimal list-inside space-y-1 text-orange-700">
                  <li>
                    Create account at{" "}
                    <a href="https://supabase.com" target="_blank" className="underline" rel="noreferrer">
                      supabase.com
                    </a>
                  </li>
                  <li>Create new project</li>
                  <li>Copy URL and anon key</li>
                  <li>Create .env.local file:</li>
                </ol>

                <div className="bg-white/70 rounded p-2 mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-mono text-gray-600">.env.local</span>
                    <Button onClick={copyToClipboard} size="sm" variant="ghost" className="h-6 w-6 p-0">
                      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    </Button>
                  </div>
                  <pre className="text-xs text-gray-800 whitespace-pre-wrap">{envTemplate}</pre>
                </div>

                <p className="text-orange-700">
                  5. Restart: <code className="bg-white/70 px-1 rounded">npm run dev</code>
                </p>
              </div>
            </div>
            <Button
              onClick={() => setIsVisible(false)}
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0 text-orange-600 hover:text-orange-800"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
