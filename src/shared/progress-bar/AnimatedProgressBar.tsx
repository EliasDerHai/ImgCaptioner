import { Accessor, Component, createEffect, createMemo, createSignal, Show } from 'solid-js';
import styles from './ProgressBar.module.css';
import FlipNumberDisplay from '../../flip-number-display/FlipNumberDisplay';
import { FontAwesomeIcon } from 'solid-fontawesome';

type AnimatedProgressBarProps = {
    label: string;
    icon?: string;
    absoluteValue: Accessor<number>;
    maxValue: number;
};

const AnimatedProgressBar: Component<AnimatedProgressBarProps> = (props: AnimatedProgressBarProps) => {
    const [isAnimating, setIsAnimating] = createSignal(false);
    let animationTimeout: number | null = null;
    const animationDurationInSeconds = 1;

    createEffect(() => {
        clearTimeout(animationTimeout ?? undefined);
        setIsAnimating(true);
        animationTimeout = setTimeout(() => setIsAnimating(false), animationDurationInSeconds * 1000) as any; // ts-compiler says NodeJS.Timeout but actually number
    });

    const getProgressBarFillingStyle = createMemo(() => {
        const current = props.absoluteValue();
        const percentage = current / props.maxValue * 100;
        return { width: `${Math.round(percentage)}%` }
    });

    return (
        <div class={`${styles.barContainer} ${isAnimating() ? `${styles.pulsate}` : ''}`}>
            {props.label && <div class={styles.barLabel}>
                <Show when={props.icon}><span style='padding-right: .5em'><FontAwesomeIcon icon={props.icon as string}></FontAwesomeIcon></span></Show>
                {props.label}
                </div>}
            <div class={styles.bar}>
                <div class={styles.barProgress} style={getProgressBarFillingStyle()}></div>
                <div class={styles.barAbsoluteValue}>
                    <FlipNumberDisplay value={props.absoluteValue} />
                </div>
            </div>
        </div>
    );
};

export default AnimatedProgressBar;
