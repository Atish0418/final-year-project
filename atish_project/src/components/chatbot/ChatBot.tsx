import { useState, useRef, useEffect, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Loader2,
  ChevronDown,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { cn } from "../../utils/cn";

/* ──────────────────── types ──────────────────── */
type MessageType = "text" | "tree_image" | "follow_up_questions";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  type: MessageType;
  content: string | string[];
  timestamp: Date;
}

/* ── quick-suggestion chips shown before first message ── */
const SUGGESTIONS = [
  "What career options are available after 12th?",
  "Tell me about engineering careers",
  "What are the best career paths in commerce?",
  "How to prepare for government exams?",
];

const API_URL = "http://127.0.0.1:5000/ask";

/* ──────────────────── component ──────────────────── */
const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const sessionId = useRef(crypto.randomUUID());

  /* auto-scroll to latest message */
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, loading]);

  /* focus input when chat opens */
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  /* ── send message ── */
  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      type: "text",
      content: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Session-Id": sessionId.current,
        },
        body: JSON.stringify({ query: text.trim() }),
      });

      if (!res.ok) throw new Error("Backend error");

      const data = await res.json();

      /* main text response */
      const botMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        type: "text",
        content: data.response ?? "Sorry, I couldn't process that.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);

      /* tree image */
      if (data.tree_image) {
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            type: "tree_image",
            content: data.tree_image,
            timestamp: new Date(),
          },
        ]);
      }

      /* follow-up questions */
      const followUps =
        data.json_response?.followUpQuestions ?? data.json_response?.follow_up_questions;
      if (followUps?.length) {
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            type: "follow_up_questions",
            content: followUps,
            timestamp: new Date(),
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          type: "text",
          content:
            "⚠️ Unable to reach the career advisor right now. Please make sure the backend server is running on port 5000.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  /* ── render individual message bubble ── */
  const renderMessage = (msg: ChatMessage) => {
    const isUser = msg.role === "user";

    if (msg.type === "tree_image") {
      return (
        <div key={msg.id} className="flex justify-start mb-4">
          <div className="max-w-[90%] rounded-2xl overflow-auto bg-gray-50 border border-gray-100 p-3">
            <p className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold mb-2">
              Career Path Tree
            </p>
            <img
              src={`data:image/png;base64,${msg.content}`}
              alt="Career path tree"
              className="max-w-none rounded-xl"
            />
          </div>
        </div>
      );
    }

    if (msg.type === "follow_up_questions" && Array.isArray(msg.content)) {
      return (
        <div key={msg.id} className="flex justify-start mb-4">
          <div className="max-w-[85%] space-y-2">
            <p className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold">
              Suggested questions
            </p>
            <div className="flex flex-wrap gap-2">
              {msg.content.map((q, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(q)}
                  className="text-xs px-3.5 py-2 rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all duration-200 cursor-pointer text-left leading-snug"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        key={msg.id}
        className={cn("flex mb-4", isUser ? "justify-end" : "justify-start")}
      >
        {/* avatar */}
        {!isUser && (
          <div className="shrink-0 mr-2.5 mt-1">
            <div className="w-7 h-7 rounded-full bg-gray-900 flex items-center justify-center shadow-sm">
              <Bot size={14} className="text-white" />
            </div>
          </div>
        )}

        <div
          className={cn(
            "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap break-words",
            isUser
              ? "bg-gray-900 text-white rounded-br-md"
              : "bg-gray-50 text-gray-800 border border-gray-100 rounded-bl-md"
          )}
        >
          {msg.content as string}
        </div>

        {isUser && (
          <div className="shrink-0 ml-2.5 mt-1">
            <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center">
              <User size={14} className="text-gray-600" />
            </div>
          </div>
        )}
      </div>
    );
  };

  /* ── main render ── */
  return (
    <>
      {/* ── Floating trigger button ── */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 z-[9999] w-14 h-14 rounded-full bg-gray-900 text-white shadow-[0_8px_30px_-4px_rgba(0,0,0,0.3)] flex items-center justify-center hover:bg-gray-800 transition-colors cursor-pointer group"
            aria-label="Open career chatbot"
            id="chatbot-trigger"
          >
            <MessageCircle size={22} className="group-hover:hidden" />
            <Sparkles size={22} className="hidden group-hover:block" />
            {/* notification dot */}
            <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-white animate-pulse" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Chat window ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className={cn(
              "fixed z-[9999] flex flex-col bg-white border border-gray-200 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.15)] overflow-hidden",
              expanded
                ? "inset-4 sm:inset-6 rounded-[2rem]"
                : "bottom-6 right-6 w-[400px] max-w-[calc(100vw-48px)] h-[600px] max-h-[calc(100vh-48px)] rounded-[1.5rem] sm:rounded-[2rem]"
            )}
            id="chatbot-window"
          >
            {/* ── Header ── */}
            <div className="shrink-0 flex items-center justify-between px-5 py-4 bg-gray-900 text-white">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/10 backdrop-blur flex items-center justify-center">
                  <Sparkles size={18} className="text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold leading-tight">
                    CareerCompass AI
                  </h3>
                  <p className="text-[11px] text-gray-400 leading-tight">
                    {loading ? "Thinking..." : "Online • Ready to help"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setExpanded((v) => !v)}
                  className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer"
                  aria-label={expanded ? "Minimize chat" : "Expand chat"}
                >
                  {expanded ? (
                    <Minimize2 size={15} />
                  ) : (
                    <Maximize2 size={15} />
                  )}
                </button>
                <button
                  onClick={() => {
                    setOpen(false);
                    setExpanded(false);
                  }}
                  className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer"
                  aria-label="Close chat"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* ── Messages area ── */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-5 py-5 scroll-smooth"
              style={{ scrollbarWidth: "thin", scrollbarColor: "#d1d5db transparent" }}
            >
              {/* welcome state */}
              {messages.length === 0 && !loading && (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-5 py-8">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                    <Sparkles size={28} className="text-gray-900" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">
                      Hi! I'm CareerCompass 🎓
                    </h4>
                    <p className="text-sm text-gray-500 mt-1 max-w-[260px]">
                      Your AI-powered career guidance assistant. Ask me anything
                      about career paths after 10th or 12th!
                    </p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-2 px-2 max-w-[340px]">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => sendMessage(s)}
                        className="text-xs px-3.5 py-2 rounded-full border border-gray-200 bg-white text-gray-600 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all duration-200 cursor-pointer text-left leading-snug"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* messages */}
              {messages.map(renderMessage)}

              {/* typing indicator */}
              {loading && (
                <div className="flex items-start mb-4">
                  <div className="shrink-0 mr-2.5 mt-1">
                    <div className="w-7 h-7 rounded-full bg-gray-900 flex items-center justify-center shadow-sm">
                      <Bot size={14} className="text-white" />
                    </div>
                  </div>
                  <div className="bg-gray-50 border border-gray-100 rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-2">
                    <Loader2 size={14} className="animate-spin text-gray-400" />
                    <span className="text-xs text-gray-400">
                      Analyzing your query…
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* ── Scroll-down pill ── */}
            {messages.length > 4 && (
              <button
                onClick={() =>
                  scrollRef.current?.scrollTo({
                    top: scrollRef.current.scrollHeight,
                    behavior: "smooth",
                  })
                }
                className="absolute bottom-20 left-1/2 -translate-x-1/2 h-7 px-3 flex items-center gap-1 rounded-full bg-white/90 border border-gray-200 backdrop-blur text-gray-500 text-xs font-medium shadow-sm hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <ChevronDown size={12} /> Latest
              </button>
            )}

            {/* ── Input bar ── */}
            <form
              onSubmit={handleSubmit}
              className="shrink-0 flex items-center gap-2 px-4 py-3 border-t border-gray-100 bg-white"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about career paths…"
                disabled={loading}
                className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 disabled:opacity-50 transition-all"
                id="chatbot-input"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className={cn(
                  "shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer",
                  input.trim() && !loading
                    ? "bg-gray-900 text-white hover:bg-gray-800 shadow-sm"
                    : "bg-gray-100 text-gray-300 cursor-not-allowed"
                )}
                aria-label="Send message"
                id="chatbot-send"
              >
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;
