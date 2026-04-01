import { ArrowRight, ArrowUpRight, Sparkles } from "lucide-react";
import { Button } from "../components/ui/Button";
import { SectionHeader } from "../components/ui/SectionHeader";
import { streams } from "../data/streams";
import { departments } from "../data/departments";
import { useFavoritesStore } from "../store/useFavoritesStore";
import { useLanguageStore } from "../store/useLanguageStore";
import { localizeStream } from "../utils/i18n";
import { Seo } from "../components/Seo";
import { mapStreamToSlug } from "./StreamsPage";
import { Link } from "react-router-dom";

const HomePage = () => {
  const favorites = useFavoritesStore();
  const lang = useLanguageStore((s) => s.lang);
  const totalCourses = new Set(departments.map((d) => d.id)).size;

  return (
    <div className="pb-16 space-y-16">
      <Seo
        title="FuturePath 3D | Career Guidance After 12th with Courses, Colleges & Jobs"
        description="Discover courses, colleges, and career paths after 12th across engineering, medical, arts, commerce, government, diplomas, and more with guided tools and comparisons."
        canonicalPath="/"
      />

      {/* Hero */}
      <section className="flex flex-col items-center text-center pt-12 pb-16 px-4">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] font-medium leading-[1.1] text-gray-900 max-w-4xl tracking-tight">
          Where <br className="hidden sm:block" /> Careers are Built.
        </h1>
        <p className="text-gray-500 max-w-2xl mt-6 text-sm sm:text-base">
          Explore your higher studies and future careers after 12th in a visual interactive way.
          Compare courses, simulate labs, and get parent-ready insights.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
          <Button as={Link} to="/streams" variant="primary" className="rounded-full px-6">
            Build career <ArrowUpRight size={16} className="ml-1 opacity-70" />
          </Button>
          <Button as={Link} to="/about" variant="outline" className="rounded-full px-6 bg-white">
            Contact us <ArrowUpRight size={16} className="ml-1 opacity-70" />
          </Button>
        </div>
      </section>

      {/* Visual Block from Hero */}
      <section className="px-4 sm:px-8 mb-24 max-w-7xl mx-auto">
         <div className="relative w-full aspect-[16/8] sm:aspect-[16/7] bg-gray-200 rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden flex items-end justify-center pb-0 isolate">
           <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1600&auto=format&fit=crop" alt="Students" className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-50" />
           <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
           
           <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md rounded-full px-4 py-2 flex items-center gap-2 shadow-sm">
             <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Event</span>
             <span className="text-sm font-medium text-gray-900">Building career &gt;</span>
           </div>
           
           <div className="absolute bottom-8 left-8 text-left max-w-lg z-10">
             <div className="inline-flex items-center px-3 py-1 rounded-full border border-white/30 text-gray-900/90 text-xs mb-4 backdrop-blur-sm">
               {totalCourses} Opportunities
             </div>
             <h3 className="text-2xl sm:text-3xl text-gray-900 font-medium leading-tight mb-3">Efficiently transform your <br/> candidate experience.</h3>
             <p className="text-gray-900/80 text-sm leading-relaxed max-w-md hidden sm:block">FuturePath 3D is the Hiring Experience Platform that automates interview scheduling to perfection, so you stay focused on the talent.</p>
           </div>
           
           <div className="absolute top-6 right-6 bg-gray-100 backdrop-blur-md text-gray-900 border border-white/30 rounded-full px-4 py-2 flex items-center gap-2 shadow-sm text-sm">
             Match yours <ArrowUpRight size={14} />
           </div>

           <div className="absolute bottom-8 right-8 flex flex-col gap-3 items-end z-10 hidden md:flex">
              <div className="bg-white rounded-full p-1.5 pr-4 flex items-center gap-3 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] transform -translate-x-12">
                 <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">C</div>
                 <div className="text-xs leading-tight">
                   <div className="font-semibold text-gray-900">Brooklyn Simmons</div>
                   <div className="text-gray-500">Barone LLC.</div>
                 </div>
              </div>
              <div className="bg-white rounded-full p-1.5 pr-4 flex items-center gap-3 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] transform translate-x-4">
                 <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-xs">E</div>
                 <div className="text-xs leading-tight">
                   <div className="font-semibold text-gray-900">Eleanor Pena</div>
                   <div className="text-gray-500">Marketing Coord.</div>
                 </div>
              </div>
           </div>
         </div>
      </section>

      {/* Secondary split section */}
      <section className="px-4 sm:px-8 py-10 max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 items-start">
        
        <div className="lg:w-1/3 lg:sticky lg:top-32 space-y-4">
          <h2 className="text-3xl sm:text-4xl font-medium text-gray-900 leading-[1.15]">Dive into Interactive Learning.</h2>
          <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
            Stop guessing about your future. Use our analytical tools and AI advisors to find the perfect stream and college for your personality.
          </p>
        </div>
        
        <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
           
           <div className="flex flex-col gap-5">
             {/* Small Card 1 */}
             <div className="bg-gray-100 rounded-[2rem] p-5 lg:p-6 flex flex-col aspect-square relative overflow-hidden group">
               <div className="inline-flex max-w-max items-center px-4 py-1.5 rounded-full border border-gray-200 text-gray-700 text-xs font-medium bg-white/70 backdrop-blur-sm shadow-sm mb-auto">
                 Mentorship
               </div>
               
               <div className="mt-8 relative z-10">
                 <div className="flex mb-2">
                    <div className="w-6 h-6 rounded-full bg-red-100 -mr-2 border-2 border-white z-20"></div>
                    <div className="w-6 h-6 rounded-full bg-blue-100 -mr-2 border-2 border-white z-10"></div>
                    <div className="w-6 h-6 rounded-full bg-green-100 border-2 border-white"></div>
                 </div>
                 <h3 className="text-xl font-medium text-gray-900 leading-tight">Start Your<br/>Journey</h3>
               </div>
               <div className="absolute bottom-5 right-5 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-900 opacity-0 group-hover:opacity-100 transition-opacity">
                 <ArrowUpRight size={14} />
               </div>
             </div>
             
             {/* Small Card 2 */}
             <div className="bg-gray-800 rounded-[2rem] p-5 lg:p-6 flex flex-col aspect-square relative overflow-hidden group text-gray-900">
               <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay" alt="Contractor" />
               <div className="relative z-10 inline-flex max-w-max items-center px-4 py-1.5 rounded-full border border-white/20 text-gray-900 text-xs font-medium bg-gray-100 backdrop-blur-sm shadow-sm mb-auto">
                 Force
               </div>
               
               <div className="relative z-10 mt-8">
                 <h3 className="text-xl font-medium leading-tight">Career<br/>Library</h3>
               </div>
               <div className="absolute bottom-5 right-5 z-10 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-900 opacity-0 group-hover:opacity-100 transition-opacity">
                 <ArrowUpRight size={14} />
               </div>
             </div>
           </div>

           {/* Tall Card 1 */}
           <div className="bg-gray-200 rounded-[2rem] p-5 lg:p-6 flex flex-col relative overflow-hidden group min-h-[380px] lg:min-h-[420px]">
             <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop" className="absolute inset-x-6 top-20 object-cover w-[calc(100%-3rem)] h-56 rounded-[1.5rem] grayscale contrast-125 mx-auto" alt="Person" />
             <div className="absolute top-5 right-5 inline-flex items-center px-3 py-1.5 rounded-full border border-white/20 text-gray-900 text-[11px] font-medium bg-gray-100 backdrop-blur-md shadow-sm">
               Meeting <ArrowUpRight size={12} className="ml-1" />
             </div>
             
             <div className="mt-auto z-10 flex justify-between items-end w-full">
               <div>
                 <h3 className="text-lg font-medium text-gray-900">Savannah Nguyen</h3>
                 <p className="text-xs text-gray-500">CEO, Los Angeles, USA</p>
               </div>
               <span className="text-[11px] text-gray-500 underline underline-offset-2">Read More.</span>
             </div>
           </div>

           {/* Tall Card 2 */}
           <div className="bg-gray-900 rounded-[2rem] p-5 lg:p-6 flex flex-col relative overflow-hidden group min-h-[380px] lg:min-h-[420px]">
             <img src="https://images.unsplash.com/photo-1531123897727-8f129e1bf3c9?q=80&w=600&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-80" alt="Person" />
             <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-transparent to-transparent" />
             <div className="absolute top-5 left-5 inline-flex items-center px-4 py-1.5 rounded-full border border-gray-200 text-gray-900 text-xs font-medium bg-gray-100 backdrop-blur-md shadow-sm">
               HR & manager
             </div>
             
             <div className="mt-auto z-10">
                 <h3 className="text-lg font-medium text-gray-900">Courtney Henry</h3>
                 <p className="text-[11px] text-gray-300">SM, London, Great Britain</p>
             </div>
           </div>

        </div>
      </section>

      {/* AI Career Suite */}
      <section className="px-4 sm:px-8 py-16 max-w-7xl mx-auto">
        <div className="bg-gray-900 rounded-[3rem] p-8 sm:p-16 relative overflow-hidden">
          {/* Background effects */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full -translate-x-1/2 translate-y-1/2"></div>
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/10 text-primary text-xs font-bold uppercase tracking-widest mb-6">
                <Sparkles size={14} /> New: AI Career Suite
              </div>
              <h2 className="text-4xl sm:text-5xl font-medium text-white leading-[1.1] mb-6"> Our Intelligence, <br/> Your Career Growth.</h2>
              <p className="text-gray-400 text-lg mb-10 max-w-lg leading-relaxed">
                Leverage advanced Generative AI to build roadmaps, craft professional resumes, and get real-time career advice from our intelligent assistant.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button as={Link} to="/career-ai" variant="primary" className="rounded-full h-14 px-8 text-lg font-bold">
                   Try Career AI <ArrowRight size={20} className="ml-2" />
                </Button>
                <Button as={Link} to="/resume-builder" variant="outline" className="rounded-full h-14 px-8 text-lg font-bold border-white/20 text-white hover:bg-white/10">
                   Resume Builder
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: "Smart Roadmaps", desc: "Interactive AI-generated learning paths.", color: "bg-blue-500/10", icon: <ArrowRight className="text-blue-400" /> },
                { title: "AI Cover Letters", desc: "Tailored drafts for any job description.", color: "bg-purple-500/10", icon: <Sparkles className="text-purple-400" /> },
                { title: "Mentor Access", desc: "Connect with experts from top firms.", color: "bg-emerald-500/10", icon: <ArrowUpRight className="text-emerald-400" /> },
                { title: "Mock Interviews", desc: "Prepare with AI-driven questioning.", color: "bg-orange-500/10", icon: <ArrowRight className="text-orange-400" /> }
              ].map((feature, i) => (
                <div key={i} className={`${feature.color} backdrop-blur-sm border border-white/5 p-6 rounded-3xl group hover:bg-white/10 transition-all`}>
                   <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      {feature.icon}
                   </div>
                   <h4 className="text-white font-bold mb-1">{feature.title}</h4>
                   <p className="text-gray-500 text-xs leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Streams list (Adapted to current logic but simple layout to match style) */}
      <section className="px-4 sm:px-8 py-16 max-w-7xl mx-auto space-y-8">
        <div className="max-w-2xl">
          <SectionHeader
            eyebrow="Streams"
            title="Available Paths"
            subtitle="Browse through standard streams using the new UI style."
          />
        </div>
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {streams.slice(0, 3).map((stream) => {
            const ls = localizeStream(stream.id, lang)!;
            return (
              <div key={stream.id} className="bg-gray-50 border border-gray-100 rounded-[2rem] p-6 flex flex-col group hover:shadow-card transition-shadow">
                 <div className="flex items-center justify-between mb-4">
                   <div className="text-xs font-semibold text-gray-500 uppercase">{stream.id}</div>
                   <Button variant="ghost" className="h-8 w-8 p-0 rounded-full" onClick={() => favorites.toggle({ id:(stream.id), type:"stream", name:ls.title, description:ls.summary })}>
                     {favorites.isSaved(stream.id) ? "★" : "☆"}
                   </Button>
                 </div>
                 <h3 className="text-xl font-medium text-gray-900 mb-2">{ls.title}</h3>
                 <p className="text-gray-500 text-sm mb-6 flex-1 line-clamp-3">{ls.summary}</p>
                 <Button as={Link} to={`/stream/${mapStreamToSlug(stream.id)}`} variant="outline" className="w-full justify-between group-hover:bg-gray-900 group-hover:text-white group-hover:border-gray-900 transition-all">
                    Explore <ArrowRight size={16} />
                 </Button>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
};

export default HomePage;
