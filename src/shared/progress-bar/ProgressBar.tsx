import { Component } from 'solid-js';
import styles from './ProgressBar.module.css';

type ProgressBarProps = {
    percentageValue: number; // 0 - 100
    absoluteValue?: number;
    label?: string;
};

const ProgressBar: Component<ProgressBarProps> = (props) => {
    if (props.percentageValue > 100 || props.percentageValue < 0) {
        throw new Error(`Illegal argument ${props.percentageValue}`);
    }

    return (
        <div class={styles.barContainer}>
            {props.label && <div class={styles.barLabel}>{props.label}</div>}
            <div class={styles.bar}>
                <div class={styles.barProgress} style={{ width: `${props.percentageValue}%` }}></div>
                {props.absoluteValue !== undefined && (
                    <span class={styles.barAbsoluteValue}>{props.absoluteValue}</span>
                )}
            </div>
        </div>
    );
};

export default ProgressBar;
