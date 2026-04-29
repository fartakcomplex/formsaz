'use client';

import React from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export default function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <div dir="rtl" className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="mx-auto w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
          <AlertTriangle className="w-10 h-10 text-red-500" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">خطا در بارگذاری</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            متأسفانه در بارگذاری این بخش خطایی رخ داد. لطفاً دوباره تلاش کنید.
          </p>
          {error?.message && (
            <p className="text-xs text-red-400 bg-red-50 dark:bg-red-950/20 rounded-lg p-3 font-mono break-all">
              {error.message}
            </p>
          )}
        </div>
        <div className="flex gap-3 justify-center">
          <Button onClick={resetErrorBoundary} variant="outline" className="gap-2">
            <RotateCcw className="w-4 h-4" />
            تلاش مجدد
          </Button>
          <Button onClick={() => window.location.href = '/'} className="gap-2">
            <Home className="w-4 h-4" />
            بازگشت به خانه
          </Button>
        </div>
      </div>
    </div>
  );
}
