"use client"

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "How does AI tailoring work?",
    answer: "When you paste a job description, our AI analyzes the keywords, requirements, and tone. It then selects the most relevant experiences and skills from your Master Profile, rewriting bullet points to match the role's language. The result is a tailored resume that speaks directly to the job—without you manually editing anything.",
  },
  {
    question: "Is my data secure?",
    answer: "Absolutely. We use bank-level encryption (AES-256) for all data at rest and in transit. Your information is never shared with third parties, and you can delete your account and all data at any time. We're SOC 2 Type II compliant.",
  },
  {
    question: "Can I cancel anytime?",
    answer: "Yes! There are no long-term contracts. You can cancel your subscription at any time, and you'll continue to have access until the end of your billing period. If you're on the Free plan, you can use it indefinitely.",
  },
  {
    question: "What makes shareable links different from a PDF?",
    answer: "Shareable links are live, interactive profiles that update automatically when you make changes. They include embeds (GitHub, Figma, videos), real-time analytics (who viewed, when, from where), and a professional appearance. Unlike PDFs that get lost in inboxes, your link is always current and trackable.",
  },
  {
    question: "Do you support custom domains?",
    answer: "Yes! Pro and Enterprise users can connect their own domain (e.g., resume.yourname.com) to their shareable profile. We handle the SSL certificate and DNS configuration for you.",
  },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="section-padding bg-background">
      <div className="container max-w-3xl">
        <div className="text-center mb-12">
          <span className="text-primary text-sm font-semibold uppercase tracking-wider mb-3 block">FAQ</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground">
            Common Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-card rounded-xl border border-border overflow-hidden transition-all duration-300 hover:border-primary/30"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left"
              >
                <span className="font-display font-semibold text-foreground pr-4">
                  {faq.question}
                </span>
                <ChevronDown 
                  className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? "max-h-96" : "max-h-0"
                }`}
              >
                <div className="px-6 pb-5 text-foreground-secondary leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
