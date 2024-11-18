import {Component, createMemo, createSignal, Show} from 'solid-js';
import styles from './Caption.module.css';
import {ImageWithMeta, useAppState} from "../../core/AppContext";
import ImagePreview from "../../shared/image-preview/ImagePreview";
import CloseableImage from "../../shared/image-preview/overlay-image/CloseableImage";

const Caption: Component = () => {
  const { state, setState } = useAppState();
  const [selectedImage, setSelectedImage] = createSignal<ImageWithMeta | null>(null);
  const caption = createMemo(() => selectedImage()?.caption || '');

  function onImageClick(file: File): void {
    const imageWithMeta = state.images.find(i => i.file === file);
    if (!imageWithMeta) {
      console.warn(`Cannot find image ${file.name}`);
      return;
    }
    setSelectedImage(null); // triggers unmount of CloseableImage
    setSelectedImage(imageWithMeta);
  }

  function onCaptionChange(event: Event) {
    if (!(event.target instanceof HTMLTextAreaElement)) {
      throw new Error('Illegal target');
    }
    // Find the index of the image in the state.images array
    const index = state.images.findIndex((i) => i === selectedImage());
    if (index === -1) throw new Error(`Cannot find image in state.images`);

    setState(
      'images',
      index,
      'caption',
      event.target.value
    );
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
        <textarea class={styles.captionInput} onInput={onCaptionChange} value={caption()}></textarea>
      </Show>
    </div>
  );
};

export default Caption;
