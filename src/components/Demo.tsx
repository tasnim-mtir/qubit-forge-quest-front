import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Coins, Clock, CheckCircle2 } from "lucide-react";

const stakingData = [
  { month: "Jan", value: 1200 },
  { month: "Feb", value: 1900 },
  { month: "Mar", value: 2400 },
  { month: "Apr", value: 3100 },
  { month: "May", value: 2800 },
  { month: "Jun", value: 3600 },
  { month: "Jul", value: 4200 },
];

const allocationData = [
  { name: "Staked", value: 45, color: "hsl(187, 100%, 50%)" },
  { name: "Rewards", value: 25, color: "hsl(270, 70%, 60%)" },
  { name: "Available", value: 30, color: "hsl(222, 30%, 25%)" },
];

const recentJobs = [
  { id: "JOB-001", type: "ML Training", status: "completed", reward: "125 QUBIC" },
  { id: "JOB-002", type: "Data Processing", status: "running", reward: "89 QUBIC" },
  { id: "JOB-003", type: "Rendering", status: "pending", reward: "210 QUBIC" },
];

const Demo = () => {
  const [activeTab, setActiveTab] = useState<"staking" | "jobs">("staking");

  return (
    <section id="demo" className="py-24 relative">
      <div className="container px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
              Live Dashboard
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Interactive <span className="gradient-text">Demo</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience our platform's powerful features with this interactive preview.
            </p>
          </div>

          {/* Tab buttons */}
          <div className="flex justify-center gap-4 mb-8">
            <Button
              variant={activeTab === "staking" ? "default" : "outline"}
              onClick={() => setActiveTab("staking")}
              className={activeTab === "staking" ? "bg-primary text-primary-foreground" : "border-border"}
            >
              Staking Dashboard
            </Button>
            <Button
              variant={activeTab === "jobs" ? "default" : "outline"}
              onClick={() => setActiveTab("jobs")}
              className={activeTab === "jobs" ? "bg-primary text-primary-foreground" : "border-border"}
            >
              Job Management
            </Button>
          </div>

          {/* Dashboard mockup */}
          <div className="glow-box rounded-2xl border border-border bg-card p-6 md:p-8">
            {activeTab === "staking" ? (
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Stats cards */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="rounded-xl bg-secondary/50 p-4 border border-border">
                      <div className="flex items-center gap-2 text-muted-foreground mb-2">
                        <Coins className="w-4 h-4" />
                        <span className="text-xs">Total Staked</span>
                      </div>
                      <p className="text-2xl font-display font-bold text-foreground">4,250</p>
                      <p className="text-xs text-primary">QUBIC</p>
                    </div>
                    <div className="rounded-xl bg-secondary/50 p-4 border border-border">
                      <div className="flex items-center gap-2 text-muted-foreground mb-2">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-xs">APY</span>
                      </div>
                      <p className="text-2xl font-display font-bold text-primary">12.5%</p>
                      <p className="text-xs text-muted-foreground">Annual</p>
                    </div>
                    <div className="rounded-xl bg-secondary/50 p-4 border border-border">
                      <div className="flex items-center gap-2 text-muted-foreground mb-2">
                        <Clock className="w-4 h-4" />
                        <span className="text-xs">Lock Period</span>
                      </div>
                      <p className="text-2xl font-display font-bold text-foreground">30</p>
                      <p className="text-xs text-muted-foreground">Days</p>
                    </div>
                    <div className="rounded-xl bg-secondary/50 p-4 border border-border">
                      <div className="flex items-center gap-2 text-muted-foreground mb-2">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="text-xs">Rewards</span>
                      </div>
                      <p className="text-2xl font-display font-bold text-accent">892</p>
                      <p className="text-xs text-accent">QUBIC</p>
                    </div>
                  </div>

                  {/* Chart */}
                  <div className="rounded-xl bg-secondary/30 p-4 border border-border">
                    <h4 className="font-display font-semibold mb-4">Staking Performance</h4>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={stakingData}>
                          <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="hsl(187, 100%, 50%)" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="hsl(187, 100%, 50%)" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" />
                          <XAxis dataKey="month" stroke="hsl(215, 20%, 65%)" fontSize={12} />
                          <YAxis stroke="hsl(215, 20%, 65%)" fontSize={12} />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: "hsl(222, 47%, 8%)", 
                              border: "1px solid hsl(222, 30%, 18%)",
                              borderRadius: "8px"
                            }}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="value" 
                            stroke="hsl(187, 100%, 50%)" 
                            fillOpacity={1} 
                            fill="url(#colorValue)" 
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Allocation chart */}
                <div className="rounded-xl bg-secondary/30 p-4 border border-border">
                  <h4 className="font-display font-semibold mb-4">Token Allocation</h4>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={allocationData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={70}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {allocationData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-2 mt-4">
                    {allocationData.map((item) => (
                      <div key={item.name} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-muted-foreground">{item.name}</span>
                        </div>
                        <span className="font-medium">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Job creation form mockup */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="rounded-xl bg-secondary/30 p-6 border border-border">
                    <h4 className="font-display font-semibold mb-4">Create New Job</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-muted-foreground mb-2 block">Job Type</label>
                        <select className="w-full rounded-lg bg-secondary border border-border px-4 py-2.5 text-foreground">
                          <option>ML Training</option>
                          <option>Data Processing</option>
                          <option>Rendering</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground mb-2 block">Budget (QUBIC)</label>
                        <input 
                          type="number" 
                          placeholder="100" 
                          className="w-full rounded-lg bg-secondary border border-border px-4 py-2.5 text-foreground placeholder:text-muted-foreground"
                        />
                      </div>
                      <Button className="w-full bg-primary text-primary-foreground btn-glow">
                        Submit Job
                      </Button>
                    </div>
                  </div>

                  {/* Recent jobs */}
                  <div className="rounded-xl bg-secondary/30 p-6 border border-border">
                    <h4 className="font-display font-semibold mb-4">Recent Jobs</h4>
                    <div className="space-y-3">
                      {recentJobs.map((job) => (
                        <div key={job.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border">
                          <div>
                            <p className="font-medium text-sm">{job.id}</p>
                            <p className="text-xs text-muted-foreground">{job.type}</p>
                          </div>
                          <div className="text-right">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              job.status === "completed" 
                                ? "bg-primary/20 text-primary" 
                                : job.status === "running"
                                ? "bg-accent/20 text-accent"
                                : "bg-muted text-muted-foreground"
                            }`}>
                              {job.status}
                            </span>
                            <p className="text-xs text-muted-foreground mt-1">{job.reward}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Demo;
