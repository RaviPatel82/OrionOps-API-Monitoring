import React from "react";
import { Link } from "react-router-dom";
import { Shield, Fingerprint, Cpu } from "lucide-react";

export default function AuthFooter() {
  return (
    <div className="mt-8 pt-6 border-t border-border flex flex-col items-center gap-4">
      <div className="flex items-center gap-6 text-muted-foreground opacity-50">
        <Shield size={14} />
        <Fingerprint size={14} />
        <Cpu size={14} />
      </div>
      <p className="text-[7px] font-bold text-muted-foreground uppercase tracking-[0.4em]">
        Infrastructure Monitoring Node // Restricted Access
      </p>
      {/* Initial Provisioning Link */}
      <div className="mt-8 pt-6 border-t border-border text-center w-full">
        <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-2">System_Status: Uninitialized?</p>
        <Link
          to="/setup-admin"
          className="text-[10px] font-bold text-foreground hover:text-primary uppercase tracking-widest transition-colors flex items-center justify-center gap-2 group cursor-pointer"
        >
          Run Setup Sequence
          <div className="w-1 h-1 bg-primary rounded-full group-hover:animate-ping" />
        </Link>
      </div>
    </div>
  );
}
