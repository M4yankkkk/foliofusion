import { useEffect, useState, useRef } from "react";
import { FileText, Users, TrendingUp } from "lucide-react";

interface StatProps {
  value: number;
  suffix?: string;
  label: string;
  icon: React.ElementType;
}

const StatCard = ({ value, suffix = "", label, icon: Icon }: StatProps) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    
    if (ref.current) {
      observer.observe(ref.current);
    }
    
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    
    const duration = 2000;
    const steps = 60;
    const stepValue = value / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += stepValue;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    
    return () => clearInterval(timer);
  }, [isVisible, value]);

  return (
    <div ref={ref} className="text-center group">
      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
        <Icon className="w-8 h-8 text-primary" />
      </div>
      <div className="text-4xl md:text-5xl font-display font-bold text-foreground mb-2">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-muted-foreground">{label}</div>
    </div>
  );
};

const StatsSection = () => {
  return (
    <section className="section-padding bg-background">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          <StatCard 
            value={10000} 
            suffix="+" 
            label="Resumes Created" 
            icon={FileText} 
          />
          <StatCard 
            value={500000} 
            suffix="+" 
            label="ATS Keywords Matched" 
            icon={TrendingUp} 
          />
          <StatCard 
            value={95} 
            suffix="%" 
            label="Success Rate" 
            icon={Users} 
          />
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
