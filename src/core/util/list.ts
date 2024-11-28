
export const conditionallyPush = <T>(list: T[], condition: boolean, element: T): void => {
    if (condition) {
        list.push(element);
    }
}
/**
 * produces an array of numbers from 0 to n-1
 * 
 * @param n length of the wanted array 
 * @returns array of numbers
 */
export const getRangeArray = (n: number): number[] => {
    return Array.from({ length: n }, (_, i) => i);
}

export const pickRandom = <T>(list: T[]): T => {
    if (list.length === 0) throw new Error("Cannot pick an item from an empty list.");
    const randomIndex = Math.floor(Math.random() * list.length);
    return list[randomIndex];
}

export const shuffle = <T>(array: T[]): T[] => {
    array = [...array]; // flat copy
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

export const getLast = <T>(array: T[]): T | null => {
    if (array.length < 1) {
        return null;
    }
    return array[array.length - 1];
}

export const rejectNullAndUndefined = <T>(array: (T | null | undefined)[]): T[] =>
    array.filter((element): element is T => element !== null && element !== undefined);



export class EnhancedArray<T> {
    private constructor(private array: T[]) { }

    static readonly from = <T>(array: T[]) => new EnhancedArray(array);

    rejectNullAndUndefined(): EnhancedArray<NonNullable<T>> {
        const filteredArray = this.array.filter((element): element is NonNullable<T> => element !== null && element !== undefined);
        return new EnhancedArray<NonNullable<T>>(filteredArray);
    }

    filter(predicate: (value: T, index: number, array: T[]) => unknown, thisArg?: any): EnhancedArray<T> {
        return EnhancedArray.from(this.array.filter(predicate, thisArg));
    }

    map<U>(callbackfn: (value: T, index: number, array: T[]) => U, thisArg?: any): EnhancedArray<U> {
        return EnhancedArray.from(this.array.map(callbackfn, thisArg));
    }

    forEach(callbackfn: (value: T, index: number, array: T[]) => void, thisArg?: any): void {
        this.array.forEach(callbackfn);
    }

    head(): T | null {
        return this.array.length > 0 ? this.array[0] : null;
    }

    tail(): T[] {
        return this.array.slice(1);
    }

    last(): T | null {
        return getLast(this.array);
    }

    toArray(): NonNullable<T>[] {
        return this.array as NonNullable<T>[];
    }
}


export const unifyToArray = <T>(arg: undefined | null | T | T[]): T[] => {
    return arg
        ? Array.isArray(arg)
            ? arg
            : [arg]
        : [];
};