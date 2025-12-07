import { Users, Zap, TrendingUp } from "lucide-react";
import type { UserStats } from "@/services/adminAPI";

interface StatsCardsProps {
  stats: UserStats | null;
  isLoading: boolean;
}

export function StatsCards({ stats, isLoading }: StatsCardsProps) {
  const cardData = [
    {
      label: "Total Users",
      value: stats?.totalUsers ?? 0,
      icon: Users,
      color: "from-blue-500/20 to-blue-600/20",
      borderColor: "border-blue-500/30",
      textColor: "text-blue-300",
      dotColor: "bg-blue-500",
    },
    {
      label: "Creators",
      value: stats?.creators ?? 0,
      icon: Zap,
      color: "from-purple-500/20 to-purple-600/20",
      borderColor: "border-purple-500/30",
      textColor: "text-purple-300",
      dotColor: "bg-purple-500",
    },
    {
      label: "Investors",
      value: stats?.investors ?? 0,
      icon: TrendingUp,
      color: "from-emerald-500/20 to-emerald-600/20",
      borderColor: "border-emerald-500/30",
      textColor: "text-emerald-300",
      dotColor: "bg-emerald-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {cardData.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className={`bg-gradient-to-br ${card.color} border ${card.borderColor} rounded-lg p-6 backdrop-blur-sm transition-all hover:border-blue-500/50`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-slate-400 text-sm font-medium mb-2">{card.label}</p>
                <p className={`text-3xl font-bold ${card.textColor}`}>
                  {isLoading ? (
                    <span className="text-slate-500 animate-pulse">...</span>
                  ) : (
                    card.value.toLocaleString()
                  )}
                </p>
              </div>
              <div className={`p-3 rounded-lg bg-slate-900/50 border ${card.borderColor}`}>
                <Icon className={`w-5 h-5 ${card.textColor}`} />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${card.dotColor} animate-pulse`}></span>
              <span className="text-xs text-slate-400">Live</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
