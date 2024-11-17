import { createSignal, JSXElement } from 'solid-js';
import SelectionGroup from '../selection-group/SelectionGroup';

type Tab = {
  title: string;
  content: JSXElement;
};

type TabGroupProps = {
  tabs: Tab[]
};

const TabGroup = (props: TabGroupProps) => {
  const [activeTab, setActiveTab] = createSignal<Tab>();

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
  };

  const options = props.tabs.map(tab => ({ label: tab.title, value: tab }));

  return (
    <div>
      <SelectionGroup
        options={options}
        onSelectedChange={handleTabChange}>
      </SelectionGroup>
      <div>
        {activeTab()?.content}
      </div>
    </div>
  );
};

export default TabGroup;
