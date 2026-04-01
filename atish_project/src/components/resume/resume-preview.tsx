"use client"
import { Card, CardContent } from "@/components/ui/shadcn/card"
import { Button } from "@/components/ui/shadcn/button"
import { SaveIcon, DownloadCloud, Mail, Phone, MapPin, Globe, FileText, Briefcase, GraduationCap, Code, Link as LinkIcon } from "lucide-react"
import type { ResumeData } from "@/types/resume"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"
import { motion } from "framer-motion"

interface ResumePreviewProps {
  resumeData: ResumeData
}

export function ResumePreview({ resumeData }: ResumePreviewProps) {
  const handleDownload = () => {
    const resume = document.getElementById("resume-content");
    if (resume) {
      html2canvas(resume, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff"
      }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const width = pdf.internal.pageSize.getWidth();
        const height = pdf.internal.pageSize.getHeight();
        pdf.addImage(imgData, "PNG", 0, 0, width, height);
        pdf.save(`${resumeData.personalDetails.fullName || 'resume'}.pdf`);
      });
    }
  };

  const handleSave = () => {
    // This will be implemented with Firebase later
    console.log("Saving resume...")
  }

  return (
    <div className="space-y-6">
      {/* Action buttons */}
      <div className="flex gap-4 p-4 bg-muted/30 rounded-2xl border border-muted/50">
        <Button onClick={handleDownload} className="flex-1 h-12 text-lg font-bold shadow-lg hover:shadow-primary/20">
          <DownloadCloud className="mr-2 h-5 w-5" />
          Export PDF
        </Button>
        <Button variant="outline" onClick={handleSave} className="flex-1 h-12 bg-white text-lg font-semibold border-2 hover:bg-muted/50 transition-all">
          <SaveIcon className="mr-2 h-5 w-5" />
          Save Draft
        </Button>
      </div>

      {/* Resume preview */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-2xl blur-lg -z-10"></div>
        <Card id="resume-content" className="bg-white text-black shadow-2xl rounded-xl overflow-hidden border-none min-h-[842px] w-full">
            <CardContent className="p-12 space-y-8 font-sans">
            {/* Header */}
            <div className="space-y-4">
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight leading-none">
                {resumeData.personalDetails.fullName || "YOUR FULL NAME"}
                </h1>
                <div className="flex flex-wrap gap-y-2 gap-x-6 text-sm text-gray-600 font-medium">
                {resumeData.personalDetails.email && (
                    <div className="flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-primary/70" />
                    {resumeData.personalDetails.email}
                    </div>
                )}
                {resumeData.personalDetails.phone && (
                    <div className="flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-primary/70" />
                    {resumeData.personalDetails.phone}
                    </div>
                )}
                {resumeData.personalDetails.location && (
                    <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-primary/70" />
                    {resumeData.personalDetails.location}
                    </div>
                )}
                </div>
                <div className="flex flex-wrap gap-y-2 gap-x-6 text-sm text-gray-600">
                {resumeData.personalDetails.website && (
                    <div className="flex items-center gap-1.5">
                    <Globe className="h-3.5 w-3.5 text-primary/70" />
                    {resumeData.personalDetails.website.replace(/^https?:\/\//, '')}
                    </div>
                )}
                {resumeData.personalDetails.linkedin && (
                    <div className="flex items-center gap-1.5">
                    <LinkIcon className="h-3.5 w-3.5 text-primary/70" />
                    LinkedIn Profile
                    </div>
                )}
                </div>
            </div>

            {/* Professional Summary */}
            {(resumeData.summary || !resumeData.personalDetails.fullName) && (
                <div className="space-y-3">
                <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <h2 className="text-lg font-bold text-gray-900 uppercase tracking-widest border-b-2 border-primary/20 pb-1 flex-grow">
                        Professional Summary
                    </h2>
                </div>
                <p className="text-gray-700 leading-relaxed text-sm">
                    {resumeData.summary || "Add a powerful summary reflecting your core expertise and value proposition..."}
                </p>
                </div>
            )}

            {/* Experience */}
            {resumeData.experience.length > 0 && (
                <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <Briefcase className="h-5 w-5 text-primary" />
                    <h2 className="text-lg font-bold text-gray-900 uppercase tracking-widest border-b-2 border-primary/20 pb-1 flex-grow">
                        Work Experience
                    </h2>
                </div>
                <div className="space-y-6">
                    {resumeData.experience.map((exp) => (
                    <div key={exp.id} className="space-y-2 relative pl-4 border-l-2 border-primary/10">
                        <div className="absolute top-1.5 -left-[7px] w-3 h-3 rounded-full bg-primary/30 border-2 border-white"></div>
                        <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-bold text-gray-900 text-base">{exp.position || "POSITION TITLE"}</h3>
                            <p className="text-primary font-semibold text-sm">{exp.company || "COMPANY NAME"}</p>
                        </div>
                        <div className="text-right text-xs font-bold text-gray-500 bg-muted/50 px-2 py-1 rounded">
                            {exp.startDate ? (
                            <>
                                {new Date(exp.startDate).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                })}{" "}
                                -{" "}
                                {exp.current
                                ? "PRESENT"
                                : exp.endDate
                                    ? new Date(exp.endDate).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "short",
                                    })
                                    : "PRESENT"}
                            </>
                            ) : "2023 - PRESENT"}
                        </div>
                        </div>
                        {exp.description && (
                            <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap italic">
                                {exp.description}
                            </p>
                        )}
                    </div>
                    ))}
                </div>
                </div>
            )}

            {/* Education */}
            {resumeData.education.length > 0 && (
                <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <GraduationCap className="h-5 w-5 text-primary" />
                    <h2 className="text-lg font-bold text-gray-900 uppercase tracking-widest border-b-2 border-primary/20 pb-1 flex-grow">
                        Education
                    </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {resumeData.education.map((edu) => (
                    <div key={edu.id} className="space-y-1">
                        <h3 className="font-bold text-gray-900 text-sm">
                            {edu.degree || "DEGREE"} IN {edu.field || "FIELD"}
                        </h3>
                        <p className="text-gray-700 text-sm">{edu.institution || "INSTITUTION"}</p>
                        <div className="flex items-center justify-between mt-1">
                            {edu.gpa && <span className="text-xs bg-primary/5 text-primary font-bold px-2 py-0.5 rounded">GPA: {edu.gpa}</span>}
                            <span className="text-xs text-gray-500 font-medium italic">
                            {edu.startDate ? new Date(edu.startDate).getFullYear() : "2019"} - {edu.endDate ? new Date(edu.endDate).getFullYear() : "2023"}
                            </span>
                        </div>
                    </div>
                    ))}
                </div>
                </div>
            )}

            {/* Skills */}
            {resumeData.skills.length > 0 && (
                <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <Code className="h-5 w-5 text-primary" />
                    <h2 className="text-lg font-bold text-gray-900 uppercase tracking-widest border-b-2 border-primary/20 pb-1 flex-grow">
                        Core Competencies
                    </h2>
                </div>
                <div className="flex flex-wrap gap-4">
                    {resumeData.skills.map((skillCategory) => (
                    <div key={skillCategory.id} className="flex-grow basis-[200px]">
                        <h3 className="font-bold text-gray-900 text-xs uppercase mb-2 text-primary/80">{skillCategory.category || "CATEGORY"}</h3>
                        <div className="flex flex-wrap gap-2">
                           {skillCategory.items.map((item, idx) => (
                               <span key={idx} className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded border border-gray-200">
                                   {item}
                               </span>
                           ))}
                        </div>
                    </div>
                    ))}
                </div>
                </div>
            )}

            {/* Empty state message */}
            {!resumeData.personalDetails.fullName && !resumeData.summary && resumeData.experience.length === 0 && (
                <div className="text-center py-24 text-gray-400">
                    <DownloadCloud className="h-16 w-16 mx-auto mb-4 opacity-20" />
                    <p className="text-xl font-medium">Resume Real-time Preview</p>
                    <p className="text-sm">Start filling out the builder form to see your professional resume take shape here.</p>
                </div>
            )}
            </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
