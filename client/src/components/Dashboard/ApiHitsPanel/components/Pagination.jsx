import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatNumber } from "../../../../utils.js";

export default function Pagination({ totalPages, currentPage, setCurrentPage, totalItems }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-secondary/5">
      <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest">
        {formatNumber(totalItems)} results · Page {currentPage}/{totalPages}
      </span>
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className={cn(
            "p-1.5 rounded border border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all duration-200 cursor-pointer bg-card",
            currentPage === 1 && "opacity-25 pointer-events-none"
          )}
        >
          <ChevronLeft size={14} />
        </button>

        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
          let page;
          if (totalPages <= 5) page = i + 1;
          else if (currentPage <= 3) page = i + 1;
          else if (currentPage >= totalPages - 2) page = totalPages - 4 + i;
          else page = currentPage - 2 + i;
          return (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={cn(
                "h-7 w-7 rounded-md text-[11px] font-bold transition-all duration-200 cursor-pointer border",
                currentPage === page
                  ? "bg-primary/10 text-primary border-primary/30"
                  : "text-muted-foreground border-transparent hover:text-foreground hover:border-border"
              )}
            >
              {page}
            </button>
          );
        })}

        <button
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className={cn(
            "p-1.5 rounded border border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all duration-200 cursor-pointer bg-card",
            currentPage === totalPages && "opacity-25 pointer-events-none"
          )}
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
