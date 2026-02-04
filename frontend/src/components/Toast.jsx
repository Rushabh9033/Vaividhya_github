import { useState, useCallback } from "react";
import "./Toast.css";

// Toast Context for global usage
let toastTimeout = null;
let setToastState = null;

export function ToastProvider({ children }) {
    const [toast, setToast] = useState(null);
    setToastState = setToast;

    const hideToast = useCallback(() => {
        setToast(null);
    }, []);

    return (
        <>
            {children}
            {toast && (
                <div className={`toast-container ${toast.type}`} onClick={hideToast}>
                    <div className="toast-icon">
                        {toast.type === "success" && "✓"}
                        {toast.type === "error" && "✕"}
                        {toast.type === "info" && "ℹ"}
                        {toast.type === "warning" && "⚠"}
                    </div>
                    <div className="toast-message">{toast.message}</div>
                    <div className="toast-progress"></div>
                </div>
            )}
        </>
    );
}

// Global toast function
export function showToast(message, type = "info", duration = 3000) {
    if (setToastState) {
        if (toastTimeout) clearTimeout(toastTimeout);

        setToastState({ message, type });

        toastTimeout = setTimeout(() => {
            setToastState(null);
        }, duration);
    }
}

export default showToast;
