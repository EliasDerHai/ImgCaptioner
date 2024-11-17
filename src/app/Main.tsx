import { Component, createSignal } from 'solid-js';
import TabGroup from '../shared/tab-group/TabGroup';
import styles from './Main.module.css';
import Select from './select/Select';

const Main: Component = () => {

  return (
    <div class={styles.container}>

      <TabGroup tabs={[
        { title: "Select", content: <Select /> },
        { title: "Caption", content: <div>Caption Lorem ipsum</div> },
        { title: "Export", content: <div>Export Lorem ipsum</div> },
      ]} />

    </div>
  );
};

export default Main;
