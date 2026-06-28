import React from "react";

export const SectionLabel = ({ number, title }) => (
   <div className="inline-flex items-center gap-3 mb-6 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5">
      <span className="text-[10px] font-black text-primary uppercase tracking-widest">
         {number}
      </span>
      <div className="h-1 w-1 rounded-full bg-primary/50" />
      <span className="text-[10px] font-bold text-foreground uppercase tracking-widest opacity-80">
         {title}
      </span>
   </div>
);
