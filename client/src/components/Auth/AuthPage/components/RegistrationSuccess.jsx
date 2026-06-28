import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2 } from "lucide-react";

export default function RegistrationSuccess() {
  return (
    <div className="text-center py-8">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="h-16 w-16 rounded-full border-2 border-primary bg-primary/10 flex items-center justify-center mx-auto mb-6 relative"
      >
        <CheckCircle2 size={28} className="text-primary" />
        <motion.div
          animate={{ scale: [1, 1.8], opacity: [0.4, 0] }}
          transition={{ duration: 1.2, repeat: Infinity }}
          className="absolute inset-0 rounded-full border border-primary"
        />
      </motion.div>
      <h3 className="text-[18px] font-bold uppercase tracking-tighter text-foreground mb-2">
        Registration Complete
      </h3>
      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-4">
        Initializing your dashboard...
      </p>
      <Loader2 className="h-4 w-4 animate-spin text-primary mx-auto" />
    </div>
  );
}
