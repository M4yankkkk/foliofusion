import { Button } from "@/components/ui-v2/button";
import { ArrowRight, Shield, Zap } from "lucide-react";

const FinalCTA = () => {
  return (
    <section className="section-padding relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[var(--gradient-hero)]" />
        <div className="organic-shape w-[800px] h-[800px] bg-primary/20 -top-1/2 left-1/2 -translate-x-1/2 animate-blob" />
        <div className="organic-shape w-[600px] h-[600px] bg-secondary/15 bottom-0 -right-48 animate-blob animation-delay-300" />
      </div>

      <div className="container text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-6 text-foreground">
          Ready to Cultivate Your Career?
        </h2>
        <p className="text-lg md:text-xl text-foreground-secondary max-w-2xl mx-auto mb-10">
          Join 10,000+ professionals who upgraded their career with FolioFusion
        </p>

        <Button variant="hero" size="xl" className="group">
          Get Started Free
          <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
        </Button>

        {/* Trust badges */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <span>256-bit encryption</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            <span>5-minute setup</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>No credit card required</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
