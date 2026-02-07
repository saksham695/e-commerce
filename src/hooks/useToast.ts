import { useCallback } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

/**
 * Custom hook for toast notifications
 * Used with ToastContext for global notifications
 */
export function useToast() {
  const showToast = useCallback((message: string, type: ToastType = 'info', duration: number = 3000) => {
    const event = new CustomEvent('show-toast', {
      detail: { message, type, duration }
    });
    window.dispatchEvent(event);
  }, []);

  return {
    success: (message: string, duration?: number) => showToast(message, 'success', duration),
    error: (message: string, duration?: number) => showToast(message, 'error', duration),
    info: (message: string, duration?: number) => showToast(message, 'info', duration),
    warning: (message: string, duration?: number) => showToast(message, 'warning', duration),
  };
}
