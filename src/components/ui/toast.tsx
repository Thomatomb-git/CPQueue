"use client";

import * as React from "react";
import { AlertCircle, CheckCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export type ToastType = "error" | "success" | "info";

export interface ToastMessage {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType, title?: string) => void;
  error: (message: string, title?: string) => void;
  success: (message: string, title?: string) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = React.useState<ToastMessage[]>([]);

  const addToast = React.useCallback(
    (message: string, type: ToastType = "info", title?: string) => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, type, title, message }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    },
    []
  );

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const contextValue = React.useMemo(
    () => ({
      toast: addToast,
      error: (msg: string, title?: string) => addToast(msg, "error", title || "Oops!"),
      success: (msg: string, title?: string) => addToast(msg, "success", title || "Awesome!"),
    }),
    [addToast]
  );

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {/* Toast Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "pointer-events-auto flex items-start gap-3 rounded-xl border-[2.5px] border-white p-4 shadow-[6px_6px_0px_0px_#FFFFFF] animate-in slide-in-from-bottom-5 duration-200",
              t.type === "error" && "bg-red-950 text-red-100 shadow-[6px_6px_0px_0px_#EF4444]",
              t.type === "success" && "bg-emerald-950 text-emerald-100 shadow-[6px_6px_0px_0px_#22C55E]",
              t.type === "info" && "bg-zinc-900 text-white"
            )}
          >
            {t.type === "error" && <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />}
            {t.type === "success" && <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />}
            {t.type === "info" && <Info className="h-5 w-5 text-yellow-400 shrink-0 mt-0.5" />}

            <div className="flex-1">
              {t.title && <div className="font-black text-sm uppercase tracking-wide">{t.title}</div>}
              <div className="text-xs font-semibold leading-relaxed mt-0.5">{t.message}</div>
            </div>

            <button
              onClick={() => removeToast(t.id)}
              className="shrink-0 p-1 hover:bg-white/10 rounded transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
