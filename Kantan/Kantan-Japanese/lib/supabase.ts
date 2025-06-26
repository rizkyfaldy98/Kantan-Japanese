import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key"

// Add validation
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.warn("⚠️ Supabase environment variables not found. Running in demo mode.")
  console.log(`
🔧 TO FIX THIS ERROR:

1. Create a Supabase project at https://supabase.com
2. Get your project URL and anon key
3. Create a .env.local file in your project root:

NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

4. Restart your development server: npm run dev

The app will work in demo mode without authentication until you set this up.
  `)
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface UserProfile {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface StudyProgress {
  id: string
  user_id: string
  total_studied: number
  easy_cards: number
  medium_cards: number
  hard_cards: number
  current_streak: number
  study_time: number
  last_study_date: string
  created_at: string
  updated_at: string
}

export interface CardProgress {
  id: string
  user_id: string
  card_id: string
  level: string
  category: string
  difficulty: number
  times_studied: number
  last_studied: string
  created_at: string
  updated_at: string
}

export interface StudySession {
  id: string
  user_id: string
  level: string
  cards_studied: number
  session_duration: number
  date: string
  created_at: string
}
