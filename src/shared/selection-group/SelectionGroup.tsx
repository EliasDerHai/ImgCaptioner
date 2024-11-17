import {JSX, createSignal} from 'solid-js';
import styles from './SelectionGroup.module.css';

type SelectionGroupProps<T> = {
  options: SelectionOption<T>[];
  initiallySelected?: SelectionOption<T>;
  onSelectedChange: (selected: T) => void;
  /** default: {direction: row, justify-content: flex-start }*/
  headerStyle?: Pick<JSX.CSSProperties, 'flex-direction' | 'justify-content'>;
};


export type SelectionOption<T> = {
  value: T;
  label: JSX.Element | string;
  disabled?: boolean;
};

const SelectionGroup = <T, >(props: SelectionGroupProps<T>) => {
  const [selectedIndex, setSelectedIndex] = createSignal<number | null>(null);

  const handleSelect = (index: number) => {
    const option = props.options[index];

    if (!option.disabled) {
      setSelectedIndex(index);
      props.onSelectedChange(props.options[index].value);
    }
  };

  // select first option if not disabled
  if (props.initiallySelected && props.options.includes(props.initiallySelected)) {
    handleSelect(props.options.indexOf(props.initiallySelected));
  } else if (props.options.some(option => !option.disabled)) {
    handleSelect(0);
  }

  const headerStyle: JSX.CSSProperties = props.headerStyle
    ?? { 'flex-direction': 'row', 'justify-content': 'flex-start' };
  headerStyle.display = 'flex';

  return (
    <div style={headerStyle}>
      {props.options.map((option, index) => (
        <button
          type='button'
          class={`${styles.selectionButton} ${selectedIndex() === index ? styles.selected : ''}`}
          onClick={() => handleSelect(index)}
          aria-pressed={selectedIndex() === index}
          disabled={option.disabled}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default SelectionGroup;