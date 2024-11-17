import {Accessor, createContext, createSignal, JSXElement, ParentComponent, useContext} from 'solid-js';
import Overlay from "./Overlay";

export type OverlayContextType = {
  overlayContent: Accessor<Record<string, JSXElement>>;
  isAnyOverlayOpen: () => boolean;
  openOverlay: (content: JSXElement, overlayId: string) => void;
  closeOverlay: (overlayId: string) => void;
  closeAllOverlays: () => void;
};

const [overlayContent, setOverlayContent] = createSignal<Record<string, JSXElement>>({});
const overlayContextValue: OverlayContextType = {
  overlayContent,
  isAnyOverlayOpen: () => Object.values(overlayContent()).length > 0,
  openOverlay: (content: JSXElement, overlayId: string) => {
    const map = overlayContent();
    map[overlayId] = content;
    setOverlayContent({ ...map });
  },
  closeOverlay: (overlayId: string) => {
    const map = overlayContent();
    delete map[overlayId];
    setOverlayContent({ ...map });
  },
  closeAllOverlays: () => setOverlayContent({})
};
const OverlayContext = createContext<OverlayContextType>(overlayContextValue);
export const useOverlayContext = () => useContext(OverlayContext);

/**
 * Usage: just add to root like
 * ```
 * const App: Component = () => {
 *   return (
 *     <div class={styles.App}>
 *         <OverlayProvider>
 *           ...
 *         </OverlayProvider>
 *     </div>
 *   );
 * };
 * ```
 */
const OverlayProvider: ParentComponent = (props) => {
  return (
    <OverlayContext.Provider value={overlayContextValue}>
      {props.children}
      <Overlay />
    </OverlayContext.Provider>
  );
};

export default OverlayProvider;


