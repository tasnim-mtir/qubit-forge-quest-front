import { useState } from "react";
import { Menu, X, Zap, LogOut, Shield, Gauge, User, Clock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useGetPendingCount } from "@/hooks/useRoleRequest";
import { RoleRequestDialog } from "@/components/RoleRequestDialog";

export function CreatorNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { data: pendingCount } = useGetPendingCount();

  const isAdmin = user?.role === "admin";
  const isCreator = user?.role === "creator";
  const isInvestor = user?.role === "investor";
  const isUser = user?.role === "user";

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="container px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Zap className="w-5 h-5 text-background" />
            </div>
            <span className="font-display font-bold text-xl text-foreground group-hover:text-primary transition-colors">
              QUBITIUM
            </span>
          </a>

          {/* Desktop nav - Profile and actions */}
          <div className="hidden md:flex items-center gap-4">
            {user && (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-slate-800/50 transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm text-slate-300 truncate max-w-[150px]">
                    {user.email}
                  </span>
                </button>

                {/* Profile Dropdown */}
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-700 rounded-lg shadow-xl py-2 z-50">
                    <div className="px-4 py-2 border-b border-slate-700">
                      <p className="text-xs text-slate-500">Signed in as</p>
                      <p className="text-sm font-semibold text-slate-200 truncate">{user.email}</p>
                      <p className="text-xs text-slate-400 mt-1 capitalize">
                        Role: <span className="text-blue-300 font-semibold">{user.role}</span>
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        navigate("/profile");
                        setProfileOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-800/50 flex items-center gap-2"
                    >
                      <User className="w-4 h-4" />
                      My Profile
                    </button>

                    {isAdmin && (
                      <button
                        onClick={() => {
                          navigate("/admin/dashboard");
                          setProfileOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-red-300 hover:bg-red-500/10 flex items-center gap-2"
                      >
                        <Shield className="w-4 h-4" />
                        Admin Dashboard
                      </button>
                    )}

                    {isCreator && (
                      <button
                        onClick={() => {
                          navigate("/creator/dashboard");
                          setProfileOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-blue-300 hover:bg-blue-500/10 flex items-center gap-2"
                      >
                        <Gauge className="w-4 h-4" />
                        Creator Dashboard
                      </button>
                    )}

                    {isInvestor && (
                      <button
                        onClick={() => {
                          navigate("/investor/dashboard");
                          setProfileOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-emerald-300 hover:bg-emerald-500/10 flex items-center gap-2"
                      >
                        <Gauge className="w-4 h-4" />
                        Investor Dashboard
                      </button>
                    )}

                    {isAdmin && pendingCount && pendingCount.pendingRequests > 0 && (
                      <button
                        onClick={() => {
                          navigate("/admin/role-requests");
                          setProfileOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-yellow-300 hover:bg-yellow-500/10 flex items-center gap-2 relative"
                      >
                        <Clock className="w-4 h-4" />
                        Pending Requests
                        <span className="ml-auto bg-yellow-500 text-xs text-slate-900 font-bold px-2 py-1 rounded-full">
                          {pendingCount.pendingRequests}
                        </span>
                      </button>
                    )}

                    {isUser && (
                      <button
                        onClick={() => {
                          setShowRoleDialog(true);
                          setProfileOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-emerald-300 hover:bg-emerald-500/10 flex items-center gap-2"
                      >
                        <Shield className="w-4 h-4" />
                        Request Role Access
                      </button>
                    )}

                    <div className="border-t border-slate-700 mt-2 pt-2">
                      <button
                        onClick={handleSignOut}
                        className="w-full px-4 py-2 text-left text-sm text-red-300 hover:bg-red-500/10 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-foreground"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile nav */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border/50">
            <div className="flex flex-col gap-4">
              {user && (
                <>
                  <button
                    onClick={() => {
                      navigate("/profile");
                      setIsOpen(false);
                    }}
                    className="text-left px-4 py-2 rounded-lg hover:bg-slate-800/50 text-slate-300 flex items-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    My Profile
                  </button>

                  {isAdmin && (
                    <button
                      onClick={() => {
                        navigate("/admin/dashboard");
                        setIsOpen(false);
                      }}
                      className="text-left px-4 py-2 rounded-lg hover:bg-red-500/10 text-red-300 flex items-center gap-2"
                    >
                      <Shield className="w-4 h-4" />
                      Admin Dashboard
                    </button>
                  )}

                  {isCreator && (
                    <button
                      onClick={() => {
                        navigate("/creator/dashboard");
                        setIsOpen(false);
                      }}
                      className="text-left px-4 py-2 rounded-lg hover:bg-blue-500/10 text-blue-300 flex items-center gap-2"
                    >
                      <Gauge className="w-4 h-4" />
                      Creator Dashboard
                    </button>
                  )}

                  {isInvestor && (
                    <button
                      onClick={() => {
                        navigate("/investor/dashboard");
                        setIsOpen(false);
                      }}
                      className="text-left px-4 py-2 rounded-lg hover:bg-emerald-500/10 text-emerald-300 flex items-center gap-2"
                    >
                      <Gauge className="w-4 h-4" />
                      Investor Dashboard
                    </button>
                  )}

                  {isAdmin && pendingCount && pendingCount.pendingRequests > 0 && (
                    <button
                      onClick={() => {
                        navigate("/admin/role-requests");
                        setIsOpen(false);
                      }}
                      className="text-left px-4 py-2 rounded-lg hover:bg-yellow-500/10 text-yellow-300 flex items-center gap-2"
                    >
                      <Clock className="w-4 h-4" />
                      Pending Requests
                      <span className="ml-auto bg-yellow-500 text-xs text-slate-900 font-bold px-2 py-1 rounded-full">
                        {pendingCount.pendingRequests}
                      </span>
                    </button>
                  )}

                  {isUser && (
                    <button
                      onClick={() => {
                        setShowRoleDialog(true);
                        setIsOpen(false);
                      }}
                      className="text-left px-4 py-2 rounded-lg hover:bg-emerald-500/10 text-emerald-300 flex items-center gap-2"
                    >
                      <Shield className="w-4 h-4" />
                      Request Role Access
                    </button>
                  )}

                  <button
                    onClick={handleSignOut}
                    className="text-left px-4 py-2 rounded-lg hover:bg-red-500/10 text-red-300 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Role Request Dialog */}
      <RoleRequestDialog
        open={showRoleDialog}
        onOpenChange={setShowRoleDialog}
      />
    </nav>
  );
}