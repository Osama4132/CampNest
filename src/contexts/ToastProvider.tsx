import React, { useState, createContext, useContext } from "react";
import Toast from "react-bootstrap/Toast";

type ToastContextProviderProps = {
  children: React.ReactNode;
};

type ToastFunction = (toastMessage: string, toastColor: string) => void;

const ToastContext = createContext<ToastFunction | null>(null);
let toastTimeoutId: ReturnType<typeof setTimeout>;

export const ToastProvider = ({ children }: ToastContextProviderProps) => {
  const [toastData, setToastData] = useState({
    showToast: false,
    message: "",
    color: "green",
  });

  const toggleToast = () =>
    setToastData((oldData) => ({ ...oldData, showToast: !showToast }));

  const showToast = (toastMessage: string, toastColor: string) => {
    setToastData(() => ({
      showToast: true,
      message: toastMessage,
      color: toastColor,
    }));
    if (toastTimeoutId) clearTimeout(toastTimeoutId);
    toastTimeoutId = setTimeout(() => {
      setToastData((oldData) => ({ ...oldData, showToast: false }));
    }, 3000);
  };

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div className="position-fixed bottom-0 end-0 z-3">
        <Toast
          show={toastData.showToast}
          onClose={toggleToast}
          style={{ backgroundColor: toastData.color }}
        >
          <Toast.Body className="text-white">{toastData.message}</Toast.Body>
        </Toast>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
