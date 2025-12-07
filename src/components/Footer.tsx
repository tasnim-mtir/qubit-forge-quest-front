import { Zap } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-12 border-t border-border bg-secondary/20">
      <div className="container px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Zap className="w-5 h-5 text-background" />
              </div>
              <span className="font-display font-bold text-xl">QUBITIUM</span>
            </div>

            {/* Links */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <a href="#about" className="hover:text-primary transition-colors">About</a>
              <a href="#features" className="hover:text-primary transition-colors">Features</a>
              <a href="#demo" className="hover:text-primary transition-colors">Demo</a>
              <a href="#tech" className="hover:text-primary transition-colors">Tech Stack</a>
              <a href="#contact" className="hover:text-primary transition-colors">Contact</a>
            </div>

            {/* Copyright */}
            <p className="text-sm text-muted-foreground">
              © 2026 Qubitium. Built for Qubic Hackathon.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
