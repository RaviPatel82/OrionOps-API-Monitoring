import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AlertCircle, X } from "lucide-react";
import { getProfile, logout as apiLogout, getDashboard, canViewDashboard } from "./api";
import Sidebar from "./components/Dashboard/Sidebar.jsx";
import DashboardHeader from "./components/Dashboard/DashboardHeader.jsx";
import MetricsPanel from "./components/Dashboard/MetricsPanel/index.jsx";
import TeamPanel from "./components/Dashboard/TeamPanel/index.jsx";
import ApiPanel from "./components/Dashboard/ApiPanel/index.jsx";
import ApiHitsPanel from "./components/Dashboard/ApiHitsPanel/index.jsx";
import AnalyticsPanel from "./components/Dashboard/AnalyticsPanel/index.jsx";

import { getSharedMockData } from "./mockData.js";

export default function DashboardPage({ user, onRequireAuth, onNavigateHome, onLogout: parentLogout }) {
  const [profile, setProfile] = useState(user || null);
  const [profileState, setProfileState] = useState(user ? "ok" : "loading");
  const [range, setRange] = useState("24h");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);
  const [currentView, setCurrentView] = useState("metrics");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const isGuest = profile?.role === "GUEST";

  useEffect(() => {
    if (user) {
      setProfile(user);
      setProfileState("ok");
      return;
    }

    const saved = localStorage.getItem("orionops_user");
    if (saved) {
      const parsed = JSON.parse(saved);
      setProfile(parsed);
      setProfileState("ok");
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const res = await getProfile();
        if (!cancelled) {
          setProfile(res.data);
          setProfileState("ok");
          localStorage.setItem("orionops_user", JSON.stringify(res.data));
        }
      } catch {
        if (!cancelled) {
          setProfile(null);
          setProfileState("unauthorized");
          onRequireAuth();
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [onRequireAuth, user]);

  const onLogout = async () => {
    localStorage.removeItem("orionops_user");
    if (isGuest || profile?.isDemo) {
      parentLogout();
      return;
    }
    try {
      await apiLogout();
    } catch {
      /* ignore */
    }
    parentLogout();
  };

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      if (isGuest || profile?.isDemo) {
        await new Promise((r) => setTimeout(r, 100));
        setData(getSharedMockData(range).dashboardData);
      } else {
        const end = Date.now();
        let start = end - 24 * 60 * 60 * 1000;
        if (range === "7d") start = end - 7 * 24 * 60 * 60 * 1000;
        if (range === "1h") start = end - 60 * 60 * 1000;
        const res = await getDashboard({ startTime: String(start), endTime: String(end) });
        // API returns { success, data: { stats, topEndpoints, recentActivity } }
        const payload = res.data || res;
        setData(payload);
      }
    } catch (e) {
      setError(e.message || "Failed to sync with infrastructure.");
    } finally {
      setLoading(false);
    }
  }, [range, isGuest, profile]);



  useEffect(() => {
    if (profileState !== "ok" || !canViewDashboard(profile)) return undefined;

    // Default to metrics view
    const id = requestAnimationFrame(() => {
      void loadDashboard();
    });
    return () => cancelAnimationFrame(id);
  }, [loadDashboard, profileState, profile, currentView]);

  if (profileState === "loading") {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-background">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="h-10 w-10 border-[3px] border-border/20 border-t-primary rounded-full mb-4"
        />
        <p className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-[0.4em] animate-pulse">
          Initializing Protocol...
        </p>
      </div>
    );
  }

  if (profileState === "unauthorized" || !canViewDashboard(profile)) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="text-center">
          <AlertCircle className="h-10 w-10 text-primary mx-auto mb-4 opacity-20" />
          <p className="text-primary font-mono font-bold uppercase tracking-[0.2em] text-[10px]">
            Access Revoked. Re-authenticating...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground selection:bg-primary/20">
      <Sidebar
        profile={profile}
        currentView={currentView}
        setCurrentView={setCurrentView}
        onLogout={onLogout}
        onBackHome={onNavigateHome}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />

      <div className="flex flex-col flex-1 overflow-hidden">
        <DashboardHeader
          profile={profile}
          range={range}
          setRange={setRange}
        />

        <main className="flex-1 overflow-y-auto scrollbar-hide bg-background/50">
          {error && (
            <div className="bg-primary/5 border-b border-primary/10 px-8 py-2 flex items-center justify-between">
              <span className="text-[9px] font-mono font-bold text-primary uppercase tracking-widest">
                {error}
              </span>
              <button
                onClick={() => setError("")}
                className="text-primary opacity-50 hover:opacity-100 cursor-pointer"
              >
                <X size={12} />
              </button>
            </div>
          )}
          <div className="min-h-full">
            {currentView === "hits" && <ApiHitsPanel profile={profile} range={range} />}
            {currentView === "team" && <TeamPanel profile={profile} />}
            {currentView === "api" && <ApiPanel profile={profile} />}
            {currentView === "metrics" && (
              <MetricsPanel data={data} loading={loading} setCurrentView={setCurrentView} />
            )}
            {currentView === "analytics" && (
              <AnalyticsPanel profile={profile} range={range} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
