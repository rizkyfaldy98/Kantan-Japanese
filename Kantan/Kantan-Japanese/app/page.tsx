"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Shuffle, Eye, EyeOff, Rocket, Database, BarChart3, User, LogOut, Sparkles } from "lucide-react"
import { AuthModal } from "@/components/auth-modal"
import { LoginScreen } from "@/components/login-screen"
import { DatabaseService, AuthService } from "@/lib/database"
import type { StudyProgress, CardProgress } from "@/lib/supabase"
import { SetupNotice } from "@/components/setup-notice"

// Enhanced database structure with romanji for beginners
const japaneseDatabase = {
  n5: {
    words: [
      {
        id: "n5_word_1",
        japanese: "こんにちは",
        hiragana: "こんにちは",
        romanji: "konnichiwa",
        english: "Hello",
        type: "greeting",
        difficulty: 0,
      },
      {
        id: "n5_word_2",
        japanese: "ありがとう",
        hiragana: "ありがとう",
        romanji: "arigatou",
        english: "Thank you",
        type: "expression",
        difficulty: 0,
      },
      {
        id: "n5_word_3",
        japanese: "水",
        hiragana: "みず",
        romanji: "mizu",
        english: "Water",
        type: "noun",
        difficulty: 0,
      },
      {
        id: "n5_word_4",
        japanese: "食べる",
        hiragana: "たべる",
        romanji: "taberu",
        english: "To eat",
        type: "verb",
        difficulty: 0,
      },
      {
        id: "n5_word_5",
        japanese: "学校",
        hiragana: "がっこう",
        romanji: "gakkou",
        english: "School",
        type: "noun",
        difficulty: 0,
      },
      {
        id: "n5_word_6",
        japanese: "家",
        hiragana: "いえ",
        romanji: "ie",
        english: "House",
        type: "noun",
        difficulty: 0,
      },
      {
        id: "n5_word_7",
        japanese: "車",
        hiragana: "くるま",
        romanji: "kuruma",
        english: "Car",
        type: "noun",
        difficulty: 0,
      },
      {
        id: "n5_word_8",
        japanese: "本",
        hiragana: "ほん",
        romanji: "hon",
        english: "Book",
        type: "noun",
        difficulty: 0,
      },
      {
        id: "n5_word_9",
        japanese: "友達",
        hiragana: "ともだち",
        romanji: "tomodachi",
        english: "Friend",
        type: "noun",
        difficulty: 0,
      },
      {
        id: "n5_word_10",
        japanese: "時間",
        hiragana: "じかん",
        romanji: "jikan",
        english: "Time",
        type: "noun",
        difficulty: 0,
      },
    ],
    kanji: [
      {
        id: "n5_kanji_1",
        kanji: "人",
        reading: "ひと/じん",
        romanji: "hito/jin",
        meaning: "Person",
        strokes: 2,
        difficulty: 0,
      },
      {
        id: "n5_kanji_2",
        kanji: "日",
        reading: "ひ/にち",
        romanji: "hi/nichi",
        meaning: "Day/Sun",
        strokes: 4,
        difficulty: 0,
      },
      {
        id: "n5_kanji_3",
        kanji: "本",
        reading: "ほん",
        romanji: "hon",
        meaning: "Book",
        strokes: 5,
        difficulty: 0,
      },
      {
        id: "n5_kanji_4",
        kanji: "水",
        reading: "みず",
        romanji: "mizu",
        meaning: "Water",
        strokes: 4,
        difficulty: 0,
      },
      {
        id: "n5_kanji_5",
        kanji: "火",
        reading: "ひ",
        romanji: "hi",
        meaning: "Fire",
        strokes: 4,
        difficulty: 0,
      },
    ],
    phrases: [
      {
        id: "n5_phrase_1",
        japanese: "はじめまして",
        hiragana: "はじめまして",
        romanji: "hajimemashite",
        english: "Nice to meet you",
        difficulty: 0,
      },
      {
        id: "n5_phrase_2",
        japanese: "お元気ですか",
        hiragana: "おげんきですか",
        romanji: "ogenki desu ka",
        english: "How are you?",
        difficulty: 0,
      },
      {
        id: "n5_phrase_3",
        japanese: "すみません",
        hiragana: "すみません",
        romanji: "sumimasen",
        english: "Excuse me/Sorry",
        difficulty: 0,
      },
    ],
  },
  n4: {
    words: [
      {
        id: "n4_word_1",
        japanese: "経験",
        hiragana: "けいけん",
        romanji: "keiken",
        english: "Experience",
        type: "noun",
        difficulty: 0,
      },
      {
        id: "n4_word_2",
        japanese: "説明",
        hiragana: "せつめい",
        romanji: "setsumei",
        english: "Explanation",
        type: "noun",
        difficulty: 0,
      },
      {
        id: "n4_word_3",
        japanese: "準備",
        hiragana: "じゅんび",
        romanji: "junbi",
        english: "Preparation",
        type: "noun",
        difficulty: 0,
      },
      {
        id: "n4_word_4",
        japanese: "会議",
        hiragana: "かいぎ",
        romanji: "kaigi",
        english: "Meeting",
        type: "noun",
        difficulty: 0,
      },
      {
        id: "n4_word_5",
        japanese: "計画",
        hiragana: "けいかく",
        romanji: "keikaku",
        english: "Plan",
        type: "noun",
        difficulty: 0,
      },
    ],
    kanji: [
      {
        id: "n4_kanji_1",
        kanji: "時",
        reading: "とき/じ",
        romanji: "toki/ji",
        meaning: "Time",
        strokes: 10,
        difficulty: 0,
      },
      {
        id: "n4_kanji_2",
        kanji: "間",
        reading: "あいだ/かん",
        romanji: "aida/kan",
        meaning: "Between/Interval",
        strokes: 12,
        difficulty: 0,
      },
      {
        id: "n4_kanji_3",
        kanji: "会",
        reading: "かい",
        romanji: "kai",
        meaning: "Meeting",
        strokes: 6,
        difficulty: 0,
      },
    ],
    phrases: [
      {
        id: "n4_phrase_1",
        japanese: "どういたしまして",
        hiragana: "どういたしまして",
        romanji: "dou itashimashite",
        english: "You're welcome",
        difficulty: 0,
      },
      {
        id: "n4_phrase_2",
        japanese: "お疲れ様",
        hiragana: "おつかれさま",
        romanji: "otsukaresama",
        english: "Good work",
        difficulty: 0,
      },
    ],
  },
  n3: {
    words: [
      {
        id: "n3_word_1",
        japanese: "環境",
        hiragana: "かんきょう",
        romanji: "kankyou",
        english: "Environment",
        type: "noun",
        difficulty: 0,
      },
      {
        id: "n3_word_2",
        japanese: "技術",
        hiragana: "ぎじゅつ",
        romanji: "gijutsu",
        english: "Technology",
        type: "noun",
        difficulty: 0,
      },
      {
        id: "n3_word_3",
        japanese: "文化",
        hiragana: "ぶんか",
        romanji: "bunka",
        english: "Culture",
        type: "noun",
        difficulty: 0,
      },
    ],
    kanji: [
      {
        id: "n3_kanji_1",
        kanji: "環",
        reading: "かん",
        romanji: "kan",
        meaning: "Ring/Circle",
        strokes: 17,
        difficulty: 0,
      },
      {
        id: "n3_kanji_2",
        kanji: "境",
        reading: "きょう",
        romanji: "kyou",
        meaning: "Boundary",
        strokes: 14,
        difficulty: 0,
      },
      {
        id: "n3_kanji_3",
        kanji: "技",
        reading: "ぎ",
        romanji: "gi",
        meaning: "Skill",
        strokes: 7,
        difficulty: 0,
      },
    ],
    phrases: [
      {
        id: "n3_phrase_1",
        japanese: "お疲れ様でした",
        hiragana: "おつかれさまでした",
        romanji: "otsukaresama deshita",
        english: "Good work/Thank you for your hard work",
        difficulty: 0,
      },
    ],
  },
  n2: {
    words: [
      {
        id: "n2_word_1",
        japanese: "議論",
        hiragana: "ぎろん",
        romanji: "giron",
        english: "Discussion/Debate",
        type: "noun",
        difficulty: 0,
      },
      {
        id: "n2_word_2",
        japanese: "効率",
        hiragana: "こうりつ",
        romanji: "kouritsu",
        english: "Efficiency",
        type: "noun",
        difficulty: 0,
      },
      {
        id: "n2_word_3",
        japanese: "影響",
        hiragana: "えいきょう",
        romanji: "eikyou",
        english: "Influence",
        type: "noun",
        difficulty: 0,
      },
    ],
    kanji: [
      {
        id: "n2_kanji_1",
        kanji: "議",
        reading: "ぎ",
        romanji: "gi",
        meaning: "Deliberation",
        strokes: 20,
        difficulty: 0,
      },
      {
        id: "n2_kanji_2",
        kanji: "論",
        reading: "ろん",
        romanji: "ron",
        meaning: "Theory/Discussion",
        strokes: 15,
        difficulty: 0,
      },
      {
        id: "n2_kanji_3",
        kanji: "効",
        reading: "こう",
        romanji: "kou",
        meaning: "Effect",
        strokes: 8,
        difficulty: 0,
      },
    ],
    phrases: [
      {
        id: "n2_phrase_1",
        japanese: "恐れ入ります",
        hiragana: "おそれいります",
        romanji: "osore irimasu",
        english: "I'm terribly sorry/Excuse me",
        difficulty: 0,
      },
    ],
  },
  n1: {
    words: [
      {
        id: "n1_word_1",
        japanese: "洞察",
        hiragana: "どうさつ",
        romanji: "dousatsu",
        english: "Insight",
        type: "noun",
        difficulty: 0,
      },
      {
        id: "n1_word_2",
        japanese: "概念",
        hiragana: "がいねん",
        romanji: "gainen",
        english: "Concept",
        type: "noun",
        difficulty: 0,
      },
      {
        id: "n1_word_3",
        japanese: "抽象",
        hiragana: "ちゅうしょう",
        romanji: "chuushou",
        english: "Abstract",
        type: "noun",
        difficulty: 0,
      },
    ],
    kanji: [
      {
        id: "n1_kanji_1",
        kanji: "洞",
        reading: "どう",
        romanji: "dou",
        meaning: "Cave/Insight",
        strokes: 9,
        difficulty: 0,
      },
      {
        id: "n1_kanji_2",
        kanji: "察",
        reading: "さつ",
        romanji: "satsu",
        meaning: "Guess/Judge",
        strokes: 14,
        difficulty: 0,
      },
      {
        id: "n1_kanji_3",
        kanji: "概",
        reading: "がい",
        romanji: "gai",
        meaning: "Outline/General",
        strokes: 13,
        difficulty: 0,
      },
    ],
    phrases: [
      {
        id: "n1_phrase_1",
        japanese: "恐縮ですが",
        hiragana: "きょうしゅくですが",
        romanji: "kyoushuku desu ga",
        english: "I'm sorry to trouble you, but...",
        difficulty: 0,
      },
    ],
  },
}

const levelInfo = {
  n5: {
    name: "N5",
    color: "from-emerald-400 to-green-500",
    bgColor: "bg-emerald-50",
    textColor: "text-emerald-700",
    description: "Beginner",
  },
  n4: {
    name: "N4",
    color: "from-sky-400 to-blue-500",
    bgColor: "bg-sky-50",
    textColor: "text-sky-700",
    description: "Elementary",
  },
  n3: {
    name: "N3",
    color: "from-amber-400 to-yellow-500",
    bgColor: "bg-amber-50",
    textColor: "text-amber-700",
    description: "Intermediate",
  },
  n2: {
    name: "N2",
    color: "from-orange-400 to-red-500",
    bgColor: "bg-orange-50",
    textColor: "text-orange-700",
    description: "Upper Intermediate",
  },
  n1: {
    name: "N1",
    color: "from-rose-400 to-pink-500",
    bgColor: "bg-rose-50",
    textColor: "text-rose-700",
    description: "Advanced",
  },
}

// 🛡️ BULLETPROOF STATE INITIALIZATION - No self-references ever!
const INITIAL_PROGRESS: StudyProgress = {
  id: "",
  user_id: "",
  total_studied: 0,
  easy_cards: 0,
  medium_cards: 0,
  hard_cards: 0,
  current_streak: 0,
  study_time: 0,
  last_study_date: new Date().toISOString().split("T")[0],
  created_at: "",
  updated_at: "",
}

export default function KantanJapanese() {
  const [currentLevel, setCurrentLevel] = useState<string>("n5")
  const [currentCard, setCurrentCard] = useState<any>(null)
  const [showAnswer, setShowAnswer] = useState<boolean>(false)
  const [showFeedback, setShowFeedback] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [showWelcome, setShowWelcome] = useState<boolean>(true)
  const [isShuffling, setIsShuffling] = useState<boolean>(false)
  const [showProgress, setShowProgress] = useState<boolean>(false)
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false)
  const [user, setUser] = useState<any>(null)
  const [progress, setProgress] = useState<StudyProgress>(INITIAL_PROGRESS)
  const [cardProgressMap, setCardProgressMap] = useState<Map<string, CardProgress>>(new Map())
  const [sessionStartTime, setSessionStartTime] = useState<number>(() => Date.now())
  const [sessionCardsStudied, setSessionCardsStudied] = useState<number>(0)
  const [showLoginScreen, setShowLoginScreen] = useState<boolean>(false)

  // Transition states
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false)
  const [transitionStage, setTransitionStage] = useState<"splash" | "login" | "study">("splash")

  // Sound effects
  const playFlipSound = () => {
    const audio = new Audio(
      "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT",
    )
    audio.volume = 0.3
    audio.play().catch(() => {}) // Ignore errors if audio can't play
  }

  // Load user data and progress
  const loadUserData = async (userId: string) => {
    try {
      const [userProgress, allCardProgress] = await Promise.all([
        DatabaseService.getStudyProgress(userId),
        DatabaseService.getAllCardProgress(userId),
      ])

      if (userProgress) {
        setProgress(userProgress)
      }

      const cardMap = new Map()
      allCardProgress.forEach((card) => {
        cardMap.set(card.card_id, card)
      })
      setCardProgressMap(cardMap)
    } catch (error) {
      console.error("Error loading user data:", error)
    }
  }

  // Get card with user's difficulty preference
  const getRandomCard = (level: string) => {
    const data = japaneseDatabase[level as keyof typeof japaneseDatabase]
    if (!data) return null

    const allItems = [
      ...data.words.map((item) => ({ ...item, category: "word" })),
      ...data.kanji.map((item) => ({ ...item, category: "kanji" })),
      ...data.phrases.map((item) => ({ ...item, category: "phrase" })),
    ]

    // Apply user's card progress if available
    const itemsWithProgress = allItems.map((item) => {
      const userProgress = cardProgressMap.get(item.id)
      return {
        ...item,
        difficulty: userProgress?.difficulty ?? item.difficulty,
        timesStudied: userProgress?.times_studied ?? 0,
      }
    })

    // Weight cards based on difficulty (harder cards appear more often)
    const weightedItems: any[] = []
    itemsWithProgress.forEach((item) => {
      const weight = item.difficulty === 2 ? 4 : item.difficulty === 1 ? 2 : 1
      for (let i = 0; i < weight; i++) {
        weightedItems.push(item)
      }
    })

    return weightedItems[Math.floor(Math.random() * weightedItems.length)]
  }

  const handleLevelChange = (level: string) => {
    setCurrentLevel(level)
    setShowAnswer(false)
    setShowFeedback(false)
    setShowWelcome(true)
    const newCard = getRandomCard(level)
    setCurrentCard(newCard)
  }

  const handleShuffle = () => {
    setIsShuffling(true)
    setShowAnswer(false)
    setShowFeedback(false)

    setTimeout(() => {
      const newCard = getRandomCard(currentLevel)
      setCurrentCard(newCard)
      setIsShuffling(false)
    }, 300)
  }

  const handleStartPractice = () => {
    setShowWelcome(false)
    setSessionStartTime(Date.now())
    setSessionCardsStudied(0)
    const newCard = getRandomCard(currentLevel)
    setCurrentCard(newCard)
  }

  const toggleAnswer = () => {
    playFlipSound()
    if (!showAnswer) {
      setShowAnswer(true)
      setShowFeedback(true)
    } else {
      setShowAnswer(false)
      setShowFeedback(false)
    }
  }

  const handleDifficultyFeedback = async (difficulty: number) => {
    if (!currentCard) return

    setSessionCardsStudied((prev) => prev + 1)

    // Update local progress
    const newProgress = {
      ...progress,
      total_studied: progress.total_studied + 1,
      easy_cards: progress.easy_cards + (difficulty === 0 ? 1 : 0),
      medium_cards: progress.medium_cards + (difficulty === 1 ? 1 : 0),
      hard_cards: progress.hard_cards + (difficulty === 2 ? 1 : 0),
      current_streak: progress.current_streak + 1,
      last_study_date: new Date().toISOString().split("T")[0],
    }
    setProgress(newProgress)

    // Save to database if user is logged in
    if (user) {
      try {
        await Promise.all([
          DatabaseService.updateStudyProgress(user.id, newProgress),
          DatabaseService.updateCardProgress(user.id, currentCard.id, currentLevel, currentCard.category, difficulty),
        ])

        // Update local card progress map
        const updatedCardProgress = await DatabaseService.getCardProgress(user.id, currentCard.id)
        if (updatedCardProgress) {
          setCardProgressMap((prev) => new Map(prev.set(currentCard.id, updatedCardProgress)))
        }
      } catch (error) {
        console.error("Error saving progress:", error)
      }
    }

    // Move to next card
    handleShuffle()
  }

  const handleSignOut = async () => {
    try {
      // Save final session before signing out
      if (user && sessionCardsStudied > 0) {
        const sessionDuration = Math.floor((Date.now() - sessionStartTime) / 1000)
        await DatabaseService.createStudySession(user.id, currentLevel, sessionCardsStudied, sessionDuration)
      }

      await AuthService.signOut()
      setUser(null)
      setProgress({
        id: "",
        user_id: "",
        total_studied: 0,
        easy_cards: 0,
        medium_cards: 0,
        hard_cards: 0,
        easy_cards: 0,
        medium_cards: 0,
        hard_cards: 0,
        current_streak: 0,
        study_time: 0,
        last_study_date: new Date().toISOString().split("T")[0],
        created_at: "",
        updated_at: "",
      })
      setCardProgressMap(new Map())
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  // Auth state management
  useEffect(() => {
    const {
      data: { subscription },
    } = AuthService.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user)
        await loadUserData(session.user.id)
        setShowLoginScreen(false) // Hide login screen when user is authenticated
      } else {
        setUser(null)
      }
    })

    // Check initial session
    AuthService.getCurrentSession().then((session) => {
      if (session?.user) {
        setUser(session.user)
        loadUserData(session.user.id)
        setShowLoginScreen(false) // Hide login screen if already authenticated
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  // Study time tracker
  useEffect(() => {
    const timer = setInterval(() => {
      if (!showWelcome && !isLoading && user) {
        setProgress((prev) => ({ ...prev, study_time: prev.study_time + 1 }))
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [showWelcome, isLoading, user])

  // Save session on unmount
  useEffect(() => {
    return () => {
      if (user && sessionCardsStudied > 0) {
        const sessionDuration = Math.floor((Date.now() - sessionStartTime) / 1000)
        DatabaseService.createStudySession(user.id, currentLevel, sessionCardsStudied, sessionDuration).catch(
          console.error,
        )
      }
    }
  }, [user, sessionCardsStudied, sessionStartTime, currentLevel])

  // Enhanced loading sequence with transitions
  useEffect(() => {
    const loadingSequence = async () => {
      // Stage 1: Show splash screen
      await new Promise((resolve) => setTimeout(resolve, 2500))

      // Stage 2: Transition to login
      setIsTransitioning(true)
      await new Promise((resolve) => setTimeout(resolve, 500)) // Transition duration

      const session = await AuthService.getCurrentSession()
      if (session?.user) {
        setUser(session.user)
        await loadUserData(session.user.id)
        setTransitionStage("study")
      } else {
        setTransitionStage("login")
      }

      setIsLoading(false)
      setIsTransitioning(false)
    }

    loadingSequence()
  }, [])

  // Handle login to study transition
  const handleLoginComplete = async () => {
    setIsTransitioning(true)
    await new Promise((resolve) => setTimeout(resolve, 300))
    setTransitionStage("study")
    setShowLoginScreen(false)
    setIsTransitioning(false)
  }

  if (transitionStage === "splash" || isLoading) {
    return (
      <div
        className={`min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600 relative overflow-hidden transition-all duration-500 ease-in-out ${
          isTransitioning ? "opacity-0 transform scale-95" : "opacity-100 transform scale-100"
        }`}
      >
        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full -translate-x-48 -translate-y-48 animate-pulse" />
        <div
          className="absolute bottom-0 right-0 w-80 h-80 bg-white/5 rounded-full translate-x-40 translate-y-40 animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/5 rounded-full -translate-x-32 -translate-y-32 animate-pulse"
          style={{ animationDelay: "2s" }}
        />

        <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center relative z-10">
          <div className="w-24 h-24 bg-white/95 backdrop-blur-sm rounded-3xl flex items-center justify-center mb-8 shadow-2xl animate-bounce">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              かんたん
            </span>
          </div>

          <div className="space-y-4 mb-12">
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-3 tracking-tight">Kantan Japanese</h1>
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 inline-block">
              <p className="text-xl text-white/90 font-medium">かんたん にほんご</p>
            </div>
            <h2 className="text-2xl md:text-3xl text-white/80 font-light">Learning Companion</h2>
          </div>

          <p className="text-xl text-white/80 mb-16 max-w-lg leading-relaxed font-light">
            Master Japanese vocabulary with JLPT levels N5 to N1
          </p>

          <div className="flex flex-col items-center space-y-6">
            <div className="flex space-x-3">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-4 h-4 bg-white/70 rounded-full animate-pulse"
                  style={{ animationDelay: `${i * 0.3}s` }}
                />
              ))}
            </div>
            <p className="text-white/70 text-lg font-medium">Loading your learning journey...</p>
          </div>
        </div>
      </div>
    )
  }

  if (transitionStage === "login" && !user) {
    return (
      <div
        className={`transition-all duration-500 ease-in-out ${
          isTransitioning ? "opacity-0 transform translate-y-4" : "opacity-100 transform translate-y-0"
        }`}
      >
        <LoginScreen onComplete={handleLoginComplete} />
      </div>
    )
  }

  const currentLevelInfo = levelInfo[currentLevel as keyof typeof levelInfo]

  return (
    <div
      className={`transition-all duration-500 ease-in-out ${
        isTransitioning ? "opacity-0 transform translate-x-4" : "opacity-100 transform translate-x-0"
      }`}
    >
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pb-32">
        {/* Setup Notice for missing Supabase config */}
        <SetupNotice />

        {/* Auth Modal */}
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => {
            setShowAuthModal(false)
          }}
        />

        {/* Header with gradient background */}
        <div className={`bg-gradient-to-r ${currentLevelInfo.color} px-4 py-8 shadow-lg`}>
          <div className="container mx-auto">
            <div className="flex justify-between items-center">
              <div className="text-center flex-1">
                <div className="inline-flex items-center space-x-3 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-4">
                  <Sparkles className="w-5 h-5 text-white" />
                  <h1 className="text-2xl font-bold text-white">Kantan Japanese</h1>
                </div>
                <p className="text-white/90 text-lg mb-2">かんたん にほんご</p>
                <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                  <span className="text-white/90 text-sm font-medium">
                    {currentLevelInfo.name} - {currentLevelInfo.description}
                  </span>
                </div>
              </div>

              {/* User & Integration Buttons */}
              <div className="flex flex-col space-y-2">
                {user ? (
                  <>
                    <div className="text-white text-xs text-center mb-2">{user.email?.split("@")[0]}</div>
                    <Button onClick={handleSignOut} variant="ghost" className="text-white hover:bg-white/20 p-2">
                      <LogOut className="w-4 h-4" />
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={() => setShowAuthModal(true)}
                    variant="ghost"
                    className="text-white hover:bg-white/20 p-2"
                  >
                    <User className="w-4 h-4" />
                  </Button>
                )}
                <Button
                  onClick={() => setShowProgress(!showProgress)}
                  variant="ghost"
                  className="text-white hover:bg-white/20 p-2"
                >
                  <BarChart3 className="w-5 h-5" />
                </Button>
                <Button
                  onClick={() => setShowAuthModal(true)}
                  variant="ghost"
                  className="text-white hover:bg-white/20 p-2"
                >
                  <Database className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Panel */}
        {showProgress && (
          <div className="bg-white border-b shadow-sm p-4">
            <div className="container mx-auto max-w-lg">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Study Progress {!user && <span className="text-sm text-gray-500">(Sign in to save)</span>}
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="text-blue-700 font-semibold">Total Studied</div>
                  <div className="text-2xl font-bold text-blue-800">{progress.total_studied}</div>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="text-green-700 font-semibold">Current Streak</div>
                  <div className="text-2xl font-bold text-green-800">{progress.current_streak}</div>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <div className="text-purple-700 font-semibold">Study Time</div>
                  <div className="text-2xl font-bold text-purple-800">{Math.floor(progress.study_time / 60)}m</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-gray-700 font-semibold">Difficulty</div>
                  <div className="flex space-x-1 mt-1">
                    <span className="bg-green-500 text-white px-2 py-1 rounded text-xs">{progress.easy_cards}</span>
                    <span className="bg-yellow-500 text-white px-2 py-1 rounded text-xs">{progress.medium_cards}</span>
                    <span className="bg-red-500 text-white px-2 py-1 rounded text-xs">{progress.hard_cards}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="container mx-auto px-4 py-8">
          {/* Main Card */}
          <div className="max-w-lg mx-auto mb-8">
            <Card
              className={`shadow-2xl border-0 overflow-hidden transition-all duration-300 hover:shadow-3xl ${
                isShuffling ? "opacity-0" : "opacity-100"
              }`}
              style={{
                minHeight: "500px", // Fixed height to prevent size changes
              }}
            >
              <div className={`h-2 bg-gradient-to-r ${currentLevelInfo.color}`} />

              <CardContent className="p-8 bg-white">
                {showWelcome ? (
                  <div className="text-center space-y-6 min-h-[450px] flex flex-col justify-center">
                    <div className="text-6xl mb-4">🚀</div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Ready to practice?</h2>
                    <p className="text-lg text-gray-600 mb-8">
                      Let's boost your Japanese skills with {currentLevelInfo.name} level content!
                    </p>
                    {!user && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                        <p className="text-blue-700 text-sm">
                          💡 <strong>Sign in</strong> to save your progress and sync across devices!
                        </p>
                      </div>
                    )}
                    <Button
                      onClick={handleStartPractice}
                      size="lg"
                      className={`bg-gradient-to-r ${currentLevelInfo.color} hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-white px-8 py-4 text-xl font-bold rounded-full shadow-lg`}
                    >
                      <Rocket className="w-5 h-5 mr-2" />
                      Go! 行こう！
                    </Button>
                  </div>
                ) : currentCard ? (
                  <div className="text-center space-y-6 min-h-[450px] flex flex-col justify-center">
                    {/* Category Badge */}
                    <div className="flex justify-center">
                      <span
                        className={`${currentLevelInfo.bgColor} ${currentLevelInfo.textColor} px-4 py-2 rounded-full text-sm font-semibold capitalize`}
                      >
                        {currentCard.category}
                        {currentCard.timesStudied > 0 && (
                          <span className="ml-2 text-xs opacity-70">({currentCard.timesStudied}x)</span>
                        )}
                      </span>
                    </div>

                    {/* Main Content - Smart Transition */}
                    <div className="space-y-4">
                      <h2
                        className={`text-5xl font-bold leading-tight transition-all duration-500 ${
                          showAnswer ? "text-gray-600 text-3xl" : "text-gray-800"
                        }`}
                      >
                        {currentCard.japanese || currentCard.kanji}
                      </h2>
                      {currentCard.hiragana && (
                        <p
                          className={`text-2xl font-medium transition-all duration-500 ${
                            showAnswer ? "text-gray-500 text-lg" : "text-gray-600"
                          }`}
                        >
                          {currentCard.hiragana}
                        </p>
                      )}
                      {currentCard.reading && (
                        <p
                          className={`text-2xl font-medium transition-all duration-500 ${
                            showAnswer ? "text-gray-500 text-lg" : "text-gray-600"
                          }`}
                        >
                          {currentCard.reading}
                        </p>
                      )}

                      {/* Answer appears with smooth transition */}
                      <div
                        className={`transition-all duration-500 ${
                          showAnswer
                            ? "opacity-100 transform translate-y-0 max-h-96"
                            : "opacity-0 transform translate-y-4 max-h-0 overflow-hidden"
                        }`}
                      >
                        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-6 border-l-4 border-green-400 mt-4">
                          <h3 className="text-3xl font-bold text-gray-800 mb-3">
                            {currentCard.english || currentCard.meaning}
                          </h3>

                          {/* Enhanced romanji display for beginners */}
                          {(currentCard.romanji || currentCard.reading) && (
                            <div className="bg-white/70 rounded-lg p-3 mb-4">
                              <p className="text-sm text-gray-600 font-medium mb-1">Pronunciation:</p>
                              <p className="text-xl text-blue-700 font-bold">
                                {currentCard.romanji || currentCard.reading}
                              </p>
                            </div>
                          )}

                          {/* Details */}
                          <div className="flex justify-center space-x-4 text-sm flex-wrap gap-2 mt-4">
                            {currentCard.type && (
                              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                                {currentCard.type}
                              </span>
                            )}
                            {currentCard.strokes && (
                              <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium">
                                {currentCard.strokes} strokes
                              </span>
                            )}
                            <span
                              className={`${currentLevelInfo.bgColor} ${currentLevelInfo.textColor} px-3 py-1 rounded-full font-medium`}
                            >
                              {currentLevelInfo.name}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {!showAnswer && (
                      <div className="text-gray-400 text-sm">Click "Show Answer" to see the translation</div>
                    )}

                    {/* Difficulty Feedback */}
                    {showFeedback && showAnswer && (
                      <div
                        className={`space-y-4 transition-all duration-500 ${
                          showAnswer ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-4"
                        }`}
                      >
                        <p className="text-gray-600 font-medium">How difficult was this card?</p>
                        <div className="flex justify-center space-x-3">
                          <Button
                            onClick={() => handleDifficultyFeedback(0)}
                            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full font-semibold transform hover:scale-105 transition-all duration-200"
                          >
                            Easy
                          </Button>
                          <Button
                            onClick={() => handleDifficultyFeedback(1)}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-full font-semibold transform hover:scale-105 transition-all duration-200"
                          >
                            Medium
                          </Button>
                          <Button
                            onClick={() => handleDifficultyFeedback(2)}
                            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full font-semibold transform hover:scale-105 transition-all duration-200"
                          >
                            Hard
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col items-center space-y-3 pt-4">
                      <Button
                        onClick={toggleAnswer}
                        className={`bg-gradient-to-r ${currentLevelInfo.color} hover:shadow-lg transform hover:scale-105 transition-all duration-200 text-white px-8 py-3 rounded-full font-semibold`}
                      >
                        {showAnswer ? (
                          <>
                            <EyeOff className="w-4 h-4 mr-2" />
                            Hide Answer
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4 mr-2" />
                            Show Answer
                          </>
                        )}
                      </Button>
                      {!showAnswer && (
                        <Button
                          onClick={handleShuffle}
                          disabled={isShuffling}
                          variant="outline"
                          className={`border-2 hover:shadow-lg transform hover:scale-105 transition-all duration-200 px-8 py-3 rounded-full font-semibold ${
                            isShuffling ? "opacity-50" : ""
                          }`}
                        >
                          <Shuffle className="w-4 h-4 mr-2" />
                          Shuffle
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="animate-spin w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full mx-auto mb-4" />
                    <p className="text-gray-500">Loading card...</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-200 shadow-2xl">
          <div className="container mx-auto px-2 py-3">
            <div className="flex justify-center gap-1 w-full">
              {Object.entries(levelInfo).map(([level, info]) => (
                <Button
                  key={level}
                  onClick={() => handleLevelChange(level)}
                  className={`
            ${
              currentLevel === level
                ? `bg-gradient-to-r ${info.color} text-white shadow-lg scale-105`
                : `${info.bgColor} ${info.textColor} hover:shadow-md hover:scale-102`
            }
            flex-1 font-bold py-2 px-1 rounded-lg transition-all duration-300 transform min-w-0
          `}
                  variant="ghost"
                >
                  <div className="text-center w-full">
                    <div className="text-sm sm:text-lg font-bold">{info.name}</div>
                    <div className="text-xs opacity-80 hidden sm:block">{info.description}</div>
                    <div className="text-xs opacity-80 sm:hidden">
                      {info.description === "Beginner" && "Begin"}
                      {info.description === "Elementary" && "Elem"}
                      {info.description === "Intermediate" && "Inter"}
                      {info.description === "Upper Intermediate" && "Upper"}
                      {info.description === "Advanced" && "Adv"}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
