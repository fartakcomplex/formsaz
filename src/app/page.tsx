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

const AdminPanel = dynamic(() => import('@/components/admin/admin-panel'), { ssr: false });
const UserPanel = dynamic(() => import('@/components/user-panel/user-panel'), { ssr: false });

const pageVariants = { initial: { opacity: 0, y: 10 }, in: { opacity: 1, y: 0 }, out: { opacity: 0, y: -10 } };
const pageTransition = { type: 'tween' as const, ease: 'easeOut' as const, duration: 0.2 };

export default function Home() {
  const { currentView } = useAppStore();
  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div key={currentView} initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
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
      <ScrollToTop />
    </>
  );
}
