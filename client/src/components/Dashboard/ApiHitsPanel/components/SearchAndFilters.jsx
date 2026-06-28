import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { STATUS_FILTERS, METHOD_FILTERS, METHOD_COLORS } from "../constants.js";

export default function SearchAndFilters({
  search,
  setSearch,
  showFilters,
  setShowFilters,
  statusFilter,
  setStatusFilter,
  methodFilter,
  setMethodFilter,
}) {
  return (
    <>
      {/* Toolbar */}
      <div className="p-3 border-b border-border/50 flex flex-col sm:flex-row gap-2 bg-secondary/10">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            id="api-hits-search"
            type="text"
            placeholder="Search by endpoint, service, IP, or status code…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-secondary/40 border border-border rounded-md text-[12px] font-mono text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all duration-200"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 rounded-md border text-[11px] font-bold uppercase tracking-widest transition-all duration-200 cursor-pointer",
            showFilters
              ? "border-primary text-primary bg-primary/5"
              : "border-border text-muted-foreground hover:text-foreground hover:border-primary/50"
          )}
        >
          <Filter size={12} />
          Filters
          <ChevronDown size={12} className={cn("transition-transform duration-200", showFilters && "rotate-180")} />
        </button>
      </div>

      {/* Collapsible filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden border-b border-border"
          >
            <div className="p-4 bg-secondary/10 flex flex-col sm:flex-row gap-6">
              {/* Status code */}
              <div>
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.15em] block mb-2">Status Code</span>
                <div className="flex gap-1.5 flex-wrap">
                  {STATUS_FILTERS.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setStatusFilter(opt)}
                      className={cn(
                        "px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer border",
                        statusFilter === opt
                          ? "bg-primary/10 text-primary border-primary/30"
                          : "bg-card text-muted-foreground border-border hover:text-foreground hover:border-primary/40"
                      )}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* HTTP method */}
              <div>
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.15em] block mb-2">HTTP Method</span>
                <div className="flex gap-1.5 flex-wrap">
                  {METHOD_FILTERS.map((opt) => {
                    const mc = METHOD_COLORS[opt];
                    return (
                      <button
                        key={opt}
                        onClick={() => setMethodFilter(opt)}
                        className={cn(
                          "px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer border",
                          methodFilter === opt
                            ? mc ? `${mc.bg} ${mc.text} ${mc.border}` : "bg-primary/10 text-primary border-primary/30"
                            : "bg-card text-muted-foreground border-border hover:text-foreground hover:border-primary/40"
                        )}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
