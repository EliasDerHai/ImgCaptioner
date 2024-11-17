import {Component, createSignal, Show} from 'solid-js';
import styles from './Caption.module.css';
import {ImageWithMeta, useAppState} from "../../core/AppContext";
import ImagePreview from "../../shared/image-preview/ImagePreview";
import CloseableImage from "../../shared/image-preview/overlay-image/CloseableImage";

const Caption: Component = () => {
  const { state } = useAppState();
  const [selectedImage, setSelectedImage] = createSignal<ImageWithMeta | null>(null);

  function onImageClick(file: File): void {
    console.log(`Clicked ${file.name}`)
    const imageWithMeta = state.images.find(i => i.file === file);
    if (!imageWithMeta) {
      console.warn(`Cannot find image ${file.name}`);
      return;
    }
    setSelectedImage(null); // triggers unmount of CloseableImage
    setSelectedImage(imageWithMeta);
  }

  return (
    <div class={styles.container}>
      <ImagePreview images={() => state.images} onImageClick={onImageClick}/>
      <Show when={selectedImage() !== null}>
        <CloseableImage file={selectedImage()?.file as File}
                        url={selectedImage()?.url as string}
                        onCloseClick={(__) => setSelectedImage(null)}
                        imageStyle={() => ({ "max-width": '100%', "max-height": '800px', float: 'right' })}
        ></CloseableImage>
        <textarea class={styles.captionInput}></textarea>
      </Show>
    </div>

  );
};

export default Caption;
