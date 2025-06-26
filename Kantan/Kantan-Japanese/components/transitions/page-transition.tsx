"use client"

import { motion, AnimatePresence } from "framer-motion"
import type { ReactNode } from "react"

interface PageTransitionProps {
  children: ReactNode
  transitionKey: string
  type?: "curtain" | "fade" | "slide" | "zoom" | "flip" | "japanese"
}

export function PageTransition({ children, transitionKey, type = "curtain" }: PageTransitionProps) {
  const transitions = {
    curtain: {
      initial: { scaleY: 0, transformOrigin: "top" },
      animate: { scaleY: 1, transformOrigin: "top" },
      exit: { scaleY: 0, transformOrigin: "bottom" },
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
    },
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.6, ease: "easeInOut" },
    },
    slide: {
      initial: { x: "100%", opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: "-100%", opacity: 0 },
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    },
    zoom: {
      initial: { scale: 0.8, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      exit: { scale: 1.2, opacity: 0 },
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
    flip: {
      initial: { rotateY: -90, opacity: 0 },
      animate: { rotateY: 0, opacity: 1 },
      exit: { rotateY: 90, opacity: 0 },
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
    },
    japanese: {
      initial: {
        y: 50,
        opacity: 0,
        filter: "blur(10px)",
        scale: 0.9,
      },
      animate: {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        scale: 1,
      },
      exit: {
        y: -50,
        opacity: 0,
        filter: "blur(10px)",
        scale: 1.1,
      },
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.1,
      },
    },
  }

  const currentTransition = transitions[type]

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={transitionKey}
        initial={currentTransition.initial}
        animate={currentTransition.animate}
        exit={currentTransition.exit}
        transition={currentTransition.transition}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
