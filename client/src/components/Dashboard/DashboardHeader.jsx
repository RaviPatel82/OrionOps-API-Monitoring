import React from 'react';
import {
  Bell,
  Settings,
  HelpCircle,
  Cpu,
  Server,
  Terminal,
  Timer
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function DashboardHeader({ profile, range, setRange }) {
  return (
    <header className="h-20 border-b border-border bg-card/85 backdrop-blur-md flex items-center justify-between px-10 z-10">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2.5">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-mono font-bold text-foreground uppercase tracking-[0.2em]">Live Status</span>
        </div>
        <div className="h-4 w-px bg-border" />
        <div className="flex items-center gap-2 text-muted-foreground">
          <Server size={14} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Platform Core</span>
        </div>

        <div className="h-4 w-px bg-border" />
      </div>

      <div className="flex items-center gap-8">
        {setRange && (
          <div className="flex items-center gap-1 bg-secondary border border-border p-1 rounded-md">
            {[
              { id: '1h', label: '1H' },
              { id: '24h', label: '24H' },
              { id: '7d', label: '7D' }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setRange(t.id)}
                className={cn(
                  "px-3 py-1 rounded text-[10px] font-mono font-bold transition-all cursor-pointer",
                  range === t.id
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center gap-3 border-r pr-8 border-border">
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-md border border-border text-foreground hover:bg-accent transition-colors cursor-pointer">
            <HelpCircle size={18} />
          </Button>
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-md border border-border text-foreground hover:bg-accent transition-colors relative cursor-pointer">
            <Bell size={18} />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-primary rounded-full border-2 border-card" />
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-[14px] font-bold text-foreground leading-none tracking-tight">{profile?.username || profile?.name || 'User'}</p>
            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em] mt-1.5">
              {profile?.role === 'super_admin' ? 'Root Administrator' : 'Authorized Member'}
            </p>
          </div>
          <div className="h-11 w-11 rounded-md bg-secondary flex items-center justify-center text-foreground font-bold text-xs border border-border">
            {(profile?.username || profile?.name || 'US').substring(0, 2).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
}
