import React from "react";
import { cn } from "@/lib/utils";

export default function FormField({ label, icon: Icon, error: fieldError, hint, children }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground ml-1">{label}</label>
      <div className="relative group">
        <Icon className={cn("absolute left-3.5 top-2.5 h-4 w-4 transition-colors", fieldError ? "text-red-500" : "text-muted-foreground group-focus-within:text-primary")} />
        {children}
      </div>
      {fieldError
        ? <p className="text-[9px] text-red-400 font-bold ml-1">{fieldError}</p>
        : hint && <p className="text-[9px] text-muted-foreground font-medium ml-1">{hint}</p>
      }
    </div>
  );
}
