import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    quote: "Landed 3 interviews in one week after switching to FolioFusion. The AI tailoring is like having a personal career coach.",
    author: "Sarah Chen",
    role: "Software Engineer",
    company: "Google",
    avatar: "SC",
  },
  {
    quote: "Finally, a resume tool that doesn't feel like a chore. The shareable links have gotten more engagement than my PDF ever did.",
    author: "Marcus Johnson",
    role: "Product Designer",
    company: "Stripe",
    avatar: "MJ",
  },
  {
    quote: "The LaTeX export is chef's kiss. Perfect formatting every single time. My resume has never looked more professional.",
    author: "Emily Rodriguez",
    role: "Data Scientist",
    company: "Netflix",
    avatar: "ER",
  },
  {
    quote: "Being able to see who viewed my profile changed my entire approach to job hunting. It's like analytics for your career.",
    author: "David Kim",
    role: "Engineering Manager",
    company: "Meta",
    avatar: "DK",
  },
];

const TestimonialsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const goTo = (index: number) => setActiveIndex(index);
  const goPrev = () => setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  const goNext = () => setActiveIndex((prev) => (prev + 1) % testimonials.length);

  return (
    <section id="templates" className="section-padding bg-background-secondary/50">
      <div className="container">
        <div className="text-center mb-12">
          <span className="text-primary text-sm font-semibold uppercase tracking-wider mb-3 block">Testimonials</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground">
            Loved by Professionals
          </h2>
        </div>

        <div 
          className="max-w-4xl mx-auto relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Main testimonial */}
          <div className="bg-card rounded-2xl border border-border p-8 md:p-12 shadow-soft relative overflow-hidden">
            {/* Quote icon */}
            <Quote className="absolute top-6 left-6 w-12 h-12 text-primary/10" />
            
            <div className="relative z-10">
              <p className="text-xl md:text-2xl text-foreground font-display leading-relaxed mb-8">
                "{testimonials[activeIndex].quote}"
              </p>
              
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg">
                  {testimonials[activeIndex].avatar}
                </div>
                <div>
                  <div className="font-semibold text-foreground">{testimonials[activeIndex].author}</div>
                  <div className="text-sm text-muted-foreground">
                    {testimonials[activeIndex].role} at {testimonials[activeIndex].company}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation arrows */}
          <button
            onClick={goPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 w-10 h-10 rounded-full bg-card border border-border shadow-soft flex items-center justify-center hover:bg-muted transition-colors"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={goNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 w-10 h-10 rounded-full bg-card border border-border shadow-soft flex items-center justify-center hover:bg-muted transition-colors"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goTo(idx)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                idx === activeIndex 
                  ? "bg-primary w-6" 
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
              aria-label={`Go to testimonial ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
