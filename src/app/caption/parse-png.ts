/**
 * [png chunks]{@link http://www.libpng.org/pub/png/spec/1.2/PNG-Chunks.html}
 * extracts tEXt Textual data from png
 * */
function parsePngMetadata(uint8Array: Uint8Array): string | null {
  const textDecoder = new TextDecoder();
  let index = 8; // Skip the PNG header

  while (index < uint8Array.length) {
    // Read chunk length
    const length = (uint8Array[index] << 24) |
      (uint8Array[index + 1] << 16) |
      (uint8Array[index + 2] << 8) |
      uint8Array[index + 3];
    index += 4;

    // Read chunk type
    const type = textDecoder.decode(uint8Array.slice(index, index + 4));
    index += 4;

    // Read chunk data
    const data = uint8Array.slice(index, index + length);
    index += length;

    // Skip CRC (4 bytes)
    index += 4;

    // If it's a tEXt chunk, parse it
    if (type === "tEXt") {
      const text = textDecoder.decode(data);
      const [key, value] = text.split("\0");
      if (key === "parameters" || key === "prompt") {
        return value;
      }
    }
  }

  return null;
}

export async function parsePng(file: File): Promise<string | null> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    return parsePngMetadata(uint8Array);
  } catch (error) {
    console.error(`Could not parse ${file.name}`, error);
    return null;
  }
}