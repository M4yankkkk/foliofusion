import './landing-v2.css'
import Navbar from '@/components/landing-v2/Navbar'
import HeroSection from '@/components/landing-v2/HeroSection'
import LogoBar from '@/components/landing-v2/LogoBar'
import ProblemSection from '@/components/landing-v2/ProblemSection'
import FeaturesGrid from '@/components/landing-v2/FeaturesGrid'
import TestimonialsSection from '@/components/landing-v2/TestimonialsSection'
import StatsSection from '@/components/landing-v2/StatsSection'
import PricingSection from '@/components/landing-v2/PricingSection'
import FAQSection from '@/components/landing-v2/FAQSection'
import FinalCTA from '@/components/landing-v2/FinalCTA'
import Footer from '@/components/landing-v2/Footer'

export const metadata = {
  title: 'FolioFusion - Cultivate Your Career',
  description: 'Build a living blueprint of your career, then let AI tailor it for every opportunity.',
}

export default function LandingV2() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <LogoBar />
        <ProblemSection />
        <FeaturesGrid />
        <TestimonialsSection />
        <StatsSection />
        <PricingSection />
        <FAQSection />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  )
}
