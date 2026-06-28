import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionLabel } from "./SectionLabel";

export const CTASection = ({ onSignIn }) => {
   return (
      <section className="relative px-10 py-32 z-10 bg-background border-t border-border overflow-hidden">
         <div className="absolute inset-0 bg-primary/5" />
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-primary/20 blur-[120px] rounded-full pointer-events-none opacity-50" />

         <div className="max-w-[1000px] mx-auto text-center relative z-10">
            <motion.div
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true, margin: "-50px" }}
               transition={{ duration: 0.6 }}
               className="flex flex-col items-center"
            >
               <SectionLabel number="04" title="Get Started" />
               <h2 className="text-[50px] lg:text-[80px] font-bold tracking-tighter text-foreground uppercase leading-[0.85] mb-8">
                  Ready for Total <span className="text-primary">Visibility?</span>
               </h2>
               <p className="text-[16px] text-muted-foreground font-medium max-w-2xl leading-relaxed mb-12">
                  Build resilient architectures with OrionOps. Set up in minutes, monitor forever.
               </p>

               <div className="flex flex-wrap items-center justify-center gap-6">
                  <Button
                     size="lg"
                     className="bg-primary text-primary-foreground hover:bg-primary/90 h-14 px-12 text-[11px] font-bold rounded-md uppercase tracking-[0.4em] transition-all shadow-[0_0_40px_rgba(99,102,241,0.3)] hover:scale-105 cursor-pointer border border-primary"
                     onClick={onSignIn}
                  >
                     Get Started
                  </Button>
                  <Button
                     variant="outline"
                     size="lg"
                     className="border-border bg-secondary/50 backdrop-blur-sm text-foreground hover:bg-accent hover:text-foreground h-14 px-12 text-[11px] font-bold rounded-md uppercase tracking-[0.4em] transition-all cursor-pointer"
                     onClick={() => window.location.href = '/docs'}
                  >
                     Read the Docs
                  </Button>
               </div>

               <div className="mt-16 flex items-center justify-center gap-8 text-[9px] font-bold text-muted-foreground uppercase tracking-widest font-mono">
                  <span className="flex items-center gap-2"><CheckCircle2 size={12} className="text-primary" /> Works With Express, Fastify & Raw Node</span>
                  <span className="flex items-center gap-2"><CheckCircle2 size={12} className="text-primary" /> npm install orionops</span>
               </div>
            </motion.div>
         </div>
      </section>
   );
};
