# CareerCompass 🚀
### The Next-Generation AI-Powered Career Platform

**CareerCompass** is a premium, all-in-one career guidance ecosystem designed specifically for students in India (and beyond). By combining interactive stream exploration with state-of-the-art AI career tools, it helps students transition from school to a professional career with clarity.

---

## 🔥 Key Features

### 🧠 AI Career Suite (Cloud & Local)
Our platform integrates a comprehensive suite of AI tools powered by **Google Gemini 1.5 Flash** or **Locally Hosted Ollama**:
- **🛤️ AI Roadmap Generator**: Get a structured, 10-module learning path for any career (e.g., AI Engineer, Data Scientist). Track your progress in real-time.
- **📄 AI Resume Builder**: Create professional, ATS-optimized resumes in minutes.
- **✉️ AI Cover Letter Generator**: Draft highly personalized cover letters tailored to specific job descriptions.
- **💬 PathShala AI Chatbot**: Your persistent career companion for stream selection, college advice, and industry trends.
- **💻 Local AI Mode**: Run everything locally using **Ollama (Llama 3.2)** for maximum privacy and zero cost.

### 🌐 Career Exploration
- **🏛️ Stream Navigator**: Interactive exploration of Engineering, Medical, Arts, Science, Commerce, Law, Agriculture, and more.
- **⚡ Career Quiz**: A data-driven engine that recommends the top 3 streams based on your temperament and skills.
- **🏫 College Catalog**: Detailed insights into departments, courses, and placement opportunities (currently focused on Indian institutions).
- **🛡️ Mentor Marketplace**: Connect with industry experts for one-on-one sessions.
- **💼 Mock Interviews**: Industry-specific practice sessions to sharpen your job readiness.

### 🍱 Modern Tech Stack
- **Frontend**: React 18, TypeScript, Vite.
- **Styling**: Vanilla CSS + Tailwind, Framer Motion for premium animations, Shadcn UI components.
- **Backend/Storage**: Firebase (Firestore for data persistence, Auth for secure login).
- **AI Models**: Google Gemini 1.5, Ollama (Llama 3.2).

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Firebase Account (for data storage)
- Google Gemini API Key (Optional, for Cloud AI)
- Ollama (Optional, for Local AI)

### Installation
1. **Clone the repository:**
   ```bash
   git clone https://github.com/jayeshpandey01/atish_project.git
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Configure Environment Variables:**
   Create a `.env` file in the root with your credentials:
   ```env
   VITE_FIREBASE_API_KEY="..."
   VITE_FIREBASE_AUTH_DOMAIN="..."
   VITE_GEMINI_API_KEY="..."
   VITE_USE_LOCAL_AI=true # Set to true for Ollama
   VITE_OLLAMA_URL="http://localhost:11434/api/generate"
   ```
4. **Run the development server:**
   ```bash
   npm run dev
   ```

---

## 🛠️ Local AI Setup (Ollama)
To run the career platform without an internet connection or API keys:
1. **Download Ollama** at [ollama.com](https://ollama.com).
2. **Pull the model:**
   ```bash
   ollama pull llama3.2
   ```
3. **Allow CORS** (Required for browser access):
   - **Windows (PowerShell):**
     `[System.Environment]::SetEnvironmentVariable('OLLAMA_ORIGINS', '*', 'User')`
4. **Restart Ollama** and the CareerCompass server.

---

## 🌍 Localization & Indian Context
CareerCompass is optimized for the Indian academic landscape:
- Includes regional exams (NEET, JEE, UPSC).
- Specialized filters for Indian departments and streams.
- Localized footer with "Made in India" branding and corporate links.

---

## 🤝 Contributing
Contributions are welcome! If you have ideas for new career modules or AI features, feel free to open a Pull Request.

---

## 📄 License & Credits
Developed with ❤️ by **Jayesh Pandey**.  
*Based on the original Pathshala-AI concept.*

---

## ⭐ Support
If you like this project, give it a ⭐ on GitHub!