import {Component, createMemo, Show} from "solid-js";
import {Portal} from "solid-js/web";
import styles from "./Overlay.module.css";
import {useOverlayContext} from "./OverlayProvider";

const Overlay: Component = () => {

  const overlayContext = useOverlayContext();
  const overlays = createMemo(() => Object.values(overlayContext.overlayContent()));

  return (
    <Show when={overlayContext.overlayContent().size !== 0}>
      {overlays().map(overlay => (
        <Portal mount={document.body}>
          <div class={styles.overlay}>
            <div class={styles.overlayContent}>
              {overlay}
            </div>
          </div>
        </Portal>
      ))}
    </Show>
  );
};

export default Overlay;