"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface LoginTransitionProps {
  children: ReactNode
  isVisible: boolean
}

export function LoginTransition({ children, isVisible }: LoginTransitionProps) {
  return (
    <motion.div
      className="min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Japanese Characters */}
        {["あ", "か", "さ", "た", "な", "は", "ま", "や", "ら", "わ"].map((char, i) => (
          <motion.div
            key={i}
            className="absolute text-6xl text-blue-100/20 font-bold pointer-events-none"
            initial={{
              x: Math.random() * window.innerWidth,
              y: window.innerHeight + 100,
              rotate: 0,
            }}
            animate={{
              y: -100,
              rotate: 360,
              x: Math.random() * window.innerWidth,
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
              delay: Math.random() * 5,
            }}
          >
            {char}
          </motion.div>
        ))}
      </div>

      {/* Main Content with Slide Animation */}
      <motion.div
        initial={{ x: "100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: "-100%", opacity: 0 }}
        transition={{
          duration: 0.8,
          ease: [0.22, 1, 0.36, 1],
          staggerChildren: 0.1,
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}
