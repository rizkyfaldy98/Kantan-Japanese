"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Eye, EyeOff, Loader2, BookOpen } from "lucide-react"
import { AuthService } from "@/lib/database"

interface LoginScreenProps {
  onComplete: () => void
}

export function LoginScreen({ onComplete }: LoginScreenProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      if (isLogin) {
        await AuthService.signInWithEmail(email, password)
      } else {
        await AuthService.signUpWithEmail(email, password)
      }
      onComplete()
    } catch (err: any) {
      setError(err.message || "Authentication failed")
    } finally {
      setLoading(false)
    }
  }

  const handleAnonymousSignIn = () => {
    // Continue without account
    onComplete()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-6 shadow-lg">
        <div className="container mx-auto max-w-md">
          <div className="flex items-center space-x-3 text-white">
            <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-semibold">Kantan Japanese</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-3">Learn Japanese</h2>
          <p className="text-gray-600 text-lg">Master thousands of Japanese words with smart flashcards</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardContent className="p-8">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleEmailAuth} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                    className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                    className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500 pr-12"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold text-base rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {isLogin ? "Signing in..." : "Creating account..."}
                  </>
                ) : (
                  <span>{isLogin ? "Sign in" : "Sign up"}</span>
                )}
              </Button>
            </form>

            <div className="text-center mt-6">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-gray-600 hover:text-blue-600 text-sm font-medium transition-colors duration-200"
              >
                {isLogin ? "Don't have an account? Sign up instead" : "Already have an account? Sign in instead"}
              </button>
            </div>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-4 text-gray-500 font-medium">or</span>
              </div>
            </div>

            <Button
              onClick={handleAnonymousSignIn}
              variant="outline"
              className="w-full h-12 border-2 border-blue-500 text-blue-600 hover:bg-blue-50 font-semibold text-base rounded-lg transition-all duration-200"
            >
              Sign in anonymously
            </Button>
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">By continuing, you agree to our Terms of Service and Privacy Policy</p>
        </div>
      </div>
    </div>
  )
}
