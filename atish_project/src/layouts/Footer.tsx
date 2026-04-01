import { Link } from "react-router-dom";
import { 
  Rocket, 
  Mail, 
  Phone, 
  MapPin, 
  Heart,
  ChevronRight
} from "lucide-react";
import { useLanguageStore } from "../store/useLanguageStore";

// Inline SVGs for brand icons not in lucide
const TwitterLogo = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
);

const InstagramLogo = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
);

const LinkedinLogo = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
);

const YoutubeLogo = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
);

const Footer = () => {
  useLanguageStore((s: any) => s.lang);

  const footerSections = [
    {
      title: "AI & Career Tools",
      links: [
        { to: "/career-roadmap", label: "AI Career Roadmap" },
        { to: "/career-ai", label: "Career AI Chatbot" },
        { to: "/resume-builder", label: "Smart Resume Builder" },
        { to: "/cover-letter", label: "AI Cover Letter" },
        { to: "/mentors", label: "Connect with Mentors" },
      ]
    },
    {
      title: "Popular Streams",
      links: [
        { to: "/stream/engineering", label: "Engineering & Tech" },
        { to: "/stream/medical", label: "Medical & Health" },
        { to: "/stream/commerce", label: "Commerce & Finance" },
        { to: "/stream/arts-science", label: "Arts & Humanities" },
        { to: "/stream/government-career-paths", label: "Government Exams" },
      ]
    },
    {
      title: "Resources & Support",
      links: [
        { to: "/explore-3d", label: "Interactive 3D" },
        { to: "/career-quiz", label: "Take Career Quiz" },
        { to: "/compare-courses", label: "Course Comparison" },
        { to: "/colleges", label: "Top Indian Colleges" },
        { to: "/services", label: "Student Services" },
      ]
    },
    {
      title: "Company",
      links: [
        { to: "/about", label: "About Our Mission" },
        { to: "/contact", label: "Contact Support" },
        { to: "/", label: "Terms of Service" },
        { to: "/", label: "Privacy Policy" },
        { to: "/", label: "Disclaimer" },
      ]
    }
  ];

  return (
    <footer className="w-full bg-[#fdfdfd] border-t border-gray-100 pt-20 pb-10 mt-20 relative overflow-hidden">
      {/* Decorative Gradient Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 blur-[150px] -z-10 rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] -z-10 rounded-full"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-20">
          {/* Logo & About Section */}
          <div className="lg:col-span-2 space-y-8 pr-0 lg:pr-12">
            <Link to="/" className="flex items-center gap-3 text-2xl font-black tracking-tight text-gray-900 group">
              <div className="h-10 w-10 bg-gray-900 rounded-xl flex items-center justify-center text-white shadow-xl shadow-gray-200 transition-all group-hover:scale-105 group-hover:rotate-6">
                <Rocket size={20} fill="currentColor" />
              </div>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-500">
                FuturePath 3D
              </span>
            </Link>
            
            <p className="text-gray-500 text-lg leading-relaxed max-w-sm">
              Empowering Indian students with AI-driven insights and immersive 3D experiences to navigate their 12th+ career roadmap with absolute clarity.
            </p>

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 text-gray-600 group hover:text-primary transition-colors cursor-pointer">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Mail size={18} />
                </div>
                <span className="font-bold">support@futurepath3d.com</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600 group hover:text-primary transition-colors cursor-pointer">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Phone size={18} />
                </div>
                <span className="font-bold">+91 (800) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600 group hover:text-primary transition-colors cursor-pointer">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <MapPin size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold">Indira Nagar, Bangalore</span>
                  <span className="text-xs font-medium text-gray-400 uppercase tracking-widest leading-none mt-0.5">Corporate HQ, India</span>
                </div>
              </div>
            </div>
          </div>

          {/* Links Sections */}
          {footerSections.map((section) => (
            <div key={section.title} className="space-y-6">
              <h4 className="text-sm font-black uppercase tracking-[0.2em] text-gray-400">
                {section.title}
              </h4>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link 
                      to={link.to} 
                      className="text-gray-500 hover:text-gray-900 font-bold transition-all flex items-center group gap-2"
                    >
                      <ChevronRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8">
           <div className="flex flex-col items-center md:items-start gap-2">
              <p className="text-gray-500 text-sm font-medium">
                © {new Date().getFullYear()} FuturePath 3D Edutech Pvt. Ltd.
              </p>
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary/60">
                 Made with <Heart size={12} className="text-red-500 fill-red-500 animate-pulse" /> in India for the World
              </div>
           </div>

           <div className="flex gap-4">
             {[
               { icon: TwitterLogo, href: "#", label: "Twitter" },
               { icon: LinkedinLogo, href: "#", label: "LinkedIn" },
               { icon: YoutubeLogo, href: "#", label: "YouTube" },
               { icon: InstagramLogo, href: "#", label: "Instagram" }
             ].map((social) => (
               <a
                 key={social.label}
                 href={social.href}
                 className="h-12 w-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary hover:shadow-xl hover:shadow-primary/10 transition-all"
                 aria-label={social.label}
               >
                 <social.icon />
               </a>
             ))}
           </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
