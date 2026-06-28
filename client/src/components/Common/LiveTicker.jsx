import { useState, useEffect } from "react";
import { Activity } from "lucide-react";

const SAMPLE_EVENTS = [
    { service: 'auth-service', endpoint: '/api/user/login', method: 'GET', status: 200, latency: 42 },
    { service: 'billing-service', endpoint: '/api/invoices', method: 'POST', status: 201, latency: 118 },
    { service: 'auth-service', endpoint: '/api/user/refresh', method: 'POST', status: 200, latency: 31 },
    { service: 'search-service', endpoint: '/api/search/query', method: 'GET', status: 200, latency: 89 },
    { service: 'billing-service', endpoint: '/api/invoices/4471', method: 'GET', status: 404, latency: 22 },
    { service: 'notif-service', endpoint: '/api/notify/send', method: 'POST', status: 500, latency: 305 },
    { service: 'auth-service', endpoint: '/api/user/login', method: 'GET', status: 200, latency: 38 },
    { service: 'search-service', endpoint: '/api/search/suggest', method: 'GET', status: 200, latency: 14 },
];

function statusClass(status) {
    if (status >= 500) return 'text-tech-rose bg-tech-rose/10';
    if (status >= 400) return 'text-amber-500 bg-amber-500/10';
    return 'text-tech-emerald bg-tech-emerald/10';
}

function methodClass(method) {
    if (method === 'GET') return 'text-primary';
    if (method === 'POST') return 'text-[#f59e0b]'; // amber
    if (method === 'PUT') return 'text-[#3b82f6]'; // blue
    if (method === 'DELETE') return 'text-[#ef4444]'; // red
    return 'text-foreground';
}

export function LiveTicker() {
    const [feed, setFeed] = useState(SAMPLE_EVENTS.slice(0, 6));
    const [cursor, setCursor] = useState(6);

    useEffect(() => {
        const id = setInterval(() => {
            setFeed((prev) => {
                const next = SAMPLE_EVENTS[cursor % SAMPLE_EVENTS.length];
                return [{ ...next, latency: next.latency + Math.round(Math.random() * 12 - 6), id: Date.now() }, ...prev.slice(0, 5)];
            });
            setCursor((c) => c + 1);
        }, 1500);
        return () => clearInterval(id);
    }, [cursor]);

    return (
        <div className="w-full bg-secondary border border-border rounded-lg overflow-hidden flex flex-col font-mono shadow-xl relative max-w-2xl">
            {/* Header */}
            <div className="px-4 py-3 bg-black/20 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Activity size={14} className="text-primary animate-pulse" />
                    <span className="text-[10px] font-bold text-foreground uppercase tracking-[0.2em]">Live Traffic Stream</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary animate-ping relative inline-flex" />
                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Listening</span>
                </div>
            </div>

            {/* Table Header */}
            <div className="px-4 py-2 border-b border-border/50 bg-background/30 flex items-center gap-4 text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                <span className="w-12">Method</span>
                <span className="flex-1">Endpoint</span>
                <span className="w-16">Status</span>
                <span className="w-16 text-right">Latency</span>
            </div>

            {/* Feed Rows */}
            <div className="flex-1 flex flex-col overflow-hidden relative">
                {feed.map((e, i) => (
                    <div
                        key={e.id || i}
                        className="px-4 py-2.5 flex items-center gap-4 text-[11px] border-b border-border/30 last:border-0 hover:bg-white/5 transition-colors"
                    >
                        <span className={`w-12 font-bold ${methodClass(e.method)}`}>{e.method}</span>
                        <span className="flex-1 text-muted-foreground truncate">{e.endpoint}</span>
                        <span className={`w-16 px-1.5 py-0.5 rounded flex items-center justify-center font-bold text-[10px] ${statusClass(e.status)}`}>
                            {e.status}
                        </span>
                        <span className="w-16 text-right text-muted-foreground/80">{e.latency}ms</span>
                    </div>
                ))}
            </div>
        </div>
    );
}