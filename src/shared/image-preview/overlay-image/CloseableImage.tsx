import {Accessor, Component, createMemo, JSX, Show} from 'solid-js';
import styles from '../ImagePreview.module.css';

type OverlayImageProperties = {
  file: File;
  url: string;
  /** default: { 'max-height': '90vh' } */
  imageStyle?: Accessor<JSX.CSSProperties>;
  onImageClick?: (file: File) => void;
  onCloseClick?: (file: File) => void;
};

const CloseableImage: Component<OverlayImageProperties> = ({ file, url, imageStyle, onImageClick, onCloseClick }) => {

  const appliedImageStyle: Accessor<JSX.CSSProperties> = createMemo(() => {
    const properties: JSX.CSSProperties = imageStyle?.() ?? { 'max-height': '90vh' }
    properties['object-fit'] = 'cover';
    return properties;
  });

  return (
    <div class={styles.imageContainer}>
      <img
        src={url}
        alt={file.name}
        style={appliedImageStyle()}
        onClick={() => onImageClick?.(file)}
      />
      <Show when={onCloseClick}>
        <button
          class={styles.closeButton}
          onClick={() => onCloseClick?.(file)}
        >&times;</button>
      </Show>
    </div>
  );
};

export default CloseableImage;
