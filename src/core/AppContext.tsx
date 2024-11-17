import {createContext, ParentComponent, useContext} from 'solid-js';
import {createStore} from 'solid-js/store';

export type AppState = {
  images: ImageWithMeta[]
}

export type ImageWithMeta = {
  file: File;
  /** as per {@link URL.createObjectURL} */
  url: string;
}

type AppContextValue = {
  state: AppState;
  addImages: (files: File[]) => void;
  removeImage: (file: File) => void;
}

const AppContext = createContext<AppContextValue>();

export const AppProvider: ParentComponent = (props) => {
  const [state, setState] = createStore<AppState>({
    images: []
  });

  const contextValue: AppContextValue = {
    state,
    addImages: (files: File[]) => {
      const newImages: ImageWithMeta[] = files.map(file => {
        const url = URL.createObjectURL(file);
        return ({ file, url });
      });
      setState('images', [...state.images, ...newImages]);
    },
    removeImage: (fileToRemove: File) => {
      const imageToRemove = state.images.find(i => i.file === fileToRemove);
      if(!imageToRemove) {
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