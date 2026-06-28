import React from "react";
import { useScroll } from "./hooks/useScroll";
import { Navbar } from "./components/Navbar";
import { HeroSection } from "./components/HeroSection";
import { FeaturesSection } from "./components/FeaturesSection";
import { InfrastructureWalkthrough } from "./components/InfrastructureWalkthrough";
import { DocsSection } from "./components/DocsSection";
import { CTASection } from "./components/CTASection";
import { Footer } from "./components/Footer";

export default function LandingPage({ user, onSignIn, onLogin, onLiveDemo, onGoToDashboard }) {
   const scrolled = useScroll(20);

   return (
      <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 overflow-x-hidden font-sans landing-light-theme">
         <div className="fixed inset-0 bg-technical-grid opacity-5 pointer-events-none" />
         <div className="fixed top-0 right-0 w-1/2 h-full border-l border-border/20 pointer-events-none" />

         <Navbar
            scrolled={scrolled}
            user={user}
            onSignIn={onSignIn}
            onLogin={onLogin}
            onGoToDashboard={onGoToDashboard}
         />

         <HeroSection
            user={user}
            onSignIn={onSignIn}
            onGoToDashboard={onGoToDashboard}
            onLiveDemo={onLiveDemo}
         />

         <FeaturesSection />

         <section className="bg-background relative z-10 border-t border-border">
            <InfrastructureWalkthrough />
         </section>

         <DocsSection />

         <CTASection onSignIn={onSignIn} />

         <Footer />
      </div>
   );
}
