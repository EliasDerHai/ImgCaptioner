import {Component, createSignal} from 'solid-js';
import styles from './DropBox.module.css';

type DropBoxProperties = {
  onDrop?: (files: File[]) => {},
  height?: number
}
const DropBox: Component<DropBoxProperties> = (props) => {
  const [images, setImages] = createSignal<File[]>([]);

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
  };

  const onImageChange = (files: File[]) => {
    setImages(files);
    props.onDrop?.(files);
  }

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer?.files || []).filter((file) =>
      file.type.startsWith('image/')
    );
    onImageChange([...images(), ...files]);
  };

  const handleFileInputChange = (e: Event) => {
    const input = e.target as HTMLInputElement;
    const files = Array.from(input.files || []).filter((file) =>
      file.type.startsWith('image/')
    );
    onImageChange([...images(), ...files]);
  };

  return (
    <div>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        class={styles.dropZone}
        style={{ height: `${props.height ?? 50}px` }}
        onClick={() => document.getElementById('fileInput')?.click()}
      >
        Drag and drop images here or click to select files
        <input
          type='file'
          accept='image/*'
          multiple
          onChange={handleFileInputChange}
          class={styles.hiddenInput}
          id='fileInput'
        />
      </div>
    </div>
  );
};

export default DropBox;
