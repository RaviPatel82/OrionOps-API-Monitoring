import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function IdentityCard({ title, subtitle, icon: Icon, active, onClick, color = "var(--color-primary)" }) {
  return (
    <button
      onClick={onClick}
      type="button"
      className={cn(
        "flex-1 p-6 border transition-all relative text-left group overflow-hidden cursor-pointer",
        active ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border bg-secondary hover:border-accent"
      )}
    >
      <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity">
        <Icon size={60} />
      </div>
      <div className={cn(
        "h-8 w-8 rounded-full border flex items-center justify-center mb-4 transition-colors",
        active ? "bg-primary border-primary text-white" : "border-border text-muted-foreground group-hover:border-accent-foreground"
      )}>
        <Icon size={14} />
      </div>
      <h4 className={cn("text-[11px] font-bold uppercase tracking-widest mb-1", active ? "text-primary" : "text-foreground")}>
        {title}
      </h4>
      <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest leading-tight">
        {subtitle}
      </p>
      {active && (
        <motion.div
          layoutId="active-indicator"
          className="absolute bottom-0 left-0 h-0.5 w-full bg-primary"
        />
      )}
    </button>
  );
}
