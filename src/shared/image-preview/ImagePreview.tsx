import { Accessor, Component, createEffect, createSignal, For, onCleanup, onMount } from 'solid-js';
import SelectionGroup, { SelectionOption } from '../selection-group/SelectionGroup';
import styles from './ImagePreview.module.css';

type ImagePreviewProps = {
  onRemoveImage?: (file: File) => void;
  images: Accessor<File[]>
}
const imageSizes = ['s', 'm', 'l'] as const;
type ImageSize = typeof imageSizes[number];
type SizeMeta = { px: number, label: string };
const ImagePreview: Component<ImagePreviewProps> = (props) => {
  const [cachedUrls, setCachedUrls] = createSignal<Map<File, string>>(new Map());
  const [imageSize, setImageSize] = createSignal<ImageSize>('m');
  const sizeOptions: SelectionOption<ImageSize>[] = imageSizes.map(letter => ({ label: letter.toUpperCase(), value: letter }))
  const sizeMetas: Record<ImageSize, SizeMeta> = {
    s: { label: 'Small', px: 80 },
    m: { label: 'Medium', px: 180 },
    l: { label: 'Large', px: 230 },
  }
  const imageSizeToPx = (value: ImageSize): string => `${sizeMetas[value].px}px`;

  createEffect(() => {
    const urlCache = new Map<File, string>();
    props.images().forEach((file) => {
      if (!urlCache.has(file)) {
        console.log(`Preparing ${file.name}`);
        urlCache.set(file, URL.createObjectURL(file));
      }
    });
    setCachedUrls(urlCache);
  });

  onMount(() => {
    const urlCache = new Map<File, string>();
    props.images().forEach((file) => {
      console.log(`Preparing ${file.name}`);
      urlCache.set(file, URL.createObjectURL(file));
    });
    setCachedUrls(urlCache);
  });

  onCleanup(() => {
    cachedUrls().forEach((url) => {
      console.log(`Cleaning ${url}`);
      URL.revokeObjectURL(url);
    });
  });

  function onCloseImageClick(file: File): void {
    const url = cachedUrls().get(file);
    if (!url) {
      console.warn(`Cannot revoke object url for ${file.name}`);
      return;
    }
    URL.revokeObjectURL(url);
    props.onRemoveImage?.(file);
  }

  return (
    <div>
      <SelectionGroup options={sizeOptions} onSelectedChange={setImageSize}></SelectionGroup>
      <div class={styles.container}>
        <For each={props.images()}>
          {(file) => (
            <div class={styles.imageContainer} style={{ 'max-width': imageSizeToPx(imageSize()) }}>
              <img
                src={URL.createObjectURL(file)}
                alt={file.name}
                style={{ width: imageSizeToPx(imageSize()), height: imageSizeToPx(imageSize()), 'object-fit': 'cover' }}
              />
              <button
                class={styles.closeButton}
                onClick={() => onCloseImageClick(file)}
              >&times;</button>
              <span class={styles.fileName}>{file.name}</span>
            </div>
          )}
        </For>
      </div>
    </div>
  );
};

export default ImagePreview;
