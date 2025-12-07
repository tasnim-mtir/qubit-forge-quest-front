import { Button } from "@/components/ui/button";
import { Mail, MessageCircle, Github, Twitter } from "lucide-react";

const Contact = () => {
  return (
    <section id="contact" className="py-24 relative">
      <div className="container px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Section header */}
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Get in <span className="gradient-text">Touch</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12">
            Have questions or want to collaborate? Reach out to us through any of these channels.
          </p>

       

          {/* Social links */}
          <div className="flex justify-center gap-6">
            <a 
              href="https://github.com/tasnim-mtir/qubit-forge-quest-front" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:border-primary/50 hover:text-primary transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
        
        
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
