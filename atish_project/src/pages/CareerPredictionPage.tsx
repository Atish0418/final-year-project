import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GraduationCap, 
  Brain, 
  Target, 
  Users, 
  BookOpen, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft,
  Sparkles,
  Award,
  Clock,
  Briefcase,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/shadcn/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/shadcn/card';
import { Input } from '@/components/ui/shadcn/input';
import { Progress } from '@/components/ui/shadcn/progress';
import { Slider } from '@/components/ui/shadcn/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/shadcn/select';
import { Seo } from '@/components/Seo';

const FIELDS = {
  // Step 1: Academics
  os_score: 70,
  algorithms_score: 70,
  programming_score: 70,
  software_eng_score: 70,
  networks_score: 70,
  electronics_score: 70,
  architecture_score: 70,
  math_score: 70,
  comm_skills_score: 70,
  
  // Step 2: Skills
  work_hours: 8,
  logical_quotient: 5,
  hackathons: 0,
  coding_rating: 5,
  public_speaking: 5,
  
  // Step 3: Capabilities
  long_time_before_system: 'yes',
  self_learning_capability: 'yes',
  extra_courses: 'no',
  certifications: 'machine learning',
  workshops: 'data science',
  talent_tests: 'yes',
  olympiads: 'no',
  
  // Step 4: Interests
  reading_writing_skills: 'medium',
  memory_capability: 'medium',
  interested_subjects: 'cloud computing',
  interested_career_area: 'system administration',
  job_higher_studies: 'job',
  company_type: 'Service Based',
  interested_books: 'Guide',
  interested_games: 'no',
  
  // Step 5: Personal
  taken_inputs_from_seniors: 'yes',
  salary_range: 'salary',
  relationship_status: 'no',
  behaviour_type: 'gentle',
  mgmt_or_tech: 'Technical',
  salary_or_work: 'salary',
  hard_or_smart_worker: 'smart worker',
  worked_in_teams: 'yes',
  introvert: 'yes'
};

const CareerPredictionPage = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(FIELDS);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const totalSteps = 5;

  const handleInputChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const nextStep = () => setStep(s => Math.min(s + 1, totalSteps));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://127.0.0.1:8001/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Prediction service failed. Please ensure the backend is running.');
      
      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { id: 'os_score', label: 'Operating Systems' },
                { id: 'algorithms_score', label: 'Algorithms' },
                { id: 'programming_score', label: 'Programming Concepts' },
                { id: 'software_eng_score', label: 'Software Engineering' },
                { id: 'networks_score', label: 'Computer Networks' },
                { id: 'electronics_score', label: 'Electronics' },
                { id: 'architecture_score', label: 'Computer Architecture' },
                { id: 'math_score', label: 'Mathematics' },
                { id: 'comm_skills_score', label: 'Communication' },
              ].map(field => (
                <div key={field.id} className="space-y-3">
                  <div className="flex justify-between text-sm font-medium">
                    <label>{field.label}</label>
                    <span className="text-primary">{(formData as any)[field.id]}%</span>
                  </div>
                  <Slider 
                    value={[(formData as any)[field.id]]} 
                    max={100} 
                    step={1}
                    onValueChange={(val) => handleInputChange(field.id, val[0])}
                  />
                </div>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between text-sm font-medium">
                  <label>Daily Work Hours (Potential)</label>
                  <span className="text-primary">{formData.work_hours} hrs</span>
                </div>
                <Slider value={[formData.work_hours]} max={24} min={1} onValueChange={(v) => handleInputChange('work_hours', v[0])} />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm font-medium">
                  <label>Logical Quotient Rating</label>
                  <span className="text-primary">{formData.logical_quotient}/10</span>
                </div>
                <Slider value={[formData.logical_quotient]} max={10} min={1} onValueChange={(v) => handleInputChange('logical_quotient', v[0])} />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-medium">Number of Hackathons Participated</label>
                <Input type="number" value={formData.hackathons} onChange={(e) => handleInputChange('hackathons', parseInt(e.target.value))} />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm font-medium">
                  <label>Coding Skill Rating</label>
                  <span className="text-primary">{formData.coding_rating}/10</span>
                </div>
                <Slider value={[formData.coding_rating]} max={10} min={1} onValueChange={(v) => handleInputChange('coding_rating', v[0])} />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm font-medium">
                  <label>Public Speaking Rating</label>
                  <span className="text-primary">{formData.public_speaking}/10</span>
                </div>
                <Slider value={[formData.public_speaking]} max={10} min={1} onValueChange={(v) => handleInputChange('public_speaking', v[0])} />
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="text-sm font-medium">Can work long time before system?</label>
              <Select value={formData.long_time_before_system} onValueChange={(v) => handleInputChange('long_time_before_system', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="yes">Yes</SelectItem><SelectItem value="no">No</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="space-y-4">
              <label className="text-sm font-medium">Self-learning capability?</label>
              <Select value={formData.self_learning_capability} onValueChange={(v) => handleInputChange('self_learning_capability', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="yes">Yes</SelectItem><SelectItem value="no">No</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="space-y-4">
              <label className="text-sm font-medium">Extra courses done?</label>
              <Select value={formData.extra_courses} onValueChange={(v) => handleInputChange('extra_courses', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="yes">Yes</SelectItem><SelectItem value="no">No</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="space-y-4">
              <label className="text-sm font-medium">Top Certification Area</label>
              <Input value={formData.certifications} onChange={(e) => handleInputChange('certifications', e.target.value)} />
            </div>
            <div className="space-y-4">
              <label className="text-sm font-medium">Workshop Interest</label>
              <Input value={formData.workshops} onChange={(e) => handleInputChange('workshops', e.target.value)} />
            </div>
            <div className="space-y-4">
              <label className="text-sm font-medium">Olympiads Participated?</label>
              <Select value={formData.olympiads} onValueChange={(v) => handleInputChange('olympiads', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="yes">Yes</SelectItem><SelectItem value="no">No</SelectItem></SelectContent>
              </Select>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="text-sm font-medium">Reading/Writing Skills</label>
              <Select value={formData.reading_writing_skills} onValueChange={(v) => handleInputChange('reading_writing_skills', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="poor">Poor</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="excellent">Excellent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-4">
              <label className="text-sm font-medium">Interested Career Area</label>
              <Input value={formData.interested_career_area} onChange={(e) => handleInputChange('interested_career_area', e.target.value)} />
            </div>
            <div className="space-y-4">
              <label className="text-sm font-medium">Job or Higher Studies?</label>
              <Select value={formData.job_higher_studies} onValueChange={(v) => handleInputChange('job_higher_studies', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="job">Job</SelectItem><SelectItem value="higherstudies">Higher Studies</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="space-y-4">
              <label className="text-sm font-medium">Preferred Company Type</label>
              <Input value={formData.company_type} onChange={(e) => handleInputChange('company_type', e.target.value)} />
            </div>
            <div className="space-y-4">
              <label className="text-sm font-medium">Interested Subjects</label>
              <Input value={formData.interested_subjects} onChange={(e) => handleInputChange('interested_subjects', e.target.value)} />
            </div>
          </div>
        );
      case 5:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="text-sm font-medium">Management or Technical?</label>
              <Select value={formData.mgmt_or_tech} onValueChange={(v) => handleInputChange('mgmt_or_tech', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="Management">Management</SelectItem><SelectItem value="Technical">Technical</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="space-y-4">
              <label className="text-sm font-medium">Work Style</label>
              <Select value={formData.hard_or_smart_worker} onValueChange={(v) => handleInputChange('hard_or_smart_worker', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="hard worker">Hard Worker</SelectItem><SelectItem value="smart worker">Smart Worker</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="space-y-4">
              <label className="text-sm font-medium">Introvert?</label>
              <Select value={formData.introvert} onValueChange={(v) => handleInputChange('introvert', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="yes">Yes</SelectItem><SelectItem value="no">No</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="space-y-4">
              <label className="text-sm font-medium">Worked in teams ever?</label>
              <Select value={formData.worked_in_teams} onValueChange={(v) => handleInputChange('worked_in_teams', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="yes">Yes</SelectItem><SelectItem value="no">No</SelectItem></SelectContent>
              </Select>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (result) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 space-y-12">
        <Seo title="Prediction Result | CareerCompass" description="Your AI-predicted career path." />
        
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold uppercase tracking-widest">
            <Sparkles className="w-4 h-4" /> AI ML Prediction
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
            Success! Your Career Path is Optimized.
          </h1>
          <p className="text-xl text-muted-foreground">
            Our neural network analyzed 38 parameters of your profile.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="border-none bg-primary text-primary-foreground shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Target className="w-32 h-32" />
            </div>
            <CardHeader>
              <CardTitle className="text-2xl opacity-90 uppercase tracking-tighter">Primary Category</CardTitle>
              <div className="flex flex-col gap-2 pt-4">
                <span className="text-5xl font-black">{result.prediction}</span>
                <span className="text-sm bg-white/20 px-3 py-1 rounded-full w-fit">Top Recommendation</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <h4 className="font-bold border-b border-white/20 pb-2">Possible Roles:</h4>
                <ul className="grid grid-cols-1 gap-2">
                  {result.roles.map((role: string, i: number) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" /> {role}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <Brain className="w-6 h-6 text-primary" /> Core Matches
              </CardTitle>
              <CardDescription>Top 3 categories based on confidence</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {result.top_matches.map((match: any, i: number) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between font-bold text-sm">
                    <span>{match.category}</span>
                    <span className="text-primary">{match.confidence.toFixed(1)}%</span>
                  </div>
                  <Progress value={match.confidence} className="h-2" />
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button onClick={() => setResult(null)} variant="outline" className="w-full rounded-2xl">
                Recalculate
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] py-12 px-4 relative flex flex-col items-center">
      <Seo title="AI Career Prediction | CareerCompass" description="Predict your future IT career using our Deep Learning model." />
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl w-full space-y-12">
        <header className="text-center space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-bold shadow-sm"
          >
            <Zap className="w-4 h-4" /> Deep Learning powered
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 leading-[1.1]">
            Your Future <span className="text-primary">Optimized.</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto">
            Take our data-driven assessment to find your perfect IT niche using our trained MLP Neural Network.
          </p>
        </header>

        <Card className="border-none shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] rounded-[2.5rem] overflow-hidden bg-white/80 backdrop-blur-xl">
          <CardHeader className="p-8 border-b border-slate-100 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold flex items-center gap-3">
                {step === 1 && <GraduationCap className="text-primary" />}
                {step === 2 && <Brain className="text-primary" />}
                {step === 3 && <Award className="text-primary" />}
                {step === 4 && <Target className="text-primary" />}
                {step === 5 && <Users className="text-primary" />}
                Step {step}: {
                  step === 1 ? "Academics" : 
                  step === 2 ? "Skills & Intel" : 
                  step === 3 ? "Capability" : 
                  step === 4 ? "Interests" : "Personal"
                }
              </CardTitle>
              <CardDescription>Fill all fields for the most accurate prediction</CardDescription>
            </div>
            <div className="text-right">
              <span className="text-sm font-black text-slate-400 uppercase tracking-widest">{step}/{totalSteps}</span>
              <Progress value={(step / totalSteps) * 100} className="w-24 h-1.5 mt-2" />
            </div>
          </CardHeader>
          <CardContent className="p-8 min-h-[400px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>
          </CardContent>
          <CardFooter className="p-8 bg-slate-50/50 flex justify-between gap-4">
            <Button 
              variant="outline" 
              onClick={prevStep} 
              disabled={step === 1 || loading}
              className="rounded-full h-12 px-8 font-bold border-slate-200"
            >
              <ChevronLeft className="w-4 h-4 mr-2" /> Previous
            </Button>
            
            {step < totalSteps ? (
              <Button 
                onClick={nextStep} 
                className="rounded-full h-12 px-8 font-bold shadow-lg shadow-primary/20"
              >
                Next Step <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit} 
                disabled={loading}
                className="rounded-full h-12 px-12 font-bold shadow-xl shadow-primary/30 group"
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
                )}
                Analyze Profile
              </Button>
            )}
          </CardFooter>
        </Card>

        {error && (
          <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 text-red-600">
             <BookOpen className="w-5 h-5 flex-shrink-0" />
             <p className="text-sm font-medium">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

const Loader2 = ({ className, ...props }: any) => (
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
    <path d="M12 2v4" />
    <path d="m16.2 7.8 2.9-2.9" />
    <path d="M18 12h4" />
    <path d="m16.2 16.2 2.9 2.9" />
    <path d="M12 18v4" />
    <path d="m4.9 19.1 2.9-2.9" />
    <path d="M2 12h4" />
    <path d="m4.9 4.9 2.9 2.9" />
  </svg>
);

export default CareerPredictionPage;
