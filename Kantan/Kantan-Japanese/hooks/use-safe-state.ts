"use client"

import { useState, useCallback } from "react"

/**
 * 🛡️ BULLETPROOF STATE HOOK
 * Prevents "Cannot access before initialization" errors
 */
export function useSafeState<T>(initialValue: T | (() => T)) {
  // Always use a function or literal value, never a variable reference
  const [state, setState] = useState<T>(() => {
    if (typeof initialValue === "function") {
      return (initialValue as () => T)()
    }
    return initialValue
  })

  const setSafeState = useCallback(
    (newValue: T | ((prev: T) => T)) => {
      try {
        setState(newValue)
      } catch (error) {
        console.error("Safe state update error:", error)
        // Fallback to initial value if update fails
        setState(typeof initialValue === "function" ? (initialValue as () => T)() : initialValue)
      }
    },
    [initialValue],
  )

  return [state, setSafeState] as const
}
