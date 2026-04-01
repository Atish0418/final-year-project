"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/shadcn/card"
import { Button } from "@/components/ui/shadcn/button"
import { Textarea } from "@/components/ui/shadcn/textarea"
import { Label } from "@/components/ui/shadcn/label"
import { Wand2, Copy, Download, RefreshCw, Check, Sparkles, FileText, Info } from "lucide-react"
import { generateCoverLetterWithAI } from "@/services/coverLetterService"
import { useAuthStore } from "@/store/useAuthStore"

export function CoverLetterGenerator() {
  const [jobDescription, setJobDescription] = useState("")
  const [generatedLetter, setGeneratedLetter] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const { user } = useAuthStore()

  const handleGenerateCoverLetter = async () => {
    if (!jobDescription.trim()) return

    setIsGenerating(true)
    try {
      // We could pass the user object here for better personalization
      const letter = await generateCoverLetterWithAI(jobDescription, user);
      setGeneratedLetter(letter)
    } catch (error) {
      console.error("Failed to generate cover letter", error);
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedLetter)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  const downloadLetter = () => {
    const element = document.createElement("a")
    const file = new Blob([generatedLetter], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = "cover-letter.txt"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className="min-h-screen bg-muted/10 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
             Smart Cover Letter Generator
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
             Tailor your job application in seconds. Paste the job description and let AI craft the perfect introduction.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
          {/* Input Side */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
             <Card className="border-none shadow-premium rounded-3xl overflow-hidden h-full flex flex-col">
                <CardHeader className="bg-primary/5 border-b border-primary/10 py-8">
                   <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-xl">
                         <FileText className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                         <CardTitle className="text-2xl font-bold">Target Vacancy</CardTitle>
                         <CardDescription>Details matter for better personalization</CardDescription>
                      </div>
                   </div>
                </CardHeader>
                <CardContent className="p-8 flex-grow flex flex-col gap-6">
                   <div className="space-y-2 flex-grow flex flex-col">
                      <Label htmlFor="jobDescription" className="font-bold text-sm uppercase tracking-wider text-muted-foreground">
                         Job Role & Description
                      </Label>
                      <Textarea
                        id="jobDescription"
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        placeholder="Paste the job description, company name, and requirements here for the best results..."
                        className="flex-grow min-h-[350px] bg-white border-muted/50 rounded-2xl p-6 text-base leading-relaxed focus-visible:ring-primary/20"
                      />
                   </div>

                   <Button
                     onClick={handleGenerateCoverLetter}
                     disabled={!jobDescription.trim() || isGenerating}
                     size="lg"
                     className="w-full h-16 rounded-2xl text-lg font-bold shadow-xl transition-all hover:shadow-primary/30"
                   >
                     {isGenerating ? (
                       <>
                         <RefreshCw className="mr-3 h-6 w-6 animate-spin" />
                         AI Architecting Your Letter...
                       </>
                     ) : (
                       <>
                         <Wand2 className="mr-3 h-5 w-5" />
                         Generate Tailored Letter
                       </>
                     )}
                   </Button>
                </CardContent>
             </Card>
          </motion.div>

          {/* Output Side */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-6">
             <Card className="border-none shadow-premium rounded-3xl overflow-hidden flex-grow flex flex-col">
                <CardHeader className="bg-blue-50/50 border-b border-blue-100 py-8">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <div className="p-2 bg-blue-100 rounded-xl">
                            <Sparkles className="h-6 w-6 text-blue-600" />
                         </div>
                         <CardTitle className="text-2xl font-bold">Your AI Letter</CardTitle>
                      </div>
                      {generatedLetter && (
                         <div className="flex gap-2">
                           <Button variant="outline" size="sm" onClick={copyToClipboard} className="rounded-full bg-white h-10 px-4 gap-2">
                              {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                              {isCopied ? "Copied" : "Copy"}
                           </Button>
                           <Button variant="outline" size="sm" onClick={downloadLetter} className="rounded-full bg-white h-10 px-4 gap-2">
                              <Download className="h-4 w-4" />
                              Save
                           </Button>
                         </div>
                      )}
                   </div>
                </CardHeader>
                <CardContent className="p-8 flex-grow">
                   {generatedLetter ? (
                      <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }}
                        className="bg-muted/30 rounded-2xl p-8 border-2 border-muted/50 h-full max-h-[500px] overflow-y-auto scrollbar-hide"
                      >
                         <p className="whitespace-pre-wrap text-sm sm:text-base leading-loose font-serif text-gray-800">
                            {generatedLetter}
                         </p>
                      </motion.div>
                   ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center py-20 bg-muted/5 rounded-2xl border-2 border-dashed border-muted/30">
                         <div className="relative mb-6">
                            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full"></div>
                            <Wand2 className="h-16 w-16 text-primary relative z-10 opacity-40 animate-pulse" />
                         </div>
                         <p className="text-xl font-bold text-muted-foreground mb-2">No Letter Yet</p>
                         <p className="text-muted-foreground max-w-xs mx-auto">
                            Fill in the job details on the left and click generate to see the magic.
                         </p>
                      </div>
                   )}
                </CardContent>
             </Card>

             <Card className="border-none shadow-premium rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-2">
                <CardContent className="p-6 flex items-start gap-4">
                   <div className="p-3 bg-white/20 rounded-2xl">
                      <Info className="h-6 w-6" />
                   </div>
                   <div>
                      <h4 className="font-bold text-lg mb-1">Pro Tip</h4>
                      <p className="text-white/80 text-sm leading-relaxed">
                         The more specific you are in the description, the better AI will match your past experience with the role's needs.
                      </p>
                   </div>
                </CardContent>
             </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
