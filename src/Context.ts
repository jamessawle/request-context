type BoundCallback = (...args: any[]) => void;

export interface Context {
    bind(callbackfn: BoundCallback): void;

    clear(): void;

    delete(key: string): boolean;

    get(key: string): any | undefined;

    has(key: string): boolean;

    set(key: string, value: any): Context;

    readonly size: number;

    toMap(): Map<string, any>;
}
