import { Outlet, ScrollRestoration } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { PageTransition } from "../components/ui/PageTransition";
import { useAuthStore } from "../store/useAuthStore";
import ChatBot from "../components/chatbot/ChatBot";

const MainLayout = () => {
  const auth = useAuthStore();

  useEffect(() => {
    auth.init();
    // run once on mount
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col items-center py-4 sm:py-6 lg:py-8 bg-[#D5D3C8] text-neutral-900 relative">
      <div className="absolute inset-0 grid-overlay opacity-30 pointer-events-none" />

      <div className="relative flex flex-col w-full max-w-[1400px] bg-white mx-auto min-h-[90vh] rounded-[2rem] sm:rounded-[2.5rem] shadow-card overflow-x-hidden border border-white/40">
        <Navbar />
        <main className="flex-1 overflow-x-hidden">
          <PageTransition>
            <Outlet />
          </PageTransition>
        </main>
        <Footer />
      </div>
      <ScrollRestoration />
      <ChatBot />
    </div>
  );
};

export default MainLayout;
