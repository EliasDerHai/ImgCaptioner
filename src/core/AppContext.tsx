import {createContext, ParentComponent, useContext} from 'solid-js';
import {createStore, SetStoreFunction} from 'solid-js/store';
import {parsePng} from "../app/caption/parse-png";
import {useToastContext} from "../shared/toast/ToastContext";

export type AppState = {
  images: ImageWithMeta[];
  tags: string[];
}

export type ImageWithMeta = {
  file: File;
  /** URL as per {@link URL.createObjectURL} */
  url: string;
  /** embedded tExt as per {@link parsePng} */
  prompt: Promise<string | null>;
  caption: string;
}

type AppContextValue = {
  state: AppState;
  setState: SetStoreFunction<AppState>;
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
    images: [],
    tags: [],
  });
  const { addToast } = useToastContext();
  const contextValue: AppContextValue = {
    state,
    setState,
    addImages: (files: File[]) => {
      const newImages: ImageWithMeta[] = files.map(file => {
        const url = URL.createObjectURL(file);
        const prompt = parsePng(file)
        const imageWithMeta: ImageWithMeta = { file, url, prompt, caption: '' };

        prompt.then(value => {
          if (value && value.includes('Negative prompt:')) {
            addToast(`Prompt could be extracted from ${file.name}`);
            const positivePrompt = value.split('Negative prompt:')[0];
            imageWithMeta.caption = positivePrompt;
            return positivePrompt;
          } else {
            console.warn(`No prompt in ${file.name}`);
            return null;
          }
        });

        return imageWithMeta;
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