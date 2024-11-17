import {Accessor, Component, createSignal, For} from 'solid-js';
import SelectionGroup, {SelectionOption} from '../selection-group/SelectionGroup';
import styles from './ImagePreview.module.css';

type ImagePreviewProps = {
  onRemoveImage?: (file: File) => void;
  images: Accessor<{
    file: File;
    url: string;
  }[]>
}
const imageSizes = ['s', 'm', 'l'] as const;
type ImageSize = typeof imageSizes[number];
type SizeMeta = { px: number, label: string };

const ImagePreview: Component<ImagePreviewProps> = (props) => {
  const [imageSize, setImageSize] = createSignal<ImageSize>('m');
  const sizeOptions: SelectionOption<ImageSize>[] = imageSizes.map(letter => ({
    label: letter.toUpperCase(),
    value: letter
  }))
  const sizeMetas: Record<ImageSize, SizeMeta> = {
    s: { label: 'Small', px: 80 },
    m: { label: 'Medium', px: 180 },
    l: { label: 'Large', px: 230 },
  }
  const imageSizeToPx = (value: ImageSize): string => `${sizeMetas[value].px}px`;

  function onCloseImageClick(file: File): void {
    props.onRemoveImage?.(file);
  }

  return (
    <div>
      <SelectionGroup options={sizeOptions}
                      onSelectedChange={setImageSize}
                      initiallySelected={sizeOptions[1]}>
      </SelectionGroup>
      <div class={styles.container}>
        <For each={props.images()}>
          {({ file, url }) => (
            <div class={styles.imageContainer} style={{ 'max-width': imageSizeToPx(imageSize()) }}>
              <img
                src={url}
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
