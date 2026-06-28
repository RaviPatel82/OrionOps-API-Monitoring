import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, BookOpen, Rocket, Code2, Settings, Shield, Layout, Wrench, FileJson } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

export default function DocsSidebar({ activeSection, isCollapsed, setIsCollapsed }) {
  const navigate = useNavigate();

  const sections = [
    { id: 'quickstart', label: 'Quickstart', icon: Rocket },
    { id: 'frameworks', label: 'Frameworks', icon: Code2 },
    { id: 'configuration', label: 'Configuration', icon: Settings },
    { id: 'data-privacy', label: 'Data & Privacy', icon: Shield },
    { id: 'dashboard', label: 'Dashboard Walkthrough', icon: Layout },
    { id: 'troubleshooting', label: 'Troubleshooting', icon: Wrench },
    { id: 'api-reference', label: 'API Reference', icon: FileJson },
  ];

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 256 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="border-r border-border bg-card flex flex-col h-full py-6 px-4 relative z-20 group/sidebar shrink-0"
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-24 h-6 w-6 bg-card border border-border rounded-full flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all z-30 shadow-sm cursor-pointer"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Brand Section */}
      <div className={cn(
        "flex items-center mb-10 px-2",
        isCollapsed ? "justify-center" : "justify-between"
      )}>
        <div
          className="flex items-center gap-3.5 group cursor-pointer overflow-hidden"
          onClick={() => navigate('/')}
        >
          <div className="flex-shrink-0">
            <h2 className="text-[26px] font-bold tracking-tighter text-foreground leading-none uppercase">
              O<span className="text-primary">.</span>
              <AnimatePresence mode="wait">
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    rionOps
                  </motion.span>
                )}
              </AnimatePresence>
            </h2>
          </div>
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto space-y-8 scrollbar-hide overflow-x-hidden">
        <div>
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.h3
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-[11px] font-bold text-foreground uppercase tracking-[0.2em] mb-4 border-b border-border pb-2 whitespace-nowrap flex items-center gap-2"
              >
                <BookOpen size={12} className="text-primary" /> Documentation
              </motion.h3>
            )}
          </AnimatePresence>
          <nav className="space-y-1.5">
            {sections.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={cn(
                  "w-full flex items-center px-3 py-2.5 rounded-md text-[13px] font-bold transition-all group/item cursor-pointer",
                  activeSection === item.id
                    ? "text-foreground bg-accent shadow-active-tab"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/40",
                  isCollapsed ? "justify-center" : "justify-between"
                )}
                title={isCollapsed ? item.label : ""}
              >
                <div className="flex items-center gap-3">
                  <item.icon
                    size={18}
                    className={cn(
                      "transition-colors flex-shrink-0",
                      activeSection === item.id
                        ? "text-primary"
                        : "text-muted-foreground group-hover/item:text-foreground",
                    )}
                  />
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="tracking-tight whitespace-nowrap text-left"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </div>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Footer Nav */}
      <div className="mt-auto pt-6 border-t border-border overflow-hidden">
         <button
          onClick={() => navigate('/')}
          className={cn(
            "w-full flex items-center gap-3 px-3 h-10 rounded-md text-[12px] font-bold transition-all text-foreground border border-border hover:border-primary hover:text-primary cursor-pointer",
            isCollapsed && "justify-center border-transparent hover:bg-transparent hover:text-primary"
          )}
          title={isCollapsed ? "Back to Home" : ""}
        >
          <Layout size={16} />
          {!isCollapsed && <span>Back to Home</span>}
        </button>
      </div>
    </motion.aside>
  );
}
