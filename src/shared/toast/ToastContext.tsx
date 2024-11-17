import { createContext, useContext, JSX, Accessor, createSignal, Component } from 'solid-js';
import ToastContainer from './ToastContainer';

type Toast = {
    id: number;
    message: string;
    duration: number;
};

type ToastContextType = {
    toasts: Accessor<Toast[]>;
    /** @param duration default=3s */
    addToast: (message: string, duration?: number) => void;
    removeToast: (id: number) => void;
};

const [toasts, setToasts] = createSignal<Toast[]>([]);
let toastId = 0;

const addToast = (message: string, duration = 3000) => {
    const id = ++toastId;
    setToasts([...toasts(), { id, message, duration }]);

    // Remove the toast after the duration
    setTimeout(() => removeToast(id), duration);
};

const removeToast = (id: number) => {
    setToasts((t) => t.filter((toast) => toast.id !== id));
};

const ToastContext = createContext<ToastContextType>(
    {
        toasts,
        addToast,
        removeToast,
    }
);

export const ToastProvider: Component<{ children: JSX.Element }> = (props) => {
    return (
        <ToastContext.Provider value={ToastContext.defaultValue}>
            <ToastContainer />
            {props.children}
        </ToastContext.Provider>
    );
};

export const useToastContext = () => useContext(ToastContext);

