import {Component} from 'solid-js';
import styles from './DropBox.module.css';

type DropBoxProperties = {
  onFilesAdded?: (files: File[]) => void,
  height?: number,
}
const DropBox: Component<DropBoxProperties> = (props) => {

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
  };

  const onImageChange = (files: File[]) => {
    props.onFilesAdded?.(files);
  }

  function filterFiles(files: File[]) {
    return files.filter((file) =>
      file.type.startsWith('image/')
    );
  }

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    const files = filterFiles(Array.from(e.dataTransfer?.files || []));
    onImageChange(files);
  };

  const handleFileInputChange = (e: Event) => {
    const input = e.target as HTMLInputElement;
    const files = filterFiles(Array.from(input.files || []));
    onImageChange(files);
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
