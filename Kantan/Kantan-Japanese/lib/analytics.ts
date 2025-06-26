// Simple analytics for tracking usage
export class Analytics {
  static track(event: string, properties?: Record<string, any>) {
    if (typeof window === "undefined") return

    // You can integrate with Google Analytics, Mixpanel, etc.
    console.log("📊 Analytics:", event, properties)

    // Example: Send to your analytics service
    // gtag('event', event, properties)
  }

  static trackStudySession(level: string, cardsStudied: number, duration: number) {
    this.track("study_session_completed", {
      level,
      cards_studied: cardsStudied,
      duration_seconds: duration,
    })
  }

  static trackCardDifficulty(cardId: string, difficulty: "easy" | "medium" | "hard") {
    this.track("card_difficulty_rated", {
      card_id: cardId,
      difficulty,
    })
  }
}
