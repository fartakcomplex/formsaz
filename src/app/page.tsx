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

const AdminPanel = dynamic(() => import('@/components/admin/admin-panel'), { ssr: false });
const UserPanel = dynamic(() => import('@/components/user-panel/user-panel'), { ssr: false });

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
};

const pageTransition = {
  type: 'tween' as const,
  ease: 'anticipate' as const,
  duration: 0.3,
};

export default function Home() {
  const { currentView } = useAppStore();

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
          {currentView !== 'landing' && currentView !== 'admin' && currentView !== 'user-panel' && <AppHeader />}
          {currentView === 'builder' && <FormBuilder />}
          {currentView === 'dashboard' && <Dashboard />}
          {currentView === 'fill' && <FormFill />}
          {currentView === 'results' && <ResultsView />}
          {currentView === 'templates' && <TemplateLibraryPage />}
          {currentView === 'admin' && <AdminPanel />}
          {currentView === 'user-panel' && <UserPanel />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
