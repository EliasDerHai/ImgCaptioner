import type {Component} from 'solid-js';

import styles from './App.module.css';
import Main from './app/Main';
import {AppProvider} from "./core/AppContext";
import OverlayProvider from "./shared/overlay/OverlayProvider";
import {ToastProvider} from "./shared/toast/ToastContext";

const App: Component = () => {
  return (
    <div class={styles.App}>
      <ToastProvider>
        <OverlayProvider>
          <AppProvider>
            <Main/>
          </AppProvider>
        </OverlayProvider>
      </ToastProvider>
    </div>
  );
};

export default App;
