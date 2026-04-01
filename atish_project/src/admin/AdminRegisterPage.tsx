import { type FormEvent, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { ArrowLeft, Rocket } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { Seo } from "../components/seo/Seo";

const AdminRegisterPage = () => {
  const auth = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLocalError("");
    
    if (password !== confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }
    await auth.signUp(email, password);
  };

  const onGoogleSignIn = async () => {
    await auth.signInWithGoogle();
  };

  useEffect(() => {
    if (auth.user) {
      if (auth.user.email?.toLowerCase() === "admin@career.com") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    }
  }, [auth.user, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-10 px-4 bg-[#D5D3C8] relative">
      <Seo
        title="Register | FuturePath 3D"
        description="Create your FuturePath 3D account."
        canonicalPath="/admin/register"
        noIndex
      />
      
      <div className="absolute inset-0 grid-overlay opacity-30 pointer-events-none" />

      <div className="relative w-full max-w-md bg-white rounded-[2rem] shadow-card p-8 sm:p-10 border border-gray-100 mb-8 z-10">
        
        <button 
          onClick={handleBack}
          className="absolute top-6 left-6 p-2 rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft size={16} />
        </button>

        <div className="flex flex-col items-center text-center mt-6 mb-8">
          <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mb-4">
            <Rocket size={24} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
          <p className="text-gray-500 text-sm mt-2">Join FuturePath 3D to get started</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
              Email
            </label>
            <input
              type="email"
              required
              className="w-full h-11 rounded-full border border-gray-200 bg-gray-50 px-4 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@futurepath.com"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
              Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              className="w-full h-11 rounded-full border border-gray-200 bg-gray-50 px-4 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
              Confirm Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              className="w-full h-11 rounded-full border border-gray-200 bg-gray-50 px-4 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          
          {(localError || auth.error) ? (
            <div className="text-xs text-red-500 font-medium text-center">
              {localError || auth.error}
            </div>
          ) : null}
          
          <Button type="submit" className="w-full mt-2" disabled={auth.loading}>
            {auth.loading ? "Creating account..." : "Create Account"}
          </Button>
        </form>

        <div className="mt-8 relative flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
             <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative bg-white px-4 text-xs text-gray-500 uppercase font-medium">
             Or connect with
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <Button 
            type="button" 
            variant="outline" 
            className="w-full flex items-center justify-center gap-3 py-2.5 h-auto text-sm"
            onClick={onGoogleSignIn}
            disabled={auth.loading}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              <path d="M1 1h22v22H1z" fill="none"/>
            </svg>
            Google
          </Button>
          
          <div className="text-center text-sm text-gray-500">
            Already have an account? <Link to="/admin/login" className="text-black font-semibold hover:underline">Sign in</Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminRegisterPage;
