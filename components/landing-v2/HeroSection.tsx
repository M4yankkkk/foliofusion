import { Button } from "@/components/ui-v2/button";
import { ArrowRight, Play } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Organic Background Elements */}
      <div className="absolute inset-0 -z-10">
        {/* Gradient base */}
        <div className="absolute inset-0 bg-[var(--gradient-hero)]" />
        
        {/* Organic shapes */}
        <div className="organic-shape w-[600px] h-[600px] bg-primary/20 -top-48 -right-48 animate-blob" />
        <div className="organic-shape w-[500px] h-[500px] bg-secondary/15 top-1/3 -left-32 animate-blob animation-delay-200" />
        <div className="organic-shape w-[400px] h-[400px] bg-accent/10 bottom-0 right-1/4 animate-blob animation-delay-500" />
        
        {/* Paper texture overlay */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">Now with AI-powered tailoring</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold text-foreground mb-6 leading-[1.1] animate-fade-in animation-delay-100">
            Cultivate Your{" "}
            <span className="text-gradient">Career</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-foreground-secondary max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in animation-delay-200">
            Stop editing resumes for every job. Build a living blueprint, then let AI handle the repetition.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in animation-delay-300">
            <Button variant="hero" size="xl" className="group">
              Start Free
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button variant="hero-outline" size="xl" className="group">
              <Play className="w-5 h-5" />
              See How It Works
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 flex items-center justify-center gap-6 text-sm text-muted-foreground animate-fade-in animation-delay-500">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>5-minute setup</span>
            </div>
          </div>
        </div>

        {/* Floating Seed/Dashboard Preview */}
        <div className="mt-16 md:mt-24 max-w-5xl mx-auto animate-fade-in-up animation-delay-500">
          <div className="relative">
            {/* Glow effect behind */}
            <div className="absolute inset-4 bg-gradient-to-b from-primary/20 to-secondary/10 rounded-3xl blur-2xl" />
            
            {/* Dashboard mockup */}
            <div className="relative bg-card rounded-2xl shadow-floating border border-border overflow-hidden">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-destructive/60" />
                  <div className="w-3 h-3 rounded-full bg-secondary/60" />
                  <div className="w-3 h-3 rounded-full bg-primary/60" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="px-4 py-1 bg-background rounded-md text-xs text-muted-foreground">
                    foliofusion.com/dashboard
                  </div>
                </div>
              </div>
              
              {/* Dashboard content */}
              <div className="p-6 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                  {/* Master Profile Card */}
                  <div className="col-span-2 bg-background-secondary rounded-xl p-5 border border-border">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-xl">👤</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">Sarah Chen</h3>
                        <p className="text-sm text-muted-foreground">Software Engineer</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {["React", "TypeScript", "Node.js", "AWS", "Leadership"].map((skill) => (
                        <span key={skill} className="px-3 py-1 text-xs bg-primary/10 text-primary rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Stats Card */}
                  <div className="bg-background-secondary rounded-xl p-5 border border-border">
                    <div className="text-sm text-muted-foreground mb-2">Profile Views</div>
                    <div className="text-3xl font-bold text-foreground mb-1">1,247</div>
                    <div className="text-sm text-primary">+23% this week</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
