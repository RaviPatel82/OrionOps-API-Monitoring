import React from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LiveTicker } from "../../Common/LiveTicker";
import { SectionLabel } from "./SectionLabel";

export const HeroSection = ({ user, onSignIn, onGoToDashboard, onLiveDemo }) => {
   return (
      <section className="relative px-10 z-10 min-h-screen flex items-center">
         <div className="max-w-[1600px] mx-auto w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
               <div className="lg:col-span-7">
                  <motion.div
                     initial={{ opacity: 0, x: -20 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ duration: 0.8 }}
                  >
                     <SectionLabel number="01" title="API Monitoring" />
                     <h1 className="text-[54px] lg:text-[88px] font-bold leading-[0.85] tracking-tighter text-foreground mb-8 uppercase">
                        API Security<span className="text-primary">.</span> <br />
                        <span className="text-muted-foreground">Simplified</span><br />
                        For Teams.
                     </h1>
                     <p className="text-[16px] font-medium text-muted-foreground max-w-xl leading-relaxed mb-10 opacity-70">
                        Track your API traffic, secure your data, and manage your team’s access in one simple, professional dashboard.
                     </p>

                     <div className="flex flex-wrap items-center gap-6">
                        {user ? (
                           <Button
                              size="lg"
                              className="bg-primary text-primary-foreground hover:bg-primary/90 h-14 px-10 text-[11px] font-bold rounded-md uppercase tracking-[0.4em] transition-all shadow-[0_12px_40px_rgba(99,102,241,0.2)] cursor-pointer border border-primary"
                              onClick={onGoToDashboard}
                           >
                              Go to Dashboard
                           </Button>
                        ) : (
                           <Button
                              size="lg"
                              className="bg-primary text-primary-foreground hover:bg-primary/90 h-14 px-10 text-[11px] font-bold rounded-md uppercase tracking-[0.4em] transition-all shadow-[0_12px_40px_rgba(99,102,241,0.2)] cursor-pointer border border-primary"
                              onClick={onSignIn}
                           >
                              Get Started
                           </Button>
                        )}
                        <Button
                           variant="outline"
                           size="lg"
                           className="border-border bg-secondary text-foreground hover:bg-accent hover:text-foreground h-14 px-10 text-[11px] font-bold rounded-md uppercase tracking-[0.4em] transition-all cursor-pointer"
                           onClick={onLiveDemo}
                        >
                           <span className="flex items-center gap-2">
                              <Play size={14} className="fill-current" /> Live Demo
                           </span>
                        </Button>
                     </div>
                  </motion.div>
               </div>
               <div className="lg:col-span-5 hidden lg:block">
                  <motion.div
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ duration: 1, delay: 0.2 }}
                     className="ml-auto flex justify-end"
                  >
                     <LiveTicker />
                  </motion.div>
               </div>
            </div>
         </div>
      </section>
   );
};
