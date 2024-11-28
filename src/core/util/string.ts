
export const capitalizeFirstLetter = (str: string): string => {
    if (str.length === 0) {
        throw new Error("The input string cannot be empty.");
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
   * text is trimmed in between \n, which allows indenting the multiline strings without affecting the UI
   */
export const removeTabsAndSpacesAfterNewline = (text: string): string => text
    .split('\n')
    .map(line => line.trim())
    .join('\n');
