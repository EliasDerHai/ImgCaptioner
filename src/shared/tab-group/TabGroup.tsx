import {createSignal, JSX, JSXElement} from 'solid-js';
import SelectionGroup from '../selection-group/SelectionGroup';

type Tab = {
  title: string;
  content: JSXElement;
};

type TabGroupProps = {
  tabs: Tab[],
  /** default: start */
  headerAlign?: 'start' | 'center' | 'end'
};

const TabGroup = (props: TabGroupProps) => {
  const [activeTab, setActiveTab] = createSignal<Tab>();

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
  };

  const options = props.tabs.map(tab => ({ label: tab.title, value: tab }));

  const headerStyle: Pick<JSX.CSSProperties, 'flex-direction' | 'justify-content'> = {
    'flex-direction': 'row',
    'justify-content': 'flex-start'
  };
  if (props.headerAlign === 'center') {
    headerStyle["justify-content"] = 'center';
  } else if (props.headerAlign === 'end') {
    headerStyle["justify-content"] = 'flex-end';
  }

  return (
    <div>
      <SelectionGroup
        options={options}
        onSelectedChange={handleTabChange}
        headerStyle={headerStyle}>
      </SelectionGroup>
      <div>
        {activeTab()?.content}
      </div>
    </div>
  );
};

export default TabGroup;
