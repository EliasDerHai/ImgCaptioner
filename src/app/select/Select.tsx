import { Component, createSignal } from 'solid-js';
import DropBox from '../../shared/drop-box/DropBox';
import ImagePreview from '../../shared/image-preview/ImagePreview';
import styles from './Select.module.css';

const Select: Component = () => {
  const [images, setImages] = createSignal<File[]>([]);

  return (
    <div class={styles.container}>
      <DropBox onDrop={setImages}></DropBox>
      <ImagePreview images={images} onRemoveImage={image => { setImages(images().filter(i => i !== image)) }} />
    </div>
  );
};

export default Select;
