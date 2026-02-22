import { useToast } from 'react-native-toast-notifications';

/**
 * Hook to use toast notifications
 */
export const useNotifications = () => {
  const toast = useToast();

  const showSuccess = (message: string) => {
    toast.show(message, {
      type: 'success',
      placement: 'top',
      duration: 2000,
      animationType: 'slide-in',
    });
  };

  const showError = (message: string) => {
    toast.show(message, {
      type: 'danger',
      placement: 'top',
      duration: 3000,
      animationType: 'slide-in',
    });
  };

  const showInfo = (message: string) => {
    toast.show(message, {
      type: 'normal',
      placement: 'top',
      duration: 2000,
      animationType: 'slide-in',
    });
  };

  return { showSuccess, showError, showInfo };
};
