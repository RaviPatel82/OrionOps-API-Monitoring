import React from 'react';
import { cn } from '@/lib/utils';
import { UserCheck, UserPlus2 } from 'lucide-react';

const TabButton = ({ id, label, icon: Icon, activeTab, setActiveTab }) => (
  <button
    onClick={() => setActiveTab(id)}
    className={cn(
      "flex items-center gap-2 px-6 h-12 border-r border-border text-[11px] font-mono font-bold uppercase tracking-widest transition-all cursor-pointer",
      activeTab === id
        ? "bg-accent text-foreground"
        : "bg-transparent text-muted-foreground hover:bg-accent/40 hover:text-foreground"
    )}
  >
    <Icon size={14} />
    {label}
  </button>
);

export default function TabNavigation({ activeTab, setActiveTab }) {
  return (
    <div className="flex border-b border-border bg-card sticky top-0 z-10">
      <TabButton id="roster" label="Member List" icon={UserCheck} activeTab={activeTab} setActiveTab={setActiveTab} />
      <TabButton id="provisioning" label="Add New Member" icon={UserPlus2} activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
