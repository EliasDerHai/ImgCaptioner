export const getTagsOfText = (text: string): string[] => text
  .split(',')
  .map(tag => tag.trim().toLowerCase())
  .filter(tag => tag.length > 2);

export const tail = (text: string): string => {
  const tags = text.split(',').map(tag => tag.trim());
  return tags.length > 1 ? tags[tags.length - 1] : text;
}