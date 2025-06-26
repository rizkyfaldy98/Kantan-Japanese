// Database schema for easy understanding and expansion

export interface JapaneseWord {
  japanese: string
  hiragana: string
  english: string
  type: "noun" | "verb" | "adjective" | "expression" | "greeting"
}

export interface JapaneseKanji {
  kanji: string
  reading: string
  meaning: string
  strokes: number
}

export interface JapanesePhrase {
  japanese: string
  hiragana: string
  english: string
}

export interface JapaneseSlang {
  japanese: string
  hiragana: string
  english: string
  dialect: "Kansai" | "Tokyo" | "Osaka"
}

export interface JLPTLevel {
  words: JapaneseWord[]
  kanji: JapaneseKanji[]
  phrases: JapanesePhrase[]
}

export interface JapaneseDatabase {
  n5: JLPTLevel
  n4: JLPTLevel
  n3: JLPTLevel
  n2: JLPTLevel
  n1: JLPTLevel
  slang: JapaneseSlang[]
}
