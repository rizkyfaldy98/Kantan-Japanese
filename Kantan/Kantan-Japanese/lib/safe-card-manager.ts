/**
 * 🛡️ BULLETPROOF CARD MANAGEMENT
 * Prevents initialization errors and null references
 */

export interface SafeCard {
  id: string
  japanese?: string
  kanji?: string
  hiragana?: string
  romanji?: string
  english?: string
  meaning?: string
  reading?: string
  category: string
  difficulty: number
  type?: string
  strokes?: number
}

export class SafeCardManager {
  private static validateCard(card: any): SafeCard | null {
    try {
      if (!card || typeof card !== "object") {
        console.warn("Invalid card object:", card)
        return null
      }

      // Ensure required fields exist
      const safeCard: SafeCard = {
        id: card.id || `card_${Date.now()}_${Math.random()}`,
        category: card.category || "unknown",
        difficulty: typeof card.difficulty === "number" ? card.difficulty : 0,
        japanese: card.japanese || "",
        kanji: card.kanji || "",
        hiragana: card.hiragana || "",
        romanji: card.romanji || "",
        english: card.english || "",
        meaning: card.meaning || "",
        reading: card.reading || "",
        type: card.type || "",
        strokes: card.strokes || 0,
      }

      return safeCard
    } catch (error) {
      console.error("Card validation error:", error)
      return null
    }
  }

  static getRandomCard(level: string, database: any, cardProgressMap?: Map<string, any>): SafeCard | null {
    try {
      const data = database?.[level]
      if (!data || typeof data !== "object") {
        console.warn(`No data found for level: ${level}`)
        return null
      }

      const allItems: any[] = [
        ...(Array.isArray(data.words) ? data.words.map((item) => ({ ...item, category: "word" })) : []),
        ...(Array.isArray(data.kanji) ? data.kanji.map((item) => ({ ...item, category: "kanji" })) : []),
        ...(Array.isArray(data.phrases) ? data.phrases.map((item) => ({ ...item, category: "phrase" })) : []),
      ]

      if (allItems.length === 0) {
        console.warn(`No items found for level: ${level}`)
        return null
      }

      // Apply user progress safely
      const itemsWithProgress = allItems.map((item) => {
        const userProgress = cardProgressMap?.get(item.id)
        return {
          ...item,
          difficulty: userProgress?.difficulty ?? item.difficulty ?? 0,
          timesStudied: userProgress?.times_studied ?? 0,
        }
      })

      // Weight cards based on difficulty
      const weightedItems: any[] = []
      itemsWithProgress.forEach((item) => {
        const weight = item.difficulty === 2 ? 4 : item.difficulty === 1 ? 2 : 1
        for (let i = 0; i < weight; i++) {
          weightedItems.push(item)
        }
      })

      const randomItem = weightedItems[Math.floor(Math.random() * weightedItems.length)]
      return this.validateCard(randomItem)
    } catch (error) {
      console.error("Error getting random card:", error)
      return null
    }
  }
}
