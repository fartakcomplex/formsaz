'use client';

import { useAppStore } from '@/lib/store';
import { AnimatePresence, motion } from 'framer-motion';
import LandingPage from '@/components/landing/landing-page';
import FormBuilder from '@/components/form-builder/form-builder';
import Dashboard from '@/components/dashboard/dashboard';
import FormFill from '@/components/dashboard/form-fill';
import ResultsView from '@/components/dashboard/results-view';
import TemplateLibraryPage from '@/components/dashboard/template-library-page';
import dynamic from 'next/dynamic';
import AppHeader from '@/components/app-header';
import { ScrollToTop } from '@/components/ui/scroll-to-top';
import { useEffect } from 'react';

const AdminPanel = dynamic(() => import('@/components/admin/admin-panel'), { ssr: false });
const UserPanel = dynamic(() => import('@/components/user-panel/user-panel'), { ssr: false });

const pageVariants = {
  initial: { opacity: 0 },
  in: { opacity: 1 },
  out: { opacity: 0 },
};

const pageTransition = {
  type: 'tween' as const,
  ease: 'anticipate' as const,
  duration: 0.25,
};

// Full-height panel views that fill the viewport without page-level animation
const fullHeightViews = ['admin', 'user-panel'];

export default function Home() {
  const { currentView, setCurrentView } = useAppStore();

  const isFullHeight = fullHeightViews.includes(currentView);

  useEffect(() => {
    (window as unknown as Record<string, unknown>).__nav = setCurrentView;
  }, [setCurrentView]);

  // Full-height panels render without AnimatePresence to avoid
  // height conflicts between exiting/entering views of very different sizes
  if (isFullHeight) {
    return (
      <div className="h-screen overflow-hidden">
        <div className="h-full overflow-hidden">
          {currentView === 'admin' && <AdminPanel />}
          {currentView === 'user-panel' && <UserPanel />}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentView}
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={pageTransition}
          className="flex-1 flex flex-col"
        >
          {currentView === 'landing' && <LandingPage />}
          {currentView !== 'landing' && <AppHeader />}
          {currentView === 'builder' && <FormBuilder />}
          {currentView === 'dashboard' && <Dashboard />}
          {currentView === 'fill' && <FormFill />}
          {currentView === 'results' && <ResultsView />}
          {currentView === 'templates' && <TemplateLibraryPage />}
        </motion.div>
      </AnimatePresence>
      <ScrollToTop />
    </div>
  );
}
