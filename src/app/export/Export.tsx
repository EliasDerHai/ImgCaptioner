import {Component} from 'solid-js';
import styles from './Export.module.css';
import JSZip from "jszip";
import {useAppState} from "../../core/AppContext";

const Export: Component = () => {
  const { state } = useAppState();

  const downloadZip = async () => {
    const zip = new JSZip();
    state.images.forEach(({ file, caption }, index) => {
      const filename = file.name.substring(file.name.lastIndexOf('.'));
      const txtFileName = `${filename}.txt`;
      zip.file(txtFileName, caption);
    });

    // Generate the ZIP file
    const content = await zip.generateAsync({ type: "blob" });

    // Create a download link
    const url = URL.createObjectURL(content);
    const a = document.createElement("a");
    a.href = url;
    a.download = "captions.zip";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Revoke the URL after the download
    URL.revokeObjectURL(url);
  };

  return (
    <div class={styles.container}>
      <button class={styles.download} onClick={downloadZip} disabled={state.images.length < 1}>Download</button>
    </div>
  );
};

export default Export;
