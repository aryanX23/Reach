// toastUtils.js
import { toast } from "sonner";
import "./toastUtil.css";

const baseToastOptions = {
  duration: 2000,
  position: "top-center",
};

export const showErrorToast = (message) => {
  toast.error(message, {
    ...baseToastOptions,
    className: "sonner-toast sonner-toast-error",
  });
};

export const showSuccessToast = (message) => {
  toast.success(message, {
    ...baseToastOptions,
    className: "sonner-toast sonner-toast-success",
  });
};

export const showInfoToast = (message) => {
  toast.info(message, {
    ...baseToastOptions,
    className: "sonner-toast sonner-toast-info",
  });
};

export const showWarningToast = (message) => {
  toast.warning(message, {
    ...baseToastOptions,
    className: "sonner-toast sonner-toast-warning",
  });
};
