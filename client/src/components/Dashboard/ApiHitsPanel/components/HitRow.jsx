import React from "react";
import { AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatLatency } from "../../../../utils.js";
import { METHOD_COLORS } from "../constants.js";
import { getStatusStyle } from "../utils.js";
import HitDetail from "./HitDetail.jsx";

export default function HitRow({ hit, isExpanded, onToggleExpand, fmtTs }) {
  const mc = METHOD_COLORS[hit.method] || METHOD_COLORS.GET;
  const ss = getStatusStyle(hit.statusCode);

  return (
    <div>
      {/* Desktop row */}
      <button
        onClick={onToggleExpand}
        className={cn(
          "w-full hidden md:grid grid-cols-[28px_64px_1fr_100px_64px_72px_120px] items-center px-4 py-2 border-b border-border/50 transition-colors duration-150 cursor-pointer text-left gap-x-3",
          isExpanded
            ? "bg-accent/20 border-l-[3px] border-l-primary"
            : "hover:bg-accent/20"
        )}
      >
        {/* Chevron */}
        <ChevronRight
          size={12}
          className={cn(
            "text-muted-foreground transition-transform duration-200",
            isExpanded && "rotate-90 text-primary"
          )}
        />

        {/* Method */}
        <span className={cn("text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-[3px] border inline-block w-fit", mc.bg, mc.text, mc.border)}>
          {hit.method}
        </span>

        {/* Path */}
        <p className="font-mono font-semibold text-[12px] text-foreground truncate tracking-tight">{hit.path}</p>

        {/* Service */}
        <span className="text-[10px] font-mono font-semibold text-muted-foreground uppercase tracking-wider truncate">{hit.service}</span>

        {/* Status */}
        <span className={cn("text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border inline-block w-fit", ss.bg, ss.text, ss.border)}>
          {hit.statusCode}
        </span>

        {/* Latency */}
        <span className={cn(
          "text-[11px] font-mono font-bold",
          hit.latency > 500 ? "text-tech-rose" : hit.latency > 200 ? "text-amber-400" : "text-emerald-400"
        )}>
          {formatLatency(hit.latency)}
        </span>

        {/* Timestamp */}
        <span className="text-[10px] font-mono font-semibold text-muted-foreground text-right">
          {fmtTs(hit.timestamp)}
        </span>
      </button>

      {/* Mobile card (responsive: card layout below md) */}
      <button
        onClick={onToggleExpand}
        className={cn(
          "w-full md:hidden px-4 py-2 border-b border-border transition-colors duration-150 cursor-pointer text-left",
          isExpanded ? "bg-accent/20" : "hover:bg-accent/20"
        )}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className={cn("text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded-[3px] border", mc.bg, mc.text, mc.border)}>
              {hit.method}
            </span>
            <span className={cn("text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border", ss.bg, ss.text, ss.border)}>
              {hit.statusCode}
            </span>
          </div>
          <span className={cn(
            "text-[10px] font-mono font-bold",
            hit.latency > 500 ? "text-tech-rose" : hit.latency > 200 ? "text-amber-400" : "text-emerald-400"
          )}>
            {formatLatency(hit.latency)}
          </span>
        </div>
        <p className="font-mono font-semibold text-[11px] text-foreground truncate tracking-tight">{hit.path}</p>
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-[9px] font-mono text-muted-foreground uppercase">{hit.service}</span>
          <span className="text-[9px] font-mono text-muted-foreground">{fmtTs(hit.timestamp)}</span>
        </div>
      </button>

      {/* Expanded detail */}
      <AnimatePresence>
        {isExpanded && <HitDetail hit={hit} />}
      </AnimatePresence>
    </div>
  );
}
