import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { scrollToSection } from "../utils";

export const Navbar = ({ scrolled, user, onSignIn, onLogin, onGoToDashboard }) => {
   return (
      <nav className={cn(
         "fixed top-0 w-full z-50 transition-all duration-500 px-10 border-b",
         scrolled ? "bg-background/95 backdrop-blur-md border-border py-4" : "bg-transparent border-transparent py-8"
      )}>
         <div className="max-w-[1600px] mx-auto flex items-center justify-between">
            <div className="flex items-center gap-20">
               <div className="cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                  <h2 className="text-[20px] font-bold tracking-tighter text-foreground uppercase leading-none">
                     OrionOps<span className="text-primary">.</span>
                  </h2>
               </div>
               <div className="hidden lg:flex items-center gap-10">
                  <button onClick={() => scrollToSection('features')} className="text-[9px] font-bold text-muted-foreground hover:text-foreground uppercase tracking-[0.4em] transition-all relative group cursor-pointer">
                     Features
                     <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-primary transition-all group-hover:w-full" />
                  </button>
                  <button onClick={() => scrollToSection('how-it-works')} className="text-[9px] font-bold text-muted-foreground hover:text-foreground uppercase tracking-[0.4em] transition-all relative group cursor-pointer">
                     How it Works
                     <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-primary transition-all group-hover:w-full" />
                  </button>
                  <Link to="/docs" className="text-[9px] font-bold text-muted-foreground hover:text-foreground uppercase tracking-[0.4em] transition-all relative group cursor-pointer">
                     Docs
                     <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-primary transition-all group-hover:w-full" />
                  </Link>
               </div>
            </div>
            <div className="flex items-center gap-8">
               {user ? (
                  <>
                     <Button
                        className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 h-9 rounded-md text-[9px] font-bold uppercase tracking-[0.3em] transition-all shadow-none cursor-pointer border border-primary"
                        onClick={onGoToDashboard}
                     >
                        Go to Dashboard
                     </Button>
                  </>
               ) : (
                  <>
                     <button className="text-[9px] font-bold text-foreground uppercase tracking-[0.3em] hover:text-primary transition-colors cursor-pointer" onClick={onLogin ?? onSignIn}>Login</button>
                     <Button
                        className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 h-9 rounded-md text-[9px] font-bold uppercase tracking-[0.3em] transition-all shadow-none cursor-pointer border border-primary"
                        onClick={onSignIn}
                     >
                        Get Started
                     </Button>
                  </>
               )}
            </div>
         </div>
      </nav>
   );
};
