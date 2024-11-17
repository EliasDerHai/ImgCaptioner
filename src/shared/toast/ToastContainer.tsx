import { Component, For } from 'solid-js';
import { useToastContext } from './ToastContext';
import styles from './Toast.module.css';

const ToastContainer: Component = () => {
  const { toasts } = useToastContext();

  return (
    <div class={styles.toastContainer}>
      <For each={toasts()}>
        {(toast) => (
          <div class={styles.toast}>
            {toast.message}
          </div>
        )}
      </For>
    </div>
  );
};

export default ToastContainer;
