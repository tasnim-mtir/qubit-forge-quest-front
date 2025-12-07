import { Users, Target, Rocket } from "lucide-react";

const teamMembers = [
  { name: "Alex Chen", role: "Lead Developer", avatar: "AC" },
  { name: "Sarah Kim", role: "Smart Contract Engineer", avatar: "SK" },
  { name: "Marcus Johnson", role: "Frontend Developer", avatar: "MJ" },
  { name: "Emily Zhang", role: "Product Designer", avatar: "EZ" },
];

const About = () => {
  return (
    <section id="about" className="py-24 relative">
      <div className="container px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
              About <span className="gradient-text">Qubitium</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Building the future of decentralized computing on Qubic's revolutionary blockchain infrastructure.
            </p>
          </div>

          {/* Mission cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-20">
            <div className="glow-box rounded-xl p-8 bg-card border border-border">
              <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-display font-semibold mb-3">Our Mission</h3>
              <p className="text-muted-foreground">
                Democratize access to quantum-resistant computing power through innovative staking and job distribution mechanisms.
              </p>
            </div>

            <div className="glow-box rounded-xl p-8 bg-card border border-border">
              <div className="w-14 h-14 rounded-lg bg-accent/10 flex items-center justify-center mb-6">
                <Rocket className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-xl font-display font-semibold mb-3">Our Vision</h3>
              <p className="text-muted-foreground">
                Create a world where anyone can contribute computational resources and earn rewards in a truly decentralized ecosystem.
              </p>
            </div>

            <div className="glow-box rounded-xl p-8 bg-card border border-border">
              <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                <Users className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-display font-semibold mb-3">Our Approach</h3>
              <p className="text-muted-foreground">
                Leveraging Qubic's unique consensus mechanism to build scalable, efficient, and user-friendly DeFi applications.
              </p>
            </div>
          </div>

          {/* Team section */}
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-display font-bold mb-4">
              Meet the <span className="text-primary">Team</span>
            </h3>
            <p className="text-muted-foreground">
              Passionate builders committed to revolutionizing decentralized compute.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <div 
                key={member.name}
                className="group text-center p-6 rounded-xl border border-border bg-card/50 hover:glow-border transition-all duration-300"
              >
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-primary/30 group-hover:border-primary/50 transition-colors">
                  <span className="text-xl font-display font-bold text-primary">{member.avatar}</span>
                </div>
                <h4 className="font-display font-semibold text-foreground">{member.name}</h4>
                <p className="text-sm text-muted-foreground mt-1">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
