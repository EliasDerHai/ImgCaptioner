import {Accessor, Component, createMemo, createRoot, createSignal, For} from 'solid-js';
import SelectionGroup, {SelectionOption} from '../selection-group/SelectionGroup';
import styles from './ImagePreview.module.css';
import CloseableImage from "./overlay-image/CloseableImage";
import {useOverlayContext} from "../overlay/OverlayProvider";

type ImagePreviewProps = {
  /** only shows x-button when set */
  onRemoveImage?: (file: File) => void;
  /** default behavior is full-screen preview but can be overwritten */
  onImageClick?: (file: File) => void;
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
  const { closeOverlay } = useOverlayContext();
  const imageStyle = createMemo(() => {
    return { width: imageSizeToPx(imageSize()), height: imageSizeToPx(imageSize()) };
  });

  function onImageClick(url: string, file: File): void {
    function onCloseImageClick(file: File): void {
      closeOverlay(file.name);
    }

    useOverlayContext().openOverlay(
      createRoot(() =>
        <div>
          <CloseableImage url={url}
                          file={file}
                          onImageClick={onCloseImageClick}
                          onCloseClick={onCloseImageClick}
          />
        </div>
      ),
      file.name
    );
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
            <CloseableImage file={file}
                            url={url}
                            imageStyle={imageStyle}
                            onCloseClick={props.onRemoveImage
                              ? (file) => props.onRemoveImage?.(file)
                              : undefined}
                            onImageClick={(file) => props.onImageClick
                              ? props.onImageClick(file)
                              : onImageClick(url, file)}
            />
          )}
        </For>
      </div>
    </div>
  );
};

export default ImagePreview;
