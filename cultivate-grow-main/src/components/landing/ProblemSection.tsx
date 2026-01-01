import { FileX, Clock, EyeOff, Ban, Link2Off } from "lucide-react";

const problems = [
  {
    icon: FileX,
    title: "Generic Templates",
    description: "Same resume for every job application",
  },
  {
    icon: Clock,
    title: "Manual Tailoring",
    description: "Hours spent rewriting for each position",
  },
  {
    icon: Ban,
    title: "ATS Black Holes",
    description: "90% rejected before human sees them",
  },
  {
    icon: EyeOff,
    title: "No Visibility",
    description: "Can't track who sees your resume",
  },
  {
    icon: Link2Off,
    title: "Outdated Sharing",
    description: "Emails PDFs that get lost in inboxes",
  },
];

const ProblemSection = () => {
  return (
    <section className="section-padding bg-foreground text-background">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4">
            The Old Way is Broken
          </h2>
          <p className="text-background/60 text-lg max-w-2xl mx-auto">
            Traditional job applications haven't evolved. You're still stuck in a loop of endless editing.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 md:gap-8">
          {problems.map((problem, index) => (
            <div
              key={problem.title}
              className="group text-center p-6 rounded-xl border border-background/10 hover:border-background/20 hover:bg-background/5 transition-all duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-secondary/20 flex items-center justify-center group-hover:bg-secondary/30 group-hover:scale-110 transition-all duration-300">
                <problem.icon className="w-7 h-7 text-secondary" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">
                {problem.title}
              </h3>
              <p className="text-sm text-background/60">
                {problem.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 text-secondary">
            <span className="text-lg font-medium">There's a better way</span>
            <svg className="w-5 h-5 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
