"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ResumeForm } from "./resume-form"
import { ResumePreview } from "./resume-preview"
import type { ResumeData } from "../../types/resume"

const initialResumeData: ResumeData = {
  personalDetails: {
    fullName: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    linkedin: "",
  },
  summary: "",
  experience: [],
  education: [],
  skills: [],
}

export function ResumeBuilder() {
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData)

  const updateResumeData = (section: keyof ResumeData, data: any) => {
    setResumeData((prev) => ({
      ...prev,
      [section]: data,
    }))
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            AI-Powered <span className="text-primary">Resume Builder</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Create a professional resume with real-time preview and AI-powered suggestions
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left column - Form */}
          <div className="space-y-6">
            <ResumeForm resumeData={resumeData} updateResumeData={updateResumeData} />
          </div>

          {/* Right column - Preview */}
          <div className="lg:sticky lg:top-24 lg:h-fit">
            <ResumePreview resumeData={resumeData} />
          </div>
        </div>
      </div>
    </div>
  )
}
