import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export function AdminSidebar() {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(true);

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: "📊",
    },
   

    {
      name: "User Management",
      path: "/admin/users",
      icon: "👥",
    },
    {
      name: "Pending Requests",
      path: "/admin/role-requests",
      icon: "📋",
    },
   
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    signOut();
  };

  // Get first letter of email for avatar
  const getInitial = (email?: string) => {
    if (!email) return "A";
    return email.charAt(0).toUpperCase();
  };

  return (
    <div
      className={`${
        isOpen ? "w-64" : "w-20"
      } bg-gradient-to-b from-slate-900/80 to-slate-950/90 border-r border-blue-500/20 backdrop-blur-xl transition-all duration-300 flex flex-col h-screen sticky top-0`}
    >
      {/* Logo */}
      <div className="p-6 border-b border-blue-500/20 flex items-center justify-between">
        <div
          className={`flex items-center gap-3 transition-all ${isOpen ? "opacity-100" : "opacity-0 hidden"}`}
        >
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
            Q
          </div>
          <span className="text-lg font-display font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Qubitium
          </span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 hover:bg-slate-800/50 rounded transition-all"
        >
          <svg
            className="w-5 h-5 text-blue-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isOpen ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
            />
          </svg>
        </button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 px-3 py-6 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all group ${
              isActive(item.path)
                ? "bg-gradient-to-r from-blue-600/40 to-purple-600/40 border border-blue-500/50 text-blue-300"
                : "text-slate-400 hover:text-slate-300 hover:bg-slate-800/30"
            }`}
          >
            <span className="text-xl w-6 text-center">{item.icon}</span>
            <span className={`text-sm font-medium ${isOpen ? "opacity-100" : "opacity-0 hidden"}`}>
              {item.name}
            </span>
            {isActive(item.path) && isOpen && (
              <div className="ml-auto w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
            )}
          </Link>
        ))}
      </nav>

      {/* Admin Info - Dynamic from Auth Context */}
      <div
        className={`border-t border-blue-500/20 p-4 ${
          isOpen ? "block" : "hidden"
        }`}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
            {getInitial(user?.email)}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user?.email?.split("@")[0] || "Admin"}
            </p>
            <p className="text-xs text-slate-400 truncate">{user?.email || "admin@qubitium.io"}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm rounded border border-red-500/30 transition-all"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
