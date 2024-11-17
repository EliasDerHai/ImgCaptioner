import { Component, createSignal, JSXElement, Show } from 'solid-js';
import styles from './CategoryHeader.module.css';

type LineType = 'start' | 'end' | 'both';

type CategoryHeaderProps = {
  title: string;
  /** defaults to 'both' */
  lineType?: LineType;
  toggle?: ToggleOptions;
  children?: JSXElement;
};

type ToggleOptions = {
  onToggle?: (expanded: boolean) => void;
  /** defaults to true */
  initallyExpanded?: boolean;
}

const CategoryHeader: Component<CategoryHeaderProps> = (props) => {
  const lineType: LineType = props.lineType ?? 'both';
  const [expanded, setExpanded] = createSignal(props.toggle?.initallyExpanded ?? true);
  const toggleExpanded = () => {
    if (!props.toggle) {
      return;
    }
    const next = !expanded();
    props.toggle.onToggle?.(next);
    setExpanded(next);
  };

  return (
    <div class={styles.outer}>
      <div class={`${styles.container} ${props.toggle ? styles.clickable : ''}`} onClick={toggleExpanded}>
        <Show when={lineType !== 'end'}>
          <hr class={styles.line} />
        </Show>
        <span class={styles.title}>
          <Show when={props.toggle}>
            <div class={styles.toggler} >
              {expanded() ? '▼' : '▶'}
            </div>
          </Show>
          {props.title}
        </span>
        <Show when={lineType !== 'start'}>
          <hr class={styles.line} />
        </Show>
      </div>
      <Show when={expanded()}>
        {props.children}
      </Show>
    </div>
  );
};

export default CategoryHeader;
