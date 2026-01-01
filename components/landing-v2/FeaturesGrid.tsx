import { 
  Database, FileCode, Wand2, BarChart3, LinkIcon, Plug 
} from "lucide-react";

interface FeatureCardProps {
  title: string;
  tagline: string;
  description: string;
  icon: React.ElementType;
  colorClass: string;
  className?: string;
  children?: React.ReactNode;
}

const FeatureCard = ({ title, tagline, description, icon: Icon, colorClass, className = "", children }: FeatureCardProps) => (
  <div className={`group relative bg-card rounded-2xl border border-border p-6 md:p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-floating hover:border-primary/20 ${className}`}>
    <div className={`w-12 h-12 rounded-xl ${colorClass} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
      <Icon className="w-6 h-6" />
    </div>
    <h3 className="font-display font-bold text-xl mb-2 text-foreground">
      {title}
    </h3>
    <p className="text-sm text-muted-foreground mb-4">
      {tagline}
    </p>
    <p className="text-foreground-secondary text-sm leading-relaxed">
      {description}
    </p>
    {children}
  </div>
);

const FeaturesGrid = () => {
  return (
    <section id="features" className="section-padding bg-background">
      <div className="container">
        <div className="text-center mb-16">
          <span className="text-primary text-sm font-semibold uppercase tracking-wider mb-3 block">Features</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4 text-foreground">
            Everything You Need to Grow
          </h2>
          <p className="text-foreground-secondary text-lg max-w-2xl mx-auto">
            A complete system for managing your professional narrative—from a single source of truth to beautifully crafted exports.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Card 1: Master Profile - 2 cols */}
          <FeatureCard
            title="One Source of Truth"
            tagline="Never edit a resume again."
            description="Store everything once. Reuse everywhere. All your skills, projects, and experience organized in one place."
            icon={Database}
            colorClass="bg-primary/15 text-primary"
            className="md:col-span-2"
          >
            {/* Visual: Radiating rings */}
            <div className="mt-6 relative h-32 flex items-center justify-center">
              <div className="absolute w-16 h-16 rounded-full bg-primary/20 animate-ping" style={{ animationDuration: '3s' }} />
              <div className="absolute w-24 h-24 rounded-full border-2 border-primary/20" />
              <div className="absolute w-32 h-32 rounded-full border border-primary/10" />
              <div className="relative w-12 h-12 rounded-full bg-primary/30 flex items-center justify-center">
                <span className="text-xl">👤</span>
              </div>
              {/* Labels */}
              <div className="absolute top-2 right-8 px-2 py-1 rounded-full bg-primary/10 text-xs text-primary">Skills</div>
              <div className="absolute bottom-4 left-8 px-2 py-1 rounded-full bg-primary/10 text-xs text-primary">Experience</div>
              <div className="absolute top-1/2 right-4 px-2 py-1 rounded-full bg-primary/10 text-xs text-primary">Projects</div>
            </div>
          </FeatureCard>

          {/* Card 2: LaTeX Precision - 1 col tall */}
          <FeatureCard
            title="Code to Perfection"
            tagline="Typographically flawless."
            description="Generate professionally typeset PDFs using LaTeX. Perfect kerning, spacing, and formatting every time."
            icon={FileCode}
            colorClass="bg-secondary/15 text-secondary"
            className="md:row-span-2"
          >
            {/* Visual: Code preview */}
            <div className="mt-6 space-y-3">
              <div className="bg-foreground/5 rounded-lg p-3 font-mono text-xs text-muted-foreground overflow-hidden">
                <div className="text-secondary">\documentclass{'{'}article{'}'}</div>
                <div className="text-primary">\begin{'{'}document{'}'}</div>
                <div className="ml-4">\section{'{'}Experience{'}'}</div>
                <div className="ml-4">Software Engineer...</div>
                <div className="text-primary">\end{'{'}document{'}'}</div>
              </div>
              <div className="flex gap-2">
                {['Ivy League', 'Modern Sans', 'Classic'].map((t) => (
                  <span key={t} className="px-2 py-1 text-xs bg-secondary/10 text-secondary rounded-md">{t}</span>
                ))}
              </div>
            </div>
          </FeatureCard>

          {/* Card 3: AI Tailor - 2 cols */}
          <FeatureCard
            title="Designed to be Read"
            tagline="Only what matters, for each job."
            description="Paste a job description. AI reads your Master Profile and crafts a tailored version that speaks directly to the role."
            icon={Wand2}
            colorClass="bg-primary/15 text-primary"
            className="md:col-span-2"
          >
            {/* Visual: Funnel */}
            <div className="mt-6 flex items-center gap-4">
              <div className="flex-1 space-y-2">
                <div className="h-2 bg-muted rounded-full" />
                <div className="h-2 bg-muted rounded-full w-4/5" />
                <div className="h-2 bg-muted rounded-full w-3/5" />
                <div className="h-2 bg-primary/30 rounded-full w-2/5" />
                <div className="h-2 bg-primary rounded-full w-1/4" />
              </div>
              <div className="text-center px-4">
                <div className="text-2xl font-bold text-primary">92%</div>
                <div className="text-xs text-muted-foreground">ATS Score</div>
              </div>
            </div>
          </FeatureCard>

          {/* Card 4: Analytics */}
          <FeatureCard
            title="See What Resonates"
            tagline="Know who's viewing."
            description="Track profile views, downloads, and engagement. Understand what catches recruiters' eyes."
            icon={BarChart3}
            colorClass="bg-accent/15 text-accent"
          >
            <div className="mt-6 h-20 flex items-end gap-1">
              {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                <div 
                  key={i} 
                  className="flex-1 bg-accent/20 rounded-t transition-all duration-300 group-hover:bg-accent/40"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </FeatureCard>

          {/* Card 5: Shareable Links */}
          <FeatureCard
            title="Share Your Story"
            tagline="Live profiles, not PDFs."
            description="Generate a shareable link to your interactive portfolio. Embeds, analytics, and live updates included."
            icon={LinkIcon}
            colorClass="bg-accent/15 text-accent"
          >
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-2 px-3 py-2 bg-accent/10 rounded-lg">
                <LinkIcon className="w-4 h-4 text-accent" />
                <span className="text-sm text-foreground truncate">foliofusion.com/sarah-chen</span>
              </div>
              <div className="w-16 h-16 mx-auto bg-foreground/5 rounded-lg flex items-center justify-center">
                <svg className="w-10 h-10 text-foreground/20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 3h7v7H3V3zm11 0h7v7h-7V3zM3 14h7v7H3v-7zm11 3.5a3.5 3.5 0 107 0 3.5 3.5 0 00-7 0z" />
                </svg>
              </div>
            </div>
          </FeatureCard>

          {/* Card 6: Integrations */}
          <FeatureCard
            title="Built to Connect"
            tagline="Your whole presence."
            description="Embed GitHub repos, Figma prototypes, and more. Or pull data directly from LinkedIn."
            icon={Plug}
            colorClass="bg-muted text-foreground"
          >
            <div className="mt-6 flex justify-center gap-4">
              {[
                { name: 'GitHub', emoji: '🐙' },
                { name: 'Figma', emoji: '🎨' },
                { name: 'LinkedIn', emoji: '💼' },
              ].map((integration) => (
                <div 
                  key={integration.name}
                  className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-xl hover:scale-110 transition-transform cursor-pointer"
                >
                  {integration.emoji}
                </div>
              ))}
            </div>
          </FeatureCard>
        </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;
