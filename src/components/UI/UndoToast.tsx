import React, { useEffect, useState } from 'react';
import { RotateCcw, X, BookmarkCheck } from 'lucide-react';

export interface UndoToastData {
  id: string;
  message: string;
  onUndo: () => void;
  durationMs?: number;
}

interface UndoToastProps {
  toast: UndoToastData | null;
  onDismiss: () => void;
}

export const UndoToast: React.FC<UndoToastProps> = ({ toast, onDismiss }) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!toast) return;

    const duration = toast.durationMs || 7000;
    const interval = 100;
    const step = (interval / duration) * 100;

    setProgress(100);

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= step) {
          clearInterval(timer);
          onDismiss();
          return 0;
        }
        return prev - step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [toast, onDismiss]);

  if (!toast) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[3000] w-[92%] max-w-md pb-safe"
    >
      <div className="flex flex-col bg-[#123C3A] text-white rounded-card border border-[#19C7B1]/40 shadow-2xl overflow-hidden backdrop-blur-xl">
        <div className="flex items-center justify-between p-3.5 gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-8 h-8 rounded-full bg-[#19C7B1]/20 flex items-center justify-center shrink-0 text-[#19C7B1]">
              <BookmarkCheck className="w-4 h-4" />
            </span>
            <p className="text-xs font-medium text-white truncate text-pretty">
              {toast.message}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                toast.onUndo();
                onDismiss();
              }}
              className="min-h-[44px] px-3 rounded-btn bg-[#19C7B1] hover:bg-white hover:text-[#123C3A] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-glow-teal-sm cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Undo</span>
            </button>

            <button
              type="button"
              onClick={onDismiss}
              aria-label="Dismiss toast"
              className="min-h-[44px] min-w-[44px] flex items-center justify-center text-[#B8C2B3] hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress bar countdown */}
        <div className="w-full bg-[#123C3A]/50 h-1">
          <div
            className="bg-[#19C7B1] h-1 transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
