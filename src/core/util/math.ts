
export const contain = (min: number, value: number, max: number): number => {
    if (min > max) { throw new Error('Invalid limits'); }
    if (value > max) return max;
    if (value < min) return min;
    return value;
};

export const sumTo = (x: number): number => x < 1 ? x : x + sumTo(x - 1);

export const getRandomIntBetween = (min: number, max: number): number => {
    return Math.round(Math.random() * (max - min)) + min;
}

export const coinFlip = (successRateInPercent: number): 'success' | 'failure' => {
    if (successRateInPercent < 0 || successRateInPercent > 100) {
        throw new Error(`Illegal argument - percentage ${successRateInPercent} out of bounds`);
    }
    return Math.random() * 100 <= successRateInPercent ? 'success' : 'failure';
}


export const roundOfBy = (value: number, digits: number = 2): number => Math.round(value * Math.pow(10, digits)) / Math.pow(10, digits);


/**
 * Simple seeded pseudo-random number generator (LCG)
 * @see https://en.wikipedia.org/wiki/Linear_congruential_generator 
 * 
 * only works with big hashed seeds!!
 */
export const seedRandom = (seed: number): () => number => {
    let value = seed;
    return () => {
        // Constants for LCG (from Numerical Recipes)
        const a = 1664525;
        const c = 1013904223;
        const m = 2 ** 32;
        value = (a * value + c) % m;
        return value / m; // Normalize to [0, 1)
    };
};