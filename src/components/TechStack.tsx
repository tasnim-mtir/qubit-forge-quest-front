import { Code2, Database, Globe, Lock, Server, Boxes } from "lucide-react";

const technologies = [
  {
    name: "Qubic",
    description: "Quantum-resistant blockchain",
    icon: Boxes,
    color: "text-primary",
  },
  {
    name: "Rust",
    description: "Smart contract development",
    icon: Code2,
    color: "text-accent",
  },
  {
    name: "EasyConnect",
    description: "Wallet integration SDK",
    icon: Lock,
    color: "text-primary",
  },
  {
    name: "React",
    description: "Frontend framework",
    icon: Globe,
    color: "text-accent",
  },
  {
    name: "TypeScript",
    description: "Type-safe development",
    icon: Code2,
    color: "text-primary",
  },
  {
    name: "Tailwind CSS",
    description: "Utility-first styling",
    icon: Server,
    color: "text-accent",
  },
];

const TechStack = () => {
  return (
    <section id="tech" className="py-24 relative bg-secondary/30">
      <div className="container px-4">
        <div className="max-w-4xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              Built With
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Tech <span className="gradient-text">Stack</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powered by cutting-edge technologies for optimal performance and security.
            </p>
          </div>

          {/* Tech grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {technologies.map((tech, index) => (
              <div
                key={tech.name}
                className="group relative rounded-xl border border-border bg-card p-6 hover:glow-border transition-all duration-300 text-center"
              >
                <div className={`w-12 h-12 mx-auto rounded-lg bg-secondary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 ${tech.color}`}>
                  <tech.icon className="w-6 h-6" />
                </div>
                <h3 className="font-display font-semibold text-foreground mb-1">{tech.name}</h3>
                <p className="text-sm text-muted-foreground">{tech.description}</p>
              </div>
            ))}
          </div>

          {/* Architecture diagram placeholder */}
          <div className="mt-16 rounded-2xl border border-border bg-card p-8 text-center">
            <h3 className="font-display font-semibold text-xl mb-4">System Architecture</h3>
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
              <div className="px-6 py-3 rounded-lg bg-primary/10 border border-primary/30">
                <span className="font-display text-primary">Frontend</span>
              </div>
              <span className="text-muted-foreground hidden md:block">→</span>
              <div className="px-6 py-3 rounded-lg bg-accent/10 border border-accent/30">
                <span className="font-display text-accent">EasyConnect</span>
              </div>
              <span className="text-muted-foreground hidden md:block">→</span>
              <div className="px-6 py-3 rounded-lg bg-primary/10 border border-primary/30">
                <span className="font-display text-primary">Smart Contracts</span>
              </div>
              <span className="text-muted-foreground hidden md:block">→</span>
              <div className="px-6 py-3 rounded-lg bg-accent/10 border border-accent/30">
                <span className="font-display text-accent">Qubic Network</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechStack;
