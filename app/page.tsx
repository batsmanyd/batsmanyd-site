import { SiteProvider } from "@/lib/site-context";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Guarantees } from "@/components/sections/Guarantees";
import { Services } from "@/components/sections/Services";
import { BeforeAfterShowcase } from "@/components/sections/BeforeAfterShowcase";
import { ServiceQuiz } from "@/components/sections/ServiceQuiz";
import { LossCalculator } from "@/components/sections/LossCalculator";
import { RoiCalculator } from "@/components/sections/RoiCalculator";
import { Testimonials } from "@/components/sections/Testimonials";
import { TechStack } from "@/components/sections/TechStack";
import { Audit } from "@/components/sections/Audit";
import { Process } from "@/components/sections/Process";
import { Contact } from "@/components/sections/Contact";
import { ScrollProgress } from "@/components/effects/ScrollProgress";
import { SectionNav } from "@/components/effects/SectionNav";
import { LeadPulse } from "@/components/effects/LeadPulse";
import { StickyCta } from "@/components/effects/StickyCta";
import { AiChat } from "@/components/effects/AiChat";
import { FunnelBackground } from "@/components/effects/FunnelBackground";

export default function Home() {
  return (
    <SiteProvider>
      <FunnelBackground />
      <div className="relative z-10">
      <ScrollProgress />
      <SectionNav />
      <LeadPulse />
      <StickyCta />
      <AiChat />
      <Header />
      <main>
        <Hero />
        <Guarantees />
        <Services />
        <BeforeAfterShowcase />
        <ServiceQuiz />
        <LossCalculator />
        <RoiCalculator />
        <Testimonials />
        <TechStack />
        <Audit />
        <Process />
        <Contact />
      </main>
      <Footer />
      </div>
    </SiteProvider>
  );
}