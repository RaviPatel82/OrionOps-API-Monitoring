import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, Activity, Database, Shield, Zap, Globe, Layers, Server } from 'lucide-react';

export default function DashboardAnimation() {
  return (
    <div className="relative perspective-2000">
      <motion.div
        initial={{ rotateY: -15, rotateX: 10, y: 50, opacity: 0 }}
        animate={{ rotateY: -8, rotateX: 5, y: 0, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        whileHover={{ rotateY: 0, rotateX: 0, scale: 1.02 }}
        className="w-full h-[450px] bg-secondary rounded-[8px] border border-border shadow-none overflow-hidden flex flex-col relative z-10"
      >
        {/* Browser Top Bar (Blueprint Style) */}
        <div className="h-12 border-b border-border px-6 flex items-center justify-between bg-technical-grid bg-[length:20px_20px]">
          <div className="flex gap-2">
            <div className="w-2.5 h-2.5 rounded-full border border-border" />
            <div className="w-2.5 h-2.5 rounded-full border border-border" />
            <div className="w-2.5 h-2.5 rounded-full border border-border" />
          </div>
          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] bg-background px-4 py-1.5 rounded-full border border-border font-mono">
            telemetry.orionops.app / live_node
          </div>
          <div className="w-20" />
        </div>

        {/* Dashboard Content Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Mini Sidebar */}
          <div className="w-16 border-r border-border flex flex-col items-center pt-8 gap-8 bg-black/40">
            <Activity size={20} className="text-primary" />
            <Database size={20} className="text-muted-foreground" />
            <Layers size={20} className="text-muted-foreground" />
            <Shield size={20} className="text-muted-foreground" />
            <div className="mt-auto pb-8">
               <div className="w-8 h-8 rounded-[4px] bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Globe size={16} className="text-primary" />
               </div>
            </div>
          </div>
          
          {/* Main Panel View */}
          <div className="flex-1 p-8 bg-background">
            <div className="flex justify-between items-start mb-10 border-l-2 border-primary pl-6">
              <div>
                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-1.5">Operational Intelligence</p>
                <h3 className="text-3xl font-bold tracking-tight text-foreground">Real-time Ingestion</h3>
              </div>
              <div className="flex gap-1 h-12 items-end">
                {[40, 70, 45, 90, 65, 100, 75, 110, 85].map((h, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ height: 0 }} 
                    animate={{ height: `${h}%` }} 
                    transition={{ delay: 0.5 + i * 0.1, duration: 1, ease: "circOut" }}
                    className="w-2 bg-primary rounded-t-[1px]" 
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 bg-secondary rounded-[4px] border border-border group hover:border-primary transition-colors cursor-pointer">
                <div className="flex justify-between items-start mb-4">
                   <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em]">P99 Latency</p>
                   <Zap size={14} className="text-primary" />
                </div>
                <p className="text-4xl font-bold text-foreground font-mono">14<span className="text-sm font-bold text-muted-foreground ml-1">ms</span></p>
                <div className="w-full bg-border h-1 rounded-full mt-6 overflow-hidden">
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: '85%' }}
                     transition={{ delay: 1, duration: 1.5 }}
                     className="h-full bg-tech-emerald" 
                   />
                </div>
              </div>
              <div className="p-6 bg-secondary rounded-[4px] border border-border group hover:border-primary transition-colors cursor-pointer">
                <div className="flex justify-between items-start mb-4">
                   <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Node Reliability</p>
                   <Server size={14} className="text-primary" />
                </div>
                <p className="text-4xl font-bold text-tech-emerald font-mono">99.99<span className="text-sm font-bold text-muted-foreground ml-1">%</span></p>
                <div className="flex gap-1 mt-6">
                   {[1,1,1,1,1,1,1,0.5, 0.2].map((o, i) => (
                     <div key={i} className="flex-1 h-1 bg-tech-emerald rounded-full" style={{ opacity: o }} />
                   ))}
                </div>
              </div>
            </div>

            {/* List Row */}
            <div className="mt-8 pt-8 border-t border-border flex items-center justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] font-mono">
               <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-tech-emerald animate-pulse" />
                  Live Stream: /api/v1/telemetry
               </div>
               <div className="flex items-center gap-4">
                  <span>Inbound: 1.2M</span>
                  <span>Errors: 0.01%</span>
               </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Technical Blueprint Elements */}
      <div className="absolute -top-12 -left-12 w-32 h-32 border-t border-l border-border -z-10" />
      <div className="absolute -bottom-12 -right-12 w-32 h-32 border-b border-r border-border -z-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-technical-grid bg-[length:40px_40px] opacity-10 -z-20" />
    </div>
  );
}
