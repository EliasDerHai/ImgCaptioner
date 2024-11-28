
/** simple utility to transform Record into list of tuples via Object.entries while keeping the type information */
export const toEntries = <K extends string | number | symbol, V>(obj: Record<K, V>): [K, V][] => {
    return Object.entries(obj) as [K, V][];
};

/** simple utility to transform Record into list of keys via Object.keys while keeping the type information */
export const toKeys = <K extends string | number | symbol, V>(obj: Record<K, V>): K[] => {
    return Object.keys(obj) as K[];
};

/** simple utility to transform Record into list of tuples via Object.values while keeping the type information */
export const toValues = <K extends string | number | symbol, V>(obj: Record<K, V>): V[] => {
    return Object.values(obj);
};

