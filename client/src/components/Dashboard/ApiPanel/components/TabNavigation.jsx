import React from 'react';
import { cn } from '@/lib/utils';
import { Key, Plus } from 'lucide-react';

const TabButton = ({ id, label, icon: Icon, activeTab, setActiveTab, setGeneratedKey }) => (
  <button
    onClick={() => { setActiveTab(id); setGeneratedKey(null); }}
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

export default function TabNavigation({ activeTab, setActiveTab, setGeneratedKey }) {
  return (
    <div className="flex border-b border-border bg-card sticky top-0 z-10">
      <TabButton id="keys" label="API Keys" icon={Key} activeTab={activeTab} setActiveTab={setActiveTab} setGeneratedKey={setGeneratedKey} />
      <TabButton id="generate" label="Generate Key" icon={Plus} activeTab={activeTab} setActiveTab={setActiveTab} setGeneratedKey={setGeneratedKey} />
    </div>
  );
}
