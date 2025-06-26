"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle, RefreshCw } from "lucide-react"

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("🚨 Error Boundary Caught:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardContent className="p-8 text-center">
              <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-red-600 mb-4">Oops! Something went wrong</h1>
              <p className="text-red-500 mb-6">Don't worry, this happens sometimes. Let's get you back to learning!</p>
              <div className="space-y-3">
                <Button
                  onClick={() => window.location.reload()}
                  className="w-full bg-red-500 hover:bg-red-600 text-white"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh Page
                </Button>
                <Button onClick={() => this.setState({ hasError: false })} variant="outline" className="w-full">
                  Try Again
                </Button>
              </div>
              {process.env.NODE_ENV === "development" && (
                <details className="mt-4 text-left">
                  <summary className="cursor-pointer text-sm text-gray-500">Error Details (Dev Mode)</summary>
                  <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">{this.state.error?.stack}</pre>
                </details>
              )}
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}
