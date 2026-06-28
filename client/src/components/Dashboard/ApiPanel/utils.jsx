import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export const getEnvBadge = (env) => {
  const isProd = env === 'production';
  return (
    <Badge className={cn(
      "rounded-[4px] px-1.5 py-0.5 font-bold uppercase text-[8px] border shadow-none",
      isProd ? "bg-tech-rose/10 text-tech-rose border-tech-rose/20" : "bg-primary/5 text-primary border-primary/20"
    )}>
      {env}
    </Badge>
  );
};
