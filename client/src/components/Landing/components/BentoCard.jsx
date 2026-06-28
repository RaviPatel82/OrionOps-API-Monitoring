import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const BentoCard = ({ title, description, children, className }) => (
   <motion.div
      whileHover={{ scale: 1.01, y: -4, transition: { duration: 0.3, ease: "easeOut" } }}
      className={cn(
         "bg-secondary/40 backdrop-blur-md border border-border/50 p-8 group hover:border-primary/50 hover:bg-secondary/80 hover:shadow-[0_0_40px_-15px_rgba(0,255,150,0.15)] transition-all duration-300 relative overflow-hidden flex flex-col h-full rounded-3xl",
         className
      )}
   >
      <div className="flex-1 min-h-[160px] relative w-full rounded-xl bg-background/50 border border-border/30 overflow-hidden mb-8 flex items-center justify-center">
         {children}
      </div>
      <div className="mt-auto">
         <h3 className="text-[20px] font-bold tracking-tighter text-foreground mb-3">{title}</h3>
         <p className="text-[13px] text-muted-foreground/80 font-medium leading-relaxed">{description}</p>
      </div>
   </motion.div>
);
