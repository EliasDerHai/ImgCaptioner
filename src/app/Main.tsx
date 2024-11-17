import {Component} from 'solid-js';
import TabGroup from '../shared/tab-group/TabGroup';
import styles from './Main.module.css';
import Select from './select/Select';
import Caption from "./caption/Caption";

const Main: Component = () => {

  return (
    <div class={styles.container}>

      <TabGroup headerAlign={'center'} tabs={[
        { title: "Select", content: <Select/> },
        { title: "Caption", content: <Caption /> },
        { title: "Export", content: <div>Export Lorem ipsum</div> },
      ]}/>

    </div>
  );
};

export default Main;
