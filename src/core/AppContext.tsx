import {createContext, ParentComponent, useContext} from 'solid-js';
import {createStore} from 'solid-js/store';

export type AppState = {
    images: ImageWithMeta[]
}

export type ImageWithMeta = {
    file: File;
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
            const newImages = files.map(file => ({ file }));
            setState('images', [...state.images, ...newImages]);
        },
        removeImage: (fileToRemove: File) => {
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