"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Github, Mail, Eye, EyeOff, Loader2 } from "lucide-react"
import { AuthService } from "@/lib/database"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  if (!isOpen) return null

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      if (isLogin) {
        await AuthService.signInWithEmail(email, password)
      } else {
        await AuthService.signUpWithEmail(email, password, fullName)
      }
      onSuccess()
      onClose()
    } catch (err: any) {
      setError(err.message || "Authentication failed")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleAuth = async () => {
    setLoading(true)
    setError("")
    try {
      await AuthService.signInWithGoogle()
    } catch (err: any) {
      setError(err.message || "Google authentication failed")
      setLoading(false)
    }
  }

  const handleGitHubAuth = async () => {
    setLoading(true)
    setError("")
    try {
      await AuthService.signInWithGitHub()
    } catch (err: any) {
      setError(err.message || "GitHub authentication failed")
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">{isLogin ? "Welcome Back!" : "Join Kantan Japanese"}</CardTitle>
          <CardDescription>
            {isLogin ? "Sign in to sync your progress" : "Create an account to save your progress"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
          )}

          {/* Social Auth */}
          <div className="space-y-3">
            <Button
              onClick={handleGoogleAuth}
              disabled={loading}
              variant="outline"
              className="w-full flex items-center justify-center space-x-2"
            >
              <Mail className="w-4 h-4" />
              <span>Continue with Google</span>
            </Button>
            <Button
              onClick={handleGitHubAuth}
              disabled={loading}
              variant="outline"
              className="w-full flex items-center justify-center space-x-2"
            >
              <Github className="w-4 h-4" />
              <span>Continue with GitHub</span>
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Or continue with email</span>
            </div>
          </div>

          {/* Email Auth Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  required={!isLogin}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {isLogin ? "Signing in..." : "Creating account..."}
                </>
              ) : (
                <span>{isLogin ? "Sign In" : "Create Account"}</span>
              )}
            </Button>
          </form>

          <div className="text-center">
            <Button variant="link" onClick={() => setIsLogin(!isLogin)} className="text-sm">
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </Button>
          </div>

          <Button variant="ghost" onClick={onClose} className="w-full">
            Continue without account
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
