"use client"

import { motion, useAnimation } from "framer-motion"
import { type ReactNode, useEffect } from "react"

interface StudyTransitionProps {
  children: ReactNode
  isVisible: boolean
  level: string
}

export function StudyTransition({ children, isVisible, level }: StudyTransitionProps) {
  const controls = useAnimation()

  useEffect(() => {
    if (isVisible) {
      controls.start("visible")
    }
  }, [isVisible, controls])

  const levelColors = {
    n5: "from-emerald-400 to-green-500",
    n4: "from-sky-400 to-blue-500",
    n3: "from-amber-400 to-yellow-500",
    n2: "from-orange-400 to-red-500",
    n1: "from-rose-400 to-pink-500",
  }

  return (
    <motion.div
      className="min-h-screen relative overflow-hidden"
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            duration: 1,
            staggerChildren: 0.2,
          },
        },
      }}
    >
      {/* Epic Background Animation */}
      <motion.div
        className="absolute inset-0"
        variants={{
          hidden: { scale: 0, rotate: -180 },
          visible: {
            scale: 1,
            rotate: 0,
            transition: { duration: 1.5, ease: "backOut" },
          },
        }}
      >
        <div
          className={`absolute inset-0 bg-gradient-to-br ${levelColors[level as keyof typeof levelColors]} opacity-10`}
        />

        {/* Animated Circles */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full bg-gradient-to-r ${levelColors[level as keyof typeof levelColors]} opacity-20`}
            style={{
              width: 100 + i * 50,
              height: 100 + i * 50,
              left: `${20 + i * 15}%`,
              top: `${10 + i * 20}%`,
            }}
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          />
        ))}
      </motion.div>

      {/* Content with Staggered Animation */}
      <motion.div
        variants={{
          hidden: { y: 100, opacity: 0 },
          visible: {
            y: 0,
            opacity: 1,
            transition: {
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
            },
          },
        }}
      >
        {children}
      </motion.div>

      {/* Level Indicator Animation */}
      <motion.div
        className="absolute top-4 right-4"
        variants={{
          hidden: { scale: 0, rotate: -90 },
          visible: {
            scale: 1,
            rotate: 0,
            transition: { duration: 0.8, delay: 0.5, ease: "backOut" },
          },
        }}
      >
        <div
          className={`w-16 h-16 rounded-full bg-gradient-to-r ${levelColors[level as keyof typeof levelColors]} flex items-center justify-center shadow-lg`}
        >
          <span className="text-white font-bold text-lg">{level.toUpperCase()}</span>
        </div>
      </motion.div>
    </motion.div>
  )
}
