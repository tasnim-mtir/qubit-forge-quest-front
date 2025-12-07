import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Call backend admin login endpoint
      const response = await fetch(`${API_URL}/api/auth/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      // Check both response.ok and success flag
      if (response.ok && data.success) {
        // Verify user has admin role (double-check security)
        if (data.user.role !== "admin") {
          toast({
            title: "Access denied",
            description: "Only admin users can access this panel",
            variant: "destructive",
          });
          return;
        }

        // Store token without Bearer prefix (will be added in API calls)
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        toast({
          title: "Login successful",
          description: "Welcome to the admin dashboard",
        });

        navigate("/admin/users");
      } else {
        // Handle error response
        toast({
          title: "Login failed",
          description: data.message || "Invalid credentials",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Error",
        description: "Failed to connect to server. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center px-4">
      {/* Grid background effect */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(0deg, transparent 24%, rgba(59, 130, 246, 0.5) 25%, rgba(59, 130, 246, 0.5) 26%, transparent 27%, transparent 74%, rgba(59, 130, 246, 0.5) 75%, rgba(59, 130, 246, 0.5) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(59, 130, 246, 0.5) 25%, rgba(59, 130, 246, 0.5) 26%, transparent 27%, transparent 74%, rgba(59, 130, 246, 0.5) 75%, rgba(59, 130, 246, 0.5) 76%, transparent 77%, transparent)",
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl mb-4 shadow-lg shadow-blue-500/50">
            <span className="text-3xl font-display font-bold text-white">Q</span>
          </div>
          <h1 className="text-4xl font-display font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
            QUBITIUM
          </h1>
          <p className="text-slate-400">Admin Portal</p>
        </div>

        {/* Login Card */}
        <div className="bg-gradient-to-b from-slate-900/80 to-slate-950/90 border border-blue-500/30 rounded-2xl p-8 backdrop-blur-xl shadow-2xl shadow-blue-500/20">
          <h2 className="text-2xl font-display font-bold text-white mb-2">
            Admin Login
          </h2>
          <p className="text-slate-400 text-sm mb-8">
            Enter your credentials to access the admin dashboard
          </p>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm text-slate-300 mb-2 font-medium">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@qubitium.io"
                className="w-full px-4 py-3 bg-slate-900/50 border border-blue-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm text-slate-300 mb-2 font-medium">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-slate-900/50 border border-blue-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all"
                required
              />
            </div>

            {/* Demo Credentials Notice */}
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
              <p className="text-xs text-amber-300">
                <span className="font-semibold">⚠️ Note:</span>
                <br />
                Enter credentials for an admin user from the database.
              </p>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-display font-bold rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  <span>🔐</span> Enter Admin Panel
                </>
              )}
            </button>

            {/* Back Link */}
            <div className="text-center">
              <a
                href="/"
                className="text-sm text-slate-400 hover:text-blue-300 transition-colors"
              >
                ← Back to Home
              </a>
            </div>
          </form>
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-center text-xs text-slate-500 px-4">
          <p>
            ⚠️ This is a secure admin area. Unauthorized access is prohibited.
          </p>
        </div>
      </div>
    </div>
  );
}
