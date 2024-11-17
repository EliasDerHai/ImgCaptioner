import {Component, createMemo} from 'solid-js';
import DropBox from '../../shared/drop-box/DropBox';
import ImagePreview from '../../shared/image-preview/ImagePreview';
import styles from './Select.module.css';
import {useAppState} from "../../core/AppContext";

const Select: Component = () => {
  const { state, addImages, removeImage } = useAppState();

  const images = createMemo(() => state.images.map(image => image.file));

  function onImagesDropped(files: File[]): void {
    const currentImages = state.images;
    addImages(files.filter(file => !currentImages.some(i => i.file.name === file.name)));
  }

  return (
    <div class={styles.container}>
      <DropBox onFilesAdded={onImagesDropped}></DropBox>
      <ImagePreview images={images} onRemoveImage={removeImage}/>
    </div>
  );
};

export default Select;
