import type {Component} from 'solid-js';

import styles from './App.module.css';
import Main from './app/Main';
import {AppProvider} from "./core/AppContext";

const App: Component = () => {
  return (
    <div class={styles.App}>
      <AppProvider>
        <Main/>
      </AppProvider>
    </div>
  );
};

export default App;
