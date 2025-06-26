"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"

interface LoadingCurtainProps {
  isLoading: boolean
  onComplete: () => void
}

export function LoadingCurtain({ isLoading, onComplete }: LoadingCurtainProps) {
  const [stage, setStage] = useState(0)

  useEffect(() => {
    if (!isLoading) return

    const timer1 = setTimeout(() => setStage(1), 1000)
    const timer2 = setTimeout(() => setStage(2), 2000)
    const timer3 = setTimeout(() => {
      setStage(3)
      onComplete()
    }, 3000)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [isLoading, onComplete])

  if (!isLoading && stage === 0) return null

  return (
    <motion.div
      className="fixed inset-0 z-50 overflow-hidden"
      initial={{ opacity: 1 }}
      animate={{ opacity: stage === 3 ? 0 : 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Curtain Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800">
        {/* Animated particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/30 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: 0,
            }}
            animate={{
              y: [null, -100],
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Left Curtain */}
      <motion.div
        className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-red-600 to-red-700 shadow-2xl"
        initial={{ x: 0 }}
        animate={{ x: stage >= 2 ? "-100%" : 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="absolute right-0 top-0 w-4 h-full bg-gradient-to-r from-transparent to-black/20" />
      </motion.div>

      {/* Right Curtain */}
      <motion.div
        className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-red-600 to-red-700 shadow-2xl"
        initial={{ x: 0 }}
        animate={{ x: stage >= 2 ? "100%" : 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="absolute left-0 top-0 w-4 h-full bg-gradient-to-l from-transparent to-black/20" />
      </motion.div>

      {/* Center Content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: stage >= 1 ? 1 : 0,
            opacity: stage >= 1 ? 1 : 0,
          }}
          transition={{ duration: 0.8, ease: "backOut" }}
        >
          {/* Japanese Characters Animation */}
          <motion.div
            className="text-8xl font-bold text-white mb-4"
            initial={{ rotateY: -180 }}
            animate={{ rotateY: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            かんたん
          </motion.div>

          <motion.h1
            className="text-4xl font-bold text-white mb-2"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            Kantan Japanese
          </motion.h1>

          <motion.p
            className="text-xl text-white/80"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            Learning Journey Begins...
          </motion.p>

          {/* Loading Animation */}
          <motion.div
            className="mt-8 flex justify-center space-x-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-3 h-3 bg-white rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: i * 0.2,
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  )
}
