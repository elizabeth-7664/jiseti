// shared/Toast.jsx
import { toast, Toaster } from 'react-hot-toast';

export const showToast = (message, type = 'success') => {
  if (type === 'error') toast.error(message);
  else toast.success(message);
};

export const ToastContainer = () => <Toaster position="top-right" reverseOrder={false} />;
