export type Either<T, E> = Success<T> | Failure<E>;

export class Success<T> {
    constructor(private readonly value: T) { }

    get(): T {
        return this.value;
    }

    isSuccess(): this is Success<T> {
        return true;
    }

    isFailure(): this is Failure<any> {
        return false;
    }

    then(onSuccess: (value: T) => void, onFailure: (error: Error) => void): void {
        return onSuccess(this.value);
    }

    onSuccess(onSuccess: (value: T) => void): void {
        onSuccess(this.value);
    }

    onFailure(onFailure: (error: Error) => void): void { }

}

export class Failure<E> {
    constructor(private readonly error: E) { }

    get(): E {
        return this.error;
    }

    isSuccess(): this is Success<any> {
        return false;
    }

    isFailure(): this is Failure<E> {
        return true;
    }

    then(onSuccess: (value: any) => void, onFailure: (error: E) => void): void {
        return onFailure(this.error);
    }

    onSuccess(onSuccess: (value: any) => void): void { }


    onFailure(onFailure: (error: E) => void): void {
        onFailure(this.error);
    }

    static fromString(value: string): Failure<Error> {
        return new Failure(new Error(value));
    }
}

// Try
export type Try<T> = Either<T, Error>;

export const unsafeToTry = <T>(unsafeOperation: () => T): Try<T> => {
    if (!isFunction(unsafeOperation)) throw new Error('Expected argument to be a function');
    try {
        return new Success(unsafeOperation());
    } catch (e: any) {
        return new Failure(e);
    }
}

// Function
const isFunction = (value: any): value is Function => {
    return typeof value === 'function';
}