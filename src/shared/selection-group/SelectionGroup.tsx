import { JSX, createSignal } from 'solid-js';
import styles from './SelectionGroup.module.css';

type SelectionGroupProps<T> = {
  options: SelectionOption<T>[];
  align?: 'horizontal' | 'vertical'; // default: horizontal
  onSelectedChange: (selected: T) => void;
};


export type SelectionOption<T> = {
  value: T;
  label: JSX.Element | string;
  disabled?: boolean;
};

const SelectionGroup = <T,>(props: SelectionGroupProps<T>) => {
  const [selectedIndex, setSelectedIndex] = createSignal<number | null>(null);

  const handleSelect = (index: number) => {
    const option = props.options[index];

    if (!option.disabled) {
      setSelectedIndex(index);
      props.onSelectedChange(props.options[index].value);
    };
  };

  // select first option if not disabled
  if (props.options.some(option => !option.disabled)) {
    handleSelect(0);
  }

  const alignClass = props.align === 'vertical' ? styles.col : styles.row;

  return (
    <div class={`${styles.selectionGroup} ${alignClass}`}>
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