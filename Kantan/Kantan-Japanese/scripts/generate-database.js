// Script to generate CSV database for Google Sheets/Excel
const fs = require("fs")

const japaneseDatabase = {
  n5: {
    words: [
      { japanese: "こんにちは", hiragana: "こんにちは", english: "Hello", type: "greeting" },
      { japanese: "ありがとう", hiragana: "ありがとう", english: "Thank you", type: "expression" },
      { japanese: "水", hiragana: "みず", english: "Water", type: "noun" },
      { japanese: "食べる", hiragana: "たべる", english: "To eat", type: "verb" },
      { japanese: "学校", hiragana: "がっこう", english: "School", type: "noun" },
      { japanese: "家", hiragana: "いえ", english: "House", type: "noun" },
      { japanese: "車", hiragana: "くるま", english: "Car", type: "noun" },
      { japanese: "本", hiragana: "ほん", english: "Book", type: "noun" },
      { japanese: "友達", hiragana: "ともだち", english: "Friend", type: "noun" },
      { japanese: "時間", hiragana: "じかん", english: "Time", type: "noun" },
    ],
    kanji: [
      { kanji: "人", reading: "ひと/じん", meaning: "Person", strokes: 2 },
      { kanji: "日", reading: "ひ/にち", meaning: "Day/Sun", strokes: 4 },
      { kanji: "本", reading: "ほん", meaning: "Book", strokes: 5 },
      { kanji: "水", reading: "みず", meaning: "Water", strokes: 4 },
      { kanji: "火", reading: "ひ", meaning: "Fire", strokes: 4 },
    ],
    phrases: [
      { japanese: "はじめまして", hiragana: "はじめまして", english: "Nice to meet you" },
      { japanese: "お元気ですか", hiragana: "おげんきですか", english: "How are you?" },
      { japanese: "すみません", hiragana: "すみません", english: "Excuse me/Sorry" },
    ],
  },
  // Add more levels...
  slang: [
    { japanese: "めっちゃ", hiragana: "めっちゃ", english: "Very/Really", dialect: "Kansai" },
    { japanese: "あかん", hiragana: "あかん", english: "No good/Bad", dialect: "Kansai" },
    { japanese: "なんでやねん", hiragana: "なんでやねん", english: "Why?/What the heck?", dialect: "Kansai" },
    { japanese: "ほんま", hiragana: "ほんま", english: "Really/Truly", dialect: "Kansai" },
    { japanese: "おおきに", hiragana: "おおきに", english: "Thank you", dialect: "Kansai" },
    // ... 95 more slang words
  ],
}

// Convert to CSV format for Google Sheets
function generateCSV() {
  let csvContent = "Level,Category,Japanese,Hiragana,Reading,English,Type,Strokes,Dialect\n"

  Object.keys(japaneseDatabase).forEach((level) => {
    if (level === "slang") {
      japaneseDatabase[level].forEach((item) => {
        csvContent += `${level},slang,"${item.japanese}","${item.hiragana}",,"${item.english}",,,"${item.dialect}"\n`
      })
    } else {
      const data = japaneseDatabase[level]

      data.words.forEach((item) => {
        csvContent += `${level},word,"${item.japanese}","${item.hiragana}",,"${item.english}","${item.type}",,\n`
      })

      data.kanji.forEach((item) => {
        csvContent += `${level},kanji,"${item.kanji}",,"${item.reading}","${item.meaning}",,${item.strokes},\n`
      })

      data.phrases.forEach((item) => {
        csvContent += `${level},phrase,"${item.japanese}","${item.hiragana}",,"${item.english}",,,,\n`
      })
    }
  })

  return csvContent
}

// Generate and save CSV
const csvData = generateCSV()
console.log("CSV Database Generated:")
console.log("=".repeat(50))
console.log(csvData)
console.log("=".repeat(50))
console.log("Copy the above content to a .csv file or Google Sheets!")

// Also create a JSON version for easy import
const jsonData = JSON.stringify(japaneseDatabase, null, 2)
console.log("\nJSON Database (for developers):")
console.log(jsonData)
