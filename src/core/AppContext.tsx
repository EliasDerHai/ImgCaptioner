import {createContext, ParentComponent, useContext} from 'solid-js';
import {createStore} from 'solid-js/store';
import {parsePng} from "../app/caption/parse-png";

export type AppState = {
  images: ImageWithMeta[]
}

export type ImageWithMeta = {
  file: File;
  /** URL as per {@link URL.createObjectURL} */
  url: string;
  /** embedded tExt as per {@link parsePng} */
  prompt: Promise<string | null>;
}

type AppContextValue = {
  state: AppState;
  addImages: (files: File[]) => void;
  removeImage: (file: File) => void;
}

const AppContext = createContext<AppContextValue>();

/**
 * Usage: just add to root like
 * ```
 * const App: Component = () => {
 *   return (
 *     <div class={styles.App}>
 *         <AppProvider>
 *           ...
 *         </AppProvider>
 *     </div>
 *   );
 * };
 * ```
 */
export const AppProvider: ParentComponent = (props) => {
  const [state, setState] = createStore<AppState>({
    images: []
  });

  const contextValue: AppContextValue = {
    state,
    addImages: (files: File[]) => {
      const newImages: ImageWithMeta[] = files.map(file => {
        const url = URL.createObjectURL(file);
        const prompt = parsePng(file);
        return ({ file, url, prompt });
      });
      setState('images', [...state.images, ...newImages]);
    },
    removeImage: (fileToRemove: File) => {
      const imageToRemove = state.images.find(i => i.file === fileToRemove);
      if (!imageToRemove) {
        console.warn(`Cannot remove file "${fileToRemove.name}" - not found`);
        return;
      }
      URL.revokeObjectURL(imageToRemove.url);
      setState('images', state.images.filter(img => img.file !== fileToRemove));
    }
  };

  return (
    <AppContext.Provider value={contextValue}>
      {props.children}
    </AppContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppProvider');
  }
  return context;
};