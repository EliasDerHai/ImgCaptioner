export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends (infer U)[]
    ? DeepPartial<U>[]
    : T[P] extends ReadonlyArray<infer U>
    ? ReadonlyArray<DeepPartial<U>>
    : DeepPartial<T[P]>
};

export const deepCopy = <T>(original: T): T => {
    if (original === null || typeof original !== 'object') return original; // primitive

    if (Array.isArray(original)) {
        return original.map((item) => deepCopy(item)) as unknown as T;
    }

    if (original instanceof Date) {
        return new Date(original.getTime()) as unknown as T;
    }

    const result: any = {};
    for (const key in original) {
        // Check for property in case of object created with a null prototype
        if (Object.prototype.hasOwnProperty.call(original, key)) {
            result[key] = deepCopy((original as any)[key]);
        }
    }

    return result as T;
};

export const mergeDeep = <T>(base: T, update: DeepPartial<T>): T => {
    const result: any = deepCopy(base);

    for (const key in update) {
        if (update[key] !== null && typeof update[key] === 'object' && !Array.isArray(update[key])) {
            result[key] = mergeDeep(result[key] || {}, update[key] as any);
        } else {
            result[key] = update[key];
        }
    }

    return result as T;
};

export const mergeDeepPartials = <T>(base: DeepPartial<T>, update: DeepPartial<T>): DeepPartial<T> => {
    const result: any = deepCopy(base);

    for (const key in update) {
        if (update[key] !== null && typeof update[key] === 'object' && !Array.isArray(update[key])) {
            result[key] = mergeDeep(result[key] || {}, update[key] as any);
        } else {
            result[key] = update[key];
        }
    }

    return result as DeepPartial<T>;
};

export const addDeepNumeric = <T>(base: T, update: DeepPartial<T>): T => {
    const result: any = deepCopy(base);

    for (const key in update) {
        if (typeof update[key] === 'number' && typeof result[key] === 'number') {
            // If both are numbers, add them
            result[key] = result[key] + update[key];
        } else if (update[key] !== null && typeof update[key] === 'object' && !Array.isArray(update[key])) {
            // If the property in update is an object, recursive call to merge
            result[key] = addDeepNumeric(result[key] || {}, update[key] as any);
        } else {
            // Otherwise, set the value from update to result
            result[key] = update[key];
        }
    }

    return result as T;
};


export const addDeepNumericChain = <T>(base: T, ...update: DeepPartial<T>[]): T =>
    update.reduce((curr, patch) => addDeepNumeric(curr, patch), base);

/** opposite of @see Readonly<T> */
export type Mutable<T> = { -readonly [P in keyof T]: T[P] };
