import { LandingHeader } from "../components/landing/LandingHeader";
import { HeroSection } from "../components/landing/HeroSection";
import { StepsSection } from "../components/landing/StepsSection";
import { CategoriesSection } from "../components/landing/CategoriesSection";
import { FeedbackSection } from "../components/landing/FeedbackSection";
import { RevisionSection } from "../components/landing/RevisionSection";
import { ProgressSection } from "../components/landing/ProgressSection";
import { PortfolioSection } from "../components/landing/PortfolioSection";
import { FaqSection } from "../components/landing/FaqSection";
import { FinalCta, LandingFooter } from "../components/landing/LandingFooter";
import { container } from "../components/landing/shared";

export default function LandingPage() {
  return <div className="landing-page min-h-screen bg-[#faf9f6] font-sans text-[#302f40] antialiased"><a href="#konten" className="sr-only focus:not-sr-only focus:absolute focus:z-10 focus:rounded focus:bg-white focus:p-4">Lewati ke konten</a><LandingHeader /><main id="konten" className={container}><HeroSection /><StepsSection /><CategoriesSection /><FeedbackSection /><RevisionSection /><ProgressSection /><PortfolioSection /><FaqSection /><FinalCta /></main><LandingFooter /></div>;
}
