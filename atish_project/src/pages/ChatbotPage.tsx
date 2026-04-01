"use client"

import { CareerAI } from "@/components/chatbot/career-ai"
import { motion } from "framer-motion"

export default function ChatbotPage() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-muted/5 py-12 px-4"
    >
      <div className="container mx-auto">
        <CareerAI />
      </div>
    </motion.div>
  )
}
