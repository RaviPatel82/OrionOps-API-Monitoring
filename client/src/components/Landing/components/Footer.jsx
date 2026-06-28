import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export const Footer = () => {
   return (
      <footer className="pt-32 pb-12 px-10 bg-[#020617] relative z-10 border-t border-white/5 overflow-hidden">
         {/* Subtle background glow */}
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

         <div className="max-w-[1200px] mx-auto relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-24">
               {/* Brand Column */}
               <div className="lg:col-span-8 flex flex-col gap-6">
                  <h2 className="text-[28px] font-bold tracking-tighter text-foreground uppercase leading-none flex items-center gap-2">
                     OrionOps<span className="text-primary text-[32px] leading-none">.</span>
                  </h2>
                  <p className="text-[13px] text-muted-foreground/80 font-medium leading-relaxed max-w-sm">
                     Enterprise-grade observability and telemetry infrastructure.
                     Built for resilient systems and relentless engineering teams.
                  </p>

                  <div className="flex items-center gap-3 mt-1">
                     <span className="text-[12px] font-medium text-muted-foreground/90">Built by Ravi Patel</span>
                     <div className="flex items-center gap-3 border-l border-white/10 pl-3">
                        <a href="https://github.com/RaviPatel82" target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold text-muted-foreground/60 hover:text-foreground uppercase tracking-widest transition-colors duration-200 cursor-pointer">
                           GitHub
                        </a>
                        <a href="https://www.linkedin.com/in/ravipatel82/" target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold text-muted-foreground/60 hover:text-foreground uppercase tracking-widest transition-colors duration-200 cursor-pointer">
                           LinkedIn
                        </a>
                     </div>
                  </div>

                  <div className="flex items-center gap-4 mt-2">
                     <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <span className="text-[10px] font-bold text-primary uppercase tracking-widest font-mono">v1.0.0 Beta</span>
                     </div>
                  </div>
               </div>

               {/* Spacer for large screens */}
               <div className="hidden lg:block lg:col-span-2"></div>

               {/* Links Column */}
               <div className="lg:col-span-2 flex flex-col gap-5">
                  <h4 className="text-[11px] font-black text-foreground uppercase tracking-widest mb-2">Product</h4>
                  <ul className="flex flex-col gap-4">
                     <li>
                        <a
                           href="#features"
                           onClick={(e) => {
                              e.preventDefault();
                              document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                           }}
                           className="text-[13px] font-medium text-muted-foreground/70 hover:text-primary transition-colors duration-200 cursor-pointer flex items-center gap-1 group"
                        >
                           Features
                           <ChevronRight size={12} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                        </a>
                     </li>
                     <li>
                        <Link to="/docs" className="text-[13px] font-medium text-muted-foreground/70 hover:text-primary transition-colors duration-200 cursor-pointer flex items-center gap-1 group">
                           Documentation
                           <ChevronRight size={12} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                        </Link>
                     </li>
                  </ul>
               </div>
            </div>

            {/* Bottom Bar */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-white/5">
               <p className="text-[10px] text-muted-foreground/50 font-bold uppercase tracking-widest font-mono">
                  © 2026 OrionOps. All Rights Reserved.
               </p>
            </div>
         </div>
      </footer>
   );
};
