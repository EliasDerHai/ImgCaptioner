import type {Component} from 'solid-js';

import styles from './App.module.css';
import Main from './app/Main';
import {AppProvider} from "./core/AppContext";
import OverlayProvider from "./shared/overlay/OverlayProvider";

const App: Component = () => {
  return (
    <div class={styles.App}>
      <AppProvider>
        <OverlayProvider>
          <Main/>
        </OverlayProvider>
      </AppProvider>
    </div>
  );
};

export default App;
