"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/shadcn/card"
import { Button } from "@/components/ui/shadcn/button"
import { Input } from "@/components/ui/shadcn/input"
import { Label } from "@/components/ui/shadcn/label"
import { Textarea } from "@/components/ui/shadcn/textarea"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/shadcn/collapsible"
import { Badge } from "@/components/ui/shadcn/badge"
import { ChevronDown, ChevronUp, Plus, Trash2, User, Briefcase, GraduationCap, Code, Sparkles, Loader2 } from "lucide-react"
import type { ResumeData } from "@/types/resume"
import { improveTextWithAI } from "@/services/resumeService"

interface ResumeFormProps {
  resumeData: ResumeData
  updateResumeData: (section: keyof ResumeData, data: any) => void
}

export function ResumeForm({ resumeData, updateResumeData }: ResumeFormProps) {
  const [isImproving, setIsImproving] = useState(false);
  const [openSections, setOpenSections] = useState({
    personal: true,
    summary: true,
    experience: false,
    education: false,
    skills: false,
  })

  const handleImproveText = async (section: "summary" | "experience", id?: string) => {
    setIsImproving(true);
    try {
      const textToImprove = section === "summary" 
        ? resumeData.summary 
        : resumeData.experience.find(e => e.id === id)?.description || "";

      if (!textToImprove) return;

      const improvedText = await improveTextWithAI(textToImprove);
      
      if (section === 'summary') {
        updateResumeData("summary", improvedText);
      } else if (section === 'experience' && id) {
        updateExperience(id, 'description', improvedText);
      }
    } catch (error) {
      console.error(error);
    }
    setIsImproving(false);
  };

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const addExperience = () => {
    const newExperience = {
      id: Date.now().toString(),
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    }
    updateResumeData("experience", [...resumeData.experience, newExperience])
  }

  const updateExperience = (id: string, field: string, value: any) => {
    const updated = resumeData.experience.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp))
    updateResumeData("experience", updated)
  }

  const removeExperience = (id: string) => {
    const filtered = resumeData.experience.filter((exp) => exp.id !== id)
    updateResumeData("experience", filtered)
  }

  const addEducation = () => {
    const newEducation = {
      id: Date.now().toString(),
      institution: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
      gpa: "",
    }
    updateResumeData("education", [...resumeData.education, newEducation])
  }

  const updateEducation = (id: string, field: string, value: any) => {
    const updated = resumeData.education.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu))
    updateResumeData("education", updated)
  }

  const removeEducation = (id: string) => {
    const filtered = resumeData.education.filter((edu) => edu.id !== id)
    updateResumeData("education", filtered)
  }

  const addSkillCategory = () => {
    const newCategory = {
      id: Date.now().toString(),
      category: "",
      items: [],
    }
    updateResumeData("skills", [...resumeData.skills, newCategory])
  }

  const updateSkillCategory = (id: string, field: string, value: any) => {
    const updated = resumeData.skills.map((skill) => (skill.id === id ? { ...skill, [field]: value } : skill))
    updateResumeData("skills", updated)
  }

  const removeSkillCategory = (id: string) => {
    const filtered = resumeData.skills.filter((skill) => skill.id !== id)
    updateResumeData("skills", filtered)
  }

  const addSkillItem = (categoryId: string, item: string) => {
    if (!item.trim()) return
    const updated = resumeData.skills.map((skill) =>
      skill.id === categoryId ? { ...skill, items: [...skill.items, item.trim()] } : skill,
    )
    updateResumeData("skills", updated)
  }

  const removeSkillItem = (categoryId: string, itemIndex: number) => {
    const updated = resumeData.skills.map((skill) =>
      skill.id === categoryId ? { ...skill, items: skill.items.filter((_, index) => index !== itemIndex) } : skill,
    )
    updateResumeData("skills", updated)
  }

  return (
    <div className="space-y-6">
      {/* Personal Details */}
      <Card>
        <Collapsible open={openSections.personal} onOpenChange={() => toggleSection("personal")}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle>Personal Details</CardTitle>
                    <CardDescription>Your contact information</CardDescription>
                  </div>
                </div>
                {openSections.personal ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4 pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={resumeData.personalDetails.fullName}
                    onChange={(e) =>
                      updateResumeData("personalDetails", { ...resumeData.personalDetails, fullName: e.target.value })
                    }
                    placeholder="John Doe"
                    className="bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={resumeData.personalDetails.email}
                    onChange={(e) =>
                      updateResumeData("personalDetails", { ...resumeData.personalDetails, email: e.target.value })
                    }
                    placeholder="john@example.com"
                    className="bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={resumeData.personalDetails.phone}
                    onChange={(e) =>
                      updateResumeData("personalDetails", { ...resumeData.personalDetails, phone: e.target.value })
                    }
                    placeholder="+1 (555) 123-4567"
                    className="bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={resumeData.personalDetails.location}
                    onChange={(e) =>
                      updateResumeData("personalDetails", { ...resumeData.personalDetails, location: e.target.value })
                    }
                    placeholder="New York, NY"
                    className="bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={resumeData.personalDetails.website}
                    onChange={(e) =>
                      updateResumeData("personalDetails", { ...resumeData.personalDetails, website: e.target.value })
                    }
                    placeholder="https://johndoe.com"
                    className="bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    value={resumeData.personalDetails.linkedin}
                    onChange={(e) =>
                      updateResumeData("personalDetails", { ...resumeData.personalDetails, linkedin: e.target.value })
                    }
                    placeholder="linkedin.com/in/johndoe"
                    className="bg-background"
                  />
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Professional Summary */}
      <Card>
        <Collapsible open={openSections.summary} onOpenChange={() => toggleSection("summary")}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-5 w-5 text-primary flex items-center justify-center">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <CardTitle>Professional Summary</CardTitle>
                    <CardDescription>Brief overview of your experience</CardDescription>
                  </div>
                </div>
                {openSections.summary ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4 pt-4">
              <div className="space-y-2">
                 <div className="flex items-center justify-between">
                    <Label htmlFor="summary">Summary</Label>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleImproveText('summary')}
                      disabled={isImproving || !resumeData.summary}
                      className="h-8 gap-2 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
                    >
                      {isImproving ? <Loader2 className="h-3 w-3 animate-spin"/> : <Sparkles className="h-3 w-3"/>}
                      Improve with AI
                    </Button>
                 </div>
                <Textarea
                  id="summary"
                  value={resumeData.summary}
                  onChange={(e) => updateResumeData("summary", e.target.value)}
                  placeholder="Experienced software developer with 5+ years of expertise..."
                  rows={4}
                  className="bg-background"
                />
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Experience */}
      <Card>
        <Collapsible open={openSections.experience} onOpenChange={() => toggleSection("experience")}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Briefcase className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle>Work Experience</CardTitle>
                    <CardDescription>Your professional history</CardDescription>
                  </div>
                </div>
                {openSections.experience ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4 pt-4">
              {resumeData.experience.map((exp, index) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 border-2 border-muted/50 rounded-2xl bg-muted/20 relative"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold flex items-center gap-2">
                       <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center">
                          {index + 1}
                       </span>
                       Experience
                    </h4>
                    <Button variant="ghost" size="sm" onClick={() => removeExperience(exp.id)} className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label>Company</Label>
                      <Input
                        value={exp.company}
                        onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                        placeholder="Company Name"
                        className="bg-white border-muted-foreground/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Position</Label>
                      <Input
                        value={exp.position}
                        onChange={(e) => updateExperience(exp.id, "position", e.target.value)}
                        placeholder="Job Title"
                        className="bg-white border-muted-foreground/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Start Date</Label>
                      <Input
                        type="month"
                        value={exp.startDate}
                        onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)}
                        className="bg-white border-muted-foreground/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>End Date</Label>
                      <Input
                        type="month"
                        value={exp.endDate}
                        onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)}
                        disabled={exp.current}
                        className="bg-white border-muted-foreground/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                       <Label>Description</Label>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleImproveText('experience', exp.id)}
                          disabled={isImproving || !exp.description}
                          className="h-8 gap-2 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
                        >
                          {isImproving ? <Loader2 className="h-3 w-3 animate-spin"/> : <Sparkles className="h-3 w-3"/>}
                          Refine Achievement
                        </Button>
                    </div>
                    <Textarea
                      value={exp.description}
                      onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                      placeholder="Describe your responsibilities and quantified results..."
                      rows={3}
                      className="bg-white border-muted-foreground/20"
                    />
                  </div>
                </motion.div>
              ))}

              <Button onClick={addExperience} variant="outline" className="w-full bg-transparent border-dashed border-2 py-8 hover:bg-primary/5 hover:border-primary/50 text-muted-foreground hover:text-primary transition-all">
                <Plus className="mr-2 h-5 w-5" />
                Add Experience Detail
              </Button>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Education */}
      <Card>
        <Collapsible open={openSections.education} onOpenChange={() => toggleSection("education")}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle>Education</CardTitle>
                    <CardDescription>Academic background</CardDescription>
                  </div>
                </div>
                {openSections.education ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4 pt-4">
              {resumeData.education.map((edu, index) => (
                 <motion.div
                 key={edu.id}
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="p-4 border-2 border-muted/50 rounded-2xl bg-muted/20 relative"
               >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold flex items-center gap-2">
                       <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center">
                          {index + 1}
                       </span>
                       Education
                    </h4>
                    <Button variant="ghost" size="sm" onClick={() => removeEducation(edu.id)} className="h-8 w-8 p-0">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Institution</Label>
                      <Input
                        value={edu.institution}
                        onChange={(e) => updateEducation(edu.id, "institution", e.target.value)}
                        placeholder="University Name"
                        className="bg-white border-muted-foreground/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Degree</Label>
                      <Input
                        value={edu.degree}
                        onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                        placeholder="B.Tech, B.Sc, etc."
                        className="bg-white border-muted-foreground/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Field of Study</Label>
                      <Input
                        value={edu.field}
                        onChange={(e) => updateEducation(edu.id, "field", e.target.value)}
                        placeholder="Computer Science"
                        className="bg-white border-muted-foreground/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>GPA (Optional)</Label>
                      <Input
                        value={edu.gpa}
                        onChange={(e) => updateEducation(edu.id, "gpa", e.target.value)}
                        placeholder="e.g. 9.1/10"
                        className="bg-white border-muted-foreground/20"
                      />
                    </div>
                  </div>
                </motion.div>
              ))}

              <Button onClick={addEducation} variant="outline" className="w-full bg-transparent border-dashed border-2 py-8 hover:bg-primary/5 hover:border-primary/50 text-muted-foreground hover:text-primary transition-all">
                <Plus className="mr-2 h-5 w-5" />
                Add Education Credentials
              </Button>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Skills */}
      <Card>
        <Collapsible open={openSections.skills} onOpenChange={() => toggleSection("skills")}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Code className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle>Skills Inventory</CardTitle>
                    <CardDescription>Tech stack & competencies</CardDescription>
                  </div>
                </div>
                {openSections.skills ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4 pt-4">
              {resumeData.skills.map((skillCategory, index) => (
                <SkillCategoryForm
                  key={skillCategory.id}
                  skillCategory={skillCategory}
                  index={index}
                  updateSkillCategory={updateSkillCategory}
                  removeSkillCategory={removeSkillCategory}
                  addSkillItem={addSkillItem}
                  removeSkillItem={removeSkillItem}
                />
              ))}

              <Button onClick={addSkillCategory} variant="outline" className="w-full bg-transparent border-dashed border-2 py-8 hover:bg-primary/5 hover:border-primary/50 text-muted-foreground hover:text-primary transition-all">
                <Plus className="mr-2 h-5 w-5" />
                Add Skill Domain
              </Button>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    </div>
  )
}

interface SkillCategoryFormProps {
  skillCategory: { id: string; category: string; items: string[] }
  index: number
  updateSkillCategory: (id: string, field: string, value: any) => void
  removeSkillCategory: (id: string) => void
  addSkillItem: (categoryId: string, item: string) => void
  removeSkillItem: (categoryId: string, itemIndex: number) => void
}

function SkillCategoryForm({
  skillCategory,
  index,
  updateSkillCategory,
  removeSkillCategory,
  addSkillItem,
  removeSkillItem,
}: SkillCategoryFormProps) {
  const [newSkill, setNewSkill] = useState("")

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      addSkillItem(skillCategory.id, newSkill)
      setNewSkill("")
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-5 border-2 border-muted/50 rounded-2xl bg-white shadow-sm"
    >
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-bold flex items-center gap-2">
          Category {index + 1}
        </h4>
        <Button variant="ghost" size="sm" onClick={() => removeSkillCategory(skillCategory.id)} className="h-8 w-8 p-0">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Domain Name</Label>
          <Input
            value={skillCategory.category}
            onChange={(e) => updateSkillCategory(skillCategory.id, "category", e.target.value)}
            placeholder="e.g., Programming, Cloud, Soft Skills"
            className="bg-transparent border-muted-foreground/10 text-lg font-medium"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Skills</Label>
          <div className="flex flex-wrap gap-2 mb-3">
            {skillCategory.items.map((skill, skillIndex) => (
              <Badge key={skillIndex} variant="secondary" className="pl-3 pr-2 py-1 gap-1 text-sm bg-primary/5 hover:bg-primary/10 border-primary/20 text-primary">
                {skill}
                <button
                  onClick={() => removeSkillItem(skillCategory.id, skillIndex)}
                  className="hover:text-destructive p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Add skill..."
              className="bg-muted/10"
              onKeyPress={(e) => e.key === "Enter" && handleAddSkill()}
            />
            <Button onClick={handleAddSkill} size="icon" className="shrink-0 bg-primary/80 hover:bg-primary">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function X({ className, ...props }: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}
