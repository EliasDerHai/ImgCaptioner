export type Color = {
    r: number;
    g: number;
    b: number;
};

export const getGradient = (from: Color, to: Color, x: number): Color => {
    if (x < 0 || x > 1) {
        throw new Error(`Illegal Argument - ${x} not within 0 to 1`);
    }

    const r = Math.round(from.r + x * (to.r - from.r));
    const g = Math.round(from.g + x * (to.g - from.g));
    const b = Math.round(from.b + x * (to.b - from.b));

    return { r, g, b };
};


const getColorFromHex = (hex: string): Color => {
    hex = hex.replace(/^#/, '');
    if (hex.length === 3) {
        hex = hex.split('').map(char => char + char).join('');
    }
    if (hex.length !== 6) {
        throw new Error(`Invalid hex color: ${hex}`);
    }
    const num = parseInt(hex, 16);
    return {
        r: (num >> 16) & 0xff,
        g: (num >> 8) & 0xff,
        b: num & 0xff,
    };
};

const getColorFromRgb = (rgbString: string): Color => {
    const result = rgbString.match(/rgb\(\s*(\d+),\s*(\d+),\s*(\d+)\s*\)/i);
    if (!result) {
        throw new Error(`Invalid RGB color: ${rgbString}`);
    }

    return {
        r: parseInt(result[1], 10),
        g: parseInt(result[2], 10),
        b: parseInt(result[3], 10),
    };
};

export const getColorFromCssVariable = (varName: string): Color => {
    const rootStyles = getComputedStyle(document.documentElement);
    const colorStr = rootStyles.getPropertyValue(varName).trim();

    if (colorStr.startsWith('#')) {
        return getColorFromHex(colorStr);
    } else if (colorStr.startsWith('rgb(')) {
        return getColorFromRgb(colorStr);
    } else if (colorStr.length === 0) {
        throw new Error(`Could not find css variable named '${varName}'`);
    } else {
        throw new Error(`Unsupported color format for ${varName}: ${colorStr}`);
    }
}

/**
 * finds a color inbetween positive and negative based on a value between 0 and 1
 * @param value 0 => 100% negative - 1 => 100% postitive
 * @returns a Color between positive-color and negative color (based on css property) 
 */
export const getPositiveNegativeGradient = (value: number): Color => {
    const negative = getColorFromCssVariable('--negative-color');
    const positive = getColorFromCssVariable('--positive-color');
    return getGradient(negative, positive, value);
}