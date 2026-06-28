import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export const getRoleBadge = (role) => {
  const isAdmin = role === 'client_admin';
  return (
    <Badge className={cn(
      "rounded-[4px] px-1.5 py-0.5 font-bold uppercase text-[8px] border shadow-none",
      isAdmin ? "bg-primary/5 text-primary border-primary/20" : "bg-tech-emerald/10 text-tech-emerald border-tech-emerald/20"
    )}>
      {isAdmin ? 'Admin' : 'Viewer'}
    </Badge>
  );
};
