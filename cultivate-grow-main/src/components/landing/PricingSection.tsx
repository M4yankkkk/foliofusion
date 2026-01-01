import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Star } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: 0,
    description: "Get started with the essentials",
    features: [
      "Master Profile",
      "3 Tailored Resumes",
      "Basic Embeds",
      "Shareable Link",
      "View Analytics",
    ],
    cta: "Start Free",
    popular: false,
  },
  {
    name: "Pro",
    price: 12,
    description: "Everything you need to stand out",
    features: [
      "Everything in Free, plus:",
      "Unlimited PDFs",
      "All Embeds",
      "Advanced Analytics",
      "Custom Domain",
      "Priority Support",
    ],
    cta: "Upgrade Now",
    popular: true,
  },
  {
    name: "Enterprise",
    price: null,
    description: "For teams and organizations",
    features: [
      "Everything in Pro, plus:",
      "Custom Domain",
      "SSO Integration",
      "API Access",
      "Dedicated Support",
      "Custom Branding",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

const PricingSection = () => {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <section id="pricing" className="section-padding bg-background-secondary/50">
      <div className="container">
        <div className="text-center mb-12">
          <span className="text-primary text-sm font-semibold uppercase tracking-wider mb-3 block">Pricing</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4 text-foreground">
            Simple, Transparent Pricing
          </h2>
          <p className="text-foreground-secondary text-lg max-w-2xl mx-auto mb-8">
            Start free, upgrade when you're ready. No hidden fees.
          </p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-3 p-1 bg-muted rounded-full">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                !isAnnual ? "bg-card shadow-soft text-foreground" : "text-muted-foreground"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                isAnnual ? "bg-card shadow-soft text-foreground" : "text-muted-foreground"
              }`}
            >
              Annual
              <span className="ml-2 text-xs text-primary font-semibold">Save 20%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`relative bg-card rounded-2xl border p-6 md:p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-floating ${
                plan.popular 
                  ? "border-primary shadow-glow-primary scale-105 z-10" 
                  : "border-border"
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full flex items-center gap-1">
                  <Star className="w-3 h-3" fill="currentColor" />
                  Most Popular
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="font-display font-bold text-xl mb-2 text-foreground">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
                
                <div className="mb-4">
                  {plan.price !== null ? (
                    <>
                      <span className="text-4xl font-display font-bold text-foreground">
                        ${isAnnual ? Math.floor(plan.price * 0.8) : plan.price}
                      </span>
                      <span className="text-muted-foreground">/mo</span>
                    </>
                  ) : (
                    <span className="text-2xl font-display font-bold text-foreground">Custom</span>
                  )}
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-foreground-secondary">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                variant={plan.popular ? "hero" : "outline"} 
                className="w-full"
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
