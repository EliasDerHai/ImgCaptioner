import {Accessor, Component, createMemo, createSignal, For, onMount, Show} from 'solid-js';
import styles from './Caption.module.css';
import {ImageWithMeta, useAppState} from "../../core/AppContext";
import ImagePreview, {PreviewImage} from "../../shared/image-preview/ImagePreview";
import CloseableImage from "../../shared/image-preview/overlay-image/CloseableImage";
import {getTagsOfText, tail} from "./tags";

const Caption: Component = () => {
  const { state, setState } = useAppState();
  const [selectedImage, setSelectedImage] = createSignal<ImageWithMeta | null>(null);
  const [suggestions, setSuggestions] = createSignal<string[]>([]);
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
    const caption = event.target.value;
    setImageCaption(caption);

    if (caption.endsWith(',')) {
      updateTags(caption);
    }

    updateSuggestions(caption);
  }

  function updateTags(caption: string) {
    const newTags = getTagsOfText(caption)
      .filter(tag => !state.tags.includes(tag));

    setState('tags', [...state.tags, ...newTags]);

    console.log(`Adding tags ${newTags.join(', ')}`);
    console.log(`All tags: ${state.tags.join(', ')}`);

    try {
      console.log('storing tags...')
      localStorage.setItem('captor-tags', JSON.stringify(state.tags));
    } catch (e) {
      console.warn(`Could not store tags '${state.tags}'`, e);
    }
  }

  function onTagSelected(tag: string): void {
    const currentCaption = selectedImage()?.caption ?? '';
    const nextCaption = `${currentCaption.slice(0, currentCaption.lastIndexOf(',') + 1)} ${tag}, `;
    setImageCaption(nextCaption);
    updateSuggestions(nextCaption);
  }

  function setImageCaption(caption: string) {
    // Find the index of the image in the state.images array
    const index = state.images.findIndex((i) => i === selectedImage());
    if (index === -1) throw new Error(`Cannot find image in state.images`);

    setState(
      'images',
      index,
      'caption',
      caption
    );
  }

  function updateSuggestions(caption: string) {
    const last = tail(caption);
    console.log(`Last: '${last}'`);
    const nextSuggestions = state.tags
      .filter(tag => tag.startsWith(last.trim().toLowerCase()))
      .filter(tag => !getTagsOfText(caption).includes(tag))
      .filter((_, index) => index <= 10)
    ;

    console.log(`Suggestions: ${nextSuggestions.join(', ')}`);
    setSuggestions(nextSuggestions);
  }

  onMount(() => {
    const localTags = localStorage.getItem('captor-tags');
    console.log(`found tags '${localTags}'`);
    if (!localTags) return;
    try {
      const tags = JSON.parse(localTags);
      setState('tags', tags);
      updateSuggestions(selectedImage()?.caption ?? '');
    } catch (e) {
      console.warn(`Could not parse local tags '${localTags}'`, e);
    }
  })

  const images: Accessor<PreviewImage[]> = createMemo(() =>
    state.images.map(({ file, url, caption }) =>
      ({
        file,
        url,
        tooltip: <div>{caption}</div>,
        subTitle: `${caption.split(' ').length} words`,
      })
    ));

  return (
    <div class={styles.container}>
      <ImagePreview images={images} onImageClick={onImageClick}/>
      <Show when={selectedImage() !== null}>
        <CloseableImage file={selectedImage()?.file as File}
                        url={selectedImage()?.url as string}
                        onCloseClick={(__) => setSelectedImage(null)}
                        imageStyle={() => ({ "max-width": '100%', "max-height": '800px', float: 'right' })}
        ></CloseableImage>
        <span class={styles.suggestions}>
          <For each={suggestions()}>
            {(item, index) => <button onClick={() => onTagSelected(item)} data-index={index()}>{item}</button>}
          </For>
        </span>
        <textarea class={styles.captionInput} onInput={onCaptionChange} value={caption()}></textarea>
      </Show>
    </div>
  );
};

export default Caption;
