import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function NotificationBanner({ message, error }) {
  if (!message && !error) return null;

  return (
    <div className={cn(
      "px-4 py-2 rounded-[4px] border flex items-center gap-3 transition-all",
      message ? "bg-tech-emerald/10 border-tech-emerald/30 text-emerald-400" : "bg-tech-rose/10 border-tech-rose/30 text-tech-rose"
    )}>
      {message ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
      <span className="text-[10px] font-bold uppercase tracking-tight">{message || error}</span>
    </div>
  );
}
