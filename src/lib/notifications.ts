import { useToast } from 'react-native-toast-notifications';

interface ToastOptions {
  message: string;
  type?: 'success' | 'danger' | 'normal';
  duration?: number;
}

/**
 * Hook to use toast notifications
 */
export const useNotifications = () => {
  const toast = useToast();

  // Default options for all toasts
  const defaultOptions = {
    placement: 'center' as const,
    animationType: 'zoom' as const,
  };

  const showToast = ({ message, type = 'normal', duration }: ToastOptions) => {
    toast.show(message, {
      ...defaultOptions,
      type,
      duration,
    });
  };

  const showSuccess = (message: string, duration = 2000) => {
    showToast({ message, type: 'success', duration });
  };

  const showError = (message: string, duration = 3000) => {
    showToast({ message, type: 'danger', duration });
  };

  const showInfo = (message: string, duration = 2000) => {
    showToast({ message, type: 'normal', duration });
  };

  return { showSuccess, showError, showInfo };
};