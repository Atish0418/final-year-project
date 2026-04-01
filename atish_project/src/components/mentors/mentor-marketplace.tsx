"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardFooter, CardHeader, CardTitle } from "../ui/shadcn/card"
import { Button } from "../ui/shadcn/button"
import { Badge } from "../ui/shadcn/badge"
import { Input } from "../ui/shadcn/input"
import { Search, Star, MessageSquare, Calendar, ArrowRight, SlidersHorizontal, Briefcase, CheckCircle2, Clock, Zap, Loader2 } from "lucide-react"
import { mentors, type Mentor } from "../../services/mentorService"
import { Dialog, DialogContent } from "../ui/shadcn/dialog"
import { cn } from "../../lib/utils"

export function MentorMarketplace() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedExpertise, setSelectedExpertise] = useState<string | null>(null)
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null)
  const [isBooking, setIsBooking] = useState(false)
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false)

  const allExpertise = Array.from(new Set(mentors.flatMap((m) => m.expertise)))

  const filteredMentors = mentors.filter((m) => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         m.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         m.company.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesExpertise = selectedExpertise ? m.expertise.includes(selectedExpertise) : true
    return matchesSearch && matchesExpertise
  })

  const handleBookSession = () => {
    setIsBooking(true)
    setTimeout(() => {
      setIsBooking(false)
      setIsPaymentSuccess(true)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-muted/10 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="text-center mb-16 relative"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 blur-[100px] -z-10 rounded-full"></div>
          <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20 border-primary/20 px-4 py-1 text-xs font-bold uppercase tracking-widest">
             Level Up Your Career
          </Badge>
          <h1 className="text-5xl sm:text-7xl font-extrabold mb-6 tracking-tight text-gray-900 leading-[1.1]">
             Connect with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-600 to-indigo-600">Top Tier</span> Mentors
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
             Get 1-on-1 personalized guidance from professionals working at world-class companies. Break through career plateaus and achieve your goals.
          </p>
        </motion.div>

        {/* Filters & Search */}
        <div className="mb-12 sticky top-24 z-20 bg-white/40 backdrop-blur-xl p-4 rounded-3xl border border-white/50 shadow-glass flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-grow w-full">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, role or company..."
              className="pl-14 h-16 rounded-2xl bg-white/80 border-none shadow-premium-sm text-lg focus-visible:ring-primary/20"
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
             <div className="flex flex-wrap gap-2">
                <Button 
                   variant={selectedExpertise === null ? "default" : "outline"} 
                   onClick={() => setSelectedExpertise(null)}
                   className="rounded-xl h-12 font-bold transition-all"
                >
                   All Skills
                </Button>
                {allExpertise.slice(0, 3).map((exp) => (
                   <Button 
                      key={exp}
                      variant={selectedExpertise === exp ? "default" : "outline"}
                      onClick={() => setSelectedExpertise(exp)}
                      className={cn("rounded-xl h-12 font-bold transition-all", selectedExpertise === exp ? "bg-primary border-primary" : "bg-white border-muted/50")}
                   >
                      {exp}
                   </Button>
                ))}
             </div>
             <Button variant="outline" className="h-12 w-12 p-0 rounded-xl bg-white border-muted/50 hidden sm:flex">
                <SlidersHorizontal size={20} />
             </Button>
          </div>
        </div>

        {/* Mentor Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredMentors.map((mentor, index) => (
              <motion.div
                key={mentor.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                layout
              >
                <Card className="group border-none shadow-premium rounded-3xl overflow-hidden h-full flex flex-col bg-white/80 backdrop-blur-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                  <div className="relative h-48 sm:h-56 bg-gradient-to-br from-indigo-500/10 to-primary/10 flex items-center justify-center p-8 overflow-hidden">
                     <div className="absolute top-4 right-4 z-10">
                        <Badge className="bg-white/90 text-primary font-bold shadow-sm px-3 py-1 scale-110">
                           ${mentor.price}/hr
                        </Badge>
                     </div>
                     <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-primary/20 rounded-full blur-2xl group-hover:bg-primary/40 transition-colors duration-500"></div>
                     <div className="relative group-hover:scale-110 transition-transform duration-500">
                        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full scale-125 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <img
                          src={mentor.avatar}
                          alt={mentor.name}
                          className="h-32 w-32 sm:h-40 sm:w-40 rounded-3xl shadow-xl border-4 border-white relative z-10"
                        />
                     </div>
                  </div>
                  <CardHeader className="py-6 px-8 flex-grow">
                    <div className="flex justify-between items-start mb-2">
                       <div>
                          <CardTitle className="text-2xl font-bold text-gray-900 mb-1 group-hover:text-primary transition-colors">
                             {mentor.name}
                          </CardTitle>
                          <div className="flex items-center text-sm font-bold text-primary tracking-wide">
                             <Briefcase className="h-4 w-4 mr-2" />
                             {mentor.role} @ {mentor.company}
                          </div>
                       </div>
                    </div>
                    <div className="flex items-center gap-1.5 mb-6 bg-yellow-500/10 w-fit px-3 py-1 rounded-full border border-yellow-500/20">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-extrabold text-sm text-yellow-700">{mentor.rating}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {mentor.expertise.map((exp) => (
                        <Badge key={exp} variant="secondary" className="bg-muted-foreground/10 text-muted-foreground border-none px-3 font-medium">
                          {exp}
                        </Badge>
                      ))}
                    </div>
                  </CardHeader>
                  <CardFooter className="p-8 pt-0 mt-auto">
                    <Button 
                       onClick={() => setSelectedMentor(mentor)}
                       className="w-full h-14 rounded-2xl text-lg font-bold shadow-lg shadow-primary/10 group/btn transition-all active:scale-95"
                    >
                      Book Free Consultation
                      <ArrowRight className="ml-2 h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredMentors.length === 0 && (
           <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="text-center py-32 bg-white/40 rounded-[3rem] border-2 border-dashed border-muted/50 border-white/50"
           >
              <div className="h-20 w-20 bg-muted/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                 <Search className="h-10 w-10 text-muted-foreground opacity-30" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No Mentors Found</h3>
              <p className="text-muted-foreground">Try adjusting your filters or search terms.</p>
           </motion.div>
        )}

        {/* Mentor Detail Dialog */}
        <Dialog open={!!selectedMentor} onOpenChange={(open) => !open && setSelectedMentor(null)}>
           <DialogContent className="max-w-4xl p-0 border-none rounded-[3rem] overflow-hidden shadow-2xl">
              {selectedMentor && (
                 <div className="flex flex-col lg:flex-row h-full max-h-[90vh]">
                    {/* Sidebar / Profile Info */}
                    <div className="lg:w-1/3 bg-gradient-to-br from-indigo-900 to-primary p-12 text-white flex flex-col items-center text-center">
                       <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                          <img 
                            src={selectedMentor.avatar} 
                            alt={selectedMentor.name} 
                            className="h-40 w-40 rounded-[2.5rem] shadow-2xl mb-8 border-4 border-white/30"
                          />
                       </motion.div>
                       <h2 className="text-3xl font-extrabold mb-3 leading-tight">{selectedMentor.name}</h2>
                       <p className="text-white/80 font-bold mb-8 uppercase tracking-widest text-xs">{selectedMentor.role}</p>
                       
                       <div className="w-full space-y-6 pt-6 border-t border-white/20">
                          <div className="flex flex-col items-center">
                             <div className="p-3 bg-white/10 rounded-2xl mb-2">
                                <Star className="h-6 w-6 text-yellow-400 fill-yellow-400" />
                             </div>
                             <span className="text-2xl font-black">4.9/5.0</span>
                             <span className="text-xs text-white/60 font-bold uppercase tracking-tighter">Overall Excellence</span>
                          </div>
                          <div className="flex flex-col items-center">
                             <div className="p-3 bg-white/10 rounded-2xl mb-2">
                                <Zap className="h-6 w-6 text-orange-400 fill-orange-400" />
                             </div>
                             <span className="text-2xl font-black">Fast Responder</span>
                             <span className="text-xs text-white/60 font-bold uppercase tracking-tighter">Under 30 minutes</span>
                          </div>
                       </div>
                    </div>
                    
                    {/* Content Area */}
                    <div className="lg:w-2/3 bg-white p-12 flex flex-col justify-between">
                       <div className="space-y-10">
                          <div>
                             <h4 className="text-xs font-black uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                                <span className="h-px w-8 bg-primary"></span>
                                Professional Bio
                             </h4>
                             <p className="text-xl text-gray-700 leading-relaxed font-medium">
                                {selectedMentor.bio}
                             </p>
                          </div>
                          
                          <div>
                             <h4 className="text-xs font-black uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                                <span className="h-px w-8 bg-primary"></span>
                                Mastery Areas
                             </h4>
                             <div className="flex flex-wrap gap-3">
                                {selectedMentor.expertise.map((skill) => (
                                   <div key={skill} className="px-5 py-3 bg-primary/5 rounded-2xl border-2 border-primary/10 flex items-center gap-2">
                                      <CheckCircle2 className="h-5 w-5 text-primary" />
                                      <span className="font-bold text-primary">{skill}</span>
                                   </div>
                                ))}
                             </div>
                          </div>

                          <div className="grid grid-cols-2 gap-6">
                             <div className="p-6 bg-muted/10 rounded-3xl border border-muted-foreground/10">
                                <h5 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Availability</h5>
                                <div className="flex items-center gap-3">
                                   <Calendar className="h-6 w-6 text-primary" />
                                   <span className="font-bold text-lg">Next Monday</span>
                                </div>
                             </div>
                             <div className="p-6 bg-muted/10 rounded-3xl border border-muted-foreground/10">
                                <h5 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Duration</h5>
                                <div className="flex items-center gap-3">
                                   <Clock className="h-6 w-6 text-primary" />
                                   <span className="font-bold text-lg">45 min Session</span>
                                </div>
                             </div>
                          </div>
                       </div>

                       <div className="pt-10 flex gap-4">
                          <Button 
                            onClick={handleBookSession}
                            disabled={isBooking}
                            className="flex-grow h-20 rounded-[1.5rem] text-xl font-black shadow-2xl shadow-primary/30 relative overflow-hidden group"
                          >
                             {isBooking ? (
                                <Loader2 className="h-8 w-8 animate-spin" />
                             ) : (
                                <>
                                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                  <span className="relative z-10 flex items-center gap-3">
                                     Secure My Spot
                                     <ArrowRight className="h-6 w-6" />
                                  </span>
                                </>
                             )}
                          </Button>
                          <Button variant="outline" className="h-20 w-20 rounded-[1.5rem] border-2 border-muted/50 p-0 hover:bg-muted/10">
                             <MessageSquare className="h-8 w-8 text-muted-foreground" />
                          </Button>
                       </div>
                    </div>
                 </div>
              )}
           </DialogContent>
        </Dialog>

        {/* Success Dialog */}
        <Dialog open={isPaymentSuccess} onOpenChange={setIsPaymentSuccess}>
           <DialogContent className="max-w-md p-12 text-center rounded-[3rem] border-none shadow-2xl">
              <motion.div 
                 initial={{ scale: 0.5, opacity: 0 }} 
                 animate={{ scale: 1, opacity: 1 }} 
                 className="flex flex-col items-center"
              >
                 <div className="h-32 w-32 bg-emerald-100 rounded-full flex items-center justify-center mb-8 relative">
                    <div className="absolute inset-0 bg-emerald-400/20 blur-3xl animate-pulse"></div>
                    <CheckCircle2 className="h-20 w-20 text-emerald-500 relative z-10" />
                 </div>
                 <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tighter">Session Confirmed!</h2>
                 <p className="text-muted-foreground mb-10 leading-relaxed font-medium">
                    Congratulations! Your session with {selectedMentor?.name} has been successfully booked. You'll receive a calendar invite shortly.
                 </p>
                 <Button onClick={() => { setIsPaymentSuccess(false); setSelectedMentor(null); }} className="w-full h-16 rounded-2xl text-lg font-bold shadow-xl">
                    View My Appointments
                 </Button>
              </motion.div>
           </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
