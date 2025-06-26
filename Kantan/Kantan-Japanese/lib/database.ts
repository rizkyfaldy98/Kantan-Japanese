import { supabase } from "./supabase"
import type { StudyProgress, CardProgress, StudySession } from "./supabase"

// Add this helper function to check if Supabase is configured
const isSupabaseConfigured = () => {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder.supabase.co"
  )
}

export class DatabaseService {
  // User Profile Management
  static async getCurrentUser() {
    if (!isSupabaseConfigured()) {
      console.warn("Supabase not configured, returning null user")
      return null
    }

    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()
      if (error) throw error
      return user
    } catch (error) {
      console.warn("Error getting current user:", error)
      return null
    }
  }

  static async getProfile(userId: string) {
    if (!isSupabaseConfigured()) return null

    try {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()
      if (error) throw error
      return data
    } catch (error) {
      console.warn("Error getting profile:", error)
      return null
    }
  }

  static async updateProfile(userId: string, updates: Partial<any>) {
    if (!isSupabaseConfigured()) return null

    try {
      const { data, error } = await supabase.from("profiles").update(updates).eq("id", userId).select().single()
      if (error) throw error
      return data
    } catch (error) {
      console.warn("Error updating profile:", error)
      return null
    }
  }

  // Study Progress Management
  static async getStudyProgress(userId: string): Promise<StudyProgress | null> {
    if (!isSupabaseConfigured()) return null

    try {
      const { data, error } = await supabase.from("study_progress").select("*").eq("user_id", userId).single()
      if (error && error.code !== "PGRST116") throw error
      return data
    } catch (error) {
      console.warn("Error getting study progress:", error)
      return null
    }
  }

  static async updateStudyProgress(userId: string, progress: Partial<StudyProgress>) {
    if (!isSupabaseConfigured()) return null

    try {
      const { data, error } = await supabase
        .from("study_progress")
        .upsert({
          user_id: userId,
          ...progress,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.warn("Error updating study progress:", error)
      return null
    }
  }

  // Card Progress Management
  static async getCardProgress(userId: string, cardId: string): Promise<CardProgress | null> {
    if (!isSupabaseConfigured()) return null

    try {
      const { data, error } = await supabase
        .from("card_progress")
        .select("*")
        .eq("user_id", userId)
        .eq("card_id", cardId)
        .single()

      if (error && error.code !== "PGRST116") throw error
      return data
    } catch (error) {
      console.warn("Error getting card progress:", error)
      return null
    }
  }

  static async updateCardProgress(userId: string, cardId: string, level: string, category: string, difficulty: number) {
    if (!isSupabaseConfigured()) return null

    try {
      const existing = await this.getCardProgress(userId, cardId)

      const { data, error } = await supabase
        .from("card_progress")
        .upsert({
          user_id: userId,
          card_id: cardId,
          level,
          category,
          difficulty,
          times_studied: (existing?.times_studied || 0) + 1,
          last_studied: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.warn("Error updating card progress:", error)
      return null
    }
  }

  static async getAllCardProgress(userId: string): Promise<CardProgress[]> {
    if (!isSupabaseConfigured()) return []

    try {
      const { data, error } = await supabase.from("card_progress").select("*").eq("user_id", userId)
      if (error) throw error
      return data || []
    } catch (error) {
      console.warn("Error getting all card progress:", error)
      return []
    }
  }

  // Study Sessions
  static async createStudySession(userId: string, level: string, cardsStudied: number, sessionDuration: number) {
    if (!isSupabaseConfigured()) return null

    try {
      const { data, error } = await supabase
        .from("study_sessions")
        .insert({
          user_id: userId,
          level,
          cards_studied: cardsStudied,
          session_duration: sessionDuration,
          date: new Date().toISOString().split("T")[0],
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.warn("Error creating study session:", error)
      return null
    }
  }

  static async getStudySessions(userId: string, limit = 30): Promise<StudySession[]> {
    if (!isSupabaseConfigured()) return []

    try {
      const { data, error } = await supabase
        .from("study_sessions")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(limit)

      if (error) throw error
      return data || []
    } catch (error) {
      console.warn("Error getting study sessions:", error)
      return []
    }
  }

  // Analytics
  static async getWeeklyProgress(userId: string) {
    if (!isSupabaseConfigured()) return []

    try {
      const oneWeekAgo = new Date()
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

      const { data, error } = await supabase
        .from("study_sessions")
        .select("date, cards_studied, session_duration")
        .eq("user_id", userId)
        .gte("date", oneWeekAgo.toISOString().split("T")[0])
        .order("date", { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.warn("Error getting weekly progress:", error)
      return []
    }
  }

  static async getLevelProgress(userId: string) {
    if (!isSupabaseConfigured()) return []

    try {
      const { data, error } = await supabase
        .from("card_progress")
        .select("level, difficulty, COUNT(*)")
        .eq("user_id", userId)
        .group("level, difficulty")

      if (error) throw error
      return data || []
    } catch (error) {
      console.warn("Error getting level progress:", error)
      return []
    }
  }
}

// Authentication helpers
export class AuthService {
  static async signInWithGoogle() {
    if (!isSupabaseConfigured()) {
      throw new Error("Supabase not configured. Please set up environment variables.")
    }

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) throw error
    return data
  }

  static async signInWithGitHub() {
    if (!isSupabaseConfigured()) {
      throw new Error("Supabase not configured. Please set up environment variables.")
    }

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) throw error
    return data
  }

  static async signInWithEmail(email: string, password: string) {
    if (!isSupabaseConfigured()) {
      throw new Error("Supabase not configured. Please set up environment variables first.")
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) {
      // Provide more user-friendly error messages
      if (error.message.includes("Invalid login credentials")) {
        throw new Error("Invalid email or password")
      }
      if (error.message.includes("Email not confirmed")) {
        throw new Error("Please check your email and confirm your account")
      }
      throw error
    }
    return data
  }

  static async signUpWithEmail(email: string, password: string, fullName?: string) {
    if (!isSupabaseConfigured()) {
      throw new Error("Supabase not configured. Please set up environment variables first.")
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })

    if (error) {
      // Provide more user-friendly error messages
      if (error.message.includes("Password")) {
        throw new Error("Password must be at least 6 characters long")
      }
      if (error.message.includes("Email")) {
        throw new Error("Please enter a valid email address")
      }
      if (error.message.includes("already registered")) {
        throw new Error("An account with this email already exists")
      }
      throw error
    }

    return data
  }

  static async signOut() {
    if (!isSupabaseConfigured()) return

    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  static async getCurrentSession() {
    if (!isSupabaseConfigured()) return null

    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession()
      if (error) throw error
      return session
    } catch (error) {
      console.warn("Error getting current session:", error)
      return null
    }
  }

  static onAuthStateChange(callback: (event: string, session: any) => void) {
    if (!isSupabaseConfigured()) {
      // Return a dummy subscription for demo mode
      return {
        data: { subscription: { unsubscribe: () => {} } },
      }
    }

    return supabase.auth.onAuthStateChange(callback)
  }
}
