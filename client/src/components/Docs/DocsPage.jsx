import React, { useState, useEffect } from 'react';
import DocsSidebar from './DocsSidebar';
import DocsContent from './DocsContent';

export default function DocsPage() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState('quickstart');

  useEffect(() => {
    // Check screen size to auto-collapse sidebar on mobile
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Setup Intersection Observer to detect which section is in view
    const observerOptions = {
      root: null,
      rootMargin: '-10% 0px -80% 0px', // Trigger earlier when scrolling down
      threshold: 0
    };

    const handleIntersect = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);

    // Observe all sections
    const sections = ['quickstart', 'frameworks', 'configuration', 'data-privacy', 'dashboard', 'troubleshooting', 'api-reference'];
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground selection:bg-primary/20">
      <DocsSidebar
        activeSection={activeSection}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      <main className="flex-1 overflow-y-auto scrollbar-hide bg-background/50 relative">
        <DocsContent />
      </main>
    </div>
  );
}
