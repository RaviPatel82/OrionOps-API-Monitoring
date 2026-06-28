import React from 'react';
import { cn } from '@/lib/utils';

export default function OrganizationSelector({ clients, selectedClient, selectClient }) {
  return (
    <div className="relative bento-item bg-card/40 border border-border/50 p-3 flex items-center gap-4 overflow-x-auto">
      <span className="text-[8px] font-mono font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap">Selected Organization:</span>
      <div className="flex items-center gap-2">
        {clients.map(client => {
          const clientId = client._id || client.id;
          const selectedId = selectedClient?._id || selectedClient?.id;
          const isSelected = selectedId && clientId === selectedId;
          return (
            <button
              key={clientId}
              onClick={() => selectClient(client)}
              className={cn(
                "px-2.5 py-1 rounded-md border text-[10px] font-bold uppercase transition-all whitespace-nowrap cursor-pointer",
                isSelected
                  ? "bg-primary text-primary-foreground border-primary shadow-[0_2px_10px_rgba(99,102,241,0.2)]"
                  : "bg-background text-foreground border-border hover:text-primary hover:border-primary"
              )}
            >
              {client.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
