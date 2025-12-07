import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Zap, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { z } from "zod";

const authSchema = z.object({
  email: z.string().trim().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // ---------------------------------------------
  // 🔐 USE EFFECT – HANDLE GOOGLE CALLBACK + AUTO-LOGIN
  // ---------------------------------------------
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenFromUrl = params.get("token");
    const userParam = params.get("user");

    // 🟦 CASE 1 — coming back from Google OAuth with token
    if (tokenFromUrl && userParam) {
      let parsedUser: any = null;

      try {
        parsedUser = JSON.parse(decodeURIComponent(userParam));
      } catch (err) {
        parsedUser = userParam;
      }

      localStorage.setItem("token", tokenFromUrl);
      localStorage.setItem("user", JSON.stringify(parsedUser));

      // Welcome toast (safe)
      try {
        toast({
          title: "Welcome!",
          description: "Successfully authenticated with Google.",
        });
      } catch {}

      // Clean URL
      window.history.replaceState({}, "", "/");

      // 👉 Navigate to main page WITHOUT reload
      navigate("/", { replace: true });
      return;
    }

    // 🟩 CASE 2 — already logged in from before
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      navigate("/", { replace: true });
      return;
    }

    // 🟥 CASE 3 — not logged in → show page
    setCheckingAuth(false);
  }, [location.search, navigate, toast]);

  // ---------------------------------------------
  // 🔵 GOOGLE SIGN-IN (REDIRECT FLOW)
  // ---------------------------------------------
  const handleGoogleLogin = () => {
    setGoogleLoading(true);
    window.location.href = `${API_URL}/api/auth/google`;
  };

  // ---------------------------------------------
  // ✉ EMAIL/PASSWORD LOGIN OR REGISTER
  // ---------------------------------------------
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = authSchema.safeParse({ email, password });
    if (!validation.success) {
      toast({
        title: "Validation Error",
        description: validation.error.errors[0].message,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const endpoint = isLogin ? "login" : "register";

      const response = await fetch(`${API_URL}/api/auth/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Authentication failed");

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      toast({
        title: isLogin ? "Welcome back!" : "Account created!",
        description: "Successfully authenticated.",
      });

      navigate("/", { replace: true });
    } catch (error: any) {
      toast({
        title: "Authentication Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------
  // LOADING WHILE CHECKING AUTH STATE
  // ---------------------------------------------
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // ---------------------------------------------
  // MAIN UI
  // ---------------------------------------------
  return (
    <div className="min-h-screen bg-background hero-gradient cyber-grid flex items-center justify-center p-4">
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl floating" />
      <div
        className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl floating"
        style={{ animationDelay: "-3s" }}
      />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Zap className="w-7 h-7 text-background" />
          </div>
          <span className="font-display font-bold text-3xl text-foreground">QUBITIUM</span>
        </div>

        {/* Auth Card */}
        <div className="glow-box rounded-2xl border border-border bg-card/80 backdrop-blur-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-display font-bold text-foreground mb-2">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-muted-foreground">
              {isLogin ? "Sign in to access your dashboard" : "Join Qubitium and start earning"}
            </p>
          </div>

          {/* GOOGLE LOGIN */}
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="w-full mb-6 border-border hover:bg-secondary/50 py-6"
          >
            {googleLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </>
            )}
          </Button>

          {/* EMAIL / PASSWORD FORM */}
          <form onSubmit={handleAuth} className="space-y-6">
            <div className="space-y-2">
              <Label>Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-secondary border-border"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-secondary border-border"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground btn-glow font-display text-lg py-6"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {isLogin ? "Sign In" : "Create Account"}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </>
              )}
            </Button>
          </form>

          {/* SWITCH LOGIN / SIGNUP */}
          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-muted-foreground hover:text-primary"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Built for Qubic Hackathon 2026
        </p>
      </div>
    </div>
  );
};

export default Auth;
