"use client"

import { ResumeBuilder } from "@/components/resume/resume-builder"
import { motion } from "framer-motion"

export default function ResumeBuilderPage() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-muted/10 min-h-screen pb-20"
    >
      <div className="container mx-auto py-12">
        <ResumeBuilder />
      </div>
    </motion.div>
  )
}
