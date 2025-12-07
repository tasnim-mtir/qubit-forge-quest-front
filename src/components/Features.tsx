import { Layers, Cpu, Wallet, BarChart3, Shield, Zap } from "lucide-react";

const features = [
  {
    icon: Wallet,
    title: "Token Staking",
    description: "Stake your QUBIC tokens to earn passive rewards while securing the network. Flexible lock periods with competitive APY rates.",
    gradient: "from-primary/20 to-primary/5",
  },
  {
    icon: Cpu,
    title: "Compute Jobs",
    description: "Create and distribute computational tasks across the network. Pay only for the resources you use with transparent pricing.",
    gradient: "from-accent/20 to-accent/5",
  },
  {
    icon: BarChart3,
    title: "Real-time Dashboard",
    description: "Monitor your staking rewards, job status, and network statistics with our comprehensive analytics dashboard.",
    gradient: "from-primary/20 to-accent/10",
  },
  {
    icon: Shield,
    title: "Quantum Resistant",
    description: "Built on Qubic's quantum-resistant architecture ensuring long-term security for your assets and computations.",
    gradient: "from-accent/20 to-primary/10",
  },
  {
    icon: Layers,
    title: "Smart Contracts",
    description: "Leverage powerful smart contracts written in Rust for complex DeFi operations and automated workflows.",
    gradient: "from-primary/20 to-primary/5",
  },
  {
    icon: Zap,
    title: "Instant Settlement",
    description: "Experience near-instant transaction finality with Qubic's unique consensus mechanism. No more waiting.",
    gradient: "from-accent/20 to-accent/5",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-24 relative bg-secondary/30">
      <div className="container px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              Platform Features
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Powerful <span className="gradient-text">Features</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to stake, compute, and earn in the Qubic ecosystem.
            </p>
          </div>

          {/* Features grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="group relative rounded-2xl border border-border bg-card p-8 hover:glow-border transition-all duration-500"
              >
                {/* Gradient background */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-7 h-7 text-primary" />
                  </div>
                  
                  <h3 className="text-xl font-display font-semibold mb-3 text-foreground">
                    {feature.title}
                  </h3>
                  
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
