import React, { useState, useMemo, useCallback, useEffect } from "react";
import { RefreshCw, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import { getSharedMockData } from "../../../mockData.js";
import { getHits } from "../../../api/analytics.js";
import { ITEMS_PER_PAGE } from "./constants.js";

import SkeletonRow from "./components/SkeletonRow.jsx";
import SummaryCards from "./components/SummaryCards.jsx";
import SearchAndFilters from "./components/SearchAndFilters.jsx";
import HitRow from "./components/HitRow.jsx";
import Pagination from "./components/Pagination.jsx";

export default function ApiHitsPanel({ profile, range }) {
  const [hits, setHits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [methodFilter, setMethodFilter] = useState("All");
  const [expandedRow, setExpandedRow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const isGuest = profile?.role === "GUEST" || profile?.isDemo;

  /* ── data fetching ── */
  const fetchHits = useCallback(async () => {
    setLoading(true);
    try {
      if (isGuest) {
        await new Promise((r) => setTimeout(r, 100));
        setHits(getSharedMockData(range).hits);
      } else {
        const end = Date.now();
        let start = end - 24 * 60 * 60 * 1000;
        if (range === "7d") start = end - 7 * 24 * 60 * 60 * 1000;
        if (range === "1h") start = end - 60 * 60 * 1000;

        const res = await getHits({
          filters: {
            startTime: new Date(start).toISOString(),
            endTime: new Date(end).toISOString()
          }
        });
        const payload = res?.data?.hits || res?.data || res;
        const rawHits = Array.isArray(payload) ? payload : [];

        // Map backend fields to the keys expected by the panel
        const mappedHits = rawHits.map(h => ({
          ...h,
          path: h.endpoint || h.path || "Unknown",
          service: h.serviceName || h.service || "Unknown",
          latency: h.latencyMs ?? h.latency ?? 0
        }));

        setHits(mappedHits);
      }
    } catch {
      setHits([]);
    } finally {
      setLoading(false);
    }
  }, [isGuest, range]);

  useEffect(() => { fetchHits(); }, [fetchHits]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchHits();
    setIsRefreshing(false);
  };

  /* ── filtering & search ── */
  const filteredHits = useMemo(() => {
    let result = hits;
    if (statusFilter !== "All") {
      const range = parseInt(statusFilter[0]) * 100;
      result = result.filter((h) => h.statusCode >= range && h.statusCode < range + 100);
    }
    if (methodFilter !== "All") {
      result = result.filter((h) => h.method === methodFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (h) =>
          h.path.toLowerCase().includes(q) ||
          h.service.toLowerCase().includes(q) ||
          h.ip?.toLowerCase().includes(q) ||
          String(h.statusCode).includes(q)
      );
    }
    return result;
  }, [hits, statusFilter, methodFilter, search]);

  /* ── computed stats ── */
  const stats = useMemo(() => {
    const total = filteredHits.length;
    const success = filteredHits.filter((h) => h.statusCode >= 200 && h.statusCode < 400).length;
    const errors = filteredHits.filter((h) => h.statusCode >= 400).length;
    const avgLatency = total > 0 ? Math.round(filteredHits.reduce((a, h) => a + h.latency, 0) / total) : 0;
    return { total, success, errors, avgLatency };
  }, [filteredHits]);

  /* ── pagination ── */
  const totalPages = Math.ceil(filteredHits.length / ITEMS_PER_PAGE);
  const paginatedHits = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredHits.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredHits, currentPage]);

  useEffect(() => { setCurrentPage(1); }, [search, statusFilter, methodFilter]);

  const fmtTs = (ts) => {
    const d = new Date(ts);
    return d.toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" });
  };

  /* ════════════════ RENDER ════════════════ */
  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-[1440px] mx-auto bg-background bg-grid-pattern min-h-full relative">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-[1px] pointer-events-none" />

      {/* ── Page Header ── */}
      <div className="relative flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 z-10 mb-6">
        <div className="flex flex-col gap-1.5 border-l-[3px] border-border pl-5">
          <h1 className="text-2xl font-bold tracking-tighter text-foreground uppercase">API Request Log</h1>
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">
            Complete audit trail of all inbound API requests across your infrastructure.
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing || loading}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-md border border-border text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground hover:border-primary/60 transition-all duration-200 cursor-pointer bg-secondary/20",
            (isRefreshing || loading) && "opacity-50 pointer-events-none"
          )}
        >
          <RefreshCw size={12} className={cn((isRefreshing || loading) && "animate-spin")} />
          Refresh
        </button>
      </div>

      {loading ? (
        /* ── Loading Skeleton ── */
        <div className="relative">
          {/* Stat cards skeleton */}
          <div className="relative bento-grid mb-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bento-item flex flex-col justify-between animate-pulse">
                <div className="flex justify-between items-start">
                  <div className="h-2.5 w-20 rounded bg-border" />
                  <div className="h-8 w-8 rounded-lg bg-border/50" />
                </div>
                <div className="h-8 w-28 rounded bg-border mt-6 mb-4" />
                <div className="h-px w-full bg-border/50" />
                <div className="h-2 w-32 rounded bg-border/50 mt-4" />
              </div>
            ))}
          </div>

          {/* Table skeleton */}
          <div className="relative bento-item w-full p-0 overflow-hidden animate-pulse">
            <div className="p-4 border-b border-border/50 flex flex-col sm:flex-row gap-3">
              <div className="h-10 w-full rounded bg-border/50" />
              <div className="h-10 w-24 rounded bg-border/50 shrink-0" />
            </div>
            <div className="hidden md:grid grid-cols-[28px_64px_1fr_100px_64px_72px_120px] items-center px-6 py-3 border-b border-border/50 gap-x-3">
              {Array.from({ length: 7 }).map((_, i) => <div key={i} className="h-3 w-12 bg-border rounded" />)}
            </div>
            <div>
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonRow key={i} />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="relative">
          <SummaryCards stats={stats} />

          {/* ── Search & Filters ── */}
          <div className="relative bento-item w-full p-0 overflow-hidden flex flex-col">
            <SearchAndFilters
              search={search}
              setSearch={setSearch}
              showFilters={showFilters}
              setShowFilters={setShowFilters}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              methodFilter={methodFilter}
              setMethodFilter={setMethodFilter}
            />

            {/* ── Table header (desktop) ── */}
            <div className="hidden md:grid grid-cols-[28px_64px_1fr_100px_64px_72px_120px] items-center px-4 py-2 border-b border-border/50 bg-secondary/5 gap-x-3">
              <span />
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.15em]">Method</span>
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.15em]">Endpoint</span>
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.15em]">Service</span>
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.15em]">Status</span>
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.15em]">Latency</span>
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.15em] text-right">Timestamp</span>
            </div>

            {/* ── Empty state ── */}
            {filteredHits.length === 0 && (
              <div className="flex flex-col items-center justify-center py-24 gap-3">
                <Layers size={40} strokeWidth={1} className="text-muted-foreground opacity-20" />
                <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground opacity-30">
                  No requests match your filters
                </p>
              </div>
            )}

            {/* ── Data rows ── */}
            {paginatedHits.map((hit) => (
              <HitRow
                key={hit.id}
                hit={hit}
                isExpanded={expandedRow === hit.id}
                onToggleExpand={() => setExpandedRow(expandedRow === hit.id ? null : hit.id)}
                fmtTs={fmtTs}
              />
            ))}

            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalItems={filteredHits.length}
            />
          </div>
        </div>
      )}
    </div>
  );
}
