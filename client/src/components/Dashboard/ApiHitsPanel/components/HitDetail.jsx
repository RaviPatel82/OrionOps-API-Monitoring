import React, { useState } from "react";
import { motion } from "framer-motion";
import { Globe, Terminal, Check, Copy } from "lucide-react";

export default function HitDetail({ hit }) {
  const [copied, setCopied] = useState(null);

  const copy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 1500);
  };

  const fields = [
    { label: "IP Address", value: hit.ip || "Unknown", icon: Globe },
    { label: "User Agent", value: hit.userAgent || "Unknown", icon: Terminal },
  ];

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      className="overflow-hidden"
    >
      <div className="px-4 py-3 bg-secondary/20 border-t border-border/50">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2">
          {fields.map((f) => (
            <div key={f.label} className="group/field flex items-start gap-2.5">
              <div className="p-1.5 rounded bg-primary/5 text-primary mt-0.5 flex-shrink-0">
                <f.icon size={11} />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.15em] block mb-0.5">
                  {f.label}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-mono font-semibold text-foreground truncate">
                    {f.value}
                  </span>
                  <button
                    onClick={() => copy(f.value, f.label)}
                    className="opacity-0 group-hover/field:opacity-100 transition-opacity duration-200 text-muted-foreground hover:text-primary cursor-pointer flex-shrink-0"
                  >
                    {copied === f.label ? <Check size={10} className="text-emerald-400" /> : <Copy size={10} />}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
